// * kept as example, no more used since the @bms/common dependency has been removed
import { vi } from 'vitest'

vi.mock('@bms/common', async () => {
  const mod = await vi.importActual('@bms/common')
  return {
    ...mod,
    config: mod.readConfigFromPackage(import.meta.url),
  }
})
