<template>
  <DialogLayout v-bind="$props" title="新增 Line Point">
    <form @submit="submit">
      <div class="py-2 -mx-2 sm:flex" v-for="(model, index) in listData.data" :key="model.id">
        <div class="flex-shrink-0 px-2 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">
          <span>序號</span>
          <span v-if="listData.data.length > 1">{{ index + 1 }}</span>
        </div>
        <div class="flex-grow">
          <TextBox type="text" :model="model" field="number" placeholder="請輸入序號" />
          <span class="text-red-500 text-xs" v-show="model.hasError('number')">{{ model.hasError('number') }}</span>
        </div>
        <div class="flex-shrink-0 px-2">
          <button type="button" class="btn-icon text-red-500 hover:text-red-600" @click="deleteModel(index)">
            <Icon src="Trash" size="24" />
          </button>
        </div>
      </div>
      <div class="text-right">
        <button type="button" class="btn-icon text-primary-500 hover:text-primary-600" @click="addModel">
          <Icon src="Add" size="24" />
        </button>
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
          <button class="btn mx-1 text-primary-mirror bg-gray-500 hover:bg-gray-600" type="button" @click="close">取消</button>
          <SubmitButton class="mx-1 text-primary-mirror bg-green-500 hover:bg-green-600" type="button" :model="listData" @click="submit">送出</SubmitButton>
        </div>
      </div>
    </template>
  </DialogLayout>
</template>

<script>
import { reactive, ref, nextTick } from 'vue'
import { v4 as uuid } from 'uuid'
import Swal from 'sweetalert2'
import throttle from 'lodash/throttle'
import { ListModel, LinePointModel } from '@/models/index'
import { isModelError } from '@/utility/model-handle'
import DialogLayout from '@/container/DialogLayout.vue'

export default {
  name: 'LinePointCreateDialog',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  components: {
    DialogLayout,
  },
  setup(props) {
    const listData = reactive(
      new ListModel({
        model: LinePointModel,
        data: [
          new LinePointModel({
            id: uuid(),
            product_id: props.props.model.id,
            state: 1,
          }),
        ],
      })
    )
    const popupProps = reactive(props.props)
    const errorMessages = ref([])
    const formTitleMarginTop = ref(7)
    const validateRules = {
      number: {
        presence: {
          allowEmpty: false,
          message: '^請填寫 Line Point 序號',
        },
      },
    }
    return {
      listData,
      formTitleMarginTop,
      errorMessages,
      addModel: throttle(async () => {
        listData.data.push(
          new LinePointModel({
            id: uuid(),
          })
        )
        await nextTick()
        props.initPosition()
      }, 300),
      deleteModel: throttle(async (index) => {
        listData.data.splice(index, 1)
        await nextTick()
        props.initPosition()
      }, 300),
      close: throttle(() => {
        props.dialog.closePopup(props.id)
      }, 300),
      submit: throttle(async (e) => {
        e.preventDefault()
        const modelErrorMessages = listData.data.map((model) => model.validate(validateRules))
        errorMessages.value = isModelError(...modelErrorMessages)
        if (errorMessages.value.length) {
          await nextTick()
          props.initPosition()
          return
        }
        try {
          listData.loading = true
          await Promise.all(
            listData.data.map(async (model) => {
              return await model.createData({
                requesHandler(model) {
                  return {
                    product_id: props.props.model.id,
                    number: model.number,
                    state: 0,
                  }
                },
              })
            })
          )
          listData.loading = false
          popupProps.LinePoints = listData
          await Swal.fire({
            title: '序號驗證成功',
            icon: 'success',
          })
          props.dialog.closePopup(props.id)
        } catch (error) {
          listData.loading = false
          if (process.env.NODE_ENV === 'development') {
            console.log('[Product LinePointDialog] Error: submit', error)
          }
        }
      }, 1000),
    }
  },
}
</script>
