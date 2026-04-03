import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const STATUS_MAP = {
  opened:  { label: 'Đã mở',        color: '#22c55e', animate: false },
  opening: { label: 'Đang mở...',    color: '#eab308', animate: true },
  closed:  { label: 'Đã đóng',      color: '#6b7280', animate: false },
  closing: { label: 'Đang đóng...', color: '#eab308', animate: true },
};

export default function DoorStatus({ status }) {
  const info = STATUS_MAP[status] ?? STATUS_MAP.closed;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (info.animate) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 0.2, duration: 500, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1,   duration: 500, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulse.setValue(1);
    }
  }, [info.animate]);

  return (
    <View style={styles.row}>
      <Animated.View
        style={[styles.dot, { backgroundColor: info.color, opacity: pulse }]}
      />
      <Text style={styles.label}>{info.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 16, height: 16, borderRadius: 8 },
  label: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
});
