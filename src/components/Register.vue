
<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card shadow-sm">
        <div class="card-body">
          <h3 class="card-title mb-3">Register</h3>
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          <form @submit.prevent="submit" novalidate>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model.trim="email" class="form-control" type="email" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="password" class="form-control" type="password" minlength="6" required>
              <div class="form-text">Min 6 characters, include letters and numbers.</div>
            </div>
            <div class="mb-3">
              <label class="form-label">Role</label>
              <select v-model="role" class="form-select" required>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button class="btn btn-warning">Create Account</button>
            <button type="button" class="btn btn-link" @click="$emit('go','login')">Back to login</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { register } from '../services/auth'
import { sanitize } from '../utils/sanitize'
const emit = defineEmits(['registered'])
const email = ref('')
const password = ref('')
const role = ref('user')
const error = ref('')
const strongEnough = computed(()=>/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password.value))
async function submit(){ try{ error.value=''; if(!strongEnough.value){ error.value='Password too weak'; return } const u=await register({ email: sanitize(email.value), password: password.value, role: role.value }); emit('registered',u) } catch(e){ error.value=e.message||'Registration failed' } }
</script>
