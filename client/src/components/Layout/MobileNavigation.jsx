import { NavLink, useLocation } from 'react-router-dom'
import { 
  Home, 
  Briefcase, 
  Target, 
  TrendingUp, 
  User 
} from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Jobs', href: '/opportunities', icon: Briefcase },
  { name: 'Skills', href: '/skills', icon: Target },
  { name: 'Track', href: '/track', icon: TrendingUp },
  { name: 'Profile', href: '/profile', icon: User },
]

export default function MobileNavigation({ className = '' }) {
  const location = useLocation()

  return (
    <nav className={`mobile-nav ${className}`}>
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`mobile-nav-item ${isActive ? 'mobile-nav-item-active' : ''}`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-primary-400' : ''}`} />
              <span className={`font-medium ${isActive ? 'text-primary-400' : ''}`}>
                {item.name}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
