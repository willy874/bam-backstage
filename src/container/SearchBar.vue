<template>
  <div class="py-2 px-4" v-if="searchBarShow.value">
    <div class="flex justify-between items-center shadow p-1">
      <div class="flex flex-wrap">
        <div v-if="model.allow.length" class="p-1">
          <SelectDrop :model="model" field="search" :options="model.allow" placeholder="請選擇關鍵字搜尋類型"></SelectDrop>
        </div>
        <div v-if="model.type === 'keyword'" class="p-1">
          <TextBox type="text" :model="model" field="keyword" placeholder="請輸入搜尋關鍵字" />
        </div>
        <div v-if="model.type === 'category'" class="p-1">
          <SelectDrop :model="model" field="category" :options="model.search.category" placeholder="請選擇類型"></SelectDrop>
        </div>
      </div>
      <div>
        <button class="btn-icon text-gray-500 hover:text-gray-600" type="button" @click="searchBarShow.value = !searchBarShow.value">
          <Icon class="transform rotate-45" src="Add" size="24" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, isReactive } from 'vue'
import { SearchModel } from '@/models/index'

export default {
  name: 'SearchBar',
  inheritAttrs: false,
  props: {
    searchBarShow: {
      type: Object,
    },
    filterOptions: {
      type: SearchModel,
    },
  },
  setup(props) {
    const model = isReactive(props.filterOptions) ? props.filterOptions : reactive(props.filterOptions)
    return {
      model,
    }
  },
}
</script>
