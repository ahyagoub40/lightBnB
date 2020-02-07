const properties = require('./json/properties.json');
const { Pool } = require('pg');
const pool = new Pool({
  property: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/// propertys

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const values = [email];
  const queryString = `
  SELECT *
  FROM users
  WHERE email = $1
  ;
  `;
  return pool.query(queryString, values)
    .then(res => {
      const user = res.rows[0] || null;
      return (user);
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const values = [id];
  const queryString = `
  SELECT *
  FROM users
  WHERE id = $1;
  `;
  return pool.query(queryString, values)
    .then(res => {
      const user = res.rows[0];
      return user;
    });
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const values = [user.name, user.email, user.password];
  const queryString = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *
  `;
  return pool.query(queryString, values)
    .then(res => {
      const user = res.rows[0];
      return user;
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single property.
 * @param {string} guest_id The id of the property.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guestId, limit = 10) {
  const values = [guestId, limit];
  const queryString = `
  SELECT properties.*, reservations.*, AVG(property_reviews.rating) AS average_rating
  FROM properties
  JOIN reservations
  ON properties.id = reservations.property_id
  JOIN property_reviews
  ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1 AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2
  `;
  return pool.query(queryString, values)
    .then(res => {
      const reservations = res.rows;
      return reservations;
    });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {

  let values = [];
  let queryString = `
  SELECT properties.*, AVG(property_reviews.rating) AS average_rating
  FROM properties
  JOIN property_reviews
  ON property_reviews.property_id = properties.id
  `;
  let where = `WHERE`;
  values.push(`%${options.city}%`);
  queryString += `${where} city  ILIKE $${values.length}
  `;
  where = `AND`;
  if (options.owner_id) {
    values.push(options.owner_id);
    queryString += `${where} owner_id IS ${values.length}`;
    where = `AND`;
  }
  if (options.minimum_price_per_night) {
    values.push(options.minimum_price_per_night);
    queryString += `${where} cost_per_night / 100 >= $${values.length}
    `;
    where = `AND`;
  }
  if (options.maximum_price_per_night) {
    values.push(options.maximum_price_per_night);
    queryString += `${where} cost_per_night / 100 <= $${values.length}
    `;
    where = `AND`;
  }
  queryString += `
  GROUP BY properties.id
  `;
  if (options.minimum_rating) {
    values.push(options.minimum_rating);
    queryString += `HAVING AVG(property_reviews.rating) >= $${values.length}
    `;
  }
  values.push(limit);
  queryString += `
  ORDER BY average_rating
  LIMIT $${values.length};
  `;
  return pool.query(queryString, values)
    .then(res => {
      const propertylists = res.rows;
      return propertylists;
    });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const values = [
    property.owner_id, property.title, property.description,
    property.thumbnail_photo_url, property.cover_photo_url,
    property.cost_per_night,
    property.street, property.city, property.province,
    property.post_code, property.country, property.parking_spaces,
    property.number_of_bathrooms, property.number_of_bedrooms
  ];
  const queryString = `
  INSERT INTO properties (owner_id,
    title, description,
    thumbnail_photo_url, cover_photo_url,
    cost_per_night,
    street, city, province,
    post_code, country, parking_spaces,
   number_of_bathrooms, number_of_bedrooms
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *
  `;

  return pool.query(queryString, values)
    .then(res => {
      const newProperty = res.rows;
      return newProperty;
    });
};
exports.addProperty = addProperty;
