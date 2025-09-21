const Job = require('../models/Job');
const Course = require('../models/Course');

// SNGCET-focused sample jobs data
const sampleJobs = [
  {
    title: 'Software Engineer - Campus Hire',
    company: {
      name: 'Infosys Limited',
      logo: null,
      website: 'https://infosys.com',
      size: 'large',
      industry: 'Information Technology',
      location: {
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        remote: false
      }
    },
    description: 'Infosys is actively recruiting fresh graduates from SNGCET for our Software Engineer program. Join our comprehensive training program and work on cutting-edge technologies.',
    requirements: {
      skills: [
        { name: 'Java', level: 'intermediate', required: true },
        { name: 'Python', level: 'beginner', required: false },
        { name: 'SQL', level: 'beginner', required: true },
        { name: 'Data Structures', level: 'intermediate', required: true },
        { name: 'Algorithms', level: 'intermediate', required: true }
      ],
      experience: { min: 0, max: 1, unit: 'years' },
      education: { level: 'bachelor', field: 'Engineering', required: true }
    },
    compensation: {
      salary: { min: 350000, max: 450000, currency: 'INR', period: 'yearly' },
      benefits: ['Health Insurance', 'Training Program', 'Career Growth', 'Work-Life Balance']
    },
    jobType: 'full-time',
    workArrangement: 'onsite',
    applicationProcess: {
      applicationUrl: 'https://infosys.com/careers/campus',
      contactEmail: 'campus@infosys.com'
    },
    tags: ['campus-hire', 'fresher', 'software-engineer', 'training'],
    status: 'active',
    sngcetSpecific: true
  },
  {
    title: 'Frontend Developer',
    company: {
      name: 'TechCorp Inc.',
      logo: null,
      website: 'https://techcorp.com',
      size: 'medium',
      industry: 'Technology',
      location: {
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        remote: false
      }
    },
    description: 'We are looking for a skilled Frontend Developer to join our dynamic team. You will be responsible for building user-facing features using modern JavaScript frameworks and ensuring excellent user experience.',
    requirements: {
      skills: [
        { name: 'JavaScript', level: 'intermediate', required: true },
        { name: 'React', level: 'intermediate', required: true },
        { name: 'HTML', level: 'advanced', required: true },
        { name: 'CSS', level: 'advanced', required: true },
        { name: 'TypeScript', level: 'beginner', required: false },
        { name: 'Node.js', level: 'beginner', required: false }
      ],
      experience: { min: 2, max: 5, unit: 'years' },
      education: { level: 'bachelor', field: 'Computer Science', required: false }
    },
    compensation: {
      salary: { min: 80000, max: 120000, currency: 'USD', period: 'yearly' },
      benefits: ['Health Insurance', 'Dental Insurance', '401k', 'Flexible PTO', 'Remote Work Options']
    },
    jobType: 'full-time',
    workArrangement: 'hybrid',
    applicationProcess: {
      applicationUrl: 'https://techcorp.com/careers/frontend-dev',
      contactEmail: 'careers@techcorp.com'
    },
    tags: ['frontend', 'javascript', 'react', 'web-development'],
    status: 'active'
  },
  {
    title: 'Data Analyst - Campus Recruitment',
    company: {
      name: 'Wipro Limited',
      logo: null,
      website: 'https://wipro.com',
      size: 'large',
      industry: 'Information Technology',
      location: {
        city: 'Chennai',
        state: 'Tamil Nadu',
        country: 'India',
        remote: false
      }
    },
    description: 'Wipro is seeking fresh graduates from SNGCET for Data Analyst positions. Work with big data technologies and contribute to data-driven decision making.',
    requirements: {
      skills: [
        { name: 'Python', level: 'intermediate', required: true },
        { name: 'SQL', level: 'intermediate', required: true },
        { name: 'Excel', level: 'advanced', required: true },
        { name: 'Power BI', level: 'beginner', required: false },
        { name: 'Statistics', level: 'intermediate', required: true }
      ],
      experience: { min: 0, max: 1, unit: 'years' },
      education: { level: 'bachelor', field: 'Engineering', required: true }
    },
    compensation: {
      salary: { min: 400000, max: 500000, currency: 'INR', period: 'yearly' },
      benefits: ['Health Insurance', 'Learning Opportunities', 'Flexible Hours', 'Career Growth']
    },
    jobType: 'full-time',
    workArrangement: 'hybrid',
    applicationProcess: {
      applicationUrl: 'https://wipro.com/careers/campus',
      contactEmail: 'campus.recruitment@wipro.com'
    },
    tags: ['campus-hire', 'data-analyst', 'python', 'sql'],
    status: 'active',
    sngcetSpecific: true
  },
  {
    title: 'Mechanical Design Engineer',
    company: {
      name: 'Ashok Leyland',
      logo: null,
      website: 'https://ashokleyland.com',
      size: 'large',
      industry: 'Automotive',
      location: {
        city: 'Chennai',
        state: 'Tamil Nadu',
        country: 'India',
        remote: false
      }
    },
    description: 'Join Ashok Leyland as a Mechanical Design Engineer. Work on innovative automotive designs and contribute to India\'s leading commercial vehicle manufacturer.',
    requirements: {
      skills: [
        { name: 'AutoCAD', level: 'advanced', required: true },
        { name: 'SolidWorks', level: 'intermediate', required: true },
        { name: 'CATIA', level: 'beginner', required: false },
        { name: 'Mechanical Design', level: 'intermediate', required: true },
        { name: 'Manufacturing Processes', level: 'intermediate', required: true }
      ],
      experience: { min: 0, max: 2, unit: 'years' },
      education: { level: 'bachelor', field: 'Mechanical Engineering', required: true }
    },
    compensation: {
      salary: { min: 380000, max: 480000, currency: 'INR', period: 'yearly' },
      benefits: ['Health Insurance', 'PF', 'Training Programs', 'Career Development']
    },
    jobType: 'full-time',
    workArrangement: 'onsite',
    applicationProcess: {
      applicationUrl: 'https://ashokleyland.com/careers',
      contactEmail: 'careers@ashokleyland.com'
    },
    tags: ['mechanical', 'design', 'automotive', 'campus-hire'],
    status: 'active',
    sngcetSpecific: true
  },
  {
    title: 'Data Science Intern',
    company: {
      name: 'DataFlow Analytics',
      logo: null,
      website: 'https://dataflow.com',
      size: 'startup',
      industry: 'Data Analytics',
      location: {
        city: 'New York',
        state: 'NY',
        country: 'USA',
        remote: true
      }
    },
    description: 'Join our data science team as an intern and work on exciting machine learning projects. You will analyze large datasets, build predictive models, and contribute to data-driven decision making.',
    requirements: {
      skills: [
        { name: 'Python', level: 'intermediate', required: true },
        { name: 'Machine Learning', level: 'beginner', required: true },
        { name: 'SQL', level: 'intermediate', required: true },
        { name: 'Pandas', level: 'beginner', required: true },
        { name: 'Scikit-learn', level: 'beginner', required: false },
        { name: 'TensorFlow', level: 'beginner', required: false }
      ],
      experience: { min: 0, max: 1, unit: 'years' },
      education: { level: 'bachelor', field: 'Data Science', required: true }
    },
    compensation: {
      salary: { min: 20, max: 25, currency: 'USD', period: 'hourly' },
      benefits: ['Mentorship Program', 'Learning Budget', 'Flexible Hours']
    },
    jobType: 'internship',
    workArrangement: 'remote',
    duration: { value: 3, unit: 'months' },
    applicationProcess: {
      applicationUrl: 'https://dataflow.com/internships',
      contactEmail: 'internships@dataflow.com'
    },
    tags: ['data-science', 'python', 'machine-learning', 'internship'],
    status: 'active'
  },
  {
    title: 'Full Stack Developer',
    company: {
      name: 'InnovateLab',
      logo: null,
      website: 'https://innovatelab.io',
      size: 'small',
      industry: 'Software Development',
      location: {
        city: 'Austin',
        state: 'TX',
        country: 'USA',
        remote: false
      }
    },
    description: 'We are seeking a talented Full Stack Developer to work on cutting-edge web applications. You will be involved in both frontend and backend development using modern technologies.',
    requirements: {
      skills: [
        { name: 'JavaScript', level: 'advanced', required: true },
        { name: 'React', level: 'advanced', required: true },
        { name: 'Node.js', level: 'intermediate', required: true },
        { name: 'MongoDB', level: 'intermediate', required: true },
        { name: 'Express', level: 'intermediate', required: true },
        { name: 'AWS', level: 'beginner', required: false }
      ],
      experience: { min: 3, max: 7, unit: 'years' },
      education: { level: 'bachelor', field: 'Computer Science', required: false }
    },
    compensation: {
      salary: { min: 90000, max: 140000, currency: 'USD', period: 'yearly' },
      benefits: ['Health Insurance', 'Stock Options', 'Unlimited PTO', 'Learning Budget'],
      equity: { offered: true, range: '0.1% - 0.5%' }
    },
    jobType: 'full-time',
    workArrangement: 'onsite',
    applicationProcess: {
      applicationUrl: 'https://innovatelab.io/careers',
      contactEmail: 'jobs@innovatelab.io'
    },
    tags: ['full-stack', 'javascript', 'react', 'node.js', 'mongodb'],
    status: 'active'
  },
  {
    title: 'UX/UI Designer',
    company: {
      name: 'DesignStudio Pro',
      logo: null,
      website: 'https://designstudio.pro',
      size: 'medium',
      industry: 'Design',
      location: {
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        remote: true
      }
    },
    description: 'Join our creative team as a UX/UI Designer and help create beautiful, user-centered digital experiences. You will work on web and mobile applications for various clients.',
    requirements: {
      skills: [
        { name: 'Figma', level: 'advanced', required: true },
        { name: 'Adobe Creative Suite', level: 'intermediate', required: true },
        { name: 'User Research', level: 'intermediate', required: true },
        { name: 'Prototyping', level: 'intermediate', required: true },
        { name: 'HTML', level: 'beginner', required: false },
        { name: 'CSS', level: 'beginner', required: false }
      ],
      experience: { min: 2, max: 5, unit: 'years' },
      education: { level: 'bachelor', field: 'Design', required: false }
    },
    compensation: {
      salary: { min: 70000, max: 100000, currency: 'USD', period: 'yearly' },
      benefits: ['Health Insurance', 'Creative Software Licenses', 'Flexible Schedule', 'Remote Work']
    },
    jobType: 'full-time',
    workArrangement: 'remote',
    applicationProcess: {
      applicationUrl: 'https://designstudio.pro/careers',
      contactEmail: 'careers@designstudio.pro'
    },
    tags: ['ux-design', 'ui-design', 'figma', 'user-research'],
    status: 'active'
  },
  {
    title: 'DevOps Engineer',
    company: {
      name: 'CloudTech Solutions',
      logo: null,
      website: 'https://cloudtech.solutions',
      size: 'large',
      industry: 'Cloud Computing',
      location: {
        city: 'Seattle',
        state: 'WA',
        country: 'USA',
        remote: false
      }
    },
    description: 'We are looking for a DevOps Engineer to help streamline our development and deployment processes. You will work with containerization, CI/CD pipelines, and cloud infrastructure.',
    requirements: {
      skills: [
        { name: 'Docker', level: 'advanced', required: true },
        { name: 'Kubernetes', level: 'intermediate', required: true },
        { name: 'AWS', level: 'advanced', required: true },
        { name: 'Jenkins', level: 'intermediate', required: true },
        { name: 'Terraform', level: 'intermediate', required: false },
        { name: 'Python', level: 'intermediate', required: false }
      ],
      experience: { min: 4, max: 8, unit: 'years' },
      education: { level: 'bachelor', field: 'Computer Science', required: false }
    },
    compensation: {
      salary: { min: 110000, max: 160000, currency: 'USD', period: 'yearly' },
      benefits: ['Health Insurance', 'Stock Options', '401k Match', 'Professional Development Budget']
    },
    jobType: 'full-time',
    workArrangement: 'hybrid',
    applicationProcess: {
      applicationUrl: 'https://cloudtech.solutions/jobs',
      contactEmail: 'hiring@cloudtech.solutions'
    },
    tags: ['devops', 'docker', 'kubernetes', 'aws', 'ci-cd'],
    status: 'active'
  }
];

