import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { Button, Input, Card } from "../../components/common";

interface User {
  id: number;
  email: string;
  username?: string;
  profileImage?: string;
  role: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Generate profile image based on email (deterministic)
  const getProfileImage = (email: string) => {
    const hash = email.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const avatarIndex = Math.abs(hash) % 6 + 1;
    return `/images/review${avatarIndex}.jpg`;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Parse JWT to get user info (simplified)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;

        const response = await fetch(`http://localhost:4000/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setUsername(userData.username || "");
          setProfileImage(userData.profileImage || "");
        } else {
          // Fallback: create user object from token
          setUser({
            id: payload.id,
            email: payload.email,
            username: payload.username,
            profileImage: payload.profileImage,
            role: payload.role
          });
          setUsername(payload.username || "");
          setProfileImage(payload.profileImage || "");
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;

      const response = await fetch(`http://localhost:4000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: username || null,
          profileImage: profileImage || null
        })
      });

      if (response.ok) {
        setSuccess('บันทึกการตั้งค่าเรียบร้อยแล้ว');
        // Update user state
        if (user) {
          setUser({ ...user, username, profileImage });
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'เกิดข้อผิดพลาดในการบันทึก');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('รหัสผ่านใหม่ไม่ตรงกัน');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:4000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      if (response.ok) {
        setSuccess('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว');
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            <p className="text-gray-500 mt-4">กำลังโหลด...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="text-center">
            <p className="text-red-500 text-lg">ไม่พบข้อมูลผู้ใช้</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-extrabold text-red-600 text-center mb-10">
          ตั้งค่าบัญชี
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            ✅ {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">ข้อมูลโปรไฟล์</h2>
            
            <div className="text-center mb-6">
              <img
                src={profileImage || getProfileImage(user.email)}
                alt={user.username || user.email}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-red-100 shadow-lg"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = getProfileImage(user.email);
                }}
              />
              <p className="text-sm text-gray-500">รูปโปรไฟล์ปัจจุบัน</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <Input
                label="อีเมล"
                type="email"
                value={user.email}
                disabled
                className="bg-gray-100"
              />

              <Input
                label="ชื่อผู้ใช้ (Username)"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ใส่ชื่อผู้ใช้ที่ต้องการ"
              />

              <Input
                label="URL รูปโปรไฟล์"
                type="url"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />

              <Button
                type="submit"
                variant="primary"
                disabled={saving}
                className="w-full"
              >
                {saving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
              </Button>
            </form>
          </Card>

          {/* Security Settings */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">ความปลอดภัย</h2>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="รหัสผ่านปัจจุบัน"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="ใส่รหัสผ่านปัจจุบัน"
              />

              <Input
                label="รหัสผ่านใหม่"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="ใส่รหัสผ่านใหม่"
                minLength={6}
              />

              <Input
                label="ยืนยันรหัสผ่านใหม่"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="ยืนยันรหัสผ่านใหม่"
              />

              <Button
                type="submit"
                variant="danger"
                disabled={saving}
                className="w-full"
              >
                {saving ? "กำลังเปลี่ยน..." : "เปลี่ยนรหัสผ่าน"}
              </Button>
            </form>
          </Card>
        </div>

        {/* Account Info */}
        <Card className="p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">ข้อมูลบัญชี</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">สถานะ:</span>
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                {user.role}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">วันที่สมัคร:</span>
              <span className="ml-2 text-gray-600">
                {new Date().toLocaleDateString('th-TH')}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

