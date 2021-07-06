import schema from '@/models/config/database'
import {
  useDialog
} from '@/components/dialog/index'
import DetailDialog from './DetailDialog.vue'
import TableOptions from '@/components/data-table/TableOptions.vue'
import AddModelButton from '@/container/AddModelButton.vue'
import LinePointButton from './LinePointButton.vue'

export default {
  routeTitle: '商品管理列表',
  modelSchema: schema.Products,
  modelName: 'Products',
  dataTable: {
    options: [{
        title: 'No.',
        field: (item, index) => index + 1,
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
        title: '價格',
        field: 'price',
        width: '80px',
        align: 'center'
      },
      {
        title: '庫存',
        field: 'stock',
        width: '80px',
        align: 'center'
      },
      {
        title: '類型',
        field: (item) => item.product_category.name,
        width: '180px',
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
              return '<span style="color: rgb(239, 68, 68)">關閉</span>'
            case 1:
              return '<span style="color: rgb(52, 211, 153)">正常</span>'
            default:
              return ''
          }
        },
        width: '100px',
        align: 'center',
      },
      {
        title: '功能',
        field: TableOptions,
        width: '80px',
        align: 'center',
        props: {
          plugins: [LinePointButton],
        },
      },
    ],
    clickTr: async (model, index, {
      listData
    }) => {
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
  },
  detailPage: DetailDialog,
  headerBar: [AddModelButton],
}