<template>
  <div>
    <h3 class="mb-3">Interactive Tools</h3>
    <div class="row g-3">
      <div class="col-md-4" v-for="t in tools" :key="t.title">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ t.title }}</h5>
            <p class="card-text">{{ t.text }}</p>
            <button class="btn btn-sm btn-primary" @click="go(t.route)">Open</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const tools = [
  { title: 'Symptom Checker', text: 'Quick self-assessment and guidance.', route: 'form' },
  { title: 'Health Trackers', text: 'Track weight, BP, mood (coming soon).', route: 'form' },
  { title: 'Gamification', text: 'Badges & goals to keep you motivated (coming soon).', route: 'form' },
]

function go (route) {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
