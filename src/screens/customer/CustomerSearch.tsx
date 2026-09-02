import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { mockProducts } from '../../services/mockData';
import GradientAppHeader from '../../components/GradientAppHeader';

const INITIAL_RECENT_SEARCHES = [
  'UltraTech Cement',
  'TMT Steel 12mm',
  'Paint Asian',
  'Birla White Cement',
];

const POPULAR_SEARCHES = [
  'Cement',
  'Steel',
  'Sand',
  'Bricks',
  'Putty',
  'Tiles',
  'Wire',
  'Tank',
];

export default function CustomerSearch({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(INITIAL_RECENT_SEARCHES);

  const removeRecent = (term: string) => {
    setRecentSearches(recentSearches.filter((t) => t !== term));
  };

  const filteredProducts = searchQuery.trim()
    ? mockProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <View style={styles.root}>
      {/* ── Gradient Header (Search) ── */}
      <GradientAppHeader
        title="Search Materials"
        subtitle="Cement, steel, sand & construction tools"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Bar Input */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search cement, sand, steel, bricks..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {searchQuery.trim().length === 0 ? (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <View style={styles.recentList}>
                  {recentSearches.map((term) => (
                    <TouchableOpacity
                      key={term}
                      style={styles.recentRow}
                      onPress={() => setSearchQuery(term)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.clockIcon}>🕒</Text>
                      <Text style={styles.recentText}>{term}</Text>
                      <TouchableOpacity onPress={() => removeRecent(term)}>
                        <Text style={styles.removeIcon}>✕</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Popular Searches */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Searches</Text>
              <View style={styles.chipsWrap}>
                {POPULAR_SEARCHES.map((chip) => (
                  <TouchableOpacity
                    key={chip}
                    style={styles.popularChip}
                    onPress={() => setSearchQuery(chip)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.popularChipText}>{chip}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          /* Live Results List */
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>Results ({filteredProducts.length})</Text>

            {filteredProducts.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyTitle}>No materials found for "{searchQuery}"</Text>
              </View>
            ) : (
              filteredProducts.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.resultCard}
                  onPress={() => navigation.navigate('ProductDetail', { productId: p.id })}
                >
                  <View style={styles.resultImageBox}>
                    <Text style={styles.resultEmoji}>
                      {p.name.includes('Cement') ? '🏗️'
                        : p.name.includes('Steel') ? '🔩'
                        : p.name.includes('Sand') ? '⏳'
                        : p.name.includes('Brick') ? '🧱'
                        : p.name.includes('Paint') ? '🎨'
                        : '📦'}
                    </Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.resultName}>{p.name}</Text>
                    <Text style={styles.resultMeta}>{p.brand} • {p.unit}</Text>
                    <Text style={styles.resultCategory}>{p.category}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.compareBtn}
                    onPress={() => navigation.navigate('StoreCompare', { productId: p.id, productName: p.name })}
                  >
                    <Text style={styles.compareBtnText}>Compare ›</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    ...shadows.sm,
  },
  searchIcon: {
    fontSize: 15,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSizes.sm,
    color: colors.text,
  },
  clearIcon: {
    fontSize: 14,
    color: colors.textMuted,
    padding: 4,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  recentList: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  clockIcon: {
    fontSize: 14,
    marginRight: spacing.sm,
  },
  recentText: {
    fontSize: typography.fontSizes.sm,
    color: colors.text,
    fontWeight: typography.weights.medium,
    flex: 1,
  },
  removeIcon: {
    fontSize: 14,
    color: colors.textMuted,
    padding: 4,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  popularChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  popularChipText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  resultsSection: {
    gap: spacing.sm,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    ...shadows.sm,
  },
  resultImageBox: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultEmoji: {
    fontSize: 24,
  },
  resultName: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  resultMeta: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  resultCategory: {
    fontSize: 9,
    color: colors.primary,
    fontWeight: typography.weights.extrabold,
    marginTop: 2,
  },
  compareBtn: {
    backgroundColor: colors.primaryFaded,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.md,
  },
  compareBtnText: {
    color: colors.primary,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
  },
});
