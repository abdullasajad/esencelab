import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  Menu, 
  MessageCircle, 
  Bell, 
  Search,
  Sun,
  Moon,
  GraduationCap
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const pageTitle = {
  '/dashboard': 'Dashboard',
  '/opportunities': 'Opportunities',
  '/skills': 'Skills',
  '/track': 'Progress Tracker',
  '/profile': 'Profile'
}

export default function Header({ onMenuClick, onChatClick }) {
  const { user } = useAuth()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)

  const currentTitle = pageTitle[location.pathname] || 'Esencelab'

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // In a real app, you'd persist this preference
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header className="bg-dark-900/95 backdrop-blur-md border-b border-dark-700 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-dark-800 text-gray-400 hover:text-white transition-colors lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* SNGCET Branding - Mobile */}
          <div className="lg:hidden flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-gold rounded-lg flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <div>
              <div className="text-sm font-bold gradient-text">Esencelab</div>
              <div className="text-xs text-gray-400">SNGCET</div>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-4 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="search"
                placeholder="Search opportunities, courses, or ask AI assistant..."
                className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-dark-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:bg-dark-800"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search */}
            <button 
              className="sm:hidden p-2 rounded-lg hover:bg-dark-800 text-gray-400 hover:text-white transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-dark-800 text-gray-400 hover:text-white transition-colors group">
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* SNGCET Badge */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-primary-600/20 rounded-full border border-primary-600/30">
              <GraduationCap className="w-4 h-4 text-primary-400" />
              <span className="text-xs font-medium text-primary-300">SNGCET Student</span>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-dark-800 text-gray-400 hover:text-white transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile search */}
          {searchOpen && (
            <div className="mt-4 md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function getPageSubtitle(pathname, user) {
  switch (pathname) {
    case '/dashboard':
      return `Welcome back, ${user?.firstName || 'Student'}!`
    case '/opportunities':
      return 'Find your next career opportunity'
    case '/skills':
      return 'Analyze and improve your skills'
    case '/track':
      return 'Monitor your career progress'
    case '/profile':
      return 'Manage your profile and preferences'
    default:
      return 'Your career development companion'
  }
}
