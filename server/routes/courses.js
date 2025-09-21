const express = require('express');
const Course = require('../models/Course');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/courses
// @desc    Get courses with filtering
// @access  Public (with optional auth for personalization)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      level,
      category,
      provider,
      pricing,
      search,
      sortBy = 'ratings.average',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { status: 'active' };
    
    if (level) query['content.level'] = level;
    if (category) query.category = category;
    if (provider) query['provider.name'] = new RegExp(provider, 'i');
    if (pricing) query['pricing.type'] = pricing;
    
    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const courses = await Course.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Course.countDocuments(query);

    // If user is authenticated, calculate relevance scores
    let coursesWithScores = courses;
    if (req.user) {
      const userSkills = req.user.skills || [];
      const skillGaps = []; // You could implement skill gap detection here
      
      coursesWithScores = courses.map(course => {
        const relevanceScore = course.calculateRelevanceScore(userSkills, skillGaps);
        return {
          ...course.toJSON(),
          relevanceScore
        };
      });
    }

    res.json({
      courses: coursesWithScores,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      filters: {
        levels: ['beginner', 'intermediate', 'advanced', 'expert'],
        pricingTypes: ['free', 'paid', 'subscription'],
        categories: ['Programming', 'Data Science', 'Design', 'Business', 'Marketing']
      }
    });

  } catch (error) {
    console.error('Courses fetch error:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// @route   GET /api/courses/recommendations
// @desc    Get personalized course recommendations
// @access  Private
router.get('/recommendations', auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const user = req.user;

    // Get courses and calculate relevance scores
    const courses = await Course.find({ status: 'active' })
      .limit(parseInt(limit) * 2) // Get more to filter and sort
      .sort({ 'ratings.average': -1 });

    const userSkills = user.skills || [];
    const skillGaps = []; // Implement skill gap detection

    const coursesWithScores = courses
      .map(course => ({
        ...course.toJSON(),
        relevanceScore: course.calculateRelevanceScore(userSkills, skillGaps)
      }))
      .filter(course => course.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, parseInt(limit));

    res.json({
      recommendations: coursesWithScores,
      message: coursesWithScores.length === 0 
        ? 'No recommendations found. Try updating your skills or career goals.'
        : `Found ${coursesWithScores.length} personalized recommendations`
    });

  } catch (error) {
    console.error('Course recommendations error:', error);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
});

module.exports = router;
