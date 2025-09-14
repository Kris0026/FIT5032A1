
const USERS_KEY = 'mh_users'
const SESSION_KEY = 'mh_session'

function loadUsers () {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || [] } catch { return [] }
}
function saveUsers (list) { localStorage.setItem(USERS_KEY, JSON.stringify(list)) }

export function currentUser () { try { return JSON.parse(localStorage.getItem(SESSION_KEY)) } catch { return null } }
export function hasRole (role) { const u = currentUser(); return !!u && u.role === role }
export function logout () { localStorage.removeItem(SESSION_KEY) }

function weakHash (s) { let h=0; for (let i=0;i<s.length;i++){ h=((h<<5)-h)+s.charCodeAt(i); h|=0 } return 'h:'+(h>>>0).toString(16) }

export function register ({ email, password, role='user' }) {
  const users = loadUsers()
  if (users.find(u => u.email === email)) throw new Error('Email already registered')
  const user = { email, pass: weakHash(password), role }
  users.push(user); saveUsers(users)
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email, role }))
  return { email, role }
}
export function login ({ email, password }) {
  const users = loadUsers()
  const u = users.find(u => u.email === email && u.pass === weakHash(password))
  if (!u) throw new Error('Invalid email or password')
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: u.email, role: u.role }))
  return { email: u.email, role: u.role }
}
export function seedDemoAccounts () {
  const users = loadUsers()
  if (!users.length) {
    users.push({ email: 'admin@demo.com', pass: weakHash('Admin123!'), role: 'admin' })
    users.push({ email: 'user@demo.com', pass: weakHash('User123!'), role: 'user' })
    saveUsers(users)
  }
}
