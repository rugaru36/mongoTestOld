require ('mongodb')
const mongoSchemes = require ('./MongoSchemes')
const mongoose = require ('mongoose')
const utils = require('./Utils')

class MongoApi {
  constructor () {
    this.dbUrl = 'mongodb://localhost:27017/'
  }

  /**
   * Доступ к объектам базы
   * 
   * @param {Object} options: 
   * options.databaseName - обязательный параметр
   * options.modelName - обязательный параметр
   * options.id - необязательный параметр
   * options.filter - необязательный параметр
   * 
  */
  fetch (options) {
    if (options.modelName === undefined || options.databaseName === undefined) {
      return {error: 'no modelName or databaseName!'}
    }
    mongoose.connect(`${this.dbUrl}${databaseName}`, { useNewUrlParser: true })
    let result
    const {databaseName, modelName, filter, id} = options
    const Model = mongoose.model(modelName, mongoSchemes[modelName])
    if (filter === undefined && id === undefined) { // всю коллекцию
      result = Model.find((err) => {mongoose.disconnect()}).toArray()
    } else { // по id или фильтру
      const query = id !== undefined ? {_id: id} : filter
      result = Model.find(query, (err) => {mongoose.disconnect()}).toArray()
    }
    return result
  }

  /**
   * Обновление базы
   * @param {Object} options
   * options.databaseName - обязательный параметр
   * options.modelName - обязательный параметр
   * options.values - обязательный параметр
   * options.id - необязательный параметр
   * options.filter - необязательный параметр
   *  
  */
  update (options) {
    if (options.modelName === undefined || options.databaseName === undefined) {
      return {error: 'no modelName or databaseName!'}
    }
    const {databaseName, modelName, values, id, filter} = options
    mongoose.connect(`${this.dbUrl}${databaseName}`, { useNewUrlParser: true })
    if (id === undefined) {
      const Model = mongoose.model(modelName, mongoSchemes[modelName])
      const object = new Model(values)
      object.save((err) => { mongoose.disconnect() })
    } else {
      const Model = mongoose.model(modelName, mongoSchemes[modelName])
      const query = id !== undefined ? {_id: id} : filter
      Model.findOneAndUpdate(query, values, {new: true}, (err, obj) => {mongoose.disconnect()})
    } 
  }
}

module.exports = new MongoApi()
