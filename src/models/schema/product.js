module.exports = {
  extends: 'DataModel',
  description: '產品相關資訊。',
  tebles: [{
      name: 'name',
      type: String,
      default: '',
      description: '產品的名稱',
    },
    {
      name: 'description',
      type: String,
      default: '',
      description: '產品的說明',
    },
    {
      name: 'price',
      type: Number,
      default: 0,
      description: '產品的價格',
    },
    {
      name: 'stock',
      type: Number,
      default: 0,
      description: '產品的庫存',
    },
    {
      name: 'state',
      type: Number,
      default: 0,
      description: '產品的狀態',
    },
    {
      name: 'category_id',
      type: Number,
      default: null,
      description: '產品所屬的類型 ID',
    },
    {
      name: 'product_category',
      type: 'ProductCategoryModel',
      description: '產品所屬的類型資訊',
    },
  ],
}