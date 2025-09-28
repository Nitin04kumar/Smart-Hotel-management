import api from './api';
import type { RoomType, Booking, Review, HotelRequest } from '@/models/types';

export type ManagerHotel = {
  id: string;
  name: string;
  location: string;
  images: string[];
  amenities: string[];
  rating: number;
  rooms: Record<RoomType, { price: number; available: number }>;
  description?: string;
  status?: 'approved' | 'pending' | 'rejected';
};

export type NewHotelPayload = {
  managerEmail: string;
  name: string;
  location: string;
  description?: string;
  amenities: string[];
  imageUrl: string;
  rooms: { type: RoomType; price: number; available: number }[];
};

export async function getMyHotels(managerEmail: string) {
  const res = await api.get('/manager/hotels');
  return res.data as ManagerHotel[];
}

export async function addHotel(payload: NewHotelPayload) {
  const res = await api.post('/manager/hotels', payload);
  return res.data as ManagerHotel;
}

export async function getManagerBookings(managerEmail: string) {
  const res = await api.get('/manager/bookings');
  return res.data as Booking[];
}

export async function getManagerReviews(managerEmail: string) {
  const res = await api.get('/manager/reviews');
  return res.data as Review[];
}

export async function replyToReview(reviewId: string, managerEmail: string, text: string) {
  const res = await api.post(`/reviews/${reviewId}/reply`, { managerEmail, text });
  return res.data as Review;
}

