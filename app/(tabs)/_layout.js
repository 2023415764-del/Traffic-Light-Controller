
import React from 'react';
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import FloatingTabBar from '../../components/FloatingTabBar';

export default function TabLayout() {
  // Define the tabs configuration
  const tabs = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'house.fill',
      label: 'Controller',
    },
    {
      name: 'java',
      route: '/(tabs)/java',
      icon: 'doc.text.fill',
      label: 'Java',
    },
    {
      name: 'python',
      route: '/(tabs)/python',
      icon: 'doc.text.fill',
      label: 'Python',
    },
    {
      name: 'html',
      route: '/(tabs)/html',
      icon: 'doc.text.fill',
      label: 'HTML',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person.fill',
      label: 'Profile',
    },
  ];

  // Use NativeTabs for iOS, custom FloatingTabBar for Android and Web
  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="(home)">
          <Icon sf="house.fill" drawable="ic_home" />
          <Label>Controller</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="java">
          <Icon sf="doc.text.fill" drawable="ic_document" />
          <Label>Java</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="python">
          <Icon sf="doc.text.fill" drawable="ic_document" />
          <Label>Python</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="html">
          <Icon sf="doc.text.fill" drawable="ic_document" />
          <Label>HTML</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Icon sf="person.fill" drawable="ic_profile" />
          <Label>Profile</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  // For Android and Web, use Stack navigation with custom floating tab bar
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none', // Remove fade animation to prevent black screen flash
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="java" />
        <Stack.Screen name="python" />
        <Stack.Screen name="html" />
        <Stack.Screen name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
