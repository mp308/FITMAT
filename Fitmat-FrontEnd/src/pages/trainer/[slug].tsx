"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type ReviewUser = {
  id: number;
  email: string;
  role: string;
};

type TrainerReview = {
  id: number;
  comment: string;
  rating: number | null;
  createdAt: string;
  reviewer: ReviewUser;
};

type TrainerDetail = {
  trainer: {
    id: number;
    email: string;
    role: string;
  };
  totalReviews: number;
  averageRating: number | null;
  reviews: TrainerReview[];
};

export default function TrainerDetailPage() {
  const { slug } = useParams();
  const [trainer, setTrainer] = useState<TrainerDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [submitting, setSubmitting] = useState(false);

  // Generate profile image based on email (deterministic)
  const getProfileImage = (email: string) => {
    const hash = email.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const avatarIndex = Math.abs(hash) % 6 + 1;
    return `/images/review${avatarIndex}.jpg`;
  };

  // fake reviewer (จริงๆควรดึงจาก jwt user)
  const reviewerId = 1;

  // โหลดข้อมูลรีวิว
  useEffect(() => {
    if (!slug) return;

    const fetchTrainer = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:4000/api/reviews/trainer/${slug}`);
        if (!res.ok) {
          throw new Error("ไม่พบข้อมูลเทรนเนอร์");
        }
        const data = await res.json();
        setTrainer(data);
      } catch (err: any) {
        setError(err.message || "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [slug]);

  // ส่งรีวิวใหม่
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:4000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewerId,
          trainerId: Number(slug),
          comment,
          rating,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "ไม่สามารถบันทึกรีวิวได้");
      }

      const newReview = await res.json();

      // update state
      setTrainer((prev) =>
        prev
          ? {
              ...prev,
              reviews: [newReview, ...prev.reviews],
              totalReviews: prev.totalReviews + 1,
              averageRating:
                prev.reviews.length > 0
                  ? (prev.reviews.reduce((sum, r) => sum + (r.rating ?? 0), rating) +
                      rating) /
                    (prev.reviews.length + 1)
                  : rating,
            }
          : prev
      );

      setComment("");
      setRating(5);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center py-12">กำลังโหลด...</p>;
  if (error) return <p className="text-center text-red-500 py-12">❌ {error}</p>;
  if (!trainer) return null;

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      {/* Trainer Info */}
      <div className="bg-white shadow-lg rounded-xl p-8 text-center">
        <img
          src={getProfileImage(trainer.trainer.email)}
          alt={`เทรนเนอร์ ${trainer.trainer.email}`}
          className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-red-100 shadow-lg"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/images/review1.jpg";
          }}
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{trainer.trainer.email}</h1>
        <p className="text-gray-600 mb-4">{trainer.trainer.role}</p>
        
        <div className="flex justify-center mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              viewBox="0 0 20 20"
              className={`w-6 h-6 ${trainer.averageRating && i < Math.round(trainer.averageRating) ? "text-yellow-400" : "text-gray-300"} fill-current`}
            >
              <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
            </svg>
          ))}
        </div>
        
        <p className="text-sm text-gray-500 mb-2">
          รวมรีวิวทั้งหมด {trainer.totalReviews}
        </p>
        <p className="text-sm text-gray-500">
          ค่าเฉลี่ย {trainer.averageRating ? trainer.averageRating.toFixed(2) : "-"} ⭐
        </p>
      </div>

      {/* Review Form */}
{/* Review Form */}
<section className="bg-white p-6 rounded-xl shadow">
  <h2 className="text-lg font-bold mb-4">เขียนรีวิว</h2>
  <form onSubmit={handleSubmitReview} className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-2">Rating</label>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => {
          const starValue = i + 1;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setRating(starValue)}
              className="focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill={starValue <= rating ? "gold" : "lightgray"}
                className="w-8 h-8 cursor-pointer transition-colors"
              >
                <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
              </svg>
            </button>
          );
        })}
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">Comment</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        rows={3}
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>

    <button
      type="submit"
      disabled={submitting}
      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
    >
      {submitting ? "กำลังส่ง..." : "ส่งรีวิว"}
    </button>
  </form>
</section>


      {/* Review List */}
      <section className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-lg font-bold mb-4">รีวิวล่าสุด</h2>
        {trainer.reviews.length === 0 ? (
          <p className="text-gray-500">ยังไม่มีรีวิว</p>
        ) : (
          <ul className="space-y-6">
            {trainer.reviews.map((review) => (
              <li
                key={review.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={getProfileImage(review.reviewer.email)}
                    alt={review.reviewer.email}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/review1.jpg";
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">
                        {review.reviewer.email.split('@')[0]}
                      </span>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            viewBox="0 0 20 20"
                            className={`w-4 h-4 ${review.rating && i < (review.rating || 0) ? "text-yellow-400" : "text-gray-300"} fill-current`}
                          >
                            <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
                          </svg>
                        ))}
                        {review.rating && (
                          <span className="text-sm text-gray-600">({review.rating}/5)</span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2 leading-relaxed">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
