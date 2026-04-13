import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAKlYZn3Jq5Zyh3dRE54-DxvfQtFWlbzHw',
  authDomain: 'authentication-app-7e8ef.firebaseapp.com',
  projectId: 'authentication-app-7e8ef',
  storageBucket: 'authentication-app-7e8ef.firebasestorage.app',
  messagingSenderId: '909000181389',
  appId: '1:909000181389:web:370a560e130ee8222c04c4',
  measurementId: 'G-VT0N5KR9JT',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

googleProvider.setCustomParameters({
  prompt: 'select_account',
})

export { auth, googleProvider }
