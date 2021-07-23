<template>
  <DialogLayout v-bind="$props" title="管理者資料">
    <form @submit="submit">
      <div class="py-2 sm:flex">
        <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">角色名稱</div>
        <div class="flex-grow">
          <TextBox type="text" :model="model" field="name" placeholder="請輸入角色名稱" />
          <span class="text-red-500 text-xs" v-show="model.hasError('name')">{{ model.hasError('name') }}</span>
        </div>
      </div>
      <div v-if="!model.is_developer" class="py-2 xs:w-1/2 w-full flex">
        <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">角色</div>
        <div class="flex-grow">
          <SelectDrop :model="model" field="role_id" placeholder="請選擇角色" :options="roleList" optionValue="id" optionName="name"></SelectDrop>
          <span class="text-red-500 text-xs" v-show="model.hasError('role_id')">{{ model.hasError('role_id') }}</span>
        </div>
      </div>
      <div v-if="isCreate()" class="py-2 sm:flex">
        <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">密碼</div>
        <div class="flex-grow">
          <TextBox type="password" :model="model" field="password" placeholder="請輸入密碼" />
          <span class="text-red-500 text-xs" v-show="model.hasError('password')">{{ model.hasError('password') }}</span>
        </div>
      </div>
      <div v-else style="min-height: 150px">
        <div class="-mx-2 py-4" v-if="!passwordReset">
          <button type="button" class="btn mx-1 text-primary-mirror bg-primary-500 hover:bg-primary-600" @click="passwordReset = !passwordReset">
            修改密碼
          </button>
        </div>
        <div :class="{ 'opacity-50': !passwordReset }">
          <div class="py-2 sm:flex">
            <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">舊密碼</div>
            <div class="flex-grow">
              <TextBox type="password" :model="model" field="old_password" placeholder="請輸入舊密碼" :disabled="!passwordReset" />
              <span class="text-red-500 text-xs" v-show="model.hasError('old_password')">{{ model.hasError('old_password') }}</span>
            </div>
          </div>
          <div class="py-2 sm:flex">
            <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">新密碼</div>
            <div class="flex-grow">
              <TextBox type="password" :model="model" field="new_password" placeholder="請輸入新密碼" :disabled="!passwordReset" />
              <span class="text-red-500 text-xs" v-show="model.hasError('new_password')">{{ model.hasError('new_password') }}</span>
            </div>
          </div>
          <div class="py-2 sm:flex">
            <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">確認密碼</div>
            <div class="flex-grow">
              <TextBox type="password" :model="model" field="check_password" placeholder="請輸入新密碼" :disabled="!passwordReset" />
              <span class="text-red-500 text-xs" v-show="model.hasError('check_password')">{{ model.hasError('check_password') }}</span>
            </div>
          </div>
        </div>
      </div>
    </form>
    <template #footer>
      <div class="flex flex-wrap justify-between items-center rounded-b-lg border-t p-2">
        <div class="px-2">
          <div class="p-1 text-red-500 flex items-center" v-show="errorMessages.length">
            <Icon src="Warning" size="24" />
            <div class="text-sm mx-1">資料填寫有誤或不完整</div>
          </div>
        </div>
        <div class="px-1 flex flex-wrap items-center">
          <button v-if="model.id && !model.is_developer" class="btn mx-1 text-primary-mirror bg-red-500 hover:bg-red-600" type="button" @click="deleteModel">
            刪除
          </button>
          <button class="btn mx-1 text-primary-mirror bg-gray-500 hover:bg-gray-600" type="button" @click="close">關閉</button>
          <SubmitButton class="mx-1 text-primary-mirror bg-green-500 hover:bg-green-600" type="button" :model="model" @click="submit">送出</SubmitButton>
        </div>
      </div>
    </template>
  </DialogLayout>
</template>

<script>
import { reactive, ref, onMounted, nextTick } from 'vue'
import throttle from 'lodash/throttle'
import { useDatabase } from '@/database/index'
import { AdminModel } from '@/models/index'
import DialogLayout from '@/container/DialogLayout.vue'
import Swal from '@/utility/alert'
import { devErrorMessage } from '@/utility/error'
import { isModelError } from '@/utility/model-handle'

