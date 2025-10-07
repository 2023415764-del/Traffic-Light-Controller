
import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@react-navigation/native";

export default function PythonScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
      >
        <GlassView style={[
          styles.codeContainer,
          Platform.OS !== 'ios' && { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
        ]} glassEffectStyle="regular">
          <Text style={[styles.title, { color: theme.colors.text }]}>Python Implementation</Text>
          <Text style={[styles.description, { color: theme.dark ? '#98989D' : '#666' }]}>
            Fuzzy Logic Traffic Controller in Python
          </Text>
          
          <View style={styles.codeBlock}>
            <Text style={[styles.code, { color: theme.dark ? '#E5E5EA' : '#333' }]}>
{`import numpy as np
from dataclasses import dataclass

@dataclass
class TrafficResult:
    current_light: str
    duration: int
    recommendation: str

class FuzzyTrafficController:
    
    @staticmethod
    def calculate_optimal_timing(car_density, pedestrian_count, time_of_day, weather_condition):
        """
        Calculate optimal traffic light timing using fuzzy logic
        
        Args:
            car_density: Number of vehicles per minute (0-50)
            pedestrian_count: Number of pedestrians per minute (0-25)
            time_of_day: Hour in 24-hour format (0-23)
            weather_condition: Weather severity (1=clear, 5=severe)
        
        Returns:
            TrafficResult: Contains light state, duration, and recommendation
        """
        
        # Fuzzy membership functions
        low_car_density = max(0, min(1, (20 - car_density) / 20))
        medium_car_density = max(0, min(1, 
            car_density / 20 if car_density <= 20 else (40 - car_density) / 20))
        high_car_density = max(0, min(1, (car_density - 20) / 30))
        
        low_pedestrians = max(0, min(1, (10 - pedestrian_count) / 10))
        medium_pedestrians = max(0, min(1,
            pedestrian_count / 10 if pedestrian_count <= 10 else (20 - pedestrian_count) / 10))
        high_pedestrians = max(0, min(1, (pedestrian_count - 10) / 15))
        
        # Time-based fuzzy sets (rush hour detection)
        rush_hour = max(
            1.0 if 7 <= time_of_day <= 9 else 0.0,
            1.0 if 17 <= time_of_day <= 19 else 0.0
        )
        normal_time = 1 - rush_hour
        
        # Weather impact
        good_weather = max(0, min(1, (3 - weather_condition) / 2))
        bad_weather = max(0, min(1, (weather_condition - 2) / 3))
        
        # Fuzzy rules for green light duration
        rules = [
            # Rule 1: Low traffic, low pedestrians -> Short green (15-25s)
            min(low_car_density, low_pedestrians) * 20,
            
            # Rule 2: High traffic, low pedestrians -> Long green (45-60s)
            min(high_car_density, low_pedestrians) * 55,
            
            # Rule 3: Low traffic, high pedestrians -> Medium green (30-40s)
            min(low_car_density, high_pedestrians) * 35,
            
            # Rule 4: High traffic, high pedestrians -> Very long green (60-80s)
            min(high_car_density, high_pedestrians) * 70,
            
            # Rule 5: Rush hour adjustment
            rush_hour * 15,
            
            # Rule 6: Bad weather adjustment
            bad_weather * 10
        ]
        
        # Defuzzification using weighted average
        total_weight = sum(abs(rule) for rule in rules)
        green_duration = sum(rules) / len(rules) + 25 if total_weight > 0 else 30
        
        final_duration = max(15, min(90, round(green_duration)))
        
        # Determine current light state and recommendation
        if car_density > 30 or (rush_hour > 0.5 and car_density > 15):
            current_light = "green"
            recommendation = f"Heavy traffic detected. Extended green light recommended for {final_duration} seconds."
        elif pedestrian_count > 15:
            current_light = "green"
            recommendation = f"High pedestrian activity. Balanced green light timing of {final_duration} seconds."
        elif car_density < 5 and pedestrian_count < 3:
            current_light = "red"
            recommendation = f"Low traffic detected. Short green cycle of {final_duration} seconds is sufficient."
        else:
            current_light = "yellow"
            recommendation = f"Moderate traffic conditions. Standard green light duration of {final_duration} seconds."
        
        if weather_condition > 3:
            recommendation += " Weather conditions require extended timing for safety."
        
        return TrafficResult(current_light, final_duration, recommendation)

# Example usage
if __name__ == "__main__":
    controller = FuzzyTrafficController()
    result = controller.calculate_optimal_timing(25, 8, 8, 2)
    
    print(f"Light: {result.current_light}")
    print(f"Duration: {result.duration} seconds")
    print(f"Recommendation: {result.recommendation}")
`}
            </Text>
          </View>
        </GlassView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  codeContainer: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  codeBlock: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    padding: 16,
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
});
