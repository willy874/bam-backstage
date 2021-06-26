import ImageBox from './ImageComponent.vue'
import PhotoFrame from './PhotoFrame.vue'
import useImageCache from './use'

export default function (app) {
  const { globalProperties } = app.config
  globalProperties.$image = useImageCache()
  app.component('ImageBox', ImageBox)
  app.component('PhotoFrame', PhotoFrame)
}
