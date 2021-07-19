import {
  FileName
} from 'bam-utility-plugins'
import dayjs from 'dayjs'
import Swal from '@/utility/alert'
import {
  ImageModel
} from '@/models/index'
/**
 * 判斷檔案大小，如果發生錯誤則回傳 true
 * @param {FileList} files 
 * @param {Number} fileLimit 
 * @returns {Boolean}
 */
export const checkFileLimit = (files, fileLimit = 0) => {
  const fileList = Array.from(files)
  if (fileLimit === 0) {
    return false
  }
  if (fileLimit) {
    if (fileList.every((f) => fileLimit < f.size)) {
      return true
    }
  }
  return false
}

/**
 * 判斷檔案數量，如果發生錯誤則回傳 true
 * @param {FileList} files 
 * @param {Number} fileLength 
 * @returns {Boolean}
 */
export const checkFileLength = (files, fileLength = 0) => {
  const fileList = Array.from(files)
  if (fileLength === 0) {
    return false
  }
  if (fileList.length > fileLength) {
    return true
  }
  return false
}

/**
 * 判斷檔案類型，如果發生錯誤則回傳 true
 * @param {FileList} files 
 * @param {String|RegExp|Array<String|RegExp>} fileType 
 * @returns {Boolean}
 */
export const checkFileType = (files, fileType = '*') => {
  const fileList = Array.from(files)
  if (fileType === '*') {
    return false
  }
  if (typeof fileType === 'string' && fileList.some((f) => !new RegExp(fileType).test(f.type))) {
    return true
  }
  if (fileType instanceof RegExp && fileList.some((f) => !fileType.test(f.type))) {
    return true
  }
  if (
    fileType instanceof Array &&
    !fileType.some((type) => {
      if (fileType instanceof RegExp) {
        return fileList.some((f) => !type.test(f.type))
      } else {
        return fileList.some((f) => !new RegExp(type).test(f.type))
      }
    })
  ) {
    return true
  }
  return false
}

/**
 * 判斷檔案，如果發生錯誤則回傳錯誤訊息字串
 * @param {FileList} files 
 * @param {*} options 
 * @returns {Boolean}
 */
export const checkFile = (files, options = {}) => {
  const fileList = Array.from(files)
  // 沒有圖片就不動作
  if (fileList.length === 0) {
    return false
  }
  // 判斷檔案數量
  if (checkFileLength(fileList, options.fileLength)) {
    return 'fileLength'
  }
  // 判斷檔案大小
  if (checkFileLimit(fileList, options.fileLimit)) {
    return 'fileLimit'
  }
  // 判斷檔案類型
  if (checkFileType(fileList, options.fileType)) {
    return 'fileType'
  }
  return false
}

export const checkFileErrorMessage = (errors) => {
  if (errors) {
    switch (errors) {
      case 'fileLength':
        Swal.error({
          title: '檔案上傳數已達上限'
        })
        break
      case 'fileLimit':
        Swal.error({
          title: '檔案上傳包含過大的檔案'
        })
        break
      case 'fileType':
        Swal.error({
          title: '檔案上傳包含不正確類型'
        })
        break
      default:
        Swal.error({
          title: '檔案上傳失敗'
        })
        break
    }
    return true
  }
}

export const createFileModelList = (files, Model = ImageModel) => {
  const fileList = Array.from(files)
  return fileList.map((fileBlob) => {
    const filename = new FileName(fileBlob.name)
    return new Model({
      name: fileBlob.name,
      size: fileBlob.size,
      type: fileBlob.type,
      image_name: filename.name,
      image_ext: filename.ext,
      blob: fileBlob,
      image_blob: fileBlob,
      created_at: dayjs().format('YYYY/MM/DD HH:mm:ss'),
      updated_at: dayjs().format('YYYY/MM/DD HH:mm:ss'),
    })
  })
}