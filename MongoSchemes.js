const Scheme = require('mongoose').Schema

const MongoSchemes = {
  'User': new Scheme ({
    name: {
      firstName: String,
      lastName: String
    },
    phone: String
  }),
}

module.exports = MongoSchemes