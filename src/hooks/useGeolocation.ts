import { useState, useEffect } from "react";
import { useUpdateUserLocation } from "./queries";

export function useGeolocation() {
  const [error, setError] = useState<string | null>(null);
  const updateLocation = useUpdateUserLocation();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Get timezone
            const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?` +
                `latitude=${position.coords.latitude}&` +
                `longitude=${position.coords.longitude}&` +
                `timezone=auto`,
            );
            const data = await response.json();

            // Update user location
            await updateLocation.mutateAsync({
              userId: 1, // Temporary hardcoded user ID
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timezone: data.timezone,
            });
          } catch (err) {
            setError("Failed to update location");
          }
        },
        (err) => {
          setError(err.message);
        },
      );
    } else {
      setError("Geolocation is not supported");
    }
  }, []);

  return { error };
}
