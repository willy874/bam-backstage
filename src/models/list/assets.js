import {
  ListModel
} from '../index'
import axios from 'axios'
import config from '@/config/index'
import {
  getAbstractRequest
} from '@/plugins/axios/request'
import {
  handleApiConfig
} from '../utility/index'

export default class AssetsListModel extends ListModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.listModelType = AssetsListModel
  }

  readList(options = {}) {
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
          this.set(this.responseHandler(listModel, options), options)
          resolve(res)
        })
        .catch((err) => {
          this.loading = false
          reject(err)
        })
    })
  }
}