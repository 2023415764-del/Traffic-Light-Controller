
import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@react-navigation/native";

export default function JavaScreen() {
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
          <Text style={[styles.title, { color: theme.colors.text }]}>Java Implementation</Text>
          <Text style={[styles.description, { color: theme.dark ? '#98989D' : '#666' }]}>
            Fuzzy Logic Traffic Controller in Java
          </Text>
          
          <View style={styles.codeBlock}>
            <Text style={[styles.code, { color: theme.dark ? '#E5E5EA' : '#333' }]}>
{`public class FuzzyTrafficController {
    
    public static class TrafficResult {
        public String currentLight;
        public int duration;
        public String recommendation;
        
        public TrafficResult(String light, int dur, String rec) {
            this.currentLight = light;
            this.duration = dur;
            this.recommendation = rec;
        }
    }
    
    public static TrafficResult calculateOptimalTiming(
        double carDensity, 
        double pedestrianCount, 
        double timeOfDay, 
        double weatherCondition
    ) {
        // Fuzzy membership functions
        double lowCarDensity = Math.max(0, Math.min(1, (20 - carDensity) / 20));
        double highCarDensity = Math.max(0, Math.min(1, (carDensity - 20) / 30));
        
        double lowPedestrians = Math.max(0, Math.min(1, (10 - pedestrianCount) / 10));
        double highPedestrians = Math.max(0, Math.min(1, (pedestrianCount - 10) / 15));
        
        // Rush hour detection
        double rushHour = (timeOfDay >= 7 && timeOfDay <= 9) || 
                         (timeOfDay >= 17 && timeOfDay <= 19) ? 1.0 : 0.0;
        
        // Weather impact
        double badWeather = Math.max(0, Math.min(1, (weatherCondition - 2) / 3));
        
        // Fuzzy rules
        double[] rules = {
            Math.min(lowCarDensity, lowPedestrians) * 20,
            Math.min(highCarDensity, lowPedestrians) * 55,
            Math.min(lowCarDensity, highPedestrians) * 35,
            Math.min(highCarDensity, highPedestrians) * 70,
            rushHour * 15,
            badWeather * 10
        };
        
        // Defuzzification
        double totalWeight = 0;
        double weightedSum = 0;
        for (double rule : rules) {
            totalWeight += Math.abs(rule);
            weightedSum += rule;
        }
        
        double greenDuration = totalWeight > 0 ? 
            weightedSum / rules.length + 25 : 30;
        
        int finalDuration = Math.max(15, Math.min(90, (int) Math.round(greenDuration)));
        
        // Determine light state and recommendation
        String currentLight;
        String recommendation;
        
        if (carDensity > 30 || (rushHour > 0.5 && carDensity > 15)) {
            currentLight = "green";
            recommendation = "Heavy traffic detected. Extended green light recommended for " 
                           + finalDuration + " seconds.";
        } else if (pedestrianCount > 15) {
            currentLight = "green";
            recommendation = "High pedestrian activity. Balanced green light timing of " 
                           + finalDuration + " seconds.";
        } else if (carDensity < 5 && pedestrianCount < 3) {
            currentLight = "red";
            recommendation = "Low traffic detected. Short green cycle of " 
                           + finalDuration + " seconds is sufficient.";
        } else {
            currentLight = "yellow";
            recommendation = "Moderate traffic conditions. Standard green light duration of " 
                           + finalDuration + " seconds.";
        }
        
        if (weatherCondition > 3) {
            recommendation += " Weather conditions require extended timing for safety.";
        }
        
        return new TrafficResult(currentLight, finalDuration, recommendation);
    }
    
    public static void main(String[] args) {
        // Example usage
        TrafficResult result = calculateOptimalTiming(25, 8, 8, 2);
        System.out.println("Light: " + result.currentLight);
        System.out.println("Duration: " + result.duration + " seconds");
        System.out.println("Recommendation: " + result.recommendation);
    }
}`}
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
