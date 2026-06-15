"use client";

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [namaUser, setNamaUser] = useState('Tamu / Jemaat');
  const [menuAktif, setMenuAktif] = useState('Home');

  // STATE AUTH & DATABASE JEMAAT
  const [tampilkanAuth, setTampilkanAuth] = useState(false);
  const [isRegistrasi, setIsRegistrasi] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authNama, setAuthNama] = useState('');
  const [listPendaftar, setListPendaftar] = useState<any[]>([]); 

  // STATE GALERI FOTO HKBP (Statis Berwibawa dengan Pilihan Thumbnail)
  const [listGaleri, setListGaleri] = useState<string[]>([
    "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1200&q=80", // Altar Klasik Katedral
    "https://images.unsplash.com/photo-1545242187-f9c274931f9a?auto=format&fit=crop&w=1200&q=80", // Altar Lilin Khusyuk
    "https://images.unsplash.com/photo-1515516969-d4008cc6241a?auto=format&fit=crop&w=1200&q=80", // Alkitab & Salib Kebaktian
    "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=1200&q=80"  // Kaca Patri Salib Gereja Tradisional
  ]);
  const [gambarUtama, setGambarUtama] = useState<string>(listGaleri[0]);

  // 1. STATE DATA KEGIATAN
  const [listKegiatan, setListKegiatan] = useState([
    { 
      id: 1, nama: 'Ibadah Minggu Rogate', tanggal: '21 Juni 2026', jam: '09:00 WIB',
      lokasi: 'Gereja Utama (Sopo)', penanggungJawab: 'Dewan Koinonia / Amang Pendeta',
      deskripsi: 'Ibadah umum minggu Rogate dilayani oleh Amang Pendeta Sitorus.'
    },
  ]);

  // 2. STATE DATA WARTA
  const [listWarta, setListWarta] = useState([
    { 
      id: 3, judul: 'Warta Jemaat - Minggu 14 Juni 2026', 
      tingtingMarragam: '1. Kelas Katekisasi (Sidi) baru akan dibuka pendaftarannya.',
      pemasukan: 'Rp 14.500.000', pengeluaran: 'Rp 3.200.000', beritaDukacita: '-'
    },
  ]);

  // STATE SIDEBAR & INTERAKSI
  const [sidebarPengumuman, setSidebarPengumuman] = useState<any[]>([]);
  const [wartaTerpilih, setWartaTerpilih] = useState<any>(null);
  const [kegiatanTerpilih, setKegiatanTerpilih] = useState<any>(null);
  const [sudahDibaca, setSudahDibaca] = useState<number[]>([]);

  // State Input Form Admin
  const [inputKegNama, setInputKegNama] = useState('');
  const [inputKegTanggal, setInputKegTanggal] = useState('');
  const [inputKegJam, setInputKegJam] = useState('');
  const [inputKegLokasi, setInputKegLokasi] = useState('');
  const [inputKegPj, setInputKegPj] = useState('');
  const [inputKegDeskripsi, setInputKegDeskripsi] = useState('');
  
  const [inputWartaJudul, setInputWartaJudul] = useState('');
  const [inputTingting, setInputTingting] = useState('');
  const [inputPemasukan, setInputPemasukan] = useState('');
  const [inputPengeluaran, setInputPengeluaran] = useState('');
  const [inputDukacita, setInputDukacita] = useState('');

  const refreshSidebar = () => {
    const kegLokal = localStorage.getItem('kegiatan_hkbp');
    const warLokal = localStorage.getItem('warta_hkbp');
    const currentKeg = kegLokal ? JSON.parse(kegLokal) : listKegiatan;
    const currentWar = warLokal ? JSON.parse(warLokal) : listWarta;

    const gabungan = [
      ...currentKeg.map((k: any) => ({ ...k, tipe: 'KEGIATAN', teks: k.nama, info: `${k.tanggal} | ${k.jam}`, linkMenu: 'Kegiatan' })),
      ...currentWar.map((w: any) => ({ ...w, tipe: 'WARTA', teks: w.judul, info: 'Klik untuk baca detail laporan', linkMenu: 'Warta' }))
    ];
    gabungan.sort((a, b) => b.id - a.id);
    setSidebarPengumuman(gabungan);
  };

  const ambilDatabaseJemaat = () => {
    const userLokal = localStorage.getItem('hkbp_database_jemaat');
    if (userLokal) setListPendaftar(JSON.parse(userLokal));
  };

  useEffect(() => {
    const sessionUser = localStorage.getItem('hkbp_session_user');
    const sessionRole = localStorage.getItem('hkbp_session_role');
    if (sessionUser && sessionRole) {
      setIsLoggedIn(true);
      setNamaUser(sessionUser);
      setIsAdmin(sessionRole === 'admin');
    }

    const kegiatanLokal = localStorage.getItem('kegiatan_hkbp');
    if (kegiatanLokal) setListKegiatan(JSON.parse(kegiatanLokal));

    const wartaLokal = localStorage.getItem('warta_hkbp');
    if (wartaLokal) setListWarta(JSON.parse(wartaLokal));

    const dibacaLokal = localStorage.getItem('pengumuman_dibaca');
    if (dibacaLokal) setSudahDibaca(JSON.parse(dibacaLokal));

    // Muat daftar galeri kustom jika pernah diupload admin
    const galeriLokal = localStorage.getItem('hkbp_koleksi_galeri');
    if (galeriLokal) {
      const parsed = JSON.parse(galeriLokal);
      setListGaleri(parsed);
      setGambarUtama(parsed[0]);
    }

    ambilDatabaseJemaat();
    refreshSidebar();
  }, []);

  // FUNGSI ADMIN MENAMBAH FOTO SEJENIS KE DALAM COLECTION
  const handleUploadKeGaleri = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 1500000) {
        alert("Ukuran file maksimal 1.5 MB agar penyimpanan browser optimal.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const updatedGaleri = [...listGaleri, base64String];
        setListGaleri(updatedGaleri);
        localStorage.setItem('hkbp_koleksi_galeri', JSON.stringify(updatedGaleri));
        setGambarUtama(base64String); // Langsung tampilkan foto baru di kotak besar
        alert("Foto baru berhasil ditambahkan ke koleksi citra HKBP!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegistrasi = (e: React.FormEvent) => {
    e.preventDefault();
    const userLokal = localStorage.getItem('hkbp_database_jemaat');
    const databaseJemaat = userLokal ? JSON.parse(userLokal) : [];
    const emailEksis = databaseJemaat.find((u: any) => u.email === authEmail);
    if (emailEksis) { alert('Email ini sudah terdaftar!'); return; }

    const userBaru = { id: Date.now(), nama: authNama, email: authEmail, password: authPassword, status: 'PENDING' };
    databaseJemaat.push(userBaru);
    localStorage.setItem('hkbp_database_jemaat', JSON.stringify(databaseJemaat));
    setListPendaftar(databaseJemaat);
    alert('Pendaftaran Berhasil! Menunggu Approval Admin.');
    setIsRegistrasi(false); setAuthEmail(''); setAuthPassword(''); setAuthNama('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authEmail === 'admin@hkbp.com' && authPassword === 'admin123') {
      setIsAdmin(true); setIsLoggedIn(true); setNamaUser('Admin Secretariat');
      localStorage.setItem('hkbp_session_user', 'Admin Sekretariat'); localStorage.setItem('hkbp_session_role', 'admin');
      setTampilkanAuth(false); alert('Selamat Datang Kembali, Admin!'); return;
    }
    const userLokal = localStorage.getItem('hkbp_database_jemaat');
    const databaseJemaat = userLokal ? JSON.parse(userLokal) : [];
    const cocok = databaseJemaat.find((u: any) => u.email === authEmail && u.password === authPassword);
    if (cocok) {
      if (cocok.status === 'PENDING') { alert('❌ Login Ditolak! Akun jemaat Anda belum disetujui.'); return; }
      setIsAdmin(false); setIsLoggedIn(true); setNamaUser(cocok.nama);
      localStorage.setItem('hkbp_session_user', cocok.nama); localStorage.setItem('hkbp_session_role', 'jemaat');
      setTampilkanAuth(false); alert(`Selamat Datang, ${cocok.nama}!`);
    } else { alert('Email atau Password salah!'); }
  };

  const handleApproveJemaat = (id: number) => {
    const userLokal = localStorage.getItem('hkbp_database_jemaat');
    let databaseJemaat = userLokal ? JSON.parse(userLokal) : [];
    databaseJemaat = databaseJemaat.map((u: any) => u.id === id ? { ...u, status: 'APPROVED' } : u);
    localStorage.setItem('hkbp_database_jemaat', JSON.stringify(databaseJemaat));
    setListPendaftar(databaseJemaat); alert('Akun jemaat Berhasil disetujui!');
  };

  const handleLogout = () => {
    localStorage.removeItem('hkbp_session_user'); localStorage.removeItem('hkbp_session_role');
    setIsLoggedIn(false); setIsAdmin(false); setNamaUser('Tamu / Jemaat');
    setMenuAktif('Home'); setWartaTerpilih(null); setKegiatanTerpilih(null);
  };

  const handleKlikPengumuman = (item: any) => {
    setMenuAktif(item.linkMenu);
    if (item.tipe === 'WARTA') { setWartaTerpilih(item); setKegiatanTerpilih(null); }
    else if (item.tipe === 'KEGIATAN') { setKegiatanTerpilih(item); setWartaTerpilih(null); }
    if (!sudahDibaca.includes(item.id)) {
      const updateDibaca = [...sudahDibaca, item.id]; setSudahDibaca(updateDibaca);
      localStorage.setItem('pengumuman_dibaca', JSON.stringify(updateDibaca));
    }
  };

  const handleTambahKegiatan = (e: React.FormEvent) => {
    e.preventDefault();
    const dataBaru = [...listKegiatan, { id: Date.now(), nama: inputKegNama, tanggal: inputKegTanggal, jam: inputKegJam, lokasi: inputKegLokasi || 'Gereja', penanggungJawab: inputKegPj || 'Seksi Terkait', deskripsi: inputKegDeskripsi || '-' }];
    setListKegiatan(dataBaru); localStorage.setItem('kegiatan_hkbp', JSON.stringify(dataBaru));
    setInputKegNama(''); setInputKegTanggal(''); setInputKegJam(''); setInputKegLokasi(''); setInputKegPj(''); setInputKegDeskripsi('');
    refreshSidebar(); alert('Jadwal Kegiatan Berhasil Diterbitkan!');
  };

  const handleTambahWarta = (e: React.FormEvent) => {
    e.preventDefault();
    const dataBaru = [{ id: Date.now(), judul: inputWartaJudul, tingtingMarragam: inputTingting, pemasukan: inputPemasukan || 'Rp 0', pengeluaran: inputPengeluaran || 'Rp 0', beritaDukacita: inputDukacita || '-' }, ...listWarta];
    setListWarta(dataBaru); localStorage.setItem('warta_hkbp', JSON.stringify(dataBaru));
    setInputWartaJudul(''); setInputTingting(''); setInputPemasukan(''); setInputPengeluaran(''); setInputDukacita('');
    refreshSidebar(); alert('Warta Resmi berhasil diterbitkan!');
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans relative">
      
      {/* ==================== 🏆 NEW DESIGN HEADER: MEWAH & BERWIBAWA COCOK UNTUK GEREJA RESMI ==================== */}
      <nav className="relative shadow-xl sticky top-0 z-50 overflow-hidden bg-cover bg-center border-b border-white/10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=800&q=50')" }}>
        {/* Layer Hitam Degradasi Pekat (Mencegah Warna Biru Polos) */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-blue-950/95 to-slate-950 backdrop-blur-[6px]" />
        
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative z-10">
          <div className="cursor-pointer" onClick={() => { setMenuAktif('Home'); setWartaTerpilih(null); setKegiatanTerpilih(null); }}>
            <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-200 drop-shadow-md">
              HKBP Immanuel Metro Permata
            </h1>
            <p className="text-[11px] text-blue-200/80 uppercase font-bold tracking-widest mt-0.5">
              Sistem Informasi & Penata Layanan Warga Jemaat Digital
            </p>
          </div>
          <div className="flex items-center space-x-5">
            <span className="text-xs font-bold bg-white/10 backdrop-blur-md text-white border border-white/20 px-3 py-1.5 rounded-full">
              Status: {isLoggedIn ? (isAdmin ? '🔴 Admin Sekretariat' : '🟢 Jemaat Aktif') : '⚪ Tamu Jemaat'}
            </span>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 font-bold px-4 py-2 rounded-xl text-xs text-white transition shadow-md">
                Logout 🚪
              </button>
            ) : (
              <button onClick={() => { setTampilkanAuth(true); setIsRegistrasi(false); }} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 font-extrabold px-4 py-2 rounded-xl text-xs text-white transition shadow-md">
                Masuk / Daftar 🔑
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* MODAL AUTH */}
      {tampilkanAuth && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full relative">
            <button onClick={() => setTampilkanAuth(false)} className="absolute top-4 right-4 text-gray-400">✕</button>
            <form onSubmit={isRegistrasi ? handleRegistrasi : handleLogin} className="space-y-4">
              {isRegistrasi && <input type="text" required placeholder="Nama Lengkap" className="w-full p-2.5 border rounded-xl text-sm" value={authNama} onChange={(e) => setAuthNama(e.target.value)} />}
              <input type="email" required placeholder="Email Address" className="w-full p-2.5 border rounded-xl text-sm" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
              <input type="password" required placeholder="Password" className="w-full p-2.5 border