import dayjs from 'dayjs'
import schema from '@/models/config/database'
import {
  useDialog
} from '@/components/dialog/index'
import DetailDialog from './DetailDialog.vue'

export default {
  routeTitle: '訂單列表',
  modelSchema: schema.Orders,
  modelName: 'Orders',
  dataTable: {
    options: [{
        title: 'No.',
        field: (item, index) => index + 1,
        width: '120px',
        align: 'center'
      }, {
        title: '產品名稱',
        field: 'product_name',
        width: 1,
        columnStyle: {
          minWidth: '120px'
        },
        bodyStyle: {
          padding: '0 0.5rem'
        },
        align: 'center',
      },
      {
        title: '產品價格',
        field: 'product_price',
        width: '120px',
        align: 'center',
      },
      {
        title: '產品類型',
        field: 'product_category_name',
        width: '120px',
        align: 'center',
      },
      {
        title: '購買人暱稱',
        field: 'member_name',
        width: '120px',
        align: 'center',
      },
      {
        title: '下單時間',
        field: (item) => dayjs(item.created_at).format('YYYY/MM/DD HH:mm'),
        width: 1,
        columnStyle: {
          minWidth: '180px'
        },
        bodyStyle: {
          padding: '0 0.5rem'
        },
        align: 'center',
      },
      {
        title: '訂單狀態',
        field: (item) => {
          switch (item.state) {
            case 0:
              return '未付款'
            case 1:
              return '已付款'
            case 2:
              return '已取消'
          }
        },
        width: '80px',
        align: 'center',
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
  headerBar: [],
}