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
      <div class="py-2 sm:flex">
        <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">群組會員</div>
        <div class="flex-grow">
          <div class="border flex flex-wrap scroll-bar max-h-40 pr-8 relative" style="min-height: 2.5rem">
            <div class="p-1" v-for="(relation, index) in model.members" :key="relation.member.id">
              <div class="rounded text-xs text-white bg-primary-500 flex items-center">
                <div class="px-1">{{ relation.member.name }}</div>
                <button type="button" class="btn-icon" @click="deleteMember(relation, index, model.members)">
                  <Icon src="Add" class="transform rotate-45" size="16" />
                </button>
              </div>
            </div>
            <div class="absolute right-0 top-1">
              <button type="button" class="btn-icon text-primary-500 hover:text-primary-600" @click="openMemberSelect">
                <Icon src="Add" size="24" />
              </button>
            </div>
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
          <button class="btn mx-1 text-primary-mirror bg-gray-500 hover:bg-gray-600" type="button" @click="close">取消</button>
          <SubmitButton class="mx-1 text-primary-mirror bg-green-500 hover:bg-green-600" type="button" :model="model" @click="submit">送出</SubmitButton>
        </div>
      </div>
    </template>
  </DialogLayout>
</template>

<script>
import { reactive, ref, onMounted, nextTick, computed } from 'vue'
import throttle from 'lodash/throttle'
import { ListModel, MemberCategoryModel, MemberRelationModel } from '@/models/index'
import { isModelError } from '@/utility/model-handle'
import DialogLayout from '@/container/DialogLayout.vue'
import MemberListDialog from '@/container/MemberListDialog.vue'
import Swal from '@/utility/alert'

export default {
  name: 'DetailDialog',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  components: {
    DialogLayout,
  },
  setup(props) {
    const model = reactive(new MemberCategoryModel(props.props.model))
    const CategoryRelationList = reactive(
      new ListModel({
        model: MemberRelationModel,
        api: `member-category/${model.id}/members`,
      })
    )
    onMounted(async () => {
      await model.readData()
      const res = await CategoryRelationList.readList()
      model.set({ members: res.data })
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
        const selectedMemers = popup.props.selectedMemers.map((member) => {
          return new MemberRelationModel({
            member,
          })
        })
        model.set({ members: selectedMemers })
      }, 300),
      deleteMember: throttle(async (item, index, list) => {
        list.splice(index, 1)
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
                  color: [badgeColor.color, badgeColor.backgroundColor].join(','),
                  members: model.members.map((p) => p.member_id),
                }
              },
            })
            if (res.isAxiosError) {
              throw res.message
            }
            popupProps.model = model
          } else {
            const res = await model.updateData({
              requesHandler(model) {
                return {
                  name: model.name,
                  description: model.description,
                  color: [badgeColor.color, badgeColor.backgroundColor].join(','),
                  members: model.members.map((p) => p.member.id),
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
            console.log('%c[Category DetailDialog] Error: submit', 'color: #f00;background: #ff000011;padding: 2px 6px;border-radius: 4px;')
            console.dir(error)
          }
          Swal.error({
            icon: 'error',
            title: '儲存失敗',
          })
        }
      }, 1000),
    }
  },
}
</script>
