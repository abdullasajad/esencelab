const express = require('express');
const Job = require('../models/Job');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get jobs with filtering and matching
// @access  Public (with optional auth for personalization)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      jobType,
      workArrangement,
      location,
      skills,
      company,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { status: 'active' };
    
    if (jobType) query.jobType = jobType;
    if (workArrangement) query.workArrangement = workArrangement;
    if (company) query['company.name'] = new RegExp(company, 'i');
    if (location) {
      query.$or = [
        { 'company.location.city': new RegExp(location, 'i') },
        { 'company.location.state': new RegExp(location, 'i') },
        { 'company.location.country': new RegExp(location, 'i') }
      ];
    }
    
    if (skills) {
      const skillArray = skills.split(',').map(s => s.trim());
      query['requirements.skills.name'] = { $in: skillArray.map(s => new RegExp(s, 'i')) };
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const jobs = await Job.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('postedBy', 'profile.firstName profile.lastName')
      .exec();

    const total = await Job.countDocuments(query);

    // If user is authenticated, calculate match scores
    let jobsWithScores = jobs;
    if (req.user) {
      jobsWithScores = jobs.map(job => {
        const matchScore = job.calculateMatchScore(req.user.skills);
        return {
          ...job.toJSON(),
          matchScore
        };
      });
      
      // Sort by match score if user is logged in and no specific sort is requested
      if (sortBy === 'createdAt' && req.user) {
        jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);
      }
    }

    res.json({
      jobs: jobsWithScores,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      filters: {
        jobTypes: ['full-time', 'part-time', 'internship', 'contract'],
        workArrangements: ['remote', 'hybrid', 'onsite']
      }
    });

  } catch (error) {
    console.error('Jobs fetch error:', error);
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Public (with optional auth for match score)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'profile.firstName profile.lastName');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Increment view count
    job.views += 1;
    await job.save();

    let jobData = job.toJSON();
    
    // Calculate match score if user is authenticated
    if (req.user) {
      jobData.matchScore = job.calculateMatchScore(req.user.skills);
      
      // Check if user has already applied
      const hasApplied = job.applicants.some(
        applicant => applicant.user.toString() === req.user._id.toString()
      );
      jobData.hasApplied = hasApplied;
      
      // Get skill gaps
      const requiredSkills = job.requirements.skills.map(s => s.name.toLowerCase());
      const userSkills = req.user.skills.map(s => s.name.toLowerCase());
      const skillGaps = requiredSkills.filter(skill => !userSkills.includes(skill));
      jobData.skillGaps = skillGaps;
    }

    res.json({ job: jobData });

  } catch (error) {
    console.error('Job fetch error:', error);
    res.status(500).json({ message: 'Error fetching job' });
  }
});

// @route   POST /api/jobs/:id/apply
// @desc    Apply to a job
// @access  Private
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({ message: 'Job is no longer accepting applications' });
    }

    // Check if user already applied
    const existingApplication = job.applicants.find(
      applicant => applicant.user.toString() === req.user._id.toString()
    );

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    // Calculate match score
    const matchScore = job.calculateMatchScore(req.user.skills);

    // Add application
    job.applicants.push({
      user: req.user._id,
      appliedDate: new Date(),
      matchScore,
      status: 'applied'
    });

    job.applications += 1;
    await job.save();

    // Log activity for user
    const user = await User.findById(req.user._id);
    user.activityLog.push({
      action: 'job_applied',
      description: `Applied to ${job.title} at ${job.company.name}`,
      metadata: {
        jobId: job._id,
        jobTitle: job.title,
        company: job.company.name,
        matchScore
      }
    });
    await user.save();

    res.json({
      message: 'Application submitted successfully',
      application: {
        jobId: job._id,
        jobTitle: job.title,
        company: job.company.name,
        appliedDate: new Date(),
        matchScore,
        status: 'applied'
      }
    });

  } catch (error) {
    console.error('Job application error:', error);
    res.status(500).json({ message: 'Error submitting application' });
  }
});

// @route   GET /api/jobs/user/applications
// @desc    Get user's job applications
// @access  Private
router.get('/user/applications', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    // Build aggregation pipeline
    const pipeline = [
      { $match: { 'applicants.user': req.user._id } },
      { $unwind: '$applicants' },
      { $match: { 'applicants.user': req.user._id } }
    ];

    if (status) {
      pipeline.push({ $match: { 'applicants.status': status } });
    }

    pipeline.push(
      { $sort: { 'applicants.appliedDate': -1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
      {
        $project: {
          jobId: '$_id',
          title: 1,
          company: 1,
          jobType: 1,
          workArrangement: 1,
          application: '$applicants',
          createdAt: 1
        }
      }
    );

    const applications = await Job.aggregate(pipeline);
    
    // Get total count
    const totalPipeline = [
      { $match: { 'applicants.user': req.user._id } },
      { $unwind: '$applicants' },
      { $match: { 'applicants.user': req.user._id } }
    ];
    
    if (status) {
      totalPipeline.push({ $match: { 'applicants.status': status } });
    }
    
    totalPipeline.push({ $count: 'total' });
    
    const totalResult = await Job.aggregate(totalPipeline);
    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    res.json({
      applications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      statusCounts: {
        applied: applications.filter(a => a.application.status === 'applied').length,
        reviewing: applications.filter(a => a.application.status === 'reviewing').length,
        interview: applications.filter(a => a.application.status === 'interview').length,
        offer: applications.filter(a => a.application.status === 'offer').length,
        rejected: applications.filter(a => a.application.status === 'rejected').length
      }
    });

  } catch (error) {
    console.error('Applications fetch error:', error);
    res.status(500).json({ message: 'Error fetching applications' });
  }
});

// @route   GET /api/jobs/recommendations
// @desc    Get personalized job recommendations
// @access  Private
router.get('/recommendations', auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const user = req.user;

    // Build recommendation query based on user profile
    const query = { status: 'active' };
    
    // Filter by user preferences
    if (user.preferences.jobTypes?.length > 0) {
      query.jobType = { $in: user.preferences.jobTypes };
    }
    
    if (user.preferences.workEnvironment) {
      query.workArrangement = user.preferences.workEnvironment;
    }
    
    if (user.preferences.industries?.length > 0) {
      query['company.industry'] = { $in: user.preferences.industries };
    }

    // Get jobs and calculate match scores
    const jobs = await Job.find(query)
      .limit(parseInt(limit) * 3) // Get more to filter and sort
      .sort({ createdAt: -1 });

    const jobsWithScores = jobs
      .map(job => ({
        ...job.toJSON(),
        matchScore: job.calculateMatchScore(user.skills)
      }))
      .filter(job => job.matchScore > 20) // Only show jobs with decent match
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, parseInt(limit));

    res.json({
      recommendations: jobsWithScores,
      message: jobsWithScores.length === 0 
        ? 'No recommendations found. Try updating your skills or preferences.'
        : `Found ${jobsWithScores.length} personalized recommendations`
    });

  } catch (error) {
    console.error('Job recommendations error:', error);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
});

module.exports = router;
