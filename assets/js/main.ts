// Main JavaScript for Agent Cory Marketing Site
import { WebhookService } from './webhook-service';

// Global state
let leadBus = {
    leads: [],
    addLead: function(lead) {
        this.leads.push(lead);
        this.notifyChat(lead);
    },
    notifyChat: function(lead) {
        // Simulate chat notification after form submission
        setTimeout(() => {
            if (window.chatWidget && window.chatWidget.isOpen()) {
                window.chatWidget.addMessage('bot', `Hi ${lead.name}! I see you just submitted a form. I'm here to help answer any questions about Agent Cory.`);
            }
        }, 2000);
    }
};

// Chat Widget Implementation
class ChatWidget {
    constructor() {
        // Chat widget is now handled by LeadConnector
        console.log('Chat widget replaced with LeadConnector')
    }

    isOpen() {
        // Legacy method for compatibility
        return false
    }



    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus first input
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    addMessage(type, content) {
        // Legacy method for compatibility with leadBus
        console.log(`Chat message (${type}): ${content}`)
    }

    // Bind modal events since we removed the main chat widget events
    bindModalEvents() {
        const closeButtons = document.querySelectorAll('.modal-close');
        
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });
    }

    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset forms
        const forms = modal.querySelectorAll('form');
        forms.forEach(form => form.reset());
        
        // Hide success messages
        const successDivs = modal.querySelectorAll('[id$="-success"]');
        successDivs.forEach(div => div.style.display = 'none');
        
        // Show forms
        const formDivs = modal.querySelectorAll('form');
        formDivs.forEach(div => div.style.display = 'block');
    }
}

// ROI Calculator Implementation
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

// Form Handler Implementation
class FormHandler {
    constructor() {
        this.init();
    }

    init() {
        this.bindForms();
    }

    bindForms() {
        // Demo request form
        const demoForm = document.getElementById('demo-request-form');
        if (demoForm) {
            demoForm.addEventListener('submit', (e) => this.handleDemoForm(e));
        }

        // Custom AI form
        const customAIForm = document.getElementById('custom-ai-form');
        if (customAIForm) {
            customAIForm.addEventListener('submit', (e) => this.handleCustomAIForm(e));
        }

        // Call demo form (existing)
        const callForm = document.getElementById('call-demo-form');
        if (callForm) {
            callForm.addEventListener('submit', (e) => this.handleCallForm(e));
        }

        // Lead magnet form (existing)
        const magnetForm = document.getElementById('lead-magnet-form');
        if (magnetForm) {
            magnetForm.addEventListener('submit', (e) => this.handleMagnetForm(e));
        }

        // Custom time field toggle
        const callTimeSelect = document.getElementById('call-time');
        const customTimeGroup = document.getElementById('custom-time-group');
        if (callTimeSelect && customTimeGroup) {
            callTimeSelect.addEventListener('change', (e) => {
                customTimeGroup.style.display = e.target.value === 'custom' ? 'block' : 'none';
            });
        }
    }

    handleDemoForm(e) {
        e.preventDefault();

        if (!this.validateForm(e.target)) {
            return;
        }

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        // Check honeypot
        if (data.website) {
            return;
        }

        // Get properly formatted phone number from intl-tel-input
        if ((window as any).demoPhoneIti) {
            data.phone = (window as any).demoPhoneIti.getNumber();
        }

        // Save to Supabase
        this.saveDemoRequest(data);
    }

    async saveDemoRequest(data) {
        try {
            // Send webhook
            await WebhookService.sendDemoRequest(data);

            console.log('Demo request sent to webhook:', data);

            // Show success message
            document.getElementById('demo-request-form').style.display = 'none';
            const successElement = document.getElementById('demo-success');
            successElement.style.display = 'block';

            // Scroll to the success message to show "Grab Your Phone"
            successElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Add to lead bus for chat integration
            leadBus.addLead({
                type: 'demo',
                name: `${data.first_name} ${data.last_name}`,
                email: data.email,
                institution: data.institution,
                timestamp: new Date()
            });

        } catch (error) {
            console.error('Error saving demo request:', error);
            this.showToast('Error submitting request. Please try again.', 'error');
        }
    }

    async handleCustomAIForm(e) {
        e.preventDefault();

        if (!this.validateForm(e.target)) {
            return;
        }

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        // Check honeypot
        if (data.website) {
            return;
        }

        // Get properly formatted phone number from intl-tel-input
        if ((window as any).customPhoneIti) {
            data.phone = (window as any).customPhoneIti.getNumber();
        }

        try {
            // Send webhook
            await WebhookService.sendDemoRequest(data);

            console.log('Custom AI request sent to webhook:', data);

            // Show success message
            e.target.style.display = 'none';
            document.getElementById('custom-ai-success').style.display = 'block';

        } catch (error) {
            console.error('Error saving custom AI request:', error);
            this.showToast('Error submitting request. Please try again.', 'error');
        }
    }

