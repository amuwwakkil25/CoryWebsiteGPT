# Webhook Integration Setup

## Configuration

The demo form is configured to send webhook calls when submitted. To enable this functionality:

1. Add your webhook URL to the `.env` file:
```
VITE_WEBHOOK_URL=https://your-webhook-url.com/endpoint
```

2. Rebuild the project:
```bash
npm run build
```

## Webhook Payload Format

When a form is submitted, the following JSON payload will be sent via POST request:

```json
{
  "first_name": "John",
  "last_name": "Smith",
  "email_address": "john.smith@example.com",
  "phone_number": "+1 (555) 123-4567",
  "institution_organization": "ABC University",
  "what_are_you_most_interested_in": "AI Transformation Roadmap",
  "please_describe_your_specific_interests_in_detail": "I'm looking to implement AI solutions across our organization to improve efficiency in our data analysis processes and automate routine tasks.",
  "occupation_role": "Data Analyst",
  "marketing_text_consent": "true"
}
```

## Testing the Webhook

### Method 1: Browser Console
After the site loads, open your browser console and run:
```javascript
WebhookService.sendTestWebhook()
```

This will send a test payload to your configured webhook URL.

### Method 2: Fill Out the Form
Simply fill out the demo form on the `/demo-and-pricing.html` page and submit it. The webhook will be triggered automatically.

## Field Mapping

The following form fields are mapped to webhook payload fields:

| Form Field | Webhook Field |
|------------|---------------|
| First Name | first_name |
| Last Name | last_name |
| Email Address | email_address |
| Phone Number | phone_number |
| Institution/Organization | institution_organization |
| What are you most interested in? | what_are_you_most_interested_in |
| Interest Details | please_describe_your_specific_interests_in_detail |
| Occupation/Role | occupation_role |
| Marketing Consent Checkbox | marketing_text_consent |

## Notes

- If `VITE_WEBHOOK_URL` is not configured, the webhook calls will be skipped and a warning will be logged to the console
- The webhook service handles errors gracefully and will log them to the console
- Both the main demo form and the custom AI consultation modal use the same webhook endpoint
