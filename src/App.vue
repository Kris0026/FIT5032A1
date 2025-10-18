<template>
  <div>
    
    <NavBar :current="currentView" :user="user" @navigate="navigate" @logout="doLogout" />

    <main class="container py-4">
      
      <component :is="currentComp" @go="navigate" @logged="onAuth" @registered="onAuth" />
    </main>

    <FooterBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import NavBar from './components/NavBar.vue'
import FooterBar from './components/FooterBar.vue'
import HealthForm from './components/HealthForm.vue'
import HealthTopics from './components/HealthTopics.vue'
import Tools from './components/Tools.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Admin from './components/Admin.vue'
import EmailCenter from './components/EmailCenter.vue'
import InteractiveTable from './components/InteractiveTable.vue'

import {
  initAuth, onUser, login, logout, currentUser,
  seedDemoAccounts, hasRole, firebaseConfig
} from './services/auth'


const user = ref(null)
const currentView = ref('home')


const views = {
  home: { component: { template: `
    <div>
      <section class='p-5 mb-4 bg-white rounded-3 shadow-sm'>
        <div class='container-fluid py-3'>
          <h1 class='display-6'>Men's Health Hub</h1>
          <p class='lead mb-3'>Evidence-based tips, self-check tools and a supportive community.</p>
          <button class='btn btn-primary me-2' @click="$emit('go','topics')">Explore Topics</button>
          <button class='btn btn-outline-secondary' @click="$emit('go','tools')">Try Tools</button>
        </div>
      </section>
    </div>` } },
  topics:   { component: HealthTopics },
  tools:    { component: Tools },
  form:     { component: HealthForm },
  email:    { component: EmailCenter },
  login:    { component: Login },
  register: { component: Register },
  admin:    { component: Admin },
  data:   { component: InteractiveTable },
}

const currentComp = computed(() => views[currentView.value].component)


function navigate(view) {
  
  if (view === 'admin' && !hasRole(user.value, 'admin')) {
    currentView.value = user.value ? 'home' : 'login'
    return
  }
  currentView.value = view
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onAuth(u) {
  user.value = u
  currentView.value = 'home'
}

async function doLogin()  { await login() }
async function doLogout() {
  await logout()
  user.value = null
  currentView.value = 'home'
}


onMounted(async () => {
  
  seedDemoAccounts()

  
  await initAuth(firebaseConfig)

  
  onUser(u => {
    user.value = u
    
    if (currentView.value === 'admin' && !hasRole(user.value, 'admin')) {
      currentView.value = 'home'
    }
  })

  
  user.value = currentUser()
})
</script>
