
<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand" href="#" @click.prevent="$emit('navigate','home')">Men's Health</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="nav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item"><a :class="linkClass('home')" href="#" @click.prevent="$emit('navigate','home')">Home</a></li>
          <li class="nav-item"><a :class="linkClass('topics')" href="#" @click.prevent="$emit('navigate','topics')">Topics</a></li>
          <li class="nav-item"><a :class="linkClass('tools')" href="#" @click.prevent="$emit('navigate','tools')">Tools</a></li>
          <li class="nav-item">
  <a class="nav-link" :class="{ active: current==='data' }" @click="$emit('navigate','data')">
    Data
  </a>
</li>

          <li class="nav-item"><a :class="linkClass('form')" href="#" @click.prevent="$emit('navigate','form')">Health Check</a></li>
          <li v-if="user && user.role==='admin'" class="nav-item"><a :class="linkClass('admin')" href="#" @click.prevent="$emit('navigate','admin')">Admin</a></li>
          <li class="nav-item">
  <a class="nav-link" @click="$emit('navigate','email')">
    <i class="bi bi-envelope"></i> Email
  </a> 
</li>

        </ul>
        <div class="d-flex align-items-center gap-2 text-light">
          <span v-if="user" class="small">Hello, {{ user.email }} <span class="badge bg-secondary text-uppercase ms-1">{{ user.role }}</span></span>
          <button v-if="!user" class="btn btn-outline-light btn-sm" @click="$emit('navigate','login')">Login</button>
          <button v-if="!user" class="btn btn-warning btn-sm" @click="$emit('navigate','register')">Register</button>
          <button v-if="user" class="btn btn-outline-light btn-sm" @click="$emit('logout')">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>
<script setup>
const props = defineProps({ current: String, user: Object })
const linkClass = (name) => ['nav-link', props.current===name?'active':'']
</script>
