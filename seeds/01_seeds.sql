INSERT INTO users (
  name, email, password
)
VALUES ("Ahmed", "ahmed@mx.com", "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u."),
("Ali", "ali@inbox.com", "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u."),
("Jack", "jack@yahoo.com", "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.");

INSERT INTO reservations (guest_id, property_id, start_date, end_date) 
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (
  guest_id,
  property_id,
  reservation_id,
  rating,
  message
)
VALUES (1, 1, 1, 3, "message"),
        (2, 2, 2, 2, "message"),
        (3, 3, 3, 5, "message");

INSERT INTO properties (
  owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms,
  number_of_bedrooms, country, street, city, province, post_code, active
)

VALUES (1, "MountainView", "description", "", "", 30, 1, 2, 4, "Canada", "13 ave SE", "Calgary", "AB", "T3K 5G4", true),
        (1, "MountainView", "description", "", "", 30, 1, 2, 4, "Canada", "13 ave SE", "Calgary", "AB", "T3K 5G4", true),
        (1, "MountainView", "description", "", "", 30, 1, 2, 4, "Canada", "13 ave SE", "Calgary", "AB", "T3K 5G4", true)