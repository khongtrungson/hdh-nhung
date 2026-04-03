# SmartDoor Mobile App — Migration Specs

## Mục tiêu

Migrate toàn bộ tính năng từ web frontend (`fe/`) sang React Native (Expo) cho mobile (iOS & Android), giữ nguyên logic nghiệp vụ và trải nghiệm người dùng.

---

## Tech Stack

| Thành phần | Lựa chọn | Lý do |
|---|---|---|
| Framework | React Native (Expo SDK) | Cross-platform iOS/Android |
| Navigation | React Navigation v7 (Stack + Bottom Tabs) | Thay thế React Router |
| HTTP Client | Axios | Giữ nguyên như fe/ |
| WebSocket | Native `WebSocket` API | Giữ nguyên logic từ `useWebSocket.js` |
| Auth State | React Context API | Giữ nguyên `AuthContext` |
| Storage | `expo-secure-store` | Thay thế `localStorage` (an toàn hơn) |
| Styling | StyleSheet / NativeWind | Thay thế Tailwind CSS |
| JWT Decode | `jwt-decode` | Giữ nguyên logic từ `utils/jwt.js` |

---

## Cấu trúc thư mục

```
app/
├── src/
│   ├── api/
│   │   └── axios.js             # Axios instance + JWT interceptor (port từ fe/)
│   ├── context/
│   │   └── AuthContext.jsx      # Auth state + login/logout (port từ fe/)
│   ├── hooks/
│   │   └── useWebSocket.js      # WebSocket hook (port từ fe/)
│   ├── navigation/
│   │   ├── AppNavigator.jsx     # Root navigator (auth check)
│   │   ├── AdminNavigator.jsx   # Bottom tab navigator cho admin
│   │   └── UserNavigator.jsx    # Stack navigator cho user
│   ├── screens/
│   │   ├── LoginScreen.jsx      # → LoginPage.jsx
│   │   ├── DashboardScreen.jsx  # → DashboardPage.jsx
│   │   ├── UsersScreen.jsx      # → UsersPage.jsx
│   │   ├── HistoryScreen.jsx    # → HistoryPage.jsx
│   │   └── UserHomeScreen.jsx   # → UserHomePage.jsx
│   ├── components/
│   │   ├── DoorStatus.jsx       # → DoorStatus.jsx
│   │   ├── DoorControl.jsx      # → DoorControl.jsx
│   │   ├── SystemLock.jsx       # → SystemLock.jsx
│   │   ├── NotificationList.jsx # → NotificationList.jsx
│   │   ├── UserTable.jsx        # → UserTable.jsx
│   │   ├── UserForm.jsx         # → UserForm.jsx
│   │   └── HistoryTable.jsx     # → HistoryTable.jsx
│   └── utils/
│       ├── constants.js         # API_URL, WS_URL config
│       └── jwt.js               # JWT decode utility
├── app.json                     # Expo config
├── package.json
└── App.jsx                      # Entry point
```

---

## Screens & Navigation

### Navigation structure

```
AppNavigator
├── (chưa đăng nhập) → LoginScreen
└── (đã đăng nhập)
    ├── role=admin → AdminNavigator (Bottom Tabs)
    │   ├── Tab "Dashboard" → DashboardScreen
    │   ├── Tab "Users"     → UsersScreen
    │   └── Tab "History"   → HistoryScreen
    └── role=user → UserNavigator (Stack)
        └── UserHomeScreen
```

### 1. LoginScreen

**Nguồn:** `fe/src/pages/LoginPage.jsx`

**UI:**
- Logo / app name "SmartDoor" ở trên
- TextInput: Username
- TextInput: Password (secureTextEntry)
- Button "Đăng nhập" (loading state khi đang gọi API)
- Text hiển thị lỗi nếu đăng nhập thất bại

**Logic:**
- `POST /auth/login` với `{ username, password }`
- Response: `{ access_token, role, full_name }`
- Lưu `access_token` và `full_name` vào `expo-secure-store`
- Gọi `AuthContext.login(token, role, fullName)`
- Điều hướng: admin → AdminNavigator, user → UserNavigator

---

### 2. DashboardScreen (Admin)

**Nguồn:** `fe/src/pages/DashboardPage.jsx`

**UI:**
- Section "Trạng thái cửa": component `DoorStatus`
- Section "Điều khiển": component `DoorControl`
- Section "Khóa hệ thống": component `SystemLock`
- Section "Thông báo": component `NotificationList` (ScrollView, tối đa 50 items)

**Logic:**
- Fetch `GET /door/status` khi mount → khởi tạo `doorStatus` và `isLocked`
- Nhận real-time updates từ WebSocket qua `useWebSocket` hook
- Props truyền xuống components: `doorStatus`, `isLocked`, `notifications`, setters

