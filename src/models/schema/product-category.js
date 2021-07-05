module.exports = {
  extends: 'DataModel',
  description: '產品類型相關資訊。',
  tebles: [
    {
      name: 'name',
      type: String,
      default: '',
      description: '產品類型的名稱',
    },
    {
      name: 'description',
      type: String,
      default: '',
      description: '產品類型的說明',
    },
  ],
}
