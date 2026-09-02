import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import GradientAppHeader from '../../components/GradientAppHeader';

const ISSUES = [
  { id: 'i1', title: 'Customer Unreachable at Site', sub: 'Customer not answering call or gate locked', icon: '📞' },
  { id: 'i2', title: 'Wrong Materials at Retailer Depot', sub: 'Material mismatch or damaged bags', icon: '📦' },
  { id: 'i3', title: 'Vehicle Breakdown on Transit', sub: 'Flat tire, mechanical failure or accident', icon: '⚠️' },
  { id: 'i4', title: 'Payment / Fare Discrepancy', sub: 'Fare dispute, missing toll or tips', icon: '💳' },
  { id: 'i5', title: 'Site Access Restriction', sub: 'Heavy vehicle entry restricted by authorities', icon: '🚧' },
];

export default function DriverSupportScreen({ navigation }: any) {
  const handleReport = (title: string) => {
    Alert.alert('Report Issue', `Support ticket created for: "${title}". Our dispatcher will call you within 2 minutes.`);
  };

  return (
    <View style={styles.root}>
      {/* ── Gradient Header ── */}
      <GradientAppHeader
        title="Help & Driver Support"
        subtitle="24x7 Emergency helpline & issue reporting"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Emergency SOS Call Box */}
        <TouchableOpacity
          style={styles.sosCard}
          onPress={() => Alert.alert('Calling Hotline', 'Connecting to BuildKart Emergency Dispatcher...')}
          activeOpacity={0.88}
        >
          <View style={styles.sosIconBox}>
            <Text style={{ fontSize: 24 }}>🚨</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sosTitle}>Call Driver Emergency Hotline</Text>
            <Text style={styles.sosSub}>Toll-Free 24x7: 1800-419-BUILD (Ext. 2)</Text>
          </View>
          <Text style={styles.sosCallText}>CALL</Text>
        </TouchableOpacity>

        {/* Report Delivery Issue Section */}
        <Text style={styles.sectionHeader}>REPORT ACTIVE DELIVERY ISSUE</Text>
        <View style={styles.issuesCard}>
          {ISSUES.map((issue, idx) => (
            <TouchableOpacity
              key={issue.id}
              style={[styles.issueRow, idx === ISSUES.length - 1 && { borderBottomWidth: 0 }]}
              onPress={() => handleReport(issue.title)}
              activeOpacity={0.78}
            >
              <View style={styles.issueIconCircle}>
                <Text style={{ fontSize: 18 }}>{issue.icon}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.issueTitle}>{issue.title}</Text>
                <Text style={styles.issueSub} numberOfLines={1}>{issue.sub}</Text>
              </View>

              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQs */}
        <View style={styles.faqCard}>
          <Text style={styles.sectionHeader}>PAYMENT & FARE FAQS</Text>
          <Text style={styles.faqQ}>When are my earnings deposited?</Text>
          <Text style={styles.faqA}>Daily at 10:00 PM directly into your verified bank account.</Text>

          <Text style={styles.faqQ}>How are heavy vehicle incentives calculated?</Text>
          <Text style={styles.faqA}>Trips with cement/steel above 500 Kg receive an extra +₹50/tonne bonus.</Text>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  sosCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    gap: spacing.sm,
    ...shadows.sm,
  },
  sosIconBox: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosTitle: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.extrabold,
    color: '#DC2626',
  },
  sosSub: {
    fontSize: 10,
    color: '#991B1B',
    marginTop: 1,
  },
  sosCallText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    color: '#DC2626',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    color: '#9CA3AF',
    letterSpacing: 0.6,
  },
  issuesCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadows.sm,
  },
  issueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md - 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: spacing.sm,
  },
  issueIconCircle: {
    width: 38,
    height: 38,
    borderRadius: radii.md,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  issueTitle: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.bold,
    color: '#111827',
  },
  issueSub: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 1,
  },
  chevron: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  faqCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
    ...shadows.sm,
  },
  faqQ: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#111827',
    marginTop: 4,
  },
  faqA: {
    fontSize: 10,
    color: '#6B7280',
    lineHeight: 14,
  },
});
