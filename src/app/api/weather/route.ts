import { NextRequest, NextResponse } from "next/server"

const appid = '47389d563c1fbbab8c61d058ff4dbef6'

export async function GET(
  request: NextRequest
) {
  try {
    const city = request.nextUrl.searchParams.get('city')

    if (!city) {
      return NextResponse.json({ code: '400', msg: 'Missing city parameter', data: {} }, { status: 400 });
    }

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appid}&units=metric`)
    const data = await response.json()
    const { code = '200', message = 'success', ...result } = data
  
    return NextResponse
      .json({ code: code, msg: message, data: result }, { status: response.status })
  } catch (e) {
    console.error('Error fetching weather data:', e)
    return NextResponse
      .json({ code: '500', msg: 'Server Error', data: {} }, { status: 500 })
  }
}