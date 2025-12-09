import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function SalesmanDashboardScreen() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new tab structure for backward compatibility
    router.replace('/(salesman-tabs)');
  }, [router]);

  return null;
}
