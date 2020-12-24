<template>
  
  <div class="pa-6">

    <v-row>

      <v-col cols="12">
        <h4>Upload File</h4>
      </v-col>

      <v-col cols="6" sm="12" md="6">
        <v-file-input v-model="file" color="deep-purple accent-4" counter label="File input" placeholder="Select your files" 
          prepend-icon="mdi-paperclip" outlined :show-size="1000"
          accept=".xlsx, .xls, .csv"
          @change="onChange"
        >
          <template v-slot:selection="{ index, text }">

            <v-chip v-if="index < 2" color="deep-purple accent-4" dark label small>{{ text }}</v-chip>

            <span v-else-if="index === 2" class="overline grey--text text--darken-3 mx-2">+{{ files.length - 2 }} File(s)</span>

          </template>

        </v-file-input>
      </v-col>

      <v-col v-if="!show_results" cols="12">
        <v-card class="pa-8">

          <!-- Error Messages -->
          <v-snackbar :timeout="-1" :value="error" color="blue-grey" absolute rounded="pill" top class="mt-2"> {{ error }}</v-snackbar>

          <!-- Actions -->
          <v-card-title>
            <div class="d-flex align-top">
              <v-select v-model="action" :items="actions" label="Bulk Actions" outlined dense></v-select>
              <v-btn color="primary" @click="doAction" class="mt-1 ml-3">Perform</v-btn>
            </div>
            <v-spacer></v-spacer>
            <div class="d-flex">
              <div class="d-flex-column">
                <v-text-field type="number" label="Random" v-model="random_number" outlined dense></v-text-field>
                <v-checkbox v-model="uniq" label="Unique randomize" style="margin-top: -20px;"></v-checkbox>
              </div>
              <v-btn color="primary" @click="randomNow" class="mt-1 ml-3">Randomize Now</v-btn>
            </div>
          </v-card-title>
        
          <v-data-table v-model="selected" :headers="headers" :items="items" single-select item-key="name" show-select class="elevation-1" dense>

             <template v-slot:body="{ items }">
              <tbody>
                <tr v-for="item in items" :key="item.id">
                  <td>
                    <v-checkbox v-model="selected" :value="item" style="margin:0px;padding:0px" hide-details @change="preSelect()"/>
                  </td>
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.pre_random ? 'Yes' : 'No'}}</td>
                </tr>
              </tbody>
             </template>
          </v-data-table>
        </v-card>
        
      </v-col>

      <v-col v-if="show_results" cols="12">
        <v-card class="pa-8">
          <v-card-title>
            <h3>Result</h3>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="randomAgain" class="mt-1 ml-3">Randomize Again</v-btn>
            <v-btn color="warning" @click="shuffleOrder" class="mt-1 ml-3">Shuffle Order</v-btn>
            <v-btn color="indigo" dark class="mt-1 ml-3">
              <vue-excel-xlsx
                :data="results"
                :columns="columns"
                :filename="'random_result_'+time"
                :sheetname="'result'"
                >Export Excel <v-icon class="ml-2">get_app</v-icon>
                </vue-excel-xlsx> 
                
            </v-btn>

            <v-btn color="success" class="mt-1 ml-4" disabled>Save</v-btn>
          </v-card-title>

          <!-- Highlight color pink on pre-random items -->
          <v-data-table :headers="headers" :items="results" item-key="name" class="resulttable elevation-1" dense>
            <template v-slot:body="{ items }">
              <tbody>
                <tr :class="item.pre_random ? 'hightlight' : ''" v-for="item in items" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.pre_random ? 'Yes' : 'No'}}</td>
                </tr>
              </tbody>
            </template>

          </v-data-table>
        </v-card>
        
      </v-col>

    </v-row>

  </div>
  
</template>

<script>
// @ is an alias to /src

import XLSX from 'xlsx'
import moment from 'moment'
import _ from 'lodash'

export default {
  name: 'Home',

  data: () => ({
    file: null,
    values: [],
    items: [],
    random_number: 5,
    uniq: true,
    winners: [],
    show: false,
    time: moment().format(),
    rules: [
      value => !value || value.size < 20000000 || 'file size should be less than 20 MB!',
    ],
    action: '',
    actions: ['...', 'Clear all selected item(s)', 'Remove item(s)', 'Return list to original', 'Upload Again'],
    selected: [],
    results: [],
    show_results: false,
    headers: [
      {
        text: 'ID',
        align: 'start',
        sortable: true,
        value: 'id',
      },
      { text: 'Username', value: 'name' },
      { text: 'Pre-Random', value: 'pre_random' },
    ],
    columns: [
      { label: 'ID', field: 'id' },
      { label: 'Username', field: 'name' },
      { label: 'Pre-random', field: 'pre_random' }
    ],
    error: '',
    snackbar: true,
  }),

  methods: {

    onChange() {
      
      if(this.file.name) {

        const reader = new FileReader()
        reader.onload = () => {
          var data = reader.result
          var workbook = XLSX.read(data, { type: 'binary' })

          var first_worksheet = workbook.Sheets[workbook.SheetNames[0]]
          var jsonArr = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 })

          this.setValues(jsonArr)
        }

        reader.readAsBinaryString(this.file)

        this.show = true

      }

    },

    setValues(json) {
      
      var length = json.length - 1 // fulllength - (1 headerRows)

      // pass in values from json array
      for ( let i = 0 ; i < length ; i++ ) {
        this.values[i] = {
          id: json[i+1][0],
          name: json[i+1][1],
          pre_random: false,
          date: moment().format('MMMM Do YYYY, h:mm:ss a')
        }
      }

      this.items = this.values

    },

    doAction() {
      if(this.action == 'Remove item(s)'){
        this.selected.forEach(key => {
          this.items = this.items.filter(i => i.id != key.id)
        })
        this.selected = [];
      }
      if(this.action == "Return list to original"){
        this.items = this.values
      }
      if(this.action == "Upload Again"){
        this.selected = []
        this.file = null
        this.items = []
        this.action = ''
      }
      if(this.action == 'Clear all selected item(s)'){
        this.selected.forEach(i => i.pre_random = false);
        this.selected = [];
      }
      this.action = '';
    },

    randomNow() {

      if(this.items.length > 1 && this.items.length > this.winners.length && this.random_number > this.selected.length ){

        let raw = this.items;

        if(this.selected.length) {
          this.selected.forEach(key => {
            raw = raw.filter( i => i.name != key.name );
          })
        }

        let preresult = [];
        preresult = _.shuffle(raw);
        preresult = this.selected.length ? _.slice(preresult, 0, this.random_number - this.selected.length ) : _.slice(preresult, 0, this.random_number) ;
        let temp_selected = this.selected;

        this.results = temp_selected.concat(preresult);
        this.show_results = true

      } else {
        this.error = "Error: Number of random should be bigger than pre-random items."
      }

    },

    randomAgain() {
      this.show_results = false;
      this.results = [];
      this.error = ''
    },

    preSelect() {
      this.items.forEach(i => i.pre_random = false);
      this.selected.forEach(j => j.pre_random = true);
    },

    shuffleOrder() {
      this.results = _.shuffle(this.results);
    }

  },

}
</script>
<style>
.hightlight {
  background-color: lightcyan !important;
}
</style>
