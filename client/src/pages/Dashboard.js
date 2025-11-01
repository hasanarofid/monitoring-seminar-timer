import React, { useState, useEffect } from 'react';
import { seminarService } from '../services/api';
import SeminarForm from '../components/SeminarForm';
import SeminarTable from '../components/SeminarTable';
import './Dashboard.css';

const Dashboard = () => {
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingSeminar, setEditingSeminar] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchSeminars();
  }, []);

  const fetchSeminars = async () => {
    try {
      setLoading(true);
      const response = await seminarService.getAll();
      setSeminars(response.data);
    } catch (err) {
      setError('Gagal memuat data seminar');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      setError(null);
      await seminarService.create(data);
      setSuccess('Seminar berhasil ditambahkan');
      setShowForm(false);
      fetchSeminars();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal menambahkan seminar');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      setError(null);
      await seminarService.update(id, data);
      setSuccess('Seminar berhasil diupdate');
      setEditingSeminar(null);
      setShowForm(false);
      fetchSeminars();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal mengupdate seminar');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus seminar ini?')) {
      try {
        setError(null);
        await seminarService.delete(id);
        setSuccess('Seminar berhasil dihapus');
        fetchSeminars();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(err.response?.data?.error || 'Gagal menghapus seminar');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setError(null);
      await seminarService.update(id, { status: newStatus });
      setSuccess(`Status berhasil diubah menjadi ${newStatus}`);
      fetchSeminars();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal mengubah status');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleEdit = (seminar) => {
    setEditingSeminar(seminar);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingSeminar(null);
    setShowForm(false);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard Seminar</h1>
          <button 
            className="btn-primary" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Batal' : '+ Tambah Seminar'}
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        {showForm && (
          <div className="form-container">
            <SeminarForm
              seminar={editingSeminar}
              onSubmit={editingSeminar ? 
                (data) => handleUpdate(editingSeminar.id, data) : 
                handleCreate
              }
              onCancel={handleCancel}
            />
          </div>
        )}

        <div className="table-container">
          {loading ? (
            <div className="loading">Memuat data...</div>
          ) : (
            <SeminarTable
              seminars={seminars}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

