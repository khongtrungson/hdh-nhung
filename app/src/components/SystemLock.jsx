import { useState } from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import api from '../api/axios';

export default function SystemLock({ isLocked, setIsLocked }) {
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      const action = isLocked ? 'unlock' : 'lock';
      await api.post(`/door/${action}`);
      setIsLocked(!isLocked);
    } catch (err) {
      Alert.alert('Lỗi', err.response?.data?.detail || 'Lỗi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        isLocked ? styles.locked : styles.unlocked,
        loading && styles.disabled,
      ]}
      onPress={toggle}
      disabled={loading}
    >
      <Text style={styles.text}>
        {isLocked ? 'Mở khóa hệ thống' : 'Khóa hệ thống'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  locked:   { backgroundColor: '#ea580c' },
  unlocked: { backgroundColor: '#2563eb' },
  disabled: { opacity: 0.5 },
  text: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
