<template>
  <PageList :ns="828" :filterFunc="itemFilter" lang="lua">
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
    const isShowPreload = ref(true)
    function itemFilter(data, itemFilter) {
      let pages = data
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