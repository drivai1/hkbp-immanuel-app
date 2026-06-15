"use client";

import React, { useState } from 'react';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nama, setNama] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegister) {
      // Simulasi Registrasi
      alert(`Registrasi Akun Jemaat Berhasil!\nNama: ${nama}\nEmail: ${email}\nSilakan gunakan akun ini untuk Login.`);
      setIsRegister(false); // Pindah ke mode login setelah daftar
    } else {
      // Simulasi Login
      if (email === 'admin@hkbp.com' && password === 'admin123') {
        alert('Login Berhasil sebagai Admin Gereja!');
        window.location.href = '/?role=admin'; // Masuk ke beranda sebagai admin
      } else {
        alert(`Login Berhasil sebagai Jemaat!\nSelamat Datang kembali.`);
        window.location.href = `/?role=jemaat&nama=${nama || 'Jemaat'}`; // Masuk sebagai jemaat biasa
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center font-sans px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">HKBP Immanuel</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isRegister ? 'Daftar Akun Baru Jemaat' : 'Sistem Informasi Layanan Jemaat'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">NAMA LENGKAP</label>
              <input 
                type="text" required placeholder="Contoh: Lasman Situmeang"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                value={nama} onChange={(e) => setNama(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">EMAIL</label>
            <input 
              type="email" required placeholder="alamat@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">PASSWORD</label>
            <input 
              type="password" required placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white text-sm font-semibold py-3 rounded-xl hover:bg-blue-700 transition shadow-md">
            {isRegister ? 'Daftar Sekarang' : 'Masuk ke Aplikasi'}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-gray-100">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            {isRegister ? 'Sudah punya akun? Login di sini' : 'Jemaat Baru? Registrasi akun di sini'}
          </button>
        </div>
      </div>
    </main>
  );
}