-- ==============================================================
-- Thomas Cook Hotel Booking Portal - Sample Seed Data
-- ==============================================================

USE hotel_booking_db;

-- 1. Insert Amenities Catalog
INSERT INTO amenities (id, name, icon_code) VALUES
(1, 'Free High-Speed Wi-Fi', 'wifi'),
(2, 'Outdoor Swimming Pool', 'pool'),
(3, 'Luxury Wellness Spa', 'spa'),
(4, 'Complimentary Gourmet Breakfast', 'restaurant'),
(5, '24/7 Fitness Center', 'fitness_center'),
(6, 'Airport Shuttle Transfer', 'airport_shuttle'),
(7, 'Private Ocean / Skyline Balcony', 'balcony'),
(8, '24/7 Concierge & Room Service', 'room_service'),
(9, 'Secure Valet Parking', 'local_parking');

-- 2. Insert Hotels (6 Premier Destinations)
INSERT INTO hotels (id, name, city, address, description, rating, image_url, contact_phone, contact_email) VALUES
(1, 'The Grand London Heritage Hotel', 'London', '10 Westminster Bridge Rd, London SE1 7PB, United Kingdom', 
 'Overlooking the iconic River Thames and Big Ben, The Grand London Heritage combines timeless British elegance with contemporary 5-star luxury, featuring afternoon tea lounges and world-class hospitality.', 
 4.9, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', '+44 20 7946 0192', 'reservations@grandlondonheritage.co.uk'),

(2, 'Hôtel Plaza Lumière Paris', 'Paris', '25 Avenue Montaigne, 75008 Paris, France', 
 'Nestled in the golden triangle of Parisian haute couture, Hôtel Plaza Lumière offers romantic Haussmann-style architecture, bespoke French cuisine, and breathtaking Eiffel Tower views.', 
 4.8, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80', '+33 1 53 67 00 00', 'bonjour@plazalumiereparis.fr'),

(3, 'Atlantis Royal Horizon Resort', 'Dubai', 'Crescent Rd, The Palm Jumeirah, Dubai, United Arab Emirates', 
 'A pinnacle of Arabian luxury perched on the iconic Palm Jumeirah, featuring private white-sand beaches, award-winning celebrity chef restaurants, and an extraordinary rooftop infinity pool.', 
 5.0, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', '+971 4 426 2000', 'stay@atlantisroyalhorizon.ae'),

(4, 'Tokyo Imperial Blossom Hotel', 'Tokyo', '1-1-1 Marunouchi, Chiyoda City, Tokyo 100-0005, Japan', 
 'Situated near the historic Imperial Palace Gardens, this architectural masterpiece harmoniously blends tranquil traditional Japanese aesthetics with cutting-edge Tokyo sophistication and authentic onsen spas.', 
 4.7, 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', '+81 3 3211 5211', 'concierge@imperialblossomtokyo.jp'),

(5, 'Swiss Alps Grand Palace & Spa', 'Zurich', 'Kurhausstrasse 65, 8032 Zürich, Switzerland', 
 'Perched above Lake Zurich with majestic panoramic views of the snow-capped Swiss Alps, offering mineral thermal baths, Michelin-starred alpine dining, and curated ski retreats.', 
 4.9, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80', '+41 44 456 60 00', 'alpine@swissalpsgrand.ch'),

(6, 'Manhattan Skyline Luxury Suites', 'New York', '768 5th Ave, New York, NY 10019, United States', 
 'Step directly into the vibrant pulse of Midtown Manhattan and Central Park. Featuring floor-to-ceiling glass suites, rooftop jazz cocktail bars, and state-of-the-art wellness clubs.', 
 4.6, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80', '+1 212 759 3000', 'guestservice@manhattanskylinesuites.com');

-- 3. Associate Amenities with Hotels
-- Hotel 1 (London)
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 8), (1, 9);

-- Hotel 2 (Paris)
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES 
(2, 1), (2, 3), (2, 4), (2, 7), (2, 8), (2, 9);

-- Hotel 3 (Dubai)
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES 
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7), (3, 8), (3, 9);

-- Hotel 4 (Tokyo)
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES 
(4, 1), (4, 3), (4, 4), (4, 5), (4, 6), (4, 8);

-- Hotel 5 (Zurich)
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES 
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 7), (5, 8);

-- Hotel 6 (New York)
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES 
(6, 1), (6, 4), (6, 5), (6, 7), (6, 8), (6, 9);

-- 4. Insert Room Types and Available Inventories
-- Rooms for Hotel 1 (London)
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(101, 1, 'Classic Queen Heritage Room', 220.00, 8, 2, 'Sophisticated Victorian-inspired room with a queen bed, marble bathroom, and courtyard view.'),
(102, 1, 'Deluxe River Thames King Suite', 340.00, 5, 2, 'Spacious suite offering direct panoramic views of the River Thames, plush king bed, and soaking tub.'),
(103, 1, 'Royal Ambassador Two-Bedroom Suite', 580.00, 2, 4, 'Opulent multi-room suite with private parlor, dining area, walk-in closets, and 24/7 dedicated butler service.');

-- Rooms for Hotel 2 (Paris)
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(201, 2, 'Chic Parisian Deluxe Room', 280.00, 6, 2, 'Elegantly appointed room adorned with French silk draperies, high ceilings, and artisan bathroom fittings.'),
(202, 2, 'Eiffel View Prestige Suite', 450.00, 4, 2, 'Spectacular private balcony overlooking the Eiffel Tower, king bed, and champagne welcome service.');

-- Rooms for Hotel 3 (Dubai)
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(301, 3, 'Oceanview King Palm Room', 320.00, 10, 2, 'Generous private terrace facing the Arabian Gulf, marble soaking tub, and ultra-comfortable king bed.'),
(302, 3, 'Imperial Skyline Terrace Suite', 550.00, 5, 3, 'Expanded living room, sunset viewing deck, walk-in double showers, and exclusive access to the Imperial Club.'),
(303, 3, 'Signature Underwater Penthouse', 1200.00, 1, 4, 'Once-in-a-lifetime three-story suite with floor-to-ceiling underwater views of the 65,000 marine animals in the lagoon.');

-- Rooms for Hotel 4 (Tokyo)
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(401, 4, 'Zen Garden Standard King', 180.00, 8, 2, 'Tranquil minimalist wood finishes, deep Japanese soaking tub, and calming garden vistas.'),
(402, 4, 'Executive Imperial Suite', 310.00, 4, 3, 'Corner suite overlooking the Tokyo skyline, tatami relaxation area, and priority onsen access.');

-- Rooms for Hotel 5 (Zurich)
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(501, 5, 'Alpine Comfort Double Room', 260.00, 6, 2, 'Warm cedarwood accents, cozy fireplace, plush bedding, and balcony overlooking pine forests.'),
(502, 5, 'Matterhorn Panorama Suite', 480.00, 3, 3, 'Stunning high-floor suite with uninterrupted alpine peak views, private sauna, and complimentary ski gear concierge.');

-- Rooms for Hotel 6 (New York)
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(601, 6, 'Midtown Manhattan Queen Room', 220.00, 7, 2, 'Crisp contemporary design with custom acoustic soundproofing, queen bed, and skyline views.'),
(602, 6, 'Central Park Skyline Suite', 390.00, 4, 3, 'Expansive loft with direct unobstructed views of Central Park, soaking tub, and espresso bar.');

-- 5. Insert Sample Initial Booking for Testing Lookup & Restoration
INSERT INTO bookings (id, booking_reference, room_id, customer_name, customer_email, check_in_date, check_out_date, total_nights, total_price, status) VALUES
(1, 'TC-BK-100201', 101, 'John Doe', 'john.doe@thomascook.com', '2026-12-15', '2026-12-18', 3, 660.00, 'CONFIRMED'),
(2, 'TC-BK-100202', 201, 'Emma Watson', 'emma.watson@paris.com', '2026-12-20', '2026-12-23', 3, 840.00, 'CONFIRMED');
