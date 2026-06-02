import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBw8C0BKLSblniXQEm16o1KQAKV9Z8Bm6Q",
  authDomain: "hilosjoelinventory.firebaseapp.com",
  projectId: "hilosjoelinventory",
  storageBucket: "hilosjoelinventory.firebasestorage.app",
  messagingSenderId: "552024720697",
  appId: "1:552024720697:web:e6b41a769224b37c3054e8",
  measurementId: "G-5VDYTZ6SZR"
}

const app = initializeApp(firebaseConfig)
const db  = getFirestore(app)

// ─── Usuarios ─────────────────────────────────────────
export const getUsers = async () => {
  try {
    const snap = await getDoc(doc(db, 'data', 'users'))
    return snap.exists() ? snap.data().list : []
  } catch { return [] }
}

export const saveUsers = async (users) => {
  try {
    await setDoc(doc(db, 'data', 'users'), { list: users })
  } catch (err) { console.error('Error guardando usuarios:', err) }
}

// ─── Productos ────────────────────────────────────────
export const getProducts = async () => {
  try {
    const snap = await getDoc(doc(db, 'data', 'products'))
    return snap.exists() ? snap.data().list : []
  } catch { return [] }
}

export const saveProducts = async (products) => {
  try {
    await setDoc(doc(db, 'data', 'products'), { list: products })
  } catch (err) { console.error('Error guardando productos:', err) }
}

// ─── Suscripción en tiempo real ───────────────────────
export const subscribeToProducts = (callback) => {
  return onSnapshot(doc(db, 'data', 'products'), (snap) => {
    callback(snap.exists() ? snap.data().list : [])
  })
}