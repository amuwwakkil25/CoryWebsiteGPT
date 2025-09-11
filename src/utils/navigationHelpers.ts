import { NAVIGATION_ITEMS } from '../config/site'

export class NavigationHelpers {
  static updateActiveNav(): void {
    const currentPath = window.location.pathname
    const navLinks = document.querySelectorAll('.nav-link')
    
    navLinks.forEach(link => {
      const linkElement = link as HTMLAnchorElement
      linkElement.classList.remove('active')
      
      if (linkElement.getAttribute('href') === currentPath || 
          (currentPath === '/' && linkElement.getAttribute('href') === '/')) {
        linkElement.classList.add('active')
      }
    })
  }

  static bindNavToggle(): void {
    const toggle = document.querySelector('.nav-toggle')
    const menu = document.querySelector('.nav-menu')
    
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active')
        menu.classList.toggle('active')
      })

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement
        if (!toggle.contains(target) && !menu.contains(target)) {
          toggle.classList.remove('active')
          menu.classList.remove('active')
        }
      })
    }
  }

  static bindSmoothScroll(): void {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const href = (this as HTMLAnchorElement).getAttribute('href')
        const target = document.querySelector(href || '')
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      })
    })
  }

  static generateNavigation(): string {
    return NAVIGATION_ITEMS.map(item => 
      `<li><a href="${item.href}" class="nav-link">${item.label}</a></li>`
    ).join('')
  }
}