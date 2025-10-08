import React from 'react';
import { Card } from '../common';

interface BookingCardProps {
  booking: {
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
  };
  onCancel?: (bookingId: number) => void;
  onViewDetails?: (bookingId: number) => void;
  showActions?: boolean;
}

export default function BookingCard({
  booking,
  onCancel,
  onViewDetails,
  showActions = true,
}: BookingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'รอยืนยัน';
      case 'confirmed':
        return 'ยืนยันแล้ว';
      case 'cancelled':
        return 'ยกเลิกแล้ว';
      case 'completed':
        return 'เสร็จสิ้น';
      default:
        return status;
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="p-6 hover:shadow-xl transition-all duration-300 border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {booking.trainer.email}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{booking.trainer.role}</p>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
              {getStatusText(booking.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          {formatDateTime(booking.date, booking.time)}
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          ระยะเวลา {booking.duration} นาที
        </div>

        {booking.notes && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">หมายเหตุ:</span> {booking.notes}
          </div>
        )}
      </div>

      {showActions && (
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(booking.id)}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
            >
              ดูรายละเอียด
            </button>
          )}
          {onCancel && booking.status === 'pending' && (
            <button
              onClick={() => onCancel(booking.id)}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
            >
              ยกเลิก
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
