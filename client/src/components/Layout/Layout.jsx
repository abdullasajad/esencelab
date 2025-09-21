import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './Sidebar'
import MobileBottomNav from '../SNGCET/MobileBottomNav'
import { useAuth } from '../../hooks/useAuth'
import Header from './Header'
import ChatBot from '../Chat/ChatBot'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex flex-col w-64 h-full bg-dark-900 border-r border-dark-700">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          onChatClick={() => setChatOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 relative overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-thin">
            <div className="px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-6">
              <Outlet />
            </div>
          </div>
        </main>

        {/* Mobile Navigation */}
        <MobileNavigation className="lg:hidden" />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Chat Bot */}
      <ChatBot 
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </div>
  )
}
