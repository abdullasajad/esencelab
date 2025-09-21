import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  Briefcase, 
  Target, 
  TrendingUp, 
  User,
  LogOut,
  X
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Opportunities', href: '/opportunities', icon: Briefcase },
  { name: 'Skills', href: '/skills', icon: Target },
  { name: 'Track', href: '/track', icon: TrendingUp },
  { name: 'Profile', href: '/profile', icon: User },
]

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    if (onClose) onClose()
  }

  return (
    <div className="flex flex-col h-full bg-dark-900 border-r border-dark-700">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-gold rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <div>
            <h1 className="text-xl font-display font-bold gradient-text">
              Esencelab
            </h1>
            <p className="text-xs text-gray-400">SNGCET Portal</p>
          </div>
        </div>
        
        {/* Close button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-dark-800 text-gray-400 hover:text-white transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="px-6 pb-6">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-dark-800 border border-dark-600">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.fullName || `${user?.firstName} ${user?.lastName}`}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.name}</span>
              
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary-600/10 border border-primary-600/30 rounded-lg -z-10"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-dark-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign out
        </button>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Esencelab v1.0
          </p>
        </div>
      </div>
    </div>
  )
}
