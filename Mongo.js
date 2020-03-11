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
      '||': '%or',
      'not': '$not'
    }
  }

  parseFilter(string) {
    let charArray = Array.from(string)
    let property = ''
    let operator = ''
    let value = ''
    let state = 'property'
    let mongoOperator
    
    for(let i in charArray) {
      switch (state) {
        case 'property':
          if (charArray[i] === ' ') {
            state = 'operator'
          } else {
            property += charArray[i]
          }
          break
        case 'operator':
          if (charArray[i] === ' ') {
            state = 'value'
          } else {
            operator += charArray[i]
          }
          break
        case 'value':
          if (charArray[i] === '\'' || charArray[i] === '\'') {
            continue
          } else {
            value += charArray[i]
          }
          break
      }
    }
    value = !isNaN(value) ? +value : value
    mongoOperator = this.mongoRelationalOperators[operator]
    return {[property]: {[mongoOperator]: value}}
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