import axios from 'axios'
import ImageModel from './image'
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
 * @extends ImageModel
 * @property {Boolean} select 該檔案是否被選取
 * @property {Boolean} preview 該檔案是否可預覽
 */
export default class ImageAssetModel extends ImageModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.selected = entity.selected || false
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
        this.handleBlob(null).then(resolve)
        return
      }
      fetch(url)
        .then(async (res) => {
          this.loading = false
          this.image_blob = await res.blob()
          ImageCache.set(url, this.image_blob)
          this.handleBlob(res).then(resolve)
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
              url: `${this.api}/${this[this.primaryKey]}/upload`,
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