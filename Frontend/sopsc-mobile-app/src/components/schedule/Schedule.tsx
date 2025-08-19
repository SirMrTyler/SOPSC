import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  PanResponder,
} from 'react-native';
import {
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  PlusIcon,
} from 'react-native-heroicons/outline';
import { BlurView } from 'expo-blur';
import ScreenContainer from '../navigation/ScreenContainer';
import { useAuth } from '../../hooks/useAuth';
import EventModal, { EventData } from './EventModal';
import DayViewModal from './DayViewModal';
import EventDetailsModal from './EventDetailsModal';
import FilterMenu from './FilterMenu';
import * as calendarService from '../../services/calendarService';
import { Picker } from '@react-native-picker/picker';
interface DayCell {
  date: Date;
  inMonth: boolean;
}

const Schedule: React.FC = () => {
  const { user } = useAuth();
  const canCreateEvents = useMemo(() => {
    if (!user) return false;
    const roles: any = (user as any).Roles;
    if (Array.isArray(roles)) {
      return roles.some((r: any) => {
        const name = r.roleName || r.RoleName;
        return name === 'Admin' || name === 'Developer';
      });
    }
    const roleName = (user as any).roleName || (user as any).RoleName;
    return roleName === 'Admin' || roleName === 'Developer';
  }, [user]);
  // States
  const [month, setMonth] = useState(new Date());
  const [events, setEvents] = useState<EventData[]>([]);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [dayModalVisible, setDayModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [eventToEdit, setEventToEdit] = useState<EventData | null>(null);
  const [initialStartTime, setInitialStartTime] = useState<string | undefined>(undefined);
  const [menuVisible, setMenuVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'day' | '3day' | 'week' | 'month'>('month');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [monthPickerVisible, setMonthPickerVisible] = useState(false);
  const [tempMonth, setTempMonth] = useState(month.getMonth());
  const [tempYear, setTempYear] = useState(month.getFullYear());
  // Refs
  const lastChangeRef = useRef<number>(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 20,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 50) changeMonth(-1);
        else if (gesture.dx < -50) changeMonth(1);
      },
    })
  ).current;

  const days = useMemo(() => {
    const base = selectedDate || new Date();
    if (viewMode === 'day') {
      return [{ date: base, inMonth: true }];
    }
    if (viewMode === '3day') {
      return Array.from({ length: 3 }, (_, i) => {
        const d = new Date(base);
        d.setDate(base.getDate() + i);
        return { date: d, inMonth: true };
      });
    }
    if (viewMode === 'week') {
      const start = new Date(base);
      start.setDate(base.getDate() - start.getDay());
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return { date: d, inMonth: true };
      });
    }
    const start = new Date(month.getFullYear(), month.getMonth(), 1);
    const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const startDay = start.getDay();
    const total = startDay + end.getDate();
    const rows = Math.ceil(total / 7);
    const cells: DayCell[] = [];
    const firstCellDate = new Date(start);
    firstCellDate.setDate(firstCellDate.getDate() - startDay);
    for (let i = 0; i < rows * 7; i++) {
      const d = new Date(firstCellDate);
      d.setDate(firstCellDate.getDate() + i);
      cells.push({ date: d, inMonth: d.getMonth() === month.getMonth() });
    }
    return cells;
  }, [month, viewMode, selectedDate]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const start = new Date(month.getFullYear(), month.getMonth(), 1);
        const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
        const data = await calendarService.getEvents(start, end);
        if (Array.isArray(data?.items)) {
          const parsed = data.items.map((item: any) => ({
            id: item.id,
            date: item.startDateTime,
            startTime: new Date(item.startDateTime).toISOString().substring(11, 16),
            duration: (new Date(item.endDateTime).getTime() - new Date(item.startDateTime).getTime()) / 60000,
            title: item.title,
            description: item.description || '',
            categoryId: item.categoryId,
            categoryName: item.categoryName,
            categoryColor: item.categoryColor,
            includeMeetLink: Boolean(item.meetLink),
            meetLink: item.meetLink,
          }));
          setEvents(parsed);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error('[Schedule] Failed to fetch events:', (err as any)?.response?.data || err);
      }
    };
    fetchEvents();
  }, [month]);

  const eventsForDate = (date: Date) => {
    const iso = date.toISOString().split('T')[0];
    return events.filter(e => e.date.startsWith(iso));
  };

  const changeMonth = (delta: number) => {
    const now = Date.now();
    let actual = delta;
    if (now - lastChangeRef.current < 350) {
      actual *= 6;
    } else if (now - lastChangeRef.current < 500) {
      actual *= 3;
    } else if (now - lastChangeRef.current < 1000) {
      actual *= 2;
    }
    lastChangeRef.current = now;
    setMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + actual, 1));
  };

  const openDayModal = (date: Date) => {
    setSelectedDate(date);
    setDayModalVisible(true);
  };

  const handleSlotSelection = (time: string) => {
    if (!canCreateEvents || !selectedDate) return;
    Alert.alert(
      'Create Event',
      `Would you like to create event at ${time} on ${selectedDate.toDateString()}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            setInitialStartTime(time);
            setEventToEdit(null);
            setDayModalVisible(false);
            setEventModalVisible(true);
          },
        },
      ],
    );
  };

  const handleEventPress = (event: EventData) => {
    setSelectedEvent(event);
    setDayModalVisible(false);
    setDetailModalVisible(true);
  };

  const handleEditSelected = () => {
    if (!selectedEvent) return;
    setEventToEdit(selectedEvent);
    setSelectedDate(new Date(selectedEvent.date));
    setInitialStartTime(selectedEvent.startTime);
    setDetailModalVisible(false);
    setEventModalVisible(true);
  };

  const handleDeleteSelected = () => {
    if (!selectedEvent) return;
    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await calendarService.deleteEvent(selectedEvent.id);
            setEvents(prev => prev.filter(ev => ev.id !== selectedEvent.id));
          } catch (err) {
            console.error('[Schedule] Failed to delete event:', (err as any)?.response?.data || err);
          } finally {
            setDetailModalVisible(false);
          }
        },
      },
    ]);
  };
  
  const handleAddEvent = async (event: EventData) => {
    try {
      const result = await calendarService.addEvent(event);
      const newId = result.item?.id || result.id;
      const meetLink = result.item?.meetLink || result.meetLink;
      const saved = {
        ...event,
        id: newId,
        meetLink,
        includeMeetLink: Boolean(meetLink)
      } as EventData;
      setEvents(prev => [...prev, saved]);
      if (meetLink) {
        Alert.alert('Google Meet Link', meetLink);
      }
    } catch (err) {
      console.error('[Schedule] Failed to add event:', (err as any)?.response?.data || err);
    } finally {
      setEventModalVisible(false);
    }
  };

  const handleUpdateEvent = async (event: EventData) => {
    try {
      await calendarService.updateEvent(event);
      setEvents(prev => prev.map(ev => (ev.id === event.id ? { ...ev, ...event } : ev)));
    } catch (err) {
      console.error('[Schedule] Failed to update event:', (err as any)?.response?.data || err);
    } finally {
      setEventModalVisible(false);
    }
  };

  // I will eventually alter this so that it does an API call to fetch events for the selected date
  const renderItem = ({ item }: { item: DayCell }) => {
    const dayNumber = item.date.getDate();
    const isToday = new Date().toDateString() === item.date.toDateString();
    return (
      <TouchableOpacity
        style={[
          styles.day,
          !item.inMonth && styles.outMonth,
          isToday && styles.today,
        ]}
        onPress={() => openDayModal(item.date)}
      >
        <Text style={styles.dayNumber}>{dayNumber}</Text>
        {eventsForDate(item.date).map(ev => (
          <Text
            key={ev.id || `${ev.date}-${ev.startTime}`}
            style={[styles.event, { color: ev.categoryColor || '#DED3C4' }]}
          >
            {'⬤ '}{ev.title}
          </Text>
        ))}
      </TouchableOpacity>
    );
  };

  const monthName = month.toLocaleString('default', { month: 'short' });

  return (
    <ScreenContainer showBottomBar={true}>
      <View style={styles.container} {...panResponder.panHandlers}>
        <View style={styles.navRow}>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Bars3Icon color="white" size={24} />
          </TouchableOpacity>
          <View style={styles.monthSwitch}>
            <TouchableOpacity onPress={() => changeMonth(-1)}>
              <ChevronLeftIcon color="white" size={20} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setTempMonth(month.getMonth());
              setTempYear(month.getFullYear());
              setMonthPickerVisible(true);
            }}>
              <Text style={styles.monthName}>{monthName}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeMonth(1)}>
              <ChevronRightIcon color="white" size={20} />
            </TouchableOpacity>
          </View>
          {month.getMonth() === new Date().getMonth() && (
            <View style={styles.todayIconWrapper}>
              <CalendarIcon color="white" size={24} />
              <Text style={styles.todayIconText}>{new Date().getDate()}</Text>
            </View>
          )}
        </View>
        <BlurView intensity={40} tint='dark' style={styles.calendarWrapper}>
          <FlatList
            data={days}
            key={viewMode}
            keyExtractor={(item) => item.date.toISOString()}
            numColumns={viewMode === 'day' ? 1 : viewMode === '3day' ? 3 : 7}
            renderItem={renderItem}
            scrollEnabled={false}
            columnWrapperStyle={viewMode === 'day' ? undefined : styles.weekRow}
          />
        </BlurView>
        {canCreateEvents && (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => {
              setSelectedDate(new Date());
              setEventToEdit(null);
              setInitialStartTime(undefined);
              setEventModalVisible(true);
            }}
          >
            <PlusIcon color="white" size={32} />
          </TouchableOpacity>
        )}
        <FilterMenu
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          view={viewMode}
          onViewChange={v => {
            setViewMode(v as any);
            setMenuVisible(false);
          }}
          selectedTags={activeTags}
          onTagsChange={setActiveTags}
        />
        <DayViewModal
          visible={dayModalVisible}
          date={selectedDate}
          events={selectedDate ? eventsForDate(selectedDate) : []}
          onClose={() => setDayModalVisible(false)}
          isAdmin={canCreateEvents}
          onSelectEvent={handleEventPress}
          onSelectSlot={handleSlotSelection}
        />
        <EventDetailsModal
          visible={detailModalVisible}
          event={selectedEvent}
          onClose={() => setDetailModalVisible(false)}
          isAdmin={canCreateEvents}
          onEdit={handleEditSelected}
          onDelete={handleDeleteSelected}
        />
        <EventModal
          visible={eventModalVisible}
          date={selectedDate}
          event={eventToEdit || undefined}
          initialStartTime={initialStartTime}
          onAdd={handleAddEvent}
          onUpdate={handleUpdateEvent}
          onClose={() => setEventModalVisible(false)}
          isAdmin={canCreateEvents}
        />
        
        <Modal transparent visible={monthPickerVisible} animationType="fade">
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.textInput}>
                <Picker
                  selectedValue={tempMonth}
                  onValueChange={(val) => setTempMonth(val)}
                  style={{ color: '#111827' }}
                  dropdownIconColor="#111827"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <Picker.Item
                      key={i}
                      label={new Date(0, i).toLocaleString('default', { month: 'short' })}
                      value={i}
                      color="#111827"
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.textInput}>
                <Picker
                  selectedValue={tempYear}
                  onValueChange={(val) => setTempYear(val)}
                  style={{ color: '#111827' }}
                  dropdownIconColor="#111827"
                >
                  {Array.from({ length: 11 }, (_, i) => {
                    const y = new Date().getFullYear() - 5 + i;
                    return (
                      <Picker.Item key={y} label={String(y)} value={y} color="#111827" />
                    );
                  })}
                </Picker>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                <TouchableOpacity onPress={() => setMonthPickerVisible(false)} style={styles.pickerBtn}>
                  <Text style={styles.pickerBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setMonth(new Date(tempYear, tempMonth, 1));
                    setMonthPickerVisible(false);
                  }}
                  style={styles.pickerBtn}
                >
                  <Text style={styles.pickerBtnText}>Set</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calendarWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
    overflow: 'hidden',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  monthSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 4,
  },
  monthName: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  todayIconWrapper: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayIconText: {
    position: 'absolute',
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    bottom: 4,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    width: '80%',
  },
  pickerBtn: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
  },
  pickerBtnText: { color: '#2477ff', fontWeight: 'bold' },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
    flex: 1,
  },
  weekRow: { justifyContent: 'space-between' },
  day: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#555',
    minHeight: 60,
    padding: 2,
  },
  outMonth: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  today: {
    borderColor: '#2477ff',
    borderWidth: 2,
  },
  dayNumber: { color: 'white', fontWeight: 'bold' },
  event: { color: '#DED3C4', fontSize: 10 },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2477ff',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Schedule;