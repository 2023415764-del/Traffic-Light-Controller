
import React, { useState } from "react";
import { Stack } from "expo-router";
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity,
  Alert,
  Platform,
  Animated
} from "react-native";
import { IconSymbol } from "../../../components/IconSymbol";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@react-navigation/native";
import { colors } from "../../../styles/commonStyles";

export default function HomeScreen() {
  const theme = useTheme();
  const [inputs, setInputs] = useState({
    carDensity: '',
    pedestrianCount: '',
    timeOfDay: '',
    weatherCondition: ''
  });
  
  const [trafficLight, setTrafficLight] = useState({
    currentLight: 'red',
    duration: 0,
    recommendation: 'Enter traffic data to get recommendations'
  });

  const [isCalculating, setIsCalculating] = useState(false);

  // Fuzzy Logic Implementation
  const fuzzyLogicCalculation = (inputs) => {
    console.log('Starting fuzzy logic calculation with inputs:', inputs);
    
    const carDensity = parseFloat(inputs.carDensity) || 0;
    const pedestrianCount = parseFloat(inputs.pedestrianCount) || 0;
    const timeOfDay = parseFloat(inputs.timeOfDay) || 12; // 24-hour format
    const weatherCondition = parseFloat(inputs.weatherCondition) || 1; // 1-5 scale (1=clear, 5=severe)

    // Fuzzy membership functions
    const lowCarDensity = Math.max(0, Math.min(1, (20 - carDensity) / 20));
    const mediumCarDensity = Math.max(0, Math.min(1, carDensity <= 20 ? carDensity / 20 : (40 - carDensity) / 20));
    const highCarDensity = Math.max(0, Math.min(1, (carDensity - 20) / 30));

    const lowPedestrians = Math.max(0, Math.min(1, (10 - pedestrianCount) / 10));
    const mediumPedestrians = Math.max(0, Math.min(1, pedestrianCount <= 10 ? pedestrianCount / 10 : (20 - pedestrianCount) / 10));
    const highPedestrians = Math.max(0, Math.min(1, (pedestrianCount - 10) / 15));

    // Time-based fuzzy sets (rush hour vs normal)
    const rushHour = Math.max(
      Math.max(0, Math.min(1, timeOfDay >= 7 && timeOfDay <= 9 ? 1 : 0)),
      Math.max(0, Math.min(1, timeOfDay >= 17 && timeOfDay <= 19 ? 1 : 0))
    );
    const normalTime = 1 - rushHour;

    // Weather impact (worse weather = longer green times)
    const goodWeather = Math.max(0, Math.min(1, (3 - weatherCondition) / 2));
    const badWeather = Math.max(0, Math.min(1, (weatherCondition - 2) / 3));

    console.log('Fuzzy membership values:', {
      lowCarDensity, mediumCarDensity, highCarDensity,
      lowPedestrians, mediumPedestrians, highPedestrians,
      rushHour, normalTime, goodWeather, badWeather
    });

    // Fuzzy rules for green light duration
    const rules = [
      // Rule 1: Low traffic, low pedestrians -> Short green (15-25s)
      Math.min(lowCarDensity, lowPedestrians) * 20,
      
      // Rule 2: High traffic, low pedestrians -> Long green (45-60s)
      Math.min(highCarDensity, lowPedestrians) * 55,
      
      // Rule 3: Low traffic, high pedestrians -> Medium green (30-40s)
      Math.min(lowCarDensity, highPedestrians) * 35,
      
      // Rule 4: High traffic, high pedestrians -> Very long green (60-80s)
      Math.min(highCarDensity, highPedestrians) * 70,
      
      // Rule 5: Rush hour adjustment
      rushHour * 15,
      
      // Rule 6: Bad weather adjustment
      badWeather * 10
    ];

    // Defuzzification using weighted average
    const totalWeight = rules.reduce((sum, rule) => sum + Math.abs(rule), 0);
    const greenDuration = totalWeight > 0 ? 
      rules.reduce((sum, rule) => sum + rule, 0) / rules.length + 25 : 30;

    const finalDuration = Math.max(15, Math.min(90, Math.round(greenDuration)));

    console.log('Calculated green duration:', finalDuration);

    // Determine current light state and recommendation
    let currentLight = 'green';
    let recommendation = '';

    if (carDensity > 30 || (rushHour > 0.5 && carDensity > 15)) {
      currentLight = 'green';
      recommendation = `Heavy traffic detected. Extended green light recommended for ${finalDuration} seconds.`;
    } else if (pedestrianCount > 15) {
      currentLight = 'green';
      recommendation = `High pedestrian activity. Balanced green light timing of ${finalDuration} seconds.`;
    } else if (carDensity < 5 && pedestrianCount < 3) {
      currentLight = 'red';
      recommendation = `Low traffic detected. Short green cycle of ${finalDuration} seconds is sufficient.`;
    } else {
      currentLight = 'yellow';
      recommendation = `Moderate traffic conditions. Standard green light duration of ${finalDuration} seconds.`;
    }

    if (weatherCondition > 3) {
      recommendation += ' Weather conditions require extended timing for safety.';
    }

    return {
      currentLight,
      duration: finalDuration,
      recommendation
    };
  };

  const handleCalculate = () => {
    console.log('Calculate button pressed');
    
    if (!inputs.carDensity || !inputs.pedestrianCount || !inputs.timeOfDay || !inputs.weatherCondition) {
      Alert.alert('Missing Data', 'Please fill in all traffic parameters.');
      return;
    }

    setIsCalculating(true);
    
    // Simulate processing time for better UX
    setTimeout(() => {
      const result = fuzzyLogicCalculation(inputs);
      setTrafficLight(result);
      setIsCalculating(false);
      console.log('Calculation completed:', result);
    }, 1000);
  };

  const resetInputs = () => {
    console.log('Reset button pressed');
    setInputs({
      carDensity: '',
      pedestrianCount: '',
      timeOfDay: '',
      weatherCondition: ''
    });
    setTrafficLight({
      currentLight: 'red',
      duration: 0,
      recommendation: 'Enter traffic data to get recommendations'
    });
  };

  const getTrafficLightColor = (light) => {
    switch (light) {
      case 'red': return '#FF3B30';
      case 'yellow': return '#FFCC00';
      case 'green': return '#34C759';
      default: return '#E5E5EA';
    }
  };

  const renderHeaderRight = () => (
    <TouchableOpacity
      onPress={resetInputs}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="arrow.clockwise" color={colors.primary} />
    </TouchableOpacity>
  );

  const renderHeaderLeft = () => (
    <TouchableOpacity
      onPress={() => Alert.alert("Fuzzy Traffic Controller", "This app uses fuzzy logic to optimize traffic light timing based on real-time conditions.")}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="info.circle" color={colors.primary} />
    </TouchableOpacity>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Fuzzy Traffic Controller",
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
          }}
        />
      )}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            Platform.OS !== 'ios' && styles.scrollContainerWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Traffic Light Visualization */}
          <GlassView style={styles.trafficLightContainer} glassEffectStyle="regular">
            <Text style={styles.sectionTitle}>Traffic Light Status</Text>
            <View style={styles.trafficLightBox}>
              <View style={[
                styles.lightCircle,
                { backgroundColor: trafficLight.currentLight === 'red' ? getTrafficLightColor('red') : '#E5E5EA' }
              ]} />
              <View style={[
                styles.lightCircle,
                { backgroundColor: trafficLight.currentLight === 'yellow' ? getTrafficLightColor('yellow') : '#E5E5EA' }
              ]} />
              <View style={[
                styles.lightCircle,
                { backgroundColor: trafficLight.currentLight === 'green' ? getTrafficLightColor('green') : '#E5E5EA' }
              ]} />
            </View>
            <Text style={styles.durationText}>
              {trafficLight.duration > 0 ? `${trafficLight.duration} seconds` : 'Awaiting calculation'}
            </Text>
          </GlassView>

          {/* Input Parameters */}
          <GlassView style={styles.inputContainer} glassEffectStyle="regular">
            <Text style={styles.sectionTitle}>Traffic Parameters</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Car Density (vehicles/minute)</Text>
              <TextInput
                style={styles.textInput}
                value={inputs.carDensity}
                onChangeText={(text) => setInputs(prev => ({ ...prev, carDensity: text }))}
                placeholder="0-50"
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pedestrian Count (per minute)</Text>
              <TextInput
                style={styles.textInput}
                value={inputs.pedestrianCount}
                onChangeText={(text) => setInputs(prev => ({ ...prev, pedestrianCount: text }))}
                placeholder="0-25"
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Time of Day (24-hour format)</Text>
              <TextInput
                style={styles.textInput}
                value={inputs.timeOfDay}
                onChangeText={(text) => setInputs(prev => ({ ...prev, timeOfDay: text }))}
                placeholder="0-23"
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Weather Condition (1=Clear, 5=Severe)</Text>
              <TextInput
                style={styles.textInput}
                value={inputs.weatherCondition}
                onChangeText={(text) => setInputs(prev => ({ ...prev, weatherCondition: text }))}
                placeholder="1-5"
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </GlassView>

          {/* Calculate Button */}
          <TouchableOpacity
            style={[styles.calculateButton, isCalculating && styles.calculateButtonDisabled]}
            onPress={handleCalculate}
            disabled={isCalculating}
          >
            <Text style={styles.calculateButtonText}>
              {isCalculating ? 'Calculating...' : 'Calculate Optimal Timing'}
            </Text>
          </TouchableOpacity>

          {/* Recommendation Display */}
          <GlassView style={styles.recommendationContainer} glassEffectStyle="regular">
            <Text style={styles.sectionTitle}>AI Recommendation</Text>
            <Text style={styles.recommendationText}>
              {trafficLight.recommendation}
            </Text>
          </GlassView>

          {/* Fuzzy Logic Info */}
          <GlassView style={styles.infoContainer} glassEffectStyle="regular">
            <Text style={styles.sectionTitle}>How It Works</Text>
            <Text style={styles.infoText}>
              This fuzzy logic controller analyzes multiple traffic parameters:
            </Text>
            <Text style={styles.bulletPoint}>• Vehicle density and flow rate</Text>
            <Text style={styles.bulletPoint}>• Pedestrian crossing frequency</Text>
            <Text style={styles.bulletPoint}>• Time-based traffic patterns</Text>
            <Text style={styles.bulletPoint}>• Weather impact on traffic flow</Text>
            <Text style={styles.infoText}>
              The system uses fuzzy membership functions and rule-based inference to optimize traffic light timing for maximum efficiency and safety.
            </Text>
          </GlassView>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  scrollContainerWithTabBar: {
    paddingBottom: 100,
  },
  trafficLightContainer: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    backgroundColor: Platform.OS !== 'ios' ? colors.card : 'transparent',
  },
  trafficLightBox: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginVertical: 16,
  },
  lightCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#1C1C1E',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  durationText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  inputContainer: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    backgroundColor: Platform.OS !== 'ios' ? colors.card : 'transparent',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: colors.highlight,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.card,
  },
  calculateButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    boxShadow: '0px 4px 8px rgba(52, 172, 224, 0.3)',
    elevation: 4,
  },
  calculateButtonDisabled: {
    backgroundColor: colors.textSecondary,
    boxShadow: 'none',
    elevation: 0,
  },
  calculateButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  recommendationContainer: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    backgroundColor: Platform.OS !== 'ios' ? colors.card : 'transparent',
  },
  recommendationText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    textAlign: 'center',
  },
  infoContainer: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    backgroundColor: Platform.OS !== 'ios' ? colors.card : 'transparent',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginLeft: 8,
    marginBottom: 4,
  },
  headerButtonContainer: {
    padding: 6,
  },
});
