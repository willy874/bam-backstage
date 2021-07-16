import schema from '@/models/config/database'
import {
  useDialog
} from '@/components/dialog/index'
import DetailDialog from '../Article/DetailDialog.vue'
import AddModelButton from '@/container/AddModelButton.vue'
import SearchBarButton from '@/container/SearchBarButton.vue'

export default {
  routeTitle: '文章列表',
  modelSchema: schema.Articles,
  modelName: 'Articles',
  dataTable: {
    options: [{
        title: 'No.',
        field: 'id',
        width: '80px',
        align: 'center'
      },
      {
        title: '文章類型',
        field: (item) => {
          switch (item.category) {
            case 'news':
              return '最新消息'
            case 'faq':
              return '問與答'
            default:
              return ''
          }
        },
        width: '100px',
        align: 'center'
      },
      {
        title: '標題',
        field: 'title',
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
        title: '副標題',
        field: 'sub_title',
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
        title: '內容',
        field: 'content',
        width: 2,
        columnStyle: {
          minWidth: '200px'
        },
        bodyStyle: {
          padding: '0 0.5rem'
        },
        align: 'center',
      },
      {
        title: '狀態',
        field: (item) => (item.state ? '顯示' : '隱藏'),
        width: '100px',
        align: 'center'
      },
    ],
    clickTr: async (model, index, {
      listData
    }) => {
      // console.log(element)
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
  headerBar: [SearchBarButton, AddModelButton],
  search: {
    allow: [{
        value: 'title',
        label: '標題'
      },
      {
        value: 'sub_title',
        label: '副標題'
      },
      {
        value: 'content',
        label: '內容'
      },
      {
        value: {
          type: 'category',
          search: 'category',
          category: [{
              value: 'all',
              label: '全部'
            },
            {
              value: 'news',
              label: '最新消息'
            },
            {
              value: 'faq',
              label: '問與答'
            },
          ]
        },
        label: '類型'
      },
    ]
  }
}