# Potbelly Build Management System

A dual-interface project management system for restaurant construction, featuring a mobile PWA for the restaurant owner (Pooja) and a desktop Command Center for the project manager (Arushi).

## 🏗️ Project Overview

This system manages the complete restaurant build process with real-time task tracking, contractor coordination, photo documentation, and AI-powered insights.

### Target Users
- **Pooja (Restaurant Owner)**: Mobile-first interface optimized for iPhone 17 Pro Max
- **Arushi (Project Manager)**: Desktop Command Center with comprehensive project oversight

## 🚀 Features

### Mobile PWA (Pooja)
- **Home Dashboard**: Project progress, urgent alerts, AI insights
- **Task Management**: Complete task overview with filtering and status tracking
- **Team Coordination**: Contractor status with one-tap calling/messaging
- **Photo Upload**: Real-time progress documentation with categorization
- **iPhone 17 Pro Max Optimization**: Safe areas, touch targets, Dynamic Island support

### Desktop Command Center (Arushi)
- **Comprehensive Dashboard**: Multi-panel project overview with detailed analytics
- **Advanced Task Management**: Priority queues, assignment tracking, timeline management
- **Team Performance Analytics**: Contractor performance metrics and optimization suggestions
- **Communication Hub**: Centralized messaging, call logs, meeting notes
- **Media Management**: Photo galleries, document storage, progress videos
- **AI Insights**: Predictive analytics, risk assessment, resource optimization

### AI Integration
- **Smart Insights**: Performance analysis, risk detection, optimization suggestions
- **Predictive Analytics**: Timeline forecasting, budget variance analysis
- **Quality Monitoring**: Automated quality risk assessment
- **Resource Optimization**: Contractor workload balancing recommendations

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: React Query (TanStack Query)
- **Data Layer**: File-based JSON storage (no database required)
- **Deployment**: Vercel
- **Mobile**: PWA with native iOS optimizations

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd potbellybuild
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   - Mobile: Visit `http://localhost:3000` on mobile device or resize browser
   - Desktop: Visit `http://localhost:3000` on desktop (≥1024px width)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   │   ├── tasks/          # Task management
│   │   ├── photos/         # Photo upload/retrieval
│   │   ├── project/        # Project summary
│   │   └── ai/             # AI insights
│   ├── globals.css         # Global styles with mobile optimizations
│   ├── layout.tsx          # App layout with providers
│   ├── page.tsx            # Main dashboard (responsive)
│   └── providers.tsx       # React Query provider
├── components/
│   ├── mobile/             # Mobile-specific components
│   │   ├── HomeTab.tsx     # Mobile dashboard
│   │   ├── TasksTab.tsx    # Mobile task management
│   │   ├── TeamTab.tsx     # Mobile team view
│   │   └── PhotoUpload.tsx # Photo capture/upload
│   ├── desktop/            # Desktop-specific components
│   │   └── CommandCenter.tsx # Desktop interface
│   └── ui/                 # Shadcn UI components
├── lib/
│   ├── data-manager.ts     # File-based data management
│   └── utils.ts            # Utility functions
└── data/
    └── tasks.json          # Generated task data
```

## 📊 Data Management

The system uses a simple file-based approach:

- **Source**: `PB Build - Action Items.md` (existing project data)
- **Generated**: `src/data/tasks.json` (parsed task data)
- **Photos**: Placeholder system (ready for Vercel Blob integration)
- **No Database**: Designed for simplicity and rapid deployment

## 🎯 Key Design Principles

### Mobile-First (CLAUDE.md Compliance)
- **Typography**: `text-xs font-normal` baseline with consistent scaling
- **Touch Targets**: Minimum 44x44pt touch areas
- **Safe Areas**: iPhone 17 Pro Max notch and Dynamic Island support
- **Performance**: Optimized for mobile networks and processing power

### Desktop Power User
- **Information Density**: Maximum useful information without clutter
- **Keyboard Navigation**: Full keyboard accessibility
- **Multi-Panel**: Efficient use of screen real estate
- **Professional**: Clean, business-focused interface

### Universal Principles
- **Progressive Enhancement**: Works without JavaScript, enhanced with it
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Sub-2s loading, 90+ Lighthouse scores
- **Security**: Input validation, XSS protection, secure defaults

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Environment Variables**
   Set in Vercel dashboard or CLI:
   ```bash
   vercel env add NEXT_PUBLIC_APP_NAME
   vercel env add BLOB_READ_WRITE_TOKEN  # if using Blob storage
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Build Configuration

The project includes optimized build settings:
- **Bundle Analysis**: `npm run analyze`
- **Type Checking**: `npm run type-check`
- **Linting**: `npm run lint`
- **PWA**: Automatic service worker generation

## 📱 Mobile Installation

### iPhone 17 Pro Max
1. Open Safari and navigate to the deployed URL
2. Tap the Share button
3. Select "Add to Home Screen"
4. Confirm installation

The PWA will:
- Install as a native-feeling app
- Support offline browsing
- Use device-specific optimizations
- Handle Dynamic Island and safe areas

## 🔧 Development

### Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint checking
npm run type-check   # TypeScript validation
npm run analyze      # Bundle size analysis
```

### Code Standards
- **TypeScript Strict**: Zero tolerance for `any` types
- **ESLint**: Enforced code standards
- **Prettier**: Automated formatting
- **Component Pattern**: Consistent file/component structure

## 🤖 AI Features

### Current Capabilities
- **Performance Analysis**: Contractor efficiency tracking
- **Risk Detection**: Quality and timeline risk assessment
- **Resource Optimization**: Workload balancing suggestions
- **Predictive Insights**: Weather impact, cost variance analysis

### Future Enhancements
- **Photo Analysis**: Automated progress assessment from images
- **Natural Language**: Voice-to-task conversion
- **Scheduling**: Intelligent task scheduling optimization
- **Quality Prediction**: ML-based quality outcome forecasting

## 📞 Support & Maintenance

### Data Updates
Tasks are automatically synced from `PB Build - Action Items.md`. To add new tasks:
1. Update the markdown file
2. System will automatically parse on next API call
3. Pooja can also add tasks directly through mobile interface

### Photo Management
Currently uses placeholder system. To enable real photo storage:
1. Set up Vercel Blob Storage
2. Add `BLOB_READ_WRITE_TOKEN` to environment
3. Update photo upload endpoints

### Monitoring
- **Performance**: Vercel Analytics integration ready
- **Errors**: Built-in error boundaries and logging
- **Usage**: API call tracking and optimization

## 🏷️ License

Private project for Potbelly Restaurant build management.

## 👥 Team

- **Pooja**: Restaurant Owner (Mobile User)
- **Arushi**: Project Manager (Desktop User)
- **Contractors**: Vishal, Sabharwal, Sandeep, Pradeep, Bhargav (Team Members)

---

Built with ❤️ for the Potbelly Restaurant project