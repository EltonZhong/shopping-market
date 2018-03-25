import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../config/config';
/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    status: Number(req.body.status)
  });

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.user;
  user.username = req.body.username;
  user.email = req.body.email;
  user.password = req.body.password;
  user.description = req.body.description;

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

function profile(req, res, next) {
  if (req.cookies.token) {
    let decoded = jwt.verify(req.cookies.token, config.jwtSecret);
    User.get(decoded.id).then(user => {
      return res.json(user);
    })
  }
}

function cart(req, res, next) {
  if (req.cookies.token) {
    let decoded = jwt.verify(req.cookies.token, config.jwtSecret)
    User.getCart(decoded.id).then(user => {
      return res.json(user)
    })
  }
}


function addToCart(req, res, next) {
  if (req.cookies.token) {
    let decoded = jwt.verify(req.cookies.token, config.jwtSecret);
    User.get(decoded.id).then(user => {
      if (!user.cart.toString().includes(req.body._id)) {
        user.cart.push(req.body._id);
        user.save().then(error => {
          return res.json(user);
        })
      } else {
        return res.json(user)
      }
    })
  } else {
    throw Error('not login')
  }
}

function removeFromCart(req, res, next) {
  if (req.cookies.token) {
    let decoded = jwt.verify(req.cookies.token, config.jwtSecret);
    User.get(decoded.id).then(user => {
      console.log(user)
      console.log(1111)
      if (user.cart.toString().includes(req.body._id)) {
        user.cart = user.cart.filter(good_id => {
          return req.body._id !== good_id.toString()
        });
        user.save().then(error => {
          return res.json(user);
        })
      } else {
        return res.json(user)
      }
    })
  } else {
    throw Error('not login')
  }
}

export default { load, get, create, update, list, remove, profile, addToCart , cart, removeFromCart};
