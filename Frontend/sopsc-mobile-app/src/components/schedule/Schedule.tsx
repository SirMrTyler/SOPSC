import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  PlusIcon,
} from 'react-native-heroicons/outline';
import Constants from 'expo-constants';
import { BlurView } from 'expo-blur';
import ScreenContainer from '../navigation/ScreenContainer';
import { useAuth } from '../../hooks/useAuth';
import EventModal, { EventData } from './EventModal';
import FilterMenu from './FilterMenu';
import * as calendarService from '../../services/calendarService';
interface DayCell {
  date: Date;
  inMonth: boolean;
}

const runtime = Constants.expoConfig?.extra || {};
const GOOGLE_CALENDAR_ID = runtime.EXPO_PUBLIC_GOOGLE_CALENDAR_ID || '';
const GOOGLE_API_KEY = runtime.EXPO_PUBLIC_GOOGLE_API_KEY || '';

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
  const [month, setMonth] = useState(new Date());
  const [events, setEvents] = useState<EventData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'day' | '3day' | 'week' | 'month'>('month');
  const [activeTags, setActiveTags] = useState<string[]>(['Agencies', 'Events', 'Prayer Meetings']);

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
      if (!GOOGLE_CALENDAR_ID || !GOOGLE_API_KEY) return;
      try {
        const timeMin = new Date(month.getFullYear(), month.getMonth(), 1).toISOString();
        const timeMax = new Date(month.getFullYear(), month.getMonth() + 1, 0).toISOString();
        const url = `https://www.googleapis.com/calendar/v3/calendars/${GOOGLE_CALENDAR_ID}/events?singleEvents=true&timeMin=${timeMin}&timeMax=${timeMax}&orderBy=startTime&key=${GOOGLE_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (Array.isArray(data.items)) {
          const parsed = data.items.map((item: any) => ({
            id: item.id,
            date: item.start.date || item.start.dateTime,
            startTime: item.start.dateTime || item.start.date,
            duration: '60',
            title: item.summary,
            description: item.description || '',
            category: item.eventType || '',
            meetLink: item.hangoutLink,
          }));
          setEvents(parsed);
        }
      } catch (err) {
        console.error('[Schedule] Failed to fetch events:', err);
      }
    };
    fetchEvents();
  }, [month]);

  const eventsForDate = (date: Date) => {
    const iso = date.toISOString().split('T')[0];
    return events.filter(e => e.date.startsWith(iso));
  };

  const changeMonth = (delta: number) => {
    setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));
  };

  const openModal = (date: Date) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const handleAddEvent = async (event: EventData) => {
    try {
      const result = await calendarService.addEvent(event);
      const saved = { ...event, id: result.id };
      setEvents(prev => [...prev, saved]);
    } catch (err) {
      console.error('[Schedule] Failed to add event:', err);
    } finally {
      setModalVisible(false);
    }
  };

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
        onPress={() => openModal(item.date)}
      >
        <Text style={styles.dayNumber}>{dayNumber}</Text>
        {eventsForDate(item.date).map(ev => (
          <Text key={ev.id} style={styles.event}>{ev.title}</Text>
        ))}
      </TouchableOpacity>
    );
  };

  const monthName = month.toLocaleString('default', { month: 'short' });

  return (
    <ScreenContainer showBottomBar={true}>
      <View style={styles.container}>
        <View style={styles.navRow}>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Bars3Icon color="white" size={24} />
          </TouchableOpacity>
          <View style={styles.monthSwitch}>
            <TouchableOpacity onPress={() => changeMonth(-1)}>
              <ChevronLeftIcon color="white" size={20} />
            </TouchableOpacity>
            <Text style={styles.monthText}>Month</Text>
            <TouchableOpacity onPress={() => changeMonth(1)}>
              <ChevronRightIcon color="white" size={20} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.monthName}>{monthName}</Text>
          </View>
          {month.getMonth() === new Date().getMonth() && (
            <CalendarIcon color="white" size={24} />
          )}
        </View>
        <BlurView intensity={40} tint='dark' style={styles.calendarWrapper}>
          <FlatList
            data={days}
            key={viewMode}
            keyExtractor={(_, i) => String(i)}
            numColumns={viewMode === 'day' ? 1 : viewMode === '3day' ? 3 : 7}
            renderItem={renderItem}
            scrollEnabled={false}
            columnWrapperStyle={viewMode === 'day' ? undefined : styles.weekRow}
          />
        </BlurView>
        {canCreateEvents && (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => openModal(new Date())}
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
          tags={['Agencies', 'Events', 'Prayer Meetings']}
          selectedTags={activeTags}
          onTagsChange={setActiveTags}
        />
        <EventModal
          visible={modalVisible}
          date={selectedDate}
          onAdd={handleAddEvent}
          onClose={() => setModalVisible(false)}
          isAdmin={canCreateEvents}
        />
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // semi-transparent white
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
    gap: 4,
  },
  monthText: { color: 'white', marginHorizontal: 4 },
  monthName: { color: 'white', fontSize: 24, fontWeight: 'bold' },
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