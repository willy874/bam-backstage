<template>
  <div>
    <button type="button" class="btn-icon text-blue-500 hover:text-blue-600" @click="click">
      <Icon src="Search" size="24" />
    </button>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'

export default {
  name: 'SearchBarButton',
  inheritAttrs: false,
  props: {
    searchBarShow: {
      type: Object,
    },
    filterOptions: {
      type: Object,
    },
  },
  setup(props) {
    return {
      click: throttle(() => {
        props.searchBarShow.value = !props.searchBarShow.value
      }, 300),
    }
  },
}
</script>
