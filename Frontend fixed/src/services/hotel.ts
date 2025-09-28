import api from './api';
import type { 
  RoomType, 
  HotelSummary, 
  HotelDetail, 
  Booking, 
  Payment, 
  Review, 
  LoyaltyInfo 
} from '@/models/types';

export async function searchHotels(params: { location: string; roomType: RoomType }) {
  const res = await api.get('/hotels', { params });
  return res.data as HotelSummary[];
}

export async function getHotel(id: string) {
  console.log('🌐 Making API request to get hotel:', id);
  console.log('🌐 Request URL:', `/api/hotels/${id}`);
  
  const res = await api.get(`/hotels/${id}`);
  console.log('🌐 API Response:', res.data);
  
  return res.data as HotelDetail;
}

export async function createBooking(data: Omit<Booking, 'id' | 'status' | 'hotelName'>) {
  const res = await api.post('/user/bookings', data);
  return res.data as Booking;
}

export async function listBookings(userEmail: string) {
  const res = await api.get('/user/bookings', { params: { user: userEmail } });
  return res.data as Booking[];
}

export async function createPayment(data: { bookingId: string; userEmail: string; amount: number; method: 'upi' | 'card'; details: any; }) {
  const res = await api.post('/user/payments', data);
  return res.data as Payment;
}

export async function listPayments(userEmail: string) {
  const res = await api.get('/user/payments', { params: { user: userEmail } });
  return res.data as Payment[];
}

export async function addReview(data: Omit<Review, 'id' | 'createdAt'>) {
  const res = await api.post('/user/reviews', data);
  return res.data as Review;
}

export async function listReviews(userEmail: string) {
  const res = await api.get('/user/reviews', { params: { user: userEmail } });
  return res.data as Review[];
}

export async function getLoyalty(userEmail: string) {
  const res = await api.get('/user/loyalty', { params: { user: userEmail } });
  return res.data as LoyaltyInfo;
}

export async function redeemLoyalty(userEmail: string, points: number) {
  const res = await api.post('/user/loyalty/redeem', { userEmail, points });
  return res.data as LoyaltyInfo;
}

