const S3_BASE_BOUDOIR = '/assets/images/boudoir/'

export const boudoirImages = [
  '_DSC2188.jpeg',
  '_DSC2620.jpeg',
  '11.jpeg',
  '37.jpeg',
  '0404.jpeg',
  '1234567.jpeg',
  'IMG_2241.jpeg',
  'IMG_3106.jpeg',
  'IMG_3109.jpeg',
  'IMG_5228.jpeg',
  'IMG_5231 2.jpeg',
  'IMG_5234.jpeg',
  'IMG_5235.jpeg',
  'IMG_5726.jpeg',
  '0606-2.jpg',
  'IMG_6896.jpeg',
  'IMG_7095.jpeg',
  'IMG_7355.jpeg',
  'IMG_7408.jpeg',
  'IMG_7523.jpeg',
  'IMG_7529.jpeg',
  'IMG_7544.jpeg',
  'IMG_7549.jpeg',
  'IMG_7550.jpeg',
  'IMG_7820.jpeg',
  'IMG_7823.jpeg',
  'IMG_8002.jpeg',
  'IMG_8326.jpeg',
  'PHOTO-2022-09-09-05-19-20.jpeg',
  '12.jpeg',
  '_DSC5577.jpeg',
  'IMG_9585.jpg',
  'IMG_8228.JPG',
  'IMG_8294.JPG',
].map((f) => `${S3_BASE_BOUDOIR}${f}`)

// Curated subsets — intentional repetition builds identity

export const heroImages = [
  boudoirImages[0],  // _DSC2188
  boudoirImages[21], // IMG_7544
  boudoirImages[16], // IMG_7095
]

export const scrollImages = [
  boudoirImages[20], // IMG_7529
  boudoirImages[30], // _DSC5577
  boudoirImages[17], // IMG_7355
  boudoirImages[24], // IMG_7820
]

export const experienceImages = [
  boudoirImages[11], // IMG_5234
  boudoirImages[17], // IMG_7355
  boudoirImages[7],  // IMG_3106
  boudoirImages[22], // IMG_7549
  boudoirImages[15], // IMG_6896
  boudoirImages[26], // IMG_8002
]
