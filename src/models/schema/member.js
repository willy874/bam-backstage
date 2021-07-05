module.exports = {
  extends: 'DataModel',
  description: '使用者相關資訊。',
  tebles: [
    {
      name: 'id',
      type: String,
      default: '',
      description: '使用者的 uuid 資料',
    },
    {
      name: 'name',
      type: String,
      default: '',
      description: 'LINE 的使用者顯示名稱',
    },
    {
      name: 'status_message',
      type: String,
      default: 1,
      description: 'LINE 狀態訊息',
    },
    {
      name: 'userid',
      type: String,
      default: '',
      description: 'LINE USER ID',
    },
    {
      name: 'line_status',
      type: Number,
      default: 0,
      description: 'LINE 的狀態碼，代表被是否被封鎖',
    },
    {
      name: 'points',
      type: Number,
      default: 0,
      description: '使用者的 LINE 點數',
    },
    {
      name: 'image_url',
      type: String,
      default: '',
      description: 'LINE 的使用者照片',
    },
    {
      name: 'state',
      type: String,
      default: 1,
      description: '使用者啟用停用',
    },
    {
      name: 'real_name',
      type: String,
      default: '',
      description: '使用者的名稱',
    },
    {
      name: 'gender',
      type: Number,
      default: null,
      description: '使用者的性別',
    },
    {
      name: 'email',
      type: String,
      default: '',
      description: '使用者的電子郵件',
    },
    {
      name: 'phone_number',
      type: String,
      default: '',
      description: '使用者的電話號碼',
    },
    {
      name: 'address',
      type: String,
      default: '',
      description: '使用者的地址',
    },
  ],
}
