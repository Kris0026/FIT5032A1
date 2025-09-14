
<template>
  <div class="alert alert-info">
    <h4 class="alert-heading">Admin Panel</h4>
    <p>Only users with the <b>admin</b> role can see this page. Here you could manage topics, view aggregated ratings, etc.</p>
  </div>
  <div>
    <h5>Aggregated Ratings</h5>
    <pre class="bg-light p-2 border rounded">{{ ratingsPretty }}</pre>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
const ratings = ref({})
const ratingsPretty = computed(()=>JSON.stringify(ratings.value, null, 2))
onMounted(()=>{
  try{ ratings.value = JSON.parse(localStorage.getItem('mh_ratings')) || {} } catch { ratings.value = {} }
})
</script>
