<template>
  <PageLayout>
    <template #header>
      <div>
        <div class="py-2 px-4">
          <div class="flex flex-wrap items-center shadow">
            <div class="px-4 py-2 flex-shrink-0">
              <Breadcrumb />
            </div>
            <div class="flex flex-grow justify-end p-1">
              <div class="p-1" v-for="plugin in headerBar" :key="plugin.name">
                <component v-bind="headerProps" :is="plugin"></component>
              </div>
            </div>
          </div>
        </div>
        <SearchBar v-bind="searchBarProps" />
      </div>
    </template>
    <div class="absolute inset-0 flex flex-col py-2 px-4">
      <DataTable v-bind="dataTableProps" class="shadow-lg">
        <template #loading v-if="dataTableLoading" :is="dataTableLoading"></template>
      </DataTable>
    </div>
    <template #footer v-if="pageFooter" :is="pageFooter"></template>
  </PageLayout>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import PageLayout from '@/container/PageLayout.vue'
import SearchBar from '@/container/SearchBar.vue'
import { ArticleModel, SearchModel } from '@/models/index'
import { useDatabase } from '@/database/index'
import { devErrorMessage } from '@/utility/error'

export default {
  name: 'ArticleList',
  inheritAttrs: false,
  components: {
    PageLayout,
    SearchBar,
  },
  props: {
    routeTitle: {
      type: String,
      default: '',
    },
    modelSchema: {
      type: Object,
      default: () => ({
        model: ArticleModel,
      }),
    },
    modelName: {
      type: String,
      default: '',
    },
    headerBar: {
      type: Array,
      default: () => [],
    },
    pageHeater: {
      type: Object,
      default: () => null,
    },
    pageFooter: {
      type: Object,
      default: () => null,
    },
    dataTable: {
      type: Object,
      default: () => ({}),
    },
    dataTableLoading: {
      type: Object,
      default: () => null,
    },
    detailPage: {
      type: Object,
      default: () => null,
    },
    setupTest: {
      type: Function,
      default: () => {},
    },
    search: {
      type: Object,
      default: () => null,
    },
    questionContent: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const database = useDatabase()
    const listModelData = reactive(database.data[props.modelName])
    const searchBarShow = ref(false)
    const filterOptions = reactive(new SearchModel(props.search))

    const dataTableProps = reactive({
      ...props.dataTable,
      filter: filterOptions.searchFilter(),
      model: listModelData,
    })

    const searchBarProps = {
      searchBarShow,
      filterOptions,
    }

    const setupResult = {
      headerProps: {
        ...props,
        listModelData,
        filterOptions,
        searchBarShow,
      },
      dataTableProps,
      searchBarProps,
    }

    onMounted(async () => {
      try {
        if (listModelData) {
          await listModelData.readList()
        }
      } catch (error) {
        devErrorMessage({
          dir: '/src/views/Article',
          component: 'ArticleList',
          func: 'deleteImage',
          message: error.message,
        })
      }
    })

    return setupResult
  },
}
</script>
