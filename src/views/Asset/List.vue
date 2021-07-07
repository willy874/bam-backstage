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
      <div class="shadow-lg flex-grow py-4 rounded-lg">
        <CardTemp v-bind="$props" :list-model="listModelData"></CardTemp>
      </div>
    </div>
    <template #footer></template>
  </PageLayout>
</template>

<script>
import { reactive, onMounted } from 'vue'
import PageLayout from '@/container/PageLayout.vue'
import { ListModel, ImageAssetModel } from '@/models/index'
import CardTemp from './CardTemp.vue'

export default {
  name: 'AssetList',
  components: {
    PageLayout,
    CardTemp,
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
  },
  setup() {
    const listModelData = reactive(
      new ListModel({
        model: ImageAssetModel,
        api: 'images',
      })
    )
    onMounted(async () => {
      await listModelData.assetReadList()
      await Promise.allSettled(listModelData.data.map(async (model) => await model.readImage()))
    })

    const headerProps = {}
    return {
      listModelData,
      headerProps,
    }
  },
}
</script>
