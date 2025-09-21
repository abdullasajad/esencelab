const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/resumes';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `resume-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Parse resume text content
const parseResumeContent = async (filePath, fileType) => {
  try {
    let text = '';
    
    if (fileType === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (fileType === '.docx' || fileType === '.doc') {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    }
    
    return text;
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error('Failed to parse resume content');
  }
};

// Extract structured data from resume text using AI/NLP
const extractResumeData = (text) => {
  // This is a simplified extraction. In production, you'd use:
  // - OpenAI API for better parsing
  // - Named Entity Recognition (NER)
  // - Regular expressions for specific patterns
  
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  const extractedData = {
    experience: [],
    education: [],
    projects: [],
    certifications: []
  };
  
  // Simple keyword-based extraction
  const skillKeywords = [
    'javascript', 'python', 'java', 'react', 'node.js', 'html', 'css',
    'sql', 'mongodb', 'express', 'angular', 'vue', 'typescript', 'php',
    'c++', 'c#', 'ruby', 'go', 'swift', 'kotlin', 'flutter', 'docker',
    'kubernetes', 'aws', 'azure', 'gcp', 'git', 'linux', 'machine learning',
    'data science', 'artificial intelligence', 'blockchain', 'cybersecurity'
  ];
  
  const skills = [];
  const textLower = text.toLowerCase();
  
  skillKeywords.forEach(skill => {
    if (textLower.includes(skill.toLowerCase())) {
      skills.push({
        name: skill,
        level: 'intermediate', // Default level
        category: 'technical'
      });
    }
  });
  
  // Extract email
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : null;
  
  // Extract phone
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const phoneMatch = text.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0] : null;
  
  // Extract years of experience (simple pattern)
  const expRegex = /(\d+)\+?\s*(years?|yrs?)\s*(of\s*)?(experience|exp)/i;
  const expMatch = text.match(expRegex);
  const yearsOfExperience = expMatch ? parseInt(expMatch[1]) : 0;
  
  return {
    skills,
    contact: { email, phone },
    yearsOfExperience,
    ...extractedData
  };
};

// @route   POST /api/resume/upload
// @desc    Upload and parse resume
// @access  Private
router.post('/upload', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    const filePath = req.file.path;
    
    // Parse resume content
    const resumeText = await parseResumeContent(filePath, fileExt);
    const parsedData = extractResumeData(resumeText);
    
    // Update user with resume data
    const user = await User.findById(req.user._id);
    
    // Remove old resume file if exists
    if (user.resume?.filePath && fs.existsSync(user.resume.filePath)) {
      fs.unlinkSync(user.resume.filePath);
    }
    
    // Update user resume information
    user.resume = {
      fileName: req.file.originalname,
      filePath: filePath,
      uploadDate: new Date(),
      parsedData: parsedData
    };
    
    // Update user skills if new skills found
    if (parsedData.skills && parsedData.skills.length > 0) {
      parsedData.skills.forEach(newSkill => {
        const existingSkill = user.skills.find(s => 
          s.name.toLowerCase() === newSkill.name.toLowerCase()
        );
        
        if (!existingSkill) {
          user.skills.push({
            ...newSkill,
            addedDate: new Date()
          });
        }
      });
    }
    
    // Update contact info if found
    if (parsedData.contact?.phone && !user.profile.phone) {
      user.profile.phone = parsedData.contact.phone;
    }
    
    // Log activity
    user.activityLog.push({
      action: 'resume_uploaded',
      description: `Resume "${req.file.originalname}" uploaded and parsed successfully`,
      metadata: {
        fileName: req.file.originalname,
        skillsExtracted: parsedData.skills?.length || 0
      }
    });
    
    await user.save();
    
    res.json({
      message: 'Resume uploaded and parsed successfully',
      data: {
        fileName: req.file.originalname,
        uploadDate: user.resume.uploadDate,
        skillsExtracted: parsedData.skills?.length || 0,
        skills: parsedData.skills || [],
        yearsOfExperience: parsedData.yearsOfExperience
      }
    });
    
  } catch (error) {
    console.error('Resume upload error:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      message: error.message || 'Error uploading resume' 
    });
  }
});

// @route   GET /api/resume/download
// @desc    Download user's resume
// @access  Private
router.get('/download', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.resume?.filePath || !fs.existsSync(user.resume.filePath)) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    res.download(user.resume.filePath, user.resume.fileName);
    
  } catch (error) {
    console.error('Resume download error:', error);
    res.status(500).json({ message: 'Error downloading resume' });
  }
});

// @route   DELETE /api/resume
// @desc    Delete user's resume
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.resume?.filePath) {
      return res.status(404).json({ message: 'No resume found to delete' });
    }
    
    // Delete file from filesystem
    if (fs.existsSync(user.resume.filePath)) {
      fs.unlinkSync(user.resume.filePath);
    }
    
    // Remove resume data from user
    user.resume = undefined;
    
    // Log activity
    user.activityLog.push({
      action: 'resume_deleted',
      description: 'Resume deleted successfully'
    });
    
    await user.save();
    
    res.json({ message: 'Resume deleted successfully' });
    
  } catch (error) {
    console.error('Resume delete error:', error);
    res.status(500).json({ message: 'Error deleting resume' });
  }
});

// @route   GET /api/resume/analysis
// @desc    Get resume analysis and suggestions
// @access  Private
router.get('/analysis', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.resume?.parsedData) {
      return res.status(404).json({ message: 'No resume data found for analysis' });
    }
    
    const analysis = {
      skillsCount: user.skills.length,
      experienceYears: user.resume.parsedData.yearsOfExperience || 0,
      completeness: {
        hasContact: !!(user.profile.phone && user.email),
        hasExperience: user.resume.parsedData.experience?.length > 0,
        hasEducation: user.resume.parsedData.education?.length > 0,
        hasProjects: user.resume.parsedData.projects?.length > 0,
        hasSkills: user.skills.length > 0
      },
      suggestions: []
    };
    
    // Generate suggestions based on completeness
    if (!analysis.completeness.hasContact) {
      analysis.suggestions.push({
        type: 'contact',
        message: 'Add your phone number to complete your contact information',
        priority: 'high'
      });
    }
    
    if (analysis.skillsCount < 5) {
      analysis.suggestions.push({
        type: 'skills',
        message: 'Add more skills to improve your profile visibility',
        priority: 'medium'
      });
    }
    
    if (!analysis.completeness.hasProjects) {
      analysis.suggestions.push({
        type: 'projects',
        message: 'Add projects to showcase your practical experience',
        priority: 'medium'
      });
    }
    
    // Calculate overall score
    const completenessScore = Object.values(analysis.completeness)
      .reduce((acc, val) => acc + (val ? 1 : 0), 0);
    analysis.overallScore = Math.round((completenessScore / 5) * 100);
    
    res.json({
      message: 'Resume analysis completed',
      analysis
    });
    
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ message: 'Error analyzing resume' });
  }
});

module.exports = router;
