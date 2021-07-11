import _uniq from 'lodash/uniq'
import _flattenDeep from 'lodash/flattenDeep'
import {
  reactive
} from 'vue'
import {
  Observable
} from 'bam-utility-plugins'
import {
  ListModel,
  DataModel,
  ImageAssetModel
} from '@/models/index'
import Swal from './alert'
import {
  useDialog
} from '@/components/dialog/index'
import LoadingDialog from '@/container/LoadingDialog.vue'

export const isModelError = (...errors) => {
  return _uniq(
    _flattenDeep(
      errors.map((error) => {
        return Object.values(error).filter((p) => p)
      })
    )
  )
}

/**
 * formDataFomat
 * @param {*} data 
 * @param {Array<String>} exclude 
 * @returns {FormData}
 */
export const formDataFomat = (data, exclude) => {
  const fomat = (value, keys = []) => {
    Object.keys(value).forEach((key) => {
      const formName = [...keys, key].map((k, i) => (i ? `[${k}]` : k)).join('')
      if (value[key] === null || isNaN(value[key]) || exclude.includes(key)) {
        return undefined
      } else if (value[key] instanceof Blob) {
        formData.append(formName, value[key], value[key].name)
      } else if (typeof value[key] === 'object') {
        fomat(value[key], [...keys, key])
      } else if (value[key] !== undefined && value[key] !== '') {
        if (/^data:(\w)*\/(\w)*;base64,/.test(formName)) {
          return
        }
        formData.append(formName, value[key])
      }
    })
  }
  const formData = new FormData()
  fomat(data)
  return formData
}

/**
 * checkAllowDelete
 * @param {Array<DataModel>} selectList 
 * @param {Function|Class} Type 
 * @returns {Boolean}
 */
export const checkAllowDelete = (selectList, Type) => {
  if (Type === ImageAssetModel) {
    if (selectList.some((image) => image.tags.some((p) => p.name === 'System'))) {
      return Swal.error({
        title: '選取圖片中包含系統圖片'
      })
    }
  }
}

/**
 * 刪除所有被 "selected" 的 Model
 * @param {ListModel} listMode 
 * @returns 
 */
export const deleteAllModel = (listMode) => {
  return new Promise(async (resolve, reject) => {
    const selectList = listMode.data.filter((p) => p.selected)
    const dialog = useDialog()
    if (checkAllowDelete(listMode.modelType, selectList)) {
      return
    }
    const swalResult = await Swal.delete(selectList.length)
    if (swalResult.isConfirmed) {
      const count = reactive({
        value: selectList.length
      })
      const deleteIndex = reactive({
        value: 0
      })
      const deleteList = []
      const observable = new Observable((subscriber) => {
        selectList.forEach((model) => {
          subscriber.next(async () => {
            const res = await model.deleteData()
            if (res.isAxiosError) {
              throw res.message
            }
            deleteIndex.value++
            const indexOf = listMode.data.map((m) => m.id).indexOf(model.id)
            deleteList.concat(listMode.data.splice(indexOf, 1))
          })
        })
        subscriber.error(async (error) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('%c[utility/model-handle] Error: deleteAllModel', 'color: #f00;background: #ff000011;padding: 2px 6px;border-radius: 4px;')
            console.dir(error)
          }
          deleteIndex.value = count.value
          await Swal.error({
            title: '刪除過程發生錯誤'
          })
          reject(error)
        })
        subscriber.complete(async () => {
          await Swal.success({
            title: '資料刪除成功'
          })
          resolve(deleteIndex)
        })
      })
      observable.run()
      await dialog.popup(LoadingDialog, {
        width: '100%',
        props: {
          count,
          index: deleteIndex,
          title: '刪除中...',
        },
      })
    }
  })
}