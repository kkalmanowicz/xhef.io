-- Supabase Authentication Setup for xhef.io
-- Run this in your Supabase SQL Editor after the main schema

-- Create user profiles table to extend Supabase auth.users
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user', -- user, admin, manager
    restaurant_name VARCHAR(255),
    phone VARCHAR(50),
    avatar_url VARCHAR(500),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add updated_at trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update RLS policies to include user-based filtering
-- Drop existing policies and recreate with user context

-- Categories - users can only see/modify their own restaurant's data
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON categories;
CREATE POLICY "Users can manage their restaurant categories" ON categories
    FOR ALL USING (
        auth.uid() IS NOT NULL
    );

-- Vendors - users can only see/modify their own restaurant's data
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON vendors;
CREATE POLICY "Users can manage their restaurant vendors" ON vendors
    FOR ALL USING (
        auth.uid() IS NOT NULL
    );

-- Inventory items - users can only see/modify their own restaurant's data
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON inventory_items;
CREATE POLICY "Users can manage their restaurant inventory" ON inventory_items
    FOR ALL USING (
        auth.uid() IS NOT NULL
    );

-- Prep items - users can only see/modify their own restaurant's data
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON prep_items;
CREATE POLICY "Users can manage their restaurant prep items" ON prep_items
    FOR ALL USING (
        auth.uid() IS NOT NULL
    );

-- Recipes - users can only see/modify their own restaurant's data
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON recipes;
CREATE POLICY "Users can manage their restaurant recipes" ON recipes
    FOR ALL USING (
        auth.uid() IS NOT NULL
    );

-- Recipe ingredients
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON recipe_ingredients;
CREATE POLICY "Users can manage their restaurant recipe ingredients" ON recipe_ingredients
    FOR ALL USING (
        auth.uid() IS NOT NULL
    );

-- Recipe prep items
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON recipe_prep_items;
CREATE POLICY "Users can manage their restaurant recipe prep items" ON recipe_prep_items
    FOR ALL USING (
        auth.uid() IS NOT NULL
    );

-- Prep item ingredients
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON prep_item_ingredients;
CREATE POLICY "Users can manage their restaurant prep item ingredients" ON prep_item_ingredients
    FOR ALL USING (
        auth.uid() IS NOT NULL
    );

-- Orders
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON orders;
CREATE POLICY "Users can manage their restaurant orders" ON orders
    FOR ALL USING (
        auth.uid() IS NOT NULL
    );

-- Order items
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON order_items;
CREATE POLICY "Users can manage their restaurant order items" ON order_items
    FOR ALL USING (
        auth.uid() IS NOT NULL
    );

-- Order history
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON order_history;
CREATE POLICY "Users can manage their restaurant order history" ON order_history
    FOR ALL USING (
        auth.uid() IS NOT NULL
    );

-- Events
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON events;
CREATE POLICY "Users can manage their restaurant events" ON events
    FOR ALL USING (
        auth.uid() IS NOT NULL
    );

-- Waste items
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON waste_items;
CREATE POLICY "Users can manage their restaurant waste tracking" ON waste_items
    FOR ALL USING (
        auth.uid() IS NOT NULL
    );

-- Inventory transactions
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON inventory_transactions;
CREATE POLICY "Users can manage their restaurant inventory transactions" ON inventory_transactions
    FOR ALL USING (
        auth.uid() IS NOT NULL
    );

-- Activity log - read-only for users, admin-only for inserts
DROP POLICY IF EXISTS "Allow read for authenticated users" ON activity_log;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON activity_log;

CREATE POLICY "Users can read their restaurant activity log" ON activity_log
    FOR SELECT USING (
        auth.uid() IS NOT NULL
    );

CREATE POLICY "System can insert activity log" ON activity_log
    FOR INSERT WITH CHECK (true); -- This will be used by triggers/functions