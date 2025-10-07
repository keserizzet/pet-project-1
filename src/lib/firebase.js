import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase, ref, get, query, orderByChild, limitToFirst, startAt } from 'firebase/database'

const env = import.meta.env || {}
const inferredDbUrl = env.VITE_FIREBASE_PROJECT_ID
  ? `https://${env.VITE_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
  : undefined

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: env.VITE_FIREBASE_DATABASE_URL || inferredDbUrl,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getDatabase(app)

export async function fetchNanniesFirstPage(limit = 3) {
  const q = query(ref(db, 'nannies'), orderByChild('name'), limitToFirst(limit))
  const snap = await get(q)
  return snap.val() || {}
}

export async function fetchNanniesNextPage(lastName, limit = 3) {
  const q = query(ref(db, 'nannies'), orderByChild('name'), startAt(lastName), limitToFirst(limit + 1))
  const snap = await get(q)
  const data = snap.val() || {}
  const entries = Object.entries(data)
  const sliced = entries.filter(([, v], idx) => !(idx === 0 && v?.name === lastName))
  return Object.fromEntries(sliced)
}
