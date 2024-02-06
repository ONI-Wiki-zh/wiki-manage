<template>
  <div class="container-main">
    <v-btn icon="mdi-arrow-left" @click="decreaseFunc"></v-btn>
    <v-sheet class="py-1 px-2 my-1 mx-2" elevation="2" rounded="rounded" border :width="`100%`" :min-height="64">
      <div class="text-h6 font-weight-medium">
        {{ timestamp }}
      </div>
      <p class="text-body-2">
        {{ comment }}
      </p>
    </v-sheet>
    <v-btn icon="mdi-arrow-right" @click="addFunc"></v-btn>
  </div>
</template>

<script>
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
    }
  }
}
</script>

<style scoped>
.container-main {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>