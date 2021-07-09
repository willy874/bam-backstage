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
    <template #footer></template>
  </PageLayout>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { FileName, Observable } from 'bam-utility-plugins'
import dayjs from 'dayjs'
import { useDialog } from '@/components/dialog/index'
import { useDatabase } from '@/database/index'
import { DataModel } from '@/models/index'
import PageLayout from '@/container/PageLayout.vue'
import SearchBar from '@/container/SearchBar.vue'
import LoadingDialog from '@/container/LoadingDialog.vue'
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
      default: 0,
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
    class SearchModel extends DataModel {
      constructor() {
        super()
        this.keyword = ''
      }
    }
    const database = useDatabase()
    const listData = reactive(database.data[props.modelName])
    const searchBarShow = ref(false)
    const filterOptions = reactive(new SearchModel())
    const reflashData = async () => {
      try {
        await listData.assetReadList()
        await Promise.allSettled(listData.data.map(async (model) => await model.readData()))
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.log('%c[AssetList] Error: assetReadList', 'color: #f00;background: #ff000011;padding: 2px 6px;border-radius: 4px;')
          console.dir(error)
        }
      }
    }
    onMounted(async () => {
      await reflashData()
    })
    const uploadChange = (files) => {
      const Model = props.modelSchema.model
      const fileList = files.map((fileBlob) => {
        const filename = new FileName(fileBlob.name)
        return new Model({
          name: fileBlob.name,
          size: fileBlob.size,
          type: fileBlob.type,
          image_name: filename.name,
          image_ext: filename.ext,
          blob: fileBlob,
          image_blob: fileBlob,
          created_at: dayjs().format('YYYY/MM/DD HH:mm:ss'),
          updated_at: dayjs().format('YYYY/MM/DD HH:mm:ss'),
        })
      })
      const count = reactive({
        value: fileList.length,
      })
      const uploadIndex = reactive({
        value: 0,
      })
      const observable = new Observable((subscriber) => {
        fileList.forEach((model) => {
          subscriber.next(async () => {
            await model.createData()
            uploadIndex.value++
          })
        })
        subscriber.error(async (error) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('%c[AssetList] Error: createData', 'color: #f00;background: #ff000011;padding: 2px 6px;border-radius: 4px;')
            console.dir(error)
          }
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
