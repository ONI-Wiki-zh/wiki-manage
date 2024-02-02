<template>
    <v-app>
        <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
            <v-list-item title="Wiki zh" nav>
                <template v-slot:append>
                    <v-btn variant="text" @click.stop="rail = !rail"></v-btn>
                </template>
            </v-list-item>

            <v-divider></v-divider>
            <Sidebar></Sidebar>
        </v-navigation-drawer>
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script>
import Sidebar from '../components/bar/Sidebar.vue'
export default {
    components: {
        Sidebar
    },
    data() {
        return {
            drawer: true,
            rail: false,
        }
    },
}
</script>