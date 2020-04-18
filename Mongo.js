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

  route(router, options) {
    try { 
      switch(router) {
        case 'update': 
          return this.update(options)
        case 'delete':
          return this.delete(options)
        case 'fetch':
          return this.fetch(options)
        default: 
          return {error: 'wrong router'}
      }
    } catch (e) {
      return {error: e.message}
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
    const mandatoryList = ['databaseName', 'modelName']
    const checkParametersResult = this.checkParameters(mandatoryList, options)
    if (checkParametersResult.error) {
      return checkParametersResult
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
    const mandatoryList = ['databaseName', 'modelName', 'values']
    const checkParametersResult = this.checkParameters(mandatoryList, options)
    if (checkParametersResult.error) {
      return checkParametersResult
    }
    const {databaseName, modelName, values, id, filter} = options
    const Model = mongoose.model(modelName, mongoSchemes[modelName])
    let result
    try {
      mongoose.connect(`${this.mongoUrl}/${databaseName}`, this.connectionOptions)
      if (id === undefined) {
        values.isExist = true
        console.log(values)
        const object = new Model(values)
        result = await object.save()
      } else {
        const query = id !== undefined ? {_id: id} : filter
        result = await Model.updateMany(query, values, {new: true}).exec()
      } 
      mongoose.disconnect() 
    } catch(e) {
      mongoose.disconnect() 
      return {error: e.message}
    }
    return result
  }

  /**
   * async function
   * 
   * Удаление объектов
   * @param {Object} options
   * options.databaseName - обязательный параметр
   * options.modelName - обязательный параметр
   * options.id - необязательный параметр
   * options.filter - необязательный параметр
   * options.switchIsExist
   *  
  */
  async delete (options) {
    const mandatoryList = ['databaseName', 'modelName']
    const checkParametersResult = this.checkParameters(mandatoryList, options)
    if (checkParametersResult.error) {
      return checkParametersResult
    }
    const {databaseName, modelName, id, filter, switchIsExist} = options
    const Model = mongoose.model(modelName, mongoSchemes[modelName])
    const query = id !== undefined ? {_id: id} : filter
    let result
    if (filter === undefined && id === undefined) {
      return {error: 'filter or id must be provided!'}
    }
    try {
      mongoose.connect(`${this.mongoUrl}/${databaseName}`, this.connectionOptions)
      if (switchIsExist) {
        result = await Model.updateMany(query, {isExist: false}, {new: true}).exec()
      } else {
        result = await Model.deleteMany(query, function (err) {
          console.log(`delete error from mongoose: ${err}`)
        })
      }
      mongoose.disconnect() 
    } catch(e) {
      mongoose.disconnect() 
      return {error: e.message}
    }
    return result
  }

  // Проверка параметров. 
  // Первый аргумент - массив названий параметров, второй - объект с параметрами
  checkParameters (mandatoryParameters, options) {
    let optionsParameters = Object.keys(options)
    for (let i of mandatoryParameters) {
      if (optionsParameters.indexOf(i) === -1 || options[i] === undefined) {
        return {error: `no ${i} found!`}
      }
    }
    return {status: 'success'}
  }
}

module.exports = new MongoApi()