    handleCallForm(e) {
        e.preventDefault();
        
        if (!this.validateForm(e.target)) {
            return;
        }

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Check honeypot
        if (data.website) {
            return;
        }

        // Simulate API call
        console.log('Call demo request:', data);
        console.log('POST /api/call-demo', data);

        // Simulate call trigger
        this.triggerDemoCall(data);

        // Add to lead bus
        leadBus.addLead({
            type: 'call-demo',
            name: data.name,
            phone: data.phone,
            timestamp: new Date()
        });

        // Show success
        e.target.style.display = 'none';
        document.getElementById('call-success').style.display = 'block';

        // Show calling toast
        this.showToast('Cory is calling you now...', 'info');
    }

    handleMagnetForm(e) {
        e.preventDefault();
        
        if (!this.validateForm(e.target)) {
            return;
        }

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Check honeypot
        if (data.website) {
            return;
        }

        // Simulate API call
        console.log('Lead magnet request:', data);
        console.log('POST /api/lead-magnet', data);

        // Add to lead bus
        leadBus.addLead({
            type: 'lead-magnet',
            name: data.name,
            email: data.email,
            resourceId: data.resourceId,
            timestamp: new Date()
        });

        // Show success
        e.target.style.display = 'none';
        document.getElementById('magnet-success').style.display = 'block';
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            const formGroup = field.closest('.form-group');
            const errorDiv = formGroup?.querySelector('.form-error');
            
            if (!field.value.trim()) {
                isValid = false;
                formGroup?.classList.add('error');
                if (errorDiv) {
                    errorDiv.textContent = 'This field is required';
                }
            } else {
                formGroup?.classList.remove('error');
            }

            // Email validation
            if (field.type === 'email' && field.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    isValid = false;
                    formGroup?.classList.add('error');
                    if (errorDiv) {
                        errorDiv.textContent = 'Please enter a valid email address';
                    }
                }
            }

            // Phone validation using intl-tel-input
            if (field.type === 'tel' && field.value) {
                let phoneIsValid = false;

                // Try to get the appropriate intl-tel-input instance
                if (field.id === 'demo-phone' && (window as any).demoPhoneIti) {
                    phoneIsValid = (window as any).demoPhoneIti.isValidNumber();
                } else if (field.id === 'custom-phone' && (window as any).customPhoneIti) {
                    phoneIsValid = (window as any).customPhoneIti.isValidNumber();
                } else {
                    // Fallback validation if intl-tel-input is not available
                    const cleanPhone = field.value.replace(/\D/g, '');
                    phoneIsValid = cleanPhone.length >= 10;
                }

                if (!phoneIsValid) {
                    isValid = false;
                    formGroup?.classList.add('error');
                    if (errorDiv) {
                        errorDiv.textContent = 'Please enter a valid phone number';
                    }
                }
            }
        });

        return isValid;
    }

    triggerDemoCall(payload) {
        // Stub function for demo call integration
        // In production, this would integrate with Twilio or similar
        console.log('Triggering demo call with payload:', payload);
        
        // Simulate call delay
        setTimeout(() => {
            console.log('Demo call initiated to:', payload.phone);
        }, 1000);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--brand);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Navigation Handler
class NavigationHandler {
    constructor() {
        this.init();
    }

    init() {
        this.bindNavToggle();
        this.bindSmoothScroll();
        this.updateActiveNav();
        this.bindStickyHeader();
        this.bindDropdown();
    }

    bindNavToggle() {
        const toggle = document.querySelector('.nav-toggle');
        const menu = document.querySelector('.nav-menu');

        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                menu.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                    toggle.classList.remove('active');
                    menu.classList.remove('active');
                }
            });
        }
    }

    bindStickyHeader() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    bindDropdown() {
        const dropdown = document.querySelector('.nav-dropdown');
        const dropdownToggle = document.querySelector('.nav-dropdown-toggle');

        if (!dropdown || !dropdownToggle) return;

        // Toggle on click (mobile/touch)
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isExpanded = dropdown.getAttribute('aria-expanded') === 'true';
            dropdown.setAttribute('aria-expanded', !isExpanded);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.setAttribute('aria-expanded', 'false');
            }
        });

        // Close dropdown when menu item is clicked
        const dropdownLinks = dropdown.querySelectorAll('.nav-dropdown-link');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', () => {
                dropdown.setAttribute('aria-expanded', 'false');
            });
        });
    }

    bindSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Custom AI buttons - scroll to demo form and pre-select Custom AI Solutions
        const customAIButtons = document.querySelectorAll('[id*="custom-ai"]');
        customAIButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Find the demo form section
                const demoForm = document.getElementById('demo-request-form');
                if (demoForm) {
                    // Pre-select "Custom AI Solutions" in the interest dropdown
                    const interestSelect = document.getElementById('demo-interest');
                    if (interestSelect) {
                        interestSelect.value = 'custom-ai';
                        // Add visual highlight to show it was pre-selected
                        interestSelect.style.backgroundColor = '#e3f2fd';
                        setTimeout(() => {
                            interestSelect.style.backgroundColor = '';
                        }, 2000);
                    }

                    // Scroll to the form smoothly
                    demoForm.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Focus the first input after scrolling
                    setTimeout(() => {
                        const firstInput = demoForm.querySelector('input[type="text"]');
                        if (firstInput) {
                            firstInput.focus();
                        }
                    }, 500);
                }
            });
        });

        // AI Roadmap Assessment button - navigate to demo page with pre-selected option
        const assessmentButton = document.getElementById('free-assessment-btn');
        if (assessmentButton) {
            assessmentButton.addEventListener('click', () => {
                // Navigate to demo page with query parameter
                window.location.href = '/demo-and-pricing.html?interest=ai-transformation';
            });
        }
    }

    updateActiveNav() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPath || 
                (currentPath === '/' && link.getAttribute('href') === '/')) {
                link.classList.add('active');
            }
        });
    }
}

