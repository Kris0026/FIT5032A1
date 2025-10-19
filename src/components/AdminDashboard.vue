<template>
  <section class="p-4 bg-white rounded-3 shadow-sm">
    <header class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="h5 mb-0">Admin Dashboard</h2>
      <span class="text-muted small">Demo charts</span>
    </header>

    <div class="row g-4">
      <div class="col-lg-6">
        <div class="card h-100">
          <div class="card-body">
            <h3 class="h6">Goals Distribution</h3>
            <Doughnut :data="goalData" :options="chartOptions" />
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card h-100">
          <div class="card-body">
            <h3 class="h6">Resting HR Trend</h3>
            <Line :data="hrData" :options="chartOptions" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { Chart, ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Doughnut, Line } from 'vue-chartjs'

Chart.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend)

const goalLabels = ['Lose weight','Reduce stress','Improve sleep','Cardio fitness']

function readGoalFromLS() {
  const g = localStorage.getItem('mh_goal')
  return g && goalLabels.includes(g) ? g : null
}


const goalCounts = (() => {
  const base = { 'Lose weight': 5, 'Reduce stress': 3, 'Improve sleep': 4, 'Cardio fitness': 2 }
  const g = readGoalFromLS()
  if (g) base[g]++
  return base
})()

const goalData = computed(() => ({
  labels: goalLabels,
  datasets: [{
    data: goalLabels.map(l => goalCounts[l]),
  }]
}))

const hrData = computed(() => ({
  labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  datasets: [{
    label: 'RHR',
    data: [76, 75, 74, 77, 73, 72, 74], 
    tension: 0.3
  }]
}))

const chartOptions = {
  responsive: true,
  plugins: { legend: { position: 'bottom' } },
}
</script>
