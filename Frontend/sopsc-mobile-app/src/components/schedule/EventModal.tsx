import React, { useEffect, useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  Platform
} from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Picker } from '@react-native-picker/picker';
import * as categoryService from '../Schedule/services/scheduleCategoriesService';
import TagModal from '../Schedule/TagModal';

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
  categoryId: number | null;
  categoryName?: string;
  categoryColor?: string;
  includeMeetLink: boolean;
  meetLink?: string;
}

const EventModal: React.FC<Props> = ({ visible, date, onAdd, onUpdate, onClose, isAdmin, event, initialStartTime }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<any | null>(null);
  const [includeMeetLink, setIncludeMeetLink] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      const list = Array.isArray(data) ? data : data.items;
      setCategories(list || []);
    } catch (err) {
      console.error('[EventModal] Failed to load categories', err);
    }
  };

  useEffect(() => {
    if (visible) {
      loadCategories();
    }
  }, [visible]);

  const displayDate = useMemo(() => {
    if (!date) return '';
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [date]);

  // Prefill state when editing or when an initial start time is provided
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setDuration(String(event.duration));
      setCategoryId(event.categoryId ?? null);
      setIncludeMeetLink(event.includeMeetLink);
      const [h, m] = event.startTime.split(':').map(Number);
      const d = new Date();
      d.setHours(h, m, 0, 0);
      setStartTime(d);
    } else {
      setTitle('');
      setDescription('');
      setDuration('');
      setCategoryId(null);
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
    const selectedCat = categories.find((c: any) => c.categoryId === categoryId);
    const newEvent: EventData = {
      id: event?.id,
      // Use the local date rather than UTC to avoid off-by-one issues
      // when the device is behind UTC (e.g. PST).
      date: format(date, 'yyyy-MM-dd'),
      startTime: format(startTime, 'HH:mm'),
      duration: parseInt(duration, 10),
      title,
      description,
      categoryId,
      categoryName: selectedCat?.name,
      categoryColor: selectedCat?.colorValue,
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
    setCategoryId(null);
  };

  const isFormComplete =
    title.trim().length > 0 &&
    startTime !== null &&
    duration.trim().length > 0;

  return (
    <>
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.topRow}>
              <View style={styles.titleWrapper}>
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <ChevronLeftIcon size={24} color="#1b1b1b" />
                </TouchableOpacity>
                <Text style={styles.title} numberOfLines={2}>
                  {event ? 'Edit Event' : 'Create Event'}
                </Text>
              </View>
              {!!displayDate && <Text style={styles.date}>{displayDate}</Text>}
            </View>

            {/* WHEN CARD */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>When</Text>
              <View style={styles.rowBetween}>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  style={[styles.textInput, styles.timeInput]}
                >
                  <Text style={{ color: startTime ? '#1f2937' : '#6b7280' }}>
                    {startTime ? format(startTime, 'hh:mm a') : 'Start Time'}
                  </Text>
                </TouchableOpacity>
                <TextInput
                  style={[styles.textInput, styles.durationInput]}
                  placeholder="Duration (mins)"
                  placeholderTextColor="#6b7280"
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* DETAILS CARD */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Details</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Title"
                placeholderTextColor="#6b7280"
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                style={[styles.textInput, { height: 80 }]}
                placeholder="Description"
                placeholderTextColor="#6b7280"
                value={description}
                onChangeText={setDescription}
                multiline
              />
              <View style={styles.textInput}>
                <Picker
                  selectedValue={categoryId}
                  onValueChange={(val: any) => {
                    if (val === 'custom') {
                      setEditingTag(null);
                      setTagModalVisible(true);
                    } else {
                      setCategoryId(val);
                    }
                  }}
                  style={{ color: '#111827' }}
                  dropdownIconColor="#111827"
                >
                  <Picker.Item label="Select Category" value={null} color="#111827" />
                  {categories.map((cat: any) => (
                    <Picker.Item
                      key={cat.categoryId}
                      label={`⬤ ${cat.name}`}
                      value={cat.categoryId}
                      color={cat.colorValue}
                    />
                  ))}
                <Picker.Item label="Add Custom Tag..." value="custom" color="#111827" />
                </Picker>
              </View>
              <View style={[styles.rowBetween, { marginTop: 4 }]}>
                <Text style={styles.inlineLabel}>Add Google Meet Link?</Text>
                <Switch value={includeMeetLink} onValueChange={setIncludeMeetLink} />
              </View>
            </View>

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

        {/* SUBMIT CARD */}
            <View style={styles.card}>
              {isAdmin && (
                <TouchableOpacity
                  style={[styles.submitButton, !isFormComplete && styles.submitButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={!isFormComplete}
                  activeOpacity={0.85}
                >
                  <Text style={styles.submitButtonText}>
                    {event ? 'Save Event' : 'Create Event'}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onClose} style={styles.cancelBtn} activeOpacity={0.8}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          </View>
        </View>
      </Modal>
      <TagModal
      visible={tagModalVisible}
      onClose={() => setTagModalVisible(false)}
      tag={editingTag}
      onSave={async (tag: any) => {
        await loadCategories();
        setCategoryId(tag.categoryId);
      }}
      />
    </>
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
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
      },
      android: { elevation: 8 },
    }),
  },
  scroll: { paddingBottom: 16 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:12,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleWrapper: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
    color: '#1b1b1b',
    flexShrink: 1,
  },
  date: { fontStyle: 'italic', color: '#4b5563' },

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

  textInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
    flex: 1,
    color: '#111827',
  },
  timeInput: { marginRight: 8, justifyContent: 'center' },
  durationInput: { flex: 1 },

  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: { backgroundColor: '#c7cbd3' },
  submitButtonText: { color: 'white', fontWeight: '700' },

  cancelBtn: { marginTop: 8, alignItems: 'center' },
  cancelText: { color: '#2563eb', fontWeight: '700' },
});

export default EventModal;