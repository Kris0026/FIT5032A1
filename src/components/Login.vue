
<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card shadow-sm">
        <div class="card-body">
          <h3 class="card-title mb-3">Login</h3>
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          <form @submit.prevent="submit">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model.trim="email" class="form-control" type="email" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="password" class="form-control" type="password" minlength="6" required>
            </div>
            <button class="btn btn-primary">Login</button>
            <button type="button" class="btn btn-link" @click="$emit('go','register')">Create an account</button>
            <div class="form-text">Demo: user@demo.com / User123! · admin@demo.com / Admin123!</div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { login } from '../services/auth'
const emit = defineEmits(['logged','go'])
const email = ref('user@demo.com')
const password = ref('User123!')
const error = ref('')
async function submit(){ try{ error.value=''; const u = await login({email:email.value,password:password.value}); emit('logged',u) } catch(e){ error.value=e.message||'Login failed' } }
</script>
