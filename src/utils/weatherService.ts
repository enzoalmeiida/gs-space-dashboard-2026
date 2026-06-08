export type WeatherInfo = {
  location: string;
  tempC: number;
  description: string;
  fetchedAt: string;
};

const MOCK: WeatherInfo = {
  location: 'Local (mock)',
  tempC: 22.4,
  description: 'Céu limpo (mock)',
  fetchedAt: new Date().toISOString(),
};

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherInfo> {
  try {
    const apiKey = process.env.EXPO_OPENWEATHER_KEY ?? '';
    if (!apiKey) {
      return { ...MOCK, fetchedAt: new Date().toISOString() };
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return { ...MOCK, fetchedAt: new Date().toISOString() };
    const json = await res.json();
    return {
      location: `${json.name ?? 'Local'}`,
      tempC: json.main?.temp ?? MOCK.tempC,
      description: json.weather?.[0]?.description ?? MOCK.description,
      fetchedAt: new Date().toISOString(),
    };
  } catch (e) {
    return { ...MOCK, fetchedAt: new Date().toISOString() };
  }
}
