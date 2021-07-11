<template>
  <DialogLayout v-bind="$props" title="Line Point 列表">
    <div>
      <DataTable v-bind="dataTableProps" style="height: calc(100vh - 180px)"></DataTable>
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
import LinePointDetailDialog from './LinePointDetailDialog.vue'

export default {
  name: 'LinePointListDialog',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  components: {
    DialogLayout,
  },
  setup(props) {
    const model = props.props.model
    const productId = props.props.productId
    onMounted(() => {
      model.readList({ params: { product_id: productId } })
    })
    const dataTableProps = reactive({
      options: [
        { title: 'No.', field: (item, index) => index + 1, width: '60px', align: 'center' },
        { title: '建立日期', field: (item) => dayjs(item.created_at).format('YYYY/MM/DD HH:mm:ss'), width: '200px', align: 'center' },
        { title: '序號', field: 'number', width: 1, columnStyle: { minWidth: '180px' }, bodyStyle: { padding: '0 0.5rem' } },
        {
          title: '狀態',
          field: (item) => {
            switch (item.state) {
              case 0:
                return '<span style="color: rgb(59, 130, 246)">下架</span>'
              case 1:
                return '<span style="color: rgb(52, 211, 153)">上架</span>'
              case 2:
                return '<span style="color: rgb(156, 163, 175)">已使用</span>'
            }
          },
          width: '60px',
          align: 'center',
        },
      ],
      clickTr: async (item, index, { listData }) => {
        const dialog = props.dialog
        const thisPopup = dialog.findPopup(props.id)
        const onBgClickClose = thisPopup.onBackgroundClick
        thisPopup.onBackgroundClick = () => {}
        const popup = await dialog.popup(LinePointDetailDialog, {
          width: '620px',
          props: {
            model: item,
          },
        })
        thisPopup.onBackgroundClick = onBgClickClose
        listData.data.find((p) => p.id === popup.props.model.id).set(popup.props.model)
      },
      // filter(list) {
      //   return list.setData(list.data.filter((p) => p.product_id === productId))
      // },
      model,
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
