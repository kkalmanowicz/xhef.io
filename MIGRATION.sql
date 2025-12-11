-- Migration script to add missing tables and columns to existing xhef.io databases
-- Run this AFTER running the complete DATABASE_SETUP.sql on a fresh database
-- OR run this on an existing database to add the missing components

-- Add updated_at columns to existing tables (if they don't exist)
DO $$
BEGIN
    -- Add updated_at to categories if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'updated_at') THEN
        ALTER TABLE categories ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;

    -- Add updated_at to vendors if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendors' AND column_name = 'updated_at') THEN
        ALTER TABLE vendors ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;

    -- Add updated_at to inventory_items if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inventory_items' AND column_name = 'updated_at') THEN
        ALTER TABLE inventory_items ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;

    -- Add updated_at to prep_items if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prep_items' AND column_name = 'updated_at') THEN
        ALTER TABLE prep_items ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Create missing tables (only if they don't exist)

-- Prep Item Ingredients table
CREATE TABLE IF NOT EXISTS prep_item_ingredients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prep_item_id UUID NOT NULL REFERENCES prep_items(id) ON DELETE CASCADE,
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    quantity DECIMAL(10,3) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipe Ingredients table
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES prep_items(id) ON DELETE CASCADE,
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

-- Order History table
CREATE TABLE IF NOT EXISTS order_history (
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

-- Enable RLS on new tables (if not already enabled)
DO $$
BEGIN
    -- Enable RLS for prep_item_ingredients
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'prep_item_ingredients' AND rowsecurity = true) THEN
        ALTER TABLE prep_item_ingredients ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Enable RLS for recipe_ingredients
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'recipe_ingredients' AND rowsecurity = true) THEN
        ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Enable RLS for order_history
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'order_history' AND rowsecurity = true) THEN
        ALTER TABLE order_history ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create RLS policies (drop existing ones if they exist)
DROP POLICY IF EXISTS "Users manage own prep item ingredients" ON prep_item_ingredients;
DROP POLICY IF EXISTS "Users manage own recipe ingredients" ON recipe_ingredients;
DROP POLICY IF EXISTS "Users manage own order history" ON order_history;

CREATE POLICY "Users manage own prep item ingredients" ON prep_item_ingredients FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own recipe ingredients" ON recipe_ingredients FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own order history" ON order_history FOR ALL USING (auth.uid() = user_id);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns (drop existing ones first)
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_vendors_updated_at ON vendors;
DROP TRIGGER IF EXISTS update_inventory_items_updated_at ON inventory_items;
DROP TRIGGER IF EXISTS update_prep_items_updated_at ON prep_items;
DROP TRIGGER IF EXISTS update_prep_item_ingredients_updated_at ON prep_item_ingredients;
DROP TRIGGER IF EXISTS update_recipe_ingredients_updated_at ON recipe_ingredients;

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

-- Create performance indexes (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_prep_item_ingredients_user_id ON prep_item_ingredients(user_id);
CREATE INDEX IF NOT EXISTS idx_prep_item_ingredients_prep_item_id ON prep_item_ingredients(prep_item_id);
CREATE INDEX IF NOT EXISTS idx_prep_item_ingredients_inventory_item_id ON prep_item_ingredients(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_user_id ON recipe_ingredients(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_inventory_item_id ON recipe_ingredients(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_prep_item_id ON recipe_ingredients(prep_item_id);
CREATE INDEX IF NOT EXISTS idx_order_history_user_id ON order_history(user_id);
CREATE INDEX IF NOT EXISTS idx_order_history_order_id ON order_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_history_inventory_item_id ON order_history(inventory_item_id);

-- Create updated_at indexes
CREATE INDEX IF NOT EXISTS idx_categories_updated_at ON categories(updated_at);
CREATE INDEX IF NOT EXISTS idx_vendors_updated_at ON vendors(updated_at);
CREATE INDEX IF NOT EXISTS idx_inventory_items_updated_at ON inventory_items(updated_at);
CREATE INDEX IF NOT EXISTS idx_prep_items_updated_at ON prep_items(updated_at);
CREATE INDEX IF NOT EXISTS idx_prep_item_ingredients_updated_at ON prep_item_ingredients(updated_at);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_updated_at ON recipe_ingredients(updated_at);