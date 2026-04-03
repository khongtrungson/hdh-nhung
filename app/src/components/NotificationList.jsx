import { View, Text, FlatList, StyleSheet } from 'react-native';

const CATEGORY_COLOR = {
  access: '#22c55e',
  alert:  '#ef4444',
  motion: '#eab308',
};

export default function NotificationList({ notifications }) {
  if (!notifications.length) {
    return <Text style={styles.empty}>Chưa có thông báo</Text>;
  }

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => String(item.id)}
      style={styles.list}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View
          style={[
            styles.item,
            { borderLeftColor: CATEGORY_COLOR[item.category] ?? '#9ca3af' },
          ]}
        >
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.time}>
            {(item.time instanceof Date ? item.time : new Date(item.time))
              .toLocaleTimeString('vi-VN')}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  empty: { color: '#9ca3af', fontSize: 13 },
  list: { maxHeight: 320 },
  item: {
    borderLeftWidth: 4,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 6,
    borderRadius: 4,
  },
  message: { fontSize: 13, color: '#1f2937' },
  time: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
});
