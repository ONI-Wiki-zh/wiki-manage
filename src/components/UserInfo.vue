<template>
  <v-list-item class="ma-0 pa-0">
    <template v-slot:prepend>
      <VueAvatar :username="name" :size="32" class="ma-1"></VueAvatar>
    </template>
    <v-list-item-title>{{ name }}</v-list-item-title>
    <v-list-item-subtitle>{{ authority }}</v-list-item-subtitle>
  </v-list-item>
</template>

<script>
import VueAvatar from "@webzlodimir/vue-avatar";
import "@webzlodimir/vue-avatar/dist/style.css";
export default {
  components: {
    VueAvatar,
  },
  props: {
    name: {
      type: String,
      required: false,
      default: ""
    },
    authority:{
      type: String,
      required: false,
      default: ""
    }
  }
}
</script>