import React from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';

type Props = {
  uri?: string;
  aspect?: number;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function SatelliteImageViewer({ uri, aspect = 16 / 9 }: Props) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  if (!uri) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <PinchGestureHandler onGestureEvent={(e: any) => { scale.value = e.nativeEvent.scale; }}>
        <Animated.View style={styles.pinchWrapper}>
          <PanGestureHandler onGestureEvent={(e: any) => { translateX.value = e.nativeEvent.translationX; translateY.value = e.nativeEvent.translationY; }}>
            <Animated.View style={[styles.imageWrapper, animatedStyle]}>
              <Image source={{ uri }} style={[styles.image, { aspectRatio: aspect }]} resizeMode="cover" />
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pinchWrapper: {
    width: SCREEN_WIDTH - 32,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: undefined,
    backgroundColor: '#000',
  },
});

export default SatelliteImageViewer;
