export type AdSlotType = 'banner' | 'native' | 'rewarded'
export interface AdProvider {
  initialize(): Promise<void>
  showBanner(slotId: string): Promise<void>
  hideBanner(): Promise<void>
  loadRewarded(adUnitId: string): Promise<boolean>
  showRewarded(): Promise<{ success: boolean; error?: string }>
  isReady(): boolean
}
export interface AdConfig {
  show_ads: boolean
  rewarded_available: boolean
  rewarded_remaining: number
  banner_enabled: boolean
  provider: string
}
