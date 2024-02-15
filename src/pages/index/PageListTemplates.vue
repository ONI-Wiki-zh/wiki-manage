<template>
  <PageList :ns="10" :filterFunc="itemFilter">
    <div class="d-flex">
      <v-checkbox label="包含帮助文档页面" v-model="isShowHelpDoc"></v-checkbox>
      <v-checkbox label="包含Fandom作者" v-model="isShowFandomPage"></v-checkbox>
    </div>
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
    const isShowFandomPage = ref(false)
    function itemFilter(data, itemFilter) {
      let pages = data
      pages = pages.filter(obj => obj.title == "Template:Preload/doc" || !obj.title.startsWith("Template:Preload/"))
      if (!isShowHelpDoc.value) {
        pages = pages.filter(obj => !obj.title.endsWith("/doc"))
      }
      if (!isShowFandomPage.value) {
        pages = pages.filter(obj => obj.contributorId != 32769624)
      }
      return pages
    }

    return {
      //Data
      isShowHelpDoc,
      isShowFandomPage,
      // Func
      itemFilter
    }
  }
}
</script>