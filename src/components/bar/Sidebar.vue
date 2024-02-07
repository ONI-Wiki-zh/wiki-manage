<template>
  <v-list nav v-model:opened="open">
    <v-list-subheader>站点管理</v-list-subheader>
    <v-list-group value="update">
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" title="数据更新"></v-list-item>
      </template>
      <router-link to="/UpdateDataCritter">
        <v-list-item title="小动物" value="update-critter"></v-list-item>
      </router-link>
      <router-link to="/UpdateDataBuilding">
        <v-list-item title="建筑" value="update-building"></v-list-item>
      </router-link>
      <router-link to="/UpdateDataItem">
        <v-list-item title="物品" value="update-item"></v-list-item>
      </router-link>
    </v-list-group>
    <v-list-group value="verify">
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" title="页面校验"></v-list-item>
      </template>
      <router-link to="/VerifyText">
        <v-list-item title="文案格式校对" value="verify-text"></v-list-item>
      </router-link>
      <router-link to="/VerifyLangLinks">
        <v-list-item title="跨语言连接纠错" value="verify-langlinks"></v-list-item>
      </router-link>
    </v-list-group>
    <v-list-subheader>站点统计</v-list-subheader>
    <v-list-group value="statistic">
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" title="页面状态"></v-list-item>
      </template>
      <router-link to="/StatisticOutdated">
        <v-list-item title="过时页面" value="statistic-outdated"></v-list-item>
      </router-link>
    </v-list-group>
    <v-list-group value="pagelist">
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" title="开发者页面"></v-list-item>
      </template>
      <router-link to="/PageListTemplates">
        <v-list-item title="模板" value="pagelist-templates"></v-list-item>
      </router-link>
      <router-link to="/PageListModules">
        <v-list-item title="模块" value="pagelist-modules"></v-list-item>
      </router-link>
      <router-link to="/PageListPreload">
        <v-list-item title="预设模板" value="pagelist-preload"></v-list-item>
      </router-link>
      <router-link to="/PageListCategory">
        <v-list-item title="分类概述页面" value="pagelist-category"></v-list-item>
      </router-link>
    </v-list-group>
    <v-list-subheader>备份</v-list-subheader>
    <router-link to="/BackupImg">
      <v-list-item title="图片备份" value="backup-img"></v-list-item>
    </router-link>
    <router-link to="/BackupSite">
      <v-list-item title="全站备份" value="backup-site"></v-list-item>
    </router-link>
  </v-list>
</template>

<script lang="ts">
export default {
  data: () => ({
    open: ['update'],
  }),
  setup() {
    return {

    }
  }
}
</script>
