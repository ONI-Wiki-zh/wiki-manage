<template>
  <div>
    <v-row>
      <v-col class="container-info">
        <UserInfo :name="oldContributor.user_name"></UserInfo>
        <ItemDiffInfo :timestamp="oldPage.timestamp" :comment="oldPage.comment"></ItemDiffInfo>
      </v-col>
      <v-col class="container-info">
        <UserInfo :name="newContributor.user_name"></UserInfo>
        <ItemDiffInfo :timestamp="newPage.timestamp" :comment="newPage.comment"></ItemDiffInfo>
      </v-col>
    </v-row>
    <CodeDiff :filename="oldPage.sha1" :newFilename="newPage.sha1" :old-string="oldPage.text"
      :new-string="newPage.text" :lang="language" output-format="side-by-side" :context="10"></CodeDiff>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import axios from 'axios';
import { API } from '@src/constant'
import UserInfo from '@src/components/UserInfo.vue'
import ItemDiffInfo from '@src/components/ItemDiffInfo.vue'

export default {
  components: {
    UserInfo,
    ItemDiffInfo,
  },
  setup() {
    const router = useRoute();
    const pageid = ref(0)
    const oldId = ref(0)
    const newId = ref(0)
    const language = ref("plaintext")
    const revisions = ref([])
    const oldPage = ref({})
    const newPage = ref({})
    const oldContributor = ref({})
    const newContributor = ref({})

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

    watch(oldPage, (newValue, oldValue) => {
      let reqUrl = API.contributor + "?id=" + newValue.contributor_id
      axios.get(reqUrl)
        .then(res => {
          if (res.status != 200 || res.headers['content-type'] != "application/json") {
            return
          }
          oldContributor.value = res.data[0]
        })
        .catch(error => console.log(error));
    })

    watch(newPage, (newValue, oldValue) => {
      let reqUrl = API.contributor + "?id=" + newValue.contributor_id
      axios.get(reqUrl)
        .then(res => {
          if (res.status != 200 || res.headers['content-type'] != "application/json") {
            return
          }
          newContributor.value = res.data[0]
        })
        .catch(error => console.log(error));
    })

    return {
      // Data
      language,
      pageid,
      oldPage,
      newPage,
      oldContributor,
      newContributor,
      //Func
    }
  }
}
</script>

<style scoped>
.container-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>