<template>
  <PageList :ns="14" :filterFunc="itemFilter">
  </PageList>
</template>
<script>
import { ref } from 'vue';
import PageList from '@src/components/PageList.vue'
export default {
  components: {
    PageList
  },
  setup() {
    const isShowHelpDoc = ref(false)
    function itemFilter(data, itemFilter) {
      let pages = data
      return pages
    }

    return {
      //Data
      isShowHelpDoc,
      // Func
      itemFilter
    }
  }
}
</script>