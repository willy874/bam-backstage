<template>
  <DialogLayout v-bind="$props" title="產品資料">
    <form @submit="submit">
      <div class="py-2 sm:flex">
        <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">產品名稱</div>
        <div class="flex-grow">
          <TextBox type="text" :model="model" field="name" placeholder="請輸入產品名稱" />
          <span class="text-red-500 text-xs" v-show="model.hasError('name')">{{ model.hasError('name') }}</span>
        </div>
      </div>
      <div class="py-2 sm:flex">
        <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">產品描述</div>
        <div class="flex-grow">
          <TextBox type="textarea" rows="4" :model="model" field="description" placeholder="請輸入產品描述" />
          <span class="text-red-500 text-xs" v-show="model.hasError('description')">{{ model.hasError('description') }}</span>
        </div>
      </div>
      <div class="flex flex-wrap -mx-2">
        <div class="py-2 px-2 xs:w-1/2 w-full flex">
          <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">產品價格</div>
          <div class="flex-grow">
            <TextBox type="number" :model="model" field="price" placeholder="請輸入價格" />
            <span class="text-red-500 text-xs" v-show="model.hasError('price')">{{ model.hasError('price') }}</span>
          </div>
        </div>
        <div class="py-2 px-2 xs:w-1/2 w-full flex">
          <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">狀態</div>
          <div class="flex-grow flex flex-wrap">
            <div class="input-radio-btn">
              <input id="display-hide" type="radio" v-model="model.state" :value="0" />
              <label for="display-hide">下架</label>
            </div>
            <div class="input-radio-btn">
              <input id="display-show" type="radio" v-model="model.state" :value="1" />
              <label for="display-show">正常</label>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap -mx-2">
        <div class="py-2 px-2 xs:w-1/2 w-full flex">
          <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">產品類型</div>
          <div class="flex-grow">
            <div class="p-2">
              <select v-model="model.category_id">
                <option v-for="productCategory in ProductCategories.data" :key="productCategory.id" :value="productCategory.id">{{ productCategory.name }}</option>
              </select>
            </div>
            <span class="text-red-500 text-xs" v-show="model.hasError('category_id')">{{ model.hasError('category_id') }}</span>
          </div>
        </div>
        <div class="py-2 px-2 xs:w-1/2 w-full flex">
          <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">庫存量</div>
          <div class="flex-grow">
            <div class="flex" v-if="isLinePoint(model)">
              <div class="py-2 mx-2">{{ model.stock }}</div>
              <button v-if="model.id" class="btn-icon mx-1 text-primary-500 hover:text-primary-600" type="button" @click="listLinePoint">
                <Icon src="Eye" size="20" />
              </button>
              <button v-if="model.id" class="btn-icon mx-1 text-primary-500 hover:text-primary-600" type="button" @click="addLinePoint">
                <Icon src="PointSymbol" size="20" />
              </button>
            </div>
            <template v-else>
              <TextBox type="number" :model="model" field="stock" placeholder="請輸入庫存量" />
              <span class="text-red-500 text-xs" v-show="model.hasError('stock')">{{ model.hasError('stock') }}</span>
            </template>
          </div>
        </div>
      </div>
    </form>
    <template #footer>
      <div class="flex justify-between items-center rounded-b-lg border-t p-2">
        <div class="px-2">
          <div class="px-1 text-red-500 flex items-center" v-show="errorMessages.length">
            <Icon src="Warning" size="24" />
            <div class="text-sm mx-1">資料填寫有誤或不完整</div>
          </div>
        </div>
        <div class="px-1 flex items-center">
          <button v-if="model.id" class="btn mx-1 text-primary-mirror bg-red-500 hover:bg-red-600" type="button" @click="deleteModel">刪除</button>
          <button class="btn mx-1 text-primary-mirror bg-gray-500 hover:bg-gray-600" type="button" @click="close">取消</button>
          <SubmitButton class="mx-1 text-primary-mirror bg-green-500 hover:bg-green-600" type="button" :model="model" @click="submit">送出</SubmitButton>
        </div>
      </div>
    </template>
  </DialogLayout>
