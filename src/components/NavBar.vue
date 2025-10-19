<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom" role="navigation" aria-label="Main">
    <div class="container">
      <a class="navbar-brand fw-semibold" href="#" @click.prevent="emit('navigate','home')">
        Men's Health
      </a>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
        aria-controls="mainNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="mainNav" class="collapse navbar-collapse">
       
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a :class="itemClass('home')"    href="#" @click.prevent="emit('navigate','home')"  aria-current="page">Home</a>
          </li>
          <li class="nav-item">
            <a :class="itemClass('topics')"  href="#" @click.prevent="emit('navigate','topics')">Topics</a>
          </li>
          <li class="nav-item">
            <a :class="itemClass('tools')"   href="#" @click.prevent="emit('navigate','tools')">Tools</a>
          </li>
          <li class="nav-item">
            <a :class="itemClass('data')"    href="#" @click.prevent="emit('navigate','data')">Data</a>
          </li>
          <li class="nav-item">
            <a :class="itemClass('geo')"     href="#" @click.prevent="emit('navigate','geo')">Map</a>
          </li>
          <li class="nav-item">
            <a :class="itemClass('form')"    href="#" @click.prevent="emit('navigate','form')">Health Check</a>
          </li>
          <li class="nav-item">
            <a :class="itemClass('email')"   href="#" @click.prevent="emit('navigate','email')">Email</a>
          </li>
          <li class="nav-item">
            <a :class="itemClass('ai')" href="#" @click.prevent="emit('navigate','ai')">AI</a>
          </li>
          <li class="nav-item">
            <a :class="itemClass('calendar')" href="#" @click.prevent="emit('navigate','calendar')">Calendar</a>
          </li>
          <li class="nav-item">
            <a :class="itemClass('dashboard')" href="#" @click.prevent="emit('navigate','dashboard')">Dashboard</a>
          </li>
          <li class="nav-item">
            <a :class="itemClass('admin')"   href="#" @click.prevent="emit('navigate','admin')">Admin</a>
          </li>
          <li class="nav-item">
            <a :class="itemClass('export')"  href="#" @click.prevent="emit('navigate','export')">Export</a>
          </li>
        </ul>

        
        <div class="d-flex gap-2 align-items-center">
          <template v-if="user">
            <span class="navbar-text small text-muted">Hello, {{ user.email || 'user' }}</span>
            <button class="btn btn-outline-secondary btn-sm" @click="emit('logout')">Logout</button>
          </template>
          <template v-else>
            <button class="btn btn-outline-primary btn-sm" @click="emit('navigate','login')">Login</button>
            <button class="btn btn-warning btn-sm" @click="emit('navigate','register')">Register</button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const props = defineProps({
  current: { type: String, default: 'home' },
  user: { type: Object, default: null }
})
const emit = defineEmits(['navigate', 'logout'])

function itemClass(view) {
  return ['nav-link', props.current === view ? 'active' : '']
}
</script>

<style scoped>
.nav-link.active {
  font-weight: 600;
  text-decoration: underline;
}
</style>
