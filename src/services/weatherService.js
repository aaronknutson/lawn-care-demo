import api from './api';

export const getWeatherForecast = async (date, zipCode) => {
  const response = await api.get(`/weather/forecast/${date}/${zipCode}`);
  return response.data;
};

export const getCurrentWeather = async (zipCode) => {
  const response = await api.get(`/weather/current/${zipCode}`);
  return response.data;
};
