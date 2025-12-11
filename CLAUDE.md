# xhef.io - Claude Code Configuration & Development Guide

## Project Overview

**xhef.io** is a modern kitchen management system built for restaurants and food service operations. It provides comprehensive inventory tracking, prep item management, order processing, and waste tracking capabilities.

### Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **UI Components**: Radix UI primitives
- **Deployment**: Vercel with custom domain
- **Development**: Modern ES6+ with module imports

## Quick Start for Claude Code

### Environment Setup
1. Copy `.env.example` to `.env`
2. Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
3. Run the database setup:
   - Fresh database: Use `DATABASE_SETUP.sql`
   - Existing database: Use `MIGRATION.sql`

### Development Commands
```bash
npm install          # Install dependencies
npm run dev         # Start dev server (localhost:3000)
npm run build       # Production build
npm run preview     # Preview production build
```

### Database Management
- **Fresh Setup**: Run `DATABASE_SETUP.sql` in Supabase SQL Editor
- **Migration**: Run `MIGRATION.sql` for existing databases
- **Schema**: Auto-manages `updated_at` columns with triggers

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI primitives (buttons, inputs)
│   ├── inventory/      # Inventory management components
│   ├── prep/           # Prep items components
│   ├── orders/         # Order management components
│   └── recipes/        # Recipe components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── contexts/           # React context providers
├── lib/                # Utility functions
└── App.jsx            # Main app component
```

### Key Architecture Patterns

**Service Layer Pattern**: All database operations go through dedicated service files:
- `inventoryService.js` - Inventory CRUD operations
- `orderService.js` - Order management
- `prepService.js` - Prep item operations

**Custom Hooks Pattern**: Business logic separated into reusable hooks:
- `useInventoryActions.js` - Inventory operations
- `usePrepItemForm.js` - Prep item form logic
- `usePrepItemsData.js` - Real-time prep data

**Context-Based State**: Global state managed through contexts:
- `SupabaseContext.jsx` - Database and auth state
- Automatic real-time subscriptions for live updates

## Database Schema

### Core Tables
- **categories** - Item categorization
- **vendors** - Supplier information
- **inventory_items** - Stock tracking
- **prep_items** - Prepared food items
- **orders** - Purchase orders
- **events** - Event planning
- **waste_items** - Waste tracking

### Junction Tables
- **prep_item_ingredients** - Prep item recipes
- **recipe_ingredients** - Recipe compositions
- **order_history** - Historical order data
- **order_items** - Order line items

### Security
- **Row Level Security (RLS)** enabled on all tables
- User-scoped data access via `user_id` columns
- Real-time subscriptions respect RLS policies

## Development Workflow

### Making Changes
1. **Database Changes**: Update both `DATABASE_SETUP.sql` and `MIGRATION.sql`
2. **Component Changes**: Follow existing patterns in `/components`
3. **API Changes**: Update appropriate service files
4. **Testing**: Manually test in browser (no test suite yet)

### Code Style
- **Functional Components**: Use hooks, avoid class components
- **ES6+ Modules**: Use import/export syntax
- **Tailwind CSS**: Utility-first styling
- **Descriptive Naming**: Clear, readable function and variable names

### Git Workflow
- **Main Branch**: Production-ready code
- **Feature Branches**: For new features/fixes
- **Security**: Never commit `.env` files or API keys

## Common Tasks for Claude Code

### Adding New Features
1. **Database**: Add tables/columns to both SQL files
2. **Services**: Create/update service functions
3. **Hooks**: Add custom hooks for business logic
4. **Components**: Build UI components
5. **Pages**: Connect everything in route components

### Debugging Database Issues
1. Check Supabase logs for errors
2. Verify RLS policies allow user access
3. Ensure `user_id` is properly set in all queries
4. Check for missing table references

### Performance Optimization
- Add database indexes for frequent queries
- Use React.memo for expensive components
- Implement pagination for large data sets
- Optimize real-time subscriptions

## Known Issues & Solutions

### ❌ "Could not find 'updated_at' column"
**Solution**: Run `MIGRATION.sql` to add missing columns

### ❌ Missing table errors (prep_item_ingredients, etc.)
**Solution**: Use updated `DATABASE_SETUP.sql` or run `MIGRATION.sql`

### ❌ White loading screen on return visits
**Solution**: Fixed in `SupabaseContext.jsx` with timeout handling

### ❌ API key exposure
**Solution**: Removed hardcoded keys, use environment variables

## Claude Code Best Practices

### When Working on This Project
1. **Always read the current file** before making changes
2. **Check related service files** when modifying components
3. **Update both SQL files** when changing database schema
4. **Test locally** before suggesting production changes
5. **Follow existing patterns** in the codebase

### File Priority for Understanding
1. `src/contexts/SupabaseContext.jsx` - Core data access
2. `src/services/*.js` - Database operations
3. `src/hooks/use*.js` - Business logic
4. `DATABASE_SETUP.sql` - Complete schema
5. `src/App.jsx` - Route structure

### Common Debugging Commands
```bash
# Check development server status
npm run dev

# View environment variables
cat .env

# Check for TypeScript errors (if applicable)
npx tsc --noEmit

# Run database migration
# (Copy MIGRATION.sql to Supabase SQL Editor)
```

## Future Improvements

### Immediate (1-2 weeks)
- [ ] Add ESLint + Prettier configuration
- [ ] Implement unit testing with Vitest
- [ ] Add error boundaries for better UX
- [ ] Create TypeScript migration plan

### Medium-term (1-2 months)
- [ ] Add comprehensive test coverage
- [ ] Implement CI/CD pipeline
- [ ] Add performance monitoring
- [ ] Create mobile-responsive improvements

### Long-term (3-6 months)
- [ ] Add internationalization (i18n)
- [ ] Implement advanced reporting
- [ ] Add inventory forecasting
- [ ] Create mobile app version

## Support & Resources

- **Documentation**: This file and `README.md`
- **Database Schema**: `DATABASE_SETUP.sql`
- **Environment Setup**: `.env.example`
- **Contributing**: `CONTRIBUTING.md`
- **Security**: `SECURITY.md`

---

*This configuration is designed to maximize productivity when working with Claude Code on the xhef.io project. Always prioritize security and follow existing patterns.*