<template>
  <div class="flex-grow flex flex-col">
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
</template>

<script>
export default {
  name: 'PageLayout',
  inheritAttrs: false,
}
</script>
