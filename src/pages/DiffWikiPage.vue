<template>
  <div>
    <CodeDiff 
    :filename="oldPage.timestamp" :newFilename="newPage.timestamp"
    :old-string="oldPage.text" :new-string="newPage.text" 
    :lang="language"
    output-format="side-by-side" :context="10"></CodeDiff>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import axios from 'axios';
import { API } from '@src/constant'
export default {
  setup() {
    const router = useRoute();
    const pageid = ref(0)
    const oldId = ref(0)
    const newId = ref(0)
    const language = ref("plaintext")
    const revisions = ref([])
    const oldPage = ref({})
    const newPage = ref({})

    function selectRevision(newId, oldId) {
      // 新版本
      if (newId) {
        newPage.value = revisions.value.filter(obj => obj.id == newId)[0]
      } else if (revisions.value.length > 0) {
        newPage.value = revisions.value[0]
      }
      // 旧版本
      if (oldId) {
        oldPage.value = revisions.value.filter(obj => obj.id == oldId)[0]
      } else if (revisions.value.length > 1) {
        oldPage.value = revisions.value[1]
      }
    }

    function loadRevisionData(pageid, newId, oldId) {
      let reqUrl = API.pagerevision + "?pageid=" + String(pageid)
      axios.get(reqUrl)
        .then(res => {
          if (res.status != 200 || res.headers['content-type'] != "application/json") {
            return
          }
          revisions.value = res.data
          selectRevision(newId, oldId)
        })
        .catch(error => console.log(error));
    }

    onMounted(() => {
      pageid.value = Number(router.query.pageid)
      language.value = router.query.lang
      newId.value = Number(router.query.revisionId)
      oldId.value = Number(router.query.oldId)
      loadRevisionData(router.query.pageid, Number(router.query.revisionId), Number(router.query.oldId))
    })

    return {
      // Data
      pageid,
      oldPage,
      newPage,
      language,
      //Func
    }
  }
}
</script>

<style></style>