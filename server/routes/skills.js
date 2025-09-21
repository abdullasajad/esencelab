const express = require('express');
const User = require('../models/User');
const Job = require('../models/Job');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/skills/analysis
// @desc    Get skill gap analysis
// @access  Private
router.get('/analysis', auth, async (req, res) => {
  try {
    const user = req.user;
    const userSkills = user.skills.map(s => s.name.toLowerCase());
    
    // Get trending skills from job requirements
    const trendingSkills = await Job.aggregate([
      { $match: { status: 'active' } },
      { $unwind: '$requirements.skills' },
      { $group: {
          _id: '$requirements.skills.name',
          count: { $sum: 1 },
          avgLevel: { $avg: { $switch: {
            branches: [
              { case: { $eq: ['$requirements.skills.level', 'beginner'] }, then: 1 },
              { case: { $eq: ['$requirements.skills.level', 'intermediate'] }, then: 2 },
              { case: { $eq: ['$requirements.skills.level', 'advanced'] }, then: 3 },
              { case: { $eq: ['$requirements.skills.level', 'expert'] }, then: 4 }
            ],
            default: 2
          }}}
        }
      },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    
    // Identify skill gaps
    const skillGaps = trendingSkills
      .filter(skill => !userSkills.includes(skill._id.toLowerCase()))
      .map(skill => ({
        name: skill._id,
        demand: skill.count,
        recommendedLevel: skill.avgLevel > 2.5 ? 'advanced' : 'intermediate',
        priority: skill.count > 10 ? 'high' : skill.count > 5 ? 'medium' : 'low'
      }));
    
    res.json({
      analysis: {
        totalSkills: user.skills.length,
        skillGaps: skillGaps.slice(0, 10),
        trendingSkills: trendingSkills.slice(0, 10).map(s => ({
          name: s._id,
          demand: s.count,
          hasSkill: userSkills.includes(s._id.toLowerCase())
        }))
      }
    });
    
  } catch (error) {
    console.error('Skill analysis error:', error);
    res.status(500).json({ message: 'Error analyzing skills' });
  }
});

module.exports = router;
