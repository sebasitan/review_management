export async function sendAlert({ type, recipient, content }: { type: 'EMAIL' | 'SMS', recipient: string, content: string }) {
    // Simulated alerting logic
    console.log(`[ALERT_SENT] Type: ${type}, Recipient: ${recipient}, Content: ${content}`);

    // Future: Integrate with SendGrid or Twilio
    // if (type === 'EMAIL') await sendgrid.send({...});
    // if (type === 'SMS') await twilio.messages.create({...});

    return true;
}
