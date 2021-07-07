import DataModel from './data'
import axios from 'axios'
import config from '@/config/index'
import {
  axiosInstance,
  getAbstractRequest
} from '@/plugins/axios/request'
import {
  handleApiConfig
} from '../utility/index'

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
    let entity
    try {
      entity = typeof args === 'string' ? JSON.parse(args) : args || {}
    } catch (error) {
      entity = args || {}
    }
    const Model = entity.model || DataModel
    this.data = (entity.data && entity.data.map((p) => new Model(p))) || []
    this.loading = entity.loading || false
    this.currentPage = entity.currentPage || 0
    this.lastPage = entity.lastPage || 0
    this.perPage = entity.perPage || 0
    this.from = entity.from || 0
    this.to = entity.to || 0
    this.total = entity.total || 0
    this.path = entity.path || ''
    this.cache = entity.cache || []
    this.query = entity.query || {}
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

  requesHandler(options) {
    return []
  }

  /**
   * 設定data的資料，並存到快取內
   * @param {Array.<DataModel>} data
   * @returns {DataModel} 快取內的資料包
   */
  setData(data = [], options = {}) {
    const ModelType = this.modelType
    this.data = data.map((target) => {
      if (target instanceof ModelType) {
        return target
      } else {
        const model = new ModelType({
          primaryKey: this.primaryKey,
        })
        return model.set(model.responseHandler(target, options))
      }
    })
    return this
  }

  /**
   * 設定 model property 值
   * @param {*} entity
   */
  set(entity, options = {}) {
    if (entity) {
      this.setData(entity.data, options)
      this.setPages(entity)
    }
    return this
  }

  /**
   * 設定關於分頁的資料訊息
   * @param {*} args
   */
  setPages(args) {
    const entity = args || {}
    this.currentPage = entity.currentPage || entity.current_page || this.currentPage
    this.lastPage = entity.lastPage || entity.last_page || this.lastPage
    this.perPage = entity.perPage || entity.per_page || this.perPage
    this.from = entity.from || this.from
    this.to = entity.to || this.to
    this.total = entity.total || this.total
    this.path = entity.path || this.path
    return this
  }

  /**
   * 讀取關於該 ListModel 的 API 資料
   * @param {*} options
   * @returns {Promise<AxiosResponse>}
   */
  readList(options = {}) {
    this.loading = true
    const axiosRequest = axiosInstance({
      requesHandler(req) {
        const cacheResponse = this.query[req.responseURL]
        if (cacheResponse) {
          const listModel = Array.isArray(cacheResponse.data) ? {
            data: cacheResponse.data
          } : cacheResponse.data
          this.set(listModel, options)
        }
      },
    })
    return new Promise((resolve, reject) => {
      axiosRequest(
          handleApiConfig({
            default: {
              method: 'GET',
              url: `${this.api}`,
            },
            model: this,
            ...options,
          })
        )
        .then((res) => {
          this.query[res.request.responseURL] = res
          this.loading = false
          const listModel = Array.isArray(res.data) ? {
            data: res.data
          } : res.data
          this.set(listModel, options)
          resolve(res)
        })
        .catch((err) => {
          this.loading = false
          reject(err)
        })
    })
  }

  assetReadList(options = {}) {
    this.loading = true
    const Instance = axios.create(config.asset)
    const axiosRequest = getAbstractRequest(Instance, {})
    return new Promise((resolve, reject) => {
      axiosRequest(
          handleApiConfig({
            default: {
              method: 'GET',
              url: `${this.api}`,
            },
            model: this,
            ...options,
          })
        )
        .then((res) => {
          this.loading = false
          const listModel = Array.isArray(res.data) ? {
            data: res.data
          } : res.data
          this.set(listModel, options)
          resolve(res)
        })
        .catch((err) => {
          this.loading = false
          reject(err)
        })
    })
  }
}