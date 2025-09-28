import api from './api';
import type { RoomType, HotelRequest, User } from '@/models/types';

export type AdminHotel = {
  id: string;
  name: string;
  location: string;
  images: string[];
  amenities: string[];
  rating: number;
  rooms: Record<RoomType, { price: number; available: number }>;
  description?: string;
  status: 'approved' | 'pending' | 'rejected';
  managerEmail: string | null;
};

export async function getHotelsByStatus(status: 'approved' | 'pending' | 'rejected') {
  const res = await api.get('/admin/hotels', { params: { status } });
  return res.data as AdminHotel[];
}

export async function approveHotel(id: string) {
  const res = await api.post(`/admin/hotels/${id}/approve`);
  return res.data as { id: string; status: 'approved' };
}

export async function rejectHotel(id: string) {
  const res = await api.post(`/admin/hotels/${id}/reject`);
  return res.data as { id: string; status: 'rejected' };
}

export async function getUsersStats() {
  const res = await api.get('/admin/users-stats');
  return res.data as { users: number; managers: number; admins: number; total: number };
}

export async function getAllUsers() {
  const res = await api.get('/admin/users');
  return res.data as User[];
}

export async function getDashboardStats() {
  const res = await api.get('/admin/dashboard');
  return res.data as {
    totalUsers: number;
    totalHotels: number;
    totalBookings: number;
    totalRevenue: number;
    pendingApprovals: number;
    recentActivity: string[];
  };
}

