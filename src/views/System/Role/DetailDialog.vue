<template>
  <DialogLayout v-bind="$props" title="角色資料">
    <form @submit="submit">
      <div class="py-2 sm:flex">
        <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">角色名稱</div>
        <div class="flex-grow">
          <TextBox type="text" :model="model" field="name" placeholder="請輸入角色名稱" />
          <span class="text-red-500 text-xs" v-show="model.hasError('name')">{{ model.hasError('name') }}</span>
        </div>
      </div>
      <div class="py-2 sm:flex">
        <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">角色描述</div>
        <div class="flex-grow">
          <TextBox type="textarea" rows="4" :model="model" field="description" placeholder="請輸入角色描述" />
          <span class="text-red-500 text-xs" v-show="model.hasError('description')">{{ model.hasError('description') }}</span>
        </div>
      </div>
      <div class="py-2 sm:flex">
        <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">角色權限</div>
        <div class="flex-grow flex flex-wrap">
          <div class="py-2 px-2" v-for="permission in permissionsList.data" :key="permission.id">
            <div class="form-check">
              <input
                :id="`permission-${permission.id}`"
                v-model="permissions"
                :value="permission.id"
                class="form-check-input"
                type="checkbox"
                name="permission"
              />
              <label :for="`permission-${permission.id}`" class="form-check-label">
                <div class="form-check-box"></div>
                <div class="form-check-text">{{ permission.name }}</div>
              </label>
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
import { RoleModel } from '@/models/index'
import { useDatabase } from '@/database/index'
import DialogLayout from '@/container/DialogLayout.vue'
import Swal from '@/utility/alert'
import { devErrorMessage } from '@/utility/error'
import { isModelError } from '@/utility/model-handle'

export default {
  name: 'RoleDetailDialog',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  components: {
    DialogLayout,
  },
  setup(props) {
    const model = reactive(new RoleModel(props.props.model))
    const permissionsList = reactive(useDatabase().data.Permissions)
    const isCreate = () => !model.id
    onMounted(async () => {
      if (!isCreate()) {
        await model.readData()
      }
      await permissionsList.readList()
      permissions.value = model.permissions.map((p) => p.id)
      console.log(permissions.value)
      await nextTick()
      props.initPosition()
    })
    const errorMessages = ref([])
    const formTitleMarginTop = ref(6)
    const popupProps = reactive(props.props)
    const permissions = ref([])
    const validateRules = {
      name: {
        presence: {
          allowEmpty: false,
          message: '^請輸入角色名稱',
        },
      },
    }
    return {
      model,
      formTitleMarginTop,
      errorMessages,
      permissions,
      permissionsList,
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
        const modelErrorMessage = model.validate(validateRules)
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
                  description: model.description,
                  permissions: permissions.value,
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
                return {
                  name: model.name,
                  description: model.description,
                  permissions: permissions.value,
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
          devErrorMessage({
            dir: '/src/views/System/Role',
            component: 'RoleDetailDialog',
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
