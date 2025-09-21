import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Briefcase,
  DollarSign,
  Star,
  ExternalLink,
  Heart,
  Share2,
  Building,
  Users,
  Calendar
} from 'lucide-react'
import { jobsAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function JobDetails() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    fetchJobDetails()
  }, [id])

  const fetchJobDetails = async () => {
    try {
      const response = await jobsAPI.getJob(id)
      setJob(response.data.job)
    } catch (error) {
      console.error('Error fetching job details:', error)
      toast.error('Failed to load job details')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    try {
      setApplying(true)
      await jobsAPI.applyToJob(id)
      toast.success('Application submitted successfully!')
      // Refresh job details to update application status
      fetchJobDetails()
    } catch (error) {
      console.error('Error applying to job:', error)
      toast.error(error.response?.data?.message || 'Failed to submit application')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-32" />
        <div className="skeleton h-64 rounded-2xl" />
        <div className="skeleton h-48 rounded-2xl" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="card text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Job not found</h2>
        <p className="text-gray-400 mb-4">The job you're looking for doesn't exist or has been removed.</p>
        <Link to="/opportunities" className="btn btn-primary">
          Back to Jobs
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/opportunities"
        className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Jobs
      </Link>

      {/* Job Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-start space-x-4 mb-4">
              {job.company?.logo ? (
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {job.company?.name?.[0] || 'C'}
                  </span>
                </div>
              )}
              
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
                  {job.title}
                </h1>
                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                  <Building className="w-4 h-4" />
                  <span className="text-lg">{job.company?.name}</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>
                      {job.workArrangement === 'remote' 
                        ? 'Remote' 
                        : `${job.company?.location?.city}, ${job.company?.location?.country}`
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    <span className="capitalize">{job.jobType}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Posted {formatDate(job.createdAt)}</span>
                  </div>
                  
                  {job.matchScore && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-accent-gold" />
                      <span className="text-accent-gold font-medium">
                        {job.matchScore}% match
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {job.compensation?.salary && (
              <div className="flex items-center space-x-2 text-accent-gold mb-4">
                <DollarSign className="w-5 h-5" />
                <span className="text-lg font-semibold">
                  ${job.compensation.salary.min?.toLocaleString()} - ${job.compensation.salary.max?.toLocaleString()}
                  <span className="text-sm text-gray-400 ml-1">
                    / {job.compensation.salary.period}
                  </span>
                </span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col space-y-3 min-w-0 md:min-w-[200px]">
            {job.hasApplied ? (
              <div className="btn btn-success cursor-default">
                ✓ Applied
              </div>
            ) : (
              <button
                onClick={handleApply}
                disabled={applying}
                className="btn btn-primary disabled:opacity-50"
              >
                {applying ? 'Applying...' : 'Apply Now'}
              </button>
            )}
            
            {job.applicationProcess?.applicationUrl && (
              <a
                href={job.applicationProcess.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                External Apply
              </a>
            )}
            
            <div className="flex space-x-2">
              <button className="btn btn-ghost flex-1">
                <Heart className="w-4 h-4" />
              </button>
              <button className="btn btn-ghost flex-1">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-line">
                {job.description}
              </p>
            </div>
          </motion.div>

          {/* Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-4">Requirements</h2>
            
            {job.requirements?.skills && (
              <div className="mb-6">
                <h3 className="font-medium mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.skills.map((skill, index) => (
                    <span
                      key={index}
                      className={`badge ${
                        skill.required ? 'badge-primary' : 'badge-secondary'
                      }`}
                    >
                      {skill.name}
                      {skill.level && (
                        <span className="ml-1 text-xs opacity-75">
                          ({skill.level})
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {job.requirements?.experience && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">Experience</h3>
                <p className="text-gray-300">
                  {job.requirements.experience.min} - {job.requirements.experience.max} {job.requirements.experience.unit} of experience
                </p>
              </div>
            )}
            
            {job.requirements?.education && (
              <div>
                <h3 className="font-medium mb-2">Education</h3>
                <p className="text-gray-300">
                  {job.requirements.education.level} in {job.requirements.education.field || 'relevant field'}
                  {job.requirements.education.required ? ' (Required)' : ' (Preferred)'}
                </p>
              </div>
            )}
          </motion.div>

          {/* Skill Gaps */}
          {job.skillGaps && job.skillGaps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card bg-yellow-500/10 border-yellow-500/30"
            >
              <h2 className="text-xl font-semibold mb-4 text-yellow-400">Skill Gaps</h2>
              <p className="text-gray-300 mb-4">
                You're missing some skills for this role. Consider learning these to improve your chances:
              </p>
              <div className="flex flex-wrap gap-2">
                {job.skillGaps.map((skill, index) => (
                  <span key={index} className="badge badge-warning">
                    {skill}
                  </span>
                ))}
              </div>
              <Link
                to="/skills"
                className="btn btn-secondary mt-4"
              >
                View Skill Recommendations
              </Link>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <h2 className="text-lg font-semibold mb-4">About {job.company?.name}</h2>
            
            <div className="space-y-3 text-sm">
              {job.company?.industry && (
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{job.company.industry}</span>
                </div>
              )}
              
              {job.company?.size && (
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="capitalize">{job.company.size} company</span>
                </div>
              )}
              
              {job.company?.website && (
                <div className="flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2 text-gray-400" />
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    Company Website
                  </a>
                </div>
              )}
            </div>
          </motion.div>

          {/* Job Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <h2 className="text-lg font-semibold mb-4">Job Statistics</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Views</span>
                <span>{job.views || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Applications</span>
                <span>{job.applications || 0}</span>
              </div>
              {job.applicationDeadline && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Deadline</span>
                  <span>{new Date(job.applicationDeadline).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Benefits */}
          {job.compensation?.benefits && job.compensation.benefits.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card"
            >
              <h2 className="text-lg font-semibold mb-4">Benefits</h2>
              <ul className="space-y-2">
                {job.compensation.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-accent-gold rounded-full mr-3 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}
