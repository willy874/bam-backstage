<template>
  <div class="datatable__options" @click.stop>
    <div v-for="plugin in plugins" :key="plugin.name">
      <component :is="refComponent(plugin)" v-bind="$props"></component>
    </div>
  </div>
</template>

<script>
import { ListModel, DataModel } from '@/models/index'

export default {
  name: 'TableOptions',
  inheritAttrs: false,
  props: {
    model: {
      type: DataModel,
    },
    listData: {
      type: ListModel,
    },
    filterList: {
      type: ListModel,
    },
    plugins: {
      type: Array,
    },
  },
  setup(props) {
    return {
      refComponent: (component) => {
        return {
          ...component
        }
      }
    }
  },
}
</script>
<style lang="scss" scoped>
.datatable__options {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  cursor: auto;
}
</style>
