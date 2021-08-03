<template>
  <DialogLayout v-bind="$props" title="分眾群組資料">
    <form @submit="submit">
      <div class="py-2 sm:flex">
        <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">標籤名稱</div>
        <div class="flex-grow">
          <TextBox type="text" :model="model" field="name" placeholder="請輸入標籤名稱" />
          <span class="text-red-500 text-xs" v-show="model.hasError('name')">{{ model.hasError('name') }}</span>
        </div>
      </div>
      <div class="sm:flex items-center">
        <div class="flex-shrink-0 w-20 mt-1">標籤顏色</div>
        <div class="flex-grow flex flex-wrap items-center -mx-2">
          <div class="p-2 flex items-center">
            <div class="mt-1 mx-1">文字</div>
            <input class="mt-1" type="color" v-model="badgeColor.color" />
          </div>
          <div class="p-2 flex items-center">
            <div class="mt-1 mx-1">背景</div>
            <input class="mt-1" type="color" v-model="badgeColor.backgroundColor" />
          </div>
          <div class="p-2">
            <div v-if="model.name" class="text-xs py-1 px-2 inline-block rounded" :style="{ ...badgeColor }">{{ model.name }}</div>
          </div>
        </div>
      </div>
      <div class="py-2 sm:flex">
        <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">描述</div>
        <div class="flex-grow">
          <TextBox type="text" :model="model" field="description" placeholder="請輸入描述" />
          <span class="text-red-500 text-xs" v-show="model.hasError('description')">{{ model.hasError('description') }}</span>
        </div>
      </div>
      <div class="sm:flex">
        <div class="py-2 flex sm:w-1/2">
          <div class="flex-shrink-0 w-20">群組會員</div>
          <div class="flex-grow">
            <div class="flex-grow flex items-center">
              <div class="mr-2">{{ model.members_count }}</div>
              <button type="button" class="btn-icon text-primary-500 hover:text-primary-600" @click="openMemberSelect">
                <Icon src="List" size="16" />
              </button>
            </div>
          </div>
        </div>
        <div class="py-2 sm:w-1/2 text-right">
          <button class="btn mx-1 text-primary-mirror bg-blue-500 hover:bg-blue-600" type="button" @click="pushMessage">群組推播</button>
          <button class="btn mx-1 text-primary-mirror bg-primary-500 hover:bg-primary-600" type="button" @click="listCategory">推播紀錄</button>
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
import { MemberCategoryModel } from '@/models/index'
import { isModelError } from '@/utility/model-handle'
import { devErrorMessage } from '@/utility/error'
import Swal from '@/utility/alert'
import DialogLayout from '@/container/DialogLayout.vue'
import MemberListDialog from '@/container/MemberListDialog.vue'
import LinePushOptionDialog from '../LinePush/OptionDialog.vue'
import ListLogsDialog from './ListDialog.vue'

export default {
  name: 'CategoryDetailDialog',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  components: {
    DialogLayout,
  },
  setup(props) {
    const model = reactive(new MemberCategoryModel(props.props.model))
    onMounted(async () => {
      await model.readData()
      await nextTick()
      props.initPosition()
    })
    const defaultBadgeColor = {
      color: '#ffffff',
      backgroundColor: '#17a2b8',
    }
    const badgeColor = reactive({
      color: model.color.split(',')[0] || defaultBadgeColor.color,
      backgroundColor: model.color.split(',')[1] || defaultBadgeColor.backgroundColor,
    })
    const popupProps = reactive(props.props)
    const errorMessages = ref([])
    const formTitleMarginTop = ref(6)
    const validateRules = {
      name: {
        presence: {
          allowEmpty: false,
          message: '^請填寫標籤名稱',
        },
      },
    }
    const close = throttle(() => {
      props.dialog.closePopup(props.id)
    }, 300)
    return {
      model,
      badgeColor,
      formTitleMarginTop,
      errorMessages,
      close,
      openMemberSelect: throttle(async () => {
        const dialog = props.dialog
        const popup = await dialog.popup(MemberListDialog, {
          width: '576px',
          props: {
            model,
          },
        })
        if (!popup.props.selectedMemers) {
          return
        }
        selectedMemerCount.value = popup.props.selectedMemers.length
        model.members = popup.props.selectedMemers
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
                const result = {
                  name: model.name,
                  description: model.description,
                  color: [badgeColor.color, badgeColor.backgroundColor].join(','),
                }
                if (model.members) {
                  result.members = model.members.map((p) => p.id)
                }
                return result
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
                  description: model.description,
                  color: [badgeColor.color, badgeColor.backgroundColor].join(','),
                }
                if (model.members) {
                  result.members = model.members.map((p) => p.id)
                }
                return result
              },
            })
            if (res.isAxiosError) {
              throw res.message
            }
            popupProps.model.set({
              ...model,
              color: [badgeColor.color, badgeColor.backgroundColor].join(','),
            })
          }
          props.dialog.closePopup(props.id)
        } catch (error) {
          devErrorMessage({
            dir: '/src/views/Member/Category',
            component: 'CategoryDetailDialog',
            func: 'submit',
            message: error.message,
          })
          Swal.error({ title: '儲存失敗' })
        }
      }, 1000),
      pushMessage: throttle(() => {
        props.dialog.popup(LinePushOptionDialog, {
          width: '460px',
          props: {
            model,
          },
        })
      }, 300),
      listCategory: throttle(() => {
        props.dialog.popup(ListLogsDialog, {
          width: '460px',
          props: {
            model,
          },
        })
      }, 300),
    }
  },
}
</script>
