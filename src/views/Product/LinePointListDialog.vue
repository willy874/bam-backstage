<template>
  <DialogLayout v-bind="$props" title="Line Point 列表">
    <div>
      <DataTable v-bind="dataTableProps" style="height: calc(100vh - 160px)"></DataTable>
    </div>
    <template #footer>
      <div class="flex justify-between items-center rounded-b-lg border-t p-2">
        <div class="px-2"></div>
        <div class="px-1 flex items-center">
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
import DialogLayout from '@/container/DialogLayout.vue'

export default {
  name: 'LinePointListDialog',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  components: {
    DialogLayout,
  },
  setup(props) {
    const model = props.props.model
    onMounted(() => {
      model.readList()
    })
    const productId = props.props.productId
    const dataTableProps = reactive({
      options: [
        { title: 'No.', field: (item, index) => index + 1, width: '60px', align: 'center' },
        { title: '建立日期', field: (item) => dayjs(item.created_at).format('YYYY/MM/DD HH:mm:ss'), width: '200px', align: 'center' },
        { title: '序號', field: 'number', width: 1, columnStyle: { minWidth: '180px' }, bodyStyle: { padding: '0 0.5rem' } },
        { title: '狀態', field: (item) => item.state ? '已使用' : '未使用', width: '60px', align: 'center' },
      ],
      filter (list) {
        return list.setData(list.data.filter(p => p.product_id === productId))
      },
      model,
    })
    return {
      dataTableProps,
      close: throttle(() => {
        props.dialog.closePopup(props.id)
      }, 300)
    }
  }
}
</script>
