<template>
  <div>
    <button class="btn-icon text-primary-500 hover:text-primary-600" @click="click">
      <Icon src="Add" size="24" />
    </button>
  </div>
</template>

<script>
import { reactive, isReactive } from 'vue'
import { ListModel } from '@/models/index'
import { useDialog } from '@/components/dialog/index'

export default {
  name: 'AddModelButton',
  inheritAttrs: false,
  props: {
    detailPage: {
      type: Object,
      default: () => null,
    },
    listModelData: {
      type: ListModel,
      default: () => null,
    },
  },
  setup(props, context) {
    const dialog = useDialog()
    const { detailPage } = props
    const listModelData = isReactive(props.listModelData) ? props.listModelData : reactive(props.listModelData)
    return {
      click: async () => {
        const popup = await dialog.popup(detailPage, {
          onBackgroundClick: () => {},
          width: '768px',
        })
        if (popup.props.model) {
          listModelData.data.push(popup.props.model)
        }
      },
    }
  },
}
</script>
