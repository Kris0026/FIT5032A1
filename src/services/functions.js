
import { getFunctions, httpsCallable } from 'firebase/functions'
import { app } from './firebaseInit' 

const REGION = 'australia-southeast1'
const functions = getFunctions(app, REGION)

export async function callAdvice(payload) {
  const fn = httpsCallable(functions, 'aiAdvice')
  const res = await fn(payload)
  return res.data     
}
