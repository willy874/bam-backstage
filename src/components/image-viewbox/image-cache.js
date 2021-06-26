export default class ImageCache {
  constructor() {
    this.cache = {}
  }

  get(url) {
    return URL.createObjectURL(this.cache[url])
  }

  has(url) {
    return !!this.cache[url]
  }

  set(url, data) {
    if (data instanceof Blob) {
      this.cache[url] = data
    } else {
      return Promise.resolve(data)
    }
  }

  remove(url) {
    delete this.cache[url]
  }
}
