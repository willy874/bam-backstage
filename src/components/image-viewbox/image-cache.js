export default class ImageCache {
  constructor() {
    this.cache = {}
  }

  get(url) {
    return this.cache[url]
  }

  has(url) {
    return !!this.cache[url]
  }

  set(url, data) {
    if (data instanceof Blob) {
      this.cache[url] = data
    } else if (/^data:(\w)*\/(\w)*;base64,/.test(data)) {
      this.cache[url] = data
    } else {
      return data
    }
  }

  remove(url) {
    delete this.cache[url]
  }
}