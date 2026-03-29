import React from 'react';
import { AlertProvider } from '../src/context/AlertContext';
import { TabNavigator } from '../src/navigation/TabNavigator';

export default function Root() {
  return (
    <AlertProvider>
      <TabNavigator />
    </AlertProvider>
  );
}
