
<template>
  <div>
    <button v-for="i in 5" :key="i" class="btn btn-sm" :class="i<=current?'btn-warning':'btn-outline-secondary'"
            :disabled="rated" @click="rate(i)">*</button>
    <span v-if="rated" class="small text-success ms-1">Thanks!</span>
    <span v-if="!canRate" class="small text-muted ms-1">Login to rate</span>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { currentUser } from '../services/auth'
const props = defineProps({ topicId: Number })
const current = ref(0)
const rated = ref(false)
const user = ref(null)
const canRate = computed(()=>!!user.value)
function keyFor(email,id){ return `mh_rate_${email}_${id}` }
function rate(score){
  if(!user.value || rated.value) return
  current.value = score
  localStorage.setItem(keyFor(user.value.email, props.topicId), String(score))
  const agg = JSON.parse(localStorage.getItem('mh_ratings')) || {}
  const item = agg[props.topicId] || { sum:0, count:0 }
  item.sum += score; item.count += 1
  agg[props.topicId] = item
  localStorage.setItem('mh_ratings', JSON.stringify(agg))
  const avg = JSON.parse(localStorage.getItem('mh_ratings_avg')) || {}
  avg[props.topicId] = (item.sum / item.count).toFixed(1)
  localStorage.setItem('mh_ratings_avg', JSON.stringify(avg))
  rated.value = true
  emit('rated')
}
const emit = defineEmits(['rated'])
onMounted(()=>{
  user.value = currentUser()
  if(user.value){
    const prev = localStorage.getItem(keyFor(user.value.email, props.topicId))
    rated.value = !!prev; current.value = Number(prev || 0)
  }
})
</script>
