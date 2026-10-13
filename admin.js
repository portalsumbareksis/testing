import { firebaseConfig, isFirebaseConfigured } from "./firebase-config.js";
const $ = selector => document.querySelector(selector);
let auth = null, db = null, fb = {}, editingId = null;
const status = $("#status"), loginCard = $("#loginCard"), dashboard = $("#dashboard");
if (!isFirebaseConfigured()) {
  status.textContent = "LOGIN ADMIN SUDAH TERSEDIA, tetapi belum dapat digunakan karena konfigurasi Firebase belum diisi. Ikuti langkah pada README.md.";
  $("#loginMsg").textContent = "Setup diperlukan: isi firebase-config.js, aktifkan Email/Password Authentication, lalu buat akun admin di Firebase.";
} else {
  try {
    const appmod = await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js");
    fb.authmod = await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js");
    fb.store = await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js");
    const app = appmod.initializeApp(firebaseConfig); auth = fb.authmod.getAuth(app); db = fb.store.getFirestore(app);
    status.textContent = "Firebase terhubung. Masuk dengan akun admin yang dibuat di Firebase Console.";
    fb.authmod.onAuthStateChanged(auth, user => { const logged = !!user; loginCard.classList.toggle("hidden", logged); dashboard.classList.toggle("hidden", !logged); $("#logout").classList.toggle("hidden", !logged); if (logged) refresh(); });
  } catch (error) { status.textContent = "Firebase gagal diinisialisasi. Periksa konfigurasi, koneksi internet, dan Firebase project."; console.error(error); }
}
$("#loginForm").addEventListener("submit", async event => {
  event.preventDefault(); if (!auth) { $("#loginMsg").textContent = "Belum terhubung ke Firebase. Isi firebase-config.js terlebih dahulu; form login tidak menggunakan password demo."; return; }
  const form = new FormData(event.currentTarget);
  try { await fb.authmod.signInWithEmailAndPassword(auth, form.get("email"), form.get("password")); $("#loginMsg").textContent = ""; }
  catch (error) { console.error(error); $("#loginMsg").textContent = "Login gagal. Periksa email/password dan pastikan Email/Password Authentication aktif."; }
});
$("#logout").addEventListener("click", () => fb.authmod?.signOut(auth));
function safeMsg(selector, message) { $(selector).textContent = message; }
async function refresh() {
  try {
    const [settings, services] = await Promise.all([fb.store.getDoc(fb.store.doc(db, "site", "settings")), fb.store.getDocs(fb.store.collection(db, "services"))]);
    const form = $("#settingsForm");
    if (settings.exists()) { const d = settings.data(); form.elements.brandName.value = d.brandName || "KENDEVSEC"; form.elements.whatsapp.value = d.whatsapp || "62895636069948"; form.elements.maintenanceMessage.value = d.maintenanceMessage || "Website sedang dalam pemeliharaan."; form.elements.maintenance.checked = d.maintenance === true; }
    const list = $("#serviceList"); list.innerHTML = "";
    services.forEach(snapshot => { const service = snapshot.data(), row = document.createElement("div"); row.className = "service-row"; const info = document.createElement("div"), title = document.createElement("strong"), desc = document.createElement("p"); title.textContent = service.name || "Tanpa nama"; desc.textContent = `${service.category || "LAYANAN"} · ${service.active === false ? "Disembunyikan" : "Aktif"}`; info.append(title, desc); const actions = document.createElement("div"); actions.style.cssText = "display:flex;gap:7px;flex-wrap:wrap"; const edit = document.createElement("button"); edit.className = "button secondary"; edit.type = "button"; edit.textContent = "Edit"; edit.addEventListener("click", () => editService(snapshot.id, service)); const del = document.createElement("button"); del.className = "danger"; del.type = "button"; del.textContent = "Hapus"; del.addEventListener("click", () => deleteService(snapshot.id)); actions.append(edit, del); row.append(info, actions); list.append(row); });
  } catch (error) { console.error(error); safeMsg("#serviceMsg", "Gagal memuat data. Periksa Firestore Rules dan koneksi."); }
}
$("#settingsForm").addEventListener("submit", async event => {
  event.preventDefault(); if (!db || !auth?.currentUser) return safeMsg("#settingsMsg", "Login admin dan konfigurasi Firebase diperlukan.");
  const form = new FormData(event.currentTarget);
  try { await fb.store.setDoc(fb.store.doc(db, "site", "settings"), { brandName: String(form.get("brandName") || "KENDEVSEC").slice(0, 80), whatsapp: String(form.get("whatsapp") || "62895636069948").replace(/\D/g, "").slice(0, 20), maintenanceMessage: String(form.get("maintenanceMessage") || "Website sedang maintenance.").slice(0, 500), maintenance: form.get("maintenance") === "on", updatedAt: fb.store.serverTimestamp() }, { merge: true }); safeMsg("#settingsMsg", "Pengaturan tersimpan. Muat ulang website publik untuk melihat perubahan."); }
  catch (error) { console.error(error); safeMsg("#settingsMsg", "Gagal menyimpan. Periksa Firestore Rules dan izin admin."); }
});
function resetService() { const form = $("#serviceForm"); form.reset(); form.elements.id.value = ""; form.elements.active.checked = true; editingId = null; }
function editService(id, service) { editingId = id; const form = $("#serviceForm"); form.elements.id.value = id; form.elements.name.value = service.name || ""; form.elements.category.value = service.category || ""; form.elements.icon.value = service.icon || ""; form.elements.description.value = service.description || ""; form.elements.active.checked = service.active !== false; form.scrollIntoView({ behavior: "smooth", block: "center" }); safeMsg("#serviceMsg", "Mode edit: ubah data lalu tekan Simpan layanan."); }
$("#cancelEdit").addEventListener("click", resetService);
$("#serviceForm").addEventListener("submit", async event => {
  event.preventDefault(); if (!db || !auth?.currentUser) return safeMsg("#serviceMsg", "Login admin dan konfigurasi Firebase diperlukan.");
  const form = event.currentTarget, data = { name: form.elements.name.value.trim(), category: form.elements.category.value.trim(), icon: form.elements.icon.value.trim(), description: form.elements.description.value.trim(), active: form.elements.active.checked, updatedAt: fb.store.serverTimestamp() };
  try { if (editingId) await fb.store.updateDoc(fb.store.doc(db, "services", editingId), data); else await fb.store.addDoc(fb.store.collection(db, "services"), { ...data, createdAt: fb.store.serverTimestamp() }); safeMsg("#serviceMsg", "Layanan tersimpan."); resetService(); await refresh(); }
  catch (error) { console.error(error); safeMsg("#serviceMsg", "Gagal menyimpan layanan. Periksa Firestore Rules."); }
});
async function deleteService(id) { if (!confirm("Hapus layanan ini?")) return; try { await fb.store.deleteDoc(fb.store.doc(db, "services", id)); safeMsg("#serviceMsg", "Layanan dihapus."); await refresh(); } catch (error) { console.error(error); safeMsg("#serviceMsg", "Gagal menghapus. Periksa Firestore Rules."); } }
