export class FormHelpers {
  static validateForm(form: HTMLFormElement): boolean {
    let isValid = true
    const requiredFields = form.querySelectorAll('[required]')
    
    requiredFields.forEach(field => {
      const input = field as HTMLInputElement
      const formGroup = input.closest('.form-group')
      const errorDiv = formGroup?.querySelector('.form-error')
      
      if (!input.value.trim()) {
        isValid = false
        formGroup?.classList.add('error')
        if (errorDiv) {
          errorDiv.textContent = 'This field is required'
        }
      } else {
        formGroup?.classList.remove('error')
      }

      // Email validation
      if (input.type === 'email' && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(input.value)) {
          isValid = false
          formGroup?.classList.add('error')
          if (errorDiv) {
            errorDiv.textContent = 'Please enter a valid email address'
          }
        }
      }

      // Phone validation
      if (input.type === 'tel' && input.value) {
        const cleanPhone = input.value.replace(/\D/g, '')
        if (cleanPhone.length < 10) {
          isValid = false
          formGroup?.classList.add('error')
          if (errorDiv) {
            errorDiv.textContent = 'Please enter a valid phone number'
          }
        }
      }
    })

    return isValid
  }

  static checkHoneypot(formData: FormData): boolean {
    return !!formData.get('website')
  }

  static showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const toast = document.createElement('div')
    toast.className = `toast toast-${type}`
    toast.textContent = message
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: var(--shadow-lg);
      z-index: 1001;
      animation: slideInRight 0.3s ease-out;
      max-width: 400px;
    `
    
    const colors = {
      success: 'var(--success)',
      error: 'var(--error)',
      info: 'var(--sky-gradient-start)'
    }
    toast.style.background = colors[type]
    toast.style.color = 'white'
    
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease-out'
      setTimeout(() => toast.remove(), 300)
    }, 4000)
  }

  static copyToClipboard(text: string, successMessage?: string): void {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast(successMessage || 'Link copied to clipboard!', 'success')
      }).catch(() => {
        this.fallbackCopyToClipboard(text, successMessage)
      })
    } else {
      this.fallbackCopyToClipboard(text, successMessage)
    }
  }

  private static fallbackCopyToClipboard(text: string, successMessage?: string): void {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    try {
      document.execCommand('copy')
      this.showToast(successMessage || 'Link copied to clipboard!', 'success')
    } catch (err) {
      this.showToast('Unable to copy link. Please copy manually.', 'error')
    }
    
    document.body.removeChild(textArea)
  }
}