import install from './install'
import ImageBox from './ImageComponent.vue'
import useImageCache from './use'

const ImagePlugin = {
  install,
  imageCache: useImageCache(),
}

export { ImagePlugin, useImageCache, ImageBox }
