<template>
  <DialogLayout v-bind="$props" title="新增 Line Point">
    <form @submit="submit">
      <div class="py-2 -mx-2 sm:flex" v-for="(model, index) in listData.data" :key="model.id" :ref="setRefsItem(index)">
        <div class="flex-shrink-0 px-2 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">
          <span>序號</span>
          <span v-if="listData.data.length > 1">{{ index + 1 }}</span>
        </div>
        <div class="flex-grow">
          <TextBox type="text" :model="model" field="number" placeholder="請輸入序號" />
          <span class="text-red-500 text-xs" v-show="model.hasError('number')">{{ model.hasError('number') }}</span>
        </div>
        <div class="flex flex-shrink-0 px-2 items-start">
          <div v-if="model.state === 1" class="flex relative border border-green-500 text-green-500 rounded hover:text-white hover:bg-green-500 py-1">
            <input id="female" class="hidden" v-model="model.state" type="radio" name="gender" :value="0" />
            <label for="female" class="inline-block px-2 stretched-link">上架</label>
          </div>
          <div v-if="model.state === 0" class="flex relative border border-blue-500 text-blue-500 rounded hover:text-white hover:bg-blue-500 py-1">
            <input id="male" class="hidden" v-model="model.state" type="radio" name="gender" :value="1" />
            <label for="male" class="inline-block px-2 stretched-link">下架</label>
          </div>
        </div>
        <div class="flex-shrink-0 px-2">
          <button tabindex="-1" type="button" class="btn-icon text-red-500 hover:text-red-600" @click="deleteModel(index)">
            <Icon src="Trash" size="24" />
          </button>
        </div>
      </div>
      <div class="flex justify-between">
        <div></div>
        <div>
          <button type="button" class="btn-icon text-primary-500 hover:text-primary-600" @click="addModel">
            <Icon src="Add" size="24" />
          </button>
          <button class="hidden" type="submit"></button>
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
import throttle from 'lodash/throttle'
import Swal from '@/utility/alert'
import { ListModel, LinePointModel } from '@/models/index'
import { isModelError } from '@/utility/model-handle'
import DialogLayout from '@/container/DialogLayout.vue'
import { request } from '@/plugins/axios/request'

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
            state: 0,
          }),
        ],
      })
    )
    const popupProps = reactive(props.props)
    const errorMessages = ref([])
    const formTitleMarginTop = ref(6)
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
      setRefsItem: (index) => {
        return (ref) => {
          if (ref) listData.data[index].ref = ref
        }
      },
      addModel: throttle(async () => {
        const index = listData.data.push(
          new LinePointModel({
            id: uuid(),
          })
        )
        await nextTick()
        props.initPosition()
        listData.data[index - 1].ref.querySelector('input').focus()
      }, 300),
      deleteModel: throttle(async (index) => {
        listData.data.splice(index, 1)
        await nextTick()
        props.initPosition()
        listData.data[index - 1].ref.querySelector('input').focus()
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
          const res = await request.post('line-points', {
            product_id: props.props.model.id,
            points: listData.data.map((model) => {
              return {
                number: model.number,
                state: model.state,
              }
            }),
          })
          if (res.isAxiosError) {
            throw res.message
          }
          const duplicate = res.data.duplicate
          const success = res.data.success
          const fail = res.data.fail
          listData.loading = false
          popupProps.LinePoints = listData
          if (fail) {
            await Swal.fire({
              title: success ? '序號上傳部分失敗' : '序號上傳失敗',
              icon: success ? 'warning' : 'error',
              html: `<div>${success}筆成功，${fail}筆失敗<div>` + (duplicate.length ? `<div>${duplicate.join(', ')} 已使用過。<div>` : ''),
            })
          } else {
            await Swal.success({ title: '序號上傳成功' })
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Product LinePointDialog] Error: submit')
            console.dir(error)
          }
          listData.loading = false
          await Swal.error({ title: '上傳失敗' })
        }
        props.dialog.closePopup(props.id)
      }, 1000),
    }
  },
}
</script>
