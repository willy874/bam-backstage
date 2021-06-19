import { h, isVNode, ref } from 'vue'
import * as Pattern from './pattern'

/**
 * @param {}
 */
export default {
  name: 'Icon',
  props: {
    src: {
      type: String,
      required: true,
    },
    size: {
      type: [Number, String, Array, Object],
      default: 'auto auto',
    },
    tag: {
      type: String,
      default: 'div',
    },
  },
  setup(props, context) {
    const svgSize = () => {
      if (typeof props.size === 'number') {
        return {
          width: props.size,
          height: props.size,
        }
      }
      if (typeof props.size === 'string') {
        const size = props.size.split(',')
        return {
          width: size[0],
          height: size[1] || size[0],
        }
      } else if (Array.isArray(props.size)) {
        return {
          width: props.size[0],
          height: props.size[1] || props.size[0],
        }
      } else if (typeof props.size === 'object') {
        return {
          width: props.size.width,
          height: props.size.height || 'auto',
        }
      } else {
        console.error('[Icon] Is size is not a string.')
      }
    }
    if (typeof props.src === 'string') {
      if (/^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/.test(props.src)) {
        return () => {
          return h(props.tag, {
            innerHTML: props.src,
          })
        }
      }
      if (/^(\.(\.?)\/|\/|http(s?):\/\/\D)/.test(props.src)) {
        const src = ref('')
        fetch(props.src)
          .then((res) => res.blob())
          .then((blob) => {
            src.value = URL.createObjectURL(blob)
          })
        return () => {
          return h('img', {
            src: src.value,
          })
        }
      }
    }
    if (isVNode(props.src)) {
      return () => props.src
    }
    return () => {
      const attrs = typeof Pattern[props.src] !== 'string' && 'attrs' in Pattern[props.src] ? Pattern[props.src].attrs : {}
      return h('svg', {
        width: svgSize().width,
        height: svgSize().height,
        innerHTML: Pattern[props.src].path,
        ...attrs,
      })
    }
  },
}
