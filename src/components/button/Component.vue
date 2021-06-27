<script>
import { h, ref, onMounted, computed, reactive, isReactive } from 'vue'
import { DataModel, ListModel } from '@/models/index'

export default {
  name: 'Button',
  props: {
    model: {
      type: [DataModel, ListModel],
      required: true,
    },
    tag: {
      type: String,
      default: 'button',
    },
    type: {
      type: String,
      default: 'button',
    },
  },
  setup(props, { slots }) {
    const btn = ref(null)
    const btnWidth = ref(null)
    const btnHeight = ref(null)
    const model = isReactive(props.model) ? props.model : reactive(props.model)
    const loadingIcon = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
<path fill="currentColor" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
<animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"></animateTransform>
</path></svg>`
    onMounted(() => {
      btnWidth.value = btn.value.offsetWidth
      btnHeight.value = btn.value.offsetHeight
    })
    const hasLoading = computed(() => {
      return model.loading
    })
    const loadingSlot = () => {
      if (slots.loading) {
        return slots.loading()
      }
      return h('i', {
        innerHTML: loadingIcon,
      })
    }
    return () => {
      return h(
        props.tag,
        {
          ref: btn,
          type: props.type,
          disabled: hasLoading.value,
          style: {
            width: btnWidth.value ? `${btnWidth.value}px` : 'auto',
            height: btnHeight.value ? `${btnHeight.value}px` : 'auto',
          },
        },
        [hasLoading.value ? loadingSlot() : h('span', slots.default())]
      )
    }
  },
}
</script>

<style lang="scss" scoped>
button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 1rem;
  border-width: 0;
  border-radius: 0.25rem;
  &:focus {
    outline: none;
  }
  span {
    display: inline-block;
  }
  i {
    display: block;
    width: 24px;
    height: 24px;
  }
  svg {
    display: block;
    width: 24px;
    height: 24px;
  }
  &:disabled {
    pointer-events: none;
    opacity: 0.7;
  }
}
</style>