---

### 3. UsersScreen (Admin)

**Nguồn:** `fe/src/pages/UsersPage.jsx`

**UI:**
- Header bar với tiêu đề "Quản lý người dùng" + Button "Thêm người dùng"
- `UserForm` (hiển thị dạng Modal hoặc bottom sheet khi thêm/sửa)
- `UserTable` (FlatList)

**Logic:**
- `GET /users` khi mount
- `POST /users` — tạo mới
- `PUT /users/{id}` — cập nhật
- `DELETE /users/{id}` — xóa (hiển thị `Alert.alert` xác nhận trước khi xóa)
- Sau mỗi thao tác CRUD: re-fetch danh sách users

---

### 4. HistoryScreen (Admin)

**Nguồn:** `fe/src/pages/HistoryPage.jsx`

**UI:**
- Picker/dropdown lọc theo phương thức: "Tất cả", "Thẻ RFID", "Web"
- `HistoryTable` (FlatList)

**Logic:**
- `GET /history` khi mount và khi thay đổi filter
- Query param: `?method=rfid` hoặc `?method=web` (bỏ qua nếu "Tất cả")

---

### 5. UserHomeScreen (User)

**Nguồn:** `fe/src/pages/UserHomePage.jsx`

**UI:**
- Card trung tâm
- `DoorStatus` — trạng thái cửa hiện tại
- `DoorControl` — nút mở/đóng cửa
- Text thông báo nếu hệ thống đang bị khóa

**Logic:**
- Fetch `GET /door/status` khi mount
- Dùng WebSocket để cập nhật real-time giống DashboardScreen
- Không có quyền quản lý users hoặc xem history

---

## Components

### DoorStatus

**Nguồn:** `fe/src/components/DoorStatus.jsx`

| Status | Màu | Hiệu ứng |
|---|---|---|
| `opened` | Xanh lá | Tĩnh |
| `opening` | Vàng | Nhấp nháy (Animated) |
| `closed` | Xám | Tĩnh |
| `closing` | Vàng | Nhấp nháy (Animated) |

- Thay `animate-pulse` (CSS) → `Animated.loop` với `Animated.sequence`

---

### DoorControl

**Nguồn:** `fe/src/components/DoorControl.jsx`

- Button "Mở cửa": `POST /door/open`
- Button "Đóng cửa": `POST /door/close`
- Disable logic:
  - Mở: disabled nếu `isLocked || doorStatus === 'opened' || doorStatus === 'opening'`
  - Đóng: disabled nếu `doorStatus === 'closed' || doorStatus === 'closing'`
- Loading flag ngăn gọi đồng thời

---

### SystemLock

**Nguồn:** `fe/src/components/SystemLock.jsx`

- Toggle button Khóa/Mở khóa hệ thống
- `POST /door/lock` hoặc `POST /door/unlock`
- Màu: cam khi đang khóa, xanh dương khi mở khóa
- Loading flag ngăn gọi đồng thời

---

### NotificationList

**Nguồn:** `fe/src/components/NotificationList.jsx`

- FlatList tối đa 50 thông báo
- Màu theo category:
  - `access` → xanh lá
  - `alert` → đỏ
  - `motion` → vàng
- Hiển thị: message + timestamp (định dạng tiếng Việt, `toLocaleString('vi-VN')`)

---

### UserTable

**Nguồn:** `fe/src/components/UserTable.jsx`

FlatList với các cột:
- ID, Username, Họ tên, Role (badge), Card UID, Trạng thái, Hành động (Sửa / Xóa)

Badge:
- Role: admin (tím), user (xanh dương)
- Trạng thái: active (xanh lá), locked (đỏ)

---

### UserForm

**Nguồn:** `fe/src/components/UserForm.jsx`

Hiển thị dạng Modal:
- TextInput: Username (disabled khi edit)
- TextInput: Password (secureTextEntry, optional khi edit)
- TextInput: Họ tên
- Picker: Role (`admin` | `user`)
- TextInput: Card UID (optional)
- Buttons: Lưu / Hủy

Validation:
- Bỏ qua password khi cập nhật nếu để trống
- Gửi `card_uid: null` nếu để trống

---

### HistoryTable

**Nguồn:** `fe/src/components/HistoryTable.jsx`

FlatList với các cột:
- Thời gian, Người dùng, Hành động, Phương thức, Card UID, Kết quả

Mapping:
- `rfid` → "Thẻ RFID", `web` → "Web"
- `open` → "Mở cửa", `close` → "Đóng cửa"
- Badge kết quả: success (xanh lá), failure (đỏ)

---

## API

