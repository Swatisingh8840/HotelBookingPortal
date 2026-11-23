-- ==============================================================
-- Thomas Cook Hotel Booking Portal - Sample Seed Data
-- Includes Premier Indian Destinations (Mumbai, Varanasi, Pune) & Global Hubs
-- Prices strictly configured between ₹2,000 and ₹3,000 for Indian properties
-- ==============================================================

USE hotel_booking_db;

-- Clear previous data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE bookings;
TRUNCATE TABLE hotel_amenities;
TRUNCATE TABLE rooms;
TRUNCATE TABLE hotels;
TRUNCATE TABLE amenities;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Amenities Catalog
INSERT INTO amenities (id, name, icon_code) VALUES
(1, 'Free High-Speed Wi-Fi', 'wifi'),
(2, 'Outdoor Swimming Pool', 'pool'),
(3, 'Luxury Wellness Spa', 'spa'),
(4, 'Complimentary Gourmet Breakfast', 'restaurant'),
(5, '24/7 Fitness Center', 'fitness_center'),
(6, 'Airport Shuttle Transfer', 'airport_shuttle'),
(7, 'Private Balcony / River View', 'balcony'),
(8, '24/7 Concierge & Room Service', 'room_service'),
(9, 'Secure Valet Parking', 'local_parking');

