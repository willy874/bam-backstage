<template>
  <PageLayout>
    <template #header>
      <div>
        <div class="py-2 px-4">
          <div class="flex items-center shadow">
            <div class="px-4 py-2">
              <Breadcrumb />
            </div>
            <div class="flex flex-grow justify-end p-1">
              <div class="px-1" v-for="plugin in headerBar" :key="plugin.name">
                <component v-bind="headerProps" :is="plugin"></component>
              </div>
            </div>
          </div>
        </div>
        <SearchBar v-bind="searchBarProps" />
      </div>
    </template>
    <div class="absolute inset-0 flex flex-col py-2 px-4">
      <CardTemp v-bind="tempProps"></CardTemp>
    </div>
    <template #footer>
      <div></div>
    </template>
  </PageLayout>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Observable } from 'bam-utility-plugins'
import { useDialog } from '@/components/dialog/index'
import { useDatabase } from '@/database/index'
import { SearchModel } from '@/models/index'
import PageLayout from '@/container/PageLayout.vue'
import SearchBar from '@/container/SearchBar.vue'
import LoadingDialog from '@/container/LoadingDialog.vue'
import { createFileModelList } from '@/utility/file'
import { devErrorMessage } from '@/utility/error'
import CardTemp from './CardTemp.vue'

export default {
  name: 'AssetList',
  components: {
    PageLayout,
    CardTemp,
    SearchBar,
  },
  props: {
    routeTitle: {
      type: String,
      default: '',
    },
    modelSchema: {
      type: Object,
    },
    modelName: {
      type: String,
      default: '',
    },
    headerBar: {
      type: Array,
      default: () => [],
    },
    fileLimit: {
      type: Number,
      default: 1000000,
    },
    fileLength: {
      type: Number,
      default: 0,
    },
    fileType: {
      type: String,
      default: '*',
    },
    uploadChange: {
      type: Function,
    },
  },
  setup(props) {
    const router = useRouter()
    const database = useDatabase()
    if (!database.data[props.modelName]) {
      devErrorMessage({
        dir: '/src/views/Article',
        component: 'ArticleList',
        func: 'setup',
        message: `${props.modelName} models is not auth.`,
      })
    }
    const listData = reactive(database.data[props.modelName])
    const searchBarShow = ref(false)
    const filterOptions = reactive(new SearchModel({ search: 'name' }))
    const reflashData = async () => {
      await listData.readList()
      const allResponse = await Promise.allSettled(listData.data.map(async (model) => await model.readData()))
      // 清除無效圖片
      allResponse
        .map((res, index) => (res.value ? false : listData.data[index].id))
        .filter((p) => p !== false)
        .forEach((id) => {
          const index = listData.data.map((p) => Number(p.id)).indexOf(Number(id))
          listData.data.splice(index, 1)
        })
    }
    onMounted(async () => {
      await reflashData()
    })
    const uploadChange = (files) => {
      const Model = props.modelSchema.model
      const fileList = createFileModelList(files, Model)
      const count = reactive({
        value: fileList.length,
      })
      const uploadIndex = reactive({
        value: 0,
      })
      const observable = new Observable((subscriber) => {
        fileList.forEach((model) => {
          subscriber.next(async () => {
            const res = await model.createData()
            if (res.isAxiosError) {
              throw res.message
            }
            uploadIndex.value++
          })
        })
        subscriber.error(async (error) => {
          uploadIndex.value = count.value
          devErrorMessage({
            dir: '/src/views/Asset',
            component: 'AssetList',
            func: 'uploadChange',
            message: error.message,
          })
        })
        subscriber.complete(async () => {
          await reflashData()
        })
      })
      observable.run()
      const dialog = useDialog()
      dialog.popup(LoadingDialog, {
        width: '100%',
        props: {
          count,
          index: uploadIndex,
          title: '上傳中...',
        },
      })
    }

    const headerProps = {
      ...props,
      listModelData: listData,
      uploadChange,
      searchBarShow,
      filterOptions,
    }
    const tempProps = {
      ...props,
      listModelData: listData,
      uploadChange,
      filterOptions,
    }
    const searchBarProps = {
      searchBarShow,
      filterOptions,
    }
    return {
      listData,
      headerProps,
      tempProps,
      searchBarProps,
    }
  },
}
</script>
