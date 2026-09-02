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
        subtitle={`Amount Payable: ₹${totalAmount.toLocaleString('en-IN')}`}
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Amount Payable Card */}
        <View style={styles.amountCard}>
          <View>
            <Text style={styles.amountLabel}>Amount Payable</Text>
            <Text style={styles.amountValue}>₹{totalAmount.toLocaleString('en-IN')}</Text>
          </View>
          <TouchableOpacity onPress={() => Alert.alert('Bill Details', `Total payable: ₹${totalAmount}`)}>
            <Text style={styles.viewDetailsText}>View details</Text>
          </TouchableOpacity>
        </View>

        {/* Recommended Section */}
        <Text style={styles.sectionTitle}>RECOMMENDED</Text>
        {PAYMENT_OPTIONS.filter((o) => o.isRecommended).map((option) => {
          const isSelected = selectedMethod === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.paymentCard, isSelected && styles.paymentCardActive]}
              onPress={() => setSelectedMethod(option.id)}
              activeOpacity={0.88}
            >
              <View style={styles.optionIconBox}>
                <Text style={styles.optionEmoji}>{option.icon}</Text>
              </View>

              <View style={styles.optionTextBox}>
                <Text style={styles.optionName}>{option.name}</Text>
                <Text style={styles.optionSub}>{option.sub}</Text>
              </View>

              <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Other Payment Methods */}
        <Text style={[styles.sectionTitle, { marginTop: spacing.md }]}>ALL PAYMENT OPTIONS</Text>
        {PAYMENT_OPTIONS.filter((o) => !o.isRecommended).map((option) => {
          const isSelected = selectedMethod === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.paymentCard, isSelected && styles.paymentCardActive]}
              onPress={() => setSelectedMethod(option.id)}
              activeOpacity={0.88}
            >
              <View style={styles.optionIconBox}>
                <Text style={styles.optionEmoji}>{option.icon}</Text>
              </View>

              <View style={styles.optionTextBox}>
                <Text style={styles.optionName}>{option.name}</Text>
                <Text style={styles.optionSub}>{option.sub}</Text>
              </View>

              <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Pay CTA Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePay}
          activeOpacity={0.88}
        >
          <Text style={styles.payButtonText}>Pay ₹{totalAmount.toLocaleString('en-IN')}</Text>
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
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    marginTop: 2,
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
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing.md,
    ...shadows.sm,
  },
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
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.lg,
  },
  payButton: {
    backgroundColor: colors.primary,
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
});
