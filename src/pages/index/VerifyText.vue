<template>
  <div id="app" class="app">
    <div class="text-h6 font-weight-medium d-flex align-center">文案格式修正</div>
    <v-stepper v-model="stepIndex" alt-labels :items="['选择模式', '查询中', '需要修正的文案', '预览', '更新wiki页面中', '完成']">
      <template v-slot:item.1>
        <v-radio-group v-model="searchModel">
          <v-radio label="查询最近页面" :value="1"></v-radio>
          <v-radio label="查询所有页面" :value="2"></v-radio>
          <v-radio label="指定页面" :value="3"></v-radio>
        </v-radio-group>
        <v-text-field v-show="searchModel == 3" v-model="pagename" variant="solo" class="ma-1" hide-details="true"
          hint="输入文章标题"></v-text-field>
      </template>

      <template v-slot:item.2>
        <div class="container-wait">
          <div v-if="isQuerying == true" class="text-h6 font-weight-medium d-flex align-center">
            查询中...
          </div>
          <div v-if="isQuerying == false" class="text-h6 font-weight-medium d-flex align-center">
            查询到 {{ pageItems.length }} 个
          </div>
        </div>
      </template>

      <template v-slot:item.3>
        <v-data-table :height="400" :headers="headers" :items="pageItems" v-model="itemSelected" item-key="id"
          items-per-page="20" :fixed-header="true" :fixed-footer="true" :sort-by="[]" multi-sort show-select
          v-model:expanded="expanded1" show-expand item-value="title">
          <template v-slot:item.latest_timestamp="{ item }">
            {{ DateFromat.formatDate(item.latest_timestamp) }}
          </template>
          <!-- Expanded -->
          <template v-slot:expanded-row="{ columns, item }">
            <tr class="explanded-tr">
              <td :colspan="columns.length" style="border-bottom: unset;background-color: unset;">
                <v-btn-toggle v-model="item.toggle" color="primary" rounded="0" group variant="outlined">
                  <v-btn value="diff">
                    对比
                  </v-btn>
                  <v-btn value="edit">
                    编辑
                  </v-btn>
                </v-btn-toggle>
              </td>
            </tr>
            <tr v-if="item.toggle == `diff`" class="explanded-tr">
              <td :colspan="columns.length" style="border-bottom: unset;background-color: unset;">
                <CodeDiff filename="旧文本" newFilename="新文本" :old-string="item.oldText" :new-string="item.newText"
                  :lang="getlanguage(item.title)" output-format="side-by-side" :context="5">
                </CodeDiff>
              </td>
            </tr>
            <tr v-if="item.toggle == `edit`" class="explanded-tr">
              <td :colspan="columns.length" style="border-bottom: unset;background-color: unset;">
                <v-textarea variant="outlined" v-model="item.newText" auto-grow rows="20"></v-textarea>
              </td>
            </tr>
          </template>
        </v-data-table>
      </template>

      <template v-slot:item.4>
        <v-data-table :height="400" :headers="headers" :items="itemConfirm" item-key="id" items-per-page="20"
          :fixed-header="true" :fixed-footer="true" :sort-by="[]" multi-sort v-model:expanded="expanded2" show-expand
          item-value="title">
          <!-- Expanded -->
          <template v-slot:expanded-row="{ columns, item }" style="background-color: black;">
            <tr v-if="item.toggle == `diff`" class="explanded-tr">
              <td :colspan="columns.length" style="border-bottom: unset;background-color: unset;">
                <CodeDiff filename="旧文本" newFilename="新文本" :old-string="item.oldText" :new-string="item.newText"
                  :lang="getlanguage(item.title)" output-format="side-by-side" :context="5">
                </CodeDiff>
              </td>
            </tr>
          </template>
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
import { ref, computed, watch } from 'vue';
import { API } from '@src/constant';
import mockpagedata from '@src/assets/data/pagelist.json'
import axios from 'axios';
import DateFromat from '@src/utils/DateFormat'

export default {
  data: () => ({
    headers: [
      { title: '名称', key: 'title', width: "15%" },
      { title: '修正次数', key: 'fixNum' },
      { title: '上次编辑时间', key: 'latest_timestamp' },
      { title: '', key: 'data-table-expand', value: 'title', sortable: false },
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
    const itemSelected = ref([])
    const expanded1 = ref([])
    const expanded2 = ref([])
    const pagename = ref("")
    const pageTitle = ref("")
    const toggle_exclusive = ref('diff')

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
        if (pageItems.value.length <= 0) {
          return false
        }
        return !isQuerying.value
      }
      return true
    })
    const itemConfirm = computed(() => {
      let resList = pageItems.value.filter(obj=> itemSelected.value.includes(obj.title))
      console.log(resList)
      return resList
    })

    function prevStep(onClick) {
      onClick()
    }
    function nextStep(onClick) {
      switch (stepIndex.value) {
        case 1:
          pageItems.value = []
          isQuerying.value = true
          expanded1.value = []
          queryPages()
          break;
        case 4:
          isQuerying.value = true
          updatePage()
          break;
      }
      onClick()
    }

    function queryPages() {
      axios.post(API.pullFormatPage, {
        "model": searchModel.value,
        "title": pagename.value,
      }).then(res => {
        if (res.status != 200 || res.headers['content-type'] != "application/json") {
          isQuerying.value = false
          pageItems.value = mockpagedata
          return
        }
        if (res.data) {
          isQuerying.value = false
          let pageData = res.data
          pageData.forEach(obj => {
            obj.toggle = "diff";
          });
          console.log(res.data)
          pageItems.value = pageData.filter(obj => obj.able == true)
        }
      })
        .catch(error => {
          isQuerying.value = false
          console.log(error)
        });
    }

    function updatePage() {
      //TODO 使用POST
      let reqUrl = API.updatepage
      axios.post(reqUrl)
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
      DateFromat,
      //Data
      stepIndex,
      searchModel,
      isShowPrev,
      isShowNext,
      isQuerying,
      pageItems,
      itemSelected,
      itemConfirm,
      expanded1,
      expanded2,
      pagename,
      pageTitle,
      toggle_exclusive,
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

.explanded-tr {
  background-color: ghostwhite;
}
</style>