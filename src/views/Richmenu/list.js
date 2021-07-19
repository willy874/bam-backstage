import schema from '@/models/config/database'
import {
  useDialog
} from '@/components/dialog/index'
import DetailDialog from './DetailDialog.vue'

export default {
  routeTitle: '圖文選單列表',
  modelSchema: schema.Richmenus,
  modelName: 'Richmenus',
  dataTable: {
    options: [{
        title: 'No.',
        field: (item, index) => index + 1,
        width: '80px',
        align: 'center'
      },
      {
        title: '分格數',
        field: 'grid',
        width: '80px',
        align: 'center'
      },
      {
        title: '名稱',
        field: 'name',
        width: 1,
        columnStyle: {
          minWidth: '180px'
        },
        bodyStyle: {
          padding: '0 0.5rem'
        },
        align: 'center'
      },
      {
        title: '描述',
        field: 'description',
        width: 2,
        columnStyle: {
          minWidth: '180px'
        },
        bodyStyle: {
          padding: '0 0.5rem'
        },
        align: 'left'
      },
      {
        title: '狀態',
        field: (item) => {
          switch (item.state) {
            case 0:
              return '<span>未上傳</span>'
            case 1:
              return '<span>未上傳圖片</span>'
            case 2:
              return '<span>修改未上傳</span>'
            case 3:
              return '<span>資料已同步</span>'
            default:
              ''
          }
        },
        width: '100px',
        align: 'center'
      },
    ],
    clickTr: async (model) => {
      const dialog = useDialog()
      const popup = await dialog.popup(DetailDialog, {
        width: '576px',
        props: {
          model,
        },
      })
      if (popup.props.model.deleted) {
        listData.data.splice(index, 1)
      }
    },
  },
  detailPage: DetailDialog,
  headerBar: [],
}