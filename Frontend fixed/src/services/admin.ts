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
  const res = await api.get('/api/admin/hotels/pending');
  return res.data as AdminHotel[];
}

export async function approveHotel(id: string) {
  const res = await api.put(`/api/admin/hotels/${id}/approve`);
  return res.data as string; // backend returns message
}

export async function rejectHotel(id: string) {
  const res = await api.put(`/api/admin/hotels/${id}/reject`);
  return res.data as string; // backend returns message
}

export async function getAllUsers() {
  const res = await api.get('/api/admin/users');
  return res.data as User[];
}

export async function getDashboardStats() {
  const res = await api.get('/api/admin/dashboard/stats');
  return res.data as Record<string, any>;
}

