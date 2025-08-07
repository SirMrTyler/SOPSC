import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

interface Props {
  visible: boolean;
  date: Date | null;
  onAdd: (event: EventData) => void;
  onUpdate?: (event: EventData) => void;
  onClose: () => void;
  isAdmin: boolean;
  event?: EventData | null;
  initialStartTime?: string;
}

export interface EventData {
  id?: number;
  date: string; // ISO date
  startTime: string; // HH:MM
  duration: number; // in minutes
  title: string;
  description: string;
  category: string;
  includeMeetLink: boolean;
  meetLink?: string;
}

const EventModal: React.FC<Props> = ({ visible, date, onAdd, onUpdate, onClose, isAdmin, event, initialStartTime }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [includeMeetLink, setIncludeMeetLink] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Prefill state when editing or when an initial start time is provided
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setDuration(String(event.duration));
      setCategory(event.category);
      setIncludeMeetLink(event.includeMeetLink);
      const [h, m] = event.startTime.split(':').map(Number);
      const d = new Date();
      d.setHours(h, m, 0, 0);
      setStartTime(d);
    } else {
      setTitle('');
      setDescription('');
      setDuration('');
      setCategory('');
      setIncludeMeetLink(false);
      if (initialStartTime) {
        const [h, m] = initialStartTime.split(':').map(Number);
        const d = new Date();
        d.setHours(h, m, 0, 0);
        setStartTime(d);
      } else {
        setStartTime(null);
      }
    }
  }, [event, initialStartTime, visible]);

  
  const handleSubmit = () => {
    if (!startTime || !date) return;

    const newEvent: EventData = {
      id: event?.id,
      // Use the local date rather than UTC to avoid off-by-one issues
      // when the device is behind UTC (e.g. PST).
      date: format(date, 'yyyy-MM-dd'),
      startTime: format(startTime, 'HH:mm'),
      duration: parseInt(duration, 10),
      title,
      description,
      category,
      includeMeetLink,
      meetLink: includeMeetLink ? event?.meetLink : undefined,
    };

    if (event && onUpdate) {
      onUpdate(newEvent);
    } else {
      onAdd(newEvent);
    }

    setTitle('');
    setDescription('');
    setStartTime(null);
    setDuration('');
    setCategory('');
  };

  const isFormComplete =
    title.trim().length > 0 &&
    startTime !== null &&
    duration.trim().length > 0;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.header}>{event ? 'Edit Event' : 'Create Event'}</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Title"
            placeholderTextColor="#777"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={styles.input}
            placeholder="Description"
            placeholderTextColor="#777"
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
            <Text style={{ color: startTime ? '#000' : '#777' }}>
              {startTime ? format(startTime, 'hh:mm a') : 'Select Start Time'}
            </Text>
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              mode="time"
              value={startTime || new Date()}
              is24Hour={false}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  setStartTime(selectedTime);
                }
              }}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Duration (mins)"
            placeholderTextColor="#777"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Category"
            placeholderTextColor="#777"
            value={category}
            onChangeText={setCategory}
          />

          <View style={styles.switchRow}>
            <Text>Add Google Meet Link?</Text>
            <Switch value={includeMeetLink} onValueChange={setIncludeMeetLink} />
          </View>
        
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            
            {isAdmin && (
              <TouchableOpacity
                onPress={handleSubmit}
                style={[styles.addBtn, !isFormComplete && styles.disabledBtn]}
                disabled={!isFormComplete}
              >
                <Text style={styles.addText}>{event ? 'Save' : 'Submit'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    marginBottom: 8,
    padding: 8,
    borderRadius: 4,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelBtn: {
    padding: 8,
  },
  cancelText: {
    color: 'gray',
  },
  addBtn: {
    padding: 8,
    backgroundColor: '#2477ff',
    borderRadius: 4,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  addText: {
    color: 'white',
  },
});

export default EventModal;