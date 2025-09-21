const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user._id);
    
    // Update profile fields
    if (updates.profile) {
      Object.keys(updates.profile).forEach(key => {
        if (updates.profile[key] !== undefined) {
          user.profile[key] = updates.profile[key];
        }
      });
    }
    
    // Update preferences
    if (updates.preferences) {
      Object.keys(updates.preferences).forEach(key => {
        if (updates.preferences[key] !== undefined) {
          user.preferences[key] = updates.preferences[key];
        }
      });
    }
    
    // Update career goals
    if (updates.careerGoals) {
      user.careerGoals = { ...user.careerGoals, ...updates.careerGoals };
    }
    
    user.activityLog.push({
      action: 'profile_updated',
      description: 'User profile updated successfully'
    });
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        profile: user.profile,
        preferences: user.preferences,
        careerGoals: user.careerGoals
      }
    });
    
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// @route   POST /api/users/skills
// @desc    Add or update user skills
// @access  Private
router.post('/skills', auth, async (req, res) => {
  try {
    const { skills } = req.body;
    
    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: 'Skills must be an array' });
    }
    
    const user = await User.findById(req.user._id);
    
    skills.forEach(newSkill => {
      const existingSkillIndex = user.skills.findIndex(s => 
        s.name.toLowerCase() === newSkill.name.toLowerCase()
      );
      
      if (existingSkillIndex >= 0) {
        // Update existing skill
        user.skills[existingSkillIndex] = {
          ...user.skills[existingSkillIndex],
          ...newSkill,
          name: newSkill.name // Ensure name is updated
        };
      } else {
        // Add new skill
        user.skills.push({
          ...newSkill,
          addedDate: new Date()
        });
      }
    });
    
    user.activityLog.push({
      action: 'skills_updated',
      description: `Updated ${skills.length} skill(s)`,
      metadata: { skillsUpdated: skills.map(s => s.name) }
    });
    
    await user.save();
    
    res.json({
      message: 'Skills updated successfully',
      skills: user.skills
    });
    
  } catch (error) {
    console.error('Skills update error:', error);
    res.status(500).json({ message: 'Error updating skills' });
  }
});

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Calculate profile completion
    const profileFields = [
      user.profile.phone,
      user.profile.university?.name,
      user.profile.bio,
      user.skills.length > 0,
      user.resume?.fileName,
      user.careerGoals?.shortTerm?.length > 0
    ];
    
    const completedFields = profileFields.filter(field => !!field).length;
    const profileCompletion = Math.round((completedFields / profileFields.length) * 100);
    
    // Recent activities (last 5)
    const recentActivities = user.activityLog
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);
    
    // Skills by category
    const skillsByCategory = user.skills.reduce((acc, skill) => {
      const category = skill.category || 'other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    }, {});
    
    const dashboardData = {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profile.profilePicture
      },
      stats: {
        profileCompletion,
        totalSkills: user.skills.length,
        hasResume: !!user.resume?.fileName,
        memberSince: user.createdAt,
        lastActive: user.lastLogin
      },
      skillsByCategory,
      recentActivities,
      quickActions: [
        {
          title: 'Upload Resume',
          description: 'Get personalized job matches',
          action: 'upload-resume',
          completed: !!user.resume?.fileName
        },
        {
          title: 'Complete Profile',
          description: 'Improve your visibility',
          action: 'complete-profile',
          completed: profileCompletion >= 80
        },
        {
          title: 'Set Career Goals',
          description: 'Define your career path',
          action: 'set-goals',
          completed: user.careerGoals?.shortTerm?.length > 0
        }
      ]
    };
    
    res.json(dashboardData);
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

module.exports = router;
