// ROI Calculator for Agent Cory Marketing Site
class ROICalculator {
    constructor() {
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
        };
        this.init();
    }

    init() {
        this.bindInputs();
        this.bindSliders();
        this.calculate();
        console.log('ROI Calculator initialized');
    }

    bindInputs() {
        const inputMappings = {
            'monthly-inquiries': 'monthlyInquiries',
            'contact-rate': 'contactRate',
            'conversion-rate': 'conversionRate',
            'avg-tuition': 'avgTuition',
            'staff-cost': 'staffCost',
            'touches-per-lead': 'touchesPerLead'
        };

        Object.entries(inputMappings).forEach(([elementId, inputKey]) => {
            const element = document.getElementById(elementId);
            if (element) {
                element.addEventListener('input', () => {
                    const value = parseFloat(element.value) || 0;
                    this.inputs[inputKey] = value;
                    this.calculate();
                });
            }
        });
    }

    bindSliders() {
        const sliderMappings = [
            { id: 'cory-contact-rate', valueId: 'cory-contact-rate-value', key: 'coryContactRate', suffix: '%' },
            { id: 'response-uplift', valueId: 'response-uplift-value', key: 'responseUplift', prefix: '+', suffix: '%' },
            { id: 'automation-coverage', valueId: 'automation-coverage-value', key: 'automationCoverage', suffix: '%' }
        ];

        sliderMappings.forEach(({ id, valueId, key, prefix = '', suffix = '' }) => {
            const element = document.getElementById(id);
            const valueElement = document.getElementById(valueId);
            
            if (element && valueElement) {
                element.addEventListener('input', () => {
                    const value = parseFloat(element.value);
                    this.inputs[key] = value;
                    
                    // Update display
                    valueElement.textContent = `${prefix}${value}${suffix}`;
                    
                    // Recalculate
                    this.calculate();
                });
            }
        });
    }

    calculate() {
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
        } = this.inputs;

        // Current state calculations
        const currentContacts = monthlyInquiries * (contactRate / 100);
        const currentApplications = currentContacts * (conversionRate / 100);
        const currentEnrollments = currentApplications * 0.3; // Assume 30% app to enrollment rate

        // With Cory calculations
        const coryContacts = monthlyInquiries * (coryContactRate / 100);
        const improvedConversionRate = conversionRate * (1 + responseUplift / 100);
        const coryApplications = coryContacts * (improvedConversionRate / 100);
        const coryEnrollments = coryApplications * 0.3;

        // Annual projections
        const additionalApps = Math.round((coryApplications - currentApplications) * 12);
        const additionalEnrollments = Math.round((coryEnrollments - currentEnrollments) * 12);
        const tuitionLift = additionalEnrollments * avgTuition;
        
        // Staff savings
        const currentStaffHours = monthlyInquiries * touchesPerLead * 0.1; // 6 minutes per touch
        const savedHours = currentStaffHours * (automationCoverage / 100);
        const annualSavedHours = Math.round(savedHours * 12);
        const staffSavings = annualSavedHours * staffCost;

        // ROI calculation (assuming $36K annual platform cost)
        const platformCost = 36000;
        const totalBenefit = tuitionLift + staffSavings;
        const netBenefit = totalBenefit - platformCost;
        const annualROI = Math.round((netBenefit / platformCost) * 100);

        const results = {
            additionalApps,
            additionalEnrollments,
            tuitionLift,
            staffHoursSaved: annualSavedHours,
            annualROI,
            totalBenefit,
            platformCost,
            netBenefit
        };

        this.updateResults(results);
    }

    updateResults(results) {
        const resultMappings = {
            'additional-apps': this.formatNumber(results.additionalApps),
            'additional-enrollments': this.formatNumber(results.additionalEnrollments),
            'tuition-lift': this.formatCurrency(results.tuitionLift),
            'staff-hours-saved': this.formatNumber(results.staffHoursSaved),
            'annual-roi': this.formatPercentage(results.annualROI)
        };

        Object.entries(resultMappings).forEach(([elementId, value]) => {
            const element = document.getElementById(elementId);
            if (element) {
                // Add animation effect
                element.style.transform = 'scale(1.1)';
                element.style.transition = 'transform 0.2s ease-out';
                
                setTimeout(() => {
                    element.textContent = value;
                    element.style.transform = 'scale(1)';
                }, 100);
            }
        });
    }

    formatCurrency(amount) {
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(0)}K`;
        } else {
            return `$${amount.toLocaleString()}`;
        }
    }

    formatNumber(num) {
        return num.toLocaleString();
    }

    formatPercentage(num) {
        return `${num}%`;
    }
}

// Initialize ROI Calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize ROI Calculator
    window.roiCalculator = new ROICalculator();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    console.log('ROI Calculator loaded and initialized');
});