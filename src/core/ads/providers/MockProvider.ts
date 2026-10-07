import type { AdProvider } from '../types'
export class MockProvider implements AdProvider {
  private ready = false
  async initialize() { this.ready = true; console.log('[MockAds] init') }
  async showBanner(slot: string) { console.log('[MockAds] banner', slot) }
  async hideBanner() { console.log('[MockAds] hide') }
  async loadRewarded(id: string) { return true }
  async showRewarded() { await new Promise(r => setTimeout(r, 1000)); return { success: true } }
  isReady() { return this.ready }
}
