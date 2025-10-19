<template>
  <section class="p-4 bg-white rounded-3 shadow-sm">
    <h2 class="h5 mb-3">AI Health Advice</h2>

    <div class="row g-3 align-items-end">
      <div class="col-sm-2">
        <label class="form-label">Age</label>
        <input v-model.number="age" type="number" class="form-control" min="18" max="100" />
      </div>
      <div class="col-sm-2">
        <label class="form-label">Resting HR</label>
        <input v-model.number="rhr" type="number" class="form-control" min="40" max="120" />
      </div>
      <div class="col-sm-4">
        <label class="form-label">Goal</label>
        <select v-model="goal" class="form-select">
          <option>Lose weight</option>
          <option>Reduce stress</option>
          <option>Improve sleep</option>
          <option>Cardio fitness</option>
        </select>
      </div>
      <div class="col-sm-4">
        <button class="btn btn-primary w-100" :disabled="loading" @click="getAdvice">
          {{ loading ? 'Getting...' : 'Get Advice' }}
        </button>
      </div>
    </div>

    <div class="alert mt-3" :class="adviceClass" role="status">
      <template v-if="error">
        <strong>Request failed:</strong> {{ error }}
      </template>
      <template v-else-if="advice">
        {{ advice }}
      </template>
      <template v-else>
        No advice returned.
      </template>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { callAdvice } from '../services/functions'

const age = ref(28)
const rhr = ref(75)
const goal = ref('Improve sleep')
const advice = ref('')
const error = ref('')
const loading = ref(false)

const adviceClass = computed(() => (error.value ? 'alert-danger' : 'alert-success'))

async function getAdvice() {
  loading.value = true
  error.value = ''
  advice.value = ''

  try {
    const resp = await fetch('https://australia-southeast1-week7-zifeng.cloudfunctions.net/aiAdvice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ age: age.value, rhr: rhr.value, goal: goal.value })
    })
    const data = await resp.json()
    if (!resp.ok) throw new Error(data.error || 'Request failed')
    advice.value = data.advice || '(empty)'
  } catch (e) {
    error.value = e.message || 'internal'
  } finally {
    loading.value = false
  }
}

</script>

