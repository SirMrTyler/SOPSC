import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Linking 
} from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { EventData } from './EventModal';

interface Props {
  visible: boolean;
  event: EventData | null;
  onClose: () => void;
  isAdmin: boolean;
  onEdit: () => void;
}

const EventDetailsModal: React.FC<Props> = ({
  visible,
  event,
  onClose,
  isAdmin,
  onEdit,
}) => {
  if (!event) return null;

  const handleJoin = () => {
    if (event.meetLink) {
      Linking.openURL(event.meetLink);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.topRow}>
              <View style={styles.titleWrapper}>
                <TouchableOpacity onPress={onClose}>
                  <ChevronLeftIcon size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>{event.title}</Text>
              </View>
            <Text style={styles.date}>{event.date}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>When</Text>
              <View style={styles.whenRow}>
                <Text style={styles.sectionText}>
                  <Text style={styles.bold}>Start Time:</Text> {event.startTime}
                </Text>
                <Text style={styles.sectionText}>
                  <Text style={styles.bold}>Duration:</Text> {event.duration} mins
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.detailsHeader}>
                <Text style={styles.sectionTitle}>Details</Text>
                <Text style={styles.sectionText}>
                  <Text style={styles.bold}>Category:</Text> {event.category}
                </Text>
              </View>
              {event.description ? (
                <View style={styles.descriptionBox}>
                  <Text style={styles.descriptionText}>{event.description}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.card}>
              <TouchableOpacity
                style={[styles.joinButton, !event.meetLink && styles.joinButtonDisabled]}
                onPress={handleJoin}
                disabled={!event.meetLink}
              >
                <Text style={styles.joinButtonText}>Join Meeting</Text>
              </TouchableOpacity>
            </View>

            {isAdmin && (
              <TouchableOpacity onPress={onEdit} style={styles.editBtn}>
                <Text style={styles.editText}>Edit Event</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
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
  scroll: {
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  date: {
    fontStyle: 'italic',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  whenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionText: {
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  descriptionBox: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 8,
  },
  descriptionText: {
    color: '#333',
  },
  joinButton: {
    backgroundColor: '#2477ff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  joinButtonDisabled: {
    backgroundColor: '#ccc',
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editBtn: {
    marginTop: 4,
    alignItems: 'center',
  },
  editText: {
    color: '#2477ff',
    fontWeight: 'bold',
  },
});

export default EventDetailsModal;