# xhef.io - Smart Kitchen Management System

A comprehensive web application for restaurant and kitchen management, featuring AI-powered inventory tracking, prep list generation, and complete kitchen operations optimization.

## Features

- 🍳 **Smart Inventory Management** - Track ingredients and supplies with precision
- 📋 **Prep List Management** - Organize kitchen preparation workflows
- 📦 **Order Management** - Complete order tracking and completion system
- 📊 **Real-time Dashboard** - Live kitchen operations overview
- 🗓️ **Event & Schedule Management** - Plan and manage kitchen events
- 📈 **Waste Tracking** - Monitor and reduce food waste
- 👥 **User Authentication** - Secure login and user management
- 🔧 **Admin Panel** - Administrative controls and settings
- 📱 **Responsive Design** - Works perfectly on all devices

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Radix UI
- **Backend**: Supabase (Database, Auth, Real-time)
- **Routing**: React Router v6 with nested routes
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kkalmanowicz/xhef-io.git
cd xhef-io
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your Supabase credentials in `.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_NAME=xhef.io
VITE_APP_URL=https://app.xhef.io
```

4. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── ui/          # Base UI components (buttons, dialogs, etc.)
├── pages/           # Page components
├── contexts/        # React contexts (Supabase, etc.)
├── hooks/           # Custom React hooks
├── lib/             # Utilities and configurations
├── services/        # API services and business logic
├── App.jsx          # Main app component with routing
└── main.jsx         # Application entry point
```

## Key Features

### Dashboard
- Overview of kitchen operations
- Quick access to all major functions
- Real-time status updates

### Inventory Management
- Track stock levels
- Manage categories and vendors
- Set par levels and alerts

### Prep Management
- Create and manage prep items
- Generate prep lists
- Track completion status

### Order Management
- Process orders
- Track order completion
- Historical order data

### Events & Scheduling
- Plan kitchen events
- Schedule management
- Calendar integration

### Waste Tracking
- Monitor food waste
- Track waste reasons
- Generate waste reports

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy automatically on every push to main

### Manual Build

```bash
npm run build
```

The `dist` folder contains the production build.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xyz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | `eyJhbG...` |
| `VITE_APP_NAME` | Application name | `xhef.io` |
| `VITE_APP_URL` | Application URL | `https://app.xhef.io` |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@xhef.io or create an issue on GitHub.

---

Built with ❤️ for the culinary industry