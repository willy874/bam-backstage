<template>
  <header class="border-b shadow-md">
    <div class="flex">
      <div class="flex-shrink-0">
        <slot name="left"></slot>
      </div>
      <div class="flex-grow">
        <slot name="default"></slot>
      </div>
      <div class="flex-shrink-0">
        <slot name="right"></slot>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  setup() {
    return {}
  },
}
</script>
