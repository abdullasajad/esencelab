const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    dateOfBirth: {
      type: Date
    },
    location: {
      city: String,
      state: String,
      country: String
    },
    university: {
      name: String,
      degree: String,
      major: String,
      graduationYear: Number,
      gpa: Number
    },
    bio: {
      type: String,
      maxlength: 500
    },
    profilePicture: {
      type: String
    }
  },
  preferences: {
    jobTypes: [{
      type: String,
      enum: ['full-time', 'part-time', 'internship', 'contract', 'remote']
    }],
    industries: [String],
    locations: [String],
    salaryRange: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    workEnvironment: {
      type: String,
      enum: ['remote', 'hybrid', 'onsite', 'flexible']
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      jobAlerts: {
        type: Boolean,
        default: true
      },
      courseRecommendations: {
        type: Boolean,
        default: true
      }
    }
  },
  skills: [{
    name: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner'
    },
    category: {
      type: String,
      enum: ['technical', 'soft', 'language', 'certification']
    },
    verified: {
      type: Boolean,
      default: false
    },
    addedDate: {
      type: Date,
      default: Date.now
    }
  }],
  resume: {
    fileName: String,
    filePath: String,
    uploadDate: Date,
    parsedData: {
      experience: [{
        company: String,
        position: String,
        startDate: Date,
        endDate: Date,
        description: String,
        skills: [String]
      }],
      education: [{
        institution: String,
        degree: String,
        field: String,
        startDate: Date,
        endDate: Date,
        gpa: Number
      }],
      projects: [{
        name: String,
        description: String,
        technologies: [String],
        url: String,
        startDate: Date,
        endDate: Date
      }],
      certifications: [{
        name: String,
        issuer: String,
        issueDate: Date,
        expiryDate: Date,
        credentialId: String
      }]
    }
  },
  careerGoals: {
    shortTerm: [String],
    longTerm: [String],
    targetRoles: [String],
    targetCompanies: [String],
    desiredSkills: [String]
  },
  activityLog: [{
    action: {
      type: String,
      required: true
    },
    description: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: mongoose.Schema.Types.Mixed
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ 'skills.name': 1 });
userSchema.index({ 'preferences.industries': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Get skill names array
userSchema.virtual('skillNames').get(function() {
  return this.skills.map(skill => skill.name);
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
