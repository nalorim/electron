<template>
  <v-app style="-webkit-app-region: drag">

    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent=""
      color="#2C3A47"
      dark
      app
    >

    <!-- logo -->
    <v-list-item class="px-0 py-2">
      <v-list-item-avatar style="margin-left: 8px;">
        <v-img src="./assets/png/1024x1024.png" alt="logo" max-width="25" max-height="25" />
      </v-list-item-avatar>
      <v-list-item-title style="text-capitalize">Random APP</v-list-item-title>
    </v-list-item>

    <!-- menu list -->
    <v-list shaped class="clickable">

      <template v-for="item in items">

        <v-list-group
          v-if="item.children"
          :key="item.text"
          v-model="item.model"
          :prepend-icon="item.icon"
          :append-icon="item['icon-alt']"
          active-class="orange--text"
        >

          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item v-for="(child, i) in item.children" :key="i" route :to="child.route" active-class="orange--text">
            <v-list-item-action v-if="child.icon">
              <v-icon>{{ child.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ child.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list-group>

        <v-list-item v-else :key="item.text" active-class="orange--text" route :to="item.route">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </template>

    </v-list>

    </v-navigation-drawer>

    <v-app-bar color="#2C3A47" dark app>

      <v-app-bar-nav-icon @click.stop="mini = !mini" class="clickable"></v-app-bar-nav-icon>

      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-md">{{ $route.name }} </span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- <v-btn icon v-on:click="close">
        <v-icon>exit_to_app</v-icon>
      </v-btn> -->

    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

  </v-app>
</template>

<script>

export default {
  name: 'App',

  props: {
    source: String
  },

  data: () => ({
    drawer: null,
    mini: false,
    fab: false,
    items: [
      { icon: 'home', text: 'Home', route: '/' },
      { icon: 'history', text: 'History', route: '/history' },
      // { 
      //   icon: 'settings',
      //   'icon-alt': 'expand_more',
      //   'icon-ctr': 'expand_less',
      //   text: 'Settings',
      //   model: false,
      //   children: [
      //     { icon: 'label', text: 'item 1', route: '/item1' },
      //     { icon: 'label', text: 'item 2', route: '/item2' },
      //   ]
      // }
    ]
  }),
};
</script>
<style>
.clickable {
  -webkit-app-region: no-drag;
}
</style>
