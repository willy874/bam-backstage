<template>
  <DialogLayout v-bind="$props" title="圖文選單資料">
    <form @submit="submit">
      <div class="flex -mx-2 xs:-mx-4">
        <div class="py-2 px-2 xs:px-4 w-1/3 xs:w-40">
          <div class="pt-1/1 rounded-full bg-cover bg-center" v-if="model.image_url" :style="{ backgroundImage: `url(${model.image_url})` }"></div>
          <div class="rounded-full overflow-hidden bg-gray-200 p-1" v-else>
            <Icon class="text-gray-400" src="ProfileUser" size="100%" />
          </div>
        </div>
        <div class="py-2 px-2 xs:px-4 flex-grow w-2/3 sm:w-0 truncate">
          <div class="py-2 flex">
            <div class="flex-shrink-0 w-12 mt-2">名稱</div>
            <div class="flex-grow px-3">
              <div class="text-2xl">{{ model.name }}</div>
              <div class="text-gray-500 text-sm">{{ model.status_message }}</div>
            </div>
          </div>
          <div class="py-2 flex">
            <div class="flex-shrink-0 w-12" :style="{ marginTop: `${formTitleMarginTop}px` }">姓名</div>
            <div class="flex-grow">
              <TextBox type="text" :model="model" field="real_name" placeholder="請輸入姓名" />
              <span class="text-red-500 text-xs" v-show="model.hasError('real_name')">{{ model.hasError('real_name') }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap">
        <div class="flex flex-shrink-0 w-1/2 md:w-1/4 py-2">
          <div class="flex-shrink-0 w-12 md:w-20">點數</div>
          <div class="flex-grow px-3">{{ model.points }}</div>
        </div>
        <div class="flex flex-shrink-0 w-1/2 md:w-1/4 py-2">
          <div class="flex-shrink-0 w-12 md:w-20">狀態</div>
          <div class="flex-grow px-3 font-bold" :style="{ color: convState(model.line_status).color }">
            {{ convState(model.line_status).text }}
          </div>
        </div>
        <div class="flex flex-shrink-0 md:w-1/2 py-2">
          <div class="flex-shrink-0 w-12 md:w-20">性別</div>
          <div class="flex-grow">
            <div v-if="model.gender === null" class="flex flex-shrink-0">
              <label for="male" class="flex cursor-pointer hover:text-blue-300">
                <input id="male" class="hidden" v-model="model.gender" type="radio" name="gender" :value="1" />
                <Icon class="text-blue-300 transform scale-90" src="MaleSymbol" size="24" />
                <span class="inline-block px-1">男</span>
              </label>
              <label for="female" class="flex cursor-pointer hover:text-pink-300">
                <input id="female" class="hidden" v-model="model.gender" type="radio" name="gender" :value="2" />
                <Icon class="text-pink-300" src="FemaleSymbol" size="24" />
                <span class="inline-block px-1">女</span>
              </label>
              <span class="inline-block px-2 text-gray-400" :class="{ 'text-red-500': model.hasError('gender') }">未選擇</span>
            </div>
            <div v-if="model.gender === 1" class="flex flex-shrink-0 relative hover:text-blue-300">
              <input id="male" class="hidden" v-model="model.gender" type="radio" name="gender" :value="2" />
              <Icon class="text-blue-300 transform scale-90" src="MaleSymbol" size="24" />
              <label for="male" class="inline-block px-2 stretched-link">男</label>
            </div>
            <div v-if="model.gender === 2" class="flex flex-shrink-0 relative hover:text-pink-300">
              <input id="female" class="hidden" v-model="model.gender" type="radio" name="gender" :value="1" />
              <Icon class="text-pink-300" src="FemaleSymbol" size="24" />
              <label for="female" class="inline-block px-1 stretched-link">女</label>
            </div>
            <span class="text-red-500 text-xs" v-show="model.hasError('gender')">{{ model.hasError('gender') }}</span>
          </div>
        </div>
      </div>
      <div class="py-2 sm:flex">
        <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">電子郵件</div>
        <div class="flex-grow">
          <TextBox type="text" :model="model" field="email" placeholder="請輸入電子郵件" />
          <span class="text-red-500 text-xs" v-show="model.hasError('email')">{{ model.hasError('email') }}</span>
        </div>
      </div>
      <div class="py-2 sm:flex">
        <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">電話號碼</div>
        <div class="flex-grow">
          <TextBox type="text" :model="model" field="phone_number" placeholder="請輸入電話號碼" />
          <span class="text-red-500 text-xs" v-show="model.hasError('phone_number')">{{ model.hasError('phone_number') }}</span>
        </div>
      </div>
      <div class="py-2 sm:flex">
        <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">地址</div>
        <div class="flex-grow">
          <TextBox type="text" :model="model" field="address" placeholder="請輸入地址" />
          <span class="text-red-500 text-xs" v-show="model.hasError('address')">{{ model.hasError('address') }}</span>
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
          <SubmitButton class="mx-1 text-primary-mirror bg-green-500 hover:bg-green-600" type="button" :model="model" @click="submit">送出</SubmitButton>
        </div>
      </div>
    </template>
  </DialogLayout>
</template>

<script>
import { reactive, ref, onMounted, nextTick } from 'vue'
import throttle from 'lodash/throttle'
import { RichmenuModel } from '@/models/index'
import { isModelError } from '@/utility/model-handle'
import DialogLayout from '@/container/DialogLayout.vue'
import Swal from '@/utility/alert'

export default {
  name: 'DetailDialog',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  components: {
    DialogLayout,
  },
  setup(props) {
    const model = reactive(new RichmenuModel(props.props.model))
    onMounted(async () => {
      await model.readData()
    })
    const popupProps = reactive(props.props)
    const errorMessages = ref([])
    const formTitleMarginTop = ref(7)
    const validateRules = {
      name: {
        presence: {
          allowEmpty: false,
          message: '^請填寫姓名',
        },
      },
      description: {
        presence: {
          allowEmpty: false,
          message: '^請選擇性別',
        },
      },
      grid: {
        presence: {
          allowEmpty: false,
          message: '^請填寫電話號碼',
        },
      },
      chat_bar_text: {
        presence: {
          allowEmpty: false,
          message: '^請填寫電子郵件',
        },
        email: {
          message: '^填寫的電子信箱格式不正確',
        },
      },
    }
    return {
      model,
      formTitleMarginTop,
      errorMessages,
      ready() {
        props.initPosition()
      },
      close: throttle(() => {
        props.dialog.closePopup(props.id)
      }, 300),
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
            const res = await model.createData()
            if (res.isAxiosError) {
              throw res.message
            }
            popupProps.model = model
          } else {
            const res = await model.updateData({
              requesHandler(model) {
                return {
                  real_name: model.real_name,
                  gender: model.gender,
                  email: model.email,
                  phone_number: model.phone_number,
                  address: model.address,
                  state: model.state,
                }
              },
            })
            if (res.isAxiosError) {
              throw res.message
            }
            popupProps.model.set(model)
          }
          props.dialog.closePopup(props.id)
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.log('%c[Member DetailDialog] Error: submit', 'color: #f00;background: #ff000011;padding: 2px 6px;border-radius: 4px;')
            console.dir(error)
          }
          Swal.error({
            icon: 'error',
            title: '儲存失敗',
          })
        }
      }, 1000),
      convState(code) {
        switch (code) {
          case 0:
            return {
              color: 'rgb(156, 163, 175)',
              text: '封鎖',
            }
          case 1:
            return {
              color: 'rgb(52, 211, 153)',
              text: '正常',
            }
          default:
            return {
              text: '',
            }
        }
      },
    }
  },
}
</script>
