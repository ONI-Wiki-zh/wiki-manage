<template>
  <div class="container-main">
    <v-btn icon="mdi-arrow-left" @click="decreaseFunc"></v-btn>
    <v-sheet class="py-1 px-2 my-1 mx-2" elevation="2" rounded="rounded" border :width="`100%`" :min-height="64">
      <div class="text-h6 font-weight-medium d-flex align-center">
        {{ DateFromat.formatDate(timestamp) }}
        &nbsp;&nbsp;
        <p class="text-body-2">
          {{ currIndex }}/{{ maxIndex }}
        </p>
      </div>
      <p class="text-body-2">
        {{ comment }}
      </p>
    </v-sheet>
    <v-btn icon="mdi-arrow-right" @click="addFunc"></v-btn>
  </div>
</template>

<script>
import { fa } from 'vuetify/locale';
import DateFromat from '@src/utils/DateFormat'

export default {
  props: {
    timestamp: {
      type: String,
      require: false,
      default: ""
    },
    comment: {
      type: String,
      require: false,
      default: ""
    },
    addFunc: {
      type: Function,
      require: false,
      default: undefined
    },
    decreaseFunc: {
      type: Function,
      require: false,
      default: undefined
    },
    currIndex: {
      type: Number,
      require: false,
      default: 0
    },
    maxIndex: {
      type: Number,
      require: false,
      default: 0
    }
  },
  setup(){
    return {
      DateFromat
    }
  }
}
</script>

<style scoped>
button{
  margin-top: 10px;
}
.container-main {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>