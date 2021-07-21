<template>
  <DialogLayout v-bind="$props" title="推播紀錄">
    <div>
      <DataTable v-bind="dataTableProps" style="height: 60vh"></DataTable>
    </div>
    <template #footer>
      <div class="flex flex-wrap justify-between items-center rounded-b-lg border-t p-2">
        <div class="px-2"></div>
        <div class="px-1 flex flex-wrap items-center">
          <button class="btn mx-1 text-primary-mirror bg-gray-500 hover:bg-gray-600" type="button" @click="close">關閉</button>
        </div>
      </div>
    </template>
  </DialogLayout>
</template>

<script>
import { reactive, onMounted } from 'vue'
import dayjs from 'dayjs'
import throttle from 'lodash/throttle'
import { ListModel, PushLogRelationModel } from '@/models/index'
import DialogLayout from '@/container/DialogLayout.vue'

export default {
  name: 'CategoryListDialog',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  components: {
    DialogLayout,
  },
  setup(props) {
    const model = props.props.model
    const listData = reactive(
      new ListModel({
        model: PushLogRelationModel,
      })
    )
    onMounted(async () => {
      await model.readPushLogs()
      await listData.setData(model.logs)
    })
    const dataTableProps = reactive({
      options: [
        { title: 'No.', field: (item, index) => index + 1, width: '60px', align: 'center' },
        {
          title: '發送日期',
          field: (item) => dayjs(item.log.created_at).format('YYYY/MM/DD HH:mm:ss'),
          width: 1,
          columnStyle: { minWidth: '180px' },
          bodyStyle: { padding: '0 0.5rem' },
        },
        { title: '成功數', field: 'success', width: '80px', align: 'center' },
        { title: '失敗數', field: 'fail', width: '80px', align: 'center' },
      ],
      model: listData,
    })
    return {
      dataTableProps,
      close: throttle(() => {
        props.dialog.closePopup(props.id)
      }, 300),
    }
  },
}
</script>
