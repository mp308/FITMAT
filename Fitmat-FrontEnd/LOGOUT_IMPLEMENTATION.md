# ระบบ Logout - Backend & Frontend

## 🎯 สรุปการทำระบบ Logout

### ✅ Backend Implementation

#### 1. **Auth Controller** (`Fitmat-BackEnd/src/controllers/auth.controller.ts`)
```typescript
export const logout = async (req: Request, res: Response) => {
  try {
    // สำหรับ JWT stateless authentication
    // เราจะส่ง response กลับไปให้ client ลบ token ออกจาก localStorage
    
    // หากต้องการ blacklist token (optional)
    // สามารถเก็บ token ที่ถูก revoke ไว้ใน database หรือ Redis
    
    return res.status(200).json({ 
      message: "Logged out successfully.",
      success: true 
    });
  } catch (error) {
    console.error("Error during logout", error);
    return res.status(500).json({ message: "Failed to logout." });
  }
};
```

#### 2. **Auth Routes** (`Fitmat-BackEnd/src/routes/auth.routes.ts`)
```typescript
import { login, register, requestPasswordReset, resetPassword, logout } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);  // ✅ เพิ่ม logout route
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
```

### ✅ Frontend Implementation

#### 1. **Auth Utilities** (`Fitmat-FrontEnd/src/utils/auth.ts`)
สร้าง utility functions สำหรับจัดการ authentication:

```typescript
// ฟังก์ชันหลัก
export async function logout(): Promise<void> {
  try {
    await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "logout",
      }),
    });
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    // Always clear local auth data
    clearAuth();
  }
}

// Helper functions
export function clearAuth(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}

export function getCurrentUser(): User | null {
  const token = localStorage.getItem("token");
  if (!token || !isTokenValid(token)) {
    clearAuth();
    return null;
  }
  // ... parse token and return user data
}
```

#### 2. **Header Component** (`Fitmat-FrontEnd/components/Layout/Header.tsx`)
เพิ่มปุ่ม logout และฟังก์ชันจัดการ:

```typescript
const handleLogout = async () => {
  setIsLoggingOut(true);
  try {
    await authLogout();
    
    // รีเซ็ต state
    setUser(null);
    
    // Redirect ไปหน้า home
    window.location.href = "/";
  } catch (error) {
    console.error("Logout error:", error);
    setUser(null);
    window.location.href = "/";
  } finally {
    setIsLoggingOut(false);
  }
};
```

#### 3. **UI Elements**
- **Desktop**: แสดงชื่อผู้ใช้และปุ่ม "ออกจากระบบ"
- **Mobile**: แสดงในเมนู mobile พร้อมปุ่ม logout
- **Loading State**: แสดง "กำลังออก..." ขณะ logout

### 🔧 API Routes

#### Frontend API Route (`Fitmat-FrontEnd/src/pages/api/auth.ts`)
```typescript
if (action === "logout") {
  // Stateless JWT logout simply responds success so client can clear credentials.
  return res.status(200).json({ success: true });
}
```

### 🎨 UI/UX Features

#### 1. **Visual Indicators**
- แสดงชื่อผู้ใช้ใน header
- ปุ่ม logout ที่มี hover effects
- Loading state ขณะ logout
- Responsive design สำหรับ mobile

#### 2. **Security Features**
- ลบ token จาก localStorage ทันที
- รีเซ็ต state หลังจาก logout
- Redirect ไปหน้า home หลังจาก logout
- Error handling ที่ปลอดภัย

#### 3. **User Experience**
- Smooth transitions
- Clear feedback
- Consistent behavior
- Mobile-friendly

### 🔒 Security Considerations

#### 1. **Token Management**
- ลบ token จาก localStorage ทันที
- ไม่เก็บ token ใน memory หลังจาก logout
- รีเซ็ต authentication state

#### 2. **Error Handling**
- แม้ว่า API จะไม่สำเร็จก็ยังลบ token ออก
- ไม่แสดง sensitive information ใน error messages
- Graceful fallback behavior

#### 3. **State Management**
- รีเซ็ต user state หลังจาก logout
- อัพเดท UI ทันทีหลังจาก logout
- Clear navigation state

### 📱 Responsive Design

#### Desktop View
```typescript
{user && (
  <div className="flex items-center gap-4">
    <span className="text-white/80 text-sm">
      สวัสดี, {user.email}
    </span>
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoggingOut ? "กำลังออก..." : "ออกจากระบบ"}
    </button>
  </div>
)}
```

#### Mobile View
```typescript
{user && (
  <>
    <div className="border-t border-red-500 pt-4 mt-2">
      <div className="text-white/80 text-sm mb-3">
        สวัสดี, {user.email}
      </div>
      <button
        onClick={() => {
          handleLogout();
          setOpen(false);
        }}
        disabled={isLoggingOut}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full"
      >
        {isLoggingOut ? "กำลังออก..." : "ออกจากระบบ"}
      </button>
    </div>
  </>
)}
```

### 🚀 การใช้งาน

#### 1. **สำหรับผู้ใช้**
- คลิกปุ่ม "ออกจากระบบ" ใน header
- ระบบจะลบข้อมูลการ login และ redirect ไปหน้า home
- สามารถ login ใหม่ได้ทันที

#### 2. **สำหรับ Developer**
```typescript
import { logout, clearAuth, getCurrentUser } from '../utils/auth';

// Logout
await logout();

// Manual clear (if needed)
clearAuth();

// Check current user
const user = getCurrentUser();
```

### ✅ ผลลัพธ์ที่ได้

1. **ระบบ Logout ครบถ้วน** - ทั้ง backend และ frontend
2. **Security** - ลบ token และข้อมูล sensitive ทันที
3. **User Experience** - UI/UX ที่ดีและใช้งานง่าย
4. **Responsive** - ใช้งานได้ทุกขนาดหน้าจอ
5. **Error Handling** - จัดการ error ได้ดี
6. **Code Quality** - Code ที่ clean และ maintainable

### 🔄 Flow การทำงาน

1. **User คลิกปุ่ม Logout**
2. **Frontend เรียก API logout**
3. **Backend ตอบกลับ success**
4. **Frontend ลบ token จาก localStorage**
5. **Frontend รีเซ็ต user state**
6. **Frontend redirect ไปหน้า home**
7. **User สามารถ login ใหม่ได้**

ระบบ logout ตอนนี้พร้อมใช้งานแล้ว! 🎉
