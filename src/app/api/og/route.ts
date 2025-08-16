import { ImageResponse } from 'next/og'
import React from 'react'

export const runtime = 'edge'

export async function GET() {
  const element = React.createElement(
    'div',
    {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f0f10',
        color: '#fff',
        fontSize: 64,
        fontWeight: 700,
      },
    },
    'Kolpingtheater Ramsen'
  )
  return new ImageResponse(element, { width: 1200, height: 630 })
}
