-- PostgreSQL schema for Wastify


CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE UNIQUE INDEX idx_users_email ON Users(email);

CREATE TABLE Households (
    household_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    barangay VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL
);

CREATE TABLE WasteCategories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    disposal_instructions TEXT
);

CREATE TABLE CollectionSchedules (
    schedule_id SERIAL PRIMARY KEY,
    barangay VARCHAR(100) NOT NULL,
    collection_day VARCHAR(20) NOT NULL,
    time TIME NOT NULL
);

CREATE TABLE Routes (
    route_id SERIAL PRIMARY KEY,
    truck_id VARCHAR(50) NOT NULL,
    area VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL
);

CREATE TABLE Rewards (
    reward_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    date_earned DATE DEFAULT CURRENT_DATE NOT NULL
);

CREATE TABLE Notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE MissedPickups (
    pickup_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    barangay VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE WasteItems (
    item_id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES WasteCategories(category_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    disposal_instructions TEXT
);

CREATE INDEX idx_rewards_user_id ON Rewards(user_id);
CREATE INDEX idx_notifications_user_id ON Notifications(user_id);
CREATE INDEX idx_missed_pickups_user_id ON MissedPickups(user_id);
CREATE INDEX idx_waste_items_category_id ON WasteItems(category_id);
CREATE INDEX idx_households_user_id ON Households(user_id);
CREATE INDEX idx_schedules_barangay ON CollectionSchedules(barangay);

-- Seed waste categories
INSERT INTO WasteCategories (name, description, image_url, disposal_instructions) VALUES
('Biodegradable', 'Organic waste that decomposes naturally', '/images/biodegradable.png', 'Place in green bin. Includes food scraps, yard waste, paper.'),
('Recyclable', 'Materials that can be reprocessed', '/images/recyclable.png', 'Place in blue bin. Clean and dry plastics, glass, metals, paper.'),
('Residual', 'Non-recyclable, non-hazardous waste', '/images/residual.png', 'Place in black bin. Includes ceramics, soiled items, diapers.'),
('Hazardous', 'Dangerous or toxic materials', '/images/hazardous.png', 'Bring to designated collection center. Batteries, chemicals, e-waste.');

-- Seed sample waste items
INSERT INTO WasteItems (category_id, name, description, disposal_instructions) VALUES
(1, 'Food Scraps', 'Leftover food, fruit peels, vegetable cuttings', 'Compost or place in green bin'),
(1, 'Yard Waste', 'Leaves, grass clippings, branches', 'Place in green bin or compost pile'),
(1, 'Paper Napkins', 'Used paper towels and napkins', 'Place in green bin'),
(2, 'Plastic Bottles', 'PET and HDPE bottles', 'Rinse, remove cap, place in blue bin'),
(2, 'Glass Bottles', 'Clear and colored glass containers', 'Rinse and place in blue bin'),
(2, 'Aluminum Cans', 'Soda and beer cans', 'Rinse and place in blue bin'),
(2, 'Cardboard', 'Boxes and packaging', 'Flatten and place in blue bin'),
(3, 'Ceramic Items', 'Broken plates, mugs', 'Wrap in paper and place in black bin'),
(3, 'Diapers', 'Used disposable diapers', 'Seal in bag and place in black bin'),
(4, 'Batteries', 'AA, AAA, lithium, car batteries', 'Bring to hazardous waste collection center'),
(4, 'Paint', 'Leftover paint cans', 'Bring to hazardous waste collection center'),
(4, 'Electronics', 'Old phones, computers, cables', 'Bring to e-waste collection center');
