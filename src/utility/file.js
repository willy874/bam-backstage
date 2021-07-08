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