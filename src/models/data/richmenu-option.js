/**
 * 圖文選單的切割設定
 * JPEG、PNG
 * 2500px × 1686px
 * 2500px × 843px
 * 1200px × 810px
 * 1200px × 405px
 * 800px × 540px
 * 800px × 270px
 * @property {String} x 橫軸座標
 * @property {String} y 縱軸座標
 * @property {String} width 寬度大小
 * @property {String} height 高度大小
 */
class RichmenuBoundsModel {
  constructor(args) {
    const entity = args || {}
    this.x = entity.x || 0
    this.y = entity.y || 0
    this.width = entity.width || 0
    this.height = entity.height || 0
  }
}

/**
 * 圖文選單的執行設定
 * @property {String} type 圖文選單的功能類型
 * message:
 * postback:
 * uri:
 * @property {String} label 圖文選單的顯示文字
 * @property {String} text 
 * @property {String} data 
 * @property {String} uri 
 */
class RichmenuActionModel {
  constructor(args) {
    const entity = args || {}
    this.type = entity.type || ''
    this.label = entity.label || ''
    this.text = entity.text || ''
    this.data = entity.data || ''
    this.uri = entity.uri || ''
  }
}

/**
 * 圖文選單相關設定。
 * @property {String} bounds 圖文選單的切割設定
 * @property {String} action 圖文選單的執行設定
 */
export default class RichmenuOptionModel {
  constructor(args) {
    const entity = args || {}
    this.bounds = new RichmenuBoundsModel(entity.bounds)
    this.action = new RichmenuActionModel(entity.action)
  }
}