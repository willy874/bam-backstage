import ImageModel from './image'
import ImageTagModel from './image-tag'
/**
 * @extends ImageModel
 * @property {Boolean} select 該檔案是否被選取
 * @property {Array<ImageTagModel>} tags 該檔案的系統標籤
 */
export default class ImageAssetModel extends ImageModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.selected = entity.selected || false
    this.tags = entity.tags ? entity.tags.map(p => new ImageTagModel(p)) : []
    this.arrayModel.tags = ImageTagModel
  }
}