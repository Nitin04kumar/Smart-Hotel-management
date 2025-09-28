import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { Booking, Review } from '@/models/types';
import { addReview, listBookings, listReviews } from '@/services/hotel';
import { Star } from 'lucide-react';
import './reviews.css';

export default function UserReviewsPage() {
  useEffect(() => { document.title = 'Reviews & Rating | Smart Hotel'; }, []);
  const { auth } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    bookingId: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    // Only fetch if auth and user are available
    if (!auth?.user?.email) return;
    
    Promise.all([
      listBookings(auth.user.email),
      listReviews(auth.user.email),
    ]).then(([bks, revs]) => {
      // Ensure arrays are always arrays
      setReviews(Array.isArray(revs) ? revs : []);
      const reviewedBookingIds = new Set((Array.isArray(revs) ? revs : []).map((r) => r.bookingId));
      setBookings((Array.isArray(bks) ? bks : []).filter((b) => b.status === 'paid' && !reviewedBookingIds.has(b.id)));
    }).catch(()=>{
      setReviews([]);
      setBookings([]);
    });
  }, [auth?.user?.email]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'rating' ? Number(value) : value }));
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth?.user?.email || !form.bookingId) return;
    setLoading(true);
    const booking = bookings.find((b) => b.id === form.bookingId);
    if (!booking) return;
    try {
      const res = await addReview({ 
        bookingId: booking.id, 
        hotelId: booking.hotelId, 
        hotelName: booking.hotelName, 
        userEmail: auth.user.email, 
        rating: form.rating, 
        comment: form.comment 
      });
      setReviews((r) => [res, ...r]);
      setBookings((b) => b.filter((booking) => booking.id !== form.bookingId));
      // Reset form but keep a success message flow
      setForm({ bookingId: '', rating: 5, comment: '' });
      // Optional: Could add a success message here
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show simple message if not authenticated
  if (!auth?.user) {
    return (
      <div className="user-reviews-page space-y-6">
        <header>
          <h1>Reviews & Rating</h1>
          <p className="text-muted-foreground">Share your hotel experience and help other travelers.</p>
        </header>
        <div className="empty-state">
          <h3>Please login first</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="user-reviews-page space-y-6">
      <header>
        <h1>Reviews & Rating</h1>
        <p className="text-muted-foreground">Share your hotel experience and help other travelers.</p>
      </header>

      {/* Add Review Form - Always visible */}
      <form onSubmit={submitReview} className="review-form">
        <h2 className="form-title">
          <Star className="star-icon filled" />
          Add New Review
        </h2>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Select Hotel</label>
            <select 
              className="form-select"
              name="bookingId" 
              value={form.bookingId} 
              onChange={onChange} 
              required
            >
              <option value="">
                {Array.isArray(bookings) && bookings.length > 0 
                  ? "Select a hotel to review" 
                  : "No bookings available"}
              </option>
              {Array.isArray(bookings) && bookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.hotelName} - {b.roomType} ({new Date(b.checkin).toLocaleDateString()})
                </option>
              ))}
            </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Rating</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="star-button"
                    onClick={() => setForm({ ...form, rating: star })}
                  >
                    <Star 
                      className={`star-icon ${star <= form.rating ? 'filled' : 'empty'}`}
                      fill={star <= form.rating ? 'currentColor' : 'none'}
                    />
                  </button>
                ))}
                <span className="form-label ml-2">({form.rating}/5)</span>
              </div>
            </div>
            
            <div className="form-group">
              <button 
                className="submit-button" 
                disabled={loading || !form.bookingId || !form.rating}
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
          
        <div className="form-row-full">
          <div className="form-group">
            <label className="form-label">Your Review</label>
            <textarea 
              className="form-textarea"
              name="comment" 
              value={form.comment} 
              onChange={onChange} 
              placeholder={Array.isArray(bookings) && bookings.length > 0 
                ? "Share your experience with this hotel..." 
                : "Complete a hotel booking to write reviews"}
              required 
              disabled={!Array.isArray(bookings) || bookings.length === 0}
            />
          </div>
        </div>
      </form>

      {/* Reviews List */}
      <div className="reviews-list">
        <h2 className="form-title">Your Reviews</h2>
        {!Array.isArray(reviews) || reviews.length === 0 ? (
          <div className="empty-state">
            <h3>No reviews yet</h3>
            <p>Your reviews will appear here after you submit them.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-info">
                  <h3>{review.hotelName}</h3>
                  <p>{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="review-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className={`star-icon ${star <= review.rating ? 'filled' : 'empty'}`}
                      fill={star <= review.rating ? 'currentColor' : 'none'}
                      size={16}
                    />
                  ))}
                </div>
              </div>
              <div className="review-comment">{review.comment}</div>
              <div className="review-meta">
                Review #{review.id} • Rating: {review.rating}/5 stars
              </div>
              {review.reply && (
                <div className="mt-3 p-3 bg-muted rounded">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">Manager Reply:</div>
                  <p className="text-sm">{review.reply.text}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
