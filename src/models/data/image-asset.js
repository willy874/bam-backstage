import axios from 'axios'
import ImageModel from './image'
import config from '@/config/index'
// import {
//   getAbstractRequest
// } from '@/plugins/axios/request'
// import {
//   handleApiConfig
// } from '../utility/index'

/**
 * @extends ImageModel
 * @property {Boolean} select 該檔案是否被選取
 * @property {Boolean} preview 該檔案是否可預覽
 */
export default class ImageAssetModel extends ImageModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.select = entity.select || false
    this.preview = entity.preview || false
    this.api = entity.api || 'image'
  }

  readImage(options = {}) {
    this.loading = true
    const urlSize = options.size ? `/${options.size}` : ''
    const url = `${config.asset.baseURL}${this.api}/${this[this.primaryKey]}${urlSize}`
    this.image_url = url
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(async (res) => {
          this.loading = false
          this.image_blob = await res.blob()
          const reader = new FileReader()
          reader.onload = (e) => {
            this.image_base64 = e.target.result
            resolve(res)
          }
          reader.readAsDataURL(this.image_blob)
        })
        .catch((err) => {
          this.loading = false
          reject(err)
        })
    })
  }
}