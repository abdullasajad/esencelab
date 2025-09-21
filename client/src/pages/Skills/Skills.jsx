import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Target, 
  TrendingUp, 
  Plus, 
  BookOpen,
  Star,
  AlertCircle,
  CheckCircle,
  BarChart3
} from 'lucide-react'
import { skillsAPI, userAPI } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

export default function Skills() {
  const { user, updateUser } = useAuth()
  const [skillAnalysis, setSkillAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchSkillAnalysis()
  }, [])

  const fetchSkillAnalysis = async () => {
    try {
      const response = await skillsAPI.getAnalysis()
      setSkillAnalysis(response.data.analysis)
    } catch (error) {
      console.error('Error fetching skill analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'gaps', label: 'Skill Gaps', icon: AlertCircle },
    { id: 'trending', label: 'Trending Skills', icon: TrendingUp },
    { id: 'manage', label: 'Manage Skills', icon: Target }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-32 rounded-2xl" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold mb-2">Skills Analysis</h1>
          <p className="text-gray-400">Understand your skills and identify growth opportunities</p>
        </div>
        
        <button className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Skills',
            value: skillAnalysis?.totalSkills || 0,
            icon: Target,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/20'
          },
          {
            title: 'Skill Gaps',
            value: skillAnalysis?.skillGaps?.length || 0,
            icon: AlertCircle,
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/20'
          },
          {
            title: 'Trending Skills',
            value: skillAnalysis?.trendingSkills?.length || 0,
            icon: TrendingUp,
            color: 'text-green-400',
            bgColor: 'bg-green-500/20'
          },
          {
            title: 'Skill Score',
            value: calculateSkillScore(user?.skills || []),
            icon: Star,
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
              className="card"
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

      {/* Tabs */}
      <div className="card">
        <div className="flex space-x-1 mb-6 bg-dark-800 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && (
            <SkillsOverview user={user} skillAnalysis={skillAnalysis} />
          )}
          {activeTab === 'gaps' && (
            <SkillGaps skillGaps={skillAnalysis?.skillGaps || []} />
          )}
          {activeTab === 'trending' && (
            <TrendingSkills trendingSkills={skillAnalysis?.trendingSkills || []} />
          )}
          {activeTab === 'manage' && (
            <ManageSkills user={user} updateUser={updateUser} />
          )}
        </div>
      </div>
    </div>
  )
}

function SkillsOverview({ user, skillAnalysis }) {
  const skillsByCategory = (user?.skills || []).reduce((acc, skill) => {
    const category = skill.category || 'other'
    if (!acc[category]) acc[category] = []
    acc[category].push(skill)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Your Skills by Category</h3>
        
        {Object.keys(skillsByCategory).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category} className="bg-dark-800 rounded-xl p-4">
                <h4 className="font-medium mb-3 capitalize">{category} Skills</h4>
                <div className="space-y-2">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{skill.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getSkillLevelColor(skill.level)}`}>
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No skills added yet</h3>
            <p className="text-gray-400 mb-4">
              Start by adding your skills to get personalized recommendations
            </p>
            <button className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Skill
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function SkillGaps({ skillGaps }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Skill Gaps Analysis</h3>
        <p className="text-gray-400 mb-6">
          These skills are in high demand but missing from your profile
        </p>
        
        {skillGaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillGaps.map((gap, index) => (
              <motion.div
                key={gap.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-800 rounded-xl p-4 border border-yellow-500/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium">{gap.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(gap.priority)}`}>
                    {gap.priority} priority
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                  <span>Market demand: {gap.demand} jobs</span>
                  <span>Level: {gap.recommendedLevel}</span>
                </div>
                
                <button className="btn btn-secondary btn-sm w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Find Courses
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No skill gaps found!</h3>
            <p className="text-gray-400">
              Your skills are well-aligned with market demands
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function TrendingSkills({ trendingSkills }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Trending Skills</h3>
        <p className="text-gray-400 mb-6">
          Skills that are currently in high demand in the job market
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-dark-800 rounded-xl p-4 border ${
                skill.hasSkill ? 'border-green-500/30' : 'border-dark-600'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium">{skill.name}</h4>
                {skill.hasSkill && (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{skill.demand} job openings</span>
                {!skill.hasSkill && (
                  <button className="text-primary-400 hover:text-primary-300 transition-colors">
                    Add skill
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ManageSkills({ user, updateUser }) {
  const [skills, setSkills] = useState(user?.skills || [])
  const [newSkill, setNewSkill] = useState({ name: '', level: 'beginner', category: 'technical' })

  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) return

    try {
      const updatedSkills = [...skills, { ...newSkill, addedDate: new Date() }]
      await userAPI.updateSkills(updatedSkills)
      setSkills(updatedSkills)
      updateUser({ skills: updatedSkills })
      setNewSkill({ name: '', level: 'beginner', category: 'technical' })
    } catch (error) {
      console.error('Error adding skill:', error)
    }
  }

  const handleRemoveSkill = async (index) => {
    try {
      const updatedSkills = skills.filter((_, i) => i !== index)
      await userAPI.updateSkills(updatedSkills)
      setSkills(updatedSkills)
      updateUser({ skills: updatedSkills })
    } catch (error) {
      console.error('Error removing skill:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Add New Skill */}
      <div className="bg-dark-800 rounded-xl p-4">
        <h3 className="font-medium mb-4">Add New Skill</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Skill name"
            value={newSkill.name}
            onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
            className="input"
          />
          
          <select
            value={newSkill.level}
            onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value }))}
            className="input"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
          
          <select
            value={newSkill.category}
            onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
            className="input"
          >
            <option value="technical">Technical</option>
            <option value="soft">Soft Skills</option>
            <option value="language">Language</option>
            <option value="certification">Certification</option>
          </select>
          
          <button
            onClick={handleAddSkill}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </button>
        </div>
      </div>

      {/* Skills List */}
      <div>
        <h3 className="font-medium mb-4">Your Skills ({skills.length})</h3>
        
        {skills.length > 0 ? (
          <div className="space-y-2">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-dark-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-medium">{skill.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getSkillLevelColor(skill.level)}`}>
                    {skill.level}
                  </span>
                  <span className="text-xs text-gray-400 capitalize">
                    {skill.category}
                  </span>
                </div>
                
                <button
                  onClick={() => handleRemoveSkill(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No skills added yet. Add your first skill above!</p>
          </div>
        )}
      </div>
    </div>
  )
}

function calculateSkillScore(skills) {
  if (!skills || skills.length === 0) return 0
  
  const levelScores = { beginner: 25, intermediate: 50, advanced: 75, expert: 100 }
  const totalScore = skills.reduce((sum, skill) => sum + (levelScores[skill.level] || 25), 0)
  return Math.round(totalScore / skills.length)
}

function getSkillLevelColor(level) {
  const colors = {
    beginner: 'bg-gray-500/20 text-gray-300',
    intermediate: 'bg-blue-500/20 text-blue-300',
    advanced: 'bg-green-500/20 text-green-300',
    expert: 'bg-purple-500/20 text-purple-300'
  }
  return colors[level] || colors.beginner
}

function getPriorityColor(priority) {
  const colors = {
    high: 'bg-red-500/20 text-red-300',
    medium: 'bg-yellow-500/20 text-yellow-300',
    low: 'bg-green-500/20 text-green-300'
  }
  return colors[priority] || colors.medium
}
