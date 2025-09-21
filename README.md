# Esencelab – SNGCET Student Career Platform

A comprehensive career development platform designed specifically for SNGCET College students to track their progress, discover opportunities, and bridge skill gaps with AI-powered insights.

## Features

- **Resume Upload & AI Analysis**: Upload PDF/DOCX resumes with intelligent parsing
- **Job & Internship Matching**: Personalized opportunities based on skills and preferences
- **Skill Gap Visualization**: Interactive charts showing areas for improvement
- **Course Recommendations**: Curated learning paths from trusted providers
- **Progress Tracking**: Timeline of achievements and milestones
- **Smart Notifications**: Timely reminders and encouragement
- **AI Chatbot Assistant**: 24/7 career guidance and support

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Framer Motion for animations
- Recharts for data visualization
- React Router for navigation

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Multer for file uploads
- PDF parsing libraries
- JWT authentication

## Design Principles

- **Minimalist UI**: Clean, uncluttered interface with generous white space
- **Dark Theme**: Calm dark backgrounds with strategic accent colors
- **Typography**: Inter font family for optimal readability
- **Color Palette**: Black, White, Deep Blue (#1B155C), Silver-Grey (#C3CED0), Gold (#A9824C)
- **Mobile-First**: Responsive design optimized for all devices

## Getting Started

1. **Install dependencies**:
   ```bash
   npm run install-all
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env` in both client and server directories
   - Add your MongoDB connection string and API keys

3. **Start development servers**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Project Structure

```
esencelab-student-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # Global styles
├── server/                # Node.js backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Custom middleware
│   └── utils/            # Server utilities
└── docs/                 # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
