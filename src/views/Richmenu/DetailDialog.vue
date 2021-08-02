<template>
  <DialogLayout v-bind="$props" title="圖文選單資料">
    <form @submit="submit">
      <div>
        <div class="py-1">長寬大小限制: 800 x 540 (px)</div>
        <div class="py-1">檔案大小限制: 1 MB</div>
        <div class="bg-cover relative" :style="{ paddingTop: `${imageSize * 100}%`, backgroundImage: `url(${image.image_base64})` }">
          <div class="absolute inset-0 bg-white bg-opacity-70 flex flex-col" v-if="model.data && model.data.length">
            <div class="flex-grow border" v-if="model.grid === 6">
              <div class="h-1/2 flex">
                <div class="w-1/3 h-full flex items-center justify-center border">
                  <div class="text-base sm:text-2xl">{{ model.data[0].action.label }}</div>
                </div>
                <div class="w-1/3 h-full flex items-center justify-center border">
                  <div class="text-base sm:text-2xl">{{ model.data[1].action.label }}</div>
                </div>
                <div class="w-1/3 h-full flex items-center justify-center border">
                  <div class="text-base sm:text-2xl">{{ model.data[2].action.label }}</div>
                </div>
              </div>
              <div class="h-1/2 flex">
                <div class="w-1/3 h-full flex items-center justify-center border">
                  <div class="text-base sm:text-2xl">{{ model.data[3].action.label }}</div>
                </div>
                <div class="w-1/3 h-full flex items-center justify-center border">
                  <div class="text-base sm:text-2xl">{{ model.data[4].action.label }}</div>
                </div>
                <div class="w-1/3 h-full flex items-center justify-center border">
                  <div class="text-base sm:text-2xl">{{ model.data[5].action.label }}</div>
                </div>
              </div>
            </div>
            <div class="flex-grow border" v-if="model.grid === 5">
              <div class="h-1/2 flex">
                <div class="w-1/3 h-full flex items-center justify-center border">
                  <div class="text-base sm:text-2xl">{{ model.data[0].action.label }}</div>
                </div>
                <div class="w-1/3 h-full flex items-center justify-center border">
                  <div class="text-base sm:text-2xl">{{ model.data[1].action.label }}</div>
                </div>
                <div class="w-1/3 h-full flex items-center justify-center border">
                  <div class="text-base sm:text-2xl">{{ model.data[2].action.label }}</div>
                </div>
              </div>
              <div class="h-1/2 flex">
                <div class="w-1/2 h-full flex items-center justify-center border">
                  <div class="text-base sm:text-2xl">{{ model.data[3].action.label }}</div>
                </div>
                <div class="w-1/2 h-full flex items-center justify-center border">
                  <div class="text-base sm:text-2xl">{{ model.data[4].action.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap justify-end items-center py-2 -mx-1">
        <input :id="uuid.image" type="file" class="hidden" @change="changeUpload" ref="upload" />
        <SubmitButton class="mx-1 text-primary-mirror bg-blue-500 hover:bg-blue-600" type="button" :model="model" @click="clickUpload"> 上傳圖片 </SubmitButton>
        <button class="btn mx-1 text-primary-mirror bg-primary-500 hover:bg-primary-600" type="button" :model="model" @click="cloud">資源圖片</button>
      </div>
      <div class="text-right">
        <span class="text-red-500 text-xs" v-show="model.hasError('image_id')">{{ model.hasError('image_id') }}</span>
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
          <button class="btn mx-1 text-primary-mirror bg-gray-500 hover:bg-gray-600" type="button" @click="close">關閉</button>
          <SubmitButton v-if="edit" class="mx-1 text-primary-mirror bg-green-500 hover:bg-green-600" type="button" :model="model" @click="submit"
            >送出</SubmitButton
          >
        </div>
      </div>
    </template>
  </DialogLayout>
</template>

<script>
import { reactive, ref, onMounted, nextTick } from 'vue'
import throttle from 'lodash/throttle'
import { RichmenuModel, ImageModel } from '@/models/index'
import DialogLayout from '@/container/DialogLayout.vue'
import Swal from '@/utility/alert'
import { v4 as uuid } from 'uuid'
import { checkFile, checkFileErrorMessage, createFileModelList } from '@/utility/file'
import { isModelError } from '@/utility/model-handle'
import { devErrorMessage } from '@/utility/error'
import ImageFolderDialog from '@/container/ImageFolderDialog.vue'

export default {
  name: 'RichmenuDetailDialog',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  components: {
    DialogLayout,
  },
  setup(props) {
    const model = reactive(new RichmenuModel(props.props.model))
    const image = reactive(new ImageModel())
    const imageSize = ref(540 / 800)
    const edit = ref(false)
    onMounted(async () => {
      await model.readData()
      image.set({ id: model.image_id })
      await image.readData()
    })
    const errorMessages = ref([])
    const formTitleMarginTop = ref(6)
    const upload = ref(null)
    const validateRules = {
      image_id: () => {
        if (!edit.value) {
          return {}
        }
        if (image.width !== 800 || image.height !== 540) {
          return { inclusion: { message: '^圖片寬高不正確' } }
        }
        return {}
      },
    }
    return {
      model,
      edit,
      image,
      imageSize,
      formTitleMarginTop,
      upload,
      uuid: {
        image: uuid(),
      },
      errorMessages,
      close: throttle(() => {
        props.dialog.closePopup(props.id)
      }, 300),
      cloud: throttle(async () => {
        const popup = await props.dialog.popup(ImageFolderDialog, {
          width: '768px',
          props: {
            model: image,
          },
        })
        if (popup.props.selectedImages instanceof Array) {
          image.set(popup.props.selectedImages[0])
          edit.value = true
        }
      }, 300),
      clickUpload: throttle(async (e) => {
        upload.value.click()
      }, 1000),
      changeUpload: async (e) => {
        const files = e.target.files
        if (files) {
          try {
            const errors = checkFile(files, {
              fileLength: 1,
              fileLimit: 1000000,
              fileType: 'image',
            })
            if (checkFileErrorMessage(errors)) {
              return
            }
            image.set(createFileModelList(files)[0])
            const res = await image.createData()
            if (res.isAxiosError) {
              throw res.message
            }
            image.set({
              id: res.data.id,
              width: res.data.width,
              height: res.data.height,
            })
            await image.readData()
            edit.value = true
          } catch (error) {
            devErrorMessage({
              dir: '/src/views/Richmenu',
              component: 'RichmenuDetailDialog',
              func: 'changeUpload',
              message: error.message,
            })
            Swal.error({ title: '儲存失敗' })
          }
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
          if (model.grid === 6) {
            const res = await model.defaultImageUpload(image.id)
            if (res.isAxiosError) throw res.message
          }
          if (model.grid === 5) {
            const res = await model.memberImageUpload(image.id)
            if (res.isAxiosError) throw res.message
          }
        } catch (error) {
          if (error.response) {
            if (error.response.data.error.code === 0) Swal.error()
            if (error.response.data.error.code === 1) Swal.error('該圖文選單不存在')
            if (error.response.data.error.code === 2) Swal.error('更新失敗')
            if (error.response.data.error.code === 3) Swal.error('LINE系統連線失敗')
          }
          devErrorMessage({
            dir: '/src/views/Richmenu',
            component: 'RichmenuDetailDialog',
            func: 'submit',
            message: error.message,
          })
        }
      }, 300),
    }
  },
}
</script>
