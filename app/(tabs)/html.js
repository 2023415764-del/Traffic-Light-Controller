
import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@react-navigation/native";

export default function HtmlScreen() {
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
          <Text style={[styles.title, { color: theme.colors.text }]}>HTML/JavaScript Implementation</Text>
          <Text style={[styles.description, { color: theme.dark ? '#98989D' : '#666' }]}>
            Fuzzy Logic Traffic Controller in HTML/JavaScript
          </Text>
          
          <View style={styles.codeBlock}>
            <Text style={[styles.code, { color: theme.dark ? '#E5E5EA' : '#333' }]}>
{`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fuzzy Traffic Controller</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f0f4f7;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
        }
        .traffic-light {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: #2c2c2e;
            border-radius: 20px;
            padding: 16px;
            margin: 20px 0;
        }
        .light {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            margin: 8px;
            border: 2px solid #1c1c1e;
            background-color: #e5e5ea;
        }
        .light.active.red { background-color: #ff3b30; }
        .light.active.yellow { background-color: #ffcc00; }
        .light.active.green { background-color: #34c759; }
        
        input, button {
            padding: 12px;
            margin: 8px;
            border: 2px solid #c7ecee;
            border-radius: 8px;
            font-size: 16px;
        }
        button {
            background-color: #34ace0;
            color: white;
            border: none;
            cursor: pointer;
            font-weight: bold;
        }
        button:hover {
            background-color: #2980b9;
        }
        .result {
            background-color: #f8f9fa;
            padding: 16px;
            border-radius: 8px;
            margin-top: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Fuzzy Traffic Light Controller</h1>
        
        <div class="traffic-light">
            <div class="light" id="redLight"></div>
            <div class="light" id="yellowLight"></div>
            <div class="light" id="greenLight"></div>
            <div id="duration">Awaiting calculation</div>
        </div>
        
        <div>
            <h3>Traffic Parameters</h3>
            <label>Car Density (vehicles/minute):</label>
            <input type="number" id="carDensity" placeholder="0-50" min="0" max="50">
            
            <label>Pedestrian Count (per minute):</label>
            <input type="number" id="pedestrianCount" placeholder="0-25" min="0" max="25">
            
            <label>Time of Day (24-hour format):</label>
            <input type="number" id="timeOfDay" placeholder="0-23" min="0" max="23">
            
            <label>Weather Condition (1=Clear, 5=Severe):</label>
            <input type="number" id="weatherCondition" placeholder="1-5" min="1" max="5">
            
            <button onclick="calculateOptimalTiming()">Calculate Optimal Timing</button>
            <button onclick="resetInputs()">Reset</button>
        </div>
        
        <div class="result" id="result">
            Enter traffic data to get recommendations
        </div>
    </div>

    <script>
        class FuzzyTrafficController {
            static calculateOptimalTiming(carDensity, pedestrianCount, timeOfDay, weatherCondition) {
                // Fuzzy membership functions
                const lowCarDensity = Math.max(0, Math.min(1, (20 - carDensity) / 20));
                const highCarDensity = Math.max(0, Math.min(1, (carDensity - 20) / 30));
                
                const lowPedestrians = Math.max(0, Math.min(1, (10 - pedestrianCount) / 10));
                const highPedestrians = Math.max(0, Math.min(1, (pedestrianCount - 10) / 15));
                
                // Rush hour detection
                const rushHour = Math.max(
                    (timeOfDay >= 7 && timeOfDay <= 9) ? 1 : 0,
                    (timeOfDay >= 17 && timeOfDay <= 19) ? 1 : 0
                );
                
                // Weather impact
                const badWeather = Math.max(0, Math.min(1, (weatherCondition - 2) / 3));
                
                // Fuzzy rules
                const rules = [
                    Math.min(lowCarDensity, lowPedestrians) * 20,
                    Math.min(highCarDensity, lowPedestrians) * 55,
                    Math.min(lowCarDensity, highPedestrians) * 35,
                    Math.min(highCarDensity, highPedestrians) * 70,
                    rushHour * 15,
                    badWeather * 10
                ];
                
                // Defuzzification
                const totalWeight = rules.reduce((sum, rule) => sum + Math.abs(rule), 0);
                const greenDuration = totalWeight > 0 ? 
                    rules.reduce((sum, rule) => sum + rule, 0) / rules.length + 25 : 30;
                
                const finalDuration = Math.max(15, Math.min(90, Math.round(greenDuration)));
                
                // Determine light state and recommendation
                let currentLight, recommendation;
                
                if (carDensity > 30 || (rushHour > 0.5 && carDensity > 15)) {
                    currentLight = 'green';
                    recommendation = \`Heavy traffic detected. Extended green light recommended for \${finalDuration} seconds.\`;
                } else if (pedestrianCount > 15) {
                    currentLight = 'green';
                    recommendation = \`High pedestrian activity. Balanced green light timing of \${finalDuration} seconds.\`;
                } else if (carDensity < 5 && pedestrianCount < 3) {
                    currentLight = 'red';
                    recommendation = \`Low traffic detected. Short green cycle of \${finalDuration} seconds is sufficient.\`;
                } else {
                    currentLight = 'yellow';
                    recommendation = \`Moderate traffic conditions. Standard green light duration of \${finalDuration} seconds.\`;
                }
                
                if (weatherCondition > 3) {
                    recommendation += ' Weather conditions require extended timing for safety.';
                }
                
                return { currentLight, duration: finalDuration, recommendation };
            }
        }
        
        function calculateOptimalTiming() {
            const carDensity = parseFloat(document.getElementById('carDensity').value) || 0;
            const pedestrianCount = parseFloat(document.getElementById('pedestrianCount').value) || 0;
            const timeOfDay = parseFloat(document.getElementById('timeOfDay').value) || 12;
            const weatherCondition = parseFloat(document.getElementById('weatherCondition').value) || 1;
            
            if (!carDensity && !pedestrianCount && !timeOfDay && !weatherCondition) {
                alert('Please fill in all traffic parameters.');
                return;
            }
            
            const result = FuzzyTrafficController.calculateOptimalTiming(
                carDensity, pedestrianCount, timeOfDay, weatherCondition
            );
            
            // Update traffic light display
            document.querySelectorAll('.light').forEach(light => {
                light.classList.remove('active', 'red', 'yellow', 'green');
            });
            
            const activeLight = document.getElementById(result.currentLight + 'Light');
            activeLight.classList.add('active', result.currentLight);
            
            document.getElementById('duration').textContent = \`\${result.duration} seconds\`;
            document.getElementById('result').textContent = result.recommendation;
        }
        
        function resetInputs() {
            document.getElementById('carDensity').value = '';
            document.getElementById('pedestrianCount').value = '';
            document.getElementById('timeOfDay').value = '';
            document.getElementById('weatherCondition').value = '';
            
            document.querySelectorAll('.light').forEach(light => {
                light.classList.remove('active', 'red', 'yellow', 'green');
            });
            
            document.getElementById('duration').textContent = 'Awaiting calculation';
            document.getElementById('result').textContent = 'Enter traffic data to get recommendations';
        }
    </script>
</body>
</html>`}
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
    fontSize: 10,
    lineHeight: 16,
  },
});