Base URL cấu hình trong `utils/constants.js` (thay thế Vite proxy bằng biến môi trường Expo):

```js
// utils/constants.js
import Constants from 'expo-constants';

export const API_URL = Constants.expoConfig.extra.apiUrl; // e.g. http://192.168.x.x:8000/api
export const WS_URL  = Constants.expoConfig.extra.wsUrl;  // e.g. ws://192.168.x.x:8000/ws
```

Cấu hình trong `app.json`:
```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://192.168.x.x:8000/api",
      "wsUrl":  "ws://192.168.x.x:8000/ws"
    }
  }
}
```

| Method | Endpoint | Mục đích |
|---|---|---|
| POST | `/auth/login` | Đăng nhập |
| GET | `/door/status` | Lấy trạng thái cửa + khóa |
| POST | `/door/open` | Mở cửa |
| POST | `/door/close` | Đóng cửa |
| POST | `/door/lock` | Khóa hệ thống |
| POST | `/door/unlock` | Mở khóa hệ thống |
| GET | `/users` | Danh sách users |
| POST | `/users` | Tạo user |
| PUT | `/users/{id}` | Cập nhật user |
| DELETE | `/users/{id}` | Xóa user |
| GET | `/history?method={method}` | Lịch sử truy cập |

---

## WebSocket

**Nguồn:** `fe/src/hooks/useWebSocket.js`

- Endpoint: `{WS_URL}/client?token={token}`
- Auto-reconnect sau 3 giây khi mất kết nối
- State: `doorStatus`, `isLocked`, `notifications` (tối đa 50 items)

Message types từ server:

```js
{ type: "door_status", status: "opened" | "opening" | "closed" | "closing" }
{ type: "system_state", is_locked: boolean }
{ type: "notification", message: string, category: "access" | "alert" | "motion" }
```

---

## Authentication

**Nguồn:** `fe/src/context/AuthContext.jsx` + `fe/src/api/axios.js`

- `AuthContext` giữ nguyên: `user` state `{ id, role, fullName }`, `login()`, `logout()`
- Thay `localStorage` → `expo-secure-store`:
  - `SecureStore.setItemAsync('token', token)`
  - `SecureStore.setItemAsync('fullName', fullName)`
  - `SecureStore.getItemAsync('token')` khi khởi động app
  - `SecureStore.deleteItemAsync('token')` khi logout
- Axios interceptor: attach `Authorization: Bearer {token}` cho mọi request
- 401 response: xóa token, reset auth state, điều hướng về LoginScreen
- JWT decode để lấy `exp` và `role` (dùng `jwt-decode` library)

---

## Khác biệt so với Web (cần xử lý)

| Vấn đề | Web (fe/) | Mobile (app/) |
|---|---|---|
| Storage | `localStorage` | `expo-secure-store` |
| Routing | React Router | React Navigation |
| Styling | Tailwind CSS | StyleSheet / NativeWind |
| Animation | CSS `animate-pulse` | `Animated` API |
| Confirm dialog | `window.confirm()` | `Alert.alert()` |
| Error alert | `window.alert()` | `Alert.alert()` |
| Dropdown/Select | `<select>` | `@react-native-picker/picker` |
| Table layout | CSS Grid/Flex | `FlatList` + custom row |
| Modal/Form | Inline conditional render | `Modal` component |
| WS protocol | Auto-detect `wss`/`ws` từ `window.location` | Hardcode từ config |
| Vite proxy | Cấu hình trong `vite.config.js` | Dùng IP thực trong `app.json` |

---

## Packages cần cài

```bash
npx create-expo-app app --template blank

# Navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# HTTP & Auth
npm install axios jwt-decode expo-secure-store

# UI
npm install @react-native-picker/picker

# (Optional) NativeWind nếu muốn dùng Tailwind-like syntax
npm install nativewind tailwindcss
```

---

## Thứ tự implement

1. Khởi tạo Expo project (`npx create-expo-app`)
2. Cài dependencies
3. Port `utils/constants.js` + `utils/jwt.js`
4. Port `api/axios.js` (thay `localStorage` → `SecureStore`)
5. Port `context/AuthContext.jsx` (thay `localStorage` → `SecureStore`)
6. Port `hooks/useWebSocket.js`
7. Setup navigation (`AppNavigator`, `AdminNavigator`, `UserNavigator`)
8. Implement `LoginScreen`
9. Implement components: `DoorStatus`, `DoorControl`, `SystemLock`, `NotificationList`
10. Implement `DashboardScreen` + `UserHomeScreen`
11. Implement `UserForm`, `UserTable` → `UsersScreen`
12. Implement `HistoryTable` → `HistoryScreen`
13. Test kết nối API + WebSocket với backend thực
