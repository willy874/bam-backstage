import schema from '@/models/config/database'
import {
  useDialog
} from '@/components/dialog/index'
import TableOptions from '@/components/data-table/TableOptions.vue'
import AddModelButton from '@/container/AddModelButton.vue'
import DetailDialog from './DetailDialog.vue'
import TableOptionButton from '../LinePush/TableOptionButton.vue'

export default {
  routeTitle: '分眾管理',
  modelName: 'MemberCategories',
  modelSchema: schema.MemberCategories,
  dataTable: {
    options: [{
        title: 'No.',
        field: (item, index) => index + 1,
        width: '80px',
        align: 'center'
      },
      {
        title: '標籤',
        field: (item) => {
          const badgeColor = {
            color: item.color.split(',')[0],
            backgroundColor: item.color.split(',')[1],
          }
          return `<div v-if="model.name" class="text-sm py-1 px-2 inline-block rounded" style="color: ${badgeColor.color}; background-color: ${badgeColor.backgroundColor}">${item.name}</div>`
        },
        width: 1,
        columnStyle: {
          minWidth: '80px'
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
          minWidth: '120px'
        },
        bodyStyle: {
          padding: '0 0.5rem'
        },
        align: 'center'
      },
      {
        title: '數量',
        field: 'members_count',
        width: '60px',
        align: 'center',
      },
      {
        title: '功能',
        field: TableOptions,
        width: '80px',
        align: 'center',
        props: {
          plugins: [TableOptionButton],
        },
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