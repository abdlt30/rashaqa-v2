import type { AdProvider } from '../types'
export class NoopProvider implements AdProvider {
  async initialize() {}
  async showBanner() {}
  async hideBanner() {}
  async loadRewarded() { return false }
  async showRewarded() { return { success: false, error: 'ads_disabled' } }
  isReady() { return false }
}
