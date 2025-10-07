import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase, ref, get, query, orderByChild, limitToFirst, startAt } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
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
