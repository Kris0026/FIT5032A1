
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
            <hr>
            <div class="d-flex align-items-center">
              <RatingStars :topic-id="t.id" @rated="refreshAverages" />
              <span class="ms-2 small text-muted">Avg: {{ averages[t.id] || 0 }}/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import RatingStars from './RatingStars.vue'
const topics = ref([])
const averages = ref({})
function loadTopics(){ return fetch('/data.json').then(r=>r.json()) }
function loadAverages(){ try{ return JSON.parse(localStorage.getItem('mh_ratings_avg')) || {} } catch { return {} } }
function refreshAverages(){ averages.value = loadAverages() }
onMounted(async()=>{ topics.value = await loadTopics(); refreshAverages() })
</script>
