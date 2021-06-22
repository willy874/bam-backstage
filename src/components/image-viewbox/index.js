import ImageComponent from './ImageComponent.vue'
import ImageCache from './image-cache'

const ImageBox = ImageComponent

const ImagePlugin = {
  install(app, options) {
    const { globalProperties } = app.config
    const imageCache = new ImageCache(options)
    ImagePlugin.$image = imageCache
    globalProperties.$image = imageCache
    app.component('ImageBox', ImageBox)
  },
}

const useImageCache = () => {
  return ImagePlugin.imageCache
}

export { ImagePlugin, useImageCache, ImageBox }
