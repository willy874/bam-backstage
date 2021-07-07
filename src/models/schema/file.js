module.exports = {
  extends: 'DataModel',
  tebles: [{
      name: 'id',
      type: String,
      default: '',
      description: '該Model的辨識索引',
    },
    {
      name: 'name',
      type: String,
      default: '',
      description: '該檔案的名稱',
    },
    {
      name: 'type',
      type: String,
      default: '',
      description: '該檔案的儲存類型',
    },
    {
      name: 'sort',
      type: Number,
      default: 0,
      description: '該檔案的排序',
    },
    {
      name: 'size',
      type: Number,
      default: 0,
      description: '該檔案的檔案大小',
    },
    {
      name: 'blob',
      type: String,
      default: null,
      description: '該檔案的二進位Blob檔',
    },
  ],
}