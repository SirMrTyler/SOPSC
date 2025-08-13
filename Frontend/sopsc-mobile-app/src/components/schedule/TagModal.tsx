import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import * as categoryService from '../../services/scheduleCategoriesService';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (tag: any) => void;
  tag?: any | null;
}

const TagModal: React.FC<Props> = ({ visible, onClose, onSave, tag }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');

  useEffect(() => {
    if (tag) {
      setName(tag.name);
      setColor(tag.colorValue || '#000000');
    } else {
      setName('');
      setColor('#000000');
    }
  }, [tag, visible]);

  const handleSubmit = async () => {
    try {
      if (tag) {
        await categoryService.update(tag.categoryId, { name, colorValue: color });
        onSave({ ...tag, name, colorValue: color });
      } else {
        const newId = await categoryService.add({ name, colorValue: color });
        const id = newId.item || newId.id || newId;
        onSave({ categoryId: id, name, colorValue: color });
      }
    } catch (err) {
      console.error('[TagModal] Failed to save category', err);
    } finally {
      onClose();
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{tag ? 'Edit Tag' : 'Add Tag'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#6b7280"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Color (#RRGGBB)"
            placeholderTextColor="#6b7280"
            value={color}
            onChangeText={setColor}
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
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
    width: '80%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    color: '#111827'
  },
  saveBtn: {
    backgroundColor: '#2477ff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: { color: 'white', fontWeight: '700' },
  cancelBtn: { marginTop: 8, alignItems: 'center' },
  cancelText: { color: '#2477ff', fontWeight: '700' },
});

export default TagModal;