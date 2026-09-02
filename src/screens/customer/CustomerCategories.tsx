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
import { buildKartCategories } from '../../services/mockData';
import GradientAppHeader from '../../components/GradientAppHeader';

export default function CustomerCategories({ navigation }: any) {
  const [search, setSearch] = useState('');

  const filteredCategories = buildKartCategories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.subcategories.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.root}>
      {/* ── Gradient Header (Categories) ── */}
      <GradientAppHeader
        title="Categories"
        subtitle="Explore all 7 building categories"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        rightIcon="🔍"
        onRightPress={() => navigation.navigate('SearchTab')}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for categories"
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Categories List */}
        <View style={styles.categoriesList}>
          {filteredCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              onPress={() => navigation.navigate('CategoryProducts', { category: cat.name })}
              activeOpacity={0.85}
            >
              <View style={styles.categoryIconCircle}>
                <Text style={styles.categoryEmoji}>{cat.icon}</Text>
              </View>

              <View style={styles.categoryTextBox}>
                <Text style={styles.categoryName}>{cat.name}</Text>
                <Text style={styles.categorySub}>{cat.subcategories}</Text>
              </View>

              <Text style={styles.chevronArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

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
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  searchIcon: {
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSizes.sm,
    color: colors.text,
  },
  categoriesList: {
    gap: spacing.sm,
  },
  categoryCard: {
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
  categoryIconCircle: {
    width: 52,
    height: 52,
    borderRadius: radii.full,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryEmoji: {
    fontSize: 26,
  },
  categoryTextBox: {
    flex: 1,
  },
  categoryName: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  categorySub: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  chevronArrow: {
    fontSize: 22,
    color: colors.textMuted,
    fontWeight: typography.weights.bold,
  },
});
