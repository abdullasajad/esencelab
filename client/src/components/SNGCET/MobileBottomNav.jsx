import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  Briefcase, 
  TrendingUp, 
  User, 
  BookOpen,
  Bell,
  Search
} from 'lucide-react'

const navItems = [
  { id: 'dashboard', icon: Home, label: 'Home', path: '/dashboard' },
  { id: 'opportunities', icon: Briefcase, label: 'Jobs', path: '/opportunities' },
  { id: 'skills', icon: TrendingUp, label: 'Skills', path: '/skills' },
  { id: 'track', icon: BookOpen, label: 'Track', path: '/track' },
  { id: 'profile', icon: User, label: 'Profile', path: '/profile' }
]

export default function MobileBottomNav() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [notifications, setNotifications] = useState(3) // Mock notification count

  useEffect(() => {
    const currentPath = location.pathname
    const activeItem = navItems.find(item => currentPath.startsWith(item.path))
    if (activeItem) {
      setActiveTab(activeItem.id)
    }
  }, [location])

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="mobile-nav lg:hidden">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className="mobile-nav-item relative"
                onClick={() => setActiveTab(item.id)}
              >
                <div className="relative">
                  <motion.div
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary-600 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-dark-800'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                    
                    {/* Notification badge for opportunities */}
                    {item.id === 'opportunities' && notifications > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <span className="text-xs text-white font-bold">
                          {notifications > 9 ? '9+' : notifications}
                        </span>
                      </motion.div>
                    )}
                  </motion.div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-400 rounded-full"
                    />
                  )}
                </div>
                
                <span className={`text-xs mt-1 transition-colors ${
                  isActive ? 'text-primary-400' : 'text-gray-400'
                }`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Floating Action Button for Quick Search */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-primary-600 to-accent-gold rounded-full shadow-glow flex items-center justify-center lg:hidden z-40"
        onClick={() => {
          // Quick search functionality
          const searchInput = document.querySelector('input[type="search"]')
          if (searchInput) {
            searchInput.focus()
          }
        }}
      >
        <Search className="w-6 h-6 text-white" />
      </motion.button>

      {/* SNGCET Branding on Mobile */}
      <div className="fixed top-0 left-0 right-0 bg-dark-900/95 backdrop-blur-md border-b border-dark-700 px-4 py-2 flex items-center justify-between lg:hidden z-50 safe-top">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-gold rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <div>
            <div className="text-sm font-bold gradient-text">Esencelab</div>
            <div className="text-xs text-gray-400">SNGCET Portal</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-dark-800 transition-colors">
            <Bell className="w-5 h-5 text-gray-400" />
            {notifications > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
