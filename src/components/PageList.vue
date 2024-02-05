<template>
  <div class="ma-8">
    <v-text-field v-model="itemFilter" variant="solo" class="ma-2" hide-details="true">
      <template v-slot:prepend-inner>
        <v-icon>mdi-magnify</v-icon>
      </template>
      <template v-slot:append-inner>
        <v-icon v-if="itemFilter !== ''" @click="resetFilter">mdi-close</v-icon>
      </template>
    </v-text-field>
    <v-data-table :headers="headers" :items="pageItems" item-key="id" items-per-page="20">
      <template v-slot:item.title="{ item }">
        <span>
          <span>{{ item.title }}</span>
          <v-spacer></v-spacer>
          <a :href="`${WikiSite.baseUrl}${item.title}`" target="_blank" color="black"><v-icon color="black">mdi-link</v-icon></a>
          <a v-if="pageDocTitles[item.id]" :href="getDocUrl(item)" target="_blank"><v-icon>mdi-help-circle-outline</v-icon></a>
        </span>
      </template>
      <template v-slot:item.contributorName="{ item }">
        <div v-if="item.contributorName != undefined">
          <v-list-item class="ma-0 pa-0">
            <template v-slot:prepend>
              <VueAvatar :username="item.contributorName" :size="32" class="ma-1"></VueAvatar>
            </template>
            <v-list-item-title>{{ item.contributorName }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.authority }}</v-list-item-subtitle>
          </v-list-item>
        </div>
        <div v-if="item.contributorName == undefined">
          {{ item.contributorIP }}
        </div>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn color="primary" @click="getDocUrl(item)">对比</v-btn>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { API, WikiSite } from '@src/constant'
import VueAvatar from "@webzlodimir/vue-avatar";
import "@webzlodimir/vue-avatar/dist/style.css";
export default {
  components: {
    VueAvatar,
  },
  props: {
    ns: {
      type: Number,
      required: false
    },
  },
  data: () => ({
    headers: [
      { title: '名称', key: 'title', width: "15%" },
      { title: '上次编辑者', key: 'contributorName' },
      { title: '上次编辑时间', key: 'latest_timestamp' },
      { title: '提交信息', key: 'comment', width: "40%" },
      { title: '操作', key: 'action', align: "center", sortable: false }
    ],
  }),
  methods: {
  },
  setup(props) {
    const itemFilter = ref("")
    const _pageItems = ref([
      {
        "id": 1,
        "title": "首页",
        "ns": 0,
        "redirect_title": "",
        "latest_timestamp": "2023-01-16T08:15:32Z",
        "contributorId": "45305602",
        "contributorName": "Tuode",
        "contributorIP": null,
        "comment": "已保护“[[首页]]”：​高流量页面（[编辑=仅允许自动确认用户]（无限期）[移动=仅允许自动确认用户]（无限期））"
      },
      {
        "id": 133,
        "title": "Main Page",
        "ns": 0,
        "redirect_title": "首页",
        "latest_timestamp": "2021-08-11T23:04:41Z",
        "contributorId": "48974187",
        "contributorName": "DDElephant",
        "contributorIP": null,
        "comment": "已将重定向目标从[[Oxygennotincluded Wiki]]更改为[[首页]]"
      },
    ])
    const pageDocTitles = ref(new Map())

    function resetFilter() {
      itemFilter.value = ""
    }
    const pageItems = computed(() => {
      if (itemFilter.value == "" || itemFilter.value == undefined) {
        return _pageItems.value
      }
      return _pageItems.value.filter(obj => obj.title.toLowerCase().includes(itemFilter.value.toLowerCase()));
    })

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

    function getDocUrl(item){
      if (item.title.endsWith("/doc")) {
        return undefined
      }
      const doc = pageDocTitles.value[item.id]
      if(doc){
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

<style scoped></style>