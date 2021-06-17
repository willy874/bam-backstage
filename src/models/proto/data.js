import Validate from 'validate.js'
import { axiosInstance } from '@/plugins/axios/request'
import '../validate/index'

/**
 * @property {Number} id             - 該筆資料唯一索引
 * @property {String} created_at     - 該筆資料建立時間 YYYY/MM/DD HH:MM:ss
 * @property {String} updated_at     - 該筆資料最後編輯時間 YYYY/MM/DD HH:MM:ss
 * @property {String} deleted_at     - 該筆資料刪除時間 YYYY/MM/DD HH:MM:ss
 * @property {Object} errors         - 目前產生的錯誤訊息
 * @property {Boolean} loading       - 目前是否為讀取中
 * @property {String} mode           - ["static","edit","delete"]
 * @property {String} api            - 該 model api 的 Url
 */
export default class DataModel {
  /** @param {*} args 若為 JSON 字串則會經過轉型 */
  constructor(args) {
    const entity = (() => {
      if (args) {
        return typeof args === 'string' ? JSON.parse(args) : args
      }
      return {}
    })()
    this.id = entity.id || 0
    this.created_at = entity.created_at || undefined
    this.updated_at = entity.updated_at || undefined
    this.deleted_at = entity.deleted_at || undefined
    this.errors = entity.errors || {}
    this.loading = entity.loading || false
    this.mode = entity.mode || 'static'
    this.edited = entity.edited || false
    this.deleted = entity.deleted || false
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

  /**
   * 設定 model property 值
   * @param {*} entity
   */
  set(entity) {
    const exclude = 'errors,loading,mode,api,edited,deleted,primaryKey,dayFormat,'.split(',')
    Object.keys(entity).forEach((key) => {
      if (this[key] instanceof DataModel) {
        const Model = this[key].constructor
        this[key] = new Model({ ...entity[key], api: this.api })
      } else if (Array.isArray(this[key]) && Object.keys(this.arrayModel).includes(key)) {
        const Model = this.arrayModel[key]
        this[key] = entity[key].map((p) => {
          return new Model({ ...p, api: this.api })
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
          if (/base64/.test(formName)) {
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
   *
   * @param {*} options
   * @param {*} options.append
   * @param {Array.<String>} options.exclude
   * @param {Boolean} options.isFormData 是否使用 FormData 作為傳遞數據類型
   * @returns {*}
   */
  save(options = {}) {
    const data = {}
    const exclude = 'id,errors,loading,mode,api,edited,deleted,primaryKey,dayFormat,created_at,created_user,updated_at,updated_user,deleted_at,deleted_user,'
      .split(',')
      .concat(options.exclude || [])
    Object.keys(this).forEach((key) => {
      if (!exclude.includes(key)) {
        data[key] = this[key]
      }
      if (this[key] instanceof DataModel) {
        data[key] = this[key].save(options)
      }
    })
    if (options.isFormData) {
      if (options.method === 'PUT') data._method = 'PUT'
      return this.formDataFomat(data, exclude)
    }
    return Object.assign(data, options.append)
  }

  readData(options = {}) {
    this.loading = true
    return new Promise((resolve, reject) => {
      axiosInstance(
        Object.assign(options, {
          model: this,
          ...options.config,
        })
      )
        .get(`${this.api}/${this[this.primaryKey]}`)
        .then((res) => {
          this.loading = false
          this.set(res.data)
          resolve(res)
        })
        .catch(reject)
    })
  }

  createData(options = {}) {
    this.loading = true
    if (options.isFormData) {
      options.config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    }
    if (this.middlewareToBackend) this.middlewareToBackend()
    return new Promise((resolve, reject) => {
      axiosInstance(
        Object.assign(options, {
          model: this,
          ...options.config,
        })
      )
        .post(
          `${this.api}`,
          this.save({
            method: 'POST',
            ...options,
          })
        )
        .then((res) => {
          this.loading = false
          this.set(res.data)
          resolve(res)
        })
        .catch(reject)
    })
  }

  updateData(options = {}) {
    this.loading = true
    const id = this[this.primaryKey]
    const method = options.isFormData ? 'post' : 'put'
    if (this.middlewareToBackend) this.middlewareToBackend()
    return new Promise((resolve, reject) => {
      const axiosRequest = axiosInstance(
        Object.assign(options, {
          model: this,
          ...options.config,
        })
      )
      axiosRequest[method](
        `${this.api}/${id}`,
        this.save({
          method: 'PUT',
          ...options,
        })
      )
        .then((res) => {
          this.loading = false
          resolve(res)
        })
        .catch(reject)
    })
  }

  deleteData(options = {}) {
    this.loading = true
    const id = this[this.primaryKey]
    return new Promise((resolve, reject) => {
      axiosInstance(
        Object.assign(options, {
          model: this,
          ...options.config,
        })
      )
        .delete(`${this.api}/${id}`, this)
        .then((res) => {
          this.loading = false
          resolve(res)
        })
        .catch(reject)
    })
  }
}
