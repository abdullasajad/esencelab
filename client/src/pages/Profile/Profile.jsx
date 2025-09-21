import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Upload, 
  Download,
  Trash2,
  Settings,
  Bell,
  Shield,
  FileText,
  Camera,
  Save,
  X
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { userAPI, resumeAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    bio: user?.profile?.bio || '',
    location: {
      city: user?.profile?.location?.city || '',
      state: user?.profile?.location?.state || '',
      country: user?.profile?.location?.country || ''
    },
    university: {
      name: user?.profile?.university?.name || '',
      degree: user?.profile?.university?.degree || '',
      major: user?.profile?.university?.major || '',
      graduationYear: user?.profile?.university?.graduationYear || '',
      gpa: user?.profile?.university?.gpa || ''
    }
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ]

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      await userAPI.updateProfile({ profile: profileData })
      updateUser({ profile: profileData })
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold mb-2">Profile Settings</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>
        
        <button
          onClick={handleSaveProfile}
          disabled={loading}
          className="btn btn-primary disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-br from-primary-900/50 to-accent-gold/20 border-primary-600/30"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-accent-gold hover:bg-accent-gold/90 rounded-full flex items-center justify-center transition-colors">
              <Camera className="w-4 h-4 text-dark-950" />
            </button>
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-1">
              {user?.fullName || `${user?.firstName} ${user?.lastName}`}
            </h2>
            <p className="text-gray-300 mb-2">{user?.email}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Member since {formatDate(user?.createdAt)}</span>
              <span>•</span>
              <span>Profile {calculateCompletion(user)}% complete</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-accent-gold mb-1">
              {user?.skills?.length || 0}
            </div>
            <div className="text-sm text-gray-400">Skills Added</div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="card">
        <div className="flex space-x-1 mb-6 bg-dark-800 p-1 rounded-lg overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
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
        <div className="min-h-[500px]">
          {activeTab === 'profile' && (
            <ProfileTab 
              profileData={profileData} 
              onInputChange={handleInputChange}
            />
          )}
          {activeTab === 'resume' && (
            <ResumeTab user={user} />
          )}
          {activeTab === 'preferences' && (
            <PreferencesTab user={user} updateUser={updateUser} />
          )}
          {activeTab === 'notifications' && (
            <NotificationsTab user={user} updateUser={updateUser} />
          )}
          {activeTab === 'privacy' && (
            <PrivacyTab user={user} />
          )}
        </div>
      </div>
    </div>
  )
}

