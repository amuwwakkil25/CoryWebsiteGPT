export class ModalHelpers {
  static openModal(modal: HTMLElement): void {
    modal.classList.add('active')
    document.body.style.overflow = 'hidden'
    
    const firstInput = modal.querySelector('input, select, textarea') as HTMLElement
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100)
    }
  }

  static closeModal(modal: HTMLElement): void {
    modal.classList.remove('active')
    document.body.style.overflow = ''
    
    const forms = modal.querySelectorAll('form')
    forms.forEach(form => (form as HTMLFormElement).reset())
    
    const successDivs = modal.querySelectorAll('[id$="-success"]')
    successDivs.forEach(div => {
      (div as HTMLElement).style.display = 'none'
    })
    
    const formDivs = modal.querySelectorAll('form')
    formDivs.forEach(div => {
      (div as HTMLElement).style.display = 'block'
    })
  }

  static bindModalEvents(): void {
    // Close modal events
    const closeButtons = document.querySelectorAll('.modal-close')
    closeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = (e.target as HTMLElement).closest('.modal') as HTMLElement
        if (modal) {
          this.closeModal(modal)
        }
      })
    })

    // Close on backdrop click
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (target.classList.contains('modal')) {
        this.closeModal(target)
      }
    })
  }
}