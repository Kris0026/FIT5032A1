<template>
  <div class="row justify-content-center">
    <div class="col-lg-8">
      <div class="card shadow-sm">
        <div class="card-body">
          <h3 class="card-title mb-3">Health Check Form</h3>

          <form @submit.prevent="handleSubmit" novalidate>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Email</label>
                <input
                  v-model.trim="email"
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': email && !isValidEmail }"
                  required
                />
                <div class="invalid-feedback">Please enter a valid email.</div>
              </div>

              <div class="col-md-3">
                <label class="form-label">Age</label>
                <input
                  v-model.number="age"
                  type="number"
                  class="form-control"
                  min="18"
                  max="100"
                  required
                />
                <div class="form-text" :class="{ 'text-danger': invalidAge }">
                  18-100 only.
                </div>
              </div>

              <div class="col-md-3">
                <label class="form-label">Resting Heart Rate</label>
                <input
                  v-model.number="rhr"
                  type="number"
                  class="form-control"
                  min="40"
                  max="120"
                  required
                />
                <div class="form-text">Typical adult 60-100 bpm.</div>
              </div>

              <div class="col-12">
                <label class="form-label">Goal</label>
                <select v-model="goal" class="form-select" required>
                  <option disabled value="">Select goal</option>
                  <option>Lose weight</option>
                  <option>Reduce stress</option>
                  <option>Improve sleep</option>
                  <option>Cardio fitness</option>
                </select>
              </div>

              <div class="col-12">
                <label class="form-label">Comment (optional)</label>
                <textarea
                  v-model="comment"
                  class="form-control"
                  rows="2"
                  placeholder="Any notes..."
                ></textarea>
                <div class="form-text">We sanitize this field to prevent XSS.</div>
              </div>
            </div>

            <div class="mt-3 d-flex gap-2">
              <button class="btn btn-primary" :disabled="!formValid">Submit</button>
              <button type="button" class="btn btn-outline-secondary" @click="reset">
                Reset
              </button>

              
              <button
                type="button"
                class="btn btn-outline-primary"
                :disabled="!formValid || loadingAdvice"
                @click="getServerAdvice"
                title="Generate advice on server (Cloud Function)"
              >
                {{ loadingAdvice ? 'Requesting' : 'Get Server Advice (Cloud Function)' }}
              </button>
            </div>
          </form>

         
          <div v-if="result" class="alert alert-success mt-3" v-html="result"></div>

          
          <div v-if="serverAdvice" class="alert alert-info mt-3">
            <strong>Server Advice:</strong> {{ serverAdvice }}
          </div>
          <div v-if="errorAdvice" class="alert alert-danger mt-3">
            <strong>Error:</strong> {{ errorAdvice }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { sanitize } from '../utils/sanitize'
import { callAdvice } from '../services/functions' 


const email = ref('')
const age = ref(null)
const rhr = ref(null)
const goal = ref('')
const comment = ref('')

const isValidEmail = computed(() => /\S+@\S+\.\S+/.test(email.value))
const invalidAge = computed(() => age.value && (age.value < 18 || age.value > 100))
const formValid = computed(() => isValidEmail.value && !invalidAge.value && rhr.value && goal.value)

const result = ref('')


function handleSubmit () {
  const tips = {
    'Lose weight': 'Aim for 150 min/week activity and a small calorie deficit.',
    'Reduce stress': 'Try 10-min daily breathing or mindfulness; keep regular sleep.',
    'Improve sleep': 'Limit caffeine after 2pm; keep a fixed bedtime.',
    'Cardio fitness': 'Add 3×30min brisk walks or cycling per week.'
  }
  localStorage.setItem('mh_email', email.value)
  localStorage.setItem('mh_age', String(age.value))
  localStorage.setItem('mh_goal', goal.value)

  const safeComment = sanitize(comment.value)
  result.value = `Thanks! Tailored tip: ${tips[goal.value] || ''}<br/>Your note: ${safeComment || '(none)'}`
}

function reset () {
  email.value = ''
  age.value = null
  rhr.value = null
  goal.value = ''
  comment.value = ''
  result.value = ''
  serverAdvice.value = ''
  errorAdvice.value = ''
}


const serverAdvice = ref('')
const loadingAdvice = ref(false)
const errorAdvice = ref('')


async function getServerAdvice () {
  if (!formValid.value) return
  loadingAdvice.value = true
  serverAdvice.value = ''
  errorAdvice.value = ''
  try {
    
    const data = await callAdvice({
      age: Number(age.value),
      goal: goal.value,     
      rhr: Number(rhr.value)
    })
    serverAdvice.value = data?.advice || 'No advice'
  } catch (e) {
    errorAdvice.value = e?.message || String(e)
  } finally {
    loadingAdvice.value = false
  }
}
</script>
