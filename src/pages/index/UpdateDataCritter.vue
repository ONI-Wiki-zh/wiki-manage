<template>
    <div id="app" class="app">
      <v-stepper v-model="stepIndex" alt-labels :items="['上传数据文件', '数据修改', '预览', '更新wiki站点数据', '完成']">
        <template v-slot:item.1>
          <v-btn color="primary">上传数据文件</v-btn>
        </template>
  
        <template v-slot:item.2>
          <v-data-table :height="400" :headers="headers" :items="entityItems" item-key="id" items-per-page="20"
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
  
        <template v-slot:item.3>
          <v-data-table :height="400" :headers="headers" :items="entityItems" item-key="id" items-per-page="20"
            :fixed-header="true" :fixed-footer="true" :sort-by="[]" multi-sort>
          </v-data-table>
        </template>
  
        <template v-slot:item.4>
          <div class="container-wait">
            <div class="text-h6 font-weight-medium d-flex align-center">
              更新中...
            </div>
          </div>
        </template>
  
        <template v-slot:item.5>
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
  export default {
    data: () => ({
      headers: [
        { title: '名称', key: 'title', width: "15%" },
        { title: 'id', key: 'id' },
        { title: 'size', key: 'width' },
        { title: 'input', key: 'input' },
      ]
    }),
    setup() {
      const stepIndex = ref(1)
      const isQuerying = ref(false)
      const isShowPrev = computed(() => {
        return !isQuerying.value && stepIndex.value != 5
      })
      const isShowNext = computed(() => {
        return !isQuerying.value
      })
      const entityItems = ref([])
  
      function prevStep(onClick){
        onClick()
      }
      function nextStep(onClick){
        onClick()
      }
  
      return {
        //Data
        stepIndex,
        isShowPrev,
        isShowNext,
        entityItems,
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