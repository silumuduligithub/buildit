import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  User,
  Store,
  Truck,
  CheckCircle2,
  KeyRound,
  Sparkles,
} from 'lucide-react-native';
import { colors, spacing, typography, radii, shadows } from '../../theme/colors';
import { useAppStore } from '../../store';
import { authService } from '../../services/auth/authService';
import { UserRole } from '../../types';

export default function LoginScreen({ navigation }: any) {
  const { setCurrentRole, loginUser, refreshProfile } = useAppStore();

  const [authMode, setAuthMode] = useState<'otp' | 'password'>('otp');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Send OTP handler
  const handleSendOtp = async () => {
    if (!phone || phone.trim().length < 10) {
      Alert.alert('Invalid Mobile Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      await authService.sendOtp(phone.trim());
      setIsOtpSent(true);
      setOtp('123456'); // Auto-fill default test OTP for seamless testing
      Alert.alert('OTP Sent', `Verification code sent to +91 ${phone.trim()}. (Use default test OTP 123456)`);
    } catch (err: any) {
      Alert.alert('Error Sending OTP', err?.message || 'Unable to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP & Login
  const handleVerifyOtp = async () => {
    if (!otp || otp.trim().length < 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.verifyOtp({
        phone: phone.trim(),
        otp: otp.trim(),
        role: selectedRole === 'delivery' ? 'driver' : selectedRole,
      });

      if (res.data?.user) {
        useAppStore.setState({
          isAuthenticated: true,
          isAuthLoading: false,
          currentUser: res.data.user,
          userRoleData: res.data.role_data,
        });
        setCurrentRole(selectedRole);
        await refreshProfile();
        if (navigation?.navigate) {
          Alert.alert(
            'Login Successful',
            `Welcome back, ${res.data.user.name || 'User'}!`,
            [{ text: 'Continue', onPress: () => navigation.navigate('HomeScreen') }]
          );
        }
      } else {
        throw new Error(res.message || 'Authentication failed');
      }
    } catch (err: any) {
      Alert.alert('Verification Failed', err?.message || 'Incorrect OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Password Login
  const handlePasswordLogin = async () => {
    if (!phone.trim()) {
      Alert.alert('Missing Identifier', 'Please enter your mobile number or email.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Missing Password', 'Please enter your account password.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(phone.trim(), password.trim(), selectedRole === 'delivery' ? 'driver' : selectedRole);
      if (res.data?.user) {
        setCurrentRole(selectedRole);
        if (navigation?.navigate) {
          Alert.alert(
            'Login Successful',
            `Welcome back, ${res.data.user.name || 'User'}!`,
            [{ text: 'Continue', onPress: () => navigation.navigate('HomeScreen') }]
          );
        }
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (err: any) {
      Alert.alert('Login Failed', err?.message || 'Invalid credentials. Please verify your phone and password.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Autofill
  const handleDemoAutofill = (role: UserRole, demoPhone: string) => {
    setSelectedRole(role);
    setPhone(demoPhone);
    setPassword('Buildkart@123');
    setOtp('123456');
    setIsOtpSent(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Signature Gradient Header ── */}
      <LinearGradient
        colors={['#101924', '#1E293B', '#334155']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerTop}>
          <View style={styles.brandIconBox}>
            <Text style={styles.brandEmoji}>🏗️</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>
              Build<Text style={{ color: colors.primary }}>Kart</Text>
            </Text>
            <Text style={styles.brandSubtitle}>Building Materials Marketplace</Text>
          </View>
        </View>

        <Text style={styles.heroGreeting}>Welcome Back</Text>
        <Text style={styles.heroSub}>
          Sign in to access real-time construction supply rates and instant site deliveries.
        </Text>

        {/* Role Selector Tabs */}
        <View style={styles.roleTabsContainer}>
          <TouchableOpacity
            style={[styles.roleTab, selectedRole === 'customer' && styles.roleTabActive]}
            onPress={() => setSelectedRole('customer')}
            activeOpacity={0.85}
          >
            <User size={14} color={selectedRole === 'customer' ? colors.white : 'rgba(255,255,255,0.7)'} strokeWidth={2.2} />
            <Text style={[styles.roleTabText, selectedRole === 'customer' && styles.roleTabTextActive]}>
              Customer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleTab, selectedRole === 'retailer' && styles.roleTabActive]}
            onPress={() => setSelectedRole('retailer')}
            activeOpacity={0.85}
          >
            <Store size={14} color={selectedRole === 'retailer' ? colors.white : 'rgba(255,255,255,0.7)'} strokeWidth={2.2} />
            <Text style={[styles.roleTabText, selectedRole === 'retailer' && styles.roleTabTextActive]}>
              Retailer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleTab, selectedRole === 'delivery' && styles.roleTabActive]}
            onPress={() => setSelectedRole('delivery')}
            activeOpacity={0.85}
          >
            <Truck size={14} color={selectedRole === 'delivery' ? colors.white : 'rgba(255,255,255,0.7)'} strokeWidth={2.2} />
            <Text style={[styles.roleTabText, selectedRole === 'delivery' && styles.roleTabTextActive]}>
              Driver
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Auth Method Switcher (OTP vs Password) */}
        <View style={styles.authModeToggle}>
          <TouchableOpacity
            style={[styles.modeBtn, authMode === 'otp' && styles.modeBtnActive]}
            onPress={() => {
              setAuthMode('otp');
              setIsOtpSent(false);
            }}
          >
            <KeyRound size={14} color={authMode === 'otp' ? colors.primary : '#64748B'} strokeWidth={2.2} />
            <Text style={[styles.modeBtnText, authMode === 'otp' && styles.modeBtnTextActive]}>
              Instant OTP Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeBtn, authMode === 'password' && styles.modeBtnActive]}
            onPress={() => setAuthMode('password')}
          >
            <Lock size={14} color={authMode === 'password' ? colors.primary : '#64748B'} strokeWidth={2.2} />
            <Text style={[styles.modeBtnText, authMode === 'password' && styles.modeBtnTextActive]}>
              Password
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Form Card */}
        <View style={styles.formCard}>
          {/* Mobile Number Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mobile Phone Number</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.countryCodeBox}>
                <Text style={styles.flagEmoji}>🇮🇳</Text>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Enter 10-digit mobile number"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={(val) => {
                  setPhone(val);
                  setIsOtpSent(false);
                }}
              />
            </View>
          </View>

          {/* OTP Mode Form Elements */}
          {authMode === 'otp' && (
            <>
              {isOtpSent ? (
                <View style={styles.inputGroup}>
                  <View style={styles.otpHeaderRow}>
                    <Text style={styles.inputLabel}>6-Digit Verification Code</Text>
                    <TouchableOpacity onPress={handleSendOtp}>
                      <Text style={styles.resendText}>Resend OTP</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.otpInputWrapper}>
                    <ShieldCheck size={18} color={colors.primary} strokeWidth={2.2} />
                    <TextInput
                      style={styles.otpInput}
                      placeholder="• • • • • •"
                      placeholderTextColor="#94A3B8"
                      keyboardType="number-pad"
                      maxLength={6}
                      value={otp}
                      onChangeText={setOtp}
                    />
                  </View>
                  <Text style={styles.otpHint}>
                    Test verification code: <Text style={{ fontWeight: 'bold' }}>123456</Text>
                  </Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={[styles.primaryActionBtn, loading && styles.btnDisabled]}
                onPress={isOtpSent ? handleVerifyOtp : handleSendOtp}
                disabled={loading}
                activeOpacity={0.88}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <>
                    <Text style={styles.primaryActionText}>
                      {isOtpSent ? 'Verify & Sign In' : 'Get Verification Code'}
                    </Text>
                    <ArrowRight size={18} color={colors.white} strokeWidth={2.5} />
                  </>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* Password Mode Form Elements */}
          {authMode === 'password' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordInputWrapper}>
                  <Lock size={18} color="#64748B" strokeWidth={2} />
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter your password"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.primaryActionBtn, loading && styles.btnDisabled]}
                onPress={handlePasswordLogin}
                disabled={loading}
                activeOpacity={0.88}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <>
                    <Text style={styles.primaryActionText}>Sign In</Text>
                    <ArrowRight size={18} color={colors.white} strokeWidth={2.5} />
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* ── Demo 1-Tap Quick Logins ── */}
        <View style={styles.demoSection}>
          <View style={styles.demoSectionHeader}>
            <Sparkles size={14} color={colors.primary} strokeWidth={2.2} />
            <Text style={styles.demoSectionTitle}>One-Tap Quick Demo Credentials</Text>
          </View>

          <View style={styles.demoButtonsRow}>
            <TouchableOpacity
              style={styles.demoBtn}
              onPress={() => handleDemoAutofill('customer', '9876543210')}
              activeOpacity={0.8}
            >
              <Text style={styles.demoBtnEmoji}>🛒</Text>
              <Text style={styles.demoBtnText}>Customer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoBtn}
              onPress={() => handleDemoAutofill('retailer', '9848012345')}
              activeOpacity={0.8}
            >
              <Text style={styles.demoBtnEmoji}>🏪</Text>
              <Text style={styles.demoBtnText}>Retailer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoBtn}
              onPress={() => handleDemoAutofill('delivery', '9876543220')}
              activeOpacity={0.8}
            >
              <Text style={styles.demoBtnEmoji}>🚚</Text>
              <Text style={styles.demoBtnText}>Driver</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Skip to Marketplace */}
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => {
            useAppStore.setState({ isAuthenticated: true });
            if (navigation?.navigate) {
              navigation.navigate('HomeScreen');
            }
          }}
        >
          <Text style={styles.skipText}>
            Continue as Guest / Browse Products →
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const TOP_INSET = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 12 : 50;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    paddingTop: TOP_INSET,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
    ...shadows.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    marginBottom: spacing.md,
  },
  brandIconBox: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  brandEmoji: {
    fontSize: 22,
  },
  brandTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: typography.weights.medium,
  },
  heroGreeting: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
    letterSpacing: -0.5,
  },
  heroSub: {
    fontSize: typography.fontSizes.xs + 1,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
    marginTop: 4,
    marginBottom: spacing.md,
  },
  roleTabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: radii.full,
    padding: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: radii.full,
    gap: 5,
  },
  roleTabActive: {
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  roleTabText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  roleTabTextActive: {
    color: colors.white,
    fontWeight: typography.weights.extrabold,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  authModeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
    ...shadows.sm,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: radii.md,
    gap: 6,
  },
  modeBtnActive: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
  },
  modeBtnText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.semibold,
    color: '#64748B',
  },
  modeBtnTextActive: {
    color: colors.primary,
    fontWeight: typography.weights.extrabold,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: spacing.md,
    ...shadows.sm,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.extrabold,
    color: '#334155',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    overflow: 'hidden',
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    backgroundColor: '#F1F5F9',
    borderRightWidth: 1,
    borderRightColor: '#CBD5E1',
    gap: 4,
  },
  flagEmoji: {
    fontSize: 16,
  },
  countryCodeText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.bold,
    color: '#1E293B',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: typography.fontSizes.sm,
    color: '#0F172A',
    fontWeight: typography.weights.bold,
  },
  otpHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  otpInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  otpInput: {
    flex: 1,
    paddingVertical: spacing.sm + 4,
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.weights.extrabold,
    color: '#0F172A',
    letterSpacing: 4,
  },
  otpHint: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: spacing.sm + 4,
    fontSize: typography.fontSizes.sm,
    color: '#0F172A',
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md - 2,
    borderRadius: radii.lg,
    gap: spacing.sm,
    marginTop: spacing.xs,
    ...shadows.md,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  primaryActionText: {
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.weights.extrabold,
  },
  demoSection: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: spacing.sm,
    ...shadows.sm,
  },
  demoSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  demoSectionTitle: {
    fontSize: 11,
    fontWeight: typography.weights.extrabold,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  demoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  demoBtnEmoji: {
    fontSize: 14,
  },
  demoBtnText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.weights.bold,
    color: '#1E293B',
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  skipText: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
});
