import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { BookingCard } from '../../components/booking';
import { Button } from '../../components/common';

interface Booking {
  id: number;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  trainer: {
    id: number;
    email: string;
    role: string;
  };
  createdAt: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all');

  // Mock data for demonstration
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockBookings: Booking[] = [
        {
          id: 1,
          date: '2024-01-15',
          time: '09:00',
          duration: 60,
          status: 'confirmed',
          notes: 'ต้องการเน้นการออกกำลังกายส่วนบน',
          trainer: {
            id: 1,
            email: 'trainer1@example.com',
            role: 'Personal Trainer'
          },
          createdAt: '2024-01-10T10:00:00Z'
        },
        {
          id: 2,
          date: '2024-01-20',
          time: '14:00',
          duration: 90,
          status: 'pending',
          trainer: {
            id: 2,
            email: 'trainer2@example.com',
            role: 'Fitness Coach'
          },
          createdAt: '2024-01-12T15:30:00Z'
        },
        {
          id: 3,
          date: '2024-01-08',
          time: '16:00',
          duration: 60,
          status: 'completed',
          trainer: {
            id: 3,
            email: 'trainer3@example.com',
            role: 'Yoga Instructor'
          },
          createdAt: '2024-01-05T12:00:00Z'
        }
      ];
      setBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredBookings = bookings.filter(booking => 
    filter === 'all' || booking.status === filter
  );

  const handleCancel = async (bookingId: number) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะยกเลิกการจองนี้?')) {
      try {
        // Here you would typically send a request to your backend
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' as const }
            : booking
        ));
        alert('ยกเลิกการจองเรียบร้อยแล้ว');
      } catch (error) {
        console.error('Cancel booking failed:', error);
        alert('การยกเลิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      }
    }
  };

  const handleViewDetails = (bookingId: number) => {
    // Here you could open a modal or navigate to a details page
    console.log('View details for booking:', bookingId);
  };

  const getFilterButtonClass = (filterType: string) => {
    const baseClass = "px-4 py-2 rounded-lg font-semibold transition-all duration-200";
    const isActive = filter === filterType;
    
    if (isActive) {
      return `${baseClass} bg-red-500 text-white shadow-lg`;
    }
    
    return `${baseClass} bg-gray-100 text-gray-700 hover:bg-gray-200`;
  };

  const getStatusCounts = () => {
    return {
      all: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      completed: bookings.filter(b => b.status === 'completed').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              การจองของฉัน
            </h1>
            <p className="text-gray-600 text-lg">
              จัดการการจองและติดตามสถานะ
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setFilter('all')}
                className={getFilterButtonClass('all')}
              >
                ทั้งหมด ({statusCounts.all})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={getFilterButtonClass('pending')}
              >
                รอยืนยัน ({statusCounts.pending})
              </button>
              <button
                onClick={() => setFilter('confirmed')}
                className={getFilterButtonClass('confirmed')}
              >
                ยืนยันแล้ว ({statusCounts.confirmed})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={getFilterButtonClass('completed')}
              >
                เสร็จสิ้น ({statusCounts.completed})
              </button>
              <button
                onClick={() => setFilter('cancelled')}
                className={getFilterButtonClass('cancelled')}
              >
                ยกเลิก ({statusCounts.cancelled})
              </button>
            </div>
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
              <p className="text-gray-500 mt-4">กำลังโหลด...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md mx-auto">
                ❌ {error}
              </div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 border border-gray-200 text-gray-700 px-6 py-8 rounded-lg max-w-md mx-auto">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-semibold mb-2">
                  {filter === 'all' ? 'ยังไม่มีการจอง' : `ไม่มีการจองในสถานะ ${filter}`}
                </h3>
                <p className="text-gray-500 mb-4">
                  {filter === 'all' 
                    ? 'เริ่มต้นการจองเทรนเนอร์ของคุณ' 
                    : 'ลองดูสถานะอื่นๆ'
                  }
                </p>
                {filter === 'all' && (
                  <Button href="/trainer" variant="primary">
                    จองเทรนเนอร์
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancel}
                  onViewDetails={handleViewDetails}
                  showActions={true}
                />
              ))}
            </div>
          )}

          {/* Quick Actions */}
          {bookings.length > 0 && (
            <div className="mt-12 text-center">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ต้องการจองเพิ่มเติม?
                </h3>
                <Button href="/trainer" variant="primary" size="lg">
                  จองเทรนเนอร์คนใหม่
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
