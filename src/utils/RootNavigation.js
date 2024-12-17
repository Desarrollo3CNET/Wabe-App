import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function goToDrawer() {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Dashboard'); // Redirige a la ruta principal del DrawerNavigator
  }
}
