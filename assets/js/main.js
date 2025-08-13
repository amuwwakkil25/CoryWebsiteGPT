// Main JavaScript for Agent Cory Marketing Site
import { WebsiteIntegration } from '../../src/utils/websiteIntegration.ts'
import { ROICalculator as DatabaseROICalculator } from '../../src/components/ROICalculator.ts'

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
        this.isActive = false;
        this.messages = [];
        this.responses = {
            "how do you work?": "Great question! Agent Cory works by instantly engaging new inquiries through AI-powered phone calls, SMS, and email. We qualify leads, answer common questions, and book appointments with your counselors. The whole process happens in under 60 seconds!",
            "do you integrate with crm systems?": "Yes! We have native integrations with Slate, Salesforce Education Cloud, and Ellucian Banner. We also support custom API connections and can integrate with most CRM/SIS systems through Zapier.",
            "schedule a demo": "I'd love to help you schedule a demo! Let me connect you with our team. You can book a time that works for you at the demo page, or I can have someone call you directly.",
            "what's your pricing?": "Our pricing starts at $497/month for up to 500 inquiries. We have flexible plans that scale with your volume. Would you like me to connect you with our team for a custom quote based on your needs?",
            "how fast do you respond?": "We respond to new inquiries in under 60 seconds - that's our guarantee! Most responses happen within 30 seconds. Speed is crucial for conversion, and that's where we really shine.",
            "what results can i expect?": "Our clients typically see 90-95% contact rates (vs 40-50% industry average), 25-30% improvement in conversion rates, and 80-90% reduction in manual outreach time. Many achieve 5-10x ROI in the first year!"
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupQuickReplies();
    }

    bindEvents() {
        const toggle = document.getElementById('chat-toggle');
        const sendBtn = document.getElementById('chat-send');
        const input = document.getElementById('chat-input-field');
        const closeButtons = document.querySelectorAll('.modal-close');

        if (toggle) {
            toggle.addEventListener('click', () => this.toggle());
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // Close modals when clicking close button
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

    setupQuickReplies() {
        const quickReplies = document.querySelectorAll('.quick-reply');
        quickReplies.forEach(reply => {
            reply.addEventListener('click', (e) => {
                const message = e.target.dataset.message;
                this.sendUserMessage(message);
                this.hideQuickReplies();
            });
        });
    }

    toggle() {
        const widget = document.getElementById('chat-widget');
        this.isActive = !this.isActive;
        
        if (this.isActive) {
            widget.classList.add('active');
            document.getElementById('chat-input-field').focus();
        } else {
            widget.classList.remove('active');
        }
    }

    isOpen() {
        return this.isActive;
    }

    sendMessage() {
        const input = document.getElementById('chat-input-field');
        const message = input.value.trim();
        
        if (message) {
            this.sendUserMessage(message);
            input.value = '';
            this.hideQuickReplies();
        }
    }

    sendUserMessage(message) {
        this.addMessage('user', message);
        
        // Simulate typing delay
        setTimeout(() => {
            const response = this.getResponse(message.toLowerCase());
            this.addMessage('bot', response);
        }, 1000);
    }

    addMessage(type, content) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const p = document.createElement('p');
        p.textContent = content;
        messageDiv.appendChild(p);
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.messages.push({ type, content, timestamp: new Date() });
    }

    getResponse(message) {
        // Check for exact matches first
        for (const [key, response] of Object.entries(this.responses)) {
            if (message.includes(key)) {
                return response;
            }
        }

        // Check for keywords
        if (message.includes('price') || message.includes('cost') || message.includes('pricing')) {
            return this.responses["what's your pricing?"];
        }
        
        if (message.includes('demo') || message.includes('meeting') || message.includes('call')) {
            return this.responses["schedule a demo"];
        }
        
        if (message.includes('fast') || message.includes('quick') || message.includes('speed') || message.includes('time')) {
            return this.responses["how fast do you respond?"];
        }
        
        if (message.includes('result') || message.includes('roi') || message.includes('outcome')) {
            return this.responses["what results can i expect?"];
        }

        if (message.includes('integrate') || message.includes('crm') || message.includes('slate') || message.includes('salesforce')) {
            return this.responses["do you integrate with crm systems?"];
        }

        // Default responses
        const defaultResponses = [
            "That's a great question! I'd recommend booking a demo with our team to get detailed answers specific to your situation. Would you like me to help you schedule one?",
            "I'd love to help you with that! For the most accurate information, I'd suggest speaking with one of our admissions experts. Shall I connect you with someone?",
            "Thanks for asking! While I can help with basic questions, our team can provide much more detailed insights. Would you like to schedule a quick call?"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    hideQuickReplies() {
        const quickReplies = document.getElementById('chat-quick-replies');
        if (quickReplies) {
            quickReplies.style.display = 'none';
        }
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
        // Initialize database-powered calculator
        this.databaseCalculator = new DatabaseROICalculator();
        this.init();
    }

    init() {
        // The database calculator handles all the binding and calculation
        // This class now just provides backward compatibility
        console.log('ROI Calculator initialized with database integration');
    }

    // Provide access to database calculator for external use
    getDatabaseCalculator() {
        return this.databaseCalculator;
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

        // Call demo form
        const callForm = document.getElementById('call-demo-form');
        if (callForm) {
            callForm.addEventListener('submit', (e) => this.handleCallForm(e));
        }

        // Lead magnet form
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

        // Simulate API call
        console.log('Demo request:', data);
        console.log('POST /api/demo-request', data);

        // Add to lead bus
        leadBus.addLead({
            type: 'demo',
            name: data.name,
            email: data.email,
            organization: data.organization,
            timestamp: new Date()
        });

        // Show success
        e.target.style.display = 'none';
        document.getElementById('demo-success').style.display = 'block';
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

            // Phone validation
            if (field.type === 'tel' && field.value) {
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                const cleanPhone = field.value.replace(/\D/g, '');
                if (cleanPhone.length < 10) {
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

        if (topicFilter) topicFilter.value = 'all';
        if (formatFilter) formatFilter.value = 'all';

        this.filterResources();
    }
}

// Pricing Toggle Handler
class PricingToggle {
    constructor() {
        this.init();
    }

    init() {
        const toggle = document.getElementById('pricing-toggle');
        if (toggle) {
            toggle.addEventListener('change', () => this.togglePricing(toggle.checked));
        }
    }

    togglePricing(isAnnual) {
        const monthlyPrices = document.querySelectorAll('.price-amount.monthly');
        const annualPrices = document.querySelectorAll('.price-amount.annual');

        if (isAnnual) {
            monthlyPrices.forEach(price => price.style.display = 'none');
            annualPrices.forEach(price => price.style.display = 'inline');
        } else {
            monthlyPrices.forEach(price => price.style.display = 'inline');
            annualPrices.forEach(price => price.style.display = 'none');
        }
    }
}

// Cookie Banner Handler
class CookieBanner {
    constructor() {
        this.init();
    }

    init() {
        // Show banner if no consent cookie exists
        if (!this.getCookie('cookie-consent')) {
            setTimeout(() => {
                const banner = document.getElementById('cookie-banner');
                if (banner) {
                    banner.style.display = 'block';
                }
            }, 2000);
        }

        // Bind accept button
        const acceptBtn = document.getElementById('accept-cookies');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.acceptCookies());
        }
    }

    acceptCookies() {
        this.setCookie('cookie-consent', 'accepted', 365);
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'none';
        }
    }

    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
}

// Global Button Handlers
class ButtonHandlers {
    constructor() {
        this.init();
    }

    init() {
        this.bindCTAButtons();
        this.bindResourceButtons();
    }

    bindCTAButtons() {
        // Try Cory Now buttons
        const tryCoryButtons = document.querySelectorAll('[id*="try-cory"], [id*="demo-cory"], .nav-cta');
        tryCoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.chatWidget) {
                    window.chatWidget.toggle();
                }
            });
        });

        // Request Call buttons
        const callButtons = document.querySelectorAll('[id*="request-call"], [id*="demo-call"]');
        callButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.chatWidget) {
                    window.chatWidget.openModal('call-modal');
                }
            });
        });

        // Chat demo buttons
        const chatButtons = document.querySelectorAll('[id*="chat-demo"]');
        chatButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.chatWidget) {
                    window.chatWidget.toggle();
                }
            });
        });
        
        // Voice demo toggle button
        const voiceDemoToggle = document.getElementById('voice-demo-toggle');
        if (voiceDemoToggle) {
            voiceDemoToggle.addEventListener('click', () => {
                this.toggleVoiceDemo();
            });
        }
    }
    
    toggleVoiceDemo() {
        const container = document.getElementById('voice-demo-container');
        const button = document.getElementById('voice-demo-toggle');
        
        if (container && button) {
            const isVisible = container.style.display !== 'none';
            
            if (isVisible) {
                container.style.display = 'none';
                button.textContent = 'Try Voice Demo';
                button.classList.remove('btn-secondary');
                button.classList.add('btn-primary');
            } else {
                container.style.display = 'block';
                button.textContent = 'Close Voice Demo';
                button.classList.remove('btn-primary');
                button.classList.add('btn-secondary');
            }
        }
    }

    bindResourceButtons() {
        // Resource download buttons
        const resourceButtons = document.querySelectorAll('[data-resource-id]');
        resourceButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const resourceId = e.target.dataset.resourceId;
                this.handleResourceRequest(resourceId, e.target);
            });
        });
    }

    handleResourceRequest(resourceId, button) {
        // For lead magnets, open modal
        const leadMagnets = ['ai-guide', 'conversion-webinar', 'benchmarks-report', 'roi-toolkit'];
        
        if (leadMagnets.includes(resourceId)) {
            this.openLeadMagnetModal(resourceId);
        } else {
            // For regular resources, simulate download
            console.log('Downloading resource:', resourceId);
            button.textContent = 'Downloaded!';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = button.textContent.replace('Downloaded!', 'Download');
                button.disabled = false;
            }, 2000);
        }
    }

    openLeadMagnetModal(resourceId) {
        const modal = document.getElementById('lead-magnet-modal');
        const titleElement = document.getElementById('magnet-modal-title');
        const resourceIdInput = document.getElementById('magnet-resource-id');
        
        if (modal && titleElement && resourceIdInput) {
            // Set resource-specific content
            const resourceTitles = {
                'ai-guide': 'Download: The Complete Guide to AI in Admissions',
                'conversion-webinar': 'Register: 5 Strategies to Double Your Lead Conversion Rate',
                'benchmarks-report': 'Get Free Report: 2024 Admissions Benchmarks',
                'roi-toolkit': 'Download Toolkit: ROI Calculator + Implementation Guide'
            };
            
            titleElement.textContent = resourceTitles[resourceId] || 'Download Resource';
            resourceIdInput.value = resourceId;
            
            if (window.chatWidget) {
                window.chatWidget.openModal('lead-magnet-modal');
            }
        }
    }
}

