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
        :fixed-footer="true" :sort-by="[]" multi-sort></v-data-table>
    </v-row>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { API, WS, WikiSite } from '@src/constant'
import { fa } from 'vuetify/locale';

export default {
  data: () => ({
    headers: [
      { title: '名称', key: 'title', width: "15%" },
      { title: '上次更新旧于目标站点', key: 'outdated' },
      { title: '多语言链接引用页面不存在', key: 'non_existence' },
      { title: '多语言链接单向引用', key: 'oneway' },
      { title: '多语言链接反链不唯一', key: 'non_unique' },
      { title: '上次编辑时间', key: 'latest_timestamp' },
    ],
  }),
  setup() {
    const isQuerying = ref(false)
    const itemFilter = ref("")
    const _pageItems = ref([])
    const pageItems = computed(() => {
      let pages = _pageItems.value
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
      let reqUrl = API.pagestatus
      axios.get(reqUrl)
        .then(res => {
          isQuerying.value = false
          if (res.status != 200 || res.headers['content-type'] != "application/json") {
            return
          }
          _pageItems.value = res.data
        })
        .catch(error => {
          isQuerying.value = false
          console.log(error)
        });
    }
    function updatePagesData() {
      isQuerying.value = true
      socket = new WebSocket(WS.pullPageStatus);
      socket.addEventListener('open', (event) => {
        console.log('WebSocket connected');
        let request = {
          "lang": "en"
        }
        socket.send(JSON.stringify(request));
      });
      socket.addEventListener('message', (event) => {
        const response = JSON.parse(event.data);
        _pageItems.value = response.data
      });
    }

    onMounted(() => {
      loadPagesData()
    })
    onUnmounted(()=>{
      if(socket){
        // 关闭
      }
    })

    return {
      WikiSite,
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