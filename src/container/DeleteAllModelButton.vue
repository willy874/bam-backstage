<template>
  <div v-if="selectList.length" @click.stop>
    <button type="button" class="btn-icon text-red-500 hover:text-red-600" @click="click">
      <Icon src="Trash" size="24" />
    </button>
  </div>
</template>

<script>
import { reactive, isReactive, computed } from 'vue'
import { Observable } from 'bam-utility-plugins'
import { ListModel } from '@/models/index'
import Swal from '@/utility/alert'
import { useDialog } from '@/components/dialog/index'
import LoadingDialog from './LoadingDialog.vue'

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
        const dialog = useDialog()
        const swalResult = await Swal.delete(selectList.value.length)
        if (swalResult.isConfirmed) {
          const count = reactive({
            value: selectList.value.length,
          })
          const deleteIndex = reactive({
            value: 0,
          })
          const deleteList = []
          const observable = new Observable((subscriber) => {
            selectList.value.forEach((model) => {
              subscriber.next(async () => {
                await model.deleteData()
                deleteIndex.value++
                const indexOf = listModelData.data.map((m) => m.id).indexOf(model.id)
                deleteList.concat(listModelData.data.splice(indexOf, 1))
              })
            })
            subscriber.error(async (error) => {
              if (process.env.NODE_ENV === 'development') {
                console.log('%c[DeleteAllModelButton] Error: deleteData', 'color: #f00;background: #ff000011;padding: 2px 6px;border-radius: 4px;')
                console.dir(error)
              }
              deleteIndex.value = count.value
              await Swal.error({ title: '刪除過程發生錯誤' })
              if (props.deleteCallback) props.deleteCallback(error)
            })
            subscriber.complete(async () => {
              await Swal.success({ title: '資料刪除成功' })
              if (props.deleteCallback) props.deleteCallback(deleteList)
            })
          })
          observable.run()
          await dialog.popup(LoadingDialog, {
            width: '100%',
            props: {
              count,
              index: deleteIndex,
              title: '刪除中...',
            },
          })
        }
      },
    }
  },
}
</script>
