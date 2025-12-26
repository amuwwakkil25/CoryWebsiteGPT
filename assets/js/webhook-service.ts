export class WebhookService {
    // Use Netlify Function as proxy to avoid CORS issues
    private static webhookUrl = '/api/webhook';

    // Map interest keys to display values
    private static interestMap: Record<string, string> = {
        'NonProfit': 'Non Profit - Educating in AI',
        'Cory': 'Implementing Cory in your Organization',
        'AI_Roadmap': 'AI Transformation Roadmap',
        'CustomAI': 'Custom AI Solutions'
    };

    static async sendDemoRequest(formData: any): Promise<void> {
        const interestKey = formData.interest_area || '';
        const interestValue = this.interestMap[interestKey] || interestKey;

        const payload = {
            first_name: formData.first_name || '',
            last_name: formData.last_name || '',
            email_address: formData.email || '',
            phone_number: formData.phone || '',
            institution_organization: formData.institution || '',
            what_are_you_most_interested_in_key: interestKey,
            what_are_you_most_interested_in_value: interestValue,
            interest_description: formData.interest_details || '',
            occupation_role: formData.occupation || '',
            marketing_text_consent: formData.marketing_consent === 'on' ? 'true' : 'false'
        };

        try {
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Webhook failed with status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Webhook sent successfully:', payload, 'Response:', result);
        } catch (error) {
            console.error('Error sending webhook:', error);
            // Don't throw - allow form submission to succeed even if webhook fails
            console.warn('Webhook failed but form submission will continue');
        }
    }

    static async sendTestWebhook(): Promise<void> {
        const testPayload = {
            first_name: "John",
            last_name: "Smith",
            email_address: "john.smith@example.com",
            phone_number: "+1 (555) 123-4567",
            institution_organization: "ABC University",
            what_are_you_most_interested_in_key: "AI_Roadmap",
            what_are_you_most_interested_in_value: "AI Transformation Roadmap",
            interest_description: "I'm looking to implement AI solutions across our organization to improve efficiency in our data analysis processes and automate routine tasks.",
            occupation_role: "Data Analyst",
            marketing_text_consent: "true"
        };

        try {
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testPayload)
            });

            if (!response.ok) {
                throw new Error(`Test webhook failed with status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Test webhook sent successfully:', testPayload, 'Response:', result);
        } catch (error) {
            console.error('Error sending test webhook:', error);
            console.warn('Webhook failed but continuing');
        }
    }
}
