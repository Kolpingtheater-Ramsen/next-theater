declare module 'next/image' {
  import * as React from 'react'
  const Image: React.ComponentType<Record<string, unknown>>
  export default Image
}

declare module 'next/link' {
  import * as React from 'react'
  const Link: React.ComponentType<Record<string, unknown>>
  export default Link
}

declare module 'next/font/google' {
  export const Geist: unknown
  export const Geist_Mono: unknown
  export const Cinzel: unknown
}