// Intersection Observer for Animations
class AnimationObserver {
    constructor() {
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'fadeInUp 0.6s ease-out';
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe elements for animation
            const animateElements = document.querySelectorAll('.benefit-card, .demo-card, .testimonial-card, .feature-row, .case-study-card');
            animateElements.forEach(el => observer.observe(el));
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize database integration
    const websiteIntegration = new WebsiteIntegration()
    websiteIntegration.initialize().catch(console.error)
    
    // Initialize all components
    window.chatWidget = new ChatWidget();
    window.roiCalculator = new ROICalculator();
    window.formHandler = new FormHandler();
    window.navigationHandler = new NavigationHandler();
    window.accordionHandler = new AccordionHandler();
    window.resourceFilter = new ResourceFilter();
    window.pricingToggle = new PricingToggle();
    window.cookieBanner = new CookieBanner();
    window.buttonHandlers = new ButtonHandlers();
    window.animationObserver = new AnimationObserver();
    
    // Make website integration available globally
    window.websiteIntegration = websiteIntegration;
    
    // Add ROI calculator reset functionality
    const resetButton = document.getElementById('roi-reset-btn');
    if (resetButton) {
            this.bindInputs();
            this.bindSliders();
            
            // Calculate and display initial results
            await this.calculate();
            
            this.isInitialized = true;
            console.log('ROI Calculator initialized with database integration');
        } catch (error) {
            console.error('Failed to initialize ROI calculator:', error);
            // Fall back to local calculation
            this.bindInputs();
            this.bindSliders();
            this.calculate();
        }
    }

