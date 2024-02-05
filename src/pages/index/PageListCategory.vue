<template>
  <PageList :ns="10" :filterFunc="itemFilter">
    <v-checkbox label="包含帮助文档页面" v-model="isShowHelpDoc"></v-checkbox>
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
      pages = pages.filter(obj => obj.ns == 14)
      if (!isShowHelpDoc.value) {
        pages = pages.filter(obj => !obj.title.endsWith("/doc"))
      }
      if (itemFilter == "" || itemFilter == undefined) {
        return pages
      }
      return pages.filter(obj => obj.title.toLowerCase().includes(itemFilter.toLowerCase()));
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