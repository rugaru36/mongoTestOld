require ('mongodb')
const utils = require('./Utils')

class MongoApi {
  constructor () {
    const MongoClient = require('mongodb').MongoClient;
    const url = 'mongodb://localhost:27017/';
    this.mongoClient = new MongoClient(url, { useNewUrlParser: true });
  }

  /**
   * Доступ к объектам базы
   * 
   * @param {Object} options: 
   * options.databaseName - обязательный параметр
   * options.collectionName - обязательный параметр
   * options.id - необязательный параметр
   * options.filter - необязательный параметр
   * 
   */

  fetch (options) {
    if (options.collectionName === undefined || options.databaseName === undefined) {
      return {error: 'no collectionName or databaseName name!'}
    }
    const {databaseName, collectionName, filter, id} = options
    const collection = this.mongoClient.db(databaseName).collection(collectionName)
    if (filter === undefined && id === undefined) { // всю коллекцию
      return collection.find().toArray()
    } else if (filter === undefined && id !== undefined) { // по id
      return collection.find({_id: id}).toArray()[0] === undefined ? {error: 'element not found'} : collection.find({_id: id}).toArray()[0]
    } else if (filter !== undefined && id === undefined) { // по фильтру
      return collection.find(filter).toArray()
    } else {
      return {error: 'cannot use fetch by id and filter at the same time!'}
    }
  }

  /**
   * Обновление базы
   * @param {Object} options
   * options.databaseName - обязательный параметр
   * options.collectionName - обязательный параметр
   * options.values - обязательный параметр
   * options.id - необязательный параметр
   * 
   *  
   * @param {Object} options 
   */
  update (options) {
    if (options.collectionName === undefined || options.databaseName === undefined) {
      return {error: 'no collectionName or databaseName name!'}
    }
    const {databaseName, collectionName, values, id} = options
    const collection = this.mongoClient.db(databaseName).collection(collectionName)
  }
}

module.exports = new MongoApi()
