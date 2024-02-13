<template>
    <div id="app" class="app">
      <v-stepper v-model="stepIndex" alt-labels :items="['选择模式', '查询中', '需要修正的文案', '预览', '更新wiki页面中', '完成']">
        <template v-slot:item.1>
          <v-radio-group v-model="searchModel">
            <v-radio label="查询最近页面" :value="1"></v-radio>
            <v-radio label="查询所有页面" :value="2"></v-radio>
            <v-radio label="指定页面" :value="3"></v-radio>
          </v-radio-group>
          <v-text-field v-show="searchModel == 3" v-model="pageTitle" variant="solo" class="ma-1" hide-details="true" hint="输入文章标题"></v-text-field>
        </template>
  
        <template v-slot:item.2>
          <div class="container-wait">
            <div class="text-h6 font-weight-medium d-flex align-center">
              查询中...
            </div>
          </div>
        </template>
  
        <template v-slot:item.3>
          <v-data-table :height="400" :headers="headers" :items="pageItems" item-key="id" items-per-page="20"
            :fixed-header="true" :fixed-footer="true" :sort-by="[]" multi-sort>
            <!-- Expanded -->
            <template v-slot:expanded-row="{ columns, item }" style="background-color: black;">
              <tr>
                <td :colspan="columns.length" style="border-bottom: unset;background-color: unset;">
                  <CodeDiff :filename="item.sha1" :newFilename="item.sha1" :old-string="item.oldText"
                    :new-string="item.newText" :lang="getlanguage(item.title)" output-format="side-by-side" :context="10">
                  </CodeDiff>
                </td>
              </tr>
            </template>
          </v-data-table>
        </template>
  
        <template v-slot:item.4>
          <v-data-table :height="400" :headers="headers" :items="pageItems" item-key="id" items-per-page="20"
            :fixed-header="true" :fixed-footer="true" :sort-by="[]" multi-sort>
          </v-data-table>
        </template>
  
        <template v-slot:item.5>
          <div class="container-wait">
            <div class="text-h6 font-weight-medium d-flex align-center">
              更新中...
            </div>
          </div>
        </template>
  
        <template v-slot:item.6>
          <div class="container-wait">
            <div class="text-h6 font-weight-medium d-flex align-center">
              更新完成
            </div>
          </div>
        </template>
  
        <template v-slot:prev="{ props }">
          <v-btn :disabled="!isShowPrev" color="primary" @click="prevStep(props.onClick)">上一步</v-btn>
        </template>
  
        <template v-slot:next="{ props }">
          <v-btn :disabled="!isShowNext" color="primary" @click="nextStep(props.onClick)">下一步</v-btn>
        </template>
      </v-stepper>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { API } from '@src/constant';
  import mockpagedata from '@src/assets/data/pagelist.json'
  import axios from 'axios';
  import { fa } from 'vuetify/locale';
  
  export default {
    data: () => ({
      headers: [
        { title: '名称', key: 'title', width: "15%" },
        { title: '重定向页面', key: 'fixNum' },
        { title: '上次编辑时间', key: 'latest_timestamp' },
        { title: '', key: 'data-table-expand', value: 'calcId', sortable: false },
      ],
    }),
    methods: {
      getlanguage(title) {
        if (String(title).startsWith('Module:')) {
          return "lua"
        } else {
          return "textplain"
        }
      }
    },
    setup() {
      const stepIndex = ref(1)
      const searchModel = ref(1)
      const isQuerying = ref(false)
      const pageItems = ref([])
      const pageTitle = ref("")
  
      const isShowPrev = computed(() => {
        if (stepIndex.value == 2 || stepIndex.value == 5) {
          return !isQuerying.value
        } else if (stepIndex.value == 6) {
          return false
        }
        return true
      })
      const isShowNext = computed(() => {
        if (stepIndex.value == 2 || stepIndex.value == 5) {
          return !isQuerying.value
        }
        return true
      })
  
      function prevStep(onClick) {
        onClick()
      }
      function nextStep(onClick) {
        switch (stepIndex.value) {
          case 1:
            isQuerying.value = true
            queryPages("首页")
            break;
          case 4:
            isQuerying.value = true
            updatePage()
            break;
        }
        onClick()
      }
  
      function queryPages(pagename) {
        let reqUrl = API.pullFormatPage + "?title=" + pagename
        axios.get(reqUrl)
          .then(res => {
            if (res.status != 200 || res.headers['content-type'] != "application/json") {
              isQuerying.value = false
              pageItems.value = mockpagedata
              return
            }
            if (res.data.length > 0) {
              isQuerying.value = false
            }
          })
          .catch(error => console.log(error));
      }
  
      function updatePage() {
        //TODO 使用POST
        let reqUrl = API.pullFormatPage + "?title=" + ""
        axios.get(reqUrl)
          .then(res => {
            if (res.status != 200 || res.headers['content-type'] != "application/json") {
              isQuerying.value = false
              return
            }
            if (res.data.length > 0) {
              isQuerying.value = false
            }
          })
          .catch(error => console.log(error));
      }
  
      return {
        //Data
        stepIndex,
        searchModel,
        pageTitle,
        isShowPrev,
        isShowNext,
        pageItems,
        //Func
        prevStep,
        nextStep,
      }
    }
  }
  </script>
  
  <style scoped>
  #app {
    padding-inline: 20px;
    padding-block: 16px;
  }
  
  .container-wait {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  </style>