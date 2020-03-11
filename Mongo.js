require ('mongodb')
const mongoSchemes = require ('./MongoSchemes')
const mongoose = require ('mongoose')
const utils = require('./Utils')

class MongoApi {
  constructor () {
    this.dbUrl = 'mongodb://localhost:27017/';
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
    mongoose.connect(`${this.dbUrl}${databaseName}`, { useNewUrlParser: true })
    let result
    const {databaseName, collectionName, filter, id} = options
    const Model = mongoose.model(collectionName, mongoSchemes[collectionName])
    if (filter === undefined && id === undefined) { // всю коллекцию
      result = Model.find().toArray()
    } else { // по id или фильтру
      const query = id !== undefined ? {_id: id} : filter
      result = id !== undefined ? Model.find(query).toArray()[0] : Model.find(query).toArray()
    }
    mongoose.disconnect()
    return result === undefined ? {error: 'cannot get data'} : result
  }

  /**
   * Обновление базы
   * @param {Object} options
   * options.databaseName - обязательный параметр
   * options.collectionName - обязательный параметр
   * options.values - обязательный параметр
   * options.id - необязательный параметр
   * options.filter - необязательный параметр
   *  
  */
  update (options) {
    if (options.collectionName === undefined || options.databaseName === undefined) {
      return {error: 'no collectionName or databaseName name!'}
    }
    const {databaseName, collectionName, values, id, filter} = options
    mongoose.connect(`${this.dbUrl}${databaseName}`, { useNewUrlParser: true })
    if (id === undefined) {
      const Model = mongoose.model(collectionName, mongoSchemes[collectionName])
      const object = new Model(values)
      object.save((err) => { mongoose.disconnect() })
    } else {
      const Model = mongoose.model(collectionName, mongoSchemes[collectionName])
      const query = id !== undefined ? {_id: id} : filter
      Model.findOneAndUpdate(query, values, {new: true}, (err, obj) => {mongoose.disconnect()})
    } 
  }
}

module.exports = new MongoApi()
