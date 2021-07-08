import schema from '@/models/config/database'
import SearchBarButton from '@/container/SearchBarButton.vue'
import AddUploadButton from '@/container/button/AddUpload.vue'

export default {
  routeTitle: '圖片管理',
  modelSchema: schema.ImageAssets,
  modelName: 'ImageAssets',
  headerBar: [SearchBarButton, AddUploadButton],
  fileLimit: 0,
  fileLength: 0,
  fileType: 'image',
}