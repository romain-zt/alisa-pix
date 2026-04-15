export const SCENE_IMAGES = {
  threshold: '/assets/images/boudoir/IMG_7523.jpeg',

  descent: {
    atmosphere: '/assets/images/boudoir/IMG_7544.jpeg',
    main: '/assets/images/boudoir/IMG_7820.jpeg',
  },

  overflow: '/assets/images/boudoir/IMG_7408.jpeg',

  hardcut: '/assets/images/boudoir/IMG_5234.jpeg',

  split: '/assets/images/boudoir/IMG_7355.jpeg',

  stack: [
    '/assets/images/boudoir/IMG_5228.jpeg',
    '/assets/images/boudoir/IMG_6896.jpeg',
    '/assets/images/boudoir/IMG_7549.jpeg',
    '/assets/images/boudoir/IMG_3109.jpeg',
  ] as const,

  impact: '/assets/images/boudoir/IMG_7529.jpeg',

  intimacy: '/assets/images/boudoir/IMG_8326.jpeg',

  fragments: [
    '/assets/images/boudoir/IMG_7355.jpeg',
    '/assets/images/boudoir/IMG_7408.jpeg',
    '/assets/images/boudoir/IMG_5228.jpeg',
    '/assets/images/boudoir/IMG_6896.jpeg',
    '/assets/images/boudoir/IMG_7549.jpeg',
  ] as const,
}

export const GALLERY_IMAGES = [
  '/assets/images/boudoir/IMG_7523.jpeg',
  '/assets/images/boudoir/IMG_7820.jpeg',
  '/assets/images/boudoir/IMG_5228.jpeg',
  '/assets/images/boudoir/IMG_7529.jpeg',
  '/assets/images/boudoir/IMG_3109.jpeg',
  '/assets/images/boudoir/IMG_7544.jpeg',
  '/assets/images/boudoir/IMG_6896.jpeg',
  '/assets/images/boudoir/IMG_8326.jpeg',
  '/assets/images/boudoir/IMG_7355.jpeg',
  '/assets/images/boudoir/IMG_5234.jpeg',
  '/assets/images/boudoir/IMG_7550.jpeg',
  '/assets/images/boudoir/IMG_8002.jpeg',
]

export type SceneImages = typeof SCENE_IMAGES