export default {
  name: 'AdminDetailDialog',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  components: {
    DialogLayout,
  },
  setup(props) {
    const model = reactive(new AdminModel(props.props.model))
    const roleList = reactive(useDatabase().data.Roles)
    const passwordReset = ref(false)
    const isCreate = () => !model.id
    onMounted(async () => {
      if (!isCreate()) {
        await model.readData()
      }
      await roleList.readList()
      await nextTick()
      props.initPosition()
    })
    const errorMessages = ref([])
    const formTitleMarginTop = ref(6)
    const popupProps = reactive(props.props)
    const validateRules = {
      name: {
        presence: {
          allowEmpty: false,
          message: '^請輸入管理者名稱',
        },
      },
      role_id: () => {
        if (model.role_id) {
          return {}
        }
        return {
          inclusion: {
            message: '^請選擇角色',
          },
        }
      },
      password: () => {
        if (!isCreate()) {
          return
        }
        return {
          presence: {
            allowEmpty: false,
            message: '^請輸入管理者名稱',
          },
        }
      },
    }
    const validatePasswordRules = {
      name: {
        presence: {
          allowEmpty: false,
          message: '^請輸入管理者名稱',
        },
      },
      old_password: {
        presence: {
          allowEmpty: false,
          message: '^請填寫舊密碼',
        },
      },
      new_password: () => {
        if (model.old_password === model.new_password) {
          return {
            presence: {
              allowEmpty: false,
              message: '^請填寫密碼',
            },
            inclusion: {
              message: '^新密碼不可與舊密碼相同',
            },
          }
        }
        return {
          presence: {
            allowEmpty: false,
            message: '^請填寫密碼',
          },
          length: {
            minimum: 8,
            tooShort: '^密碼長度過短，最少8碼',
          },
          // password: {
          //   message: '^請填寫包含英文與數字的密碼',
          // },
        }
      },
      check_password: {
        presence: {
          allowEmpty: false,
          message: '^請填寫確認密碼',
        },
        equality: {
          attribute: 'new_password',
          message: '^密碼與確認密碼必須相同',
        },
      },
    }
    return {
      model,
      roleList,
      passwordReset,
      formTitleMarginTop,
      errorMessages,
      isCreate,
      close: throttle(() => {
        props.dialog.closePopup(props.id)
      }, 300),
      deleteModel: async () => {
        const swalResult = await Swal.delete()
        try {
          if (swalResult.isConfirmed) {
            const res = await popupProps.model.deleteData()
            if (res.isAxiosError) {
              throw res.message
            }
            popupProps.model.deleted = true
            props.dialog.closePopup(props.id)
          }
        } catch (error) {
          console.log(error)
        }
      },
      cloud: throttle(async () => {
        props.initPosition()
      }, 300),
      submit: throttle(async (e) => {
        e.preventDefault()
        const modelErrorMessage = model.validate(passwordReset.value ? validatePasswordRules : validateRules)
        errorMessages.value = isModelError(modelErrorMessage)
        if (errorMessages.value.length) {
          await nextTick()
          props.initPosition()
          return
        }
        try {
          if (model.id === 0 || model.id === '') {
            const res = await model.createData({
              requesHandler(model) {
                return {
                  name: model.name,
                  role_id: model.role_id,
                  password: model.password,
                }
              },
            })
            if (res.isAxiosError) {
              throw res.message
            }
            popupProps.model = model.set(res.data)
          } else {
            const res = await model.updateData({
              requesHandler(model) {
                const result = {
                  name: model.name,
                  role_id: model.role_id,
                }
                if (passwordReset.value) {
                  result.old_password = model.old_password
                  result.new_password = model.new_password
                }
                return result
              },
            })
            if (res.isAxiosError) {
              throw res.message
            }
            popupProps.model.set(model)
          }
          props.dialog.closePopup(props.id)
        } catch (error) {
          devErrorMessage({
            dir: '/src/views/System',
            component: 'AdminDetailDialog',
            func: 'submit',
            message: error.message,
          })
          Swal.error({ title: '儲存失敗' })
        }
      }, 300),
    }
  },
}
</script>