    async loadSavedCalculation() {
        try {
            // This would load from database in production
            const saved = localStorage.getItem('roi_calculation');
            if (saved) {
                const data = JSON.parse(saved);
                this.inputs = { ...this.inputs, ...data.user_inputs };
                this.updateInputFields();
            }
        } catch (error) {
            console.error('Error loading saved calculation:', error);
        }
    }

    updateInputFields() {
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
        };

        Object.entries(inputMappings).forEach(([elementId, inputKey]) => {
            const element = document.getElementById(elementId);
            if (element) {
                element.value = this.inputs[inputKey].toString();
            }
        });

        this.updateSliderDisplays();
    }

    updateSliderDisplays() {
        const sliderMappings = [
            { valueId: 'cory-contact-rate-value', key: 'coryContactRate', suffix: '%' },
            { valueId: 'response-uplift-value', key: 'responseUplift', prefix: '+', suffix: '%' },
            { valueId: 'automation-coverage-value', key: 'automationCoverage', suffix: '%' }
        ];

        sliderMappings.forEach(({ valueId, key, prefix = '', suffix = '' }) => {
            const valueElement = document.getElementById(valueId);
            if (valueElement) {
                const value = this.inputs[key];
                valueElement.textContent = `${prefix}${value}${suffix}`;
            }
        });
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
                element.addEventListener('input', async () => {
                    const value = parseFloat(element.value) || 0;
                    this.inputs[inputKey] = value;
                    await this.calculate();
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
                element.addEventListener('input', async () => {
                    const value = parseFloat(element.value);
                    this.inputs[key] = value;
                    
                    // Update display
                    valueElement.textContent = `${prefix}${value}${suffix}`;
                    
                    // Recalculate
                    await this.calculate();
                });
            }
        });
    }

    async calculate() {
        try {
            const results = this.calculateROI(this.inputs);
            
            // Save to localStorage (database integration would go here)
            localStorage.setItem('roi_calculation', JSON.stringify({
                user_inputs: this.inputs,
                calculated_results: results,
                updated_at: new Date().toISOString()
            }));
            
            // Update display
            this.updateResults(results);
            this.updateChart(results);
            
        } catch (error) {
            console.error('ROI calculation error:', error);
        }
    }

    calculateROI(inputs) {
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
        } = inputs;

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

        return {
            additionalApps,
            additionalEnrollments,
            tuitionLift,
            staffHoursSaved: annualSavedHours,
            annualROI,
            totalBenefit,
            platformCost,
            netBenefit,
            staffSavings
        };
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

    updateChart(results) {
        const chartContainer = document.querySelector('.roi-chart .chart-bars');
        if (!chartContainer) return;

        const maxValue = Math.max(results.tuitionLift, results.platformCost);
        const staffSavings = results.staffSavings || (results.staffHoursSaved * this.inputs.staffCost);

        const chartData = [
            {
                label: 'Tuition Revenue',
                value: results.tuitionLift,
                percentage: (results.tuitionLift / maxValue) * 100,
                formatted: this.formatCurrency(results.tuitionLift),
                positive: true
            },
            {
                label: 'Staff Cost Savings',
                value: staffSavings,
                percentage: (staffSavings / maxValue) * 100,
                formatted: this.formatCurrency(staffSavings),
                positive: true
            },
            {
                label: 'Platform Investment',
                value: results.platformCost,
                percentage: (results.platformCost / maxValue) * 100,
                formatted: `-${this.formatCurrency(results.platformCost)}`,
                positive: false
            }
        ];

        chartContainer.innerHTML = chartData.map(item => `
            <div class="chart-bar">
                <div class="bar-label">${item.label}</div>
                <div class="bar-visual ${item.positive ? '' : 'negative'}">
                    <div class="bar-fill" style="width: ${item.percentage}%; transition: width 0.5s ease-out;"></div>
                </div>
                <div class="bar-value">${item.formatted}</div>
            </div>
        `).join('');
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

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    console.log('Agent Cory marketing site initialized successfully!');
});

// Export for potential external use
window.AgentCory = {
    leadBus,
    sendToCory: function(query) {
        // Hook for external chat integration
        if (window.chatWidget) {
            window.chatWidget.sendUserMessage(query);
            window.chatWidget.toggle();
        }
    },
    triggerDemoCall: function(payload) {
        // Hook for external call integration
        if (window.formHandler) {
            return window.formHandler.triggerDemoCall(payload);
        }
    }
};
    // Public methods for external access
    getInputs() {
        return { ...this.inputs };
    }

    async updateInput(key, value) {
        this.inputs[key] = value;
        await this.calculate();
    }

    async resetToDefaults() {
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
        
        this.updateInputFields();
        await this.calculate();