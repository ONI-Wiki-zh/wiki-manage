<template>
  <div id="app">
    <v-row>
      <div class="text-h6 font-weight-medium">
        {{ pageFileInfo.title }}
      </div>
    </v-row>
    <v-row>
      <v-col class="container-info">
        <UserInfo :name="oldContributor.user_name"></UserInfo>
        <ItemDiffInfo :timestamp="oldPage.timestamp" :comment="oldPage.comment" :currIndex="maxIndex - q + 1"
          :maxIndex="maxIndex + 1" :addFunc="nextOldFile" :decreaseFunc="preOldFile">
        </ItemDiffInfo>
      </v-col>
      <v-col class="container-info">
        <UserInfo :name="newContributor.user_name"></UserInfo>
        <ItemDiffInfo :timestamp="newPage.timestamp" :comment="newPage.comment" :currIndex="maxIndex - p + 1"
          :maxIndex="maxIndex + 1" :addFunc="nextNewFile" :decreaseFunc="preNewFile">
        </ItemDiffInfo>
      </v-col>
    </v-row>
    <v-row class="bottom-row">
      <CodeDiff :filename="oldPage.sha1" :newFilename="newPage.sha1" :old-string="oldPage.text"
        :new-string="newPage.text" :lang="language" output-format="side-by-side" :context="10"></CodeDiff>
    </v-row>
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
    const pageFileInfo = ref({})
    const oldId = ref(0)
    const newId = ref(0)
    const language = ref("plaintext")
    const revisions = ref([])
    const oldPage = ref({})
    const newPage = ref({})
    const oldContributor = ref({})
    const newContributor = ref({})
    const p = ref(0)
    const q = ref(0)
    const maxIndex = ref(0)

    function selectRevision(newId, oldId) {
      // 新版本
      if (newId) {
        let r = revisions.value.filter(obj => obj.id == newId)[0]
        newPage.value = r
        p.value = revisions.value.indexOf(r)
      } else if (revisions.value.length > 0) {
        newPage.value = revisions.value[0]
        p.value = 0
      }
      // 旧版本
      if (oldId) {
        let r = revisions.value.filter(obj => obj.id == oldId)[0]
        oldPage.value = r
        q.value = revisions.value.indexOf(r)
      } else if (revisions.value.length > 1) {
        oldPage.value = revisions.value[1]
        q.value = 1
      }
    }

    function loadPageData(pageid) {
      let reqUrl = API.pagelist + "?pageid=" + String(pageid)
      axios.get(reqUrl)
        .then(res => {
          if (res.status != 200 || res.headers['content-type'] != "application/json") {
            return
          }
          if (res.data.length > 0) {
            pageFileInfo.value = res.data[0]
          }
        })
        .catch(error => console.log(error));
    }

    function loadRevisionData(pageid, newId, oldId) {
      let reqUrl = API.pagerevision + "?pageid=" + String(pageid)
      axios.get(reqUrl)
        .then(res => {
          if (res.status != 200 || res.headers['content-type'] != "application/json") {
            return
          }
          revisions.value = res.data
          maxIndex.value = res.data.length - 1
          selectRevision(newId, oldId)
        })
        .catch(error => console.log(error));
    }

    function nextNewFile(params) {
      if (p.value < 0) {
        return
      }
      if (p.value > 0) {
        p.value -= 1
        newPage.value = revisions.value[p.value]
      }
    }

    function preNewFile(params) {
      if (p.value < 0) {
        return
      }
      if (p.value < q.value) {
        p.value += 1
        newPage.value = revisions.value[p.value]
      }
    }

    function nextOldFile(params) {
      if (q.value < 0) {
        return
      }
      if (q.value > p.value) {
        q.value -= 1
        oldPage.value = revisions.value[q.value]
      }
    }

    function preOldFile(params) {
      // 改动后文件-时间增加
      if (q.value < 0) {
        return
      }
      if (q.value < revisions.value.length - 1) {
        q.value += 1
        oldPage.value = revisions.value[q.value]
      }
    }

    onMounted(() => {
      pageid.value = Number(router.query.pageid)
      language.value = router.query.lang
      newId.value = Number(router.query.revisionId)
      oldId.value = Number(router.query.oldId)
      loadRevisionData(router.query.pageid, Number(router.query.revisionId), Number(router.query.oldId))
      loadPageData(router.query.pageid)
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
      pageFileInfo,
      oldPage,
      newPage,
      oldContributor,
      newContributor,
      p, q, maxIndex,
      //Func
      nextOldFile,
      nextNewFile,
      preOldFile,
      preNewFile,
    }
  }
}
</script>

<style scoped>
#app {
  height: 100vh;
  padding-inline: 32px;
  padding-block: 16px;
  display: flex;
  flex-direction: column;
}

.top-row {}

.bottom-row {
  overflow-y: auto;
  height: calc(100vh);
}

.container-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>