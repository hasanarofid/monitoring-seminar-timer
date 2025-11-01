import React from 'react';
import { format } from 'date-fns';
import './SeminarTable.css';

const SeminarTable = ({ seminars, onEdit, onDelete, onStatusChange }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      play: { label: 'Play', class: 'status-play' },
      jeda: { label: 'Jeda', class: 'status-jeda' },
      selesai: { label: 'Selesai', class: 'status-selesai' },
    };
    
    const config = statusConfig[status] || statusConfig.jeda;
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch {
      return dateString;
    }
  };

  if (seminars.length === 0) {
    return (
      <div className="empty-state">
        <p>Tidak ada data seminar. Silakan tambah seminar baru.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="seminar-table">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Pengisi</th>
            <th>Materi</th>
            <th>Durasi</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {seminars.map((seminar) => (
            <tr key={seminar.id}>
              <td>{formatDate(seminar.tanggal)}</td>
              <td>{seminar.pengisi}</td>
              <td className="materi-cell">{seminar.materi}</td>
              <td>{seminar.durasi} menit</td>
              <td>{getStatusBadge(seminar.status)}</td>
              <td>
                <div className="action-buttons">
                  {seminar.status === 'jeda' && (
                    <button
                      className="btn-status btn-play"
                      onClick={() => onStatusChange(seminar.id, 'play')}
                      title="Play"
                    >
                      ▶
                    </button>
                  )}
                  {seminar.status === 'play' && (
                    <button
                      className="btn-status btn-pause"
                      onClick={() => onStatusChange(seminar.id, 'jeda')}
                      title="Jeda"
                    >
                      ⏸
                    </button>
                  )}
                  {seminar.status !== 'selesai' && (
                    <button
                      className="btn-status btn-finish"
                      onClick={() => onStatusChange(seminar.id, 'selesai')}
                      title="Selesai"
                    >
                      ⏹
                    </button>
                  )}
                  <button
                    className="btn-action btn-edit"
                    onClick={() => onEdit(seminar)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => onDelete(seminar.id)}
                    title="Hapus"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SeminarTable;

