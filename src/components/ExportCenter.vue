<!-- src/components/ExportCenter.vue -->
<template>
  <div class="row justify-content-center">
    <div class="col-lg-10">
      <div class="card shadow-sm">
        <div class="card-body">
          <h3 class="card-title mb-2">Data Export</h3>
          <p class="text-muted mb-3">
            Export the interactive table dataset as <strong>CSV</strong> or <strong>PDF</strong>.
          </p>

          <div class="d-flex gap-2 mb-3">
            <button class="btn btn-primary"  :disabled="!rows.length" @click="toCsv">Export CSV</button>
            <button class="btn btn-danger"   :disabled="!rows.length" @click="toPdf">Export PDF</button>
            <button class="btn btn-outline-secondary" @click="reload">Reload</button>
          </div>

          <div class="table-responsive border rounded">
            <table class="table table-sm mb-0">
              <thead class="table-light">
                <tr>
                  <th v-for="h in headers" :key="h" scope="col">{{ h }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r,i) in rows.slice(0, 10)" :key="i">
                  <td v-for="h in headers" :key="h">{{ r[h] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="form-text mt-1">Previewing top 10 records ({{ rows.length }} total).</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { exportToCsv, exportToPdf } from '../utils/export'

const rows = ref([])

async function loadData() {
  
  const res = await fetch('/data.json')
  const json = await res.json()
  
  rows.value = (json || []).map((x, i) => ({
    id: x.id ?? i + 1,
    name: x.name ?? x.fullName ?? '',
    age: x.age ?? '',
    city: x.city ?? x.location ?? '',
    goal: x.goal ?? '',
    score: x.score ?? x.rating ?? ''
  }))
}

const headers = computed(() => rows.value.length ? Object.keys(rows.value[0]) : [])

function toCsv() { exportToCsv('mens-health-data.csv', rows.value) }
function toPdf() { exportToPdf('mens-health-data.pdf', rows.value, 'Mens Health - Data Export') }
function reload() { loadData() }

onMounted(loadData)
</script>
