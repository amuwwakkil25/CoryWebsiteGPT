import { ContentPageManager } from '../src/components/ContentPageManager'

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.contentPageManager = new ContentPageManager()
})

// Make shareContent available globally
(window as any).shareContent = function() {
  if ((window as any).contentPageManager) {
    (window as any).contentPageManager.shareContent()
  }
}