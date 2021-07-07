<template>
  <div data-name="PageLayout" class="absolute inset-0 overflow-auto flex flex-col">
    <div class="flex-grow flex flex-col py-2">
      <header v-if="$slots.header">
        <slot name="header"></slot>
      </header>
      <div class="flex-grow flex flex-col">
        <slot name="default"></slot>
      </div>
      <footer v-if="$slots.footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageLayout',
  inheritAttrs: false,
}
</script>
