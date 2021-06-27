import schema from '@/models/config/database'
import { useDialog } from '@/components/dialog/index'
import DetailDialog from './DetailDialog.vue'
// import Template from '@/components/dialog/Template.vue'

export default {
  routeTitle: '最新消息列表',
  modelSchema: schema.Articles,
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
    clickTr: async (model) => {
      const dialog = useDialog()
      // await dialog.popup(Template)
      dialog.popup(DetailDialog, {
        onBackgroundClick: () => {},
        width: '768px',
        props: {
          model,
        },
      })
    },
    clickTd: (...args) => {
      // console.log('clickTd', args)
    },
  },
  setupTest: ({ setupResult }) => {
    const list = setupResult.dataTableProps.list
    list.loading = true

    // 假資料測試
    setTimeout(() => {
      list.loading = false
      list.set({
        data: Array(30)
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
