module.exports = {
  extends: 'DataModel',
  description: 'Line 點數相關資訊。',
  tebles: [
    {
      name: 'product_id',
      type: Number,
      default: 0,
      description: '該點數資訊所屬的產品唯一編號',
    },
    {
      name: 'number',
      type: String,
      default: '',
      description: '該點數資訊的編號',
    },
    {
      name: 'state',
      type: Number,
      default: 1,
      description: '該點數資訊的狀態',
    },
  ],
}
