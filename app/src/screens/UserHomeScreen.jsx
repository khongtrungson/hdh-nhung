import { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import api from '../api/axios';
import { useWebSocketContext } from '../context/WebSocketContext';
import DoorStatus from '../components/DoorStatus';
import DoorControl from '../components/DoorControl';

export default function UserHomeScreen() {
  const { doorStatus, isLocked, setDoorStatus, setIsLocked } =
    useWebSocketContext();

  useEffect(() => {
    api.get('/door/status').then(({ data }) => {
      setDoorStatus(data.door_status);
      setIsLocked(data.is_locked);
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>SmartDoor</Text>
        <DoorStatus status={doorStatus} />
        <View style={styles.divider} />
        <DoorControl doorStatus={doorStatus} isLocked={isLocked} />
        {isLocked && (
          <Text style={styles.lockWarning}>Hệ thống đang khóa</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    width: '100%',
  },
  lockWarning: {
    color: '#ea580c',
    fontSize: 13,
  },
});
