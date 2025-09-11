import twilio from 'twilio';

// Lazy-loaded Twilio client to prevent server crash on startup
let client: ReturnType<typeof twilio> | null = null;

function getTwilioClient() {
  if (!client) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      throw new Error('Twilio credentials are required. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER environment variables.');
    }

    client = twilio(accountSid, authToken);
  }
  
  return client;
}

function getTwilioPhoneNumber(): string {
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
  if (!twilioPhoneNumber) {
    throw new Error('TWILIO_PHONE_NUMBER environment variable is required');
  }
  return twilioPhoneNumber;
}

// Tamil voice message for service completion
const TAMIL_COMPLETION_MESSAGE = `
<Response>
  <Say voice="alice" language="ta">
    Ungal vahanathin sevai muzhuvadhum mudinthulladhu. 
    Idhu ippodhu Smart Cars-il eduththu pogavum thayaaraga ulladhu. 
    Anbudan, Smart Cars.
  </Say>
</Response>
`;

export interface VoiceCallOptions {
  to: string;
  bookingId: string;
  vehicleInfo?: string;
}

// Basic phone number validation
function validatePhoneNumber(phone: string): boolean {
  // Basic validation - should start with + and contain 10-15 digits
  const phoneRegex = /^\+[1-9]\d{9,14}$/;
  return phoneRegex.test(phone);
}

export async function makeCompletionVoiceCall(options: VoiceCallOptions): Promise<boolean> {
  try {
    // Validate phone number format
    if (!validatePhoneNumber(options.to)) {
      console.error(`Invalid phone number format for booking ${options.bookingId}`);
      return false;
    }

    // Check if Twilio is configured
    try {
      const twilioClient = getTwilioClient();
      const fromNumber = getTwilioPhoneNumber();
      
      console.log(`Making voice call for booking ${options.bookingId}`);
      
      // Create TwiML for the voice call
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="ta">
    Ungal vahanathin sevai muzhuvadhum mudinthulladhu. 
    Idhu ippodhu Smart Cars-il eduththu pogavum thayaaraga ulladhu. 
    Anbudan, Smart Cars.
  </Say>
</Response>`;

      const call = await twilioClient.calls.create({
        to: options.to,
        from: fromNumber,
        twiml: twiml,
      });

      console.log(`Voice call initiated successfully for booking ${options.bookingId}. Call SID: ${call.sid}`);
      return true;
    } catch (configError) {
      console.warn('Twilio not configured - skipping voice call for booking', options.bookingId, ':', (configError as Error).message);
      return false;
    }
  } catch (error) {
    console.error('Error making voice call for booking', options.bookingId, ':', error);
    return false;
  }
}

export default {
  makeCompletionVoiceCall,
};