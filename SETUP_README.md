# xhef.io - Kitchen Management System

## 🚀 Quick Setup (5 minutes)

### 1. Create New Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy your project URL and anon key

### 2. Set up Database
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the entire `DATABASE_SETUP.sql` file
3. Click **Run** - that's it! ✅

### 3. Configure Environment
1. Copy `.env.example` to `.env`
2. Add your Supabase URL and key:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run the App
```bash
npm install
npm run dev
```

## 🎯 That's It!

- **Sign up** → Get your own isolated kitchen data
- **Start adding** inventory, vendors, prep items
- **Multi-tenant** → Each user has their own data
- **Real-time** → Changes sync instantly

## 🛠 Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Deployment**: Vercel

## 📊 Features
- ✅ Inventory management with stock levels
- ✅ Vendor and supplier tracking
- ✅ Prep item planning and workflow
- ✅ Order management and tracking
- ✅ Event planning and covers
- ✅ Waste tracking and cost analysis
- ✅ Real-time updates across devices
- ✅ Multi-user with data isolation

## 🔒 Security
- Row Level Security (RLS) ensures data isolation
- User authentication via Supabase Auth
- All data scoped to authenticated users

---

**No complex migrations. No manual data assignment. Just run the SQL file and start cooking! 👨‍🍳**