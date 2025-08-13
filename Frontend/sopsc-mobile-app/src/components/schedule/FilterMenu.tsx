import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  FlatList
} from 'react-native';
import TagModal from './TagModal';
import * as categoryService from '../../services/scheduleCategoriesService';

interface Props {
  visible: boolean;
  onClose: () => void;
  view: string;
  onViewChange: (view: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const views = ['day', '3day', 'week', 'month'];

const FilterMenu: React.FC<Props> = ({
  visible,
  onClose,
  view,
  onViewChange,
  selectedTags,
  onTagsChange,
}) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<any | null>(null);
  const translateX = useRef(new Animated.Value(-260)).current;

  useEffect(() => {
    if (visible) {
      loadCategories();
      Animated.timing(translateX, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    } else {
      Animated.timing(translateX, { toValue: -260, duration: 200, useNativeDriver: true }).start();
    }
  }, [visible]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      const list = Array.isArray(data) ? data : data.items;
      setCategories(list || []);
    } catch (err) {
      console.error('[FilterMenu] failed to load categories', err);
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleSaveTag = (tag: any) => {
    loadCategories();
    if (!selectedTags.includes(tag.name)) {
      onTagsChange([...selectedTags, tag.name]);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await categoryService.remove(id);
      loadCategories();
    } catch (err) {
      console.error('[FilterMenu] failed to delete category', err);
    }
  };

  const renderTag = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.tagRow}
      onPress={() => toggleTag(item.name)}
      onLongPress={() => handleDelete(item.categoryId)}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <Text style={{ color: item.colorValue, marginRight: 6 }}>⬤</Text>
        <Text style={[styles.optionText, selectedTags.includes(item.name) && styles.selected]}>{item.name}</Text>
      </View>
      <TouchableOpacity onPress={() => { setEditingTag(item); setTagModalVisible(true); }}>
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <>
      {visible && (
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
      <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}> 
        <Text style={styles.header}>View</Text>
        {views.map(v => (
          <TouchableOpacity key={v} onPress={() => onViewChange(v)} style={styles.option}>
            <Text style={[styles.optionText, view === v && styles.selected]}>{v}</Text>
          </TouchableOpacity>
        ))}
        <Text style={[styles.header, { marginTop: 12 }]}>Tags</Text>
        <FlatList
          data={categories}
          keyExtractor={(item) => String(item.categoryId)}
          renderItem={renderTag}
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => { setEditingTag(null); setTagModalVisible(true); }}
        >
          <Text style={styles.addBtnText}>Add Tag</Text>
        </TouchableOpacity>
      </Animated.View>
      <TagModal
        visible={tagModalVisible}
        onClose={() => setTagModalVisible(false)}
        onSave={handleSaveTag}
        tag={editingTag}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 260,
    backgroundColor: '#f5f5f5',
    padding: 16,
    zIndex: 20,
  },
  header: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 16,
  },
  option: { paddingVertical: 6 },
  optionText: {
    fontSize: 14,
    color: '#444',
  },
  selected: {
    color: '#2477ff',
    fontWeight: 'bold',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  editText: { color: '#2477ff', fontSize: 12 },
  addBtn: {
    marginTop: 12,
    backgroundColor: '#2477ff',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: { color: 'white', fontWeight: 'bold' },
});

export default FilterMenu;