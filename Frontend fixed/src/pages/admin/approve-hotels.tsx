import { useEffect, useState } from 'react';
import './admin.css';
import { getHotelsByStatus, approveHotel, rejectHotel } from '@/services/admin';
import type { HotelRequest } from '@/models/types';
import { Hotel, CheckCircle, X, Eye } from 'lucide-react';

export default function AdminApproveHotelsPage() {
  useEffect(() => { document.title = 'Approve Hotels | Admin Panel'; }, []);
  
  const [hotels, setHotels] = useState<any[]>([]);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getHotelsByStatus(filter)
      .then(setHotels)
      .catch(() => setError('Failed to load hotels'))
      .finally(() => setLoading(false));
  }, [filter]);

  const handleApprove = async (hotelId: string) => {
    setActionLoading(hotelId);
    setError('');
    try {
      await approveHotel(hotelId);
      setHotels(hotels.map(h => h.id === hotelId ? { ...h, status: 'approved' as const } : h));
    } catch (err) {
      setError('Failed to approve hotel');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (hotelId: string) => {
    setActionLoading(hotelId);
    setError('');
    try {
      await rejectHotel(hotelId);
      setHotels(hotels.map(h => h.id === hotelId ? { ...h, status: 'rejected' as const } : h));
    } catch (err) {
      setError('Failed to reject hotel');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="empty-state">
          <h3>Loading...</h3>
          <p>Please wait while we fetch hotel requests.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header>
        <h1>Approve Hotels</h1>
        <p className="text-muted-foreground">Review and manage hotel approval requests from managers.</p>
      </header>

      {/* Filter Controls */}
      <div className="filter-controls">
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Filter by Status</label>
            <select 
              className="filter-select"
              value={filter} 
              onChange={(e) => setFilter(e.target.value as typeof filter)}
            >
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="filter-group">
            <span className="filter-label">Total Results</span>
            <span className="hotel-detail-value">{hotels.length} hotels</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      {/* Hotels Grid */}
      {hotels.length === 0 ? (
        <div className="empty-state">
          <h3>No hotels found</h3>
          <p>No hotels match the current filter criteria.</p>
        </div>
      ) : (
        <div className="hotels-grid">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="hotel-approval-card">
              <div className="hotel-header">
                <div className="hotel-info">
                  <h3>{hotel.name}</h3>
                  <p>{hotel.location}</p>
                  <p>Manager: {hotel.managerEmail}</p>
                </div>
                <div className={`hotel-status ${hotel.status}`}>
                  {hotel.status}
                </div>
              </div>

              <div className="hotel-details">
                <div className="hotel-detail-item">
                  <span className="hotel-detail-label">Manager</span>
                  <span className="hotel-detail-value">{hotel.managerEmail || 'Unknown'}</span>
                </div>
                <div className="hotel-detail-item">
                  <span className="hotel-detail-label">Amenities</span>
                  <span className="hotel-detail-value">{hotel.amenities?.slice(0, 3).join(', ') || 'None'}</span>
                </div>
                <div className="hotel-detail-item">
                  <span className="hotel-detail-label">Room Types</span>
                  <span className="hotel-detail-value">{Object.keys(hotel.rooms || {}).length} types</span>
                </div>
                <div className="hotel-detail-item">
                  <span className="hotel-detail-label">Submitted</span>
                  <span className="hotel-detail-value">{new Date(hotel.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="hotel-actions">
                {hotel.status === 'pending' && (
                  <>
                    <button 
                      className="approve-button primary-button"
                      onClick={() => handleApprove(hotel.id)}
                      disabled={actionLoading === hotel.id}
                    >
                      <CheckCircle size={14} />
                      {actionLoading === hotel.id ? 'Approving...' : 'Approve'}
                    </button>
                    <button 
                      className="reject-button secondary-button"
                      onClick={() => handleReject(hotel.id)}
                      disabled={actionLoading === hotel.id}
                    >
                      <X size={14} />
                      {actionLoading === hotel.id ? 'Rejecting...' : 'Reject'}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}