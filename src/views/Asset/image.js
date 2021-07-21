import schema from '@/models/config/database'
import SearchBarButton from '@/container/SearchBarButton.vue'
import AddUploadButton from '@/container/AddUploadButton.vue'
import DeleteAllModelButton from '@/container/DeleteAllModelButton.vue'

export default {
  routeTitle: '圖片管理',
  modelSchema: schema.ImageAssets,
  modelName: 'ImageAssets',
  headerBar: [SearchBarButton, DeleteAllModelButton, AddUploadButton],
  fileLimit: 1000000,
  fileLength: 0,
  fileType: 'image',
}