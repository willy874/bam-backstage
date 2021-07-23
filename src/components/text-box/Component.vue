/* eslint-disable prettier/prettier */
<script>
import { h, ref, computed } from 'vue'
import cx from 'classnames'

export default {
  name: 'InputBox',
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
    type: {
      type: String,
      default: 'text',
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
      default: 'input-box',
    },
    style: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, context) {
    const passwordIcon = `<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" viewBox="0 0 469.333 469.333" fill="currentColor">
<path d="M234.667,170.667c-35.307,0-64,28.693-64,64s28.693,64,64,64s64-28.693,64-64S269.973,170.667,234.667,170.667z"/>
<path d="M234.667,74.667C128,74.667,36.907,141.013,0,234.667c36.907,93.653,128,160,234.667,160 c106.773,0,197.76-66.347,234.667-160C432.427,141.013,341.44,74.667,234.667,74.667z M234.667,341.333 c-58.88,0-106.667-47.787-106.667-106.667S175.787,128,234.667,128s106.667,47.787,106.667,106.667 S293.547,341.333,234.667,341.333z"/>
</svg>`
    const disabledPasswordIcon = `<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" viewBox="0 -10 469.44 469.44" fill="currentColor">
<path d="M231.147,160.373l67.2,67.2l0.32-3.52c0-35.307-28.693-64-64-64L231.147,160.373z"/>
<path d="M234.667,117.387c58.88,0,106.667,47.787,106.667,106.667c0,13.76-2.773,26.88-7.573,38.933l62.4,62.4c32.213-26.88,57.6-61.653,73.28-101.333c-37.013-93.653-128-160-234.773-160c-29.867,0-58.453,5.333-85.013,14.933l46.08,45.973C207.787,120.267,220.907,117.387,234.667,117.387z"/>
<path d="M21.333,59.253l48.64,48.64l9.707,9.707C44.48,145.12,16.64,181.707,0,224.053c36.907,93.653,128,160,234.667,160c33.067,0,64.64-6.4,93.547-18.027l9.067,9.067l62.187,62.293l27.2-27.093L48.533,32.053L21.333,59.253z M139.307,177.12l32.96,32.96c-0.96,4.587-1.6,9.173-1.6,13.973c0,35.307,28.693,64,64,64c4.8,0,9.387-0.64,13.867-1.6l32.96,32.96c-14.187,7.04-29.973,11.307-46.827,11.307C175.787,330.72,128,282.933,128,224.053C128,207.2,132.267,191.413,139.307,177.12z"/>
</svg>`
    const errorInit = ref(false)
    const type = ref(props.type)
    const isPassword = ref(type.value === 'password')
    const isViewPassword = ref(true)
    const classPrefix = props.classPrefix
    const computedHandle = ref(props.computed)
    const validate = ref(props.validate)
    const field = ref(props.field)
    const model = props.model
    const modelValue = computed({
      get: () => model[field.value],
      set: (val) => {
        model[props.field] = computedHandle.value(val)
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
    const inputType = computed(() => {
      if (isPassword.value) {
        return isViewPassword.value ? 'password' : 'text'
      }
      return type.value === 'textarea' ? false : type.value
    })
    const refsElement = {
      input: ref({}),
    }
    Object.keys(context.slots).forEach((slotName) => {
      refsElement[slotName] = ref({})
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
    const renderAppend = (name) => {
      if (name === 'suffix' && isPassword.value) {
        return h('div', {
          innerHTML: isViewPassword.value ? passwordIcon : disabledPasswordIcon,
          onClick: () => {
            isViewPassword.value = !isViewPassword.value
          },
          class: cx(`${classPrefix}__append-slots`, `${classPrefix}__suffix`, `${classPrefix}__password`),
        })
      }
      return context.slots[name]
        ? h(
            'div',
            {
              ref: refsElement[name],
              class: cx(`${classPrefix}__${name}`),
            },
            context.slots[name]()
          )
        : null
    }
    const renderInput = () =>
      h(type.value === 'textarea' ? 'textarea' : 'input', {
        ...context.attrs,
        ref: refsElement.input,
        class: cx(`${classPrefix}__input`),
        style: props.style,
        onInput: (e) => {
          modelValue.value = e.target.value
          context.emit('input', e)
        },
        onChange: (e) => {
          errorInit.value = true
          if (validate.value) errors.value = validate.value(modelValue.value)
          context.emit('change', e)
        },
        value: modelValue.value,
        type: inputType.value,
      })
    return () => {
      return h(
        'div',
        {
          class: cx(`${classPrefix}`, `${classPrefix}--${props.template}`, {
            [`${classPrefix}--disabled`]: context.attrs.disabled,
            [`${classPrefix}--invalid`]: isError.value,
          }),
        },
        [
          renderAppend('prepend'),
          h('div', { class: cx(`${classPrefix}__container`) }, [
            renderAppend('prefix'),
            h('div', { class: cx(`${classPrefix}__wrapper`) }, [renderInput()]),
            renderAppend('suffix'),
          ]),
          renderAppend('append'),
        ]
      )
    }
  },
}
</script>
<style lang="scss" src="./style.scss"></style>
