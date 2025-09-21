import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Target, 
  TrendingUp, 
  Briefcase, 
  BookOpen,
  MessageCircle,
  Star
} from 'lucide-react'

const features = [
  {
    icon: Briefcase,
    title: 'Smart Job Matching',
    description: 'Get personalized job recommendations based on your skills and career goals.'
  },
  {
    icon: Target,
    title: 'Skill Gap Analysis',
    description: 'Identify skill gaps and get targeted learning recommendations.'
  },
  {
    icon: BookOpen,
    title: 'Course Recommendations',
    description: 'Discover courses from trusted providers to boost your career prospects.'
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Monitor your career development journey with detailed analytics.'
  },
  {
    icon: MessageCircle,
    title: 'AI Career Assistant',
    description: '24/7 guidance and support for all your career-related questions.'
  },
  {
    icon: Star,
    title: 'Resume Analysis',
    description: 'Upload your resume and get instant feedback and optimization tips.'
  }
]

// SNGCET-specific features and benefits
const sngcetFeatures = [
  {
    title: 'SNGCET Alumni Network',
    description: 'Connect with successful SNGCET graduates working in top companies worldwide.',
    benefit: 'Exclusive networking opportunities'
  },
  {
    title: 'Industry Partnerships',
    description: 'Direct access to companies that actively recruit from SNGCET.',
    benefit: 'Higher placement success rate'
  },
  {
    title: 'Department-Specific Guidance',
    description: 'Tailored career paths for each engineering discipline at SNGCET.',
    benefit: 'Specialized career roadmaps'
  }
]

export default function Welcome() {
  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-dark-700 bg-dark-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-gold rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div>
                <h1 className="text-xl font-display font-bold gradient-text">
                  Esencelab
                </h1>
                <p className="text-xs text-gray-400">for SNGCET Students</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="btn btn-ghost"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6"
            >
              SNGCET Students,{' '}
              <span className="gradient-text">Shape Your Future</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto text-balance"
            >
              The exclusive career platform for SNGCET College of Engineering and Technology students. 
              Track progress, discover opportunities, and bridge skill gaps with AI-powered insights.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/register"
                className="btn btn-primary btn-lg group"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/login"
                className="btn btn-secondary btn-lg"
              >
                Sign In
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive tools and insights to accelerate your career growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card card-hover text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-gold rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SNGCET Excellence Section */}
      <section className="py-20 lg:py-32 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Built for SNGCET Excellence
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Empowering SNGCET College students with cutting-edge career tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card text-center"
            >
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Career Opportunities</h3>
              <p className="text-gray-300">Discover jobs and internships from top companies actively recruiting SNGCET students</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card text-center"
            >
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI Career Assistant</h3>
              <p className="text-gray-300">Get personalized career guidance and skill recommendations powered by AI</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card text-center"
            >
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold mb-2">Alumni Network</h3>
              <p className="text-gray-300">Connect with successful SNGCET graduates working in leading companies worldwide</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready to Lead Your Career, SNGCET?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join your fellow SNGCET students in building exceptional careers with personalized AI guidance.
            </p>
            <Link
              to="/register"
              className="btn btn-accent btn-lg group"
            >
              Get Started for Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-700 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-gold rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div>
                <span className="text-xl font-display font-bold gradient-text">
                  Esencelab
                </span>
                <p className="text-xs text-gray-400">for SNGCET Students</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © 2025 Esencelab. Made exclusively for SNGCET.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Built with ❤️ for SNGCET College
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
