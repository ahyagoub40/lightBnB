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
  console.log(values);
  return pool.query(queryString, values)
    .then(res => {
      const user = res.rows[0] || null;
      console.log(user);
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
      console.log(user);
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
      console.log(user);
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
      console.log(res.rows);
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

  const values = [options, limit];
  const queryString = `
  SELECT properties.*, AVG(property_reviews.rating) AS average_rating
  FROM properties
  JOIN property_reviews
  ON property_reviews.property_id = properties.id
  WHERE city LIKE '%$1%'
  GROUP BY properties.id
  HAVING AVG(property_reviews.rating) >= 4
  ORDER BY average_rating
  LIMIT $2
  `;
  return pool.query(queryString, values)
    .then(res => {
      console.log(res.rows);
    });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const values = [property.name, property.email, property.password];
  const queryString = `
  INSERT INTO property
  VALUES ($1, $2, $3)
  RETURNING *
  `;
  return pool.query(queryString, values)
    .then(res => {
      console.log(res.rows);
    });
}
exports.addProperty = addProperty;
