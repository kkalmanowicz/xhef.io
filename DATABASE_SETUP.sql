-- xhef.io Kitchen Management - Complete Database Setup
-- Run this ONCE in a fresh Supabase project to set up everything
-- This is the ONLY file needed for database setup

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core Categories table
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6B7280',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendors table
CREATE TABLE vendors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory Items table
CREATE TABLE inventory_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    current_stock DECIMAL(10,2) DEFAULT 0,
    par_level DECIMAL(10,2) DEFAULT 0,
    default_price DECIMAL(10,2),
    last_price DECIMAL(10,2),
    sku VARCHAR(255),
    is_custom_item BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prep Items table
CREATE TABLE prep_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    yield_unit VARCHAR(50) NOT NULL,
    current_stock DECIMAL(10,2) DEFAULT 0,
    par_level DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    station VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    order_number VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    order_date DATE DEFAULT CURRENT_DATE,
    total_amount DECIMAL(10,2),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items table
CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    price_per_unit DECIMAL(10,2),
    total_price DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    expected_covers INTEGER,
    status VARCHAR(50) DEFAULT 'planned',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Waste Items table
CREATE TABLE waste_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    reason VARCHAR(255),
    cost_impact DECIMAL(10,2),
    waste_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity Log table
CREATE TABLE activity_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    table_name VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Profiles table
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    restaurant_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prep Item Ingredients table (junction table for prep items and their required inventory)
CREATE TABLE prep_item_ingredients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prep_item_id UUID NOT NULL REFERENCES prep_items(id) ON DELETE CASCADE,
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    quantity DECIMAL(10,3) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipe Ingredients table (junction table for recipes and their required inventory)
CREATE TABLE recipe_ingredients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES prep_items(id) ON DELETE CASCADE, -- Recipes are stored as prep_items with type 'recipe'
    inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE SET NULL,
    prep_item_id UUID REFERENCES prep_items(id) ON DELETE SET NULL,
    quantity DECIMAL(10,3) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT recipe_ingredients_item_check CHECK (
        (inventory_item_id IS NOT NULL AND prep_item_id IS NULL) OR
        (inventory_item_id IS NULL AND prep_item_id IS NOT NULL)
    )
);

-- Order History table (tracks historical order data for reordering)
CREATE TABLE order_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE SET NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    price_per_unit DECIMAL(10,2),
    total_price DECIMAL(10,2),
    vendor_name VARCHAR(255),
    order_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE prep_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE prep_item_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_history ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (users can only access their own data)
CREATE POLICY "Users manage own categories" ON categories FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own vendors" ON vendors FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own inventory" ON inventory_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own prep items" ON prep_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own orders" ON orders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own order items" ON order_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own events" ON events FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own waste" ON waste_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own activity" ON activity_log FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own profile" ON user_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users manage own prep item ingredients" ON prep_item_ingredients FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own recipe ingredients" ON recipe_ingredients FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own order history" ON order_history FOR ALL USING (auth.uid() = user_id);

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic updated_at timestamp updates
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at
    BEFORE UPDATE ON vendors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at
    BEFORE UPDATE ON inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prep_items_updated_at
    BEFORE UPDATE ON prep_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prep_item_ingredients_updated_at
    BEFORE UPDATE ON prep_item_ingredients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipe_ingredients_updated_at
    BEFORE UPDATE ON recipe_ingredients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Performance indexes
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_vendors_user_id ON vendors(user_id);
CREATE INDEX idx_inventory_items_user_id ON inventory_items(user_id);
CREATE INDEX idx_prep_items_user_id ON prep_items(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_user_id ON order_items(user_id);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_waste_items_user_id ON waste_items(user_id);
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);

-- Performance indexes for new tables
CREATE INDEX idx_prep_item_ingredients_user_id ON prep_item_ingredients(user_id);
CREATE INDEX idx_prep_item_ingredients_prep_item_id ON prep_item_ingredients(prep_item_id);
CREATE INDEX idx_prep_item_ingredients_inventory_item_id ON prep_item_ingredients(inventory_item_id);
CREATE INDEX idx_recipe_ingredients_user_id ON recipe_ingredients(user_id);
CREATE INDEX idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_ingredients_inventory_item_id ON recipe_ingredients(inventory_item_id);
CREATE INDEX idx_recipe_ingredients_prep_item_id ON recipe_ingredients(prep_item_id);
CREATE INDEX idx_order_history_user_id ON order_history(user_id);
CREATE INDEX idx_order_history_order_id ON order_history(order_id);
CREATE INDEX idx_order_history_inventory_item_id ON order_history(inventory_item_id);

-- Performance indexes for updated_at columns
CREATE INDEX idx_categories_updated_at ON categories(updated_at);
CREATE INDEX idx_vendors_updated_at ON vendors(updated_at);
CREATE INDEX idx_inventory_items_updated_at ON inventory_items(updated_at);
CREATE INDEX idx_prep_items_updated_at ON prep_items(updated_at);
CREATE INDEX idx_prep_item_ingredients_updated_at ON prep_item_ingredients(updated_at);
CREATE INDEX idx_recipe_ingredients_updated_at ON recipe_ingredients(updated_at);