</template>

<script>
import { reactive, ref, onMounted, nextTick } from 'vue'
import throttle from 'lodash/throttle'
import { ProductModel } from '@/models/index'
import { isModelError } from '@/utility/model-handle'
import swAlert from '@/utility/alert'
import { useDialog } from '@/components/dialog/index'
import DialogLayout from '@/container/DialogLayout.vue'
import { useDatabase } from '@/database/index'
import LinePointCreateDialog from './LinePointCreateDialog.vue'
import LinePointListDialog from './LinePointListDialog.vue'

export default {
  name: 'DetailDialog',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  components: {
    DialogLayout,
  },
  setup(props) {
    const model = reactive(new ProductModel(props.props.model))
    const ProductCategories = reactive(useDatabase().data.ProductCategories)
    const LinePoints = reactive(useDatabase().data.LinePoints)
    onMounted(async () => {
      model.readData()
      ProductCategories.readList()
      LinePoints.readList()
    })
    const dialog = useDialog()
    const popupProps = reactive(props.props)
    const errorMessages = ref([])
    const formTitleMarginTop = ref(7)
    const windowShow = ref(true)
    const validateRules = {
      name: {
        presence: {
          allowEmpty: false,
          message: '^請填寫產品名稱',
        },
      },
      description: {
        presence: {
          allowEmpty: false,
          message: '^請填寫產品描述',
        },
      },
      price: {
        presence: {
          allowEmpty: false,
          message: '^請填寫產品價格',
        },
      },
      stock: {
        presence: {
          allowEmpty: false,
          message: '^請填寫產品庫存',
        },
      },
      category_id: {
        presence: {
          allowEmpty: false,
          message: '^請選擇產品類型',
        },
      },
    }
    const isLinePoint = (model) => model.category_id === 1
    return {
      model,
      ProductCategories,
      LinePoints,
      windowShow,
      formTitleMarginTop,
      isLinePoint,
      errorMessages,
      close: throttle(() => {
        props.dialog.closePopup(props.id)
      }, 300),
      deleteModel: async () => {
        const swalResult = await swAlert.delete()
        try {
          if (swalResult.isConfirmed) {
            await popupProps.model.deleteData()
            popupProps.model.deleted = true
            props.dialog.closePopup(props.id)
          }
        } catch (error) {
          console.log(error)
        }
      },
      submit: throttle(async (e) => {
        e.preventDefault()
        const modelErrorMessage = model.validate(validateRules)
        errorMessages.value = isModelError(modelErrorMessage)
        if (errorMessages.value.length) {
          await nextTick()
          props.initPosition()
          return
        }
        try {
          if (model.id === 0 || model.id === '') {
            await model.createData()
            popupProps.model = model
          } else {
            await model.updateData({
              requesHandler(model) {
                const result = {
                  name: model.name,
                  description: model.description,
                  price: model.price,
                  category_id: model.category_id,
                  state: model.state,
                }
                if (!isLinePoint(model))  result.stock = model.stock
                return result
              },
            })
            popupProps.model.set(model)
          }
          props.dialog.closePopup(props.id)
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Product DetailDialog] Error: submit', error)
          }
        }
      }, 1000),
      addLinePoint: throttle(async () => {
        const popup = await dialog.popup(LinePointCreateDialog, {
          width: '576px',
          props: {
            model
          },
        })
        if (popup.props.LinePoints) {
          popup.props.LinePoints.data.forEach(data => {
            LinePoints.data.push(data)
          })
        }
      }, 300),
      listLinePoint: throttle(async () => {
        dialog.popup(LinePointListDialog, {
          width: '576px',
          props: {
            model: LinePoints,
            productId: model.id
          },
        })
      }, 300)
    }
  },
}
</script>
