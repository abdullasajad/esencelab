import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  MapPin, 
  Briefcase, 
  Calendar, 
  MessageCircle, 
  Star,
  Filter,
  Search,
  ExternalLink,
  Award
} from 'lucide-react'
import { sngcetAlumni, sngcetDepartments } from '../../data/sngcetDepartments'

export default function AlumniNetwork() {
  const [alumni, setAlumni] = useState(sngcetAlumni)
  const [filteredAlumni, setFilteredAlumni] = useState(sngcetAlumni)
  const [filters, setFilters] = useState({
    department: 'all',
    company: 'all',
    batch: 'all',
    mentoring: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    let filtered = alumni

    // Apply filters
    if (filters.department !== 'all') {
      filtered = filtered.filter(alum => alum.department === filters.department)
    }
    if (filters.mentoring !== 'all') {
      filtered = filtered.filter(alum => 
        filters.mentoring === 'available' ? alum.mentoring : !alum.mentoring
      )
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(alum =>
        alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alum.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alum.currentRole.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredAlumni(filtered)
  }, [filters, searchTerm, alumni])

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            🎓 SNGCET Alumni Network
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Connect with successful SNGCET graduates working in top companies worldwide. 
            Get mentorship, career guidance, and industry insights.
          </p>
        </motion.div>

      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search alumni by name, company, or role..."
              className="input pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              className="input w-auto min-w-[120px]"
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
            >
              <option value="all">All Departments</option>
              {sngcetDepartments.map(dept => (
                <option key={dept.id} value={dept.shortName}>
                  {dept.shortName}
                </option>
              ))}
            </select>

            <select
              className="input w-auto min-w-[120px]"
              value={filters.mentoring}
              onChange={(e) => handleFilterChange('mentoring', e.target.value)}
            >
              <option value="all">All Alumni</option>
              <option value="available">Mentors Available</option>
              <option value="unavailable">Not Mentoring</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.map((alum, index) => (
          <motion.div
            key={alum.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card-enhanced group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-gold rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {alum.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{alum.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span className="sngcet-badge">{alum.department}</span>
                    <span>'{alum.batch.slice(-2)}</span>
                  </div>
                </div>
              </div>
              
              {alum.mentoring && (
                <div className="bg-green-600/20 text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                  Available for Mentoring
                </div>
              )}
            </div>

            {/* Current Role */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Briefcase className="w-4 h-4 text-primary-400" />
                <span className="font-medium">{alum.currentRole}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <span className="font-semibold">{alum.company}</span>
                <MapPin className="w-3 h-3" />
                <span className="text-sm">{alum.location}</span>
              </div>
            </div>

            {/* Achievements */}
            {alum.achievements && alum.achievements.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-4 h-4 text-accent-gold" />
                  <span className="text-sm font-medium">Achievements</span>
                </div>
                <div className="space-y-1">
                  {alum.achievements.slice(0, 2).map((achievement, idx) => (
                    <div key={idx} className="text-sm text-gray-300 flex items-center space-x-1">
                      <Star className="w-3 h-3 text-accent-gold" />
                      <span>{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2 pt-4 border-t border-dark-600">
              <button className="btn btn-primary btn-sm flex-1">
                <MessageCircle className="w-4 h-4 mr-2" />
                Connect
              </button>
              {alum.linkedin && (
                <a
                  href={alum.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-accent-gold/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredAlumni.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Alumni Found</h3>
          <p className="text-gray-400">
            Try adjusting your search terms or filters to find more alumni.
          </p>
        </motion.div>
      )}

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-r from-primary-900/30 to-accent-gold/10 border-primary-600/30 text-center"
      >
        <h3 className="text-xl font-semibold mb-2">
          🌟 Join the SNGCET Alumni Network
        </h3>
        <p className="text-gray-300 mb-4">
          Are you a SNGCET graduate? Join our alumni network and help current students succeed.
        </p>
        <button className="btn btn-accent">
          Register as Alumni
        </button>
      </motion.div>
    </div>
  )
}
