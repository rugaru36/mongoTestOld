const mongoSchemes = require ('./MongoSchemes')
const mongoose = require ('mongoose')

class MongoApi {
  constructor () {
    this.mongoUrl = 'mongodb://localhost:27017'
    this.connectionOptions = {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }
  }

  /**
   * async function
   * 
   * Доступ к объектам базы
   * 
   * @param {Object} options: 
   * options.databaseName - обязательный параметр
   * options.modelName - обязательный параметр
   * options.id - необязательный параметр
   * options.filter - необязательный параметр
   * 
  */
  async fetch (options) {
    if (options.modelName === undefined || options.databaseName === undefined) {
      return {error: 'no modelName or databaseName provided!'}
    } else if (mongoSchemes[options.modelName] === undefined) {
      return {error: `model ${options.modelName} does not exist!`}
    }
    let result
    const {databaseName, modelName, filter, id} = options
    const Model = mongoose.model(modelName, mongoSchemes[modelName])
    try {
      mongoose.connect(`${this.mongoUrl}/${databaseName}`, this.connectionOptions)
      if (id === undefined && filter === undefined) { // всю коллекцию
        result = await Model.find().exec()
      } else if (id !== undefined) { // по id
        result = await Model.findById(id).exec()
      } else if (filter !== undefined) { // по фильтру
        result = await Model.find(filter).exec()
      }
      mongoose.disconnect()
    } catch (e) {
      mongoose.disconnect()
      return {error: e.message}
    }
    return result
  }

  /**
   * async function
   * 
   * Обновление базы
   * @param {Object} options
   * options.databaseName - обязательный параметр
   * options.modelName - обязательный параметр
   * options.values - обязательный параметр
   * options.id - необязательный параметр
   * options.filter - необязательный параметр
   *  
  */
  async update (options) {
    if (options.modelName === undefined || options.databaseName === undefined) {
      return {error: 'no modelName or databaseName provided!'}
    } else if (mongoSchemes[options.modelName] === undefined) {
      return {error: `model ${options.modelName} does not exist!`}
    }
    let result
    const {databaseName, modelName, values, id, filter} = options
    const Model = mongoose.model(modelName, mongoSchemes[modelName])
    try {
      mongoose.connect(`${this.mongoUrl}/${databaseName}`, this.connectionOptions)
      if (id === undefined) {
        const object = new Model(values)
        result = await object.save()
      } else {
        const Model = mongoose.model(modelName, mongoSchemes[modelName])
        const query = id !== undefined ? {_id: id} : filter
        result = await Model.findOneAndUpdate(query, values, {new: true}).exec()
      } 
      mongoose.disconnect() 
    } catch(e) {
      mongoose.disconnect() 
      return {error: e.message}
    }
    return result
  }
}

module.exports = new MongoApi()
