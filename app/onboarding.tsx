import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  image: any;
  bgColor?: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Fresh & Quality Products',
    subtitle: 'Carefully selected fresh products for\nyou.',
    image: require('../assets/images/fresh_products.png'),
    bgColor: '#F5FAF6',
  },
  {
    id: '2',
    title: 'Fast Delivery To Your\nDoorstep',
    subtitle: 'Quick and reliable delivery at your\nconvenience.',
    image: require('../assets/images/fast_delivery.png'),
    bgColor: '#FFFFFF',
  },
  {
    id: '3',
    title: 'Easy & Secure Payments',
    subtitle: 'Multiple secure payment options\navailable.',
    image: require('../assets/images/secure_payments.png'),
    bgColor: '#FFFFFF',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    if (index !== currentIndex && index >= 0 && index < SLIDES.length) {
      setCurrentIndex(index);
    }
  };

  const handleSkip = () => {
    router.push('/auth/login');
  };

  const handleGetStarted = () => {
    router.push('/auth/login');
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.bgColor || '#FFFFFF' }]}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.illustrationImage} resizeMode="contain" />
        </View>
      </View>
    );
  };

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Swipeable Horizontal FlatList */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
      />

      {/* Footer Navigation Bar */}
      <View style={styles.footerContainer}>
        {isLastSlide ? (
          <View style={styles.lastSlideFooter}>
            {/* Dots indicator */}
            <View style={styles.dotsRowCenter}>
              {SLIDES.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentIndex ? styles.activeDotPill : styles.inactiveDotCircle,
                  ]}
                />
              ))}
            </View>

            {/* Get Started Button */}
            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.getStartedBtn}
              onPress={handleGetStarted}
            >
              <Text style={styles.getStartedBtnText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.normalFooterRow}>
            {/* Dots Indicator */}
            <View style={styles.dotsRowLeft}>
              {SLIDES.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentIndex ? styles.activeDotPill : styles.inactiveDotCircle,
                  ]}
                />
              ))}
            </View>

            {/* Skip Button */}
            <TouchableOpacity activeOpacity={0.7} style={styles.skipBtn} onPress={handleSkip}>
              <Text style={styles.skipBtnText}>Skip</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width: width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#161925',
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 12,
  },
  illustrationImage: {
    width: '80%',
    height: '80%',
    maxHeight: 250,
    aspectRatio: 1,
  },
  footerContainer: {
    paddingHorizontal: 28,
    paddingBottom: 36,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
  normalFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
  },
  dotsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dotsRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 28,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDotPill: {
    width: 28,
    backgroundColor: '#071A52',
  },
  inactiveDotCircle: {
    width: 8,
    backgroundColor: '#E5E7EB',
  },
  skipBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#071A52',
  },
  lastSlideFooter: {
    alignItems: 'center',
    width: '100%',
  },
  getStartedBtn: {
    width: '100%',
    backgroundColor: '#0036AA',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0036AA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  getStartedBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
