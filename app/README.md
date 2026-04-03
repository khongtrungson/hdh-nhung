# SmartDoor - Mobile App

Ứng dụng React Native (Expo) cho hệ thống SmartDoor.

## Yêu cầu

- [Node.js](https://nodejs.org/) >= 18
- [Expo CLI](https://docs.expo.dev/get-started/installation/): `npm install -g expo-cli`
- Thiết bị Android/iOS thật hoặc emulator

## Cài đặt

```bash
cd app
npm install
```

## Cấu hình

Mở file `app.json`, chỉnh lại địa chỉ IP server cho khớp với máy chủ backend:

```json
"extra": {
  "apiUrl": "http://<IP_SERVER>:8000/api",
  "wsUrl": "ws://<IP_SERVER>:8000/ws"
}
```

> Lưu ý: Thiết bị chạy app và máy chủ backend phải cùng mạng LAN.

## Chạy ứng dụng

### Dùng Expo Go (khuyến nghị khi phát triển)

1. Cài app **Expo Go** trên điện thoại ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
2. Chạy lệnh:

```bash
npx expo start
```

3. Quét QR code hiện trên terminal bằng app Expo Go

### Chạy trên Android Emulator

```bash
npx expo start --android
```

> Yêu cầu Android Studio đã cài và emulator đang chạy.

### Chạy trên iOS Simulator

```bash
npx expo start --ios
```

> Yêu cầu macOS và Xcode đã cài.

## Cấu trúc thư mục

```
app/
├── App.jsx              # Entry point
├── app.json             # Cấu hình Expo (tên app, API URL, ...)
├── src/
│   ├── api/             # Gọi API backend
│   ├── components/      # UI components dùng chung
│   ├── context/         # React Context (state toàn cục)
│   ├── hooks/           # Custom hooks
│   ├── navigation/      # Cấu hình điều hướng
│   ├── screens/         # Các màn hình
│   └── utils/           # Hàm tiện ích
└── package.json
```
