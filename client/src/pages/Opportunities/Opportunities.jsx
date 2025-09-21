import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Briefcase,
  Star,
  ExternalLink,
  Heart
} from 'lucide-react'
import { jobsAPI } from '../../services/api'

export default function Opportunities() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    jobType: '',
    workArrangement: '',
    location: ''
  })

  useEffect(() => {
    fetchJobs()
  }, [filters])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await jobsAPI.getJobs(filters)
      setJobs(response.data.jobs)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold mb-2">Job Opportunities</h1>
          <p className="text-gray-400">Discover your next career opportunity</p>
        </div>
        
        <Link
          to="/opportunities/recommendations"
          className="btn btn-primary"
        >
          <Star className="w-4 h-4 mr-2" />
          View Recommendations
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="input pl-10"
            />
          </div>
          
          <select
            value={filters.jobType}
            onChange={(e) => handleFilterChange('jobType', e.target.value)}
            className="input"
          >
            <option value="">All Job Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
            <option value="contract">Contract</option>
          </select>
          
          <select
            value={filters.workArrangement}
            onChange={(e) => handleFilterChange('workArrangement', e.target.value)}
            className="input"
          >
            <option value="">Work Arrangement</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site</option>
          </select>
          
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Location..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))
        ) : jobs.length > 0 ? (
          jobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <JobCard job={job} />
            </motion.div>
          ))
        ) : (
          <div className="card text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
                🎯 SNGCET Career Opportunities
              </h1>
              <p className="text-gray-300 text-lg">
                Exclusive jobs and internships curated for SNGCET College students
              </p>
            </div>
            <div className="mt-3">
              <span className="sngcet-badge">Campus Placements Available</span>
            </div>
            <button
              onClick={() => setFilters({ search: '', jobType: '', workArrangement: '', location: '' })}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function JobCard({ job }) {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(!saved)
    // In a real app, you'd save to backend
  }

  return (
    <div className="card card-hover">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              {job.company?.logo ? (
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {job.company?.name?.[0] || 'C'}
                  </span>
                </div>
              )}
              
              <div>
                <Link
                  to={`/opportunities/${job._id}`}
                  className="text-lg font-semibold hover:text-primary-400 transition-colors"
                >
                  {job.title}
                </Link>
                <p className="text-gray-400">{job.company?.name}</p>
              </div>
            </div>
            
            <button
              onClick={handleSave}
              className={`p-2 rounded-lg transition-colors ${
                saved 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>
          
          <p className="text-gray-300 mb-4 line-clamp-2">
            {job.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-1" />
              <span className="capitalize">{job.jobType}</span>
            </div>
            
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>
                {job.workArrangement === 'remote' 
                  ? 'Remote' 
                  : `${job.company?.location?.city || 'Location'}, ${job.company?.location?.country || ''}`
                }
              </span>
            </div>
            
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatDate(job.createdAt)}</span>
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
          
          {job.requirements?.skills && (
            <div className="flex flex-wrap gap-2 mt-4">
              {job.requirements.skills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="badge badge-primary"
                >
                  {skill.name}
                </span>
              ))}
              {job.requirements.skills.length > 4 && (
                <span className="text-sm text-gray-400">
                  +{job.requirements.skills.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-2 min-w-0 md:min-w-[120px]">
          <Link
            to={`/opportunities/${job._id}`}
            className="btn btn-primary btn-sm"
          >
            View Details
          </Link>
          
          {job.applicationProcess?.applicationUrl && (
            <a
              href={job.applicationProcess.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Apply
            </a>
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
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}
