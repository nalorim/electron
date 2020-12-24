<template>
  
  <v-layout class="pa-6">

    <v-row>
      <v-col cols="12">
        <v-card class="px-4">
    <v-card-title>
      Nutrition
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :search="search"
    ></v-data-table>
  </v-card>
      </v-col>
    </v-row>

    

  </v-layout>
  
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
    //
  }
}
</script>
