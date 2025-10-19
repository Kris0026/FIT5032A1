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
import { ref, computed, onMounted } from 'vue'
import { sanitize } from '../utils/sanitize'

const email = ref('')
const age = ref(null)
const rhr = ref(null)
const goal = ref('')
const comment = ref('')

const isValidEmail = computed(() => /\S+@\S+\.\S+/.test(email.value))
const invalidAge = computed(() => age.value && (age.value < 18 || age.value > 100))
const formValid = computed(() => isValidEmail.value && !invalidAge.value && rhr.value && goal.value)

const resultHtml = ref('')

const liveMsg = ref('')  
const liveRef = ref()
onMounted(() => { if (liveRef.value) liveRef.value.focus() })

function handleSubmit () {
  const tips = {
    'Lose weight': 'Aim for 150 min/week activity and a small calorie deficit.',
    'Reduce stress': 'Try 10-min daily breathing or mindfulness; keep regular sleep.',
    'Improve sleep': 'Limit caffeine after 2pm; keep a fixed bedtime.',
    'Cardio fitness': 'Add 3×30min brisk walks or cycling per week.'
  }
  const safeComment = sanitize(comment.value)
  resultHtml.value = `Thanks! Tailored tip: ${tips[goal.value]||''}<br/>Your note: ${safeComment||'(none)'}`
  liveMsg.value = 'Form submitted successfully. Personalized advice is shown below.'
}
function resetForm () {
  email.value=''; age.value=null; rhr.value=null; goal.value=''; comment.value=''; resultHtml.value=''; liveMsg.value=''
}
</script>

<template>
  
  <div ref="liveRef" class="visually-hidden" aria-live="polite" tabindex="-1">{{ liveMsg }}</div>

  <div class="row justify-content-center">
    <div class="col-lg-8">
      <div class="card shadow-sm">
        <div class="card-body">
          <h3 class="card-title mb-3">Health Check Form</h3>

          <form @submit.prevent="handleSubmit" novalidate aria-describedby="form-hint">
            <p id="form-hint" class="form-text">All fields marked * are required.</p>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label" for="email">Email *</label>
                <input id="email" v-model.trim="email" type="email" class="form-control"
                       :class="{'is-invalid': email && !isValidEmail}"
                       aria-required="true"
                       :aria-invalid="email && !isValidEmail"
                       aria-describedby="email-help email-err">
                <div id="email-help" class="form-text">We'll send your tips here.</div>
                <div id="email-err" class="invalid-feedback">Please enter a valid email.</div>
              </div>

              <div class="col-md-3">
                <label class="form-label" for="age">Age *</label>
                <input id="age" v-model.number="age" type="number" class="form-control"
                       min="18" max="100" aria-required="true"
                       :aria-invalid="invalidAge"
                       aria-describedby="age-hint age-err">
                <div id="age-hint" class="form-text">18- 100 only.</div>
                <div id="age-err" class="invalid-feedback" v-if="invalidAge">Age must be between 18 and 100.</div>
              </div>

              <div class="col-md-3">
                <label class="form-label" for="rhr">Resting Heart Rate *</label>
                <input id="rhr" v-model.number="rhr" type="number" class="form-control"
                       min="40" max="120" aria-required="true"
                       aria-describedby="rhr-hint">
                <div id="rhr-hint" class="form-text">Typical adult 60-100 bpm.</div>
              </div>

              <div class="col-12">
                <label class="form-label" for="goal">Goal *</label>
                <select id="goal" v-model="goal" class="form-select" aria-required="true">
                  <option disabled value="">Select goal</option>
                  <option>Lose weight</option>
                  <option>Reduce stress</option>
                  <option>Improve sleep</option>
                  <option>Cardio fitness</option>
                </select>
              </div>

              <div class="col-12">
                <label class="form-label" for="comment">Comment (optional)</label>
                <textarea id="comment" v-model="comment" class="form-control" rows="2"
                          aria-describedby="comment-hint"></textarea>
                <div id="comment-hint" class="form-text">We sanitize this field to prevent XSS.</div>
              </div>
            </div>

            <div class="mt-3 d-flex gap-2">
              <button class="btn btn-primary" :disabled="!formValid" aria-disabled="!formValid">Submit</button>
              <button type="button" class="btn btn-outline-secondary" @click="resetForm">Reset</button>
            </div>
          </form>

          
          <div class="mt-3" aria-live="polite">
            <div v-if="resultHtml" class="alert alert-success" v-html="resultHtml"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.visually-hidden {
  position:absolute!important; width:1px!important; height:1px!important;
  padding:0!important; margin:-1px!important; overflow:hidden!important;
  clip:rect(0,0,0,0)!important; white-space:nowrap!important; border:0!important;
}
</style>

