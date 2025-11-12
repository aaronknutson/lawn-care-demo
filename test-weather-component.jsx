import { useQuery } from '@tanstack/react-query';
import { getCurrentWeather } from './src/services/weatherService';

function WeatherWidgetDebug({ zipCode = '78701' }) {
  const { data: weatherData, isLoading, error, isError } = useQuery({
    queryKey: ['current-weather', zipCode],
    queryFn: () => getCurrentWeather(zipCode),
    retry: 1,
    staleTime: 1000 * 60 * 15,
    refetchInterval: 1000 * 60 * 15,
  });

  console.log('WeatherWidget Debug:', {
    weatherData,
    isLoading,
    error,
    isError,
    hasData: !!weatherData,
    hasDataProp: !!weatherData?.data,
  });

  if (isLoading) {
    console.log('WeatherWidget: Loading state');
    return (
      <div className="bg-white rounded-lg shadow p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (isError) {
    console.log('WeatherWidget: Error state', error);
    return (
      <div className="bg-red-100 rounded-lg shadow p-4 text-red-800">
        <p>Error loading weather: {error?.message || 'Unknown error'}</p>
      </div>
    );
  }

  if (!weatherData) {
    console.log('WeatherWidget: No weatherData');
    return (
      <div className="bg-yellow-100 rounded-lg shadow p-4 text-yellow-800">
        <p>No weather data returned</p>
      </div>
    );
  }

  if (!weatherData?.data) {
    console.log('WeatherWidget: No weatherData.data', weatherData);
    return (
      <div className="bg-yellow-100 rounded-lg shadow p-4 text-yellow-800">
        <p>Weather data structure incorrect</p>
        <pre className="text-xs mt-2">{JSON.stringify(weatherData, null, 2)}</pre>
      </div>
    );
  }

  const weather = weatherData.data;
  console.log('WeatherWidget: Rendering with weather data', weather);

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {weather.icon && (
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="w-16 h-16 -ml-2"
            />
          )}
          <div>
            <p className="text-3xl font-bold">{weather.temperature}°F</p>
            <p className="text-sm opacity-90 capitalize">{weather.description}</p>
          </div>
        </div>
        <div className="text-right space-y-1">
          <div className="flex items-center justify-end text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center justify-end text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span>{weather.windSpeed} mph</span>
          </div>
          <div className="text-xs opacity-75 mt-2">
            {weather.city}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherWidgetDebug;
