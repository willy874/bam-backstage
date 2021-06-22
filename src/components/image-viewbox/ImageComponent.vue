<script>
import { h, ref, reactive, isReactive } from 'vue'
import { ImageModel } from '@/models/index'
import defaultImage from './default-image.jpg'

export default {
  name: 'ImageBox',
  props: {
    display: {
      type: String,
      default: 'image',
    },
    src: {
      type: [ImageModel, String],
      default: '',
    },
    defaultImage: {
      type: String,
      default: defaultImage,
    },
    loadingImage: {
      type: String,
      default: '',
    },
  },
  setup(props, context) {
    const createImageModel = (src) => {
      if (src instanceof ImageModel) {
        return isReactive(src) ? src : reactive(src)
      }
      if (typeof src === 'string') {
        if (/^data:(\w)*\/(\w)*;base64,/.test(src)) {
          return reactive(new ImageModel({ image_base64: src }))
        }
        if (/^http(s)?:\/\//.test(src)) {
          return reactive(new ImageModel({ image_url: src }))
        }
      }
      if (src instanceof Blob) {
        return reactive(new ImageModel({ image_blob: src }))
      }
      return reactive(new ImageModel())
    }
    const handleImage = async (image) => {
      if (image.loading) {
        source.value = props.loadingImage
      } else if (image.image_url) {
        source.value = await handleUrl(image)
      } else if (image.image_base64) {
        source.value = image.image_base64
      } else if (image.image_blob) {
        source.value = await handleBlob(image)
      } else {
        source.value = props.defaultImage
      }
    }
    const handleBlob = (image) => {
      const blob = image.image_blob
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const base64 = e.target.result
          image.image_base64 = base64
          context.emit('load', base64)
          resolve(base64)
        }
        reader.readAsDataURL(blob)
      })
    }
    const handleUrl = async (image) => {
      const res = await fetch(image.image_url)
      const blob = await res.blob()
      image.image_blob = blob
      handleBlob(image)
      return URL.createObjectURL(blob)
    }
    const model = createImageModel(props.src)
    const source = ref('')
    handleImage(model)
    return () => {
      if (source.value) {
        if (props.display === 'background' || props.display === 'bg') {
          return h('div', {
            ...context.attrs,
            class: 'image-box',
            style: {
              backgroundImage: `url(${source.value})`,
            },
          })
        } else {
          return h('img', {
            class: 'image-box',
            src: source.value,
            ...context.attrs,
          })
        }
      } else {
        if (context.slots && context.slots.loading) {
          return context.slots.loading
        } else {
          return h('div', { class: 'image-box--loading' })
        }
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
