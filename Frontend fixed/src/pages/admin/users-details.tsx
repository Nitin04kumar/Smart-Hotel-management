import { useEffect, useState } from 'react';
import './admin.css';
import { getUsersStats, getAllUsers } from '@/services/admin';
import type { User } from '@/models/types';
import { Users, Search, Filter } from 'lucide-react';

export default function AdminUsersDetailsPage() {
  useEffect(() => { document.title = 'Users Details | Admin Panel'; }, []);
  
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'manager' | 'admin'>('all');
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getAllUsers()
      .then((userData) => {
        setUsers(userData);
        setFilteredUsers(userData);
      })
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = users;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  

  const getRoleStats = () => {
    const stats = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const roleStats = getRoleStats();

  if (loading) {
    return (
      <div className="admin-page">
        <div className="empty-state">
          <h3>Loading...</h3>
          <p>Please wait while we fetch user data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header>
        <h1>Users Details</h1>
        <p className="text-muted-foreground">Manage system users and their roles across the platform.</p>
      </header>

      {/* User Stats */}
      <div className="quick-stats">
        <div className="quick-stat">
          <div className="quick-stat-value">{users.length}</div>
          <div className="quick-stat-label">Total Users</div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-value">{roleStats.user || 0}</div>
          <div className="quick-stat-label">Customers</div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-value">{roleStats.manager || 0}</div>
          <div className="quick-stat-label">Managers</div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-value">{roleStats.admin || 0}</div>
          <div className="quick-stat-label">Admins</div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="filter-controls">
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Search Users</label>
            <input
              className="filter-input"
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Filter by Role</label>
            <select 
              className="filter-select"
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="manager">Managers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <div className="filter-group">
            <span className="filter-label">Results</span>
            <span className="hotel-detail-value">{filteredUsers.length} users</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="empty-state">
          <h3>No users found</h3>
          <p>No users match the current search and filter criteria.</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-xs text-muted-foreground">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`user-role ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}