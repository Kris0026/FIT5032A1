<template>
  <div>
    <NavBar :current="currentView" @navigate="currentView = $event" />
    <main class="container py-4">
      <component :is="currentComponent" @go="(v)=> currentView=v"/>
    </main>
    <FooterBar />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import NavBar from './components/NavBar.vue'
import FooterBar from './components/FooterBar.vue'
import HealthForm from './components/HealthForm.vue'
import HealthTopics from './components/HealthTopics.vue'
import Tools from './components/Tools.vue'

const currentView = ref('home')
const views = {
  home: {
    component: {
      template: `
      <div>
        <section class="p-5 mb-4 bg-white rounded-3 shadow-sm">
          <div class="container-fluid py-3">
            <h1 class="display-6">Men's Health Hub</h1>
            <p class="lead mb-3">Evidence-based tips, self-check tools and a supportive community.</p>
            <button class="btn btn-primary me-2" @click="$emit('go','topics')">Explore Topics</button>
            <button class="btn btn-outline-secondary" @click="$emit('go','tools')">Try Tools</button>
          </div>
        </section>
        <div class="row g-3">
          <div class="col-md-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">Physical Health</h5>
                <p class="card-text">Fitness & nutrition basics to get you moving.</p>
                <button class="btn btn-sm btn-primary" @click="$emit('go','topics')">Read more</button>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">Mental Wellbeing</h5>
                <p class="card-text">Stress, sleep, anxiety—practical ways to cope.</p>
                <button class="btn btn-sm btn-primary" @click="$emit('go','topics')">Read more</button>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">Health Check</h5>
                <p class="card-text">Quick self-check with instant guidance.</p>
                <button class="btn btn-sm btn-primary" @click="$emit('go','form')">Start check</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      `,
      emits: ['go']
    }
  },
  topics: { component: HealthTopics },
  tools: { component: Tools },
  form:  { component: HealthForm },
}
const currentComponent = computed(() => (views[currentView.value].component))
</script>
