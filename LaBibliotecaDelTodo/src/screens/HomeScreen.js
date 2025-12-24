import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { CATEGORIES } from '../data/data';

const norm = (s) => (s || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const HomeScreen = ({ navigation }) => {
  const [query, setQuery] = React.useState('');
  const [expanded, setExpanded] = React.useState(new Set());
  const [selectedTags, setSelectedTags] = React.useState([]);

  React.useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const tokens = React.useMemo(() => selectedTags.map((t) => norm(t)), [selectedTags]);
  const withInherited = React.useMemo(() => {
    const decorate = (node) => {
      const children = (node.subcategories || []).map(decorate);
      const set = new Set([...(node.keywords || [])]);
      children.forEach((c) => (c.inheritedKeywords || []).forEach((k) => set.add(k)));
      return { ...node, subcategories: children, inheritedKeywords: Array.from(set) };
    };
    return (CATEGORIES || []).map(decorate);
  }, []);
  const matchesTokens = (node, toks) => {
    const pool = [...(node.inheritedKeywords || node.keywords || [])];
    const selfHit = toks.some((t) => pool.some((p) => norm(p) === t));
    if (selfHit) return true;
    const children = node.subcategories || [];
    return children.some((c) => matchesTokens(c, toks));
  };
  const nodeMatches = (node, toks) => {
    const pool = node.inheritedKeywords || node.keywords || [];
    return toks.some((t) => pool.some((p) => norm(p) === t));
  };
  const nodeSelfMatches = (node, toks) => {
    const pool = node.keywords || [];
    return toks.some((t) => pool.some((p) => norm(p) === t));
  };

  const filterTree = (node, toks) => {
    if (nodeSelfMatches(node, toks)) {
      return node;
    }
    const prunedChildren = (node.subcategories || []).map((child) => filterTree(child, toks)).filter(Boolean);
    if (nodeMatches(node, toks) || prunedChildren.length > 0) return { ...node, subcategories: prunedChildren };
    return null;
  };

  const shown = React.useMemo(() => {
    if (tokens.length === 0) return withInherited;
    return withInherited.map((cat) => filterTree(cat, tokens)).filter(Boolean);
  }, [tokens, withInherited]);

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const expandedAuto = React.useMemo(() => {
    if (tokens.length === 0) return new Set();
    const ids = new Set();
    const walk = (node, path) => {
      const children = node.subcategories || [];
      let childHit = false;
      for (const ch of children) {
        if (walk(ch, [...path, node])) childHit = true;
      }
      const selfHit = nodeSelfMatches(node, tokens);
      if (selfHit) {
        path.forEach((p) => p.id && ids.add(p.id));
        return true;
      }
      if (childHit) {
        if (node.id) ids.add(node.id);
        return true;
      }
      return false;
    };
    withInherited.forEach((n) => walk(n, []));
    return ids;
  }, [tokens, withInherited]);

  React.useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expandedAuto);
  }, [expandedAuto]);

  const allKeywords = React.useMemo(() => {
    const set = new Set();
    const walk = (node) => {
      (node.keywords || []).forEach((k) => set.add(k));
      if (node.title) set.add(node.title);
      (node.subcategories || []).forEach(walk);
    };
    (CATEGORIES || []).forEach(walk);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  const suggestions = React.useMemo(() => {
    const q = norm(query.trim());
    if (!q) return [];
    return allKeywords.filter((k) => norm(k).includes(q) && !selectedTags.includes(k));
  }, [allKeywords, query, selectedTags]);

  const addTag = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
    setQuery('');
  };

  const removeTag = (tag) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const lightenHex = (hex, amount = 0.25) => {
    if (!hex || typeof hex !== 'string') return hex;
    const m = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (!m) return hex;
    const to = (h) => Math.min(255, Math.floor(parseInt(h, 16) + 255 * amount));
    const r = to(m[1]).toString(16).padStart(2, '0');
    const g = to(m[2]).toString(16).padStart(2, '0');
    const b = to(m[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  const Row = ({ node, parentColor, level = 0 }) => {
    const hasChildren = (node.subcategories || []).length > 0;
    const isOpen = expanded.has(node.id);
    const onPress = () => toggleExpand(node.id);
    
    const [tagsExpanded, setTagsExpanded] = React.useState(false);
    const keywords = node.keywords || [];

    const baseColor = node.color || parentColor;
    const isSubSub = level >= 2;

    // Logic for background color:
    // Level 0: Default light gray
    // Level 1: Category color
    // Level 2+: White (to stand out with border instead of full color)
    const bgColor = level === 0 ? '#f9f9f9' : level === 1 ? baseColor : '#ffffff';
    const indent = level * 12;

    // Special styling for sub-sub categories
    const customStyle = isSubSub ? {
      borderLeftWidth: 6,
      borderLeftColor: baseColor,
      borderWidth: 1,
      borderColor: '#eeeeee',
      borderLeftWidth: 6, // Ensure left border is thicker
    } : {};

    // Default colors if not provided in data
    const titleColor = node.titleColor || '#000000';
    const tagColor = node.tagColor || '#555555';

    return (
      <View>
        <TouchableOpacity style={[styles.item, { backgroundColor: bgColor, marginLeft: indent }, customStyle]} onPress={onPress}>
          <View style={[styles.iconWrapper, { backgroundColor: baseColor }]}> 
            <Ionicons name={(node.icon && node.icon.name) || 'apps'} size={24} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: titleColor }]}>{node.title}</Text>
            {keywords.length > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 4 }}>
                <View style={[styles.inlineTagsContainer, !tagsExpanded && { maxHeight: 26, overflow: 'hidden' }]}>
                  {keywords.map((k) => (
                    <TouchableOpacity key={k} onPress={() => addTag(k)} style={styles.inlineTag}>
                      <Text style={[styles.inlineTagText, { color: tagColor }]}>{k}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity 
                  onPress={() => setTagsExpanded(!tagsExpanded)} 
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{ marginLeft: 4, padding: 2 }}
                >
                  <Ionicons name={tagsExpanded ? 'chevron-up-circle' : 'chevron-down-circle'} size={20} color={tagColor} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          {hasChildren && (
            <Ionicons
              name={isOpen ? 'chevron-down' : 'chevron-forward'}
              size={18}
              color={tagColor}
              style={{ marginLeft: 8 }}
            />
          )}
        </TouchableOpacity>
        {isOpen && node.content && (
          <View style={styles.contentBox}> 
            <Text style={styles.contentText}>{node.content}</Text>
          </View>
        )}
        {hasChildren && isOpen && (
          <View style={[styles.childrenContainer]}> 
            {(node.subcategories || []).map((child) => (
              <Row key={child.id} node={child} parentColor={baseColor} level={level + 1} />
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.listContent}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar categorías o palabras claves"
        style={styles.search}
      />
      {selectedTags.length > 0 && (
        <View style={styles.tagsContainer}>
          {selectedTags.map((t) => (
            <View key={t} style={styles.tagChip}>
              <Text style={styles.tagText}>{t}</Text>
              <TouchableOpacity onPress={() => removeTag(t)} style={styles.tagRemove}>
                <Ionicons name="close" size={14} color="#555" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((s) => (
            <TouchableOpacity key={s} style={styles.suggestionChip} onPress={() => addTag(s)}>
              <Ionicons name="pricetag" size={14} color="#555" style={{ marginRight: 6 }} />
              <Text style={styles.suggestionText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {shown.map((item) => (
        <Row key={item.id} node={item} parentColor={item.color} level={0} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    maxHeight: '90dvh',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  search: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef3ff',
    borderColor: '#d7e0ff',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#333',
    fontSize: 13,
    marginRight: 6,
  },
  tagRemove: {
    paddingLeft: 4,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderColor: '#e7e7e7',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  suggestionText: {
    color: '#333',
    fontSize: 13,
  },
  listContent: {
    paddingBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    position: 'relative',
  },
  childrenContainer: {
    paddingLeft: 0,
    marginLeft: 0,
  },
  contentBox: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: 'stretch',
    width: '100%',
  },
  contentText: {
    fontSize: 14,
    color: '#333',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  inlineTagsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  inlineTag: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  inlineTagText: {
    fontSize: 11,
    color: '#555',
  },
});

export default HomeScreen;
