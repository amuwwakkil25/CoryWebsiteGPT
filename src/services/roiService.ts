import { supabase } from '../lib/supabase'

export interface ROIInputs {
  monthlyInquiries: number
  contactRate: number
  conversionRate: number
  avgTuition: number
  staffCost: number
  touchesPerLead: number
  coryContactRate: number
  responseUplift: number
  automationCoverage: number
}

export interface ROIResults {
  additionalApps: number
  additionalEnrollments: number
  tuitionLift: number
  staffHoursSaved: number
  annualROI: number
  totalBenefit: number
  platformCost: number
  netBenefit: number
}

export interface ROICalculation {
  id: string
  session_id: string
  user_inputs: ROIInputs
  calculated_results: ROIResults
  created_at: string
  updated_at: string
}

export class ROIService {
  private static sessionId: string

  static getSessionId(): string {
    if (!this.sessionId) {
      this.sessionId = sessionStorage.getItem('roi_session_id') || crypto.randomUUID()
      sessionStorage.setItem('roi_session_id', this.sessionId)
    }
    return this.sessionId
  }

  static calculateROI(inputs: ROIInputs): ROIResults {
    const {
      monthlyInquiries,
      contactRate,
      conversionRate,
      avgTuition,
      staffCost,
      touchesPerLead,
      coryContactRate,
      responseUplift,
      automationCoverage
    } = inputs

    // Current state calculations
    const currentContacts = monthlyInquiries * (contactRate / 100)
    const currentApplications = currentContacts * (conversionRate / 100)
    const currentEnrollments = currentApplications * 0.3 // Assume 30% app to enrollment rate

    // With Cory calculations
    const coryContacts = monthlyInquiries * (coryContactRate / 100)
    const improvedConversionRate = conversionRate * (1 + responseUplift / 100)
    const coryApplications = coryContacts * (improvedConversionRate / 100)
    const coryEnrollments = coryApplications * 0.3

    // Annual projections
    const additionalApps = Math.round((coryApplications - currentApplications) * 12)
    const additionalEnrollments = Math.round((coryEnrollments - currentEnrollments) * 12)
    const tuitionLift = additionalEnrollments * avgTuition
    
    // Staff savings
    const currentStaffHours = monthlyInquiries * touchesPerLead * 0.1 // 6 minutes per touch
    const savedHours = currentStaffHours * (automationCoverage / 100)
    const annualSavedHours = Math.round(savedHours * 12)
    const staffSavings = annualSavedHours * staffCost

    // ROI calculation (assuming $36K annual platform cost)
    const platformCost = 36000
    const totalBenefit = tuitionLift + staffSavings
    const netBenefit = totalBenefit - platformCost
    const annualROI = Math.round((netBenefit / platformCost) * 100)

    return {
      additionalApps,
      additionalEnrollments,
      tuitionLift,
      staffHoursSaved: annualSavedHours,
      annualROI,
      totalBenefit,
      platformCost,
      netBenefit
    }
  }

  static async saveCalculation(inputs: ROIInputs, results: ROIResults): Promise<ROICalculation> {
    const sessionId = this.getSessionId()
    
    try {
      // Store in localStorage instead of database to avoid RLS issues
      const calculation = {
        id: crypto.randomUUID(),
        session_id: sessionId,
        user_inputs: inputs,
        calculated_results: results,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      localStorage.setItem('roi_calculation', JSON.stringify(calculation))
      return calculation as ROICalculation
    } catch (error) {
      console.warn('Could not save ROI calculation to database:', error)
      // Return a mock calculation object for local operation
      return {
        id: crypto.randomUUID(),
        session_id: sessionId,
        user_inputs: inputs,
        calculated_results: results,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }
  }

  static async getCalculation(): Promise<ROICalculation | null> {
    const sessionId = this.getSessionId()
    
    try {
      // Load from localStorage instead of database
      const saved = localStorage.getItem('roi_calculation')
      if (saved) {
        const calculation = JSON.parse(saved)
        if (calculation.session_id === sessionId) {
          return calculation as ROICalculation
        }
      }
      return null
    } catch (error) {
      console.warn('Could not load ROI calculation from database:', error)
      return null
    }
  }

  static formatCurrency(amount: number): string {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    } else {
      return `$${amount.toLocaleString()}`
    }
  }

  static formatNumber(num: number): string {
    return num.toLocaleString()
  }

  static formatPercentage(num: number): string {
    return `${num}%`
  }
}