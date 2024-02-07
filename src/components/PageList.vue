<template>
  <div id="app" class="pa-8">
    <v-row>
      <v-text-field v-model="itemFilter" variant="solo" class="ma-2" hide-details="true">
        <template v-slot:prepend-inner>
          <v-icon>mdi-magnify</v-icon>
        </template>
        <template v-slot:append-inner>
          <v-icon v-show="itemFilter !== ''" @click="resetFilter">mdi-close</v-icon>
        </template>
      </v-text-field>
    </v-row>
    <v-row>
      <slot></slot>
    </v-row>
    <v-row class="bottom-row">
      <v-data-table :headers="headers" :items="pageItems" item-key="id" items-per-page="20" :fixed-header="true"
        :fixed-footer="true" :sort-by="[]" multi-sort>
        <template v-slot:item.title="{ item }">
          <span>
            <span>{{ item.title }}</span>
          </span>
        </template>
        <template v-slot:item.contributorName="{ item }">
          <div v-if="item.contributorName != undefined">
            <UserInfo :name="item.contributorName" :authority="item.authority"></UserInfo>
          </div>
          <div v-if="item.contributorName == undefined">
            {{ item.contributorIP }}
          </div>
        </template>
        <template v-slot:item.action="{ item }">
          <div class="container-action">
            <a v-show="pageDocTitles[item.id] != undefined" :href="getDocUrl(item)"
              target="_blank"><v-icon>mdi-help-circle-outline</v-icon></a>
            <a :href="`${WikiSite.baseUrl}${item.title}`" target="_blank" style="color:black"><v-icon
                color="black">mdi-link</v-icon></a>
            <span>&nbsp;</span>
            <router-link
              :to="{ name: 'DiffWikiPage', query: { pageid: item.id.toString(), revisionId: item.revisionId.toString(), lang: props.lang } }"
              target="_blank">
              <v-btn color="primary" @click="getDocUrl(item)">对比</v-btn>
            </router-link>
          </div>
        </template>
      </v-data-table>
    </v-row>
  </div>
</template>
<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { API, WikiSite } from '@src/constant'
import UserInfo from '@src/components/UserInfo.vue'
import mockpagedata from '@src/assets/data/pagelist.json'

export default {
  components: {
    UserInfo,
  },
  props: {
    ns: {
      type: Number,
      required: false
    },
    filterFunc: {
      type: Function,
      required: true
    },
    lang: {
      type: String,
      required: false,
      default: "plaintext"
    }
  },
  data: () => ({
    headers: [
      { title: '名称', key: 'title', width: "15%" },
      { title: '上次编辑者', key: 'contributorName', minWidth: "100px" },
      { title: '上次编辑时间', key: 'latest_timestamp' },
      { title: '提交信息', key: 'comment', width: "40%" },
      { title: '操作', key: 'action', align: "center", sortable: false }
    ],
  }),
  methods: {
  },
  setup(props) {
    const itemFilter = ref("")
    const _pageItems = ref(mockpagedata)
    const pageDocTitles = ref(new Map())
    const pageItems = computed(() => {
      let pages = _pageItems.value
      if (!(itemFilter.value == "" || itemFilter.value == undefined)) {
        pages = pages.filter(obj => obj.title.toLowerCase().includes(itemFilter.value.toLowerCase()));
      }
      return props.filterFunc(pages)
    })

    // func
    function resetFilter() {
      itemFilter.value = ""
    }
    function loadPagesData(ns) {
      let reqUrl = API.pagelist
      if (props.ns != undefined) {
        reqUrl = API.pagelist + "?ns=" + props.ns.toString()
      }
      axios.get(reqUrl)
        .then(res => {
          if (res.status != 200 || res.headers['content-type'] != "application/json") {
            return
          }
          _pageItems.value = res.data
        })
        .catch(error => console.log(error));
    }
    function loadPagesDocData() {
      axios.get(API.pagedoc)
        .then(res => {
          if (res.status != 200 || res.headers['content-type'] != "application/json") {
            return
          }
          let idTitleObject = res.data.reduce((obj, item) => {
            obj[item.id] = item.docTitle;
            return obj;
          }, {});
          pageDocTitles.value = idTitleObject
        })
        .catch(error => console.log(error));
    }

    function getDocUrl(item) {
      if (item.title.endsWith("/doc")) {
        return undefined
      }
      const doc = pageDocTitles.value[item.id]
      if (doc) {
        return WikiSite.baseUrl + doc
      }
      return undefined
    }

    onMounted(() => {
      loadPagesData(props.ns)
      loadPagesDocData()
    })
    return {
      //Data
      props,
      WikiSite,
      pageItems,
      pageDocTitles,
      itemFilter,
      //Func
      resetFilter,
      getDocUrl,
      loadPagesData
    }
  }
}
</script>

<style scoped>
#app {
  height: 100vh;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.container-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: row;
}

.bottom-row {
  height: calc(100vh);
  overflow-y: auto;
}
</style>