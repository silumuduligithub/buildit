import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../theme/colors';

export interface PicklistItem {
  label: string;
  value: string;
  subLabel?: string;
  badge?: string;
}

interface PicklistModalProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  options: PicklistItem[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export default function PicklistModal({
  visible,
  title,
  subtitle,
  options,
  selectedValue,
  onSelect,
  onClose,
}: PicklistModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={styles.sheetContainer}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>{title}</Text>
              {subtitle && <Text style={styles.headerSub}>{subtitle}</Text>}
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Options List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.optionsContent}
          >
            {options.map((option) => {
              const isSelected = selectedValue === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                  onPress={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                  activeOpacity={0.78}
                >
                  <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>

                  <View style={styles.optionTextBox}>
                    <Text
                      style={[
                        styles.optionLabel,
                        isSelected && styles.optionLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {option.subLabel && (
                      <Text style={styles.optionSub}>{option.subLabel}</Text>
                    )}
                  </View>

                  {option.badge && (
                    <View style={styles.badgePill}>
                      <Text style={styles.badgeText}>{option.badge}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    maxHeight: '75%',
    ...shadows.lg,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: radii.full,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: typography.fontSizes.md + 1,
    fontWeight: typography.weights.extrabold,
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: 'bold',
  },
  optionsContent: {
    paddingVertical: spacing.sm,
    gap: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.lg,
    gap: spacing.sm + 2,
  },
  optionRowSelected: {
    backgroundColor: '#FFF0F0',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  optionTextBox: {
    flex: 1,
  },
  optionLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.semibold,
    color: '#334155',
  },
  optionLabelSelected: {
    color: colors.primary,
    fontWeight: typography.weights.extrabold,
  },
  optionSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  badgePill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  badgeText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
  },
});
