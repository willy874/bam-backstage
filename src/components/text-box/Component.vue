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
  },
  setup(props, context) {
    const errorInit = ref(false)
    const type = ref(props.type)
    // const isPassword = ref(type.value === 'password')
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
    const renderAppend = (name) =>
      context.slots[name]
        ? h(
            'div',
            {
              ref: refsElement[name],
              class: cx(`${classPrefix}__${name}`),
            },
            context.slots[name]()
          )
        : null
    const renderInput = () =>
      h(type.value === 'textarea' ? 'textarea' : 'input', {
        ...context.attrs,
        ref: refsElement.input,
        class: cx(`${classPrefix}__input`, {
          [`${classPrefix}--invalid`]: isError.value,
        }),
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
        type: type.value === 'textarea' ? type.value : false,
      })
    return () =>
      h(
        'div',
        {
          class: cx(`${classPrefix}`, `${classPrefix}--${props.template}`),
        },
        [
          renderAppend('prepend'),
          h(
            'div',
            {
              class: cx(`${classPrefix}__container`),
            },
            [
              renderAppend('prefix'),
              h(
                'div',
                {
                  class: cx(`${classPrefix}__wrapper`),
                },
                [renderInput()]
              ),
              renderAppend('suffix'),
            ]
          ),
          renderAppend('append'),
        ]
      )
  },
}
</script>
<style lang="scss" src="./style.scss"></style>
