import Validate from 'validate.js'
import {
  request
} from '@/plugins/axios/request'
import '../validate/index'
import {
  handleApiConfig
} from '../utility/index'
import {
  v4 as uuid
} from 'uuid'

/**
 * @property {Number} id             - 該筆資料唯一索引
 * @property {String} created_at     - 該筆資料建立時間 YYYY/MM/DD HH:MM:ss
 * @property {String} updated_at     - 該筆資料最後編輯時間 YYYY/MM/DD HH:MM:ss
 * @property {String} deleted_at     - 該筆資料刪除時間 YYYY/MM/DD HH:MM:ss
 * @property {Object} errors         - 目前產生的錯誤訊息
 * @property {Boolean} loading       - 目前是否為讀取中
 * @property {Boolean} edited        - 目前是否為已編輯過狀態
 * @property {Boolean} deleted       - 目前是否為刪除狀態
 * @property {String} mode           - ["static","edit","delete"]
 * @property {String} api            - 該 model api 的 Url
 * @property {String} dayFormat      - 在時間參數格式化時的預設值
 * @property {String} arrayModel     - 陣列建立時預設使用的 model
 */
export default class DataModel {
  /** @param {*} args 若為 JSON 字串則會經過轉型 */
  constructor(args) {
    let entity
    try {
      entity = typeof args === 'string' ? JSON.parse(args) : args || {}
    } catch (error) {
      entity = args || {}
    }
    this.id = entity.id || 0
    this.created_at = entity.created_at || undefined
    this.updated_at = entity.updated_at || undefined
    this.deleted_at = entity.deleted_at || undefined
    this.errors = entity.errors || {}
    this.loading = entity.loading || false
    this.mode = entity.mode || 'static'
    this.edited = entity.edited || false
    this.deleted = entity.deleted || false
    Object.defineProperty(this, 'modelId', {
      value: uuid(),
      enumerable: false,
      writable: true,
    })
    Object.defineProperty(this, 'api', {
      value: entity.api || '',
      enumerable: false,
      writable: true,
    })
    Object.defineProperty(this, 'primaryKey', {
      value: entity.primaryKey || 'id',
      enumerable: false,
      writable: true,
    })
    Object.defineProperty(this, 'dayFormat', {
      value: entity.dayFormat || 'YYYY/MM/DD HH:mm:ss',
      enumerable: false,
      writable: true,
    })
    Object.defineProperty(this, 'arrayModel', {
      value: {},
      enumerable: false,
      writable: true,
    })
    Object.defineProperty(this, 'modelType', {
      value: this.__proto__.constructor,
      enumerable: false,
      writable: true,
    })
  }

  /**
   * 取得當前錯誤訊息
   * @param {string} field 指定的 model key
   * @return {object} 取得指定的錯誤訊息
   */
  hasError(field, index = 0) {
    return this.errors && this.errors[field] ? this.errors[field][index] : null
  }

  /**
   * 進行指定的 model key 的驗證
   * @param {string} field 指定的 model key
   * @return {Object} 取得指定驗證項目的錯誤訊息
   */
  valid(field, index) {
    const rules = this.rules() || {}
    const error = Validate.single(this[field], rules[field])
    this.errors = this.errors || []
    this.errors[field] = error
    return error ? error[index] : null
  }

  /**
   * 進行 model 的驗證
   * @param {Object} setRules 要改變的驗證規則
   * @return {Object} 取得所有錯誤訊息
   */
  validate(setRules) {
    const rules = setRules || this.rules()
    this.errors = Validate(this, rules)
    return this.errors || false
  }

  formDataFomat(data, exclude) {
    const fomat = (value, keys = []) => {
      Object.keys(value).forEach((key) => {
        const formName = [...keys, key].map((k, i) => (i ? `[${k}]` : k)).join('')
        if (value[key] === null || isNaN(value[key]) || exclude.includes(key)) {
          return undefined
        } else if (value[key] instanceof Blob) {
          formData.append(formName, value[key], value[key].name)
        } else if (typeof value[key] === 'object') {
          fomat(value[key], [...keys, key])
        } else if (value[key] !== undefined && value[key] !== '') {
          if (/^data:(\w)*\/(\w)*;base64,/.test(formName)) {
            return
          }
          formData.append(formName, value[key])
        }
      })
    }
    const formData = new FormData()
    fomat(data)
    return formData
  }

  /**
   * 設定 model property 值
   * @param {*} entity
   */
  set(entity) {
    const exclude = 'errors,loading,mode,api,edited,deleted,primaryKey,dayFormat,'.split(',')
    Object.keys(entity).forEach((key) => {
      if (this[key] instanceof DataModel) {
        const Model = this[key].constructor
        this[key] = new Model({
          ...entity[key],
          api: this.api
        })
      } else if (Array.isArray(this[key]) && Object.keys(this.arrayModel).includes(key)) {
        const Model = this.arrayModel[key]
        this[key] = entity[key].map((p) => {
          return new Model({
            ...p,
          })
        })
      } else if (!exclude.includes(key)) {
        this[key] = entity[key]
      }
    })
    return this
  }

  rules() {
    return {}
  }

  requesHandler(options) {
    return this
  }

  responseHandler(resData, options) {
    return resData
  }

  readData(options = {}) {
    this.loading = true
    return new Promise((resolve, reject) => {
      request(
          handleApiConfig({
            default: {
              method: 'GET',
              url: `${this.api}/${this[this.primaryKey]}`,
            },
            model: this,
            ...options,
          })
        )
        .then((res) => {
          this.loading = false
          const handleData = options.responseHandler ? options.responseHandler(res.data) : this.responseHandler(res.data, options)
          this.set(handleData, options)
          resolve(res)
        })
        .catch((err) => {
          this.loading = false
          reject(err)
        })
    })
  }

  createData(options = {}) {
    this.loading = true
    return new Promise((resolve, reject) => {
      request(
          handleApiConfig({
            default: {
              method: 'POST',
              url: `${this.api}`,
            },
            model: this,
            ...options,
          })
        )
        .then((res) => {
          this.loading = false
          const handleData = options.responseHandler ? options.responseHandler.call(this, res.data) : this.responseHandler(res.data, options)
          this.set(handleData, options)
          resolve(res)
        })
        .catch((err) => {
          this.loading = false
          reject(err)
        })
    })
  }

  updateData(options = {}) {
    this.loading = true
    return new Promise((resolve, reject) => {
      request(
          handleApiConfig({
            default: {
              method: 'PUT',
              url: `${this.api}/${this[this.primaryKey]}`,
            },
            model: this,
            ...options,
          })
        )
        .then((res) => {
          this.loading = false
          resolve(res)
        })
        .catch((err) => {
          this.loading = false
          reject(err)
        })
    })
  }

  deleteData(options = {}) {
    this.loading = true
    return new Promise((resolve, reject) => {
      request(
          handleApiConfig({
            default: {
              method: 'DELETE',
              url: `${this.api}/${this[this.primaryKey]}`,
            },
            model: this,
            ...options,
          })
        )
        .then((res) => {
          this.loading = false
          resolve(res)
        })
        .catch((err) => {
          this.loading = false
          reject(err)
        })
    })
  }
}