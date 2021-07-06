<template>
  <PageLayout>
    <template #header>
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
    </template>
    <div class="flex-grow flex flex-col py-2 px-4">
      <DataTable v-bind="dataTableProps" class="shadow-lg">
        <template #loading v-if="dataTableLoading" :is="dataTableLoading"></template>
      </DataTable>
    </div>
    <template #footer v-if="pageFooter" :is="pageFooter"></template>
  </PageLayout>
</template>

<script>
import { reactive } from 'vue'
import PageLayout from '@/container/PageLayout.vue'
import { ArticleModel } from '@/models/index'
import { useDatabase } from '@/database/index'

export default {
  name: 'ArticleList',
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
  },
  setup(props, context) {
    const database = useDatabase()
    const listModelData = reactive(database.data[props.modelName])
    const dataTableProps = reactive({
      ...props.dataTable,
      model: listModelData,
    })

    const setupResult = {
      headerProps: {
        ...props,
        listModelData,
      },
      dataTableProps,
    }

    try {
      listModelData.readList()
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[ArticleList] Error: readList')
      }
    }

    return setupResult
  },
  components: {
    PageLayout,
  },
}
</script>