// Accordion Handler
class AccordionHandler {
    constructor() {
        this.init();
    }

    init() {
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => this.toggleAccordion(header));
        });

        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => this.toggleFAQ(question));
        });
    }

    toggleAccordion(header) {
        const item = header.closest('.accordion-item');
        const content = item.querySelector('.accordion-content');
        const isActive = item.classList.contains('active');

        // Close all other accordion items
        const allItems = document.querySelectorAll('.accordion-item');
        allItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle current item
        if (isActive) {
            item.classList.remove('active');
        } else {
            item.classList.add('active');
        }
    }

    toggleFAQ(question) {
        const item = question.closest('.faq-item');
        const isActive = item.classList.contains('active');

        if (isActive) {
            item.classList.remove('active');
        } else {
            item.classList.add('active');
        }
    }
}

// Resource Filter Handler
class ResourceFilter {
    constructor() {
        this.init();
    }

    init() {
        const topicFilter = document.getElementById('topic-filter');
        const formatFilter = document.getElementById('format-filter');
        const clearButton = document.getElementById('clear-filters');

        if (topicFilter) {
            topicFilter.addEventListener('change', () => this.filterResources());
        }

        if (formatFilter) {
            formatFilter.addEventListener('change', () => this.filterResources());
        }

        if (clearButton) {
            clearButton.addEventListener('click', () => this.clearFilters());
        }
    }

    filterResources() {
        const topicFilter = document.getElementById('topic-filter');
        const formatFilter = document.getElementById('format-filter');
        const resources = document.querySelectorAll('.resource-card');

        const selectedTopic = topicFilter?.value || 'all';
        const selectedFormat = formatFilter?.value || 'all';

        resources.forEach(resource => {
            const topic = resource.dataset.topic;
            const format = resource.dataset.format;

            const topicMatch = selectedTopic === 'all' || topic === selectedTopic;
            const formatMatch = selectedFormat === 'all' || format === selectedFormat;

            if (topicMatch && formatMatch) {
                resource.style.display = 'flex';
            } else {
                resource.style.display = 'none';
            }
        });
    }

    clearFilters() {
        const topicFilter = document.getElementById('topic-filter');
        const formatFilter = document.getElementById('format-filter');
        const resources = document.querySelectorAll('.resource-card');

        if (topicFilter) topicFilter.value = 'all';
        if (formatFilter) formatFilter.value = 'all';

        resources.forEach(resource => {
            resource.style.display = 'flex';
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    window.chatWidget = new ChatWidget();
    window.chatWidget.bindModalEvents();
    window.roiCalculator = new ROICalculator();
    window.formHandler = new FormHandler();
    window.navigationHandler = new NavigationHandler();
    window.accordionHandler = new AccordionHandler();
    window.resourceFilter = new ResourceFilter();

    // Make WebhookService available globally for testing
    (window as any).WebhookService = WebhookService;

    // Check for URL parameters to pre-populate form
    const urlParams = new URLSearchParams(window.location.search);
    const interestParam = urlParams.get('interest');

    if (interestParam) {
        const demoInterestSelect = document.getElementById('demo-interest') as HTMLSelectElement;
        if (demoInterestSelect) {
            demoInterestSelect.value = interestParam;
            // Add visual highlight to show it was pre-selected
            demoInterestSelect.style.backgroundColor = '#e3f2fd';
            setTimeout(() => {
                demoInterestSelect.style.backgroundColor = '';
            }, 2000);

            // Scroll to the form after a brief delay
            setTimeout(() => {
                const demoForm = document.getElementById('demo-request-form');
                if (demoForm) {
                    demoForm.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Focus the first input after scrolling
                    setTimeout(() => {
                        const firstInput = demoForm.querySelector('input[type="text"]') as HTMLElement;
                        if (firstInput) {
                            firstInput.focus();
                        }
                    }, 500);
                }
            }, 100);
        }
    }

    console.log('Agent Cory Marketing Site initialized');
    console.log('To send a test webhook, run: WebhookService.sendTestWebhook()');
});