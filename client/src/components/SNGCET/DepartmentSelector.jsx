import { useState } from 'react'
import { motion } from 'framer-motion'
import { sngcetDepartments } from '../../data/sngcetDepartments'
import { ChevronRight, TrendingUp, Users, DollarSign } from 'lucide-react'

export default function DepartmentSelector({ onDepartmentSelect, selectedDepartment }) {
  const [hoveredDept, setHoveredDept] = useState(null)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
          Choose Your SNGCET Department
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Discover career opportunities tailored to your engineering discipline at SNGCET College
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sngcetDepartments.map((dept, index) => (
          <motion.div
            key={dept.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`card-enhanced cursor-pointer ${
              selectedDepartment?.id === dept.id 
                ? 'border-primary-500 bg-primary-900/20' 
                : ''
            }`}
            onClick={() => onDepartmentSelect(dept)}
            onMouseEnter={() => setHoveredDept(dept.id)}
            onMouseLeave={() => setHoveredDept(null)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{dept.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg">{dept.shortName}</h3>
                  <p className="text-sm text-gray-400">{dept.name}</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                hoveredDept === dept.id ? 'translate-x-1' : ''
              }`} />
            </div>

            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
              {dept.description}
            </p>

            <div className="flex flex-wrap gap-2 justify-center">
              {dept.topRecruiters.slice(0, 3).map((recruiter, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-primary-600/20 text-primary-300 rounded-full text-xs"
                >
                  {recruiter}
                </span>
              ))}
            </div>

            {selectedDepartment?.id === dept.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-dark-600"
              >
                <div className="text-xs text-primary-400 font-medium mb-2">
                  Top Career Paths:
                </div>
                <div className="flex flex-wrap gap-1">
                  {dept.careerPaths.slice(0, 3).map((path, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-primary-600/20 text-primary-300 rounded-full text-xs"
                    >
                      {path.title}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {selectedDepartment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-r from-primary-900/30 to-accent-gold/10 border-primary-600/30"
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">
              🎯 Ready to explore {selectedDepartment.shortName} opportunities?
            </h3>
            <p className="text-gray-300 mb-4">
              Discover jobs, internships, and career paths specifically curated for {selectedDepartment.name} students
            </p>
            <button className="btn btn-primary">
              View {selectedDepartment.shortName} Opportunities
              <ChevronRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
