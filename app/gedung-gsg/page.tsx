"use client";

import React, { useState } from 'react';

export default function GedungGSG() {
  // Logika untuk mengatur buka/tutup modal form
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Logika untuk menampung data inputan form
  const [formData, setFormData] = useState({
    nama: '',
    tanggal: '',
    keperluan: ''
  });

  const fasilitas = [
    { nama: 'Kapasitas', nilai: '150 - 200 Pax', ikon: '👥' },
    { nama: 'Kursi Futura', nilai: 'Tersedia', ikon: '🪑' },
    { nama: 'Meja Panjang', nilai: 'Tersedia', ikon: '🪵' },
    { nama: 'Sound System', nilai: 'Tersedia', ikon: '🔊' },
    { nama: 'Mikrofon', nilai: 'Tersedia', ikon: '🎙️' },
    { nama: 'Speaker', nilai: 'Tersedia', ikon: '📢' },
    { nama: 'Toilet', nilai: 'Tersedia (Pria & Wanita)', ikon: '🚻' },
    { nama: 'Parkiran', nilai: 'Tersedia', ikon: '🅿️' },
    { nama: 'CCTV', nilai: 'Tersedia', ikon: '📹' },
  ];

  // Fungsi saat form dikirim (Submit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Pemesanan Berhasil Diajukan!\nNama: ${formData.nama}\nTanggal: ${formData.tanggal}\nKeperluan: ${formData.keperluan}\n\nStatus: Menunggu Persetujuan Admin Gereja.`);
    setIsModalOpen(false); // Tutup modal setelah submit
    setFormData({ nama: '', tanggal: '', keperluan: '' }); // Reset form
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans relative">
      
      {/* NAVBAR ATAS */}
      <nav className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center space-x-4">
          <a href="/" className="hover:text-blue-200 transition text-lg font-bold flex items-center">
            ← <span className="ml-2 text-sm font-medium">Kembali ke Beranda</span>
          </a>
          <span className="text-blue-300">|</span>
          <h1 className="text-xl font-bold tracking-wide">Gedung Serba Guna</h1>
        </div>
      </nav>

      {/* KONTEN UTAMA */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">
          
          {/* SISI KIRI: Foto Gedung */}
          <div className="p-6 bg-gray-100 flex flex-col justify-between min-h-[300px] border-r border-gray-100">
            <div className="w-full h-full bg-sky-200 rounded-xl flex items-center justify-center text-sky-800 font-semibold border border-sky-300">
              [ Foto Gedung GSG Real ]
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">Informasi fasilitas dan pemesanan gedung</p>
          </div>

          {/* SISI KANAN: Daftar Fasilitas */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-2"></span>
                Fasilitas & Kapasitas
              </h2>

              <div className="divide-y divide-gray-100">
                {fasilitas.map((item, index) => (
                  <div key={index} className="py-2.5 flex justify-between items-center text-sm">
                    <div className="flex items-center text-gray-600">
                      <span className="mr-3 text-base">{item.ikon}</span>
                      <span>{item.nama}:</span>
                    </div>
                    <span className="font-semibold text-gray-800">{item.nilai}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tombol pemicu Modal Form */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-6 w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-100"
            >
              Ajukan Permohonan Booking Gedung
            </button>
          </div>

        </div>
      </div>

      {/* BACKDROP & MODAL POP-UP (Hanya muncul jika isModalOpen bernilai true) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative border border-gray-100">
            
            {/* Tombol Close silang di pojok kanan atas */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-gray-800 mb-4">Formulir Booking Gedung</h3>
            
            {/* INPUT FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">NAMA LENGKAP JEMAAT</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Lasman Situmeang"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">TANGGAL PENGGUNAAN</label>
                <input 
                  type="date" 
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-gray-700"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">KEPERLUAN ACARA</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Contoh: Acara Pernikahan Keluarga / Rapat Sektor"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  value={formData.keperluan}
                  onChange={(e) => setFormData({...formData, keperluan: e.target.value})}
                ></textarea>
              </div>

              {/* Tombol Aksi */}
              <div className="flex space-x-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="w-1/2 bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm"
                >
                  Kirim Permohonan
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </main>
  );
}