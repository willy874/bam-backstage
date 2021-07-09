<script>
import { h, ref, reactive, isReactive, onMounted } from 'vue'
import { ImageModel } from '@/models/index'

export default {
  name: 'ImageBox',
  props: {
    display: {
      type: String,
      default: 'image',
    },
    src: {
      type: [Object, String],
      default: '',
    },
    errorImage: {
      type: [String, Promise],
      default: import('./default-image.jpg'),
    },
    defaultImage: {
      type: [String, Promise],
      default: import('./default-image.jpg'),
    },
    cors: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, context) {
    const renderCheck = (el, count) => {
      return new Promise((resolve) => {
        let hz = 0
        const render = () => {
          if (count > hz && el && el.offsetHeight === 0) {
            hz++
            window.requestAnimationFrame(render)
          } else {
            resolve()
          }
        }
        render()
      })
    }
    const createImageModel = (src) => {
      if (src instanceof ImageModel) {
        return isReactive(src) ? src : reactive(src)
      }
      if (typeof src === 'string') {
        if (/^data:(\w)*\/(\w)*;base64,/.test(src)) {
          return reactive(new ImageModel({ image_base64: src }))
        }
        if (/^http(s)?:\/\//.test(src)) {
          return reactive(new ImageModel({ image_url: src, loading: true }))
        }
      }
      if (src instanceof Blob) {
        return reactive(new ImageModel({ image_blob: src }))
      }
      return reactive(new ImageModel())
    }
    const handleImage = async (image) => {
      if (image.image_url) {
        if (props.cors) {
          source.value = image.image_url
        } else {
          source.value = await handleUrl(image)
        }
      } else if (image.image_base64) {
        source.value = image.image_base64
      } else if (image.image_blob) {
        source.value = await handleBlob(image)
      } else {
        source.value = props.defaultImage instanceof Promise ? (await props.defaultImage).default : props.defaultImage
      }
      return source.value
    }
    const handleBlob = (image) => {
      const blob = image.image_blob
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const base64 = e.target.result
          image.image_base64 = base64
          resolve(base64)
        }
        reader.readAsDataURL(blob)
      })
    }
    const handleUrl = async (image) => {
      const useImageCache = (await import('./use')).default
      const ImageCache = useImageCache()
      const url = image.image_url
      if (ImageCache.has(url)) {
        return URL.createObjectURL(ImageCache.get(url))
      }
      const res = await fetch(url)
      if (res.ok) {
        const blob = await res.blob()
        image.loading = false
        image.image_blob = blob
        ImageCache.set(url, blob)
        // const base64 = URL.createObjectURL(blob)
        const base64 = await handleBlob(image)
        return base64
      } else {
        return props.errorImage instanceof Promise ? (await props.errorImage).default : props.errorImage
      }
    }
    const model = createImageModel(props.src)
    const imgElement = ref(null)
    const source = ref('')
    const sourceHandler = (image) => {
      if (image.image_base64) {
        return image.image_base64
      }
      if (image.image_url) {
        return image.image_url
      }
      return source.value
    }
    const updateData = async () => {
      await handleImage(model)
      await renderCheck(imgElement.value, 60)
      context.emit('ready')
    }
    onMounted(updateData)
    return () => {
      console.log(model)
      if (props.display === 'background' || props.display === 'bg') {
        return h('div', {
          ...context.attrs,
          class: 'image-box',
          style: {
            backgroundImage: `url(${sourceHandler(model)})`,
          },
        })
      } else {
        return h('img', {
          ref: imgElement,
          class: 'image-box',
          src: sourceHandler(model),
          ...context.attrs,
        })
      }
    }
  },
}
</script>
<style lang="scss" scoped>
.image-box {
  display: block;
}
.image-box--loading {
  display: block;
}
</style>
