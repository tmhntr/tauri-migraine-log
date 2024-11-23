import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserLocation, useWeatherData, useSyncWeatherData } from "@/hooks/queries";
import { format, subDays } from "date-fns";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Cloud, Droplets, Wind, ArrowDown, ArrowUp, Gauge } from "lucide-react";
import { useEffect } from "react";

// Temporary hardcoded user ID until we implement auth
const TEMP_USER_ID = 1;

export function WeatherWidget() {
  const location = useUserLocation(TEMP_USER_ID);
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);
  
  const weatherData = useWeatherData(
    location.data?.id ?? 0,
    format(thirtyDaysAgo, 'yyyy-MM-dd'),
    format(today, 'yyyy-MM-dd')
  );
  
  const syncWeather = useSyncWeatherData();

  // Sync weather data when location is available
  useEffect(() => {
    if (location.data) {
      syncWeather.mutate({
        locationId: location.data.id,
        latitude: location.data.latitude,
        longitude: location.data.longitude,
        startDate: format(thirtyDaysAgo, 'yyyy-MM-dd'),
        endDate: format(today, 'yyyy-MM-dd')
      });
    }
  }, [location.data]);

  const currentWeather = weatherData.data?.[weatherData.data.length - 1];

  return (
    <Card className="col-span-3 sm:col-span-1 h-full">
      <Tabs defaultValue="current">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Weather</CardTitle>
            <TabsList>
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
          </div>
          <CardDescription>
            Local weather conditions that might affect your migraines
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <TabsContent value="current" className="space-y-4">
            {currentWeather ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <ArrowUp className="h-4 w-4" />
                        <span>{currentWeather.temperature_high}°C</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowDown className="h-4 w-4" />
                        <span>{currentWeather.temperature_low}°C</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4" />
                    <span>{currentWeather.surface_pressure} hPa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4" />
                    <span>{currentWeather.precipitation} mm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4" />
                    <span>{currentWeather.wind_speed} km/h</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-32">
                <Cloud className="h-8 w-8 animate-pulse text-muted-foreground" />
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {weatherData.data && (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weatherData.data}>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), 'dd/MM')}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => format(new Date(date), 'dd MMM yyyy')}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="surface_pressure" 
                    stroke="#8884d8" 
                    name="Pressure (hPa)"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}