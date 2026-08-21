import dest0 from '../assets/images/destination_0.jpg'
import dest0Blur from '../assets/images/destination_0_blur.jpg'
import dest1 from '../assets/images/destination_1.jpg'
import dest1Blur from '../assets/images/destination_1_blur.jpg'
import dest2 from '../assets/images/destination_2.jpg'
import dest2Blur from '../assets/images/destination_2_blur.jpg'
import dest3 from '../assets/images/destination_3.jpg'
import dest3Blur from '../assets/images/destination_3_blur.jpg'
import dest4 from '../assets/images/destination_4.jpg'
import dest4Blur from '../assets/images/destination_4_blur.jpg'

export interface BackgroundPrompt {
  index: number
  prompt: string
  imageURL: string
  blurImageURL: string
}

export const backgroundPrompts: BackgroundPrompt[] = [
  {
    index: 0,
    prompt: 'Sustainable eco-lodges in Amalfi Coast',
    imageURL: dest0,
    blurImageURL: dest0Blur,
  },
  {
    index: 1,
    prompt: 'Quiet canal-side boutique stays in Venice',
    imageURL: dest1,
    blurImageURL: dest1Blur,
  },
  {
    index: 2,
    prompt: 'Sunlit coastal cliff retreats in Portugal',
    imageURL: dest2,
    blurImageURL: dest2Blur,
  },
  {
    index: 3,
    prompt: 'Zen garden ryokans & tea masters in Kyoto',
    imageURL: dest3,
    blurImageURL: dest3Blur,
  },
  {
    index: 4,
    prompt: 'Art deco skyline lofts & jazz lounges in NYC',
    imageURL: dest4,
    blurImageURL: dest4Blur,
  },
]