function ProfileTab({ profileData, onInputChange }) {
  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) => onInputChange('firstName', e.target.value)}
              className="input"
              placeholder="Enter your first name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={profileData.lastName}
              onChange={(e) => onInputChange('lastName', e.target.value)}
              className="input"
              placeholder="Enter your last name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              className="input"
              placeholder="Enter your email"
              disabled
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
              className="input"
              placeholder="Enter your phone number"
            />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Bio
        </label>
        <textarea
          value={profileData.bio}
          onChange={(e) => onInputChange('bio', e.target.value)}
          className="input h-24 resize-none"
          placeholder="Tell us about yourself..."
          maxLength={500}
        />
        <p className="text-xs text-gray-400 mt-1">
          {profileData.bio.length}/500 characters
        </p>
      </div>

      {/* Location */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              City
            </label>
            <input
              type="text"
              value={profileData.location.city}
              onChange={(e) => onInputChange('location.city', e.target.value)}
              className="input"
              placeholder="Enter your city"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              State/Province
            </label>
            <input
              type="text"
              value={profileData.location.state}
              onChange={(e) => onInputChange('location.state', e.target.value)}
              className="input"
              placeholder="Enter your state"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Country
            </label>
            <input
              type="text"
              value={profileData.location.country}
              onChange={(e) => onInputChange('location.country', e.target.value)}
              className="input"
              placeholder="Enter your country"
            />
          </div>
        </div>
      </div>

      {/* Education */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Education</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              University/College
            </label>
            <input
              type="text"
              value={profileData.university.name}
              onChange={(e) => onInputChange('university.name', e.target.value)}
              className="input"
              placeholder="Enter your university"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Degree
            </label>
            <select
              value={profileData.university.degree}
              onChange={(e) => onInputChange('university.degree', e.target.value)}
              className="input"
            >
              <option value="">Select degree</option>
              <option value="high-school">High School</option>
              <option value="associate">Associate</option>
              <option value="bachelor">Bachelor's</option>
              <option value="master">Master's</option>
              <option value="phd">PhD</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Major/Field of Study
            </label>
            <input
              type="text"
              value={profileData.university.major}
              onChange={(e) => onInputChange('university.major', e.target.value)}
              className="input"
              placeholder="Enter your major"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Graduation Year
            </label>
            <input
              type="number"
              value={profileData.university.graduationYear}
              onChange={(e) => onInputChange('university.graduationYear', e.target.value)}
              className="input"
              placeholder="2024"
              min="1950"
              max="2030"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function ResumeTab({ user }) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFileUpload = async (file) => {
    if (!file) return

    const formData = new FormData()
    formData.append('resume', file)

    try {
      setUploading(true)
      await resumeAPI.upload(formData)
      toast.success('Resume uploaded successfully!')
      // Refresh page or update user data
      window.location.reload()
    } catch (error) {
      console.error('Error uploading resume:', error)
      toast.error('Failed to upload resume')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleDownload = async () => {
    try {
      const response = await resumeAPI.download()
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', user?.resume?.fileName || 'resume.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error downloading resume:', error)
      toast.error('Failed to download resume')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your resume?')) return

    try {
      await resumeAPI.delete()
      toast.success('Resume deleted successfully!')
      window.location.reload()
    } catch (error) {
      console.error('Error deleting resume:', error)
      toast.error('Failed to delete resume')
    }
  }

  return (
    <div className="space-y-6">
      {user?.resume?.fileName ? (
        <div className="bg-dark-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Current Resume</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleDownload}
                className="btn btn-secondary btn-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-ghost btn-sm text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <p className="font-medium">{user.resume.fileName}</p>
              <p className="text-sm text-gray-400">
                Uploaded on {formatDate(user.resume.uploadDate)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            dragActive
              ? 'border-primary-500 bg-primary-500/10'
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Upload Your Resume</h3>
          <p className="text-gray-400 mb-4">
            Drag and drop your resume here, or click to browse
          </p>
          
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            className="hidden"
            id="resume-upload"
            disabled={uploading}
          />
          
          <label
            htmlFor="resume-upload"
            className="btn btn-primary cursor-pointer disabled:opacity-50"
          >
            {uploading ? (
              <>
                <div className="loading-spinner mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </>
            )}
          </label>
          
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: PDF, DOC, DOCX (Max 10MB)
          </p>
        </div>
      )}
    </div>
  )
}

function PreferencesTab({ user, updateUser }) {
  const [preferences, setPreferences] = useState(user?.preferences || {})

  const handleSave = async () => {
    try {
      await userAPI.updateProfile({ preferences })
      updateUser({ preferences })
      toast.success('Preferences updated!')
    } catch (error) {
      console.error('Error updating preferences:', error)
      toast.error('Failed to update preferences')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Job Preferences</h3>
        <button onClick={handleSave} className="btn btn-primary btn-sm">
          Save Changes
        </button>
      </div>
      
      <div className="bg-dark-800 rounded-xl p-6">
        <p className="text-gray-400 text-center py-8">
          Job preferences configuration coming soon...
        </p>
      </div>
    </div>
  )
}

function NotificationsTab({ user, updateUser }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Notification Settings</h3>
      
      <div className="bg-dark-800 rounded-xl p-6">
        <p className="text-gray-400 text-center py-8">
          Notification settings coming soon...
        </p>
      </div>
    </div>
  )
}

function PrivacyTab({ user }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Privacy & Security</h3>
      
      <div className="bg-dark-800 rounded-xl p-6">
        <p className="text-gray-400 text-center py-8">
          Privacy settings coming soon...
        </p>
      </div>
    </div>
  )
}

function formatDate(dateString) {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString()
}

function calculateCompletion(user) {
  if (!user) return 0
  
  const fields = [
    user.profile?.phone,
    user.profile?.bio,
    user.profile?.location?.city,
    user.profile?.university?.name,
    user.skills?.length > 0,
    user.resume?.fileName
  ]
  
  const completed = fields.filter(Boolean).length
  return Math.round((completed / fields.length) * 100)
}
