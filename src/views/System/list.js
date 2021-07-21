import dayjs from 'dayjs'
import schema from '@/models/config/database'
import {
  useDialog
} from '@/components/dialog/index'
import DetailDialog from './DetailDialog.vue'
import AddModelButton from '@/container/AddModelButton.vue'

export default {
  routeTitle: '管理者列表',
  modelSchema: schema.Admins,
  modelName: 'Admins',
  dataTable: {
    options: [{
        title: 'No.',
        field: (item, index) => index + 1,
        width: '120px',
        align: 'center'
      }, {
        title: '名稱',
        field: 'name',
        width: 2,
        columnStyle: {
          minWidth: '120px'
        },
        bodyStyle: {
          padding: '0 0.5rem'
        },
        align: 'center',
      },
      {
        title: '帳號',
        field: 'username',
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
        title: '最後修改時間',
        field: (item) => dayjs(item.updated_at).format('YYYY/MM/DD HH:mm'),
        width: 2,
        columnStyle: {
          minWidth: '180px'
        },
        bodyStyle: {
          padding: '0 0.5rem'
        },
        align: 'center',
      },
      {
        title: '角色',
        field: 'role_name',
        width: 1,
        columnStyle: {
          minWidth: '120px'
        },
        bodyStyle: {
          padding: '0 0.5rem'
        },
        align: 'center',
      },
    ],
    clickTr: async (model, index, {
      listData
    }) => {
      const dialog = useDialog()
      const popup = await dialog.popup(DetailDialog, {
        onBackgroundClick: () => {},
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
  headerBar: [AddModelButton],
}