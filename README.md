# VoiceX Frontend

A modern, full-featured virtual phone number management system built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Authentication** - Secure JWT-based auth with automatic token refresh
- **Phone Number Management** - Search, rent, and manage virtual phone numbers
- **SMS Messaging** - Send and receive SMS messages with real-time updates
- **Voice Calls** - WebRTC voice calling powered by Twilio
- **Billing & Subscriptions** - Manage subscriptions and payment methods
- **Real-time Updates** - Socket.io integration for instant notifications
- **Beautiful UI** - PostHog-inspired design with smooth animations

## 🛠 Tech Stack

- **Framework:** Vite + React 18 + TypeScript
- **Routing:** React Router v6
- **State Management:** Zustand + TanStack Query (React Query)
- **Styling:** Tailwind CSS v3 + Framer Motion
- **UI Components:** Custom shadcn/ui components
- **Forms:** React Hook Form + Zod validation
- **Real-time:** Socket.io Client
- **Voice:** Twilio Voice SDK
- **HTTP Client:** Axios with interceptors

## 📦 Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update .env.local with your backend URL
# VITE_API_URL=http://localhost:3000/api
# VITE_WS_URL=http://localhost:3000
```

## 🏃‍♂️ Running the App

```bash
# Development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── api/              # API client functions
├── components/       # Reusable UI components
│   ├── auth/        # Authentication components
│   ├── layout/      # Layout components (Sidebar, Navbar)
│   └── ui/          # Base UI components
├── hooks/           # Custom React hooks
├── pages/           # Page components (routes)
├── store/           # Zustand stores
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── config/          # Configuration files
```

## 🎨 Design System

The UI follows a PostHog-inspired design approach:
- **Smooth animations** - Framer Motion for page transitions and micro-interactions
- **Gradient accents** - Blue to purple gradients throughout
- **Hover effects** - Scale transforms and glow effects on interactive elements
- **Real-time feel** - Instant feedback for all user actions
- **Empty states** - Friendly illustrations and helpful messages

## 🔑 Key Features

### Authentication
- Email/password login and registration
- JWT access tokens (15min expiry)
- Automatic token refresh
- Protected routes with redirect

### Phone Numbers
- Search by area code
- View capabilities (SMS, Voice)
- Rent and release numbers
- Usage tracking per number

### Messages
- WhatsApp-style message threads
- Real-time message delivery
- Read receipts and status indicators
- Conversation management

### Calls
- WebRTC voice calling
- Dial pad interface
- Call history with filters
- Real-time call status updates

### Billing
- Subscription management
- Usage tracking and analytics
- Payment method management
- Billing history

## 🔗 API Integration

The frontend connects to the VoiceX backend API. Ensure the backend is running on `http://localhost:3000` (or update `.env.local`).

### API Endpoints Used
- `POST /api/auth/login` - User authentication
- `GET /api/numbers/mine` - Fetch user's phone numbers
- `POST /api/messages/send` - Send SMS
- `POST /api/calls/start` - Initiate calls
- `WebSocket` - Real-time updates

## 🎯 Environment Variables

```env
VITE_API_URL=http://localhost:3000/api    # Backend API URL
VITE_WS_URL=http://localhost:3000         # WebSocket URL
```

## 🚧 Development

### Code Style
- TypeScript strict mode enabled
- ESLint for linting
- Prettier for formatting (recommended)

### State Management
- **Zustand** for global state (auth, UI)
- **TanStack Query** for server state (API data)
- **Local state** for component-specific state

### API Calls
All API calls use React Query hooks for:
- Automatic caching
- Background refetching
- Optimistic updates
- Error handling

## 📱 Responsive Design

The app is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎉 Animations

Powered by Framer Motion:
- Page transitions (fade + slide)
- Hover effects (scale + glow)
- List animations (stagger)
- Success celebrations (confetti)
- Loading skeletons (shimmer)

## 🔒 Security

- Tokens stored in localStorage
- Automatic token refresh on 401
- CSRF protection via JWT
- Input validation with Zod
- XSS protection via React

## 🐛 Troubleshooting

### Build fails with Tailwind errors
- Ensure you're using Tailwind CSS v3
- Clear cache: `rm -rf .vite node_modules/.vite`
- Reinstall dependencies: `npm install`

### WebSocket connection fails
- Check backend is running
- Verify VITE_WS_URL in .env.local
- Check browser console for errors

### 401 Unauthorized errors
- Clear localStorage
- Login again
- Check access token expiry

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using React + TypeScript + Tailwind CSS
