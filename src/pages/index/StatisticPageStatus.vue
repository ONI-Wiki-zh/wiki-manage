<template>
  <div id="app" class="pa-8">
    <v-row class="d-flex align-center">
      <v-text-field v-model="itemFilter" variant="solo" class="ma-2" hide-details="true">
        <template v-slot:prepend-inner>
          <v-icon>mdi-magnify</v-icon>
        </template>
        <template v-slot:append-inner>
          <v-icon v-show="itemFilter !== ''" @click="resetFilter">mdi-close</v-icon>
        </template>
      </v-text-field>
      <v-btn :disabled="isQuerying" @click="updatePagesData()">
        <template v-slot:prepend>
          <v-icon color="success">mdi-refresh</v-icon>
        </template>
        更新
      </v-btn>
    </v-row>
    <v-row class="bottom-row">
      <v-data-table :headers="headers" :items="pageItems" item-key="id" items-per-page="20" :fixed-header="true"
        :fixed-footer="true" :sort-by="[]" multi-sort>
        <template v-slot:item.latest_timestamp="{ item }">
          <a :href="`${WikiSite.baseUrl}${item.title}`" target="_blank"><span>{{
            DateFromat.formatDate(item.latest_timestamp) }}</span></a>
        </template>
        <template v-slot:item.outdated="{ item }">
          <v-icon v-show="item.outdated" color="red">mdi-alert-circle</v-icon>
        </template>
        <template v-slot:item.noneTargetLangPage="{ item }">
          <v-icon v-show="item.noneTargetLangPage" color="red">mdi-link-variant-off</v-icon>
        </template>
        <template v-slot:item.onewayLangLink="{ item }">
          <v-icon v-show="item.onewayLangLink" color="red">mdi-link-variant-off</v-icon>
        </template>
        <template v-slot:item.multiBackLangLinks="{ item }">
          <v-icon v-show="item.multiBackLangLinks" color="red">mdi-link-variant-off</v-icon>
        </template>
      </v-data-table>
    </v-row>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { API, WS, WikiSite } from '@src/constant'
import DateFromat from '@src/utils/DateFormat'
import { fa } from 'vuetify/locale';

export default {
  data: () => ({
    headers: [
      { title: '名称', key: 'title', width: "30%" },
      { title: '过时页面-相较于目标站点', key: 'outdated', align: 'center' },
      {
        title: '跨语言链接异常',
        align: 'center',
        children: [
          { title: '引用页面不存在', key: 'noneTargetLangPage' },
          { title: '单向引用', key: 'onewayLangLink' },
          { title: '反链不唯一', key: 'multiBackLangLinks' },
        ],
      },
      { title: '上次编辑时间', key: 'latest_timestamp' },
    ],
  }),
  setup() {
    const isQuerying = ref(false)
    const itemFilter = ref("")
    const _pageItems = ref([])
    const pageItems = computed(() => {
      let pages = _pageItems.value
      pages = pages.filter(obj => { return obj.outdated == true || obj.noneTargetLangPage == true || obj.onewayLangLink == true || obj.multiBackLangLinks == true })
      if (!(itemFilter.value == "" || itemFilter.value == undefined)) {
        pages = pages.filter(obj => obj.title.toLowerCase().includes(itemFilter.value.toLowerCase()));
      }
      return pages
    })
    let socket = undefined


    // func
    function resetFilter() {
      itemFilter.value = ""
    }
    function loadPagesData() {
      isQuerying.value = true
      let reqUrl = API.pagestatus + "?lang=en"
      axios.get(reqUrl)
        .then(res => {
          isQuerying.value = false
          if (res.status != 200 || res.headers['content-type'] != "application/json") {
            return
          }
          if (res.data) {
            _pageItems.value = res.data
          }
        })
        .catch(error => {
          isQuerying.value = false
          console.log(error)
        });
    }
    function sendPullRequest() {
      if (!socket) {
        return
      }
      console.log("WebSocket send")
      let request = {
        "lang": "en"
      }
      socket.send(JSON.stringify(request));
    }
    function updatePagesData() {
      isQuerying.value = true
      if (!(socket && socket.readyState === WebSocket.OPEN)) {
        socket = new WebSocket(WS.pullPageStatus);
        socket.addEventListener('open', (event) => {
          // 打开舞姿
          console.log('WebSocket connected');
          // 发起查询请求
          sendPullRequest()
        });
        socket.addEventListener('close', (event) => {
          // 关闭链接
          console.log('WebSocket closed');
          isQuerying.value = false
        });
        socket.addEventListener('message', (event) => {
          // 接收消息
          const response = JSON.parse(event.data);
          console.log(response.code, response.data)
          if (response.code == 100 && response.data) {
            // 增量消息
            _pageItems.value.push(...response.data)
          } else if (response.code == 200 && response.data) {
            // 全量消息
            _pageItems.value = response.data
            socket.close()
            isQuerying.value = false
          }
        });
      } else {
        sendPullRequest()
      }
    }

    onMounted(() => {
      loadPagesData()
    })

    return {
      WikiSite,
      DateFromat,
      //Data
      isQuerying,
      pageItems,
      itemFilter,
      //Func
      resetFilter,
      updatePagesData,
    }
  }
}
</script>