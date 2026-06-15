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

  // STATE GALERI FOTO HKBP
  const [listGaleri, setListGaleri] = useState<string[]>([
    "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1200&q=80", 
    "https://images.unsplash.com/photo-1545242187-f9c274931f9a?auto=format&fit=crop&w=1200&q=80", 
    "https://images.unsplash.com/photo-1515516969-d4008cc6241a?auto=format&fit=crop&w=1200&q=80", 
    "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=1200&q=80"
  ]);
  const [gambarUtama, setGambarUtama] = useState<string>("");

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

  // ==================== 💰 STATE BARU: DATA IURAN JEMAAT ====================
  const [iuranWajib, setIuranWajib] = useState('Rp 50.000 / Bulan');
  const [toktokGotilon, setToktokGotilon] = useState('Rp 250.000 / KK (Tahun 2026)');
  const [toktokPembangunan, setToktokPembangunan] = useState('Rp 300.000 / KK');
  const [infoDonasi, setInfoDonasi] = useState('Transfer Mandiri Rek: 165-00-xxxx-xxxx a/n HKBP Metro Permata');

  // State Input Form Iuran Admin
  const [inputWajib, setInputWajib] = useState('');
  const [inputGotilon, setInputGotilon] = useState('');
  const [inputPembangunan, setInputPembangunan] = useState('');
  const [inputDonasi, setInputDonasi] = useState('');

  // STATE SIDEBAR & INTERAKSI
  const [sidebarPengumuman, setSidebarPengumuman] = useState<any[]>([]);
  const [wartaTerpilih, setWartaTerpilih] = useState<any>(null);
  const [kegiatanTerpilih, setKegiatanTerpilih] = useState<any>(null);
  const [sudahDibaca, setSudahDibaca] = useState<number[]>([]);

  // State Input Form Kegiatan & Warta
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

    if(localStorage.getItem('kegiatan_hkbp')) setListKegiatan(JSON.parse(localStorage.getItem('kegiatan_hkbp')!));
    if(localStorage.getItem('warta_hkbp')) setListWarta(JSON.parse(localStorage.getItem('warta_hkbp')!));
    if(localStorage.getItem('pengumuman_dibaca')) setSudahDibaca(JSON.parse(localStorage.getItem('pengumuman_dibaca')!));

    // Muat data iuran jemaat lokal
    if(localStorage.getItem('iuran_wajib')) setIuranWajib(localStorage.getItem('iuran_wajib')!);
    if(localStorage.getItem('iuran_gotilon')) setToktokGotilon(localStorage.getItem('iuran_gotilon')!);
    if(localStorage.getItem('iuran_pembangunan')) setToktokPembangunan(localStorage.getItem('iuran_pembangunan')!);
    if(localStorage.getItem('iuran_donasi')) setInfoDonasi(localStorage.getItem('iuran_donasi')!);

    const galeriLokal = localStorage.getItem('hkbp_koleksi_galeri');
    if (galeriLokal) {
      const parsed = JSON.parse(galeriLokal);
      setListGaleri(parsed);
      setGambarUtama(parsed[0]);
    } else {
      setGambarUtama(listGaleri[0]);
    }

    ambilDatabaseJemaat();
    refreshSidebar();
  }, []);

  // FUNGSI UPDATE DATA IURAN OLEH ADMIN
  const handleUpdateIuran = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputWajib) { setIuranWajib(inputWajib); localStorage.setItem('iuran_wajib', inputWajib); }
    if (inputGotilon) { setToktokGotilon(inputGotilon); localStorage.setItem('iuran_gotilon', inputGotilon); }
    if (inputPembangunan) { setToktokPembangunan(inputPembangunan); localStorage.setItem('iuran_pembangunan', inputPembangunan); }
    if (inputDonasi) { setInfoDonasi(inputDonasi); localStorage.setItem('iuran_donasi', inputDonasi); }
    
    setInputWajib(''); setInputGotilon(''); setInputPembangunan(''); setInputDonasi('');
    alert('Tarif Ketetapan Iuran Jemaat Berhasil Diperbarui!');
  };

  const handleUploadKeGaleri = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 1500000) { alert("Ukuran file maksimal 1.5 MB."); return; }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const updatedGaleri = [...listGaleri, base64String];
        setListGaleri(updatedGaleri);
        localStorage.setItem('hkbp_koleksi_galeri', JSON.stringify(updatedGaleri));
        setGambarUtama(base64String);
        alert("Foto berhasil ditambahkan!");
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
      setIsAdmin(true); setIsLoggedIn(true); setNamaUser('Admin Sekretariat');
      localStorage.setItem('hkbp_session_user', 'Admin Sekretariat'); localStorage.setItem('hkbp_session_role', 'admin');
      setTampilkanAuth(false); alert('Selamat Datang Admin!'); return;
    }
    const userLokal = localStorage.getItem('hkbp_database_jemaat');
    const databaseJemaat = userLokal ? JSON.parse(userLokal) : [];
    const cocok = databaseJemaat.find((u: any) => u.email === authEmail && u.password === authPassword);
    if (cocok) {
      if (cocok.status === 'PENDING') { alert('❌ Akun Anda belum disetujui Admin.'); return; }
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
      
      {/* ==================== NAVBAR HEADER GLASSMORPHISM ==================== */}
      <nav className="relative shadow-xl sticky top-0 z-50 bg-slate-950 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative z-10">
          <div className="cursor-pointer" onClick={() => { setMenuAktif('Home'); setWartaTerpilih(null); setKegiatanTerpilih(null); }}>
            <h1 className="text-xl font-black tracking-wider bg-gradient-to-r from-white via-blue-100 to-gray-200 text-transparent bg-clip-text">
              HKBP Immanuel Metro Permata
            </h1>
            <p className="text-[10px] text-blue-300 font-bold tracking-widest mt-0.5 uppercase">Sistem Informasi & Penata Layanan Warga Jemaat Digital</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-[10px] font-bold bg-white/10 text-white border border-white/20 px-3 py-1 rounded-full">Status: {isLoggedIn ? (isAdmin ? '🔴 Admin' : '🟢 Jemaat') : '⚪ Tamu'}</span>
            {isLoggedIn ? ( <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 font-bold px-3 py-1.5 rounded-lg text-xs text-white transition">Logout 🚪</button> ) : ( <button onClick={() => { setTampilkanAuth(true); setIsRegistrasi(false); }} className="bg-emerald-500 hover:bg-emerald-600 font-extrabold px-3 py-1.5 rounded-lg text-xs text-white transition">Masuk / Daftar 🔑</button> )}
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
              <input type="password" required placeholder="Password" className="w-full p-2.5 border rounded-xl text-sm" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} />
              <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold">{isRegistrasi ? 'Daftar' : 'Masuk'}</button>
            </form>
            <button onClick={() => setIsRegistrasi(!isRegistrasi)} className="text-xs text-blue-600 mt-4 block text-center w-full">{isRegistrasi ? 'Ke Halaman Masuk' : 'Ke Halaman Daftar'}</button>
          </div>
        </div>
      )}

      {/* ==================== KONTEN LAYOUT GRID ==================== */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM UTAMA (KIRI-TENGAH) */}
        <div className="lg:col-span-2 space-y-8">
          
          {menuAktif === 'Home' && (
            <>
              {/* BANNER WELCOME */}
              <div className="bg-gradient-to-r from-blue-700 to-indigo-600 rounded-2xl p-6 text-white shadow-md">
                <span className="text-xs font-bold uppercase bg-blue-500/40 px-3 py-1 rounded-full tracking-wider">{isLoggedIn ? (isAdmin ? '👑 Administrator' : '⛪ Laman Jemaat') : '👋 Horas'}</span>
                <h2 className="text-2xl font-extrabold mt-3">Selamat Datang, {namaUser}!</h2>
              </div>

              {/* PHOTO PREVIEW BOX */}
              <div className="space-y-4">
                <div className="w-full relative bg-gray-900 rounded-2xl h-64 overflow-hidden border border-gray-200 shadow-sm">
                  {gambarUtama && <img src={gambarUtama} alt="Citra Altar HKBP" className="w-full h-full object-cover opacity-85" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-5 flex flex-col justify-end">
                    <h3 className="text-white font-extrabold text-lg tracking-wide">Gereja HKBP Immanuel Metro Permata</h3>
                    <p className="text-gray-300 text-[11px] mt-1 max-w-md font-light leading-relaxed">"Satu Tuhan, Satu Iman, Satu Baptisan. Melayani jemaat dengan penuh ketulusan dan berlandaskan kasih Kristus."</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {listGaleri.map((foto, index) => (
                    <div key={index} onClick={() => setGambarUtama(foto)} className={`h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition ${foto === gambarUtama ? 'border-blue-600 scale-95 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}><img src={foto} alt={`Koleksi ${index + 1}`} className="w-full h-full object-cover" /></div>
                  ))}
                </div>
              </div>

              {/* INPUT ADMIN TAMBAH MEDIA */}
              {isAdmin && (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div><h4 className="text-xs font-bold text-amber-900">Media Admin: Tambah Koleksi Gambar</h4><p className="text-[10px] text-amber-700">Unggah citra sejenis di bawah 1.5MB.</p></div>
                  <label className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold px-4 py-2 rounded-lg cursor-pointer transition">📁 Upload Foto<input type="file" accept="image/*" className="hidden" onChange={handleUploadKeGaleri} /></label>
                </div>
              )}

              {/* PANEL APPROVAL ADMIN */}
              {isAdmin && (
                <div className="bg-red-50 p-6 rounded-2xl border border-red-200 shadow-sm">
                  <h2 className="text-lg font-bold text-red-900 mb-4 flex items-center"><span className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-ping"></span>🔒 Approval Akun Jemaat</h2>
                  {listPendaftar.filter((u: any) => u.status === 'PENDING').length === 0 ? ( <p className="text-xs text-gray-500 italic">Tidak ada permohonan aktif.</p> ) : (
                    <div className="space-y-3">
                      {listPendaftar.filter((u: any) => u.status === 'PENDING').map((jemaat: any) => (
                        <div key={jemaat.id} className="bg-white p-4 rounded-xl border border-red-100 flex justify-between items-center">
                          <div><p className="text-sm font-bold text-gray-800">{jemaat.nama}</p><p className="text-xs text-gray-400">📧 {jemaat.email}</p></div>
                          <button onClick={() => handleApproveJemaat(jemaat.id)} className="bg-green-600 text-white text-xs font-black px-3 py-1.5 rounded-lg">✓ Setujui</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ==================== LAYANAN GEREJA (5 MENU TERMASUK IURAN JEMAAT) ==================== */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-2"></span> Layanan Jemaat & Gereja
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  <div onClick={() => { setMenuAktif('Kegiatan'); setKegiatanTerpilih(null); }} className="flex flex-col items-center p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 transition">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-xl">📅</div>
                    <span className="text-xs text-gray-700 mt-2.5 font-bold">Kegiatan</span>
                  </div>
                  <div onClick={() => { setMenuAktif('Warta'); setWartaTerpilih(null); }} className="flex flex-col items-center p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-green-50 transition">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-xl">📖</div>
                    <span className="text-xs text-gray-700 mt-2.5 font-bold">Warta</span>
                  </div>

                  {/* 💰 MENU BARU: IURAN JEMAAT */}
                  <div onClick={() => setMenuAktif('Iuran')} className="flex flex-col items-center p-3 bg-amber-50 rounded-xl cursor-pointer hover:bg-amber-100/70 border border-amber-200 transition">
                    <div className="w-12 h-12 bg-amber-200 text-amber-800 rounded-xl flex items-center justify-center text-xl">💰</div>
                    <span className="text-xs text-amber-900 mt-2.5 font-black">Iuran Jemaat</span>
                  </div>

                  <div onClick={() => setMenuAktif('Formulir')} className="flex flex-col items-center p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-purple-50 transition">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-xl">📝</div>
                    <span className="text-xs text-gray-700 mt-2.5 font-bold">Formulir</span>
                  </div>
                  <div onClick={() => alert('Gedung GSG siap digunakan')} className="flex flex-col items-center p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-sky-50 transition">
                    <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-xl">🏠</div>
                    <span className="text-xs text-gray-700 mt-2.5 font-bold">Gedung GSG</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ==================== SUB-MENU BARU: HALAMAN TARIF IURAN JEMAAT HKBP ==================== */}
          {menuAktif === 'Iuran' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <button onClick={() => setMenuAktif('Home')} className="text-sm text-amber-700 font-bold mb-2 block">← Kembali ke Beranda</button>
              
              <div>
                <h2 className="text-2xl font-black text-gray-800 flex items-center">🪙 Daftar Ketetapan Iuran Resmi Warga Jemaat</h2>
                <p className="text-xs text-gray-400 mt-1">Berikut adalah rincian kewajiban iuran pusat/daerah untuk tertib administrasi di HKBP Immanuel Metro Permata.</p>
              </div>

              {/* PANEL ADMIN: UNTUK MERUBAH NOMINAL TARIF IURAN */}
              {isAdmin && (
                <form onSubmit={handleUpdateIuran} className="p-5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-4">
                  <h3 className="text-xs font-black text-amber-950 uppercase border-b pb-1.5">✍️ Editor Keuangan Sekretariat (Admin Only)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">IURAN BULANAN WAJIB</label>
                      <input type="text" placeholder="e.g. Rp 50.000 / Bulan" className="w-full p-2 text-xs border rounded-lg bg-white" value={inputWajib} onChange={(e) => setInputWajib(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">TOKTOK RIPE GOTILON (PESTA PANEN)</label>
                      <input type="text" placeholder="e.g. Rp 250.000 / KK" className="w-full p-2 text-xs border rounded-lg bg-white" value={inputGotilon} onChange={(e) => setInputGotilon(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">TOKTOK RIPE PEMBANGUNAN</label>
                      <input type="text" placeholder="e.g. Rp 300.000 / KK" className="w-full p-2 text-xs border rounded-lg bg-white" value={inputPembangunan} onChange={(e) => setInputPembangunan(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">INFORMASI REKENING DONASI</label>
                      <input type="text" placeholder="e.g. Rek Mandiri: xxxx" className="w-full p-2 text-xs border rounded-lg bg-white" value={inputDonasi} onChange={(e) => setInputDonasi(e.target.value)} />
                    </div>
                  </div>
                  <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-sm">
                    Simpan & Perbarui Ketetapan
                  </button>
                </form>
              )}

              {/* GRID TAMPILAN KARTU IURAN UNTUK JEMAAT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Kewajiban Rutin</span>
                  <h4 className="font-bold text-gray-800 text-sm mt-2">Iuran Bulanan Wajib</h4>
                  <p className="text-xl font-black text-gray-900 mt-2">{iuranWajib}</p>
                </div>

                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Kewajiban Tahunan</span>
                  <h4 className="font-bold text-gray-800 text-sm mt-2">Toktok Ripe Gotilon (Pesta Puncak)</h4>
                  <p className="text-xl font-black text-gray-900 mt-2">{toktokGotilon}</p>
                </div>

                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-2 py-0.5 rounded">Dana Taktis</span>
                  <h4 className="font-bold text-gray-800 text-sm mt-2">Toktok Ripe Pembangunan</h4>
                  <p className="text-xl font-black text-gray-900 mt-2">{toktokPembangunan}</p>
                </div>

                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Sukarela / Persembahan</span>
                  <h4 className="font-bold text-gray-800 text-sm mt-2">Donasi & Sumpahan Tangan Lain</h4>
                  <p className="text-xs font-medium text-gray-600 mt-2 leading-relaxed whitespace-pre-line">{infoDonasi}</p>
                </div>
              </div>
            </div>
          )}

          {/* SUB-MENU: KEGIATAN */}
          {menuAktif === 'Kegiatan' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <button onClick={() => { setMenuAktif('Home'); setKegiatanTerpilih(null); }} className="text-sm text-blue-600 font-semibold mb-4 block">← Kembali ke Beranda</button>
              {!kegiatanTerpilih ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 Kalender & Jadwal Kegiatan</h2>
                  {isAdmin && (
                    <form onSubmit={handleTambahKegiatan} className="mb-8 p-5 bg-blue-50 rounded-xl space-y-4 border border-blue-100">
                      <input type="text" required placeholder="Nama Kegiatan" className="w-full p-2 border rounded-lg text-sm bg-white" value={inputKegNama} onChange={(e) => setInputKegNama(e.target.value)} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" required placeholder="Tanggal" className="p-2 border rounded-lg text-sm bg-white" value={inputKegTanggal} onChange={(e) => setInputKegTanggal(e.target.value)} />
                        <input type="text" required placeholder="Jam" className="p-2 border rounded-lg text-sm bg-white" value={inputKegJam} onChange={(e) => setInputKegJam(e.target.value)} />
                      </div>
                      <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-xs font-bold">Terbitkan Jadwal</button>
                    </form>
                  )}
                  <div className="space-y-4">
                    {listKegiatan.map((keg) => (
                      <div key={keg.id} onClick={() => { setKegiatanTerpilih(keg); if(!sudahDibaca.includes(keg.id)){ setSudahDibaca([...sudahDibaca, keg.id]); } }} className="p-4 bg-gray-50 rounded-xl flex justify-between items-center border border-gray-100 hover:border-blue-400 cursor-pointer transition">
                        <div><h4 className="font-bold text-gray-800">{keg.nama}</h4><p className="text-xs text-gray-500 mt-1">🗓️ {keg.tanggal} | ⏰ {keg.jam}</p></div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">Buka Details ➔</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white p-2 rounded-xl space-y-6">
                  <button onClick={() => setKegiatanTerpilih(null)} className="text-sm text-blue-600 font-semibold mb-2 block">← Kembali ke Jadwal</button>
                  <h3 className="text-2xl font-bold text-gray-900 border-b pb-3">{kegiatanTerpilled.nama}</h3>
                  <div className="bg-blue-50 p-5 rounded-xl border border-blue-100"><p className="text-gray-700 text-sm whitespace-pre-line">{kegiatanTerpilih.deskripsi}</p></div>
                </div>
              )}
            </div>
          )}

          {/* SUB-MENU: WARTA */}
          {menuAktif === 'Warta' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <button onClick={() => { setMenuAktif('Home'); setWartaTerpilih(null); }} className="text-sm text-green-600 font-semibold mb-4 block">← Kembali ke Beranda</button>
              {!wartaTerpilih ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">📖 Berita & Warta Jemaat Resmi</h2>
                  {isAdmin && (
                    <form onSubmit={handleTambahWarta} className="mb-8 p-6 bg-green-50 rounded-xl space-y-4 border border-green-100">
                      <input type="text" required placeholder="Warta Jemaat - Minggu 21 Juni 2026" className="w-full p-2 border rounded-lg text-sm bg-white" value={inputWartaJudul} onChange={(e) => setInputWartaJudul(e.target.value)} />
                      <textarea rows={3} placeholder="Tingting Na Marragam..." className="w-full p-2 border rounded-lg text-sm bg-white" value={inputTingting} onChange={(e) => setInputTingting(e.target.value)} />
                      <button type="submit" className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-xs font-bold">Terbitkan Warta</button>
                    </form>
                  )}
                  <div className="space-y-4">
                    {listWarta.map((warta) => (
                      <div key={warta.id} onClick={() => { setWartaTerpilih(warta); if(!sudahDibaca.includes(warta.id)){ setSudahDibaca([...sudahDibaca, warta.id]); } }} className="p-4 bg-gray-50 rounded-xl flex justify-between items-center border border-gray-100 hover:border-green-400 cursor-pointer transition">
                        <p className="font-semibold text-gray-800">{warta.judul}</p><span className="text-xl text-gray-400">➔</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white p-2 rounded-xl space-y-6">
                  <button onClick={() => setWartaTerpilih(null)} className="text-sm text-green-600 font-semibold mb-2 block">← Kembali ke Daftar</button>
                  <h3 className="text-2xl font-bold text-gray-900 border-b pb-3">{wartaTerpilih.judul}</h3>
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"><p className="text-gray-700 text-sm whitespace-pre-line">{wartaTerpilih.tingtingMarragam}</p></div>
                </div>
              )}
            </div>
          )}

          {/* SUB-MENU: FORMULIR */}
          {menuAktif === 'Formulir' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <button onClick={() => setMenuAktif('Home')} className="text-sm text-blue-600 font-semibold mb-4 block">← Kembali ke Beranda</button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Pengajuan Berkas & Formulir</h2>
            </div>
          )}

        </div>

        {/* ==================== SIDEBAR KANAN ==================== */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 sticky top-24">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center"><span className="w-1.5 h-6 bg-amber-500 rounded-full mr-2"></span> Pengumuman Terbaru</h2>
              <span className="text-xl animate-bounce">🔔</span>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {sidebarPengumuman.map((item: any) => {
                const belumKlik = !sudahDibaca.includes(item.id);
                return (
                  <div 
                    key={`${item.tipe}-${item.id}`} 
                    onClick={() => handleKlikPengumuman(item)}
                    className={`p-4 rounded-xl border cursor-pointer transition duration-300 relative overflow-hidden transform hover:-translate-y-0.5 ${
                      belumKlik ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-300/40' : 'bg-gray-50 border-gray-100 opacity-80' 
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${item.tipe === 'WARTA' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{item.tipe}</span>
                      {belumKlik ? <span className="text-[9px] bg-red-500 text-white font-black px-1.5 py-0.5 rounded animate-pulse">🔴 BARU</span> : <span className="text-[9px] text-gray-400 font-medium">✓ Dibaca</span>}
                    </div>
                    <p className={`text-sm mt-2 leading-snug ${belumKlik ? 'font-black text-amber-950' : 'font-medium text-gray-600'}`}>{item.teks}</p>
                    <span className="text-xs text-gray-400 block mt-2">⏱️ {item.info}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}