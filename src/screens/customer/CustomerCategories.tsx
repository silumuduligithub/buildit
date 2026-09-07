import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  Search,
  ChevronRight,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react-native';
import { colors, typography, spacing, radii, shadows } from '../../theme/colors';
import { detailedCategories, DetailedCategoryItem } from '../../services/mockData';
import { customerService } from '../../services';
import GradientAppHeader from '../../components/GradientAppHeader';
import EmptyState from '../../components/ui/EmptyState';

const { width } = Dimensions.get('window');

export default function CustomerCategories({ navigation }: any) {
  const [categoriesList, setCategoriesList] = useState<DetailedCategoryItem[]>(detailedCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    detailedCategories[0]?.id || 'cat_structural'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    customerService.getCategoriesScreen().then((res) => {
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const liveCats: DetailedCategoryItem[] = res.data.map((c: any, index: number) => {
          const defaultSubcats = detailedCategories[index]?.subcategories || [];
          return {
            id: c.id || `cat_${index}`,
            name: c.name || 'Category',
            subcategoriesText: c.subtitle || '',
            icon: detailedCategories[index]?.icon || '🏗️',
            imageUrl: detailedCategories[index]?.imageUrl || c.icon_url || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8',
            totalProducts: c.subcategories_count ? c.subcategories_count * 8 : 40,
            subcategories: c.subcategories && c.subcategories.length > 0
              ? c.subcategories.map((s: any, sIdx: number) => ({
                  id: s.id || `sub_${sIdx}`,
                  name: s.name,
                  itemCount: 12,
                  imageUrl: defaultSubcats[sIdx]?.imageUrl || 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f',
                  description: s.description || s.name,
                }))
              : defaultSubcats,
          };
        });
        setCategoriesList(liveCats);
        if (liveCats[0]) setSelectedCategoryId(liveCats[0].id);
      }
    }).catch(() => {})
    .finally(() => {
      setIsLoading(false);
    });
  }, []);

  const selectedCategory = useMemo(() => {
    return (
      categoriesList.find((c) => c.id === selectedCategoryId) ||
      categoriesList[0] ||
      detailedCategories[0]
    );
  }, [categoriesList, selectedCategoryId]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categoriesList;
    const q = searchQuery.toLowerCase();
    return categoriesList.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.subcategoriesText.toLowerCase().includes(q) ||
        c.subcategories.some((s) => s.name.toLowerCase().includes(q))
    );
  }, [categoriesList, searchQuery]);

  const handleSubCategoryPress = (catName: string, subName: string) => {
    navigation.navigate('CategoryProducts', {
      category: catName,
      sub: subName,
    });
  };

  return (
    <View style={styles.root}>
      {/* ── Signature Gradient Header ── */}
      <GradientAppHeader
        title="Material Catalog"
        subtitle="Browse all construction categories & varieties"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        showSearch={false}
      />

      {/* ── Search Bar ── */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color={colors.textTertiary} strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cement, steel, pipes, paints..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* ── Dual-Pane Category & Variety Explorer ── */}
      <View style={styles.mainExplorer}>
        {/* Left Sidebar Category Rail */}
        <View style={styles.leftRail}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.leftRailContent}
          >
            {filteredCategories.map((cat) => {
              const isSelected = cat.id === selectedCategory?.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.railItem,
                    isSelected ? styles.railItemActive : styles.railItemInactive,
                  ]}
                  onPress={() => setSelectedCategoryId(cat.id)}
                  activeOpacity={0.8}
                >
                  {isSelected && <View style={styles.activeIndicatorBar} />}
                  <View
                    style={[
                      styles.railIconCircle,
                      isSelected && styles.railIconCircleActive,
                    ]}
                  >
                    <Text style={styles.railEmoji}>{cat.icon}</Text>
                  </View>
                  <Text
                    style={[
                      styles.railTitle,
                      isSelected ? styles.railTitleActive : styles.railTitleInactive,
                    ]}
                    numberOfLines={2}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Right Pane: All Variety Options for Selected Category */}
        <View style={styles.rightPane}>
          {isLoading ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl }}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ marginTop: spacing.sm, fontSize: typography.fontSizes.caption, color: colors.textSecondary }}>
                Loading varieties...
              </Text>
            </View>
          ) : selectedCategory ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.rightPaneContent}
            >
              {/* Category Header Banner */}
              <View style={styles.categoryHeaderBanner}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.categoryBannerTitle}>
                    {selectedCategory.name}
                  </Text>
                  <Text style={styles.categoryBannerSubtitle}>
                    {selectedCategory.subcategories.length} Material Varieties ·{' '}
                    {selectedCategory.totalProducts}+ Products
                  </Text>
                </View>
              </View>

              {/* Variety Subcategory Cards Grid */}
              <View style={styles.varietyGrid}>
                {selectedCategory.subcategories.map((sub) => (
                  <TouchableOpacity
                    key={sub.id}
                    style={styles.varietyCard}
                    onPress={() =>
                      handleSubCategoryPress(selectedCategory.name, sub.name)
                    }
                    activeOpacity={0.88}
                  >
                    <Image
                      source={{ uri: sub.imageUrl }}
                      style={styles.varietyImage}
                      resizeMode="cover"
                    />

                    {sub.badge && (
                      <View style={styles.varietyBadge}>
                        <Text style={styles.varietyBadgeText}>{sub.badge}</Text>
                      </View>
                    )}

                    <View style={styles.varietyInfo}>
                      <Text style={styles.varietyName} numberOfLines={1}>
                        {sub.name}
                      </Text>
                      <Text style={styles.varietyDesc} numberOfLines={2}>
                        {sub.description}
                      </Text>

                      <View style={styles.varietyFooter}>
                        <Text style={styles.varietyCount}>
                          {sub.itemCount} items
                        </Text>
                        <View style={styles.exploreArrow}>
                          <ChevronRight
                            size={14}
                            color={colors.primary}
                            strokeWidth={2.5}
                          />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* View Full Catalog CTA */}
              <TouchableOpacity
                style={styles.viewFullCategoryBtn}
                onPress={() =>
                  navigation.navigate('CategoryProducts', {
                    category: selectedCategory.name,
                    sub: 'All',
                  })
                }
                activeOpacity={0.85}
              >
                <Text style={styles.viewFullCategoryText}>
                  View All {selectedCategory.name}
                </Text>
                <ArrowRight size={16} color={colors.white} strokeWidth={2} />
              </TouchableOpacity>

              <View style={{ height: 100 }} />
            </ScrollView>
          ) : (
            <EmptyState
              icon={<Package size={28} color={colors.primary} strokeWidth={1.5} />}
              title="No categories found"
              description="Try a different search keyword."
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBarContainer: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radii.full,
    paddingHorizontal: spacing.base,
    height: 44,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSizes.bodySmall,
    color: colors.text,
  },

  // ── Dual Pane Explorer ──
  mainExplorer: {
    flex: 1,
    flexDirection: 'row',
  },

  // Left Sidebar Rail
  leftRail: {
    width: 100,
    backgroundColor: '#F1F5F9',
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  leftRailContent: {
    paddingBottom: spacing.xl,
  },
  railItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.6)',
  },
  railItemActive: {
    backgroundColor: colors.surface,
  },
  railItemInactive: {
    backgroundColor: 'transparent',
  },
  activeIndicatorBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3.5,
    backgroundColor: colors.primary,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  railIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    ...shadows.sm,
  },
  railIconCircleActive: {
    backgroundColor: colors.pillActiveBg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  railEmoji: {
    fontSize: 20,
  },
  railTitle: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
    paddingHorizontal: 2,
  },
  railTitleActive: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  railTitleInactive: {
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },

  // Right Variety Content Pane
  rightPane: {
    flex: 1,
    backgroundColor: colors.background,
  },
  rightPaneContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  categoryHeaderBanner: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  categoryBannerTitle: {
    fontSize: typography.fontSizes.body,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  categoryBannerSubtitle: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Variety Cards
  varietyGrid: {
    gap: spacing.md,
  },
  varietyCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  varietyImage: {
    width: '100%',
    height: 110,
  },
  varietyBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  varietyBadgeText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  varietyInfo: {
    padding: spacing.md,
  },
  varietyName: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  varietyDesc: {
    fontSize: typography.fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  varietyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  varietyCount: {
    fontSize: typography.fontSizes.caption,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  exploreArrow: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Full Category Button
  viewFullCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: radii.full,
    gap: spacing.sm,
    marginTop: spacing.xs,
    ...shadows.sm,
  },
  viewFullCategoryText: {
    fontSize: typography.fontSizes.bodySmall,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
});
