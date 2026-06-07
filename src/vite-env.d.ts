/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '@mkkellogg/gaussian-splats-3d' {
  export const SceneRevealMode: {
    Default: number
    Gradual: number
    Instant: number
  }
  export class Viewer {
    constructor(options?: any)
    addSplatScene(url: string, options?: any): Promise<void>
    dispose(): void
  }
}
