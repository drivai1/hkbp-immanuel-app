"use client";

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [namaUser, setNamaUser] = useState('Tamu / Jemaat');
  const [menuAktif, setMenuAktif] = useState('Home');

  // STATE UNTUK HALAMAN LOGIN & REGISTRASI
  const [tampilkanAuth, setTampilkanAuth] = useState(false);
  const [isRegistrasi, setIsRegistrasi] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authNama, setAuthNama] = useState('');

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

  useEffect(() => {
    // Cek session login aktif di browser
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

    refreshSidebar();
  }, []);

  // FUNGSI PROSES REGISTRASI JEMAAT BARU
  const handleRegistrasi = (e: React.FormEvent) => {
    e.preventDefault();
    const userLokal = localStorage.getItem('hkbp_database_jemaat');
    const databaseJemaat = userLokal ? JSON.parse(userLokal) : [];

    // Cek apakah email sudah terdaftar
    const emailEksis = databaseJemaat.find((u: any) => u.email === authEmail);
    if (emailEksis) {
      alert('Email ini sudah terdaftar! Silakan langsung login.');
      return;
    }

    // Simpan user baru ke database lokal browser
    const userBaru = { nama: authNama, email: authEmail, password: authPassword };
    databaseJemaat.push(userBaru);
    localStorage.setItem('hkbp_database_jemaat', JSON.stringify(databaseJemaat));

    alert('Pendaftaran Berhasil! Silakan masuk menggunakan email Anda.');
    setIsRegistrasi(false); // Alihkan ke form login
  };

  // FUNGSI PROSES LOGIN (ADMIN & JEMAAT)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. CEK JIKA YANG LOGIN ADALAH ADMIN AKUN RESMI SECRETARIAT
    if (authEmail === 'admin@hkbp.com' && authPassword === 'admin123') {
      setIsAdmin(true);
      setIsLoggedIn(true);
      setNamaUser('Admin Sekretariat');
      localStorage.setItem('hkbp_session_user', 'Admin Sekretariat');
      localStorage.setItem('hkbp_session_role', 'admin');
      setTampilkanAuth(false);
      alert('Selamat Datang Kembali, Amang/Ina Admin!');
      return;
    }

    // 2. CEK JIKA YANG LOGIN ADALAH JEMAAT DARI DATABASE LOCALSTORAGE
    const userLokal = localStorage.getItem('hkbp_database_jemaat');
    const databaseJemaat = userLokal ? JSON.parse(userLokal) : [];
    
    const cocok = databaseJemaat.find((u: any) => u.email === authEmail && u.password === authPassword);

    if (cocok) {
      setIsAdmin(false);
      setIsLoggedIn(true);
      setNamaUser(cocok.nama);
      localStorage.setItem('hkbp_session_user', cocok.nama);
      localStorage.setItem('hkbp_session_role', 'jemaat');
      setTampilkanAuth(false);
      alert(`Login Berhasil! Selamat datang ${cocok.nama}`);
    } else {
      alert('Email atau Password salah! Periksa kembali ketikan Anda atau daftar akun baru.');
    }
  };

  // FUNGSI LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('hkbp_session_user');
    localStorage.removeItem('hkbp_session_role');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setNamaUser('Tamu / Jemaat');
    setMenuAktif('Home');
    setWartaTerpilih(null);
    setKegiatanTerpilih(null);
    alert('Anda telah keluar dari akun.');
  };

  const handleKlikPengumuman = (item: any) => {
    setMenuAktif(item.linkMenu);
    if (item.tipe === 'WARTA') { setWartaTerpilih(item); setKegiatanTerpilih(null); }
    else if (item.tipe === 'KEGIATAN') { setKegiatanTerpilih(item); setWartaTerpilih(null); }

    if (!sudahDibaca.includes(item.id)) {
      const updateDibaca = [...sudahDibaca, item.id];
      setSudahDibaca(updateDibaca);
      localStorage.setItem('pengumuman_dibaca', JSON.stringify(updateDibaca));
    }
  };

  const handleTambahKegiatan = (e: React.FormEvent) => {
    e.preventDefault();
    const dataBaru = [...listKegiatan, { id: Date.now(), nama: inputKegNama, tanggal: inputKegTanggal, jam: inputKegJam, lokasi: inputKegLokasi || 'Gereja', penanggungJawab: inputKegPj || 'Seksi Terkait', deskripsi: inputKegDeskripsi || '-' }];
    setListKegiatan(dataBaru);
    localStorage.setItem('kegiatan_hkbp', JSON.stringify(dataBaru));
    setInputKegNama(''); setInputKegTanggal(''); setInputKegJam(''); setInputKegLokasi(''); setInputKegPj(''); setInputKegDeskripsi('');
    refreshSidebar();
    alert('Jadwal Kegiatan Berhasil Diterbitkan!');
  };

  const handleTambahWarta = (e: React.FormEvent) => {
    e.preventDefault();
    const dataBaru = [{ id: Date.now(), judul: inputWartaJudul, tingtingMarragam: inputTingting, pemasukan: inputPemasukan || 'Rp 0', pengeluaran: inputPengeluaran || 'Rp 0', beritaDukacita: inputDukacita || '-' }, ...listWarta];
    setListWarta(dataBaru);
    localStorage.setItem('warta_hkbp', JSON.stringify(dataBaru));
    setInputWartaJudul(''); setInputTingting(''); setInputPemasukan(''); setInputPengeluaran(''); setInputDukacita('');
    refreshSidebar();
    alert('Warta Resmi berhasil diterbitkan!');
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans relative">
      
      {/* ==================== NAVBAR ==================== */}
      <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => { setMenuAktif('Home'); setWartaTerpilih(null); setKegiatanTerpilih(null); }}>
            <h1 className="text-2xl font-bold tracking-wide">HKBP Immanuel Metro Permata</h1>
            <p className="text-xs text-blue-100">Selamat Datang, <span className="font-bold underline">{namaUser}</span></p>
          </div>
          
          <div className="flex items-center space-x-6">
            <span className="text-sm font-medium bg-blue-700 px-3 py-1 rounded-full text-xs">
              Status: {isLoggedIn ? (isAdmin ? '🔴 Admin' : '🟢 Jemaat') : '⚪ Tamu'}
            </span>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition shadow-sm text-sm">
                <span>Keluar (Logout)</span> 🚪
              </button>
            ) : (
              <button onClick={() => { setTampilkanAuth(true); setIsRegistrasi(false); }} className="flex items-center space-x-2 bg-emerald-500 px-4 py-2 rounded-lg hover:bg-emerald-600 transition shadow-sm text-sm font-bold">
                <span>Masuk / Daftar Akun</span> 🔑
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ==================== POP-UP MODAL BOX: LOGIN & REGISTRASI ==================== */}
      {tampilkanAuth && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full relative border border-gray-100">
            <button onClick={() => setTampilkanAuth(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg">✕</button>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {isRegistrasi ? '📝 Daftar Akun Jemaat Baru' : '🔑 Masuk ke Aplikasi'}
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              {isRegistrasi ? 'Silakan lengkapi formulir pendaftaran warga jemaat.' : 'Gunakan akun terdaftar Anda atau email bawaan admin.'}
            </p>

            <form onSubmit={isRegistrasi ? handleRegistrasi : handleLogin} className="space-y-4">
              {isRegistrasi && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">NAMA LENGKAP</label>
                  <input type="text" required placeholder="Contoh: Boni Sihombing" className="w-full p-2.5 border rounded-xl text-sm bg-gray-50 focus:outline-blue-500" value={authNama} onChange={(e) => setAuthNama(e.target.value)} />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">EMAIL ADDRESS</label>
                <input type="email" required placeholder="nama@email.com" className="w-full p-2.5 border rounded-xl text-sm bg-gray-50 focus:outline-blue-500" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">PASSWORD</label>
                <input type="password" required placeholder="••••••••" className="w-full p-2.5 border rounded-xl text-sm bg-gray-50 focus:outline-blue-500" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition mt-6">
                {isRegistrasi ? 'Selesaikan Pendaftaran' : 'Verifikasi Akun & Masuk'}
              </button>
            </form>

            <div className="mt-6 text-center border-t border-gray-100 pt-4">
              <button 
                onClick={() => setIsRegistrasi(!isRegistrasi)} 
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                {isRegistrasi ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun jemaat? Daftar di sini'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== GRID KONTEN LAYOUT ==================== */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM UTAMA (KIRI-TENGAH) */}
        <div className="lg:col-span-2 space-y-8">
          {menuAktif === 'Home' && (
            <>
              <div className="w-full h-64 bg-sky-200 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center text-sky-800 font-semibold text-lg border border-sky-300">
                [ Foto HKBP Immanuel Metro Permata ]
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-2"></span> Layanan Gereja
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div onClick={() => { setMenuAktif('Kegiatan'); setKegiatanTerpilih(null); }} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 hover:shadow-md transition duration-200 group border border-gray-100">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition duration-200">📅</div>
                    <span className="text-sm text-gray-700 mt-3 font-semibold">Kegiatan</span>
                  </div>

                  <div onClick={() => { setMenuAktif('Warta'); setWartaTerpilih(null); }} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-green-50 hover:shadow-md transition duration-200 group border border-gray-100">
                    <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition duration-200">📖</div>
                    <span className="text-sm text-gray-700 mt-3 font-semibold">Warta</span>
                  </div>

                  <div onClick={() => setMenuAktif('Formulir')} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-purple-50 hover:shadow-md transition duration-200 group border border-gray-100">
                    <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition duration-200">📝</div>
                    <span className="text-sm text-gray-700 mt-3 font-semibold">Formulir</span>
                  </div>

                  <div onClick={() => alert('Fitur Gedung GSG sedang disiapkan')} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-amber-50 hover:shadow-md transition duration-200 group border border-gray-100">
                    <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition duration-200">🏠</div>
                    <span className="text-sm text-gray-700 mt-3 font-semibold">Gedung GSG</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SUB-MENU: KEGIATAN */}
          {menuAktif === 'Kegiatan' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <button onClick={() => { setMenuAktif('Home'); setKegiatanTerpilih(null); }} className="text-sm text-blue-600 font-semibold mb-4 block">← Kembali ke Beranda</button>
              
              {!kegiatanTerpilih ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">📅 Kalender & Jadwal Kegiatan</h2>
                  <p className="text-xs text-gray-400 mb-6">Klik salah satu kegiatan untuk rincian informasi lengkap.</p>
                  
                  {isAdmin && (
                    <form onSubmit={handleTambahKegiatan} className="mb-8 p-5 bg-blue-50 rounded-xl space-y-4 border border-blue-100">
                      <h3 className="text-sm font-bold text-blue-800 border-b border-blue-200 pb-2">✍️ Panel Admin: Terbitkan Kegiatan</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input type="text" required placeholder="Nama Kegiatan" className="sm:col-span-2 p-2 border rounded-lg text-sm bg-white" value={inputKegNama} onChange={(e) => setInputKegNama(e.target.value)} />
                        <input type="text" placeholder="Seksi Penanggung Jawab" className="p-2 border rounded-lg text-sm bg-white" value={inputKegPj} onChange={(e) => setInputKegPj(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input type="text" required placeholder="Tanggal (e.g. Kamis, 18 Juni 2026)" className="p-2 border rounded-lg text-sm bg-white" value={inputKegTanggal} onChange={(e) => setInputKegTanggal(e.target.value)} />
                        <input type="text" required placeholder="Jam (e.g. 19:00 WIB)" className="p-2 border rounded-lg text-sm bg-white" value={inputKegJam} onChange={(e) => setInputKegJam(e.target.value)} />
                        <input type="text" placeholder="Lokasi Ruangan" className="p-2 border rounded-lg text-sm bg-white" value={inputKegLokasi} onChange={(e) => setInputKegLokasi(e.target.value)} />
                      </div>
                      <textarea rows={3} placeholder="Tulis rincian agenda acara..." className="w-full p-2 border rounded-lg text-sm bg-white" value={inputKegDeskripsi} onChange={(e) => setInputKegDeskripsi(e.target.value)} />
                      <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-blue-700">Terbitkan Jadwal</button>
                    </form>
                  )}

                  <div className="space-y-4">
                    {listKegiatan.map((keg) => (
                      <div key={keg.id} onClick={() => { setKegiatanTerpilih(keg); if(!sudahDibaca.includes(keg.id)){ setSudahDibaca([...sudahDibaca, keg.id]); } }} className="p-4 bg-gray-50 rounded-xl flex justify-between items-center border border-gray-100 hover:border-blue-400 hover:bg-blue-50/20 cursor-pointer transition">
                        <div>
                          <h4 className="font-bold text-gray-800">{keg.nama}</h4>
                          <p className="text-xs text-gray-500 mt-1">🗓️ {keg.tanggal} | ⏰ {keg.jam}</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">Lihat Detail ➔</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white p-2 rounded-xl space-y-6">
                  <button onClick={() => setKegiatanTerpilih(null)} className="text-sm text-blue-600 font-semibold mb-2 block">← Kembali ke Jadwal</button>
                  <h3 className="text-2xl font-bold text-gray-900 border-b pb-3">{kegiatanTerpilih.nama}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl"><span className="text-[10px] font-bold text-gray-400">🗓️ WAKTU</span><p className="text-xs font-bold mt-1">{kegiatanTerpilih.tanggal} ({kegiatanTerpilih.jam})</p></div>
                    <div className="p-4 bg-gray-50 rounded-xl"><span className="text-[10px] font-bold text-gray-400">📍 TEMPAT</span><p className="text-xs font-bold mt-1">{kegiatanTerpilih.lokasi}</p></div>
                    <div className="p-4 bg-gray-50 rounded-xl"><span className="text-[10px] font-bold text-gray-400">👤 PENANGGUNG JAWAB</span><p className="text-xs font-bold mt-1">{kegiatanTerpilih.penanggungJawab}</p></div>
                  </div>
                  <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100"><p className="text-gray-700 text-sm whitespace-pre-line">{kegiatanTerpilih.deskripsi}</p></div>
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
                      <h3 className="text-sm font-bold text-green-800 border-b border-green-200 pb-2">✍️ Panel Admin: Terbitkan Laporan Warta</h3>
                      <input type="text" required placeholder="Warta Jemaat - Minggu 21 Juni 2026" className="w-full p-2 border rounded-lg text-sm bg-white" value={inputWartaJudul} onChange={(e) => setInputWartaJudul(e.target.value)} />
                      <textarea rows={3} placeholder="Blok Tingting Na Marragam..." className="w-full p-2 border rounded-lg text-sm bg-white" value={inputTingting} onChange={(e) => setInputTingting(e.target.value)} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" placeholder="Total Kas Pemasukan" className="p-2 border rounded-lg text-sm bg-white" value={inputPemasukan} onChange={(e) => setInputPemasukan(e.target.value)} />
                        <input type="text" placeholder="Total Kas Pengeluaran" className="p-2 border rounded-lg text-sm bg-white" value={inputPengeluaran} onChange={(e) => setInputPengeluaran(e.target.value)} />
                      </div>
                      <textarea rows={2} placeholder="Pokok doa / berita duka..." className="w-full p-2 border rounded-lg text-sm bg-white" value={inputDukacita} onChange={(e) => setInputDukacita(e.target.value)} />
                      <button type="submit" className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-green-700">Terbitkan Warta</button>
                    </form>
                  )}

                  <div className="space-y-4">
                    {listWarta.map((warta) => (
                      <div key={warta.id} onClick={() => { setWartaTerpilih(warta); if(!sudahDibaca.includes(warta.id)){ setSudahDibaca([...sudahDibaca, warta.id]); } }} className="p-4 bg-gray-50 rounded-xl flex justify-between items-center border border-gray-100 hover:border-green-400 hover:bg-green-50/20 cursor-pointer transition">
                        <p className="font-semibold text-gray-800">{warta.judul}</p>
                        <span className="text-xl text-gray-400">➔</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white p-2 rounded-xl space-y-6">
                  <button onClick={() => setWartaTerpilih(null)} className="text-sm text-green-600 font-semibold mb-2 block">← Kembali ke Daftar Arsip</button>
                  <h3 className="text-2xl font-bold text-gray-900 border-b pb-3">{wartaTerpilih.judul}</h3>
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"><h4 className="text-sm font-bold text-blue-600 mb-2">📣 Tingting Na Marragam</h4><p className="text-gray-700 text-sm whitespace-pre-line">{wartaTerpilih.tingtingMarragam}</p></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-emerald-50 p-4 rounded-xl border"><span className="text-xs text-gray-400">Pemasukan</span><p className="text-xl font-bold text-emerald-800 mt-1">{wartaTerpilih.pemasukan}</p></div>
                    <div className="bg-orange-50 p-4 rounded-xl border"><span className="text-xs text-gray-400">Pengeluaran</span><p className="text-xl font-bold text-orange-800 mt-1">{wartaTerpilih.pengeluaran}</p></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUB-MENU: FORMULIR */}
          {menuAktif === 'Formulir' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <button onClick={() => setMenuAktif('Home')} className="text-sm text-blue-600 font-semibold mb-4 block">← Kembali ke Beranda</button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Pengajuan Berkas & Formulir</h2>
              {/* ... konten formulir ... */}
            </div>
          )}
        </div>

        {/* ==================== SIDEBAR KANAN ==================== */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 sticky top-24">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="w-1.5 h-6 bg-amber-500 rounded-full mr-2"></span> Pengumuman Terbaru
              </h2>
              <span className="text-xl animate-bounce">🔔</span>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {sidebarPengumuman.map((item: any) => {
                const belumKlik = !sudahDibaca.includes(item.id);

                return (
                  <div 
                    key={`${item.tipe}-${item.id}`} 
                    onClick={() => handleKlikPengumuman(item)}
                    className={`p-4 rounded-xl border cursor-pointer transition duration-300 relative overflow-hidden transform hover:-translate-y-0.5 hover:shadow-sm ${
                      belumKlik ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-300/40' : 'bg-gray-50 border-gray-100 opacity-80' 
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                        item.tipe === 'WARTA' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.tipe}
                      </span>
                      {belumKlik ? (
                        <span className="text-[9px] bg-red-500 text-white font-black px-1.5 py-0.5 rounded animate-pulse">🔴 BARU</span>
                      ) : (
                        <span className="text-[9px] text-gray-400 font-medium">✓ Dibaca</span>
                      )}
                    </div>
                    <p className={`text-sm mt-2 leading-snug ${belumKlik ? 'font-black text-amber-950' : 'font-medium text-gray-600'}`}>
                      {item.teks}
                    </p>
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