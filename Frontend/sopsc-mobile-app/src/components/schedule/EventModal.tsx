import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

interface Props {
  visible: boolean;
  date: Date | null;
  onAdd: (event: EventData) => void;
  onClose: () => void;
  isAdmin: boolean;
}

export interface EventData {
  id?: string;
  date: string; // ISO date
  startTime: string; // HH:MM
  duration: number; // in minutes
  title: string;
  description: string;
  category: string;
  meetLink?: string;
}

const EventModal: React.FC<Props> = ({ visible, date, onAdd, onClose, isAdmin }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [meetLink, setMeetLink] = useState('');
  const [includeMeetLink, setIncludeMeetLink] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  
  const handleAdd = () => {
    if (!startTime || !date) return;
    
    const event: EventData = {
      date: date.toISOString().split('T')[0],
      startTime: format(startTime, 'HH:mm'),
      duration: parseInt(duration, 10),
      title,
      description,
      category,
      meetLink: includeMeetLink ? meetLink : undefined,
    };

    onAdd(event);

    setTitle('');
    setDescription('');
    setStartTime(null);
    setDuration('');
    setCategory('');
    setMeetLink('');
  };

  const isFormComplete =
    title.trim().length > 0 &&
    startTime !== null &&
    duration.trim().length > 0;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.header}>Create Event</Text>
          
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
        
        {includeMeetLink && (
          <TextInput
            style={styles.input}
            placeholder="Google Meet link"
            placeholderTextColor="#777"
            value={meetLink}
            onChangeText={setMeetLink}
          />
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            
            {isAdmin && (
              <TouchableOpacity
                onPress={handleAdd}
                style={[styles.addBtn, !isFormComplete && styles.disabledBtn]}
                disabled={!isFormComplete}
              >
                <Text style={styles.addText}>Submit</Text>
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