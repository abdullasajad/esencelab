import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Target, 
  Briefcase, 
  BookOpen,
  Upload,
  Settings,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { userAPI } from '../../services/api'

export default function Dashboard() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await userAPI.getDashboard()
      setDashboardData(response.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-32 rounded-2xl" />
        ))}
      </div>
    )
  }

  const stats = dashboardData?.stats || {}
  const quickActions = dashboardData?.quickActions || []

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card bg-gradient-to-br from-primary-900/50 to-accent-gold/20 border-primary-600/30"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-300 text-lg">
              Ready to advance your SNGCET career journey today?
            </p>
            <div className="mt-3">
              <span className="sngcet-badge">
                SNGCET Student Portal
              </span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <span>Profile completion:</span>
              <div className="w-20 progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${stats.profileCompletion || 0}%` }}
                />
              </div>
              <span className="font-semibold text-accent-gold">
                {stats.profileCompletion || 0}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Skills Added',
            value: stats.totalSkills || 0,
            icon: Target,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/20'
          },
          {
            title: 'Profile Score',
            value: `${stats.profileCompletion || 0}%`,
            icon: TrendingUp,
            color: 'text-green-400',
            bgColor: 'bg-green-500/20'
          },
          {
            title: 'Resume Status',
            value: stats.hasResume ? 'Uploaded' : 'Missing',
            icon: Upload,
            color: stats.hasResume ? 'text-green-400' : 'text-yellow-400',
            bgColor: stats.hasResume ? 'bg-green-500/20' : 'bg-yellow-500/20'
          },
          {
            title: 'Days Active',
            value: getDaysActive(stats.memberSince),
            icon: Briefcase,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/20'
          }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <span className="text-sm text-gray-400">
            Complete these to boost your profile
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <div
              key={action.title}
              className={`p-4 rounded-xl border transition-all duration-200 hover:border-primary-500/50 ${
                action.completed 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-dark-800 border-dark-600 hover:bg-dark-700'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  action.completed ? 'bg-green-500/20' : 'bg-primary-500/20'
                }`}>
                  {action.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    getActionIcon(action.action)
                  )}
                </div>
                {action.completed && (
                  <span className="text-xs text-green-400 font-medium">Completed</span>
                )}
              </div>
              
              <h3 className="font-semibold mb-1">{action.title}</h3>
              <p className="text-sm text-gray-400 mb-3">{action.description}</p>
              
              {!action.completed && (
                <button className="text-sm text-primary-400 hover:text-primary-300 flex items-center transition-colors">
                  Get started
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
            View all
          </button>
        </div>

        <div className="space-y-4">
          {(dashboardData?.recentActivities || []).slice(0, 5).map((activity, index) => (
            <div key={activity.id || index} className="flex items-center space-x-4 p-3 rounded-lg bg-dark-800">
              <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-white">{activity.description}</p>
                <p className="text-xs text-gray-400">
                  {formatDate(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
          
          {(!dashboardData?.recentActivities || dashboardData.recentActivities.length === 0) && (
            <div className="text-center py-8 text-gray-400">
              <p>No recent activity yet.</p>
              <p className="text-sm mt-1">Start by uploading your resume or updating your profile!</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

function getDaysActive(memberSince) {
  if (!memberSince) return 0
  const now = new Date()
  const start = new Date(memberSince)
  const diffTime = Math.abs(now - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

function getActionIcon(action) {
  const icons = {
    'upload-resume': <Upload className="w-5 h-5 text-primary-400" />,
    'complete-profile': <Settings className="w-5 h-5 text-primary-400" />,
    'set-goals': <Target className="w-5 h-5 text-primary-400" />
  }
  return icons[action] || <Briefcase className="w-5 h-5 text-primary-400" />
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffTime / (1000 * 60))

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
  return 'Just now'
}
