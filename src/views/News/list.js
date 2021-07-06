import schema from '@/models/config/database'
import { useDialog } from '@/components/dialog/index'
import DetailDialog from './DetailDialog.vue'
// import Template from '@/components/dialog/Template.vue'
import AddModelButton from '@/container/AddModelButton.vue'

export default {
  routeTitle: '最新消息列表',
  modelSchema: schema.NewsMessages,
  modelName: 'NewsMessages',
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
      // await dialog.popup(Template)
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
  setupTest: ({ setupResult }) => {
    const model = setupResult.dataTableProps.model
    model.loading = true

    // 假資料測試
    setTimeout(() => {
      model.loading = false
      model.set({
        data: Array(60)
          .fill({
            id: 1,
            subject: '測試標題',
            content:
              '測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容測試內容',
            image: {},
            created_at: '',
            published_at: '',
            finished_at: '',
            status: 1,
          })
          .map((m, i) => {
            return {
              ...m,
              id: i + 1,
            }
          })
          .reverse(),
      })
    }, 1000)
    // ****************
  },
}
