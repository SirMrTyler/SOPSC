import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import * as categoryService from '../../services/scheduleCategoriesService';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (tag: any) => void;
  tag?: any | null;
}

const presetColors = [
  '#FF6B6B',
  '#6BCB77',
  '#4D96FF',
  '#FFC75F',
  '#D65DB1',
  '#845EC2',
  '#00C9A7',
  '#FFA351',
];

const TagModal: React.FC<Props> = ({ visible, onClose, onSave, tag }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(presetColors[0]);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    if (tag) {
      setName(tag.name);
      const tagColor = tag.colorValue || presetColors[0];
      setColor(tagColor);
      setIsCustom(!presetColors.includes(tagColor));
    } else {
      setName('');
      setColor(presetColors[0]);
      setIsCustom(false);
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
          <View style={styles.swatchContainer}>
            {presetColors.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.swatch,
                  { backgroundColor: c },
                  !isCustom && color === c && styles.activeSwatch,
                ]}
                onPress={() => {
                  setColor(c);
                  setIsCustom(false);
                }}
              />
            ))}
            <TouchableOpacity
              style={[
                styles.swatch,
                styles.customSwatch,
                isCustom && styles.activeSwatch,
              ]}
              onPress={() => setIsCustom(true)}
            >
              <Text
                style={styles.customText}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.5}
              >
                Custom+
              </Text>
            </TouchableOpacity>
          </View>
          {isCustom && (
            <TextInput
              style={styles.input}
              placeholder="Color (#RRGGBB)"
              placeholderTextColor="#6b7280"
              value={color}
              onChangeText={setColor}
            />
          )}
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
  swatchContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  activeSwatch: {
    borderColor: '#000',
    borderWidth: 2,
  },
  customSwatch: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  customText: {
    fontSize: 10,
    color: '#111827',
    textAlign: 'center',
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