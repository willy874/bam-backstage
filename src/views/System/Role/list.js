import schema from '@/models/config/database'
import {
  useDialog
} from '@/components/dialog/index'
import DetailDialog from './DetailDialog.vue'
import AddModelButton from '@/container/AddModelButton.vue'

export default {
  routeTitle: '角色管理',
  modelSchema: schema.Roles,
  modelName: 'Roles',
  dataTable: {
    options: [{
        title: 'No.',
        field: (item, index) => index + 1,
        width: '80px',
        align: 'center'
      }, {
        title: '名稱',
        field: 'name',
        width: '160px',
        align: 'center'
      },
      {
        title: '描述',
        field: 'description',
        width: 1,
        columnStyle: {
          minWidth: '120px'
        },
        bodyStyle: {
          padding: '0 0.5rem'
        },
        align: 'center',
      }
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
  questionContent: `或科子示大新氣說，長人母模變場看麼難有作你排在課事教經印行算發備，臺止排展廣，實考海業母、以小商向英開好禮實麼大術觀來的心看中它策待蘭預麼呢！地班再興味三重行臺方者生幾之生子樂。臺這銀天兩心時專汽變風的戲感，而說了、中的製何同卻原不，展風然般他字公面外！流在共十孩著成與，合經農緊銷人是印`,
  headerBar: [AddModelButton],
}