// Sample courses data
const sampleCourses = [
  {
    title: 'Complete React Developer Course',
    description: 'Master React from beginner to advanced level. Build real-world projects and learn modern React patterns, hooks, and state management.',
    provider: {
      name: 'CodeAcademy Pro',
      logo: null,
      website: 'https://codeacademy.com',
      rating: 4.8
    },
    instructor: {
      name: 'Sarah Johnson',
      bio: 'Senior React Developer with 8+ years of experience',
      rating: 4.9
    },
    content: {
      duration: { hours: 40, weeks: 8 },
      level: 'intermediate',
      language: 'English',
      subtitles: ['English', 'Spanish', 'French'],
      modules: [
        {
          title: 'React Fundamentals',
          description: 'Learn the basics of React components and JSX',
          duration: 180,
          lessons: [
            { title: 'Introduction to React', type: 'video', duration: 30 },
            { title: 'Your First Component', type: 'video', duration: 45 },
            { title: 'Props and State', type: 'video', duration: 60 },
            { title: 'Practice Exercise', type: 'assignment', duration: 45 }
          ]
        }
      ]
    },
    skills: [
      { name: 'React', level: 'advanced', category: 'technical' },
      { name: 'JavaScript', level: 'intermediate', category: 'technical' },
      { name: 'HTML', level: 'intermediate', category: 'technical' },
      { name: 'CSS', level: 'intermediate', category: 'technical' }
    ],
    prerequisites: ['Basic JavaScript knowledge', 'HTML/CSS fundamentals'],
    learningOutcomes: [
      'Build modern React applications',
      'Understand React hooks and state management',
      'Implement routing and navigation',
      'Deploy React apps to production'
    ],
    pricing: {
      type: 'paid',
      amount: 89.99,
      currency: 'USD',
      discountPrice: 49.99
    },
    enrollment: {
      studentsCount: 15420,
      selfPaced: true
    },
    certification: {
      offered: true,
      type: 'Certificate of Completion',
      accredited: false
    },
    ratings: {
      average: 4.7,
      count: 2341,
      breakdown: {
        five: 1876,
        four: 312,
        three: 98,
        two: 34,
        one: 21
      }
    },
    category: 'Programming',
    subcategory: 'Frontend Development',
    tags: ['react', 'javascript', 'frontend', 'web-development'],
    featured: true,
    trending: true,
    status: 'active'
  },
  {
    title: 'Python for Data Science',
    description: 'Learn Python programming specifically for data science applications. Cover pandas, numpy, matplotlib, and machine learning basics.',
    provider: {
      name: 'DataLearn Institute',
      logo: null,
      website: 'https://datalearn.io',
      rating: 4.6
    },
    instructor: {
      name: 'Dr. Michael Chen',
      bio: 'Data Scientist and Professor with 10+ years in machine learning',
      rating: 4.8
    },
    content: {
      duration: { hours: 60, weeks: 12 },
      level: 'beginner',
      language: 'English',
      subtitles: ['English', 'Chinese', 'Spanish']
    },
    skills: [
      { name: 'Python', level: 'intermediate', category: 'technical' },
      { name: 'Data Analysis', level: 'intermediate', category: 'technical' },
      { name: 'Pandas', level: 'intermediate', category: 'technical' },
      { name: 'Machine Learning', level: 'beginner', category: 'technical' }
    ],
    prerequisites: ['Basic programming knowledge'],
    learningOutcomes: [
      'Analyze data with Python and pandas',
      'Create visualizations with matplotlib',
      'Build basic machine learning models',
      'Clean and preprocess datasets'
    ],
    pricing: {
      type: 'paid',
      amount: 129.99,
      currency: 'USD'
    },
    enrollment: {
      studentsCount: 8750,
      selfPaced: true
    },
    certification: {
      offered: true,
      type: 'Professional Certificate',
      accredited: true
    },
    ratings: {
      average: 4.5,
      count: 1205,
      breakdown: {
        five: 845,
        four: 241,
        three: 78,
        two: 28,
        one: 13
      }
    },
    category: 'Data Science',
    subcategory: 'Python Programming',
    tags: ['python', 'data-science', 'pandas', 'machine-learning'],
    featured: false,
    trending: true,
    status: 'active'
  },
  {
    title: 'Introduction to Machine Learning',
    description: 'Get started with machine learning concepts and algorithms. Learn supervised and unsupervised learning with practical examples.',
    provider: {
      name: 'ML Academy',
      logo: null,
      website: 'https://mlacademy.com',
      rating: 4.7
    },
    content: {
      duration: { hours: 35, weeks: 6 },
      level: 'beginner',
      language: 'English'
    },
    skills: [
      { name: 'Machine Learning', level: 'intermediate', category: 'technical' },
      { name: 'Python', level: 'beginner', category: 'technical' },
      { name: 'Statistics', level: 'beginner', category: 'technical' }
    ],
    pricing: {
      type: 'free'
    },
    enrollment: {
      studentsCount: 25680,
      selfPaced: true
    },
    certification: {
      offered: false
    },
    ratings: {
      average: 4.3,
      count: 3420
    },
    category: 'Machine Learning',
    tags: ['machine-learning', 'ai', 'algorithms', 'python'],
    status: 'active'
  }
];

// Function to seed sample data
const seedSampleData = async () => {
  try {
    console.log('🌱 Seeding sample data...');
    
    // Clear existing data
    await Job.deleteMany({});
    await Course.deleteMany({});
    
    // Insert sample jobs
    const jobs = await Job.insertMany(sampleJobs);
    console.log(`✅ Created ${jobs.length} sample jobs`);
    
    // Insert sample courses
    const courses = await Course.insertMany(sampleCourses);
    console.log(`✅ Created ${courses.length} sample courses`);
    
    console.log('🎉 Sample data seeded successfully!');
    
    return { jobs, courses };
  } catch (error) {
    console.error('❌ Error seeding sample data:', error);
    throw error;
  }
};

module.exports = {
  sampleJobs,
  sampleCourses,
  seedSampleData
};
