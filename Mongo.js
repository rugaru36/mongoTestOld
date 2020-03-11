require ('mongodb')
const utils = require('./Utils')

class MongoApi {
  constructor () {
    const MongoClient = require('mongodb').MongoClient;
    const url = 'mongodb://localhost:27017/';
    this.mongoClient = new MongoClient(url, { useNewUrlParser: true });
    this.mongoRelationalOperators = {
      '==': '$eq',
      '>': '$gt',
      '>=': '$gte',
      '<': '$lt',
      '<=': '$lte',
      '!=': '$ne',
      'in': '$in',
      'nin': '$nin'
    }
    this.mongoLogicalOperators = {
      '&&': '%and',
      '||': '%or'
    }
  }

  parseFilter(string) {
    let relOperators      = []
    let logOperators      = []
    let values            = []
    let properties        = []
    let expressions       = []
    let charArr           = Array.from(string)
    let state             = 'property' // property | value
    let createNewExpression = () => {
      relOperators.push('')
      logOperators.push('')
      properties.push('')
      values.push('')
    }

    createNewExpression()
    for(let i in charArr) {
      if (charArr[i] === ' ') {
        if (state === 'value') {
          createNewExpression()
          state = 'property'
        }
        continue
      } else if (!utils.isOperator(charArr[i])) {
        switch (state) {
          case 'property':
            properties[properties.length - 1] += charArr[i]
            break
          case 'value':
            values[properties.length - 1] += charArr[i]
            break
        }
      } else if (utils.isLogicalOperator(charArr[i])) {
        if (logOperators.length > 1 && Array.from(logOperators[logOperators.length - 2])[0] === charArr[i]) {
        }
        logOperators += charArr[i]
        state = 'property'
      } else if (utils.isRelationalOperator(charArr[i])) {
        relOperators += charArr[i]
        state = 'value'
      }
    }
    for (let i in properties) {
      let mongoRelationalOperator = this.mongoRelationalOperators[relOperators[i]]
      let value = !isNaN(values[i]) ? +values[i] : values[i]
      expressions.push({[properties[i]]: {[mongoRelationalOperator]: value}})
    }
    if (expressions.length === 1) {
      return expressions[0]
    } else if (expressions.length > 1) {

    } else {
      return {error: 'something is wrong!'}
    }
  }

  /* 
    FETCH OPTIONS:
    {
      databaseName (required)
      collectionName (required),
      filter (optional),
      id (optional)
    }
  */
  fetch (options) {
    if (options.collectionName === undefined || options.databaseName === undefined) {
      return {error: 'no collectionName or databaseName name!'}
    }
    const {databaseName, collectionName, filter, id} = options
    let collection = this.mongoClient.db(databaseName).collection(collectionName)
    let result

    if (filter === undefined && id === undefined) { // всю коллекцию
      result = collection.find().toArray()
    } else if (filter === undefined && id !== undefined) { // по id
      result = collection.find({_id: id}).toArray()[0] === undefined ? {error: 'element not found'} : collection.find({_id: id}).toArray()[0]
    } else if (filter !== undefined && id === undefined) { // по фильтру
      try {
        result = collection.func(this.parseFilter(filter))
      } catch(e) {
        return {error: e.message}
      }
    } else {
      result = {error: 'cannot use fetch by id and filter at the same time!'}
    }
    return result
  }
}

module.exports = new MongoApi()