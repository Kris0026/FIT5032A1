
import { getFunctions, httpsCallable } from 'firebase/functions'
import { app } from './firebaseInit'  


const functions = getFunctions(app, 'australia-southeast1')


export async function callAdvice(payload) {
  const fn = httpsCallable(functions, 'healthAdvice')
  const res = await fn(payload) // { data: { advice: '...' } }
  return res.data
}
