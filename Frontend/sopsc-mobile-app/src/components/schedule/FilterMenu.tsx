import React from 'react';
import { Modal, TouchableOpacity, View, Text, StyleSheet } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  view: string;
  onViewChange: (view: string) => void;
  tags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const views = ['day', '3day', 'week', 'month'];

const FilterMenu: React.FC<Props> = ({
  visible,
  onClose,
  view,
  onViewChange,
  tags,
  selectedTags,
  onTagsChange,
}) => {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.container}>
          <Text style={styles.header}>View</Text>
          {views.map(v => (
            <TouchableOpacity key={v} onPress={() => onViewChange(v)} style={styles.option}>
              <Text style={[styles.optionText, view === v && styles.selected]}>{v}</Text>
            </TouchableOpacity>
          ))}
          <Text style={[styles.header, { marginTop: 12 }]}>Tags</Text>
          {tags.map(t => (
            <TouchableOpacity key={t} onPress={() => toggleTag(t)} style={styles.option}>
              <Text style={[styles.optionText, selectedTags.includes(t) && styles.selected]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
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
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  header: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 16,
  },
  option: {
    paddingVertical: 6,
  },
  optionText: {
    fontSize: 14,
    color: '#444',
  },
  selected: {
    color: '#2477ff',
    fontWeight: 'bold',
  },
});

export default FilterMenu;