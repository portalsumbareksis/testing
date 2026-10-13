// Isi dengan konfigurasi aplikasi Firebase milik Anda dari Firebase Console.
// Jangan memasukkan private service-account key di frontend.
export const firebaseConfig = {
  apiKey: "GANTI_DENGAN_FIREBASE_API_KEY",
  authDomain: "GANTI_DENGAN_PROJECT_ID.firebaseapp.com",
  projectId: "GANTI_DENGAN_PROJECT_ID",
  storageBucket: "GANTI_DENGAN_PROJECT_ID.appspot.com",
  messagingSenderId: "GANTI_DENGAN_SENDER_ID",
  appId: "GANTI_DENGAN_APP_ID"
};
export const isFirebaseConfigured = () =>
  firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("GANTI_") &&
  firebaseConfig.projectId && !firebaseConfig.projectId.startsWith("GANTI_");
