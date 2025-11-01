import React, { useState, useEffect } from 'react';
import './SeminarForm.css';

const SeminarForm = ({ seminar, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    tanggal: '',
    pengisi: '',
    materi: '',
    durasi: '',
  });

  useEffect(() => {
    if (seminar) {
      const tanggal = new Date(seminar.tanggal).toISOString().split('T')[0];
      setFormData({
        tanggal,
        pengisi: seminar.pengisi || '',
        materi: seminar.materi || '',
        durasi: seminar.durasi || '',
      });
    }
  }, [seminar]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.tanggal || !formData.pengisi || !formData.materi || !formData.durasi) {
      alert('Semua field harus diisi!');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form className="seminar-form" onSubmit={handleSubmit}>
      <h2>{seminar ? 'Edit Seminar' : 'Tambah Seminar Baru'}</h2>
      
      <div className="form-group">
        <label htmlFor="tanggal">Tanggal *</label>
        <input
          type="date"
          id="tanggal"
          name="tanggal"
          value={formData.tanggal}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="pengisi">Pengisi *</label>
        <input
          type="text"
          id="pengisi"
          name="pengisi"
          value={formData.pengisi}
          onChange={handleChange}
          placeholder="Nama pengisi seminar"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="materi">Materi *</label>
        <textarea
          id="materi"
          name="materi"
          value={formData.materi}
          onChange={handleChange}
          placeholder="Judul atau deskripsi materi"
          rows="4"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="durasi">Durasi (menit) *</label>
        <input
          type="number"
          id="durasi"
          name="durasi"
          value={formData.durasi}
          onChange={handleChange}
          placeholder="60"
          min="1"
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit">
          {seminar ? 'Update' : 'Simpan'}
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Batal
        </button>
      </div>
    </form>
  );
};

export default SeminarForm;

