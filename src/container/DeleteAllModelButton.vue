<template>
  <div v-if="selectList.length" @click.stop>
    <button type="button" class="btn-icon text-red-500 hover:text-red-600" @click="click">
      <Icon src="Trash" size="24" />
    </button>
  </div>
</template>

<script>
import { reactive, isReactive, computed } from 'vue'
// import { Observable } from 'bam-utility-plugins'
// import { ListModel, ImageAssetModel } from '@/models/index'
// import Swal from '@/utility/alert'
// import { useDialog } from '@/components/dialog/index'
// import LoadingDialog from './LoadingDialog.vue'
import { ListModel } from '@/models/index'
import { deleteAllModel } from '@/utility/model-handle'

export default {
  name: 'DeleteAllModelButton',
  inheritAttrs: false,
  props: {
    listModelData: {
      type: ListModel,
      default: () => null,
    },
    deleteCallback: {
      type: Function,
      default: () => null,
    },
  },
  setup(props) {
    const listModelData = isReactive(props.listModelData) ? props.listModelData : reactive(props.listModelData)
    const selectList = computed(() => listModelData.data.filter((p) => p.selected))
    return {
      selectList,
      click: async () => {
        deleteAllModel(listModelData)
          .then((res) => {
            if (props.deleteCallback) props.deleteCallback(res)
          })
          .catch((err) => {
            if (props.deleteCallback) props.deleteCallback(err)
          })
      },
    }
  },
}
</script>
