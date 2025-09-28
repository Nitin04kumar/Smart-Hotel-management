import { useEffect, useMemo, useState } from 'react';
import './admin.css';
import { getHotelsByStatus } from '@/services/admin';
import { Hotel, Users, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function AdminDashboardPage() {
  useEffect(() => { document.title = 'Dashboard | Admin Panel'; }, []);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getHotelsByStatus('approved'),
      getHotelsByStatus('pending'),
      getHotelsByStatus('rejected'),
    ]).then(([approved, pending, rejected]) => {
      setHotels([...approved, ...pending, ...rejected]);
    }).catch(() => setHotels([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const approved = hotels.filter(h => h.status === 'approved').length;
    const pending = hotels.filter(h => h.status === 'pending').length;
    const rejected = hotels.filter(h => h.status === 'rejected').length;
    return { total: hotels.length, approved, pending, rejected };
  }, [hotels]);

  if (loading) {
    return (
      <div className="admin-page">
        <div className="empty-state">
          <h3>Loading...</h3>
          <p>Please wait while we fetch dashboard data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page admin-dashboard">
      <header>
        <h1>Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage hotels, users, and system-wide operations.</p>
      </header>


      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Hotel Management</span>
            <div className="metric-icon">
              <Hotel size={16} />
            </div>
          </div>
          <div className="metric-value">{stats.total}</div>
          <div className="metric-description">Total properties in system</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Pending Reviews</span>
            <div className="metric-icon">
              <Clock size={16} />
            </div>
          </div>
          <div className="metric-value">{stats.pending}</div>
          <div className="metric-description">Hotels awaiting approval</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Approved Hotels</span>
            <div className="metric-icon">
              <CheckCircle size={16} />
            </div>
          </div>
          <div className="metric-value">{stats.approved}</div>
          <div className="metric-description">Live properties</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Rejected Hotels</span>
            <div className="metric-icon">
              <XCircle size={16} />
            </div>
          </div>
          <div className="metric-value">{stats.rejected}</div>
          <div className="metric-description">Declined applications</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">System Users</span>
            <div className="metric-icon">
              <Users size={16} />
            </div>
          </div>
          <div className="metric-value">-</div>
          <div className="metric-description">Registered users</div>
        </div>
      </div>

    </div>
  );
}