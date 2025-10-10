"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useParams } from "next/navigation";
// import { Header } from "../../../components"; // ยังไม่ใช้ ถ้าจะใช้ค่อย uncomment

type ReviewUser = {
  id: number;
  email: string;
  role: string;
  profileImage?: any | null; // รองรับ string / Buffer-like
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
    profileImage?: any | null; // รองรับ string / Buffer-like
  };
  totalReviews: number;
  averageRating: number | null;
  reviews: TrainerReview[];
};

type TokenPayload = {
  id?: number;
  role?: string;
  exp?: number;
  email?: string;
};

// ==========================
// helpers: image utilities
// ==========================
const bufferLikeToDataUrl = (bufLike: any, mime = "image/jpeg") => {
  // รองรับรูปแบบ { type: 'Buffer', data: number[] }
  if (
    bufLike &&
    typeof bufLike === "object" &&
    bufLike.type === "Buffer" &&
    Array.isArray(bufLike.data)
  ) {
    const byteArray = new Uint8Array(bufLike.data);
    let binary = "";
    for (let i = 0; i < byteArray.length; i++) binary += String.fromCharCode(byteArray[i]);
    const base64 = btoa(binary);
    return `data:${mime};base64,${base64}`;
  }
  return null;
};

const getFallbackImage = (email: string) => {
  // อวตารสำรองแบบ deterministic จากอีเมล
  const hash = email.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
  const avatarIndex = Math.abs(hash) % 6 + 1;
  return `/images/review${avatarIndex}.jpg`;
};

/**
 * รวมเคสทั้งหมด:
 * - data URL: data:image...
 * - http(s) URL
 * - base64 ล้วน (เติมหัว data:image/jpeg;base64,)
 * - Buffer-like {type:'Buffer', data:[...]}
 * - ถ้าไม่มี -> fallback ตามอีเมล
 */
const resolveImageSrc = (email: string, profileImage?: any) => {
  if (profileImage) {
    if (typeof profileImage === "string") {
      const s = profileImage.trim();
      if (s.startsWith("data:image")) return s; // data URL แล้ว
      if (s.startsWith("http")) return s;       // URL ภายนอก
      if (s.includes("base64,")) {
        // อาจเป็น "data:image/png;base64,..." หรือเผลอส่งมาเป็น "image/png;base64,..."
        return s.startsWith("data:") ? s : `data:${s}`;
      }
      // กรณีเป็น base64 ล้วน
      return `data:image/jpeg;base64,${s}`;
    }

    // ถ้าเป็น Buffer-like object
    const fromBuf = bufferLikeToDataUrl(profileImage);
    if (fromBuf) return fromBuf;
  }

  // fallback
  return getFallbackImage(email);
};

// เรียกใช้งานแบบส่ง object ทั้งก้อน (อ่าน email + profileImage)
const getAvatarSrc = (u?: { email?: string; profileImage?: any }) => {
  const email = u?.email ?? "no-email@example.com";
  return resolveImageSrc(email, u?.profileImage);
};

export default function TrainerDetailPage() {
  const params = useParams();
  const slug = (params?.slug ?? "") as string | string[];
  const trainerIdStr = Array.isArray(slug) ? slug[0] : slug;
  const [trainer, setTrainer] = useState<TrainerDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<TokenPayload | null>(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [submitting, setSubmitting] = useState(false);

  function parseJwt(token: string): TokenPayload | null {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload) as TokenPayload;
    } catch (_error) {
      return null;
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    const payload = parseJwt(storedToken);
    if (payload && (!payload.exp || payload.exp * 1000 > Date.now())) {
      setUser(payload);
    }
  }, []);

  // ดึงข้อมูลเทรนเนอร์ตาม slug
  useEffect(() => {
    if (!trainerIdStr) return;

    const fetchTrainer = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:4000/api/reviews/trainer/${trainerIdStr}`);
        if (!res.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลเทรนเนอร์ได้");
        }
        const data = await res.json();
        setTrainer(data);
      } catch (err: any) {
        setError(err.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [trainerIdStr]);

  // ส่งรีวิว
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainerIdStr) return;

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:4000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewerId: user?.id,
          trainerId: Number(trainerIdStr),
          comment,
          rating,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "ไม่สามารถบันทึกรีวิวได้");
      }

      const newReview: TrainerReview = await res.json();

      // อัปเดต state ในหน้าทันที
      setTrainer((prev) =>
        prev
          ? {
              ...prev,
              reviews: [newReview, ...prev.reviews],
              totalReviews: prev.totalReviews + 1,
              // ปรับสูตรค่าเฉลี่ยถูกต้อง
              averageRating:
                prev.averageRating != null
                  ? (prev.averageRating * prev.totalReviews + (rating || 0)) /
                    (prev.totalReviews + 1)
                  : rating,
            }
          : prev
      );

      await Swal.fire({
        icon: "success",
        title: "ส่งรีวิวสำเร็จ",
        text: "ขอบคุณสำหรับความคิดเห็นของคุณ",
        confirmButtonColor: "#ef4444",
      });

      setComment("");
      setRating(5);
    } catch (err: any) {
      await Swal.fire({
        icon: "error",
        title: "ส่งรีวิวไม่สำเร็จ",
        text: err instanceof Error ? err.message : "กรุณาลองใหม่อีกครั้ง",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center py-12">กำลังโหลด...</p>;
  if (error) return <p className="text-center text-red-500 py-12">ผิดพลาด: {error}</p>;
  if (!trainer) return null;

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      {/* ข้อมูลเทรนเนอร์ */}
      <div className="bg-white shadow-lg rounded-xl p-8 text-center">
        <img
          src={getAvatarSrc(trainer?.trainer)}
          alt={`รูปโปรไฟล์ของ ${trainer?.trainer?.email ?? ""}`}
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
              className={`w-6 h-6 ${
                trainer.averageRating && i < Math.round(trainer.averageRating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              } fill-current`}
            >
              <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
            </svg>
          ))}
        </div>

        <p className="text-sm text-gray-500 mb-2">จำนวนรีวิวทั้งหมด {trainer.totalReviews}</p>
        <p className="text-sm text-gray-500">
          คะแนนเฉลี่ย {trainer.averageRating ? trainer.averageRating.toFixed(2) : "-"} / 5
        </p>
      </div>

      {/* ฟอร์มรีวิว */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">เขียนรีวิว</h2>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">คะแนน</label>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const starValue = i + 1;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(starValue)}
                    className="focus:outline-none"
                    aria-label={`ให้คะแนน ${starValue} ดาว`}
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
            <label className="block text-sm font-medium mb-1">ความคิดเห็น</label>
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
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-70"
          >
            {submitting ? "กำลังส่ง..." : "ส่งรีวิว"}
          </button>
        </form>
      </section>

      {/* รายการรีวิว */}
      <section className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-lg font-bold mb-4">รายการรีวิว</h2>
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
                    src={getAvatarSrc(review.reviewer)}
                    alt={review.reviewer.email}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/review1.jpg";
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">
                        {review.reviewer.email.split("@")[0]}
                      </span>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            viewBox="0 0 20 20"
                            className={`w-4 h-4 ${
                              review.rating && i < (review.rating || 0)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            } fill-current`}
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
                      {new Date(review.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
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
