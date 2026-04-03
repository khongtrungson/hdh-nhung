import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../api/axios';
import HistoryTable from '../components/HistoryTable';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [method, setMethod] = useState('');

  useEffect(() => {
    const params = {};
    if (method) params.method = method;
    api.get('/history', { params }).then(({ data }) => setHistory(data));
  }, [method]);

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Phương thức:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={method}
            onValueChange={setMethod}
            style={styles.picker}
            dropdownIconColor="#374151"
          >
            <Picker.Item label="Tất cả" value="" />
            <Picker.Item label="Thẻ RFID" value="rfid" />
            <Picker.Item label="Web" value="web" />
          </Picker>
        </View>
      </View>

      <HistoryTable history={history} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterLabel: { fontSize: 14, color: '#374151', marginRight: 8 },
  pickerWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    overflow: 'hidden',
  },
  picker: { height: 44, color: '#1f2937' },
});
