import schema from '@/models/config/database'
import { useDialog } from '@/components/dialog/index'
import DetailDialog from './DetailDialog.vue'

export default {
  routeTitle: '會員專區列表',
  modelName: 'Members',
  modelSchema: schema.Members,
  dataTable: {
    options: [
      { title: 'No.', field: (item, index) => index + 1, width: '80px', align: 'center' },
      {
        title: '相片',
        field: (item) => {
          if (item.image_url) {
            return `<div class="w-10 mx-auto"><div class="pt-1/1 rounded-full bg-cover bg-center" style="background-image: url(${item.image_url})"></div></div>`
          }
          return `<div class="w-10 mx-auto"><div class="rounded-full overflow-hidden bg-gray-200 text-gray-400 p-1"><svg width="100%" viewBox="0 0 45.532 45.532" fill="currentColor">
          <path d="M22.766,0.001C10.194,0.001,0,10.193,0,22.766s10.193,22.765,22.766,22.765c12.574,0,22.766-10.192,22.766-22.765S35.34,0.001,22.766,0.001z M22.766,6.808c4.16,0,7.531,3.372,7.531,7.53c0,4.159-3.371,7.53-7.531,7.53c-4.158,0-7.529-3.371-7.529-7.53C15.237,10.18,18.608,6.808,22.766,6.808z M22.761,39.579c-4.149,0-7.949-1.511-10.88-4.012c-0.714-0.609-1.126-1.502-1.126-2.439c0-4.217,3.413-7.592,7.631-7.592h8.762c4.219,0,7.619,3.375,7.619,7.592c0,0.938-0.41,1.829-1.125,2.438C30.712,38.068,26.911,39.579,22.761,39.579z"/>
          </svg></div></div>`
        },
        width: '60px',
        align: 'center',
      },
      { title: '名稱', field: 'name', width: 1, columnStyle: { minWidth: '180px' }, bodyStyle: { padding: '0 0.5rem' }, align: 'center' },
      {
        title: '性別',
        field: (item) => {
          switch (item.gender) {
            case 1:
              return '男'
            case 2:
              return '女'
            default:
              return '未選擇'
          }
        },
        width: '60px',
        align: 'center',
      },
      { title: '電子郵件', field: 'email', width: 1, columnStyle: { minWidth: '180px' }, bodyStyle: { padding: '0 0.5rem' }, align: 'center' },
      { title: '電話', field: 'phone_number', width: '120px', align: 'center' },
      { title: '地址', field: 'address', width: 2, columnStyle: { minWidth: '180px' }, bodyStyle: { padding: '0 0.5rem' }, align: 'left' },
      {
        title: '狀態',
        field: (item) => {
          switch (item.state) {
            case 0:
              return '<span style="color: rgb(156, 163, 175)">封鎖</span>'
            case 1:
              return '<span style="color: rgb(52, 211, 153)">正常</span>'
            default:
              return ''
          }
        },
        width: '100px',
        align: 'center',
      },
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
  },
  detailPage: DetailDialog,
  headerBar: [],
}
