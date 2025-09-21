import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot,
  User,
  Minimize2,
  Maximize2
} from 'lucide-react'
import { chatAPI } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

export default function ChatBot({ isOpen, onClose }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      setMessages([{
        id: 1,
        type: 'bot',
        text: `Hello ${user?.firstName || 'there'}! I'm your AI career assistant. How can I help you today?`,
        suggestions: [
          'Help me find jobs',
          'Analyze my skills',
          'Recommend courses',
          'Update my profile'
        ],
        timestamp: new Date()
      }])
    }
  }, [isOpen, user?.firstName])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    try {
      const response = await chatAPI.sendMessage({
        message: inputMessage,
        context: {
          userSkills: user?.skills || [],
          hasResume: !!user?.resume?.fileName,
          profileCompletion: calculateProfileCompletion(user)
        }
      })

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response.data.response,
        suggestions: response.data.suggestions || [],
        actions: response.data.actions || [],
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion)
    handleSendMessage()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div className={`bg-dark-900 border border-dark-700 rounded-2xl shadow-strong transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-80 h-96 md:w-96 md:h-[500px]'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-dark-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-gold rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Assistant</h3>
                <p className="text-xs text-gray-400">
                  {isTyping ? 'Typing...' : 'Online'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 rounded-lg hover:bg-dark-800 text-gray-400 hover:text-white transition-colors"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-dark-800 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80 md:h-96 scrollbar-thin">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onSuggestionClick={handleSuggestionClick}
                  />
                ))}
                
                {isTyping && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-dark-800 rounded-2xl px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-dark-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="btn btn-primary btn-sm disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function ChatMessage({ message, onSuggestionClick }) {
  const isBot = message.type === 'bot'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start space-x-3 ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isBot 
          ? 'bg-gradient-to-br from-primary-600 to-accent-gold' 
          : 'bg-dark-700'
      }`}>
        {isBot ? (
          <Bot className="w-4 h-4 text-white" />
        ) : (
          <User className="w-4 h-4 text-gray-300" />
        )}
      </div>
      
      <div className={`max-w-xs ${isBot ? '' : 'text-right'}`}>
        <div className={`rounded-2xl px-4 py-2 ${
          isBot 
            ? 'bg-dark-800 text-white' 
            : 'bg-primary-600 text-white'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        </div>
        
        {/* Suggestions */}
        {isBot && message.suggestions && message.suggestions.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick(suggestion)}
                className="block w-full text-left text-xs px-3 py-1 bg-dark-700 hover:bg-dark-600 rounded-lg text-gray-300 hover:text-white transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        
        {/* Actions */}
        {isBot && message.actions && message.actions.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.actions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  if (action.type === 'navigate') {
                    window.location.href = action.target
                  }
                }}
                className="block w-full text-left text-xs px-3 py-1 bg-primary-600/20 hover:bg-primary-600/30 rounded-lg text-primary-300 hover:text-primary-200 transition-colors border border-primary-600/30"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-1">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </motion.div>
  )
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function calculateProfileCompletion(user) {
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
