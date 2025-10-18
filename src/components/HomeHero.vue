<template>
  <section class="p-5 mb-4 bg-white rounded-3 shadow-sm">
    <div class="container-fluid py-3">
      <h1 class="display-6">Men's Health Hub</h1>
      <p class="lead mb-3">Evidence-based tips, self-check tools and a supportive community.</p>
      <button class="btn btn-primary me-2" @click="$emit('go','topics')">Explore Topics</button>
      <button class="btn btn-outline-secondary" @click="$emit('go','tools')">Try Tools</button>
    </div>
  </section>
</template>
<script setup>

</script>
