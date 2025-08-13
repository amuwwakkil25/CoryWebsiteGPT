import { ROIService, type ROIInputs, type ROIResults } from '../services/roiService'

export class ROICalculator {
  private inputs: ROIInputs = {
    monthlyInquiries: 500,
    contactRate: 45,
    conversionRate: 25,
    avgTuition: 25000,
    staffCost: 35,
    touchesPerLead: 8,
    coryContactRate: 92,
    responseUplift: 25,
    automationCoverage: 85
  }

  private isInitialized = false

  constructor() {
    this.init()
  }

  async init(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Load saved calculation if exists
      await this.loadSavedCalculation()
      
      // Bind all input events
      this.bindInputs()
      this.bindSliders()
      
      // Calculate and display initial results
      await this.calculate()
      
      this.isInitialized = true
      console.log('ROI Calculator initialized with database integration')
    } catch (error) {
      console.error('Failed to initialize ROI calculator:', error)
      // Fall back to local calculation
      this.calculate()
    }
  }

  private async loadSavedCalculation(): Promise<void> {
    try {
      const saved = await ROIService.getCalculation()
      if (saved && saved.user_inputs) {
        this.inputs = { ...this.inputs, ...saved.user_inputs }
        this.updateInputFields()
      }
    } catch (error) {
      console.error('Error loading saved calculation:', error)
    }
  }

  private updateInputFields(): void {
    // Update input fields with loaded values
    const inputMappings = {
      'monthly-inquiries': 'monthlyInquiries',
      'contact-rate': 'contactRate',
      'conversion-rate': 'conversionRate',
      'avg-tuition': 'avgTuition',
      'staff-cost': 'staffCost',
      'touches-per-lead': 'touchesPerLead',
      'cory-contact-rate': 'coryContactRate',
      'response-uplift': 'responseUplift',
      'automation-coverage': 'automationCoverage'
    }

    Object.entries(inputMappings).forEach(([elementId, inputKey]) => {
      const element = document.getElementById(elementId) as HTMLInputElement
      if (element) {
        element.value = this.inputs[inputKey as keyof ROIInputs].toString()
      }
    })

    // Update slider value displays
    this.updateSliderDisplays()
  }

  private updateSliderDisplays(): void {
    const sliderMappings = [
      { id: 'cory-contact-rate', valueId: 'cory-contact-rate-value', key: 'coryContactRate', suffix: '%' },
      { id: 'response-uplift', valueId: 'response-uplift-value', key: 'responseUplift', prefix: '+', suffix: '%' },
      { id: 'automation-coverage', valueId: 'automation-coverage-value', key: 'automationCoverage', suffix: '%' }
    ]

    sliderMappings.forEach(({ valueId, key, prefix = '', suffix = '' }) => {
      const valueElement = document.getElementById(valueId)
      if (valueElement) {
        const value = this.inputs[key as keyof ROIInputs]
        valueElement.textContent = `${prefix}${value}${suffix}`
      }
    })
  }

  private bindInputs(): void {
    const inputMappings = {
      'monthly-inquiries': 'monthlyInquiries',
      'contact-rate': 'contactRate',
      'conversion-rate': 'conversionRate',
      'avg-tuition': 'avgTuition',
      'staff-cost': 'staffCost',
      'touches-per-lead': 'touchesPerLead'
    }

    Object.entries(inputMappings).forEach(([elementId, inputKey]) => {
      const element = document.getElementById(elementId) as HTMLInputElement
      if (element) {
        element.addEventListener('input', async () => {
          const value = parseFloat(element.value) || 0
          this.inputs[inputKey as keyof ROIInputs] = value
          await this.calculate()
        })
      }
    })
  }

  private bindSliders(): void {
    const sliderMappings = [
      { id: 'cory-contact-rate', valueId: 'cory-contact-rate-value', key: 'coryContactRate', suffix: '%' },
      { id: 'response-uplift', valueId: 'response-uplift-value', key: 'responseUplift', prefix: '+', suffix: '%' },
      { id: 'automation-coverage', valueId: 'automation-coverage-value', key: 'automationCoverage', suffix: '%' }
    ]

    sliderMappings.forEach(({ id, valueId, key, prefix = '', suffix = '' }) => {
      const element = document.getElementById(id) as HTMLInputElement
      const valueElement = document.getElementById(valueId)
      
      if (element && valueElement) {
        element.addEventListener('input', async () => {
          const value = parseFloat(element.value)
          this.inputs[key as keyof ROIInputs] = value
          
          // Update display
          valueElement.textContent = `${prefix}${value}${suffix}`
          
          // Recalculate
          await this.calculate()
        })
      }
    })
  }

  private async calculate(): Promise<void> {
    try {
      // Calculate results
      const results = ROIService.calculateROI(this.inputs)
      
      // Save to database
      await ROIService.saveCalculation(this.inputs, results)
      
      // Update display
      this.updateResults(results)
      
      // Update chart
      this.updateChart(results)
      
    } catch (error) {
      console.error('ROI calculation error:', error)
      
      // Fall back to local calculation
      const results = ROIService.calculateROI(this.inputs)
      this.updateResults(results)
      this.updateChart(results)
    }
  }

  private updateResults(results: ROIResults): void {
    const resultMappings = {
      'additional-apps': ROIService.formatNumber(results.additionalApps),
      'additional-enrollments': ROIService.formatNumber(results.additionalEnrollments),
      'tuition-lift': ROIService.formatCurrency(results.tuitionLift),
      'staff-hours-saved': ROIService.formatNumber(results.staffHoursSaved),
      'annual-roi': ROIService.formatPercentage(results.annualROI)
    }

    Object.entries(resultMappings).forEach(([elementId, value]) => {
      const element = document.getElementById(elementId)
      if (element) {
        // Add animation effect
        element.style.transform = 'scale(1.1)'
        element.style.transition = 'transform 0.2s ease-out'
        
        setTimeout(() => {
          element.textContent = value
          element.style.transform = 'scale(1)'
        }, 100)
      }
    })
  }

  private updateChart(results: ROIResults): void {
    const chartContainer = document.querySelector('.roi-chart .chart-bars')
    if (!chartContainer) return

    const maxValue = Math.max(results.tuitionLift, results.platformCost)
    const staffSavings = results.staffHoursSaved * this.inputs.staffCost

    const chartData = [
      {
        label: 'Tuition Revenue',
        value: results.tuitionLift,
        percentage: (results.tuitionLift / maxValue) * 100,
        formatted: ROIService.formatCurrency(results.tuitionLift),
        positive: true
      },
      {
        label: 'Staff Cost Savings',
        value: staffSavings,
        percentage: (staffSavings / maxValue) * 100,
        formatted: ROIService.formatCurrency(staffSavings),
        positive: true
      },
      {
        label: 'Platform Investment',
        value: results.platformCost,
        percentage: (results.platformCost / maxValue) * 100,
        formatted: `-${ROIService.formatCurrency(results.platformCost)}`,
        positive: false
      }
    ]

    chartContainer.innerHTML = chartData.map(item => `
      <div class="chart-bar">
        <div class="bar-label">${item.label}</div>
        <div class="bar-visual ${item.positive ? '' : 'negative'}">
          <div class="bar-fill" style="width: ${item.percentage}%; transition: width 0.5s ease-out;"></div>
        </div>
        <div class="bar-value">${item.formatted}</div>
      </div>
    `).join('')
  }

  // Public methods for external access
  getInputs(): ROIInputs {
    return { ...this.inputs }
  }

  async updateInput(key: keyof ROIInputs, value: number): Promise<void> {
    this.inputs[key] = value
    await this.calculate()
  }

  async resetToDefaults(): Promise<void> {
    this.inputs = {
      monthlyInquiries: 500,
      contactRate: 45,
      conversionRate: 25,
      avgTuition: 25000,
      staffCost: 35,
      touchesPerLead: 8,
      coryContactRate: 92,
      responseUplift: 25,
      automationCoverage: 85
    }
    
    this.updateInputFields()
    await this.calculate()
  }
}