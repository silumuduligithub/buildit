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

const DOCUMENTS = [
  { id: 'doc_dl', name: 'Driving License (Commercial)', number: 'DL-0920180045124', status: 'Verified', expiry: '14 Oct, 2031', icon: '🪪' },
  { id: 'doc_rc', name: 'Vehicle Registration Certificate (RC)', number: 'TS09 JK 1234 (Bajaj Maxima)', status: 'Verified', expiry: '08 Mar, 2029', icon: '📄' },
  { id: 'doc_ins', name: 'Commercial Vehicle Insurance', number: 'POL-ICICI-8829104', status: 'Verified', expiry: '22 Dec, 2026', icon: '🛡️' },
  { id: 'doc_pan', name: 'Aadhaar & PAN Card (KYC)', number: 'XXXX-XXXX-4892', status: 'Verified', expiry: 'Lifetime', icon: '👤' },
  { id: 'doc_puc', name: 'Pollution Under Control (PUC)', number: 'PUC-TS-9921', status: 'Pending Renewal', expiry: '15 June, 2025', icon: '💨' },
];

export default function DriverDocumentsScreen({ navigation }: any) {
  return (
    <View style={styles.root}>
      {/* ── Gradient Header ── */}
      <GradientAppHeader
        title="Driver Documents"
        subtitle="Verification & compliance records"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.statusBanner}>
          <Text style={styles.bannerEmoji}>✅</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Account Verified & Active</Text>
            <Text style={styles.bannerSub}>All essential vehicle & KYC documents are compliant.</Text>
          </View>
        </View>

        {DOCUMENTS.map((doc) => (
          <View key={doc.id} style={styles.docCard}>
            <View style={styles.docTopRow}>
              <View style={styles.docIconBox}>
                <Text style={{ fontSize: 22 }}>{doc.icon}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.docName}>{doc.name}</Text>
                <Text style={styles.docNum}>{doc.number}</Text>
                <Text style={styles.docExpiry}>Valid till: {doc.expiry}</Text>
              </View>

              <View
                style={[
                  styles.statusPill,
                  doc.status === 'Verified' ? { backgroundColor: '#ECFDF5' } : { backgroundColor: '#FEF3C7' },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    doc.status === 'Verified' ? { color: '#059669' } : { color: '#D97706' },
                  ]}
                >
                  {doc.status}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.reUploadBtn}
              onPress={() => Alert.alert('Upload Document', `Upload updated copy for ${doc.name}`)}
            >
              <Text style={styles.reUploadText}>Update Document ›</Text>
            </TouchableOpacity>
          </View>
        ))}

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
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: spacing.sm,
  },
  bannerEmoji: {
    fontSize: 24,
  },
  bannerTitle: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.extrabold,
    color: '#065F46',
  },
  bannerSub: {
    fontSize: 10,
    color: '#047857',
    marginTop: 2,
  },
  docCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.sm,
    ...shadows.sm,
  },
  docTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  docIconBox: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  docName: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.extrabold,
    color: '#111827',
  },
  docNum: {
    fontSize: 11,
    color: '#4B5563',
    marginTop: 1,
  },
  docExpiry: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 1,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  statusText: {
    fontSize: 9,
    fontWeight: typography.weights.extrabold,
  },
  reUploadBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 2,
  },
  reUploadText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#EA580C',
  },
});
