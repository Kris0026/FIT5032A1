<template>
  <section class="p-4 bg-white rounded-3 shadow-sm">
    <header class="d-flex align-items-center justify-content-between mb-3">
      <h2 class="h4 mb-0">Export Center</h2>
      <span class="text-muted small">BR (E.4): Export</span>
    </header>

    <p class="text-muted">
      Download data (CSV). This demo merges Health Form values from LocalStorage if present.
    </p>

    <div class="d-flex gap-2 mb-4 flex-wrap">
      <button class="btn btn-primary" @click="exportSample">Export Sample CSV</button>
      <button class="btn btn-outline-primary" @click="exportTable">Export Table CSV</button>
    </div>

    <div class="table-responsive">
      <table class="table table-sm table-striped align-middle">
        <caption class="text-muted">Demo table to show CSV export.</caption>
        <thead>
          <tr>
            <th scope="col">Email</th>
            <th scope="col">Age</th>
            <th scope="col">Goal</th>
            <th scope="col">RHR</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r,i) in tableRows" :key="i">
            <td>{{ r.email }}</td>
            <td>{{ r.age }}</td>
            <td>{{ r.goal }}</td>
            <td>{{ r.rhr }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>

function toCSV(rows) {
  if (!rows?.length) return ''
  const headers = Object.keys(rows[0])
  const esc = (v) => {
    const s = String(v ?? '')
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [
    headers.join(','),
    ...rows.map(r => headers.map(h => esc(r[h])).join(',')),
  ]
  return lines.join('\n')
}

function downloadText(text, filename) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}


function exportSample() {
  const sample = [
    { email: 'user1@demo.com', age: 28, goal: 'Lose weight', rhr: 72 },
    { email: 'user2@demo.com', age: 34, goal: 'Improve sleep', rhr: 78 },
  ]

  
  const lsEmail = localStorage.getItem('mh_email')
  const lsAge   = localStorage.getItem('mh_age')
  const lsGoal  = localStorage.getItem('mh_goal')
  const lsRhr   = localStorage.getItem('mh_rhr') 

  if (lsEmail || lsAge || lsGoal || lsRhr) {
    sample.unshift({
      email: lsEmail || '',
      age: lsAge || '',
      goal: lsGoal || '',
      rhr: lsRhr || '',
    })
  }

  const csv = toCSV(sample)
  downloadText(csv, `export-sample-${new Date().toISOString().slice(0,10)}.csv`)
}


const tableRows = [
  { email: 'alice@demo.com', age: 26, goal: 'Reduce stress',  rhr: 68 },
  { email: 'bob@demo.com',   age: 39, goal: 'Cardio fitness', rhr: 80 },
  { email: 'carl@demo.com',  age: 45, goal: 'Improve sleep',  rhr: 75 },
]

function exportTable() {
  const csv = toCSV(tableRows)
  downloadText(csv, `export-table-${new Date().toISOString().slice(0,10)}.csv`)
}
</script>
