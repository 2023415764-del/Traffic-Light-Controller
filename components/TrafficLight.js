
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../styles/commonStyles';

export default function TrafficLight({ 
  currentLight = 'red', 
  duration = 0, 
  autoBlink = false, 
  mode = 'sequence' 
}) {
  const [blinkState, setBlinkState] = useState(true);
  const [animatedValue] = useState(new Animated.Value(1));

  useEffect(() => {
    if (autoBlink) {
      const blinkInterval = setInterval(() => {
        setBlinkState(prev => !prev);
      }, 500);

      return () => clearInterval(blinkInterval);
    } else {
      setBlinkState(true);
    }
  }, [autoBlink]);

  useEffect(() => {
    if (autoBlink) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      animatedValue.setValue(1);
    }
  }, [autoBlink, animatedValue]);

  const getLightColor = (lightType, isActive) => {
    if (mode === 'all') {
      // In 'all' mode, all lights are on
      switch (lightType) {
        case 'red': return '#FF3B30';
        case 'yellow': return '#FFCC00';
        case 'green': return '#34C759';
        default: return '#E5E5EA';
      }
    }

    if (!isActive) {
      return '#E5E5EA'; // Inactive gray color
    }

    if (autoBlink && !blinkState) {
      return '#E5E5EA'; // Blink to gray
    }

    switch (lightType) {
      case 'red': return '#FF3B30';
      case 'yellow': return '#FFCC00';
      case 'green': return '#34C759';
      default: return '#E5E5EA';
    }
  };

  const isLightActive = (lightType) => {
    if (mode === 'all') return true;
    return currentLight === lightType;
  };

  return (
    <View style={styles.container}>
      <View style={styles.trafficLightBox}>
        <Animated.View 
          style={[
            styles.lightCircle,
            { 
              backgroundColor: getLightColor('red', isLightActive('red')),
              opacity: autoBlink ? animatedValue : 1
            }
          ]}
        />
        <Animated.View 
          style={[
            styles.lightCircle,
            { 
              backgroundColor: getLightColor('yellow', isLightActive('yellow')),
              opacity: autoBlink ? animatedValue : 1
            }
          ]}
        />
        <Animated.View 
          style={[
            styles.lightCircle,
            { 
              backgroundColor: getLightColor('green', isLightActive('green')),
              opacity: autoBlink ? animatedValue : 1
            }
          ]}
        />
      </View>
      
      {duration > 0 && (
        <View style={styles.durationContainer}>
          <Text style={styles.durationLabel}>Duration</Text>
          <Text style={styles.durationValue}>{duration}s</Text>
        </View>
      )}
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Current State</Text>
        <Text style={[styles.statusValue, { color: getLightColor(currentLight, true) }]}>
          {mode === 'all' ? 'All Lights On' : currentLight.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  trafficLightBox: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  lightCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginVertical: 8,
    borderWidth: 3,
    borderColor: '#1C1C1E',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  durationContainer: {
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  durationLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  durationValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  statusContainer: {
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  statusLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
