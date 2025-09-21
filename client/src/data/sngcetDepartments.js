// SNGCET Department-specific data and career paths
export const sngcetDepartments = [
  {
    id: 'cse',
    name: 'Computer Science and Engineering',
    shortName: 'CSE',
    icon: '💻',
    description: 'Leading the digital transformation with cutting-edge computer science education',
    careerPaths: [
      {
        title: 'Software Engineer',
        companies: ['Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS', 'Wipro'],
        avgSalary: { min: 400000, max: 1200000, currency: 'INR' },
        skills: ['Java', 'Python', 'JavaScript', 'React', 'Node.js', 'SQL'],
        growth: 'high'
      },
      {
        title: 'Data Scientist',
        companies: ['Netflix', 'Uber', 'Flipkart', 'Zomato', 'Analytics Vidhya'],
        avgSalary: { min: 600000, max: 1500000, currency: 'INR' },
        skills: ['Python', 'R', 'Machine Learning', 'Statistics', 'SQL', 'Tableau'],
        growth: 'very-high'
      },
      {
        title: 'DevOps Engineer',
        companies: ['AWS', 'Docker', 'Kubernetes', 'Red Hat', 'IBM'],
        avgSalary: { min: 500000, max: 1300000, currency: 'INR' },
        skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Linux', 'Python'],
        growth: 'high'
      }
    ],
    topRecruiters: ['Infosys', 'TCS', 'Wipro', 'Cognizant', 'Accenture', 'Google', 'Microsoft']
  },
  {
    id: 'ece',
    name: 'Electronics and Communication Engineering',
    shortName: 'ECE',
    icon: '📡',
    description: 'Innovating in electronics, telecommunications, and embedded systems',
    careerPaths: [
      {
        title: 'Embedded Systems Engineer',
        companies: ['Intel', 'Qualcomm', 'Broadcom', 'Texas Instruments', 'Bosch'],
        avgSalary: { min: 450000, max: 1100000, currency: 'INR' },
        skills: ['C/C++', 'Embedded C', 'RTOS', 'ARM', 'PCB Design', 'MATLAB'],
        growth: 'high'
      },
      {
        title: 'VLSI Design Engineer',
        companies: ['Intel', 'AMD', 'NVIDIA', 'Cadence', 'Synopsys'],
        avgSalary: { min: 500000, max: 1400000, currency: 'INR' },
        skills: ['Verilog', 'VHDL', 'SystemVerilog', 'Cadence', 'Synopsys', 'ASIC'],
        growth: 'very-high'
      },
      {
        title: 'Telecommunications Engineer',
        companies: ['Ericsson', 'Nokia', 'Huawei', 'Airtel', 'Jio', 'BSNL'],
        avgSalary: { min: 400000, max: 900000, currency: 'INR' },
        skills: ['RF Design', '5G', 'Network Protocols', 'Signal Processing', 'MATLAB'],
        growth: 'medium'
      }
    ],
    topRecruiters: ['Intel', 'Qualcomm', 'Bosch', 'L&T', 'Siemens', 'Honeywell']
  },
  {
    id: 'mech',
    name: 'Mechanical Engineering',
    shortName: 'MECH',
    icon: '⚙️',
    description: 'Engineering excellence in design, manufacturing, and automation',
    careerPaths: [
      {
        title: 'Design Engineer',
        companies: ['Ashok Leyland', 'Mahindra', 'Tata Motors', 'Bajaj Auto', 'TVS'],
        avgSalary: { min: 350000, max: 800000, currency: 'INR' },
        skills: ['AutoCAD', 'SolidWorks', 'CATIA', 'ANSYS', 'Manufacturing', 'GD&T'],
        growth: 'medium'
      },
      {
        title: 'Production Engineer',
        companies: ['L&T', 'Godrej', 'Kirloskar', 'Thermax', 'BHEL'],
        avgSalary: { min: 400000, max: 900000, currency: 'INR' },
        skills: ['Lean Manufacturing', 'Six Sigma', 'Quality Control', 'Project Management'],
        growth: 'medium'
      },
      {
        title: 'Automotive Engineer',
        companies: ['Maruti Suzuki', 'Hyundai', 'Ford', 'BMW', 'Mercedes'],
        avgSalary: { min: 450000, max: 1200000, currency: 'INR' },
        skills: ['Vehicle Dynamics', 'Engine Design', 'CAE', 'Testing', 'Validation'],
        growth: 'high'
      }
    ],
    topRecruiters: ['Ashok Leyland', 'L&T', 'Mahindra', 'BHEL', 'Godrej', 'Kirloskar']
  },
  {
    id: 'eee',
    name: 'Electrical and Electronics Engineering',
    shortName: 'EEE',
    icon: '⚡',
    description: 'Powering the future with electrical and power systems expertise',
    careerPaths: [
      {
        title: 'Power Systems Engineer',
        companies: ['NTPC', 'PowerGrid', 'BHEL', 'Siemens', 'ABB'],
        avgSalary: { min: 400000, max: 1000000, currency: 'INR' },
        skills: ['Power Systems', 'MATLAB', 'ETAP', 'Protection Systems', 'Grid Management'],
        growth: 'medium'
      },
      {
        title: 'Control Systems Engineer',
        companies: ['Honeywell', 'Emerson', 'Schneider Electric', 'Rockwell'],
        avgSalary: { min: 450000, max: 1100000, currency: 'INR' },
        skills: ['PLC', 'SCADA', 'DCS', 'Control Theory', 'Automation', 'HMI'],
        growth: 'high'
      },
      {
        title: 'Renewable Energy Engineer',
        companies: ['Suzlon', 'Tata Power Solar', 'Adani Green', 'ReNew Power'],
        avgSalary: { min: 380000, max: 950000, currency: 'INR' },
        skills: ['Solar PV', 'Wind Energy', 'Energy Storage', 'Grid Integration'],
        growth: 'very-high'
      }
    ],
    topRecruiters: ['NTPC', 'BHEL', 'Siemens', 'ABB', 'L&T', 'Schneider Electric']
  },
  {
    id: 'civil',
    name: 'Civil Engineering',
    shortName: 'CIVIL',
    icon: '🏗️',
    description: 'Building the infrastructure for tomorrow\'s world',
    careerPaths: [
      {
        title: 'Structural Engineer',
        companies: ['L&T', 'Shapoorji Pallonji', 'Godrej Properties', 'DLF'],
        avgSalary: { min: 350000, max: 750000, currency: 'INR' },
        skills: ['Structural Analysis', 'STAAD Pro', 'AutoCAD', 'Revit', 'Concrete Design'],
        growth: 'medium'
      },
      {
        title: 'Project Manager',
        companies: ['L&T', 'Afcons', 'Simplex', 'HCC', 'Gammon India'],
        avgSalary: { min: 500000, max: 1200000, currency: 'INR' },
        skills: ['Project Management', 'MS Project', 'Cost Estimation', 'Quality Control'],
        growth: 'high'
      },
      {
        title: 'Transportation Engineer',
        companies: ['NHAI', 'Indian Railways', 'Metro Rail', 'Consulting Firms'],
        avgSalary: { min: 400000, max: 900000, currency: 'INR' },
        skills: ['Highway Design', 'Traffic Engineering', 'Transportation Planning'],
        growth: 'medium'
      }
    ],
    topRecruiters: ['L&T', 'Shapoorji Pallonji', 'Afcons', 'HCC', 'Godrej Properties']
  }
];

export const sngcetAlumni = [
  {
    name: 'Rajesh Kumar',
    batch: '2019',
    department: 'CSE',
    currentRole: 'Senior Software Engineer',
    company: 'Google',
    location: 'Bangalore',
    linkedin: 'https://linkedin.com/in/rajesh-kumar-sngcet',
    achievements: ['Tech Lead at Google Pay', 'Open Source Contributor'],
    mentoring: true
  },
  {
    name: 'Priya Sharma',
    batch: '2018',
    department: 'ECE',
    currentRole: 'VLSI Design Engineer',
    company: 'Intel',
    location: 'Bangalore',
    linkedin: 'https://linkedin.com/in/priya-sharma-sngcet',
    achievements: ['Patent Holder', 'IEEE Member'],
    mentoring: true
  },
  {
    name: 'Arun Krishnan',
    batch: '2020',
    department: 'MECH',
    currentRole: 'Design Engineer',
    company: 'Ashok Leyland',
    location: 'Chennai',
    linkedin: 'https://linkedin.com/in/arun-krishnan-sngcet',
    achievements: ['Product Development Lead', 'Six Sigma Black Belt'],
    mentoring: true
  }
];

// SNGCET - Excellence in Engineering Education
