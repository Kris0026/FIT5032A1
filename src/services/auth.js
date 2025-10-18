// src/services/auth.js
// Unified auth module: Firebase (if configured) + local demo fallback
// Exports to match your app: initAuth, onUser, login, logout, register,
// currentUser, hasRole, seedDemoAccounts, firebaseConfig

const SESSION_KEY = 'mh_session'
const USERS_KEY = 'mh_users' // demo user store (local)
let useFirebase = false
let fb = null

export const firebaseConfig = {
  apiKey: "AIzaSyC3Gwc7cT8jBqIPKnEH4mIge-FAJWCp3-I",
  authDomain: "a3-dec0c.firebaseapp.com",
  projectId: "a3-dec0c"
}

// ---------- helpers (local demo) ----------
function lsGet(key, def = null) {
  try { return JSON.parse(localStorage.getItem(key) || (def === null ? 'null' : JSON.stringify(def))) }
  catch { return def }
}
function lsSet(key, val) { localStorage.setItem(key, JSON.stringify(val)) }
function emitStorage() { window.dispatchEvent(new Event('storage')) }

function makeUser(obj) {
  // normalize user shape your app might use
  const email = obj?.email || 'user@demo.com'
  const role = obj?.role || 'user'
  const uid  = obj?.uid  || 'local-demo'
  return { email, role, uid }
}

// ---------- init ----------
export async function initAuth(config = firebaseConfig) {
  try {
    if (!config || !config.apiKey || config.apiKey === 'YOUR_API_KEY') {
      useFirebase = false
      return false
    }
    const { initializeApp } = await import('firebase/app')
    const {
      getAuth, onAuthStateChanged,
      GoogleAuthProvider, signInWithPopup,
      signOut, createUserWithEmailAndPassword
    } = await import('firebase/auth')

    const app = initializeApp(config)
    const auth = getAuth(app)
    fb = { auth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword }
    useFirebase = true
    return true
  } catch (e) {
    console.warn('Firebase init failed, fallback to local demo auth.', e)
    useFirebase = false
    return false
  }
}

// ---------- observers ----------
export function onUser(cb) {
  if (useFirebase && fb) {
    fb.onAuthStateChanged(fb.auth, (u) => cb(u ? makeUser({ email: u.email, uid: u.uid, role: 'user' }) : null))
  } else {
    cb(currentUser())
    window.addEventListener('storage', () => cb(currentUser()))
  }
}

// Return current user synchronously
export function currentUser() {
  if (useFirebase && fb) {
    const u = fb.auth.currentUser
    return u ? makeUser({ email: u.email, uid: u.uid, role: 'user' }) : null
  } else {
    const u = lsGet(SESSION_KEY, null)
    return u ? makeUser(u) : null
  }
}

// ---------- actions ----------
export async function login() {
  if (useFirebase && fb) {
    const provider = new fb.GoogleAuthProvider()
    const res = await fb.signInWithPopup(fb.auth, provider)
    return makeUser({ email: res.user.email, uid: res.user.uid, role: 'user' })
  } else {
    // local demo login: first user in USERS_KEY, or default
    const users = lsGet(USERS_KEY, [])
    const u = users[0] || { email: 'user@demo.com', role: 'user', uid: 'local-demo' }
    lsSet(SESSION_KEY, u); emitStorage()
    return makeUser(u)
  }
}

export async function logout() {
  if (useFirebase && fb) {
    await fb.signOut(fb.auth)
  } else {
    localStorage.removeItem(SESSION_KEY)
    emitStorage()
  }
}

// Email/password register (Firebase) or create local demo user
export async function register({ email, password, role = 'user' }) {
  if (useFirebase && fb) {
    await fb.createUserWithEmailAndPassword(fb.auth, email, password)
    return makeUser({ email, role })
  } else {
    const users = lsGet(USERS_KEY, [])
    const newU = makeUser({ email, role, uid: 'u_' + Date.now() })
    users.push(newU); lsSet(USERS_KEY, users)
    lsSet(SESSION_KEY, newU); emitStorage()
    return newU
  }
}

// Role guard helper (works for both demo & Firebase)
export function hasRole(user, role) {
  if (!user) return false
  // support 'role' string or 'roles' array
  if (Array.isArray(user.roles)) return user.roles.includes(role)
  return (user.role || 'user') === role
}

// Seed some demo accounts into local storage (for teacher demo)
export function seedDemoAccounts() {
  const exists = lsGet(USERS_KEY, [])
  if (exists?.length) return exists
  const demo = [
    { email: 'user@demo.com', role: 'user', uid: 'u1' },
    { email: 'admin@demo.com', role: 'admin', uid: 'u2' }
  ]
  lsSet(USERS_KEY, demo)
  return demo
}
