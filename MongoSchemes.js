const Scheme = require ('mongoose').Schema

const MongoSchemes = {
  'user': new Scheme ({
    name: {
      firstName: String,
      lastName: String
    },
    phone: String
  }),

}

module.exports = MongoSchemes