export class WebhookService {
    private static webhookUrl = import.meta.env.VITE_WEBHOOK_URL || '';

    static async sendDemoRequest(formData: any): Promise<void> {
        if (!this.webhookUrl) {
            console.warn('Webhook URL not configured. Skipping webhook call.');
            return;
        }

        const payload = {
            first_name: formData.first_name || '',
            last_name: formData.last_name || '',
            email_address: formData.email || '',
            phone_number: formData.phone || '',
            institution_organization: formData.institution || '',
            what_are_you_most_interested_in: formData.interest_area || '',
            please_describe_your_specific_interests_in_detail: formData.interest_details || '',
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

            console.log('Webhook sent successfully:', payload);
        } catch (error) {
            console.error('Error sending webhook:', error);
            throw error;
        }
    }

    static async sendTestWebhook(): Promise<void> {
        const testPayload = {
            first_name: "John",
            last_name: "Smith",
            email_address: "john.smith@example.com",
            phone_number: "+1 (555) 123-4567",
            institution_organization: "ABC University",
            what_are_you_most_interested_in: "AI Transformation Roadmap",
            please_describe_your_specific_interests_in_detail: "I'm looking to implement AI solutions across our organization to improve efficiency in our data analysis processes and automate routine tasks.",
            occupation_role: "Data Analyst",
            marketing_text_consent: "true"
        };

        if (!this.webhookUrl) {
            console.warn('Webhook URL not configured. Test payload:', testPayload);
            return;
        }

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

            console.log('Test webhook sent successfully:', testPayload);
        } catch (error) {
            console.error('Error sending test webhook:', error);
            throw error;
        }
    }
}
