import schema from '@/models/config/database'
import { useDialog } from '@/components/dialog/index'
import DetailDialog from './DetailDialog.vue'
import AddModelButton from '@/container/AddModelButton.vue'

export default {
  routeTitle: '會員專區列表',
  modelSchema: schema.Members,
  dataTable: {
    options: [
      { title: 'No.', field: 'id', width: '80px', align: 'center' },
      {
        title: '標題',
        field: 'subject',
        width: 1,
        columnStyle: { minWidth: '160px' },
        bodyStyle: { padding: '0 0.5rem' },
        align: 'center',
      },
      {
        title: '內容',
        field: 'content',
        width: 1,
        columnStyle: { minWidth: '160px' },
        bodyStyle: { padding: '0 0.5rem' },
        align: 'center',
      },
      { title: '顯示/隱藏', field: (item) => (item.status ? '顯示' : '隱藏'), width: '100px', align: 'center' },
    ],
    clickTr: async (model, index, { listData }) => {
      const dialog = useDialog()
      const popup = await dialog.popup(DetailDialog, {
        onBackgroundClick: () => {},
        width: '768px',
        props: {
          model,
        },
      })
      if (popup.props.model.deleted) {
        listData.data.splice(index, 1)
      }
    },
    clickTd: (...args) => {
      // console.log('clickTd', args)
    },
  },
  detailPage: DetailDialog,
  headerBar: [AddModelButton],
}
