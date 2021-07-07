<template>
  <PageLayout>
    <main class="h-full flex-grow relative">
      <RouterView />
    </main>
  </PageLayout>
</template>

<script>
import PageLayout from '@/container/PageLayout.vue'

export default {
  name: 'Article',
  components: {
    PageLayout,
  },
}
</script>
