<template>
  <DialogLayout v-bind="$props" title="圖片資源" :main-style="{ maxHeight: 'calc(100vh - 180px)' }">
    <template #navbar>
      <div class="border shadow">
        <div class="p-2 flex -mx-2">
          <div class="flex-shrink-0 py-1 px-2">
            <Icon class="text-primary-500" src="Search" size="24" />
          </div>
          <div>
            <TextBox type="text" :model="filterOptions" field="keyword" placeholder="請輸入搜尋關鍵字" />
          </div>
        </div>
      </div>
    </template>
    <div style="height: 700px">
      <div class="flex flex-wrap">
        <div class="p-2 transition w-1/2 sm:w-1/3" v-for="(image, index) in filterList.data" :ref="setRefsItem(index)" :key="image.id">
          <div
            class="pt-1/1 relative border-2 rounded-lg border-opacity-50"
            :class="{ 'shadow-focus': image.selected }"
            @click="clickImage($event, image, index)"
            @dblclick="dblclickImage($event, image, index)"
          >
            <div class="absolute inset-0 px-4 py-2 flex flex-col">
              <div class="flex-grow bg-cover bg-no-repeat bg-center mb-2 rounded" :style="{ backgroundImage: `url(${convUrl(image)})` }"></div>
              <div class="flex-shrink-0 h-12">
                <div class="line-clamp-2 border border-transparent">{{ image.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex flex-wrap justify-between items-center rounded-b-lg border-t p-2">
        <div class="px-1">
          <span v-if="multiple">已選擇 {{ selectedList.length }} 張圖片</span>
        </div>
        <div class="px-1 flex flex-wrap items-center">
          <button v-if="multiple" class="btn mx-1 text-primary-mirror bg-blue-500 hover:bg-blue-600" type="button" @click="clear">清除</button>
          <button class="btn mx-1 text-primary-mirror bg-gray-500 hover:bg-gray-600" type="button" @click="close">取消</button>
          <button class="btn mx-1 text-primary-mirror bg-green-500 hover:bg-green-600" type="button" @click="submit">確定</button>
        </div>
      </div>
    </template>
  </DialogLayout>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { ListModel, AssetsListModel, DataModel, SearchModel, ImageModel } from '@/models/index'
import throttle from 'lodash/throttle'
import DialogLayout from '@/container/DialogLayout.vue'
import defaultImage from '@/components/image-viewbox/default-image.jpg'

export default {
  name: 'DetailDialog',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  components: {
    DialogLayout,
  },
  setup(props) {
    /** @type {ListModel} */
    const model = props.props.model
    const multiple = ref(true)
    const listModelData = (() => {
      if (model instanceof ListModel) {
        return model
      }
      if (model instanceof DataModel) {
        multiple.value = false
        return new ListModel({
          model: model.modelType,
          listModel: AssetsListModel,
          data: [model],
        })
      }
      return new ListModel({
        model: ImageModel,
        listModel: AssetsListModel,
        data: [],
      })
    })()
    /** @type {Function} */
    const ListModelType = listModelData.listModelType
    const assetsList = reactive(
      new ListModelType({
        listModel: ListModelType,
        model: listModelData.modelType,
        api: 'images',
      })
    )
    const reflashData = async () => {
      try {
        await assetsList.readList()
        const allResponse = await Promise.allSettled(assetsList.data.map(async (model) => await model.readData()))
        // 清除無效圖片
        allResponse
          .map((res, index) => (res.value ? false : assetsList.data[index].id))
          .filter((p) => p !== false)
          .forEach((id) => {
            const index = assetsList.data.map((p) => Number(p.id)).indexOf(Number(id))
            assetsList.data.splice(index, 1)
          })
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.log('%c[AssetList] Error: readList', 'color: #f00;background: #ff000011;padding: 2px 6px;border-radius: 4px;')
          console.dir(error)
        }
      }
    }
    onMounted(async () => {
      await reflashData()
    })
    const filterOptions = reactive(new SearchModel({ search: 'name' }))
    const filterList = computed(() => {
      const list = new ListModelType({
        listModel: listModelData.listModelType,
        model: listModelData.modelType,
      })
      list.data = assetsList.data.filter((model) => {
        const idList = listModelData.data.map((p) => p.id)
        if (idList.includes(model.id)) return false
        try {
          const keywordRegExp = filterOptions.keyword ? new RegExp(filterOptions.keyword) : false
          if (keywordRegExp) {
            return keywordRegExp.test(model.name)
          } else {
            return true
          }
        } catch (error) {
          return true
        }
      })
      return list
    })
    const selectedList = computed(() => {
      return filterList.value.data.filter((p) => p.selected)
    })
    /**
     * @param {Array<DataModel>} selectedImages
     */
    const close = (selectedImages) => {
      props.props.selectedImages = selectedImages
      props.dialog.closePopup(props.id)
    }
    return {
      filterList,
      selectedList,
      filterOptions,
      multiple,
      setRefsItem: (index) => {
        return (ref) => {
          if (ref) filterList.value.data[index].ref = ref
        }
      },
      close,
      clear: throttle(() => {
        assetsList.data.forEach((image) => {
          image.selected = false
        })
      }, 300),
      submit: () => {
        close(selectedList.value)
      },
      clickImage: throttle((e, image, index) => {
        if (multiple.value) {
          image.selected = !image.selected
        } else {
          assetsList.data.forEach((image) => {
            image.selected = false
          })
          image.selected = true
        }
      }, 100),
      dblclickImage: (e, image) => {
        close([image])
      },
      convUrl(image) {
        if (image.image_base64) {
          return image.image_base64
        }
        return defaultImage
      },
    }
  },
}
</script>
