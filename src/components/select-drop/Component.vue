/* eslint-disable prettier/prettier */
<script>
import { h, ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import cx from 'classnames'
import { v4 as uuid } from 'uuid'
import { ListModel } from '@/models/index'
import { getCoordinateBox } from '@/utility/dom'

export default {
  name: 'SelectDrop',
  inheritAttrs: false,
  props: {
    model: {
      type: Object,
      required: true,
    },
    field: {
      type: String,
      required: true,
    },
    computed: {
      type: Function,
      default: (v) => v,
    },
    validate: {
      type: [Function, Boolean],
      default: () => false,
    },
    template: {
      type: String,
      default: 'default',
    },
    classPrefix: {
      type: String,
      default: 'select-drop',
    },
    options: {
      type: [Array, ListModel],
      default: () => [],
    },
    optionName: {
      type: String,
      default: 'label',
    },
    optionValue: {
      type: String,
      default: 'value',
    },
    panelHeight: {
      type: Number,
      default: 200,
    },
    closeElement: {
      type: Object,
      default: () => ref(document.body),
    },
  },
  setup(props, context) {
    const errorInit = ref(false)
    const classPrefix = props.classPrefix
    const computedHandle = ref(props.computed)
    const validate = ref(props.validate)
    const field = ref(props.field)
    const model = props.model
    const selectFocus = ref(false)
    const refsElement = {
      root: ref({}),
      input: ref({}),
      wrapper: ref({}),
      panel: ref({}),
    }
    const selectWidth = ref('auto')

    const selectHeight = computed(() => {
      if (refsElement.input.value) {
        return refsElement.input.value.offsetHeight
      }
      return 'auto'
    })
    const modelValue = computed({
      get: () => model[field.value],
      set: (val) => {
        model[props.field] = val
      },
    })

    const errors = computed({
      get: () => model.errors && model.errors[field.value],
      set: (val) => {
        if (model.errors) {
          if (Array.isArray(val) && val.length) {
            model.errors[field.value] = val
          } else {
            model.errors[field.value] = [val]
          }
        }
      },
    })
    /**
     * @return {Boolean}
     */
    const isError = computed(() => {
      const isValid = () => {
        if (errors.value && errors.value.length) {
          errorInit.value = true
        }
        if (errorInit.value) {
          if (validate.value) errors.value = validate.value(modelValue.value)
          return errors.value && errors.value.length
        }
        return false
      }
      return isValid() || false
    })

    watch(
      () => {
        if (refsElement.root.value && refsElement.root.value instanceof HTMLElement) {
          return refsElement.root.value.offsetWidth
        }
        return refsElement.root.value
      },
      () => {
        const rootWidth = refsElement.root.value.offsetWidth
        if (options.data.map((p) => p.ref).filter((p) => p).length) {
          const maxWidth = Math.max(...options.data.map((p) => p.ref.offsetWidth))
          selectWidth.value = maxWidth ? `${maxWidth}px` : 'auto'
        } else {
          selectWidth.value = `${rootWidth}px`
        }
      }
    )
    const clickOver = (e) => {
      if (!refsElement.root.value.contains(e.target)) {
        selectFocus.value = false
      }
    }
    onMounted(() => {
      if (props.closeElement.value && props.closeElement.value instanceof HTMLElement) {
        props.closeElement.value.addEventListener('click', clickOver)
      }
    })
    onUnmounted(() => {
      if (props.closeElement.value && props.closeElement.value instanceof HTMLElement) {
        props.closeElement.value.removeEventListener('click', clickOver)
      }
    })

    // console.log()
    const renderInput = () => {
      return h('input', {
        ...context.attrs,
        class: cx(`${classPrefix}__input`, context.attrs.class),
        value: modelValue.value,
        ref: refsElement.input,
        type: 'text',
        onFocus: (e) => {
          selectFocus.value = true
          context.emit('focus', e)
        },
        onBlur: async (e) => {
          context.emit('blur', e)
        },
        onInput: (e) => {
          const option = options.data[Number(e.target.value) - 1]
          if (option) {
            modelValue.value = option[props.optionValue]
            selected.value = option
          }
          context.emit('input', e)
        },
        onChange: (e) => {
          const option = options.data.find((p) => String(p[props.optionValue]) === e.target.value)
          if (option) {
            modelValue.value = option[props.optionValue]
            selected.value = option
            context.emit('change', e)
          }
        },
        value: selected.value[props.optionName],
      })
    }

    const arrowIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 213.333 213.333" fill="currentColor"><polygon points="0,53.333 106.667,160 213.333,53.333 "/></svg>`
    const renderSelect = () => {
      return h('div', { role: 'select', class: cx(`${classPrefix}__select`) }, [
        checkeWindow() ? renderPanel() : null,
        h('div', { class: cx(`${classPrefix}__input-box`) }, [
          renderAppend('prefix'),
          renderInput(),
          renderAppend('suffix'),
          h('div', {
            class: cx(`${classPrefix}__arrow`),
            innerHTML: arrowIcon,
          }),
        ]),
        checkeWindow() ? null : renderPanel(),
      ])
    }
    const options = reactive(
      (() => {
        if (Array.isArray(props.options)) {
          return {
            data: props.options.map((option) => {
              if (typeof option === 'object') {
                option.uuid = uuid()
                return option
              }
              return {
                [props.optionValue]: option,
                [props.optionName]: option,
                uuid: option.uuid || uuid(),
              }
            }),
          }
        }
        if (props.options instanceof ListModel) {
          props.options.data.forEach((option) => {
            option.uuid = uuid()
          })
          return props.options
        }
        return { data: [] }
      })()
    )

    const selected = ref({})

    watch(options, () => {
      const target = options.data.find((p) => p[props.optionValue] === model[field.value])
      if (target) {
        selected.value = target
      }
    })

    const optionsRefsRender = (item) => {
      return (ref) => {
        item.ref = ref
      }
    }
    const renderPanel = () => {
      return h(
        'div',
        {
          class: cx(`${classPrefix}__panel`, context.attrs.class),
          style: {
            maxHeight: selectFocus.value ? `${props.panelHeight}px` : 0,
          },
          onTransitionend: (e) => {
            if (selectFocus.value) {
              e.target.style.overflow = 'auto'
              context.emit('open')
            } else {
              refsElement.wrapper.value.style.position = 'static'
              refsElement.wrapper.value.style.maxWidth = selectWidth.value
              refsElement.wrapper.value.style.minWidth = 'none'
              context.emit('close')
            }
          },
          onTransitionstart: (e) => {
            if (selectFocus.value) {
              refsElement.wrapper.value.style.position = 'absolute'
              refsElement.wrapper.value.style.maxWidth = 'none'
              refsElement.wrapper.value.style.minWidth = selectWidth.value
            } else {
              e.target.style.overflow = 'hidden'
            }
          },
        },
        [options.data.map((option, index) => renderOption(option, index))]
      )
    }
    const renderOption = (item, index) => {
      return h(
        'div',
        {
          role: 'option',
          key: item.uuid,
          class: cx(`${classPrefix}__option`, context.attrs.class, {
            [`${classPrefix}__option--selected`]: item[props.optionValue] === selected.value[props.optionValue],
          }),
          ref: optionsRefsRender(item, index),
          onClick: (e) => {
            if (modelValue.value !== item[props.optionValue]) {
              selected.value = item
              modelValue.value = item[props.optionValue]
              context.emit('change', e)
            }
            selectFocus.value = false
          },
        },
        [h('div', { class: cx(`${classPrefix}__text`) }, item[props.optionName] || item[props.optionValue])]
      )
    }
    Object.keys(context.slots).forEach((slotName) => {
      refsElement[slotName] = ref({})
    })
    const renderAppend = (name) => {
      const attrs = {
        ref: refsElement[name],
        class: cx(`${classPrefix}__${name}`),
      }
      return context.slots[name] ? h('div', attrs, context.slots[name]()) : null
    }
    const checkeWindow = () => {
      if (refsElement.root.value) {
        const box = getCoordinateBox(refsElement.root.value)
        const boolen1 = box.y + props.panelHeight + selectHeight.value > window.innerHeight
        const boolen2 = box.y > props.panelHeight
        return boolen1 && boolen2
      }
      return false
    }
    return () => {
      return h(
        'div',
        {
          ref: refsElement.root,
          class: cx(`${classPrefix}`, `${classPrefix}--${props.template}`, {
            [`${classPrefix}--active`]: selectFocus.value,
          }),
          style: {
            height: `${selectHeight.value}px`,
            width: selectWidth.value,
          },
        },
        [
          renderAppend('prepend'),
          h('div', { class: cx(`${classPrefix}__container`) }, [
            h(
              'div',
              {
                class: cx(`${classPrefix}__wrapper`, {
                  [`${classPrefix}--invalid`]: isError.value,
                }),
                ref: refsElement.wrapper,
                style: {
                  zIndex: 10,
                  top: checkeWindow() ? 'auto' : '0',
                  bottom: checkeWindow() ? '0' : 'auto',
                },
              },
              renderSelect()
            ),
          ]),
          renderAppend('append'),
        ]
      )
    }
  },
}
</script>
<style lang="scss" src="./style.scss"></style>
