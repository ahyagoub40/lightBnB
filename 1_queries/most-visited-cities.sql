SELECT properties.city, count(reservations.*) AS num_reservation
FROM properties
JOIN reservations
ON properties.id = reservations.property_id
GROUP BY properties.city
ORDER BY num_reservation DESC