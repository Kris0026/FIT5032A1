<template>
  <div>
    <h3 class="mb-3">Health Topics</h3>
    <div class="row g-3">
      <div v-for="t in topics" :key="t.id" class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ t.title }}</h5>
            <p class="card-text">{{ t.description }}</p>
            <span class="badge bg-secondary me-1" v-for="tag in t.tags" :key="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const topics = ref([])

onMounted(async () => {
  const res = await fetch('/data.json')
  topics.value = await res.json()
})
</script>
