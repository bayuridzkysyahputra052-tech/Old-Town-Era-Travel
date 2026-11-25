let currentUser = null;
let selectedPkg = { name: "", price: 0 };
const bookings = [];

const formatRupiah = (angka) => "Rp " + angka.toLocaleString("id-ID");

// 1. Navigasi Responsif (Mobile)
document.getElementById("menuToggle").addEventListener("click", () => {
    document.getElementById("navLinks").classList.toggle("active");
});

// 2. Fitur Login
const loginBtn = document.getElementById("loginBtn");
loginBtn.addEventListener("click", () => {
    if (currentUser) {
        currentUser = null;
        loginBtn.textContent = "Masuk / Daftar";
        document.getElementById("riwayatSection").classList.add("hidden");
        alert("Anda telah keluar dari akun.");
    } else {
        document.getElementById("loginModal").classList.remove("hidden");
    }
});

document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = document.getElementById("userNameInput").value;
    const email = document.getElementById("userEmailInput").value;
    currentUser = { nama, email };
    loginBtn.textContent = `Halo, ${nama} (Keluar)`;
    closeModal("loginModal");
    alert(`Selamat datang di Old Town Era Travel, ${nama}!`);
});

// 3. Fitur Booking & Kalkulator Harga
function openBooking(pkgName, pkgPrice) {
    if (!currentUser) {
        alert("Silakan masuk ke akun terlebih dahulu sebelum melakukan booking.");
        document.getElementById("loginModal").classList.remove("hidden");
        return;
    }
    selectedPkg = { name: pkgName, price: pkgPrice };
    document.getElementById("modalPkgName").textContent = pkgName;
    document.getElementById("modalPkgPrice").textContent = `${formatRupiah(pkgPrice)} / orang`;
    document.getElementById("guestCount").value = 1;
    document.getElementById("totalAmount").textContent = formatRupiah(pkgPrice);
    document.getElementById("bookingModal").classList.remove("hidden");
}

document.getElementById("guestCount").addEventListener("input", (e) => {
    const jumlah = parseInt(e.target.value) || 1;
    document.getElementById("totalAmount").textContent = formatRupiah(selectedPkg.price * jumlah);
});

document.getElementById("bookingForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const tanggal = document.getElementById("visitDate").value;
    const jumlah = parseInt(document.getElementById("guestCount").value);
    const total = selectedPkg.price * jumlah;
    const kodeTiket = "OTE-" + Math.floor(1000 + Math.random() * 9000);

    bookings.push({
        kode: kodeTiket,
        paket: selectedPkg.name,
        tanggal,
        jumlah,
        total
    });

    closeModal("bookingModal");
    renderBookings();
    alert(`Booking berhasil!\nKode Tiket: ${kodeTiket}\nDestinasi: ${selectedPkg.name}`);
});

function renderBookings() {
    const section = document.getElementById("riwayatSection");
    const list = document.getElementById("bookingHistory");
    section.classList.remove("hidden");

    list.innerHTML = bookings.map(b => `
        <div class="history-card">
            <div>
                <strong>${b.paket}</strong> (${b.kode})<br>
                <small>Tanggal: ${b.tanggal} • ${b.jumlah} Peserta</small>
            </div>
            <div>
                <strong>${formatRupiah(b.total)}</strong>
            </div>
        </div>
    `).join("");
}

// 4. Fitur Interaksi Forum Pengunjung
document.getElementById("forumForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("forumInput");
    const feed = document.getElementById("forumFeed");
    const pengirim = currentUser ? currentUser.nama : "Pengunjung Kota Tua";

    const item = document.createElement("div");
    item.className = "feed-item";
    item.innerHTML = `<strong>${pengirim}</strong> <small>• Baru saja</small><p>${input.value}</p>`;
    feed.prepend(item);
    input.value = "";
});

// 5. Fitur Interaksi Chat Pemandu Kota Tua
document.getElementById("chatForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("chatInput");
    const chatFeed = document.getElementById("chatFeed");
    const tanya = input.value;

    chatFeed.innerHTML += `<div class="chat-msg user">${tanya}</div>`;
    input.value = "";

    setTimeout(() => {
        let jawaban = "Titik kumpul semua paket berada di depan pintu utama Museum Fatahillah pukul 08.30 WIB.";
        const teks = tanya.toLowerCase();

        if (teks.includes("fatahillah")) {
            jawaban = "Museum Fatahillah buka Selasa–Minggu pukul 09.00–15.00 WIB. Sudah termasuk tiket masuk dalam paket!";
        } else if (teks.includes("intan")) {
            jawaban = "Jembatan Kota Intan berjarak sekitar 5 menit jalan kaki dari Taman Fatahillah menyusuri Kali Besar.";
        } else if (teks.includes("toko merah")) {
            jawaban = "Toko Merah terletak di tepi barat Kali Besar dan memiliki arsitektur bata merah klasik abad ke-18.";
        }

        chatFeed.innerHTML += `<div class="chat-msg bot">${jawaban}</div>`;
        chatFeed.scrollTop = chatFeed.scrollHeight;
    }, 400);
});

function closeModal(id) {
    document.getElementById(id).classList.add("hidden");
}