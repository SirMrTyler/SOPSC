import React, { useCallback, useMemo } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Linking,
  Platform
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

  const displayDate = useMemo(() => {
    const maybeDate = (event.date && !/^\d{4}-\d{2}-\d{2}$/.test(event.date)
      ? new Date(event.date)
      : new Date(`${event.date}T${event.startTime || '00:00'}`));

    if (isNaN(maybeDate.getTime())) return event.date || '';
    return maybeDate.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [event]);

  const handleJoin = useCallback(async () => {
    if (!event.meetLink) return;
    const ok = await Linking.canOpenURL(event.meetLink);
    if (ok) Linking.openURL(event.meetLink);
  }, [event?.meetLink]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        {/* BOX 1: Super container */}
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scroll}>

            {/* BOX 2: Invisible header row (title left w/ chevron, date right/italic) */}
            <View style={styles.topRow}>
              <View style={styles.titleWrapper}>
                <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <ChevronLeftIcon size={24} color="#1b1b1b" />
                </TouchableOpacity>
                <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
              </View>
            <Text style={styles.date} numberOfLines={1}>{displayDate}</Text>
            </View>

            {/* BOX 3: "When" card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>When</Text>
              <View style={styles.rowBetween}>
                <Text style={styles.inlineLabel}>
                  <Text style={styles.bold}>Start Time:</Text> 
                  {event.startTime}
                </Text>
                <Text style={styles.inlineLabel}>
                  <Text style={styles.bold}>Duration:</Text> 
                  {event.duration} mins
                </Text>
              </View>
            </View>

            {/* BOX 4: "Details" card */}
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>Details</Text>
                {!!event.category && (
                  <Text style={styles.inlineLabel}>
                    <Text style={styles.bold}>Category: </Text>
                    {event.category}
                  </Text>
                )}
              </View>
              
              {event.description && (
                <View style={styles.descriptionBox}>
                  <Text style={styles.descriptionText}>{event.description}</Text>
                </View>
              )}
            </View>

            {/* BOX 5: Join button card */}
            <View style={styles.card}>
              <TouchableOpacity
                style={[
                  styles.joinButton, 
                  !event.meetLink && styles.joinButtonDisabled,
                ]}
                onPress={handleJoin}
                disabled={!event.meetLink}
                activeOpacity={0.85}
              >
                <Text style={styles.joinButtonText}>
                  {event.meetLink ? 'Join Meeting' : 'No Meeting Link'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Admin edit shortcut */}
            {isAdmin && (
              <TouchableOpacity onPress={onEdit} style={styles.editBtn} activeOpacity={0.8}>
                <Text style={styles.editText}>Edit Event</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const cardBg = '#fff';
const surface = '#f6f7fb';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '92%',
    maxHeight: '85%',
    backgroundColor: surface,
    padding: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 18, shadowOffset: { width: 0, height: 10 } },
      android: { elevation: 8 },
    }),
  },
  scroll: { paddingBottom: 16 },

  // BOX 2
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleWrapper: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  title: { fontSize: 20, fontWeight: '700', marginLeft: 8, color: '#1b1b1b', flexShrink: 1 },
  date: { fontStyle: 'italic', color: '#4b5563' },

  // Shared card
  card: {
    backgroundColor: cardBg,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6, color: '#111827' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  inlineLabel: { color: '#1f2937' },
  bold: { fontWeight: '700' },

  // Details body
  descriptionBox: {
    backgroundColor: '#eef2f7',
    borderRadius: 10,
    padding: 10,
  },
  descriptionText: { color: '#111827', lineHeight: 20 },

  // Join button
  joinButton: {
    backgroundColor: '#2563eb',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  joinButtonDisabled: { backgroundColor: '#c7cbd3' },
  joinButtonText: { color: 'white', fontWeight: '700' },

  // Admin edit
  editBtn: { marginTop: 2, alignItems: 'center' },
  editText: { color: '#2563eb', fontWeight: '700' },
});

export default EventDetailsModal;