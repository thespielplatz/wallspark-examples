
import ILogo from '@shared/logos/ILogo'
import { colors, GameObject, PixelBuffer } from '@thespielplatz/wall-spark-engine'

const BG_COLOR = colors.INVISIBLE
const RED_LIGHT = 0xFF0000
const RED_DARK = 0xA30036

export default class EgAustria extends GameObject implements ILogo {
  get width(): number {
    return 4
  }

  get height(): number {
    return 5
  }

  async draw(pixelBuffer: PixelBuffer) {
    pixelBuffer.setPixelRow({ y: 0, colors: [BG_COLOR, BG_COLOR, RED_LIGHT, BG_COLOR] })
    pixelBuffer.setPixelRow({ y: 1, colors: [BG_COLOR, RED_LIGHT, RED_DARK, RED_LIGHT] })
    pixelBuffer.setPixelRow({ y: 2, colors: [RED_LIGHT, BG_COLOR, BG_COLOR, RED_LIGHT] })
    pixelBuffer.setPixelRow({ y: 3, colors: [RED_LIGHT, RED_DARK, RED_LIGHT, BG_COLOR] })
    pixelBuffer.setPixelRow({ y: 4, colors: [BG_COLOR, RED_LIGHT, BG_COLOR, BG_COLOR] })
  }
}
