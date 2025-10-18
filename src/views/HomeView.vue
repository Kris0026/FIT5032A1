<template>
  <div>
    <h2 class="mb-3"> W5. Library Registration Form</h2>
    <p class="text-muted">Let's build some more advanced features into our form.</p>

    <form @submit.prevent="submitForm" class="row g-3">
      <div class="col-md-6">
        <label for="username" class="form-label">Username</label>
        <input id="username" type="text" class="form-control" v-model="formData.username"
               @blur="validateName(true)" @input="validateName(false)" />
        <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
      </div>

      <div class="col-md-6">
        <label for="gender" class="form-label">Gender</label>
        <select id="gender" class="form-select" v-model="formData.gender">
          <option value="" disabled>Select</option>
          <option>Male666</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      </div>

      <div class="col-md-6">
        <label for="password" class="form-label">Password</label>
        <input id="password" type="password" class="form-control" v-model="formData.password"
               @blur="validatePassword(true)" @input="validatePassword(false)" />
        <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
      </div>

      <div class="col-md-6">
        <label for="confirm-password" class="form-label">Confirm password</label>
        <input id="confirm-password" type="password" class="form-control" v-model="formData.confirmPassword"
               @blur="validateConfirmPassword(true)" />
        <div v-if="errors.confirmPassword" class="text-danger">{{ errors.confirmPassword }}</div>
      </div>

      <div class="col-12 form-check ms-2">
        <input id="resident" class="form-check-input" type="checkbox" v-model="formData.isAustralian" />
        <label class="form-check-label" for="resident">Australian Resident?</label>
      </div>

      <div class="col-12">
        <label for="reason" class="form-label">Reason for joining</label>
        <textarea id="reason" class="form-control" v-model="formData.reason" rows="3"
                  @input="validateReason()"></textarea>
        <div v-if="success.reason" class="text-success">{{ success.reason }}</div>
      </div>

      <div class="col-12">
        <label for="suburb" class="form-label">Suburb</label>
        <!-- intentionally showing the correct two-way binding with v-model -->
        <input id="suburb" type="text" class="form-control" v-model="formData.suburb" />
      </div>

      <div class="col-12 d-flex gap-2">
        <button type="submit" class="btn btn-primary">Submit</button>
        <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  isAustralian: false,
  reason: '',
  gender: '',
  suburb: 'Clayton'
})

const errors = ref({
  username: null,
  password: null,
  confirmPassword: null,
  resident: null,
  gender: null,
  reason: null
})

const success = ref({
  reason: null
})

const validateName = (blur) => {
  if (!formData.value.username || formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Username must be at least 3 characters.'
  } else {
    errors.value.username = null
  }
}

const validatePassword = (blur) => {
  if (!formData.value.password || formData.value.password.length < 6) {
    if (blur) errors.value.password = 'Password must be at least 6 characters.'
  } else {
    errors.value.password = null
  }
}

const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match.'
  } else {
    errors.value.confirmPassword = null
  }
}

const validateReason = () => {
  if (formData.value.reason.toLowerCase().includes('friend')) {
    success.value.reason = 'Great to have a friend'
  } else {
    success.value.reason = null
  }
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    confirmPassword: '',
    isAustralian: false,
    reason: '',
    gender: '',
    suburb: 'Clayton'
  }
  errors.value = {
    username: null,
    password: null,
    confirmPassword: null,
    resident: null,
    gender: null,
    reason: null
  }
  success.value = { reason: null }
}

const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateConfirmPassword(true)
  if (!errors.value.username && !errors.value.password && !errors.value.confirmPassword) {
    alert('Form submitted! (Demo)')
    clearForm()
  }
}
</script>
