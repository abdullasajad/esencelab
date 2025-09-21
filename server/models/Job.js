const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    logo: String,
    website: String,
    size: {
      type: String,
      enum: ['startup', 'small', 'medium', 'large', 'enterprise']
    },
    industry: String,
    location: {
      city: String,
      state: String,
      country: String,
      remote: {
        type: Boolean,
        default: false
      }
    }
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    skills: [{
      name: String,
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert']
      },
      required: {
        type: Boolean,
        default: true
      }
    }],
    experience: {
      min: Number,
      max: Number,
      unit: {
        type: String,
        enum: ['months', 'years'],
        default: 'years'
      }
    },
    education: {
      level: {
        type: String,
        enum: ['high-school', 'associate', 'bachelor', 'master', 'phd', 'none']
      },
      field: String,
      required: {
        type: Boolean,
        default: false
      }
    },
    certifications: [String],
    languages: [String]
  },
  compensation: {
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD'
      },
      period: {
        type: String,
        enum: ['hourly', 'monthly', 'yearly'],
        default: 'yearly'
      }
    },
    benefits: [String],
    equity: {
      offered: Boolean,
      range: String
    }
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'contract', 'temporary'],
    required: true
  },
  workArrangement: {
    type: String,
    enum: ['remote', 'hybrid', 'onsite'],
    default: 'onsite'
  },
  applicationDeadline: Date,
  startDate: Date,
  duration: {
    value: Number,
    unit: {
      type: String,
      enum: ['weeks', 'months', 'years']
    }
  },
  applicationProcess: {
    steps: [String],
    applicationUrl: String,
    contactEmail: String,
    additionalInstructions: String
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'closed', 'draft'],
    default: 'active'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  applicants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['applied', 'reviewing', 'interview', 'offer', 'rejected', 'withdrawn'],
      default: 'applied'
    },
    matchScore: Number,
    notes: String
  }],
  views: {
    type: Number,
    default: 0
  },
  applications: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ 'company.name': 1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ 'requirements.skills.name': 1 });
jobSchema.index({ 'company.location.city': 1 });
jobSchema.index({ createdAt: -1 });

// Virtual for application count
jobSchema.virtual('applicationCount').get(function() {
  return this.applicants.length;
});

// Method to calculate match score for a user
jobSchema.methods.calculateMatchScore = function(userSkills) {
  const requiredSkills = this.requirements.skills.filter(skill => skill.required);
  const optionalSkills = this.requirements.skills.filter(skill => !skill.required);
  
  let score = 0;
  let maxScore = 0;
  
  // Calculate score for required skills (weighted more heavily)
  requiredSkills.forEach(reqSkill => {
    maxScore += 10;
    const userSkill = userSkills.find(us => 
      us.name.toLowerCase() === reqSkill.name.toLowerCase()
    );
    
    if (userSkill) {
      const levelScores = { beginner: 2.5, intermediate: 5, advanced: 7.5, expert: 10 };
      const reqLevelScore = levelScores[reqSkill.level] || 5;
      const userLevelScore = levelScores[userSkill.level] || 2.5;
      
      score += Math.min(userLevelScore, reqLevelScore);
    }
  });
  
  // Calculate score for optional skills
  optionalSkills.forEach(optSkill => {
    maxScore += 5;
    const userSkill = userSkills.find(us => 
      us.name.toLowerCase() === optSkill.name.toLowerCase()
    );
    
    if (userSkill) {
      const levelScores = { beginner: 1.25, intermediate: 2.5, advanced: 3.75, expert: 5 };
      const userLevelScore = levelScores[userSkill.level] || 1.25;
      score += userLevelScore;
    }
  });
  
  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
};

// Ensure virtual fields are serialized
jobSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);
