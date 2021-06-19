import DataModel from './data'
import { axiosInstance } from '@/plugins/axios/request'

/**
 * @property {Array.<*>} data         - ListModel 管理的 Model
 * @property {Boolean} loading        - 目前是否為讀取中
 * @property {Number} current_page    - 當前 ListModel 控制的頁碼
 * @property {Number} last_page       - 資料總合的頁數
 * @property {Number} per_page        -
 * @property {Number} from            -
 * @property {Number} to              -
 * @property {Number} total           - 總資料數長度
 * @property {String} path            - 資料來源的網址
 * @property {Array.<*>} cache        - 用於全域快取空間資料
 * @property {Object} query           - 暫存的 route.query
 * @property {Function} modelType     - data 內的 Model 類型
 * @property {String} primaryKey      - 該資料使用的主 key
 * @property {Object} api             - 該 model api 的 Url，如果使用 ListModel 的方法建立會往底下繼承該資料
 */
export default class ListModel {
  constructor(args) {
    const entity = (() => {
      if (args) {
        return typeof args === 'string' ? JSON.parse(args) : args
      }
      return {}
    })()
    const Model = entity.model || DataModel
    this.data = (entity.data && entity.data.map((p) => new Model(p))) || []
    this.loading = entity.loading || false
    this.currentPage = entity.current_page || 0
    this.lastPage = entity.last_page || 0
    this.perPage = entity.per_page || 0
    this.from = entity.from || 0
    this.to = entity.to || 0
    this.total = entity.total || 0
    this.path = entity.path || ''
    this.cache = entity.cache || []
    this.query = entity.query || null
    Object.defineProperty(this, 'modelType', {
      value: Model,
      enumerable: false,
      writable: true,
    })
    this.path = entity.path || ''
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
  }

  /**
   * 設定data的資料，並存到快取內
   * @param {Array.<DataModel>} data
   * @returns {DataModel} 快取內的資料包
   */
  setData(data = []) {
    const Model = this.modelType
    data.forEach((p) => {
      const targetModel = this.cache.find((m) => Number(m[this.primaryKey]) === Number(p[this.primaryKey]))
      if (targetModel) {
        targetModel.set(p)
      } else {
        this.cache.unshift(
          new Model({
            ...p,
            primaryKey: this.primaryKey,
            api: this.api,
          })
        )
      }
    })
    const model = this.cache.filter((p) => {
      return data.find((m) => {
        return Number(m[this.primaryKey]) === Number(p[this.primaryKey])
      })
    })
    return model
  }

  /**
   * 設定 model property 值
   * @param {*} entity
   */
  set(entity) {
    Object.keys(entity).forEach((key) => {
      if (key === 'data') {
        this[key] = this.setData(entity.data)
      } else {
        this[key] = entity[key]
      }
    })
    return this
  }

  /**
   * 設定關於分頁的資料訊息
   * @param {*} args
   */
  setPages(args) {
    const entity = args || {}
    this.currentPage = entity.current_page || 0
    this.lastPage = entity.last_page || 0
    this.perPage = entity.per_page || 0
    this.from = entity.from || 0
    this.to = entity.to || 0
    this.total = entity.total || 0
    this.path = entity.path || ''
  }

  /**
   * 讀取關於該 ListModel 的 API 資料
   * @param {*} options
   * @returns {Promise<AxiosResponse>}
   */
  readList(options = {}) {
    const { url, params } = options
    this.loading = true
    return new Promise((resolve, reject) => {
      axiosInstance({
        model: this,
        ...options,
      })
        .get(url || this.api)
        .then((res) => {
          this.query = params
          this.loading = false
          this.data = this.setData(Array.isArray(res.data) ? res.data : res.data.data)
          this.setPages(res.data)
          res.handle = this.data
          resolve(res)
        })
        .catch(reject)
    })
  }

  /**
   * 讀取關於該 ListModel 指定 id 的 API 資料
   * @param {*} options
   * @returns {Promise<AxiosResponse>}
   */
  readListById(id = 0, options = {}) {
    this.loading = true
    return new Promise((resolve, reject) => {
      axiosInstance(Object.assign({ model: this }, options))
        .get(`${this.api}/${id}`)
        .then((res) => {
          this.loading = false
          res.handle = this.setData(Array.isArray(res.data) ? res.data : [res.data])[0]
          resolve(res)
        })
        .catch(reject)
    })
  }
}
