<template>
  <div class="py-2 px-4" v-show="searchBar.value">
    <div class="flex justify-between items-center shadow p-1">
      <div class="p-1">
        <TextBox type="text" :model="filterOptions" field="keyword" placeholder="請輸入搜尋關鍵字" />
      </div>
      <div>
        <button class="btn-icon text-gray-500 hover:text-gray-600" type="button" @click="searchBar.value = !searchBar.value">
          <Icon class="transform rotate-45" src="Add" size="24" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  inheritAttrs: false,
  props: {
    searchBar: {
      type: Boolean,
      default: false,
    },
    filterOptions: {
      type: Object,
    },
  },
}
</script>
