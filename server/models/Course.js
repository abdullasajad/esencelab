const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  provider: {
    name: {
      type: String,
      required: true
    },
    logo: String,
    website: String,
    rating: {
      type: Number,
      min: 0,
      max: 5
    }
  },
  instructor: {
    name: String,
    bio: String,
    avatar: String,
    rating: Number
  },
  content: {
    duration: {
      hours: Number,
      weeks: Number
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      required: true
    },
    language: {
      type: String,
      default: 'English'
    },
    subtitles: [String],
    modules: [{
      title: String,
      description: String,
      duration: Number, // in minutes
      lessons: [{
        title: String,
        type: {
          type: String,
          enum: ['video', 'reading', 'quiz', 'assignment', 'project']
        },
        duration: Number,
        completed: {
          type: Boolean,
          default: false
        }
      }]
    }]
  },
  skills: [{
    name: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    category: {
      type: String,
      enum: ['technical', 'soft', 'language', 'certification']
    }
  }],
  prerequisites: [String],
  learningOutcomes: [String],
  pricing: {
    type: {
      type: String,
      enum: ['free', 'paid', 'subscription', 'one-time'],
      required: true
    },
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    discountPrice: Number,
    subscriptionPeriod: {
      type: String,
      enum: ['monthly', 'yearly', 'lifetime']
    }
  },
  enrollment: {
    studentsCount: {
      type: Number,
      default: 0
    },
    maxStudents: Number,
    startDate: Date,
    endDate: Date,
    selfPaced: {
      type: Boolean,
      default: true
    }
  },
  certification: {
    offered: {
      type: Boolean,
      default: false
    },
    type: String,
    accredited: Boolean,
    validityPeriod: String
  },
  resources: {
    materials: [String],
    downloadable: Boolean,
    projects: Number,
    assignments: Number,
    quizzes: Number
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    breakdown: {
      five: { type: Number, default: 0 },
      four: { type: Number, default: 0 },
      three: { type: Number, default: 0 },
      two: { type: Number, default: 0 },
      one: { type: Number, default: 0 }
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    helpful: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  category: {
    type: String,
    required: true
  },
  subcategory: String,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'coming-soon', 'archived'],
    default: 'active'
  },
  externalUrl: String,
  affiliateLink: String,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ 'provider.name': 1 });
courseSchema.index({ 'content.level': 1 });
courseSchema.index({ 'skills.name': 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ 'pricing.type': 1 });
courseSchema.index({ 'ratings.average': -1 });
courseSchema.index({ featured: 1 });
courseSchema.index({ trending: 1 });

// Virtual for completion percentage
courseSchema.virtual('completionRate').get(function() {
  if (!this.content.modules || this.content.modules.length === 0) return 0;
  
  let totalLessons = 0;
  let completedLessons = 0;
  
  this.content.modules.forEach(module => {
    if (module.lessons) {
      totalLessons += module.lessons.length;
      completedLessons += module.lessons.filter(lesson => lesson.completed).length;
    }
  });
  
  return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
});

// Method to calculate relevance score for user skills
courseSchema.methods.calculateRelevanceScore = function(userSkills, skillGaps) {
  let score = 0;
  
  // Check if course teaches skills the user lacks
  this.skills.forEach(courseSkill => {
    const hasSkill = userSkills.some(userSkill => 
      userSkill.name.toLowerCase() === courseSkill.name.toLowerCase()
    );
    
    const isSkillGap = skillGaps.some(gap => 
      gap.toLowerCase() === courseSkill.name.toLowerCase()
    );
    
    if (isSkillGap) {
      score += 20; // High score for addressing skill gaps
    } else if (!hasSkill) {
      score += 10; // Medium score for new skills
    } else {
      // Check if course can improve existing skill level
      const userSkill = userSkills.find(us => 
        us.name.toLowerCase() === courseSkill.name.toLowerCase()
      );
      
      const levelOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
      const userLevelIndex = levelOrder.indexOf(userSkill.level);
      const courseLevelIndex = levelOrder.indexOf(courseSkill.level);
      
      if (courseLevelIndex > userLevelIndex) {
        score += 5; // Small score for skill improvement
      }
    }
  });
  
  return score;
};

// Method to update ratings
courseSchema.methods.updateRatings = function() {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
    return;
  }
  
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.ratings.average = Number((totalRating / this.reviews.length).toFixed(1));
  this.ratings.count = this.reviews.length;
  
  // Update breakdown
  this.ratings.breakdown = {
    five: this.reviews.filter(r => r.rating === 5).length,
    four: this.reviews.filter(r => r.rating === 4).length,
    three: this.reviews.filter(r => r.rating === 3).length,
    two: this.reviews.filter(r => r.rating === 2).length,
    one: this.reviews.filter(r => r.rating === 1).length
  };
};

// Ensure virtual fields are serialized
courseSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);
