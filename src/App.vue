<template>
  <div>
    <NavBar
      :current="currentView"
      :user="user"
      @navigate="navigate"
      @logout="doLogout"
    />

    
    <main id="main" class="container py-4" tabindex="-1">
      <component
        :is="currentComp"
        @go="navigate"
        @logged="onAuth"
        @registered="onAuth"
      />
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
import GeoMap from './components/GeoMap.vue'
import HomeHero from './components/HomeHero.vue'
import ExportCenter from './components/ExportCenter.vue'
import AIAdvice from './components/AIAdvice.vue'
import CalendarBooking from './components/CalendarBooking.vue'
import AdminDashboard from './components/AdminDashboard.vue'


import {
  initAuth, onUser, login, logout, currentUser,
  seedDemoAccounts, hasRole, firebaseConfig
} from './services/auth'

const user = ref(null)
const currentView = ref('home')


const views = {
  home:     { component: HomeHero },
  topics:   { component: HealthTopics },
  tools:    { component: Tools },
  form:     { component: HealthForm },
  email:    { component: EmailCenter },
  login:    { component: Login },
  register: { component: Register },
  admin:    { component: Admin },
  data:     { component: InteractiveTable },
  geo:      { component: GeoMap },
  export:   { component: ExportCenter },
  ai:       { component: AIAdvice },
  calendar: { component: CalendarBooking },
  dashboard:{ component: AdminDashboard },
  
}


const currentComp = computed(() => {
  const key = currentView.value
  const entry = views[key]
  if (!entry) {
    console.warn('[View Not Found]', key, 'Available keys:', Object.keys(views))
    return HomeHero
  }
  return entry.component
})

function navigate(view) {
  console.log('[navigate] ->', view)
 
  if (view === 'admin' && !hasRole(user.value, 'admin')) {
    currentView.value = user.value ? 'home' : 'login'
    console.log('[navigate] blocked ->', currentView.value)
    return
  }
  currentView.value = view
  console.log('[navigate] currentView =', currentView.value)
  
  window.scrollTo({ top: 0, behavior: 'smooth' })
  setTimeout(() => document.getElementById('main')?.focus(), 0)
}

function onAuth(u) {
  user.value = u
  currentView.value = 'home'
}

async function doLogin() { await login() }
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
