<template>
  <div data-name="PageLayout" class="absolute inset-0 flex flex-col">
    <div class="flex flex-col flex-grow py-2 h-full">
      <header class="flex-shrink-0" v-if="$slots.header">
        <slot name="header"></slot>
      </header>
      <div class="flex-grow flex flex-col scroll-bar relative">
        <slot name="default"></slot>
      </div>
      <footer class="flex-shrink-0" v-if="$slots.footer">
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
