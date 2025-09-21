import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  TrendingUp, 
  Target, 
  Award,
  Clock,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react'
import { progressAPI } from '../../services/api'

export default function Track() {
  const [progressData, setProgressData] = useState(null)
  const [timeline, setTimeline] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState('overview')

  useEffect(() => {
    fetchProgressData()
  }, [])

  const fetchProgressData = async () => {
    try {
      const [statsResponse, timelineResponse] = await Promise.all([
        progressAPI.getStats(),
        progressAPI.getTimeline()
      ])
      
      setProgressData(statsResponse.data.stats)
      setTimeline(timelineResponse.data.timeline)
    } catch (error) {
      console.error('Error fetching progress data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-32 rounded-2xl" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    )
  }

  const views = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'achievements', label: 'Achievements', icon: Award }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold mb-2">Progress Tracker</h1>
        <p className="text-gray-400">Monitor your career development journey</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: 'Profile Completion',
            value: `${progressData?.profile?.completionPercentage || 0}%`,
            change: '+5%',
            trend: 'up',
            icon: Target,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/20'
          },
          {
            title: 'Skills Added',
            value: progressData?.skills?.total || 0,
            change: `+${progressData?.skills?.recentlyAdded || 0}`,
            trend: 'up',
            icon: Award,
            color: 'text-green-400',
            bgColor: 'bg-green-500/20'
          },
          {
            title: 'This Week',
            value: progressData?.activities?.thisWeek || 0,
            change: 'activities',
            trend: 'neutral',
            icon: Activity,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/20'
          },
          {
            title: 'Total Activities',
            value: progressData?.activities?.total || 0,
            change: `+${progressData?.activities?.thisMonth || 0}`,
            trend: 'up',
            icon: Clock,
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/20'
          }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                {stat.trend !== 'neutral' && (
                  <div className={`flex items-center text-sm ${
                    stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUp className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.title}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* View Tabs */}
      <div className="card">
        <div className="flex space-x-1 mb-6 bg-dark-800 p-1 rounded-lg">
          {views.map((view) => {
            const Icon = view.icon
            return (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === view.id
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {view.label}
              </button>
            )
          })}
        </div>

        {/* View Content */}
        <div className="min-h-[400px]">
          {activeView === 'overview' && (
            <ProgressOverview progressData={progressData} />
          )}
          {activeView === 'timeline' && (
            <ActivityTimeline timeline={timeline} />
          )}
          {activeView === 'goals' && (
            <CareerGoals progressData={progressData} />
          )}
          {activeView === 'achievements' && (
            <Achievements progressData={progressData} />
          )}
        </div>
      </div>
    </div>
  )
}

function ProgressOverview({ progressData }) {
  const skillsByCategory = progressData?.skills?.byCategory || {}

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Progress */}
        <div className="bg-dark-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Profile Completion</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Overall Progress</span>
              <span className="text-sm font-medium">{progressData?.profile?.completionPercentage || 0}%</span>
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progressData?.profile?.completionPercentage || 0}%` }}
              />
            </div>
            
            <div className="text-xs text-gray-400">
              Last updated: {formatDate(progressData?.profile?.lastUpdated)}
            </div>
          </div>
        </div>

        {/* Skills Distribution */}
        <div className="bg-dark-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Skills by Category</h3>
          
          {Object.keys(skillsByCategory).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(skillsByCategory).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm capitalize">{category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${(count / progressData.skills.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-6">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No skills data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-dark-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Activity Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {progressData?.activities?.thisWeek || 0}
            </div>
            <div className="text-sm text-gray-400">This Week</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {progressData?.activities?.thisMonth || 0}
            </div>
            <div className="text-sm text-gray-400">This Month</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {progressData?.activities?.total || 0}
            </div>
            <div className="text-sm text-gray-400">All Time</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActivityTimeline({ timeline }) {
  const timelineEntries = Object.entries(timeline).sort(([a], [b]) => new Date(b) - new Date(a))

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Recent Activity</h3>
      
      {timelineEntries.length > 0 ? (
        <div className="space-y-6">
          {timelineEntries.map(([date, activities]) => (
            <div key={date} className="relative">
              <div className="sticky top-0 bg-dark-900 py-2 mb-4">
                <h4 className="text-sm font-medium text-gray-300">
                  {formatDateHeader(date)}
                </h4>
              </div>
              
              <div className="space-y-3 pl-6 border-l-2 border-dark-700">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative bg-dark-800 rounded-lg p-4"
                  >
                    <div className="absolute -left-8 top-4 w-3 h-3 bg-primary-500 rounded-full border-2 border-dark-900" />
                    
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">{activity.description}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <span className={`px-2 py-1 rounded-full ${getActivityTypeColor(activity.type)}`}>
                            {activity.type}
                          </span>
                          <span>{formatTime(activity.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-4" />
          <p>No activity recorded yet</p>
        </div>
      )}
    </div>
  )
}

function CareerGoals({ progressData }) {
  const goals = progressData?.goals || {}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Career Goals</h3>
        <button className="btn btn-primary btn-sm">
          Set New Goal
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-800 rounded-xl p-6">
          <h4 className="font-medium mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-400" />
            Short-term Goals
          </h4>
          
          <div className="text-center py-8 text-gray-400">
            <p>No short-term goals set</p>
            <button className="btn btn-secondary btn-sm mt-2">
              Add Goal
            </button>
          </div>
        </div>
        
        <div className="bg-dark-800 rounded-xl p-6">
          <h4 className="font-medium mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
            Long-term Goals
          </h4>
          
          <div className="text-center py-8 text-gray-400">
            <p>No long-term goals set</p>
            <button className="btn btn-secondary btn-sm mt-2">
              Add Goal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Achievements({ progressData }) {
  const achievements = [
    {
      title: 'First Steps',
      description: 'Created your profile',
      icon: CheckCircle,
      earned: true,
      date: '2024-01-15'
    },
    {
      title: 'Skill Builder',
      description: 'Added 5 skills to your profile',
      icon: Award,
      earned: progressData?.skills?.total >= 5,
      date: progressData?.skills?.total >= 5 ? '2024-01-20' : null
    },
    {
      title: 'Profile Master',
      description: 'Completed 80% of your profile',
      icon: Target,
      earned: progressData?.profile?.completionPercentage >= 80,
      date: progressData?.profile?.completionPercentage >= 80 ? '2024-01-25' : null
    }
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Achievements</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon
          return (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-xl border ${
                achievement.earned
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-dark-800 border-dark-600'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                achievement.earned
                  ? 'bg-green-500/20'
                  : 'bg-gray-500/20'
              }`}>
                <Icon className={`w-6 h-6 ${
                  achievement.earned ? 'text-green-400' : 'text-gray-400'
                }`} />
              </div>
              
              <h4 className="font-semibold mb-2">{achievement.title}</h4>
              <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
              
              {achievement.earned ? (
                <div className="text-xs text-green-400">
                  Earned on {formatDate(achievement.date)}
                </div>
              ) : (
                <div className="text-xs text-gray-500">
                  Not earned yet
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function formatDate(dateString) {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString()
}

function formatDateHeader(dateString) {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getActivityTypeColor(type) {
  const colors = {
    account: 'bg-blue-500/20 text-blue-300',
    profile: 'bg-green-500/20 text-green-300',
    skills: 'bg-purple-500/20 text-purple-300',
    resume: 'bg-yellow-500/20 text-yellow-300',
    job: 'bg-red-500/20 text-red-300',
    learning: 'bg-indigo-500/20 text-indigo-300',
    other: 'bg-gray-500/20 text-gray-300'
  }
  return colors[type] || colors.other
}
