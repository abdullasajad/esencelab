const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/progress/timeline
// @desc    Get user progress timeline
// @access  Private
router.get('/timeline', auth, async (req, res) => {
  try {
    const user = req.user;
    
    // Get activities sorted by date
    const timeline = user.activityLog
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 50)
      .map(activity => ({
        id: activity._id,
        action: activity.action,
        description: activity.description,
        timestamp: activity.timestamp,
        metadata: activity.metadata,
        type: getActivityType(activity.action)
      }));

    // Group by date
    const groupedTimeline = timeline.reduce((acc, activity) => {
      const date = new Date(activity.timestamp).toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(activity);
      return acc;
    }, {});

    res.json({
      timeline: groupedTimeline,
      totalActivities: user.activityLog.length
    });

  } catch (error) {
    console.error('Timeline fetch error:', error);
    res.status(500).json({ message: 'Error fetching timeline' });
  }
});

// @route   GET /api/progress/stats
// @desc    Get user progress statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const user = req.user;
    
    // Calculate various statistics
    const stats = {
      profile: {
        completionPercentage: calculateProfileCompletion(user),
        lastUpdated: getLastProfileUpdate(user)
      },
      skills: {
        total: user.skills.length,
        byCategory: groupSkillsByCategory(user.skills),
        recentlyAdded: user.skills
          .filter(skill => skill.addedDate > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
          .length
      },
      activities: {
        thisWeek: user.activityLog.filter(activity => 
          activity.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length,
        thisMonth: user.activityLog.filter(activity => 
          activity.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length,
        total: user.activityLog.length
      },
      goals: {
        shortTerm: user.careerGoals?.shortTerm?.length || 0,
        longTerm: user.careerGoals?.longTerm?.length || 0,
        targetRoles: user.careerGoals?.targetRoles?.length || 0
      }
    };

    res.json({ stats });

  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

// Helper functions
function getActivityType(action) {
  const typeMap = {
    'user_registered': 'account',
    'user_login': 'account',
    'profile_updated': 'profile',
    'skills_updated': 'skills',
    'resume_uploaded': 'resume',
    'job_applied': 'job',
    'course_enrolled': 'learning'
  };
  return typeMap[action] || 'other';
}

function calculateProfileCompletion(user) {
  const fields = [
    user.profile.phone,
    user.profile.university?.name,
    user.profile.bio,
    user.skills.length > 0,
    user.resume?.fileName,
    user.careerGoals?.shortTerm?.length > 0
  ];
  
  const completed = fields.filter(field => !!field).length;
  return Math.round((completed / fields.length) * 100);
}

function getLastProfileUpdate(user) {
  const profileUpdates = user.activityLog.filter(activity => 
    activity.action === 'profile_updated'
  );
  
  return profileUpdates.length > 0 
    ? profileUpdates[profileUpdates.length - 1].timestamp 
    : user.createdAt;
}

function groupSkillsByCategory(skills) {
  return skills.reduce((acc, skill) => {
    const category = skill.category || 'other';
    if (!acc[category]) acc[category] = 0;
    acc[category]++;
    return acc;
  }, {});
}

module.exports = router;