-- 2. Insert Genuine Hotels (India: Mumbai, Varanasi, Pune + Global)
INSERT INTO hotels (id, name, city, address, description, rating, image_url, contact_phone, contact_email) VALUES
-- Mumbai, India
(1, 'The Taj Mahal Palace, Mumbai', 'Mumbai', 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001, India', 
 'An iconic landmark standing gracefully opposite the Gateway of India since 1903. Blends rich Indian architectural heritage with contemporary luxury, renowned sea-facing harbor views, and royal hospitality.', 
 4.9, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', '+91 22 6665 3366', 'reservations.mumbai@tajhotels.com'),

-- Varanasi, India
(2, 'BrijRama Palace Heritage Hotel', 'Varanasi', 'Darbhanga Ghat, Dashashwamedh, Varanasi, Uttar Pradesh 221001, India', 
 'Perched majestically on the historical Darbhanga Ghat along the sacred River Ganges. Built in the 18th century as a royal palace, offering private boat rides, classical morning ragas, and authentic Banarasi thalis.', 
 4.8, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80', '+91 542 245 4444', 'stay@brijramapalace.com'),

-- Pune, India
(3, 'JW Marriott Hotel Pune', 'Pune', 'Senapati Bapat Rd, Laxmi Society, Model Colony, Shivajinagar, Pune, Maharashtra 411053, India', 
 'A premier 5-star luxury address situated in the prime business and cultural district of Pune. Features an expansive Quan Spa, rooftop lounge overlooking Senapati Bapat Road, and award-winning international dining.', 
 4.7, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', '+91 20 6683 3333', 'jw.pune@marriotthotels.com'),

-- Varanasi, India (Second Genuine Property)
(4, 'Taj Ganges, Varanasi', 'Varanasi', 'Nadesar Palace Grounds, Cantonment, Varanasi, Uttar Pradesh 221002, India', 
 'Set amidst 40 acres of lush green gardens in the serene Cantonment area. Features tranquil peacock gardens, soothing Ayurvedic wellness therapies, and refined traditional hospitality close to Varanasi City Center.', 
 4.8, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80', '+91 542 666 0001', 'tajganges.varanasi@tajhotels.com'),

-- Mumbai, India (Second Genuine Property)
(5, 'Trident Hotel, Nariman Point Mumbai', 'Mumbai', 'CR 2 Nariman Point, Netaji Subhash Chandra Bose Rd, Mumbai, Maharashtra 400021, India', 
 'Soaring 35 stories above Marine Drive, offering panoramic vistas of the Arabian Sea and the glittering Queen\'s Necklace. Boasts modern business amenities, an oceanfront pool, and quick access to South Mumbai.', 
 4.8, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80', '+91 22 6632 4343', 'trident.narimanpoint@tridenthotels.com'),

-- Pune, India (Second Genuine Property)
(6, 'The Ritz-Carlton, Pune', 'Pune', 'Golf Course Square, Airport Rd, Yerawada, Pune, Maharashtra 411006, India', 
 'Overlooking the lush 100-acre Poona Club Golf Course, The Ritz-Carlton Pune defines contemporary grandeur with private club lounges, custom afternoon teas, and an exquisite wellness sanctuary.', 
 4.9, 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', '+91 20 6767 5000', 'rc.pune.reservation@ritzcarlton.com');

-- 3. Associate Amenities with Hotels
-- 1. Taj Mahal Palace Mumbai
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 8), (1, 9);

-- 2. BrijRama Palace Varanasi
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES 
(2, 1), (2, 3), (2, 4), (2, 7), (2, 8), (2, 9);

-- 3. JW Marriott Pune
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES 
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 8), (3, 9);

-- 4. Taj Ganges Varanasi
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES 
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6), (4, 8);

-- 5. Trident Nariman Point Mumbai
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES 
(5, 1), (5, 2), (5, 4), (5, 5), (5, 7), (5, 8), (5, 9);

-- 6. The Ritz-Carlton Pune
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES 
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 7), (6, 8), (6, 9);

-- 4. Insert Room Types with Pricing strictly between ₹2,000 and ₹3,000
-- Rooms for Hotel 1: The Taj Mahal Palace, Mumbai
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(101, 1, 'Heritage Wing Superior Room', 2400.00, 8, 2, 'Warm classical Indian interiors with modern comforts, plush king bedding, and city view.'),
(102, 1, 'Tower Ocean View Deluxe Suite', 2850.00, 5, 2, 'Spacious suite overlooking the Arabian Sea and Gateway of India with luxury marble bath.');

-- Rooms for Hotel 2: BrijRama Palace, Varanasi
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(201, 2, 'Ganga Darshan Heritage Room', 2200.00, 6, 2, 'Authentic Maratha architecture, royal silk tapestries, and serene views of the morning Ganges aarti.'),
(202, 2, 'Maharaja Luxury Riverfront Suite', 2900.00, 3, 2, 'Grand antique-furnished suite with private balcony overlooking the historic ghats.');

-- Rooms for Hotel 3: JW Marriott Hotel Pune
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(301, 3, 'Deluxe Executive King Room', 2300.00, 10, 2, 'Sleek contemporary design with ergonomic workstation, luxury rain shower, and high-speed Wi-Fi.'),
(302, 3, 'Premier Club Skyline Suite', 2800.00, 5, 3, 'High-floor suite with expansive living area, city views, and exclusive Club Lounge breakfast access.');

-- Rooms for Hotel 4: Taj Ganges, Varanasi
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(401, 4, 'Superior Garden Facing Room', 2100.00, 8, 2, 'Peaceful green garden views, signature Taj bedding, and fine tea/coffee amenities.'),
(402, 4, 'Executive Palace Suite', 2650.00, 4, 3, 'Generous suite with separate parlor area, fruit basket, and complimentary airport drop.');

-- Rooms for Hotel 5: Trident Hotel, Nariman Point Mumbai
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(501, 5, 'Superior Marine City Room', 2500.00, 7, 2, 'Soundproofed modern room with custom posturepedic mattress and vibrant South Mumbai skyline view.'),
(502, 5, 'Queen\'s Necklace Ocean Suite', 2950.00, 4, 2, 'Unobstructed panoramic view of the Marine Drive promenade, deep bathtub, and evening cocktails.');

-- Rooms for Hotel 6: The Ritz-Carlton, Pune
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(601, 6, 'Deluxe Golf Course View Room', 2600.00, 6, 2, 'Floor-to-ceiling windows overlooking Poona Golf Course, Frette linens, and marble bathroom.'),
(602, 6, 'Carlton Luxury Royal Suite', 3000.00, 3, 3, 'Expansive master bedroom with walk-in closet, personalized butler attention, and golf club privileges.');

-- 5. Insert Sample Seed Bookings for Demo Lookup
INSERT INTO bookings (id, booking_reference, room_id, customer_name, customer_email, check_in_date, check_out_date, total_nights, total_price, status) VALUES
(1, 'TC-BK-100201', 101, 'Rahul Sharma', 'rahul.sharma@mumbai.com', '2026-12-10', '2026-12-12', 2, 4800.00, 'CONFIRMED'),
(2, 'TC-BK-100202', 201, 'Priya Verma', 'priya.verma@varanasi.com', '2026-12-15', '2026-12-18', 3, 6600.00, 'CONFIRMED');
