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

  // STATE DATA IURAN JEMAAT
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

  const handleUpdateIuran = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputWajib) { setIuranWajib(inputWajib); localStorage.setItem('iuran_wajib', inputWajib); }
    if (inputGotilon) { setToktokGotilon(inputGotilon); localStorage.setItem('iuran_gotilon', inputGotilon); }
    if (inputPembangunan) { setToktokPembangunan(inputPembangunan); localStorage.setItem('iuran_pembangunan', inputPembangunan); }
    if (inputDonasi) { setInfoDonasi(inputDonasi); localStorage.setItem('iuran_donasi', inputDonasi); }
    
    setInputWajib(''); setInputGotilon(''); setInputPembangunan(''); setInputDonasi('');
    alert('Ketetapan Iuran Jemaat Berhasil Diperbarui!');
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
      
      {/* ==================== NAVBAR HEADER (RESPONSIF MOBILE OK) ==================== */}
      <nav className="relative shadow-xl sticky top-0 z-50 bg-slate-950 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 relative z-10">
          <div className="text-center sm:text-left cursor-pointer" onClick={() => { setMenuAktif('Home'); setWartaTerpilih(null); setKegiatanTerpilih(null); }}>
            <h1 className="text-lg sm:text-xl font-black tracking-wider bg-gradient-to-r from-white via-blue-100 to-gray-200 text-transparent bg-clip-text">
              HKBP Immanuel Metro Permata
            </h1>
            <p className="text-[9px] sm:text-[10px] text-blue-300 font-bold tracking-widest mt-0.5 uppercase">Sistem Informasi & Penata Layanan Warga Jemaat Digital</p>
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-center sm:justify-end">
            <span className="text-[9px] sm:text-[10px] font-bold bg-white/10 text-white border border-white/20 px-2.5 py-1 rounded-full whitespace-nowrap">Status: {isLoggedIn ? (isAdmin ? '🔴 Admin' : '🟢 Jemaat') : '⚪ Tamu'}</span>
            {isLoggedIn ? ( 
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 font-bold px-3 py-1 rounded-lg text-xs text-white transition whitespace-nowrap">Logout 🚪</button> 
            ) : ( 
              <button onClick={() => { setTampilkanAuth(true); setIsRegistrasi(false); }} className="bg-emerald-500 hover:bg-emerald-600 font-extrabold px-3 py-1 rounded-lg text-xs text-white transition whitespace-nowrap">Masuk / Daftar 🔑</button> 
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
              <input type="password" required placeholder="Password" className="w-full p-2.5 border rounded-xl text-sm" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} />
              <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold">{isRegistrasi ? 'Daftar' : 'Masuk'}</button>
            </form>
            <button onClick={() => setIsRegistrasi(!isRegistrasi)} className="text-xs text-blue-600 mt-4 block text-center w-full">{isRegistrasi ? 'Ke Halaman Masuk' : 'Ke Halaman Daftar'}</button>
          </div>
        </div>
      )}

      {/* ==================== GRID KONTEN LAYOUT (DINAMIS LAPTOP vs MOBILE) ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM UTAMA */}
        <div className="lg:col-span-2 space-y-6">
          
          {menuAktif === 'Home' && (
            <>
              {/* BANNER WELCOME */}
              <div className="bg-gradient-to-r from-blue-700 to-indigo-600 rounded-2xl p-5 sm:p-6 text-white shadow-md">
                <span className="text-[10px] font-bold uppercase bg-blue-500/40 px-2.5 py-0.5 rounded-full tracking-wider">{isLoggedIn ? (isAdmin ? '👑 Administrator' : '⛪ Laman Jemaat') : '👋 Horas'}</span>
                <h2 className="text-xl sm:text-2xl font-extrabold mt-2">Selamat Datang, {namaUser}!</h2>
              </div>

              {/* PHOTO GALLERY VIEW BOX */}
              <div className="space-y-3">
                <div className="w-full relative bg-gray-900 rounded-2xl h-48 sm:h-64 overflow-hidden border border-gray-200 shadow-sm">
                  {gambarUtama && <img src={gambarUtama} alt="Citra Altar HKBP" className="w-full h-full object-cover opacity-85" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 sm:p-5 flex flex-col justify-end">
                    <h3 className="text-white font-extrabold text-sm sm:text-lg tracking-wide">Gereja HKBP Immanuel Metro Permata</h3>
                    <p className="text-gray-300 text-[10px] sm:text-[11px] mt-0.5 max-w-md font-light leading-relaxed">"Satu Tuhan, Satu Iman, Satu Baptisan. Melayani jemaat dengan penuh ketulusan dan berlandaskan kasih Kristus."</p>
                  </div>
                </div>
                {/* Baris Miniatur Gambar */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {listGaleri.map((foto, index) => (
                    <div key={index} onClick={() => setGambarUtama(foto)} className={`h-12 sm:h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition ${foto === gambarUtama ? 'border-blue-600 scale-95 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}><img src={foto} alt={`Koleksi ${index + 1}`} className="w-full h-full object-cover" /></div>
                  ))}
                </div>
              </div>

              {/* INPUT ADMIN TAMBAH MEDIA */}
              {isAdmin && (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                  <div><h4 className="font-bold text-amber-900">Media Admin: Tambah Koleksi Gambar</h4><p className="text-[10px] text-amber-700">Unggah citra sejenis di bawah 1.5MB.</p></div>
                  <label className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg cursor-pointer transition">📁 Upload Foto<input type="file" accept="image/*" className="hidden" onChange={handleUploadKeGaleri} /></label>
                </div>
              )}

              {/* PANEL APPROVAL ADMIN */}
              {isAdmin && (
                <div className="bg-red-50 p-5 rounded-2xl border border-red-200 shadow-sm text-xs">
                  <h2 className="text-sm font-bold text-red-900 mb-3 flex items-center"><span className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-ping"></span>🔒 Approval Akun Jemaat</h2>
                  {listPendaftar.filter((u: any) => u.status === 'PENDING').length === 0 ? ( <p className="text-gray-500 italic">Tidak ada permohonan aktif.</p> ) : (
                    <div className="space-y-2">
                      {listPendaftar.filter((u: any) => u.status === 'PENDING').map((jemaat: any) => (
                        <div key={jemaat.id} className="bg-white p-3 rounded-xl border border-red-100 flex justify-between items-center">
                          <div><p className="font-bold text-gray-800">{jemaat.nama}</p><p className="text-[10px] text-gray-400">📧 {jemaat.email}</p></div>
                          <button onClick={() => handleApproveJemaat(jemaat.id)} className="bg-green-600 text-white font-black px-2.5 py-1 rounded-md">✓ Setujui</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ==================== MENU LAYANAN GEREJA (OTOMATIS BERADAPTASI MOBILE vs LAPTOP) ==================== */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-base sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-1.5 h-5 bg-blue-600 rounded-full mr-2"></span> Layanan Jemaat & Gereja
                </h2>
                {/* Di HP otomatis mengelompok grid 2 kolom, di laptop berjejer 5 kolom */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
                  <div onClick={() => { setMenuAktif('Kegiatan'); setKegiatanTerpilih(null); }} className="flex flex-col items-center p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 transition">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center text-lg">📅</div>
                    <span className="text-[11px] sm:text-xs text-gray-700 mt-2 font-bold">Kegiatan</span>
                  </div>
                  <div onClick={() => { setMenuAktif('Warta'); setWartaTerpilih(null); }} className="flex flex-col items-center p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-green-50 transition">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center text-lg">📖</div>
                    <span className="text-[11px] sm:text-xs text-gray-700 mt-2 font-bold">Warta</span>
                  </div>

                  {/* TOMBOL IURAN */}
                  <div onClick={() => setMenuAktif('Iuran')} className="flex flex-col items-center p-3 bg-amber-50 rounded-xl cursor-pointer hover:bg-amber-100 border border-amber-200 transition">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-200 text-amber-800 rounded-xl flex items-center justify-center text-lg">💰</div>
                    <span className="text-[11px] sm:text-xs text-amber-900 mt-2 font-black">Iuran Jemaat</span>
                  </div>

                  <div onClick={() => setMenuAktif('Formulir')} className="flex flex-col items-center p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-purple-50 transition">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center text-lg">📝</div>
                    <span className="text-[11px] sm:text-xs text-gray-700 mt-2 font-bold">Formulir</span>
                  </div>
                  <div onClick={() => alert('Gedung GSG siap digunakan')} className="flex flex-col items-center p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-sky-50 transition col-span-2 sm:col-span-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-100 rounded-xl flex items-center justify-center text-lg">🏠</div>
                    <span className="text-[11px] sm:text-xs text-gray-700 mt-2 font-bold">Gedung GSG</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SUB-MENU: IURAN JEMAAT */}
          {menuAktif === 'Iuran' && (
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-5 text-xs sm:text-sm">
              <button onClick={() => setMenuAktif('Home')} className="text-xs text-amber-700 font-bold mb-1 block">← Kembali ke Beranda</button>
              <div>
                <h2 className="text-xl font-black text-gray-800">🪙 Ketetapan Iuran Resmi Warga Jemaat</h2>
                <p className="text-[11px] text-gray-400 mt-0.5">Rincian kewajiban iuran untuk tertib administrasi di HKBP Immanuel Metro Permata.</p>
              </div>

              {isAdmin && (
                <form onSubmit={handleUpdateIuran} className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3 text-xs">
                  <h3 className="font-black text-amber-950 uppercase border-b pb-1">✍️ Editor Keuangan Sekretariat</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" placeholder="Iuran Bulanan" className="p-2 border rounded-lg bg-white" value={inputWajib} onChange={(e) => setInputWajib(e.target.value)} />
                    <input type="text" placeholder="Toktok Ripe Gotilon" className="p-2 border rounded-lg bg-white" value={inputGotilon} onChange={(e) => setInputGotilon(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" placeholder="Toktok Ripe Pembangunan" className="p-2 border rounded-lg bg-white" value={inputPembangunan} onChange={(e) => setInputPembangunan(e.target.value)} />
                    <input type="text" placeholder="Info Rekening" className="p-2 border rounded-lg bg-white" value={inputDonasi} onChange={(e) => setInputDonasi(e.target.value)} />
                  </div>
                  <button type="submit" className="bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs">Simpan Perubahan</button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border bg-gray-50/50"><span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Rutin</span><h4 className="font-bold text-gray-800 text-xs mt-1">Iuran Bulanan Wajib</h4><p className="text-base font-black text-gray-900 mt-1">{iuranWajib}</p></div>
                <div className="p-3.5 rounded-xl border bg-gray-50/50"><span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Tahunan</span><h4 className="font-bold text-gray-800 text-xs mt-1">Toktok Ripe Gotilon</h4><p className="text-base font-black text-gray-900 mt-1">{toktokGotilon}</p></div>
                <div className="p-3.5 rounded-xl border bg-gray-50/50"><span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">Dana Taktis</span><h4 className="font-bold text-gray-800 text-xs mt-1">Toktok Ripe Pembangunan</h4><p className="text-base font-black text-gray-900 mt-1">{toktokPembangunan}</p></div>
                <div className="p-3.5 rounded-xl border bg-gray-50/50"><span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Persembahan</span><h4 className="font-bold text-gray-800 text-xs mt-1">Donasi & Sumbangan</h4><p className="text-[11px] font-medium text-gray-600 mt-1 whitespace-pre-line">{infoDonasi}</p></div>
              </div>
            </div>
          )}

          {/* SUB-MENU: KEGIATAN */}
          {menuAktif === 'Kegiatan' && (
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <button onClick={() => { setMenuAktif('Home'); setKegiatanTerpilih(null); }} className="text-xs text-blue-600 font-semibold mb-3 block">← Kembali ke Beranda</button>
              {!kegiatanTerpilih ? (
                <>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">📅 Kalender Jadwal Kegiatan</h2>
                  {isAdmin && (
                    <form onSubmit={handleTambahKegiatan} className="mb-5 p-4 bg-blue-50 rounded-xl space-y-3 text-xs">
                      <input type="text" required placeholder="Nama Kegiatan" className="w-full p-2 border rounded-lg" value={inputKegNama} onChange={(e) => setInputKegNama(e.target.value)} />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" required placeholder="Tanggal" className="p-2 border rounded-lg" value={inputKegTanggal} onChange={(e) => setInputKegTanggal(e.target.value)} />
                        <input type="text" required placeholder="Jam" className="p-2 border rounded-lg" value={inputKegJam} onChange={(e) => setInputKegJam(e.target.value)} />
                      </div>
                      <button type="submit" className="bg-blue-600 text-white font-bold px-3 py-1.5 rounded-md">Terbitkan Jadwal</button>
                    </form>
                  )}
                  <div className="space-y-3">
                    {listKegiatan.map((keg) => (
                      <div key={keg.id} onClick={() => { setKegiatanTerpilih(keg); if(!sudahDibaca.includes(keg.id)){ setSudahDibaca([...sudahDibaca, keg.id]); } }} className="p-3 bg-gray-50 rounded-xl flex justify-between items-center border border-gray-100 hover:border-blue-400 cursor-pointer transition text-xs">
                        <div><h4 className="font-bold text-gray-800">{keg.nama}</h4><p className="text-[10px] text-gray-500 mt-0.5">🗓️ {keg.tanggal} | ⏰ {keg.jam}</p></div>
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-bold">Buka ➔</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-4 text-xs">
                  <button onClick={() => setKegiatanTerpilih(null)} className="text-blue-600 font-semibold mb-1 block">← Kembali ke Jadwal</button>
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2">{kegiatanTerpilih.nama}</h3>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100"><p className="text-gray-700 whitespace-pre-line leading-relaxed">{kegiatanTerpilih.deskripsi}</p></div>
                </div>
              )}
            </div>
          )}

          {/* SUB-MENU: WARTA */}
          {menuAktif === 'Warta' && (
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <button onClick={() => { setMenuAktif('Home'); setWartaTerpilih(null); }} className="text-xs text-green-600 font-semibold mb-3 block">← Kembali ke Beranda</button>
              {!wartaTerpilih ? (
                <>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">📖 Berita & Warta Jemaat</h2>
                  {isAdmin && (
                    <form onSubmit={handleTambahWarta} className="mb-5 p-4 bg-green-50 rounded-xl space-y-3 text-xs">
                      <input type="text" required placeholder="Judul Warta" className="w-full p-2 border rounded-lg" value={inputWartaJudul} onChange={(e) => setInputWartaJudul(e.target.value)} />
                      <textarea rows={3} placeholder="Tingting Na Marragam..." className="w-full p-2 border rounded-lg" value={inputTingting} onChange={(e) => setInputTingting(e.target.value)} />
                      <button type="submit" className="bg-green-600 text-white font-bold px-3 py-1.5 rounded-md">Terbitkan Warta</button>
                    </form>
                  )}
                  <div className="space-y-3">
                    {listWarta.map((warta) => (
                      <div key={warta.id} onClick={() => { setWartaTerpilih(warta); if(!sudahDibaca.includes(warta.id)){ setSudahDibaca([...sudahDibaca, warta.id]); } }} className="p-3 bg-gray-50 rounded-xl flex justify-between items-center border border-gray-100 hover:border-green-400 cursor-pointer transition text-xs">
                        <p className="font-semibold text-gray-800">{warta.judul}</p><span className="text-gray-400">➔</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-4 text-xs">
                  <button onClick={() => setWartaTerpilih(null)} className="text-green-600 font-semibold mb-1 block">← Kembali ke Daftar</button>
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2">{wartaTerpilih.judul}</h3>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"><p className="text-gray-700 whitespace-pre-line leading-relaxed">{wartaTerpilih.tingtingMarragam}</p></div>
                </div>
              )}
            </div>
          )}

          {/* SUB-MENU: FORMULIR */}
          {menuAktif === 'Formulir' && (
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <button onClick={() => setMenuAktif('Home')} className="text-xs text-blue-600 font-semibold mb-3 block">← Kembali ke Beranda</button>
              <h2 className="text-xl font-bold text-gray-800 mb-4">📝 Pengajuan Berkas & Formulir</h2>
              <p className="text-xs text-gray-400">Menu pengajuan berkas jemaat sedang disiapkan oleh sekretariat.</p>
            </div>
          )}

        </div>

        {/* ==================== SIDEBAR KANAN (DI MOBILE OTOMATIS TURUN KE BAWAH) ==================== */}
        <div className="lg:col-span-1">
          <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 lg:sticky lg:top-24">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center">
                <span className="w-1.5 h-5 bg-amber-500 rounded-full mr-2"></span> Berita Terbaru
              </h2>
              <span className="text-lg animate-bounce">🔔</span>
            </div>
            
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-0.5">
              {sidebarPengumuman.map((item: any) => {
                const belumKlik = !sudahDibaca.includes(item.id);
                return (
                  <div 
                    key={`${item.tipe}-${item.id}`} 
                    onClick={() => handleKlikPengumuman(item)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition transform hover:-translate-y-0.5 text-xs ${
                      belumKlik ? 'bg-amber-50 border-amber-400 shadow-sm ring-2 ring-amber-300/20' : 'bg-gray-50 border-gray-100 opacity-85' 
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wider ${item.tipe === 'WARTA' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{item.tipe}</span>
                      {belumKlik ? <span className="text-[8px] bg-red-500 text-white font-black px-1.5 py-0.5 rounded animate-pulse">🔴 BARU</span> : <span className="text-[8px] text-gray-400 font-medium">✓ Dibaca</span>}
                    </div>
                    <p className={`text-xs mt-1.5 leading-snug ${belumKlik ? 'font-black text-amber-950' : 'font-medium text-gray-600'}`}>{item.teks}</p>
                    <span className="text-[10px] text-gray-400 block mt-1.5">⏱️ {item.info}</span>
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