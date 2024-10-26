'use client'

import { useState } from 'react'
import { WeatherData, WeatherInfoProps } from './types'
import { SearchStatusEnum } from './enum'
import { isPending, isFinished } from './const'

const WeatherInfo: React.FC<WeatherInfoProps> = ({ data }) => {
  const { name, sys, weather, main, wind, clouds, coord } = data

  // covert to temperature celsius
  const toTemperatureCelsius = (temp: number) => `${temp}°C` 

  return (
      <div className="p-4 border rounded-lg shadow-md bg-white">
          <div className="font-bold">
              <span className="text-blue-500 hover:underline">{`${name}, ${sys.country}`}</span>
          </div>
          <div className="font-bold">
              <i>{weather[0].description}</i>
          </div>
          <p className="mt-2">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">{toTemperatureCelsius(main.temp)}</span>
              temperature from {toTemperatureCelsius(main.temp_min)} to {toTemperatureCelsius(main.temp_max)}, 
              wind {`${wind.speed} m/s`}. clouds {clouds.all}%, pressure {main.pressure} hPa
          </p>
          <p className="mt-1">
              Geo coords <strong className="text-blue-500 hover:underline">[{coord.lat}, {coord.lon}]</strong>
          </p>
      </div>
  )
}

export default function Home() {
  const [city, setCity] = useState('')
  const [searchStatus, setSearchStatus] = useState(SearchStatusEnum.WAITING)
  const [weatherInfo, setWeatherInfo] = useState<WeatherData>()

  const searchWeather = async () => {
    if (!city) {
      setSearchStatus(SearchStatusEnum.FINISHED)
      return
    }
    try {
      setSearchStatus(SearchStatusEnum.PENDING)
      setWeatherInfo(undefined)
      const response = await fetch(`/api/weather?city=${city}`)
      const { code, data } = await response.json()
      if (code === '200') {
        setWeatherInfo(data)
      }
    } finally {
      setSearchStatus(SearchStatusEnum.FINISHED)
    }
  }

  return (
    <div className="relative min-h-screen font-[family-name:var(--font-geist-sans)]">
      <header className="py-8 bg-gradient-to-r from-cyan-500 to-blue-500">
        <div className="flex items-center justify-center mx-auto">
          <input 
            className='inline-block py-3 px-6 rounded-tl-3xl rounded-bl-3xl'
            value={city} 
            placeholder='please input city name' 
            onChange={(e) => setCity(e.target.value)}
          />
          <button 
            className="inline-block bg-blue-500 py-3 text-white px-4 rounded-tr-3xl rounded-br-3xl" 
            type="button"
            onClick={searchWeather}>
              Search
          </button>
        </div>
      </header>
      { (isFinished(searchStatus) || isPending(searchStatus)) && (
        <main className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
            { isPending(searchStatus) && <div>Loading...</div> }
            { isFinished(searchStatus) && !weatherInfo && <div className='text-orange-500'>404</div> }
            { isFinished(searchStatus) && weatherInfo && <WeatherInfo data={weatherInfo}/> }
        </main>
      )}
    </div>
  )
}
