import FileModel from './file'
import axios from 'axios'
import config from '@/config/index'
import {
  getAbstractRequest
} from '@/plugins/axios/request'
import {
  handleApiConfig
} from '../utility/index'
import {
  useImageCache
} from '@/components/image-viewbox'
import {
  awaitTime
} from '@/utility/async'

/**
 * @extends FileModel
 * @property {String} image_name 該圖片的檔案名稱
 * @property {String} image_ext 該圖片的副檔名
 * @property {String} image_alt 該圖片的替代文字
 * @property {String} image_title 該圖片的標題文字
 * @property {String} image_url 該圖片的路徑
 * @property {String} image_base64 該圖片的base64顯示字串
 * @property {String} image_blob 該圖片的二進位Blob檔
 * @property {Number} width 該圖片的寬度
 * @property {Number} height 該圖片的高度
 */
export default class ImageModel extends FileModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.image_name = entity.image_name || ''
    this.image_ext = entity.image_ext || ''
    this.image_alt = entity.image_alt || ''
    this.image_title = entity.image_title || ''
    this.image_url = entity.image_url || ''
    this.image_base64 = entity.image_base64 || ''
    this.image_blob = entity.image_blob || null
    this.width = entity.width || 0
    this.height = entity.height || 0
    this.api = entity.api || 'image'
  }


  handleBlob(res) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.image_base64 = e.target.result
        resolve(res)
      }
      reader.readAsDataURL(this.image_blob)
    })
  }

  readData(options = {}) {
    this.loading = true
    const urlSize = options.size ? `/${options.size}` : ''
    const url = `${config.asset.baseURL}${this.api}/${this[this.primaryKey]}${urlSize}`
    this.image_url = url
    const ImageCache = useImageCache()
    return new Promise((resolve, reject) => {
      if (ImageCache.has(url)) {
        this.image_blob = ImageCache.get(url)
        this.handleBlob(this.image_blob).then(resolve)
        return
      }
      fetch(url)
        .then(async (res) => {
          this.loading = false
          if (res.ok) {
            this.image_blob = await res.blob()
            ImageCache.set(url, this.image_blob)
            this.handleBlob(this.image_blob).then(resolve)
          } else {
            resolve(null)
          }
        })
        .catch((err) => {
          this.loading = false
          reject(err)
        })
    })
  }

  createData(options = {}) {
    this.loading = true
    const Instance = axios.create(config.asset)
    const axiosRequest = getAbstractRequest(Instance, {})
    return new Promise((resolve, reject) => {
      axiosRequest(
          handleApiConfig({
            default: {
              method: 'POST',
              url: `${this.api}/upload`,
            },
            model: this,
            requesHandler: () => {
              const form = new FormData()
              form.append('name', this.name)
              form.append('image', this.image_blob, `${this.image_name}.${this.image_ext}`)
              return form
            },
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

  async updateData() {
    await awaitTime(100)
  }

  async deleteData() {
    await awaitTime(100)
  }
}