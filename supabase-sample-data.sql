-- Sample data for xhef.io Kitchen Management System
-- Run this AFTER the schema and RLS policies are set up

-- Insert sample categories
INSERT INTO categories (name, description, color) VALUES
('Proteins', 'Meat, fish, and protein sources', '#FF6B6B'),
('Vegetables', 'Fresh vegetables and produce', '#4ECDC4'),
('Dairy', 'Dairy products and eggs', '#45B7D1'),
('Grains', 'Rice, pasta, bread, and grains', '#96CEB4'),
('Spices', 'Herbs and spices', '#FECA57'),
('Beverages', 'Drinks and liquids', '#FF9FF3'),
('Prep Items', 'Prepared ingredients', '#54A0FF');

-- Insert sample vendors
INSERT INTO vendors (name, contact_person, email, phone, address) VALUES
('Fresh Valley Farms', 'John Smith', 'john@freshvalley.com', '555-0101', '123 Farm Road, Valley City, CA'),
('Ocean Harvest Seafood', 'Maria Garcia', 'maria@oceanharvest.com', '555-0102', '456 Harbor Blvd, Coastal City, CA'),
('Mountain Dairy Co', 'David Wilson', 'david@mountaindairy.com', '555-0103', '789 Mountain View Dr, Hill Town, CA'),
('Spice World Trading', 'Lisa Chen', 'lisa@spiceworld.com', '555-0104', '321 Trade Center, Import City, CA'),
('Local Grocery Supply', 'Mike Johnson', 'mike@localgrocery.com', '555-0105', '654 Main Street, Local Town, CA');

-- Get category IDs for reference
-- Note: In a real scenario, you'd use the actual UUIDs returned from the category inserts

-- Insert sample inventory items
INSERT INTO inventory_items (name, category_id, vendor_id, unit, cost_per_unit, current_stock, min_stock, max_stock)
SELECT
    item.name,
    c.id as category_id,
    v.id as vendor_id,
    item.unit,
    item.cost_per_unit,
    item.current_stock,
    item.min_stock,
    item.max_stock
FROM (
    VALUES
        ('Chicken Breast', 'Proteins', 'Fresh Valley Farms', 'lbs', 8.99, 25.0, 10.0, 100.0),
        ('Ground Beef', 'Proteins', 'Fresh Valley Farms', 'lbs', 6.99, 30.0, 15.0, 80.0),
        ('Salmon Fillet', 'Proteins', 'Ocean Harvest Seafood', 'lbs', 15.99, 12.0, 5.0, 40.0),
        ('Romaine Lettuce', 'Vegetables', 'Fresh Valley Farms', 'heads', 1.99, 20.0, 10.0, 50.0),
        ('Tomatoes', 'Vegetables', 'Fresh Valley Farms', 'lbs', 3.99, 15.0, 8.0, 60.0),
        ('Yellow Onions', 'Vegetables', 'Fresh Valley Farms', 'lbs', 1.49, 40.0, 20.0, 100.0),
        ('Whole Milk', 'Dairy', 'Mountain Dairy Co', 'gallons', 4.99, 8.0, 5.0, 20.0),
        ('Large Eggs', 'Dairy', 'Mountain Dairy Co', 'dozens', 3.99, 12.0, 8.0, 30.0),
        ('Cheddar Cheese', 'Dairy', 'Mountain Dairy Co', 'lbs', 8.99, 6.0, 3.0, 15.0),
        ('Jasmine Rice', 'Grains', 'Local Grocery Supply', 'lbs', 2.99, 50.0, 25.0, 200.0),
        ('Pasta - Penne', 'Grains', 'Local Grocery Supply', 'lbs', 1.99, 30.0, 15.0, 100.0),
        ('All-Purpose Flour', 'Grains', 'Local Grocery Supply', 'lbs', 2.49, 25.0, 10.0, 80.0),
        ('Black Pepper', 'Spices', 'Spice World Trading', 'oz', 12.99, 2.0, 1.0, 10.0),
        ('Sea Salt', 'Spices', 'Spice World Trading', 'lbs', 3.99, 3.0, 2.0, 15.0),
        ('Olive Oil', 'Spices', 'Spice World Trading', 'liters', 15.99, 4.0, 2.0, 12.0)
) AS item(name, category_name, vendor_name, unit, cost_per_unit, current_stock, min_stock, max_stock)
JOIN categories c ON c.name = item.category_name
JOIN vendors v ON v.name = item.vendor_name;

-- Insert sample prep items
INSERT INTO prep_items (name, category_id, unit, prep_time_minutes, shelf_life_hours, current_stock, min_stock, max_stock, cost_per_unit)
SELECT
    item.name,
    c.id as category_id,
    item.unit,
    item.prep_time_minutes,
    item.shelf_life_hours,
    item.current_stock,
    item.min_stock,
    item.max_stock,
    item.cost_per_unit
FROM (
    VALUES
        ('Diced Onions', 'Prep Items', 'cups', 15, 48, 5.0, 2.0, 20.0, 0.75),
        ('Chopped Lettuce', 'Prep Items', 'cups', 10, 24, 8.0, 5.0, 30.0, 0.50),
        ('Cooked Rice', 'Prep Items', 'cups', 25, 72, 10.0, 5.0, 40.0, 1.25),
        ('Grilled Chicken Strips', 'Prep Items', 'lbs', 20, 48, 3.0, 2.0, 15.0, 12.99),
        ('House Salad Mix', 'Prep Items', 'portions', 30, 24, 12.0, 8.0, 50.0, 2.25)
) AS item(name, category_name, unit, prep_time_minutes, shelf_life_hours, current_stock, min_stock, max_stock, cost_per_unit)
JOIN categories c ON c.name = item.category_name;

-- Insert a sample recipe
INSERT INTO recipes (name, description, instructions, prep_time_minutes, cook_time_minutes, yield_amount, yield_unit, cost_per_batch)
VALUES (
    'Chicken Caesar Salad',
    'Classic Caesar salad with grilled chicken breast',
    '1. Grill chicken breast and slice into strips\n2. Wash and chop romaine lettuce\n3. Prepare Caesar dressing\n4. Toss lettuce with dressing\n5. Top with chicken strips and serve',
    15,
    20,
    4,
    'servings',
    18.50
);

-- Insert sample events
INSERT INTO events (title, description, start_date, end_date, expected_covers, event_type, status)
VALUES
    ('Lunch Service', 'Regular lunch service', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '3 hours', 150, 'restaurant service', 'planned'),
    ('Private Catering Event', 'Wedding reception catering', NOW() + INTERVAL '1 week', NOW() + INTERVAL '1 week' + INTERVAL '6 hours', 200, 'catering', 'planned'),
    ('Holiday Menu Launch', 'Special holiday menu testing', NOW() + INTERVAL '2 weeks', NOW() + INTERVAL '2 weeks' + INTERVAL '4 hours', 75, 'special event', 'planned');

-- Insert a sample order
INSERT INTO orders (vendor_id, order_number, status, order_date, expected_delivery_date, total_amount, notes)
SELECT
    v.id,
    'ORD-2024-001',
    'pending',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '2 days',
    250.00,
    'Weekly produce order'
FROM vendors v WHERE v.name = 'Fresh Valley Farms' LIMIT 1;