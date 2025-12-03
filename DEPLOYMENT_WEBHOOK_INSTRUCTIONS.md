# Webhook Deployment Instructions

## What Was Done

The webhook integration is now fully implemented in your demo form. When users submit the form, it will automatically send their information to your Zapier webhook.

## Files Modified

1. **assets/js/webhook-service.ts** - New file that handles webhook calls
2. **assets/js/main.ts** - Updated to import and use the webhook service
3. **.env** - Added `VITE_WEBHOOK_URL` configuration
4. **netlify.toml** - Added `VITE_WEBHOOK_URL` to build environment
5. **dist/** - Rebuilt with webhook URL embedded

## Deployment Steps

### Option 1: Deploy via Git Push (Recommended)

If you push these changes to your Git repository, Netlify will automatically:
1. Detect the changes
2. Run `npm run build`
3. Use the `VITE_WEBHOOK_URL` from `netlify.toml`
4. Deploy the updated site with webhook functionality

### Option 2: Manual Deployment

If you need to deploy manually:

1. The `dist/` folder is already built with the webhook URL
2. Upload the contents of `dist/` to your hosting provider
3. The webhook will work immediately

### Option 3: Set Environment Variable in Netlify Dashboard

For better security (recommended for production):

1. Go to Netlify Dashboard → Your Site → Site Settings → Environment Variables
2. Add a new environment variable:
   - **Key**: `VITE_WEBHOOK_URL`
   - **Value**: `https://hooks.zapier.com/hooks/catch/2937706/ukqlrbi/`
3. Trigger a manual deploy in Netlify

**Note**: Netlify Dashboard environment variables take precedence over `netlify.toml` values.

## Testing the Integration

### Method 1: Live Form Submission

1. Go to your deployed site's demo page: `https://yoursite.com/demo-and-pricing.html`
2. Fill out the form with these test values:
   - First Name: Ali
   - Last Name: Muwwakkil
   - Email: ali_muwwakkil@hotmail.com
   - Phone: 16825975784
   - Institution: Colaberry
   - Interest: "Implementing Cory in your Organization"
   - Details: "I'm very intrigued with this so tell me more."
   - Occupation: "Admissions Counselor"
3. Submit the form
4. Check your Zapier dashboard to see the incoming data

### Method 2: Browser Console Test

1. Open your deployed site
2. Open browser developer console (F12)
3. Run: `WebhookService.sendTestWebhook()`
4. Check console for success message and Zapier for incoming data

## Webhook Payload Format

The webhook sends this JSON structure:

```json
{
  "first_name": "Ali",
  "last_name": "Muwwakkil",
  "email_address": "ali_muwwakkil@hotmail.com",
  "phone_number": "16825975784",
  "institution_organization": "Colaberry",
  "what_are_you_most_interested_in": "Implementing Cory in your Organization",
  "please_describe_your_specific_interests_in_detail": "I'm very intrigued with this so tell me more.",
  "occupation_role": "Admissions Counselor",
  "marketing_text_consent": "true"
}
```

## Troubleshooting

### Webhook Not Firing

1. **Check Browser Console**: Open developer tools and look for errors
2. **Verify Environment Variable**: Run `console.log(import.meta.env.VITE_WEBHOOK_URL)` in browser console
3. **Check Network Tab**: Look for POST requests to zapier.com
4. **Rebuild**: Ensure you've rebuilt the project after adding the webhook URL

### CORS Errors

Zapier webhooks should not have CORS issues. If you see CORS errors:
1. Verify the webhook URL is correct
2. Check your Zapier webhook is active and accepting requests

### Form Not Submitting

1. **Check Required Fields**: Ensure all required fields are filled
2. **Check Console Errors**: Look for validation errors
3. **Verify Form Names**: Field names should match the webhook mapping

## Security Note

The webhook URL is embedded in the client-side JavaScript, which is normal for webhooks. However, you can:

1. Set up authentication in Zapier to validate incoming requests
2. Use Netlify Functions as a proxy (more advanced) to hide the webhook URL
3. Monitor your Zapier webhook for suspicious activity

## Next Steps

After deployment:

1. Test the form on your live site
2. Configure your Zapier workflow to handle the incoming data
3. Connect Zapier to your CRM or email system
4. Monitor the webhook for successful submissions

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify the webhook URL in Zapier is active
3. Test the webhook directly using curl (see WEBHOOK_SETUP.md)
