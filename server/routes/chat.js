const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/chat/message
// @desc    Send message to AI chatbot
// @access  Private
router.post('/message', auth, async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Simple chatbot responses (in production, integrate with OpenAI or similar)
    const response = generateChatbotResponse(message, req.user, context);
    
    res.json({
      response: response.text,
      suggestions: response.suggestions || [],
      actions: response.actions || []
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Error processing chat message' });
  }
});

// Simple chatbot logic (replace with AI service in production)
function generateChatbotResponse(message, user, context) {
  const messageLower = message.toLowerCase();
  
  // Greeting responses
  if (messageLower.includes('hello') || messageLower.includes('hi')) {
    return {
      text: `Hello ${user.profile.firstName}! I'm here to help you with your career journey. How can I assist you today?`,
      suggestions: [
        'Help me find jobs',
        'Analyze my skills',
        'Recommend courses',
        'Update my profile'
      ]
    };
  }
  
  // Job-related queries
  if (messageLower.includes('job') || messageLower.includes('career')) {
    return {
      text: "I can help you find the perfect job opportunities! Based on your skills and preferences, I can show you personalized job matches.",
      suggestions: [
        'Show me job recommendations',
        'Help me improve my resume',
        'What skills should I learn?'
      ],
      actions: [
        { type: 'navigate', target: '/opportunities', label: 'View Jobs' }
      ]
    };
  }
  
  // Skills-related queries
  if (messageLower.includes('skill') || messageLower.includes('learn')) {
    return {
      text: "Great question! I can analyze your current skills and identify gaps in the market. This helps you focus on learning the most valuable skills for your career.",
      suggestions: [
        'Analyze my skill gaps',
        'Recommend courses',
        'Show trending skills'
      ],
      actions: [
        { type: 'navigate', target: '/skills', label: 'View Skills Analysis' }
      ]
    };
  }
  
  // Resume-related queries
  if (messageLower.includes('resume') || messageLower.includes('cv')) {
    const hasResume = !!user.resume?.fileName;
    
    if (hasResume) {
      return {
        text: "I see you've uploaded your resume! I can help you analyze it and suggest improvements to make it more attractive to employers.",
        suggestions: [
          'Analyze my resume',
          'Get resume tips',
          'Update my skills from resume'
        ]
      };
    } else {
      return {
        text: "I notice you haven't uploaded your resume yet. Uploading your resume helps me provide better job matches and skill analysis!",
        suggestions: [
          'Upload my resume',
          'Learn about resume tips',
          'See what information I need'
        ],
        actions: [
          { type: 'navigate', target: '/profile', label: 'Upload Resume' }
        ]
      };
    }
  }
  
  // Course-related queries
  if (messageLower.includes('course') || messageLower.includes('training')) {
    return {
      text: "I can recommend personalized courses based on your skill gaps and career goals. These courses are from trusted providers and will help boost your career prospects.",
      suggestions: [
        'Show course recommendations',
        'Find free courses',
        'Courses for my skill gaps'
      ],
      actions: [
        { type: 'navigate', target: '/courses', label: 'Browse Courses' }
      ]
    };
  }
  
  // Progress-related queries
  if (messageLower.includes('progress') || messageLower.includes('track')) {
    return {
      text: "Let me show you your career progress! I track your activities, skill development, and achievements to help you see how far you've come.",
      suggestions: [
        'Show my progress',
        'View my timeline',
        'See my achievements'
      ],
      actions: [
        { type: 'navigate', target: '/track', label: 'View Progress' }
      ]
    };
  }
  
  // Default response
  return {
    text: "I'm here to help you with your career development! I can assist with job searching, skill analysis, course recommendations, and tracking your progress.",
    suggestions: [
      'Find me jobs',
      'Analyze my skills',
      'Recommend courses',
      'Show my progress',
      'Help with my resume'
    ]
  };
}

module.exports = router;
