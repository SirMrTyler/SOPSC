import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { format } from 'date-fns';
import { EventData } from './EventModal';

interface Props {
  visible: boolean;
  date: Date | null;
  events: EventData[];
  onClose: () => void;
  isAdmin: boolean;
  onSelectEvent: (event: EventData) => void;
  onSelectSlot: (time: string) => void;
}

const DayViewModal: React.FC<Props> = ({ visible, date, events, onClose, isAdmin, onSelectEvent, onSelectSlot }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const eventsByHour = events.reduce((acc: Record<string, EventData[]>, ev) => {
    const hour = ev.startTime.split(':')[0];
    if (!acc[hour]) acc[hour] = [];
    acc[hour].push(ev);
    return acc;
  }, {} as Record<string, EventData[]>);

  const formatLabel = (h: number) => {
    const d = new Date();
    d.setHours(h, 0, 0, 0);
    return format(d, 'h aaa');
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.header}>{date ? format(date, 'MMMM d, yyyy') : ''}</Text>
          <ScrollView>
            {hours.map(h => {
              const hourKey = String(h).padStart(2, '0');
              const eventsAtHour = eventsByHour[hourKey] || [];
              return (
                <View key={hourKey} style={styles.row}>
                  <Text style={styles.time}>{formatLabel(h)}</Text>
                  <View style={styles.eventCell}>
                    {eventsAtHour.length > 0 ? (
                      eventsAtHour.map(ev => (
                        <TouchableOpacity
                          key={ev.id || `${ev.date}-${ev.startTime}`}
                          onPress={() => onSelectEvent(ev)}
                        >
                          <Text style={styles.eventTitle}>{`${ev.startTime} ${ev.title}`}</Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      isAdmin && (
                        <TouchableOpacity onPress={() => onSelectSlot(`${hourKey}:00`)}>
                          <Text style={styles.emptySlot}>+</Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    paddingVertical: 8,
  },
  time: {
    width: 60,
    color: '#333',
  },
  eventCell: {
    flex: 1,
    paddingLeft: 8,
  },
  eventTitle: {
    color: '#000',
  },
  emptySlot: {
    color: '#999',
  },
  closeBtn: {
    marginTop: 12,
    alignSelf: 'center',
    padding: 8,
  },
  closeText: {
    color: '#2477ff',
    fontWeight: 'bold',
  },
});

export default DayViewModal;
