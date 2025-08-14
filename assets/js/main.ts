// Main JavaScript for Agent Cory Marketing Site
import { WebsiteIntegration } from '../../src/utils/websiteIntegration.ts';
import { ROICalculator as DatabaseROICalculator } from '../../src/components/ROICalculator.ts';
import { DemoService } from '../../src/services/demoService.ts';

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

        // Save to Supabase
        this.saveDemoRequest(data);
    }

    async saveDemoRequest(data) {
        try {
            const demoRequest = {
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                phone: data.phone,
                institution: data.institution,
                occupation: data.occupation,
                request_type: 'demo',
                metadata: {
                    source: 'demo_page',
                    user_agent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                }
            };

            await DemoService.createDemoRequest(demoRequest);
            
            console.log('Demo request saved to database:', demoRequest);
            
            // Show success message
            document.getElementById('demo-request-form').style.display = 'none';
            document.getElementById('demo-success').style.display = 'block';
            
            // Add to lead bus for chat integration
            leadBus.addLead({
                type: 'demo',
                name: `${data.firstName} ${data.lastName}`,
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

        try {
            const customAIRequest = {
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                phone: data.phone,
                institution: data.institution,
                occupation: data.occupation,
                interest_area: data.interest,
                request_type: 'custom_ai',
                metadata: {
                    source: 'custom_ai_modal',
                    user_agent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                }
            };

            await DemoService.createDemoRequest(customAIRequest);
            
            console.log('Custom AI request saved to database:', customAIRequest);

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
        
        // Custom AI buttons
        const customAIButtons = document.querySelectorAll('[id*="custom-ai"]');
        customAIButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.chatWidget) {
                    window.chatWidget.openModal('custom-ai-modal');
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
        const resources = document.querySelectorAll('.resource-card');

        if (topicFilter) topicFilter.value = 'all';
        if (formatFilter) formatFilter.value = 'all';

        resources.forEach(resource => {
            resource.style.display = 'flex';
        });
    }
}

// Cookie Banner Handler
class CookieBanner {
    constructor() {
        this.init();
    }

    init() {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('accept-cookies');
        
        if (!localStorage.getItem('cookies-accepted')) {
            setTimeout(() => {
                if (banner) banner.style.display = 'block';
            }, 2000);
        }
        
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                localStorage.setItem('cookies-accepted', 'true');
                if (banner) banner.style.display = 'none';
            });
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize website integration
        const websiteIntegration = new WebsiteIntegration();
        await websiteIntegration.initialize();
        
        // Initialize components
        window.chatWidget = new ChatWidget();
        window.roiCalculator = new ROICalculator();
        window.formHandler = new FormHandler();
        window.navigationHandler = new NavigationHandler();
        window.accordionHandler = new AccordionHandler();
        window.resourceFilter = new ResourceFilter();
        window.cookieBanner = new CookieBanner();
        
        // Make leadBus globally available
        window.leadBus = leadBus;
        
        console.log('Agent Cory website initialized successfully');
        
    } catch (error) {
        console.error('Error initializing website:', error);
        
        // Fallback initialization without database
        window.chatWidget = new ChatWidget();
        window.roiCalculator = new ROICalculator();
        window.formHandler = new FormHandler();
        window.navigationHandler = new NavigationHandler();
        window.accordionHandler = new AccordionHandler();
        window.resourceFilter = new ResourceFilter();
        window.cookieBanner = new CookieBanner();
        
        console.log('Website initialized in fallback mode');
    }
});