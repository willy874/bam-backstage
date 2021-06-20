// import axios from 'axios'
// import { axiosInstance } from '@/api'
// class UploadAdapter {
//   constructor(loader) {
//     this.loader = loader
//     this.cancelTokenSource = axios.CancelToken.source()
//   }
//   upload() {
//     return this.loader.file.then((file) => {
//       return new Promise((resolve, reject) => {
//         const progressEvent = (evt) => {
//           if (evt.lengthComputable) {
//             this.loader.uploadTotal = evt.total
//             this.loader.uploaded = evt.loaded
//           }
//         }
//         const data = new FormData()
//         data.append('upload', file)
//         axiosInstance({
//           config: {
//             cancelToken: this.cancelTokenSource.token,
//             onUploadProgress: progressEvent,
//             onDownloadProgress: progressEvent,
//           },
//         })
//           .post('image/upload', data)
//           .then((res) => {
//             resolve({ default: res.url })
//           })
//           .catch(reject)
//       })
//     })
//   }
//   abort() {
//     this.cancelTokenSource.cancel()
//   }
// }
// function CustomUploadAdapterPlugin(editor) {
//   editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
//     return new UploadAdapter(loader)
//   }
// }

export default {
  // extraPlugins: [CustomUploadAdapterPlugin],

  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      'indent',
      'outdent',
      'blockQuote',
      '|',
      'undo',
      'redo',
      '|',
      'fontColor',
      'fontFamily',
      'fontSize',
      'underline',
      'highlight',
      '|',
      'imageUpload',
      'imageInsert',
      'CKFinder',
      'insertTable',
      'mediaEmbed',
      '|',
      'htmlEmbed',
    ],
  },
  language: 'zh',
  licenseKey: '',
  // ckfinder: {
  //   uploadUrl: '/ckfinder/connector?command=QuickUpload&type=Files&responseType=json',
  //   ckfinder: {
  //     openerMethod: 'popup',
  //   },
  // },
}
