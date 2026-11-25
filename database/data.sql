
USE hotel_booking_db;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE reviews;
TRUNCATE TABLE bookings;
TRUNCATE TABLE hotel_amenities;
TRUNCATE TABLE rooms;
TRUNCATE TABLE hotels;
TRUNCATE TABLE amenities;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO amenities (id, name, icon_code) VALUES
(1, 'Free High-Speed Wi-Fi', 'wifi'),
(2, 'Outdoor Swimming Pool', 'pool'),
(3, 'Luxury Wellness Spa', 'spa'),
(4, 'Complimentary Gourmet Breakfast', 'restaurant'),
(5, '24/7 Fitness Center', 'fitness_center'),
(6, 'Airport Shuttle Transfer', 'airport_shuttle'),
(7, 'Private Balcony / Sea View', 'balcony'),
(8, '24/7 Concierge & Room Service', 'room_service'),
(9, 'Secure Valet Parking', 'local_parking');

-- 2. Insert Genuine Indian Hotels
INSERT INTO hotels (id, name, city, address, description, rating, image_url, contact_phone, contact_email) VALUES
-- 1. Mumbai
(1, 'The Taj Mahal Palace, Mumbai', 'Mumbai', 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001, India', 
 'An iconic architectural landmark standing gracefully opposite the Gateway of India since 1903. Blends rich Indian heritage with contemporary luxury, renowned sea-facing harbor views, and royal hospitality.', 
 4.9, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', '+91 22 6665 3366', 'reservations.mumbai@tajhotels.com'),

-- 2. Varanasi
(2, 'BrijRama Palace Heritage Hotel', 'Varanasi', 'Darbhanga Ghat, Dashashwamedh, Varanasi, Uttar Pradesh 221001, India', 
 'Perched majestically on the historical Darbhanga Ghat along the sacred River Ganges. Built in the 18th century as a royal palace, offering private boat rides, classical morning ragas, and authentic Banarasi thalis.', 
 4.8, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80', '+91 542 245 4444', 'stay@brijramapalace.com'),

-- 3. Pune
(3, 'JW Marriott Hotel Pune', 'Pune', 'Senapati Bapat Rd, Laxmi Society, Model Colony, Shivajinagar, Pune, Maharashtra 411053, India', 
 'A premier 5-star luxury address situated in the prime business and cultural district of Pune. Features an expansive Quan Spa, rooftop lounge overlooking Senapati Bapat Road, and award-winning international dining.', 
 4.7, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', '+91 20 6683 3333', 'jw.pune@marriotthotels.com'),

-- 4. Varanasi (Second Property)
(4, 'Taj Ganges, Varanasi', 'Varanasi', 'Nadesar Palace Grounds, Cantonment, Varanasi, Uttar Pradesh 221002, India', 
 'Set amidst 40 acres of lush green gardens in the serene Cantonment area. Features tranquil peacock gardens, soothing Ayurvedic wellness therapies, and refined traditional hospitality close to Varanasi City Center.', 
 4.8, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80', '+91 542 666 0001', 'tajganges.varanasi@tajhotels.com'),

-- 5. Mumbai (Second Property)
(5, 'Trident Hotel, Nariman Point Mumbai', 'Mumbai', 'CR 2 Nariman Point, Netaji Subhash Chandra Bose Rd, Mumbai, Maharashtra 400021, India', 
 'Soaring 35 stories above Marine Drive, offering panoramic vistas of the Arabian Sea and the glittering Queen\'s Necklace. Boasts modern business amenities, an oceanfront pool, and quick access to South Mumbai.', 
 4.8, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80', '+91 22 6632 4343', 'trident.narimanpoint@tridenthotels.com'),

-- 6. Pune (Second Property)
(6, 'The Ritz-Carlton, Pune', 'Pune', 'Golf Course Square, Airport Rd, Yerawada, Pune, Maharashtra 411006, India', 
 'Overlooking the lush 100-acre Poona Club Golf Course, The Ritz-Carlton Pune defines contemporary grandeur with private club lounges, custom afternoon teas, and an exquisite wellness sanctuary.', 
 4.9, 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', '+91 20 6767 5000', 'rc.pune.reservation@ritzcarlton.com'),

-- 7. Jaipur
(7, 'ITC Rajputana, A Luxury Collection Hotel', 'Jaipur', 'Palace Road, Gopalbari, Jaipur, Rajasthan 302006, India', 
 'Echoing the grandeur of traditional Rajasthani royal Havelis with red brick courtyard architecture, authentic folk music soirées, Peshawri fine dining, and Kaya Kalp royal spa therapies.', 
 4.8, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80', '+91 141 510 0100', 'reservations.rajputana@itchotels.in'),

-- 8. Goa
(8, 'Taj Fort Aguada Resort & Spa, Goa', 'Goa', 'Sinquerim, Candolim, Bardez, Goa 403515, India', 
 'Historic seaside resort nestled on the ramparts of a 16th-century Portuguese fortress overlooking the Arabian Sea, featuring palm-fringed private beaches, water sports, and seaside cabanas.', 
 4.9, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', '+91 832 664 5858', 'fortaguada.goa@tajhotels.com'),

-- 9. New Delhi
(9, 'The Imperial, New Delhi', 'New Delhi', 'Janpath, Connaught Place, New Delhi, Delhi 110001, India', 
 'A legendary colonial heritage hotel located on Janpath just steps from Connaught Place. Renowned for its Victorian art galleries, high ceiling palm verandas, and regal dining traditions.', 
 4.8, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80', '+91 11 2334 1234', 'luxury@theimperialindia.com');


(7, 'ITC Rajputana, A Luxury Collection Hotel', 'Jaipur', 'Palace Road, Gopalbari, Jaipur, Rajasthan 302006, India', 
 'Echoing the grandeur of traditional Rajasthani royal Havelis with red brick courtyard architecture, authentic folk music soirées, Peshawri fine dining, and Kaya Kalp royal spa therapies.', 
 4.8, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80', '+91 141 510 0100', 'reservations.rajputana@itchotels.in'),

(8, 'Taj Fort Aguada Resort & Spa, Goa', 'Goa', 'Sinquerim, Candolim, Bardez, Goa 403515, India', 
 'Historic seaside resort nestled on the ramparts of a 16th-century Portuguese fortress overlooking the Arabian Sea, featuring palm-fringed private beaches, water sports, and seaside cabanas.', 
 4.9, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', '+91 832 664 5858', 'fortaguada.goa@tajhotels.com'),


(9, 'The Imperial, New Delhi', 'New Delhi', 'Janpath, Connaught Place, New Delhi, Delhi 110001, India', 
 'A legendary colonial heritage hotel located on Janpath just steps from Connaught Place. Renowned for its Victorian art galleries, high ceiling palm verandas, and regal dining traditions.', 
 4.8, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80', '+91 11 2334 1234', 'luxury@theimperialindia.com');

-- 3. Associate Amenities with Hotels
-- 1. Taj Mahal Palace Mumbai
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 8), (1, 9);
-- 2. BrijRama Palace Varanasi
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES (2, 1), (2, 3), (2, 4), (2, 7), (2, 8), (2, 9);
-- 3. JW Marriott Pune
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES (3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 8), (3, 9);
-- 4. Taj Ganges Varanasi
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES (4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6), (4, 8);
-- 5. Trident Nariman Point Mumbai
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES (5, 1), (5, 2), (5, 4), (5, 5), (5, 7), (5, 8), (5, 9);
-- 6. The Ritz-Carlton Pune
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES (6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 7), (6, 8), (6, 9);
-- 7. ITC Rajputana Jaipur
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES (7, 1), (7, 2), (7, 3), (7, 4), (7, 5), (7, 7), (7, 8), (7, 9);
-- 8. Taj Fort Aguada Goa
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES (8, 1), (8, 2), (8, 3), (8, 4), (8, 6), (8, 7), (8, 8), (8, 9);
-- 9. The Imperial New Delhi
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES (9, 1), (9, 3), (9, 4), (9, 5), (9, 6), (9, 7), (9, 8), (9, 9);

-- 4. Insert Room Types with Pricing strictly between ₹2,000 and ₹3,000
-- Hotel 1: Mumbai - Taj
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(101, 1, 'Heritage Wing Superior Room', 2400.00, 8, 2, 'Warm classical Indian interiors with modern comforts, plush king bedding, and city view.'),
(102, 1, 'Tower Ocean View Deluxe Suite', 2850.00, 5, 2, 'Spacious suite overlooking the Arabian Sea and Gateway of India with luxury marble bath.');

-- Hotel 2: Varanasi - BrijRama
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(201, 2, 'Ganga Darshan Heritage Room', 2200.00, 6, 2, 'Authentic Maratha architecture, royal silk tapestries, and serene views of the morning Ganges aarti.'),
(202, 2, 'Maharaja Luxury Riverfront Suite', 2900.00, 3, 2, 'Grand antique-furnished suite with private balcony overlooking the historic ghats.');

-- Hotel 3: Pune - JW Marriott
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(301, 3, 'Deluxe Executive King Room', 2300.00, 10, 2, 'Sleek contemporary design with ergonomic workstation, luxury rain shower, and high-speed Wi-Fi.'),
(302, 3, 'Premier Club Skyline Suite', 2800.00, 5, 3, 'High-floor suite with expansive living area, city views, and exclusive Club Lounge breakfast access.');

-- Hotel 4: Varanasi - Taj Ganges
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(401, 4, 'Superior Garden Facing Room', 2100.00, 8, 2, 'Peaceful green garden views, signature Taj bedding, and fine tea/coffee amenities.'),
(402, 4, 'Executive Palace Suite', 2650.00, 4, 3, 'Generous suite with separate parlor area, fruit basket, and complimentary airport drop.');

-- Hotel 5: Mumbai - Trident
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(501, 5, 'Superior Marine City Room', 2500.00, 7, 2, 'Soundproofed modern room with custom posturepedic mattress and vibrant South Mumbai skyline view.'),
(502, 5, 'Queen\'s Necklace Ocean Suite', 2950.00, 4, 2, 'Unobstructed panoramic view of the Marine Drive promenade, deep bathtub, and evening cocktails.');

-- Hotel 6: Pune - Ritz-Carlton
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(601, 6, 'Deluxe Golf Course View Room', 2600.00, 6, 2, 'Floor-to-ceiling windows overlooking Poona Golf Course, Frette linens, and marble bathroom.'),
(602, 6, 'Carlton Luxury Royal Suite', 3000.00, 3, 3, 'Expansive master bedroom with walk-in closet, personalized butler attention, and golf club privileges.');

-- Hotel 7: Jaipur - ITC Rajputana
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(701, 7, 'Rajputana Heritage Chamber', 2250.00, 8, 2, 'Rich royal decor with traditional carved wooden motifs, king bed, and private courtyard view.'),
(702, 7, 'Thikana Luxury Palace Suite', 2850.00, 4, 3, 'Expansive suite with heritage Rajput aesthetic, deep soaking tub, and complimentary high tea.');

-- Hotel 8: Goa - Taj Fort Aguada
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(801, 8, 'Sea Breeze Goan Cottage', 2500.00, 7, 2, 'Charming Portuguese-style private cottage surrounded by tropical coconut groves and sea breeze.'),
(802, 8, 'Aguada Cliff View Suite', 2950.00, 4, 2, 'Spectacular panoramic oceanfront terrace overlooking the Arabian Sea waves and sandy shores.');

-- Hotel 9: New Delhi - The Imperial
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(901, 9, 'Colonial Heritage King Room', 2400.00, 8, 2, 'High ceilings, genuine antique furnishings, Italian marble bathroom, and central Connaught Place access.'),
(902, 9, 'Viceroy Luxury Veranda Suite', 2900.00, 4, 3, 'Palatial suite with private veranda, teakwood four-poster bed, and personalized concierge.');

INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(701, 7, 'Rajputana Heritage Chamber', 2250.00, 8, 2, 'Rich royal decor with traditional carved wooden motifs, king bed, and private courtyard view.'),
(702, 7, 'Thikana Luxury Palace Suite', 2850.00, 4, 3, 'Expansive suite with heritage Rajput aesthetic, deep soaking tub, and complimentary high tea.');


INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(801, 8, 'Sea Breeze Goan Cottage', 2500.00, 7, 2, 'Charming Portuguese-style private cottage surrounded by tropical coconut groves and sea breeze.'),
(802, 8, 'Aguada Cliff View Suite', 2950.00, 4, 2, 'Spectacular panoramic oceanfront terrace overlooking the Arabian Sea waves and sandy shores.');


INSERT INTO rooms (id, hotel_id, room_type, price_per_night, total_inventory, max_occupancy, description) VALUES
(901, 9, 'Colonial Heritage King Room', 2400.00, 8, 2, 'High ceilings, genuine antique furnishings, Italian marble bathroom, and central Connaught Place access.'),
(902, 9, 'Viceroy Luxury Veranda Suite', 2900.00, 4, 3, 'Palatial suite with private veranda, teakwood four-poster bed, and personalized concierge.');


INSERT INTO bookings (id, booking_reference, room_id, customer_name, customer_email, check_in_date, check_out_date, total_nights, base_price, discount_amount, tax_amount, total_price, promo_code, status) VALUES
(1, 'TC-BK-100201', 101, 'Rahul Sharma', 'rahul.sharma@mumbai.com', '2026-12-10', '2026-12-12', 2, 4800.00, 480.00, 518.40, 4838.40, 'THOMASCOOK10', 'CONFIRMED'),
(2, 'TC-BK-100202', 201, 'Priya Verma', 'priya.verma@varanasi.com', '2026-12-15', '2026-12-18', 3, 6600.00, 0.00, 792.00, 7392.00, NULL, 'CONFIRMED');

-- 6. Insert Verified Guest Reviews
INSERT INTO reviews (id, hotel_id, author_name, rating, comment, created_at) VALUES
(1, 1, 'Aarav Patel', 5.0, 'Staying at The Taj Mahal Palace was an unforgettable royal experience. The sea-facing breakfast and historical tour are second to none.', NOW() - INTERVAL 10 DAY),
(2, 1, 'Ananya Sen', 4.9, 'Quintessential Mumbai heritage. Exceptional butler service and the Harbour Bar has unmatched ambiance.', NOW() - INTERVAL 5 DAY),
(3, 2, 'Devendra Shukla', 5.0, 'BrijRama Palace on Darbhanga Ghat is pure magic. Watching the Ganga Aarti from the private palace terrace was spiritually elevating.', NOW() - INTERVAL 8 DAY),
(4, 2, 'Sunita Rao', 4.8, 'The private boat transfer from Rajghat Ghat and live morning sitar ragas made our anniversary celebration truly divine.', NOW() - INTERVAL 3 DAY),
(5, 3, 'Rohan Deshmukh', 4.8, 'JW Marriott Pune is the finest business and luxury hub in Pune. The Quan Spa and Paasha rooftop lounge were spectacular.', NOW() - INTERVAL 6 DAY),
(6, 4, 'Meera Nair', 4.7, 'Taj Ganges has lush green tranquil gardens right in Varanasi cantonment. Peacocks roaming the grounds was lovely!', NOW() - INTERVAL 4 DAY),
(7, 5, 'Vikram Mehta', 4.9, 'Unbeatable view of the Queen\'s Necklace from Trident Nariman Point. Super clean rooms and prompt room service.', NOW() - INTERVAL 7 DAY),
(8, 6, 'Pooja Kulkarni', 5.0, 'The Ritz-Carlton Pune defines true opulence. Overlooking the golf course during afternoon tea was sublime.', NOW() - INTERVAL 2 DAY),
(9, 7, 'Aditya Rathore', 4.8, 'ITC Rajputana Jaipur captures authentic Rajput royal architecture. Peshawri restaurant serves the best Dal Bukhara!', NOW() - INTERVAL 9 DAY),
(10, 8, 'Natasha Dsouza', 5.0, 'Taj Fort Aguada Goa has the best cliffside ocean views. Perfect sunset cocktails and warm Goan hospitality.', NOW() - INTERVAL 1 DAY),
(11, 9, 'Kabir Malhotra', 4.9, 'The Imperial New Delhi is a museum hotel. Walking through the Victorian art corridors feels like stepping back in time.', NOW() - INTERVAL 12 DAY);
