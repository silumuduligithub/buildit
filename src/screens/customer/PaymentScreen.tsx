import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { useAppStore } from '../../store';
import GradientAppHeader from '../../components/GradientAppHeader';

const PAYMENT_OPTIONS = [
  { id: 'upi', name: 'UPI', sub: 'Pay using any UPI app (GPay, PhonePe, Paytm)', icon: '⚡', isRecommended: true },
  { id: 'card', name: 'Cards', sub: 'Visa, Mastercard, RuPay & Corporate Cards', icon: '💳' },
  { id: 'netbanking', name: 'Net Banking', sub: 'HDFC, ICICI, SBI, Axis & all major banks', icon: '🏦' },
  { id: 'wallet', name: 'Wallets', sub: 'PhonePe, Paytm, Amazon Pay', icon: '👛' },
  { id: 'cod', name: 'Cash on Delivery', sub: 'Pay cash to delivery partner at your site', icon: '💵' },
];

export default function PaymentScreen({ route, navigation }: any) {
  const totalAmount = route?.params?.totalAmount || 6750;
  const deliveryAddress = route?.params?.address;
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);

  const { cart, placeOrder, clearCart } = useAppStore();

  const handlePay = () => {
    const orderId = `BK-${Date.now().toString().slice(-6)}`;
    const newOrder = {
      id: orderId,
      customerId: 'c1',
      retailerId: cart[0]?.retailer?.id || 's_sri_sai',
      status: 'confirmed' as const,
      items: [...cart],
      subtotal: totalAmount - 10,
      gst: Math.round(totalAmount * 0.18),
      totalAmount,
      deliveryFee: 0,
      deliveryAddress: {
        label: deliveryAddress?.label || 'Home',
        name: deliveryAddress?.recipientName || 'Ravi Kumar',
        phone: deliveryAddress?.phone || '9876543210',
        line1: deliveryAddress?.details || 'Plot No. 45, Street 2, Near RTO Office, Kondapur, Hyderabad',
        city: 'Hyderabad',
        pincode: '500084',
      },
      deliveryType: 'express' as const,
      estimatedDeliveryMins: 25,
      paymentMethod: selectedMethod.toUpperCase() as any,
      paymentStatus: selectedMethod === 'cod' ? ('pending' as const) : ('paid' as const),
      driverName: 'Mahesh Kumar',
      driverPhone: '+91 98765 00112',
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt: new Date().toISOString(),
    };

    placeOrder(newOrder);
    clearCart();

    navigation.replace('OrderTracking', { orderId: newOrder.id, order: newOrder });
  };

  return (
    <View style={styles.root}>
      {/* ── Gradient Header (Payment) ── */}
      <GradientAppHeader
        title="Payment Options"
        subtitle="Step 3 of 3: Secure Payment"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        rightIcon="🔒"
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Amount Payable Card */}
        <View style={styles.amountCard}>
          <View style={styles.amountInfo}>
            <Text style={styles.amountLabel}>Amount Payable</Text>
            <Text style={styles.amountValue}>₹{totalAmount.toLocaleString('en-IN')}</Text>
            <Text style={styles.savingsText}>♢  You save ₹136 on this order</Text>
          </View>
          <TouchableOpacity onPress={() => Alert.alert('Bill Details', `Total payable: ₹${totalAmount}`)}>
            <Text style={styles.viewDetailsText}>View details  ›</Text>
          </TouchableOpacity>
        </View>

        {/* Recommended Section */}
        <Text style={styles.sectionTitle}>RECOMMENDED FOR YOU</Text>
        <View style={styles.upiCard}>
          <TouchableOpacity style={styles.upiHeader} onPress={() => setSelectedMethod('upi')} activeOpacity={0.88}>
            <View style={[styles.optionIconBox, styles.upiIconBox]}><Text style={styles.optionEmoji}>UPI</Text></View>
            <View style={styles.optionTextBox}>
              <View style={styles.upiNameRow}><Text style={styles.optionName}>UPI</Text><Text style={styles.instantPill}>⚡ Instant</Text></View>
              <Text style={styles.optionSub}>Pay using any UPI app</Text>
              <Text style={styles.providerText}>GPay, PhonePe, Paytm, BHIM & more</Text>
            </View>
            <View style={styles.selectedCheck}><Text style={styles.checkText}>✓</Text></View>
          </TouchableOpacity>
          <View style={styles.upiBenefits}>
            <Text style={styles.benefitText}>♢ Fast & Secure</Text><Text style={styles.benefitText}>↻ Instant Refund</Text><Text style={styles.benefitText}>◇ No Extra Charges</Text>
          </View>
          <TouchableOpacity style={styles.upiAction} onPress={() => setSelectedMethod('upi')} activeOpacity={0.88}>
            <Text style={styles.upiActionText}>▦  Pay with UPI ID or Scan QR</Text><Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Other Payment Methods */}
        <Text style={[styles.sectionTitle, { marginTop: spacing.md }]}>ALL PAYMENT OPTIONS</Text>
        {PAYMENT_OPTIONS.filter((o) => !o.isRecommended).map((option) => {
          const isSelected = selectedMethod === option.id;
          return (
            <View key={option.id}>
            <TouchableOpacity
              style={[styles.paymentCard, isSelected && styles.paymentCardActive]}
              onPress={() => { setSelectedMethod(option.id); setExpandedMethod(expandedMethod === option.id ? null : option.id); }}
              activeOpacity={0.88}
            >
              <View style={styles.optionIconBox}>
                <Text style={styles.optionEmoji}>{option.icon}</Text>
              </View>

              <View style={styles.optionTextBox}>
                <Text style={styles.optionName}>{option.name}</Text>
                <Text style={styles.optionSub}>{option.sub}</Text>
              </View>

              <Text style={styles.expandIcon}>{expandedMethod === option.id ? '⌃' : '⌄'}</Text>
              <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>{isSelected && <View style={styles.radioDot} />}</View>
            </TouchableOpacity>
            {expandedMethod === option.id && <View style={styles.expandedPanel}><Text style={styles.expandedText}>Choose {option.name} securely to continue.</Text></View>}
            </View>
          );
        })}

        <View style={styles.securityCard}><Text style={styles.securityIcon}>🛡️</Text><View><Text style={styles.securityTitle}>Safe & Secure Payments</Text><Text style={styles.securityText}>Your payment information is encrypted and safe with us.</Text></View><Text style={styles.securityMarks}>PCI DSS  ✓ VISA</Text></View>
        <View style={{ height: 156 }} />
      </ScrollView>

      {/* Pay CTA Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomSavings}><Text style={styles.bottomSavingsTitle}>₹136 SAVINGS</Text><Text style={styles.bottomSavingsSub}>View price details⌄</Text></View>
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePay}
          activeOpacity={0.88}
        >
          <Text style={styles.payButtonText}>🔒  Pay ₹{totalAmount.toLocaleString('en-IN')} Securely  →</Text>
        </TouchableOpacity>
      </View>
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
    gap: spacing.sm + 2,
  },
  amountInfo: { flex: 1 },
  amountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xs,
    ...shadows.sm,
  },
  amountLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  amountValue: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    marginTop: 2,
  },
  savingsText: {
    alignSelf: 'flex-start',
    color: '#24954B',
    backgroundColor: '#EEF8EE',
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    fontSize: 11,
    fontWeight: typography.weights.bold,
    marginTop: spacing.sm,
  },
  viewDetailsText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: typography.weights.extrabold,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginTop: spacing.xs,
    marginLeft: 4,
  },
  upiCard: {
    backgroundColor: '#FFF8F3',
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: '#FF6B22',
    padding: spacing.md,
    gap: spacing.sm,
  },
  upiHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  upiIconBox: { backgroundColor: colors.white, borderRadius: radii.full },
  upiNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  instantPill: { color: '#48A536', backgroundColor: '#EEF8DC', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 3, fontSize: 10, fontWeight: typography.weights.bold },
  providerText: { color: colors.textMuted, fontSize: 10, marginTop: 4 },
  selectedCheck: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FF641D', alignItems: 'center', justifyContent: 'center' },
  checkText: { color: colors.white, fontSize: 24, fontWeight: typography.weights.bold },
  upiBenefits: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#FFF0E4', borderRadius: radii.sm, paddingVertical: spacing.sm },
  benefitText: { color: colors.textSecondary, fontSize: 10 },
  upiAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FF5B12', borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  upiActionText: { color: colors.white, fontSize: typography.fontSizes.sm, fontWeight: typography.weights.extrabold },
  actionArrow: { color: colors.primary, backgroundColor: colors.white, borderRadius: radii.full, width: 28, height: 28, textAlign: 'center', fontSize: 26, lineHeight: 25 },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing.md,
    ...shadows.sm,
  },
  expandIcon: { color: colors.text, fontSize: 20, marginLeft: 4 },
  expandedPanel: { backgroundColor: colors.surface, marginTop: -spacing.sm, padding: spacing.sm, borderBottomLeftRadius: radii.lg, borderBottomRightRadius: radii.lg },
  expandedText: { color: colors.textSecondary, fontSize: 11 },
  paymentCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFaded,
  },
  optionIconBox: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionEmoji: {
    fontSize: 22,
  },
  optionTextBox: {
    flex: 1,
  },
  optionName: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  optionSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 78,
    left: 0,
    right: 0,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.lg,
  },
  payButton: {
    flex: 1.3,
    backgroundColor: '#FF5B12',
    paddingVertical: spacing.md - 2,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  payButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.weights.extrabold,
  },
  bottomSavings: { flex: 0.8 },
  bottomSavingsTitle: { color: '#24954B', fontSize: 10, fontWeight: typography.weights.extrabold },
  bottomSavingsSub: { color: colors.textSecondary, fontSize: 10, marginTop: 3 },
  securityCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: '#F3FAEE', borderRadius: radii.lg, borderWidth: 1, borderColor: '#DDEED5', padding: spacing.md, marginTop: spacing.sm },
  securityIcon: { fontSize: 28 },
  securityTitle: { color: colors.text, fontSize: 11, fontWeight: typography.weights.bold },
  securityText: { color: colors.textSecondary, fontSize: 10, marginTop: 3, maxWidth: 150 },
  securityMarks: { color: '#34763E', fontSize: 9, fontWeight: typography.weights.bold, flex: 1, textAlign: 'right' },
});
