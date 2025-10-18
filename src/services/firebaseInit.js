
import { initializeApp, getApps, getApp } from 'firebase/app'


const firebaseConfig = {
  apiKey:        'AIzaSyBqZwwTGkkLOaDhyVq0Vw8hRLwgfZJwkBw',
  authDomain:    'week7-zifeng.firebaseapp.com',
  projectId:     'week7-zifeng',
  appId:         '1:922676695284:web:8a0f2e11700dcee2ef4ea1',
  
}


export const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
