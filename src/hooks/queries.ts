import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDocument } from "@/hooks/document";
import { Weather } from "@/schema";

const queryKeys = {
    episodeCount: (start_date: Date, end_date: Date) => ["episodeCount", start_date, end_date],
    weather: (locationId: string, startDate: string, endDate: string) => ["weather", locationId, startDate, endDate],
  };

export const useGetEpisodeCount = (start_date: Date, end_date: Date) => {
    const [doc, changeDoc] = useDocument();

    const episodes = doc?.entries.filter(
      (entry) =>
        new Date(entry.start_time) >= start_date &&
        new Date(entry.start_time) <= end_date
    );

    return useQuery({
      queryKey: queryKeys.episodeCount(start_date, end_date),
      queryFn: () => episodes?.length,
    });
  };


  export const useWeatherData = (
    locationId: string,
    startDate: string,
    endDate: string,
  ) => {
    const [doc, changeDoc] = useDocument();

    return useQuery({
      queryKey: queryKeys.weather(locationId, startDate, endDate),
      queryFn: () => doc?.weather.filter(
        (weather) =>
            weather.user_location_id === locationId &&
            new Date(weather.date) >= new Date(startDate) &&
            new Date(weather.date) <= new Date(endDate)
        ),
    });
  };

  


  export const useSyncWeatherData = () => {
    const queryClient = useQueryClient();
    const [doc, changeDoc] = useDocument();

    const syncWeatherData = () => {
        changeDoc((d) => {
            // add weather data that is not already in the document
            const newWeatherData = doc?.weather.filter(
              (weather) =>
                !d.weather.some(
                  (existingWeather) =>
                    existingWeather.date === weather.date &&
                    existingWeather.user_location_id === weather.user_location_id
                )
            ) ?? [] as Weather[];
            d.weather.push(...newWeatherData);
            });
        };

  
    return useMutation({
      mutationFn: async ({}: {
        locationId: string;
        latitude: number;
        longitude: number;
        startDate: string;
        endDate: string;
      }) => {
        return syncWeatherData();
      },
      onSuccess: (_, { locationId, startDate, endDate }) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.weather(locationId, startDate, endDate),
        });
      },
    });
  };