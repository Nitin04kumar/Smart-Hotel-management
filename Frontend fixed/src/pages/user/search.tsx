import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { HotelDetail, HotelSummary, RoomType } from '@/models/types';
import { searchHotels, getHotel, createBooking, createPayment } from '@/services/hotel';
import { format, addDays } from 'date-fns';
import { CalendarIcon, MapPin, Star, Hotel } from 'lucide-react';
import { cn } from '@/utils';
import { Button } from '@/components/common/ui/button';
import './search.css';

export default function UserSearchPage() {
  useEffect(() => {
    document.title = 'Search Hotels | Smart Hotel';
  }, []);

  const { auth } = useAuth();
  const navigate = useNavigate();
  const today = new Date();
  const tomorrow = addDays(today, 1);
  
  const [form, setForm] = useState({ 
    location: '', 
    checkin: '', 
    checkout: '', 
    roomType: 'standard' as RoomType 
  });
  const [reviews, setReviews] = useState([
    { id: 1, user: 'Priya S.', rating: 5, comment: 'Excellent service and beautiful rooms. Highly recommended!', date: '2024-01-15' },
    { id: 2, user: 'Arjun M.', rating: 4, comment: 'Great location and friendly staff. Will definitely stay again.', date: '2024-01-10' },
    { id: 3, user: 'Kavya R.', rating: 5, comment: 'Amazing amenities and comfortable beds. Perfect for vacation.', date: '2024-01-05' }
  ]);
  const [results, setResults] = useState<HotelSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<HotelDetail | null>(null);
  const [step, setStep] = useState<'search' | 'details' | 'payment' | 'success'>('search');
  const [bookingId, setBookingId] = useState<string | null>(null);

  const nights = useMemo(() => {
    if (!form.checkin || !form.checkout) return 0;
    const start = new Date(form.checkin);
    const end = new Date(form.checkout);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 0);
  }, [form.checkin, form.checkout]);

  const pricePerNight = selected ? selected.rooms[form.roomType].price : 0;
  const total = pricePerNight * nights;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    console.log('🔍 Starting hotel search with:', { location: form.location, roomType: form.roomType });
    console.log('🔐 Auth state:', { authExists: !!auth, user: auth?.user, token: auth?.token });
    console.log('🌐 About to call searchHotels API...');
    
    try {
      const data = await searchHotels({ location: form.location, roomType: form.roomType });
      console.log('📊 Search results received:', data);
      
      // Ensure data is always an array
      const hotelResults = Array.isArray(data) ? data : [];
      setResults(hotelResults);
      console.log('✅ Hotels set to state:', hotelResults.length, 'hotels');
      
      if (hotelResults.length === 0) {
        console.warn('⚠️ No hotels found for the search criteria');
      }
      
      setStep('search');
    } catch (err: any) {
      console.error('❌ Search failed:', err);
      console.error('❌ Error details:', {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
        url: err?.config?.url
      });
      setError(err?.response?.data?.message || err?.message || 'Search failed');
      setResults([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const openDetails = async (id: string) => {
    console.log('🏨 Opening hotel details for ID:', id);
    console.log('🔐 Auth state:', { authExists: !!auth, user: auth?.user, token: auth?.token });
    
    setError(null);
    setLoading(true);
    try {
      const h = await getHotel(id);
      console.log('✅ Hotel details received:', h);
      setSelected(h);
      setStep('details');
    } catch (err: any) {
      console.error('❌ Failed to load hotel details:', err);
      console.error('❌ Error details:', {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
        url: err?.config?.url
      });
      setError(`Failed to load hotel: ${err?.response?.data?.message || err?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = async () => {
    if (!auth || !selected || nights <= 0) return;
    setError(null);
    setLoading(true);
    try {
      const booking = await createBooking({
        hotelId: selected.id,
        userEmail: auth.user.email,
        roomType: form.roomType,
        checkin: form.checkin,
        checkout: form.checkout,
        nights,
        pricePerNight,
        total,
      } as any);
      setBookingId(booking.id);
      setStep('payment');
    } catch (err: any) {
      setError('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const payNow = async (method: 'upi' | 'card', details: any) => {
    if (!auth || !bookingId) return;
    setError(null);
    setLoading(true);
    try {
      await createPayment({ bookingId, userEmail: auth.user.email, amount: total, method, details });
      setStep('success');
    } catch (err: any) {
      setError('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-search-page space-y-4">
      <header>
        <h1>Search Hotels</h1>
        <p className="muted">Find the best stays by location and room type.</p>
      </header>

      <form onSubmit={onSearch} className="search-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Location</label>
            <input 
              className="form-input"
              name="location" 
              value={form.location} 
              onChange={onChange} 
              placeholder="Enter city or area" 
              required 
            />
          </div>
          
          
          <div className="form-group">
            <label className="form-label">Check-in Date</label>
            <input 
              className="form-input"
              type="date" 
              name="checkin" 
              value={form.checkin} 
              onChange={onChange} 
              min={format(today, 'yyyy-MM-dd')}
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Check-out Date</label>
            <input 
              className="form-input"
              type="date" 
              name="checkout" 
              value={form.checkout} 
              onChange={onChange} 
              min={form.checkin ? format(addDays(new Date(form.checkin), 1), 'yyyy-MM-dd') : format(tomorrow, 'yyyy-MM-dd')}
              required 
            />
          </div>
          
          <div className="form-group">
            <button className="search-button" disabled={loading}>
              {loading ? 'Searching...' : 'Search Hotels'}
            </button>
          </div>
        </div>
      </form>

      {error && <div className="alert error">{error}</div>}

      {/* Results */}
      {step === 'search' && Array.isArray(results) && results.length > 0 && (
        <section className="hotels-grid">
          {results.map((h) => (
            <article className="hotel-approval-card" key={h.id}>
              <div className="hotel-image-placeholder">
                <img src={h.image} alt={`${h.name} hotel image`} className="w-full h-full object-cover" />
              </div>
              
              <div className="hotel-card-content">
                <div className="hotel-header">
                  <div className="hotel-info">
                    <h3>{h.name}</h3>
                    <div className="location">
                      <MapPin size={14} />
                      {h.location}
                    </div>
                    <div className="rating">
                      <Star size={14} fill="currentColor" />
                      {h.rating.toFixed(1)}
                    </div>
                  </div>
                  <div className="hotel-price-badge">
                    <div className="price-label">Per night</div>
                    <div className="price-value">${h.price}</div>
                  </div>
                </div>

                <div className="hotel-details">
                  <div className="hotel-detail-item">
                    <span className="hotel-detail-label">Price</span>
                    <span className="hotel-detail-value">${h.price}/night</span>
                  </div>
                </div>

                <div className="hotel-amenities">
                  <div className="hotel-amenities-title">Amenities</div>
                  <div className="amenities-tags">
                    {h.amenities?.slice(0, 4).map((amenity, index) => (
                      <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                    {h.amenities?.length > 4 && (
                      <span className="amenity-tag">+{h.amenities.length - 4} more</span>
                    )}
                  </div>
                </div>

                <div className="hotel-actions">
                  <button className="action-button" onClick={() => openDetails(h.id)}>
                    Book Now
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* No results message */}
      {step === 'search' && Array.isArray(results) && results.length === 0 && !loading && (
        <div className="empty-state">
          <h3>No hotels found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      )}

      {/* Details */}
      {step === 'details' && selected && (
        <section className="booking-details-form">
          <div className="booking-header">
            <div className="hotel-preview">
              <img src={selected.images[0]} alt={`${selected.name} thumbnail`} loading="lazy" className="hotel-thumbnail" />
              <div className="hotel-basic-info">
                <h2 className="hotel-name-details">{selected.name}</h2>
                <p className="hotel-location-details">
                  <MapPin size={14} />
                  {selected.location} • ⭐ {selected.rating.toFixed(1)}
                </p>
              </div>
            </div>
            <div className="preview-note">
              <span className="text-sm text-muted-foreground">Focus on booking details</span>
            </div>
          </div>
          
          <div className="amenities-section">
            <h3 className="section-title">Hotel Amenities</h3>
            <div className="amenities-list">
              {selected.amenities.map((amenity, index) => (
                <span key={index} className="amenity-tag">{amenity}</span>
              ))}
            </div>
          </div>

          <div className="reviews-section">
            <h3 className="section-title">Customer Reviews</h3>
            <div className="reviews-list">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <span className="review-user">{review.user}</span>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <span className="review-date">{review.date}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="room-selection-section">
            <h3 className="section-title">Select Room Type</h3>
            <div className="room-types-grid">
              {(['standard','deluxe','suite'] as RoomType[]).map((rt) => (
                <div key={rt} className={`room-type-card ${form.roomType===rt ? 'selected' : ''}`}>
                  <div className="room-type-header">
                    <div className="room-type-name">{rt}</div>
                    <div className="room-type-price">${selected?.rooms?.[rt]?.price || 0}/night</div>
                  </div>
                  <button 
                    type="button" 
                    className={`room-select-btn ${form.roomType === rt ? 'selected' : ''}`}
                    onClick={() => setForm((p)=>({...p, roomType: rt}))}
                  >
                    {form.roomType === rt ? '✓ Selected' : 'Select Room'}
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="booking-summary">
            <div className="summary-content">
              <div className="summary-details">
                <span className="summary-text">{nights} nights × ${pricePerNight}</span>
                <span className="total-amount">Total: ${total}</span>
              </div>
              <div className="booking-actions">
                <button className="action-button secondary" onClick={() => setStep('search')}>
                  ← Back to Search
                </button>
                <button 
                  className="action-button primary" 
                  disabled={nights<=0} 
                  onClick={confirmBooking}
                >
                  Confirm Booking →
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Payment */}
      {step === 'payment' && (
        <PaymentForm amount={total} onCancel={() => setStep('details')} onPay={payNow} loading={loading} />
      )}

      {step === 'success' && (
        <section className="booking-success-container">
          <div className="success-card">
            <div className="success-icon">
              <svg className="success-checkmark" viewBox="0 0 52 52">
                <circle className="success-circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="success-check" fill="none" d="m14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
            <h2 className="success-title">Booking Confirmed!</h2>
            <p className="success-message">Your payment has been processed successfully</p>
            <div className="success-details">
              <div className="detail-item">
                <span className="detail-label">Booking ID:</span>
                <span className="detail-value">{bookingId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Amount Paid:</span>
                <span className="detail-value">${total}</span>
              </div>
            </div>
            <div className="success-actions">
              <button className="action-button primary" onClick={() => navigate('/app/bookings')}>
                View My Bookings
              </button>
              <button className="action-button secondary" onClick={() => setStep('search')}>
                Search More Hotels
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function PaymentForm({ amount, onPay, onCancel, loading }: { amount: number; onPay: (method: 'upi' | 'card', details: any) => void; onCancel: () => void; loading: boolean; }) {
  const [method, setMethod] = useState<'upi' | 'card'>('upi');
  const [upi, setUpi] = useState('');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const upiValid = /\S+@\S+/.test(upi);
  const cardValid = card.number.replace(/\s/g,'').length >= 12 && card.name.trim().length>0 && /^\d{2}\/\d{2}$/.test(card.expiry) && /^\d{3,4}$/.test(card.cvv);
  const canPay = method==='upi' ? upiValid : cardValid;

  return (
    <section className="booking-details-form">
      <div className="booking-header">
        <h2 className="hotel-name-details">Complete Payment</h2>
        <p className="hotel-location-details">Secure payment processing</p>
        <div className="payment-amount-display">
          <span className="payment-amount">Amount to pay: ${amount}</span>
        </div>
      </div>

      <div className="room-selection-section">
        <h3 className="section-title">Select Payment Method</h3>
        <div className="form-group">
          <select 
            className="form-select"
            value={method} 
            onChange={(e) => setMethod(e.target.value as 'upi' | 'card')}
            required
          >
            <option value="upi">UPI Payment - Instant & Secure</option>
            <option value="card">Card Payment - Credit/Debit Card</option>
          </select>
        </div>
      </div>

      <div className="amenities-section">
        <h3 className="section-title">Payment Details</h3>
        {method === 'upi' ? (
          <div className="payment-form-grid">
            <div className="form-group">
              <label className="form-label">UPI ID</label>
              <input 
                className="form-input"
                placeholder="yourname@bank" 
                value={upi} 
                onChange={(e)=>setUpi(e.target.value)} 
                required 
              />
            </div>
          </div>
        ) : (
          <div className="payment-form-grid">
            <div className="form-group">
              <label className="form-label">Card Number</label>
              <input 
                className="form-input"
                placeholder="1234 5678 9012 3456" 
                value={card.number} 
                onChange={(e)=>setCard({...card, number: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Name on Card</label>
              <input 
                className="form-input"
                placeholder="Full Name" 
                value={card.name} 
                onChange={(e)=>setCard({...card, name: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Expiry Date</label>
              <input 
                className="form-input"
                placeholder="MM/YY" 
                value={card.expiry} 
                onChange={(e)=>setCard({...card, expiry: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">CVV</label>
              <input 
                className="form-input"
                placeholder="123" 
                value={card.cvv} 
                onChange={(e)=>setCard({...card, cvv: e.target.value})} 
                required 
              />
            </div>
          </div>
        )}
      </div>

      <div className="booking-summary">
        <div className="summary-content">
          <div className="booking-actions">
            <button className="action-button secondary" onClick={onCancel}>
              ← Back to Booking
            </button>
            <button 
              className="action-button primary" 
              disabled={loading || !canPay} 
              onClick={() => canPay && onPay(method, method==='upi'? { vpa: upi } : card)}
            >
              {loading ? 'Processing Payment...' : 'Pay Now →'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}