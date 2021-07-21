import schema from '@/models/config/database'
import {
  useDialog
} from '@/components/dialog/index'
import DetailDialog from '../Article/DetailDialog.vue'
import AddModelButton from '@/container/AddModelButton.vue'
import SearchBarButton from '@/container/SearchBarButton.vue'
import QuestionButton from '@/container/QuestionButton.vue'

export default {
  routeTitle: '文章列表',
  modelSchema: schema.Articles,
  modelName: 'Articles',
  dataTable: {
    options: [{
        title: 'No.',
        field: (item, index) => index + 1,
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
  questionContent: `或科子示大新氣說，長人母模變場看麼難有作你排在課事教經印行算發備，臺止排展廣，實考海業母、以小商向英開好禮實麼大術觀來的心看中它策待蘭預麼呢！地班再興味三重行臺方者生幾之生子樂。臺這銀天兩心時專汽變風的戲感，而說了、中的製何同卻原不，展風然般他字公面外！流在共十孩著成與，合經農緊銷人是印`,
  headerBar: [SearchBarButton, AddModelButton, QuestionButton],
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