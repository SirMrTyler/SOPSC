import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { EventData } from './EventModal';

interface Props {
  visible: boolean;
  event: EventData | null;
  onClose: () => void;
  isAdmin: boolean;
  onEdit: () => void;
}

const EventDetailsModal: React.FC<Props> = ({ visible, event, onClose, isAdmin, onEdit }) => {
  if (!event) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView>
            <Text style={styles.header}>{event.title}</Text>
            <Text style={styles.label}>Date: {event.date}</Text>
            <Text style={styles.label}>Start: {event.startTime}</Text>
            <Text style={styles.label}>Duration: {event.duration} mins</Text>
            <Text style={styles.label}>Category: {event.category}</Text>
            {event.description ? <Text style={styles.label}>Description: {event.description}</Text> : null}
            {event.meetLink ? (
              <Text style={styles.label}>Meet Link: {event.meetLink}</Text>
            ) : null}
          </ScrollView>
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
            {isAdmin && (
              <TouchableOpacity onPress={onEdit} style={styles.editBtn}>
                <Text style={styles.editText}>Edit</Text>
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
    height: '80%',
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
  label: {
    marginBottom: 4,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    color: '#2477ff',
    fontWeight: 'bold',
  },
  editBtn: {
    padding: 8,
  },
  editText: {
    color: '#2477ff',
    fontWeight: 'bold',
  },
});

export default EventDetailsModal;
