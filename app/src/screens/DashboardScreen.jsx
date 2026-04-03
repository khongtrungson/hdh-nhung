import { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import api from '../api/axios';
import { useWebSocketContext } from '../context/WebSocketContext';
import DoorStatus from '../components/DoorStatus';
import DoorControl from '../components/DoorControl';
import SystemLock from '../components/SystemLock';
import NotificationList from '../components/NotificationList';

export default function DashboardScreen() {
  const { doorStatus, isLocked, notifications, setDoorStatus, setIsLocked } =
    useWebSocketContext();

  useEffect(() => {
    api.get('/door/status').then(({ data }) => {
      setDoorStatus(data.door_status);
      setIsLocked(data.is_locked);
    });
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Trạng thái cửa</Text>
        <DoorStatus status={doorStatus} />
        <View style={styles.divider} />
        <DoorControl doorStatus={doorStatus} isLocked={isLocked} />
        <View style={styles.divider} />
        <SystemLock isLocked={isLocked} setIsLocked={setIsLocked} />
        {isLocked && (
          <Text style={styles.lockWarning}>
            Hệ thống đang khóa - không thể mở cửa bằng thẻ
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Thông báo</Text>
        <NotificationList notifications={notifications} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { padding: 16, gap: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  lockWarning: {
    color: '#ea580c',
    fontSize: 13,
  },
});
