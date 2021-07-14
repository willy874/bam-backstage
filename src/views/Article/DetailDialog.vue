<template>
  <DialogLayout v-bind="$props" title="文章資料">
    <form @submit="submit">
      <div class="py-2 sm:flex">
        <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">標題</div>
        <div class="flex-grow">
          <TextBox type="text" :model="model" field="title" placeholder="請輸入文章標題" />
          <span class="text-red-500 text-xs" v-show="model.hasError('title')">{{ model.hasError('title') }}</span>
        </div>
      </div>
      <div class="py-2 sm:flex">
        <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">副標題</div>
        <div class="flex-grow">
          <TextBox type="text" :model="model" field="sub_title" placeholder="請輸入文章副標題" />
          <span class="text-red-500 text-xs" v-show="model.hasError('sub_title')">{{ model.hasError('sub_title') }}</span>
        </div>
      </div>
      <div class="py-2 sm:flex">
        <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">文章內容</div>
        <div class="flex-grow">
          <TextBox type="textarea" rows="4" :model="model" field="content" placeholder="請輸入文章內容" />
          <span class="text-red-500 text-xs" v-show="model.hasError('content')">{{ model.hasError('content') }}</span>
        </div>
      </div>
      <div class="flex flex-wrap -mx-2 reactive z-10">
        <div class="py-2 px-2 xs:w-1/2 w-full flex">
          <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">文章類型</div>
          <div class="flex-grow">
            <SelectDrop
              :model="model"
              :close-element="popupElement"
              field="category"
              placeholder="請選擇文章類型"
              :options="[
                { value: 'news', label: '最新消息' },
                { value: 'faq', label: '問與答' },
              ]"
            ></SelectDrop>
            <span class="text-red-500 text-xs" v-show="model.hasError('category')">{{ model.hasError('category') }}</span>
          </div>
        </div>
        <div class="py-2 px-2 xs:w-1/2 w-full flex">
          <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">狀態</div>
          <div class="flex-grow flex flex-wrap">
            <div class="input-radio-btn">
              <input :id="uuid.stateHide" type="radio" v-model="model.state" :value="0" />
              <label :for="uuid.stateHide">隱藏</label>
            </div>
            <div class="input-radio-btn">
              <input :id="uuid.stateShow" type="radio" v-model="model.state" :value="1" />
              <label :for="uuid.stateShow">公開</label>
            </div>
          </div>
        </div>
      </div>
      <div class="py-2 xs:w-1/2 w-full flex">
        <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">封面圖片</div>
        <div class="flex-grow">
          <SelectDrop
            :model="model"
            :close-element="popupElement"
            field="image_id"
            placeholder="請選擇封面圖片"
            :options="imageList"
            optionValue="id"
            optionName="name"
          ></SelectDrop>
          <span class="text-red-500 text-xs" v-show="model.hasError('image_id')">{{ model.hasError('image_id') }}</span>
        </div>
      </div>
      <div class="py-2 sm:flex">
        <div class="flex-shrink-0 w-20" :style="{ marginTop: `${formTitleMarginTop}px` }">圖片</div>
        <div class="flex-grow">
          <PhotoFrame
            :model="imageList"
            :model-handler="modelHandler"
            file-length="9"
            :plugins="photoFramePlugin"
            :class="{ 'is-invalid': model.hasError('images') }"
            @loadImage="initPosition"
          />
          <span class="text-red-500 text-xs" v-show="model.hasError('images')">{{ model.hasError('images') }}</span>
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
import { v4 as uuidV4 } from 'uuid'
import throttle from 'lodash/throttle'
import { ArticleModel, ImageModel, AssetsListModel } from '@/models/index'
import { isModelError } from '@/utility/model-handle'
import Swal from '@/utility/alert'
import { useDialog } from '@/components/dialog/index'
import DialogLayout from '@/container/DialogLayout.vue'
import ImageFolderButton from '@/container/ImageFolderButton.vue'

export default {
  name: 'ProductDetailDialog',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  components: {
    DialogLayout,
  },
  setup(props) {
    const model = reactive(new ArticleModel(props.props.model))
    const imageList = reactive(
      new AssetsListModel({
        model: ImageModel,
        data: model.images,
      })
    )
    onMounted(async () => {
      if (model.id) {
        await model.readData()
      }
      const allResponse = await Promise.allSettled(model.images.map(async (image) => await image.readData()))
      // 清除無效圖片
      allResponse
        .map((res, index) => (res.value ? false : model.images[index].id))
        .filter((p) => p !== false)
        .forEach((id) => {
          const index = model.images.map((p) => Number(p.id)).indexOf(Number(id))
          model.images.splice(index, 1)
        })

      imageList.data = model.images
    })
    const uuid = reactive({
      stateHide: uuidV4(),
      stateShow: uuidV4(),
    })
    const dialog = useDialog()
    const popupProps = reactive(props.props)
    const errorMessages = ref([])
    const formTitleMarginTop = ref(7)
    const windowShow = ref(true)
    const validateRules = {
      category: {
        presence: {
          allowEmpty: false,
          message: '^請選擇文章類型',
        },
      },
      title: {
        presence: {
          allowEmpty: false,
          message: '^請填寫文章標題',
        },
      },
      sub_title: {
        presence: {
          allowEmpty: false,
          message: '^請填寫文章副標題',
        },
      },
      content: {
        presence: {
          allowEmpty: false,
          message: '^請填寫文章內容',
        },
      },
      image_id: {
        presence: {
          allowEmpty: false,
          message: '^請選擇封面圖片',
        },
      },
    }
    return {
      model,
      imageList,
      uuid,
      windowShow,
      formTitleMarginTop,
      photoFramePlugin: [ImageFolderButton],
      errorMessages,
      categoryHandle: (value) => {},
      modelHandler: async (image) => {
        try {
          const res = await image.createData()
          if (res.isAxiosError) {
            throw res.message
          }
          return new ImageModel({
            ...image,
            id: res.data.id,
            image_id: res.data.id,
          })
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.log('%c[Article DetailDialog] Error: modelHandler > createData', 'color: #f00;background: #ff000011;padding: 2px 6px;border-radius: 4px;')
            console.dir(error)
          }
          Swal.error({
            icon: 'error',
            title: '圖片上傳失敗',
          })
          return null
        }
      },
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
            await model.createData({
              requesHandler(model) {
                return {
                  category: model.category,
                  title: model.title,
                  sub_title: model.sub_title,
                  content: model.content,
                  image_id: model.image_id,
                  // state: model.state,
                  images: model.images.map((p) => p.id),
                }
              },
            })
            popupProps.model = model
          } else {
            const res = await model.updateData({
              requesHandler(model) {
                return {
                  category: model.category,
                  title: model.title,
                  sub_title: model.sub_title,
                  content: model.content,
                  image_id: model.image_id,
                  // state: model.state,
                  images: model.images.map((p) => p.id),
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
            console.log('%c[Product DetailDialog] Error: submit', 'color: #f00;background: #ff000011;padding: 2px 6px;border-radius: 4px;')
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
