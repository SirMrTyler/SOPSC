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
  const eventsByTime = events.reduce((acc: Record<string, EventData>, ev) => {
    acc[ev.startTime] = ev;
    return acc;
  }, {} as Record<string, EventData>);

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
              const time = `${String(h).padStart(2, '0')}:00`;
              const event = eventsByTime[time];
              return (
                <TouchableOpacity
                  key={time}
                  style={styles.row}
                  onPress={() => {
                    if (event) {
                      onSelectEvent(event);
                    } else if (isAdmin) {
                      onSelectSlot(time);
                    }
                  }}
                >
                  <Text style={styles.time}>{formatLabel(h)}</Text>
                  <View style={styles.eventCell}>
                    {event && <Text style={styles.eventTitle}>{event.title}</Text>}
                  </View>
                </TouchableOpacity>
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
