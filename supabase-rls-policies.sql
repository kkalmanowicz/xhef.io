-- Row Level Security (RLS) Policies for xhef.io
-- Run these commands AFTER creating the schema

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE prep_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_prep_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE prep_item_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- For now, allow all operations for authenticated users
-- In production, you might want more granular permissions based on user roles

-- Categories policies
CREATE POLICY "Allow all operations for authenticated users" ON categories
    FOR ALL USING (auth.role() = 'authenticated');

-- Vendors policies
CREATE POLICY "Allow all operations for authenticated users" ON vendors
    FOR ALL USING (auth.role() = 'authenticated');

-- Inventory items policies
CREATE POLICY "Allow all operations for authenticated users" ON inventory_items
    FOR ALL USING (auth.role() = 'authenticated');

-- Prep items policies
CREATE POLICY "Allow all operations for authenticated users" ON prep_items
    FOR ALL USING (auth.role() = 'authenticated');

-- Recipes policies
CREATE POLICY "Allow all operations for authenticated users" ON recipes
    FOR ALL USING (auth.role() = 'authenticated');

-- Recipe ingredients policies
CREATE POLICY "Allow all operations for authenticated users" ON recipe_ingredients
    FOR ALL USING (auth.role() = 'authenticated');

-- Recipe prep items policies
CREATE POLICY "Allow all operations for authenticated users" ON recipe_prep_items
    FOR ALL USING (auth.role() = 'authenticated');

-- Prep item ingredients policies
CREATE POLICY "Allow all operations for authenticated users" ON prep_item_ingredients
    FOR ALL USING (auth.role() = 'authenticated');

-- Orders policies
CREATE POLICY "Allow all operations for authenticated users" ON orders
    FOR ALL USING (auth.role() = 'authenticated');

-- Order items policies
CREATE POLICY "Allow all operations for authenticated users" ON order_items
    FOR ALL USING (auth.role() = 'authenticated');

-- Order history policies
CREATE POLICY "Allow all operations for authenticated users" ON order_history
    FOR ALL USING (auth.role() = 'authenticated');

-- Events policies
CREATE POLICY "Allow all operations for authenticated users" ON events
    FOR ALL USING (auth.role() = 'authenticated');

-- Waste items policies
CREATE POLICY "Allow all operations for authenticated users" ON waste_items
    FOR ALL USING (auth.role() = 'authenticated');

-- Inventory transactions policies
CREATE POLICY "Allow all operations for authenticated users" ON inventory_transactions
    FOR ALL USING (auth.role() = 'authenticated');

-- Activity log policies (read-only for most users)
CREATE POLICY "Allow read for authenticated users" ON activity_log
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users" ON activity_log
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow anonymous users to read public data if needed (currently none)
-- This can be expanded later for public-facing features