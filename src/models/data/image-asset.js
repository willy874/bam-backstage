import ImageModel from './image'
/**
 * @extends ImageModel
 * @property {Boolean} select 該檔案是否被選取
 * @property {Boolean} preview 該檔案是否可預覽
 */
export default class ImageAssetModel extends ImageModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.selected = entity.selected || false
  }
}