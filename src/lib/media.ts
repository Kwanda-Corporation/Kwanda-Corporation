/**
 * Central reference to the media assets bundled in `public/media`. Paths are
 * served directly from the public root (Vite copies them verbatim), so they
 * stay stable regardless of how the components are chunked.
 */
export const MEDIA = {
  katishaVideo: '/media/katisha-video.mp4',
  katishaAgents: '/media/katisha-agents.jpg',
  strsScreenshot1: '/media/strs-screenshot-1.jpg',
  strsScreenshot2: '/media/strs-screenshot-2.jpg',
  certificate: '/media/data-controller-certificate.jpg',
  logos: {
    minict: '/media/logos/minict.png',
    rura: '/media/logos/rura.png',
    trinity: '/media/logos/trinity.png',
    simba: '/media/logos/simba.png',
  },
} as const;
