<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand" href="#" @click.prevent="go('home')">Men's Health</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="nav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a :class="linkClass('home')" href="#" @click.prevent="go('home')">Home</a></li>
          <li class="nav-item"><a :class="linkClass('topics')" href="#" @click.prevent="go('topics')">Topics</a></li>
          <li class="nav-item"><a :class="linkClass('tools')" href="#" @click.prevent="go('tools')">Tools</a></li>
          <li class="nav-item"><a :class="linkClass('form')" href="#" @click.prevent="go('form')">Health Check</a></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
const props = defineProps({ current: String })
const emit = defineEmits(['navigate'])
const go = (v) => emit('navigate', v)
const linkClass = (name) => ['nav-link', props.current===name?'active':'']
</script>
