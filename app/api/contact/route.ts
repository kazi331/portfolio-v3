import { NextRequest, NextResponse } from 'next/server';

function isHtmlContent(str: string): boolean {
  const trimmed = (str || '').trim();
  return (
    trimmed.startsWith('<') ||
    trimmed.includes('<html') ||
    trimmed.includes('<!DOCTYPE') ||
    trimmed.includes('<body')
  );
}

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown> = {};
    try {
      const contentType = req.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        body = await req.json();
      } else {
        const text = await req.text();
        body = text ? JSON.parse(text) : {};
      }
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON request payload. Please ensure request body is properly formatted JSON.',
        },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required fields.' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const serviceId = process.env.EMAILJS_SERVICE_ID?.trim();
    const templateId = process.env.EMAILJS_TEMPLATE_ID?.trim();
    const publicKey = (process.env.EMAILJS_PUBLIC_KEY || process.env.EMAILJS_USER_ID)?.trim();
    const privateKey = process.env.EMAILJS_PRIVATE_KEY?.trim();

    if (!serviceId || !templateId || !publicKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            'EmailJS credentials are not configured yet. Please configure EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, and EMAILJS_PUBLIC_KEY in your environment variables.',
          configured: false,
        },
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // EmailJS REST API payload
    const emailJsPayload: Record<string, unknown> = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        from_name: name,
        user_name: name,
        name,
        from_email: email,
        user_email: email,
        email,
        reply_to: email,
        subject: subject || 'New Portfolio Contact Submission',
        message,
         time: new Date().toLocaleString("en-US", {
          timeZone: "Asia/Dhaka",
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
    };

    if (privateKey) {
      emailJsPayload.accessToken = privateKey;
    }

    // Request with 15-second timeout to prevent hanging connections
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let response: Response;
    try {
      response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
        },
        body: JSON.stringify(emailJsPayload),
        signal: controller.signal,
      });
    } catch (networkError: unknown) {
      clearTimeout(timeoutId);
      const isTimeout = networkError instanceof Error && networkError.name === 'AbortError';
      console.error('EmailJS fetch network error:', networkError);
      return NextResponse.json(
        {
          success: false,
          error: isTimeout
            ? 'Connection to EmailJS timed out after 15 seconds. Please try again or reach out directly.'
            : 'Unable to connect to the EmailJS network. Please verify connection or try again later.',
        },
        { status: 504, headers: { 'Content-Type': 'application/json' } }
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const responseText = await response.text();
      console.error('EmailJS API error response:', response.status, responseText);

      let cleanError = '';

      // Check if EmailJS or Cloudflare proxy returned an HTML error document
      if (isHtmlContent(responseText)) {
        cleanError = `EmailJS service returned an unexpected HTML response (HTTP ${response.status} ${response.statusText || 'Error'}). Please check your EmailJS Service ID, Template ID, and Account status.`;
      } else {
        try {
          const parsed = JSON.parse(responseText);
          if (typeof parsed === 'string') {
            cleanError = parsed;
          } else if (parsed && typeof parsed === 'object') {
            const parsedObj = parsed as { text?: string; message?: string };
            cleanError = parsedObj.text || parsedObj.message || responseText.trim();
          }
        } catch {
          cleanError = responseText.trim() || `Email service responded with status ${response.status}`;
        }
      }

      return NextResponse.json(
        {
          success: false,
          error: cleanError || 'Failed to send message through EmailJS service.',
        },
        {
          status: response.status >= 400 && response.status < 600 ? response.status : 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message delivered successfully! Thank you for reaching out.',
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Contact API error:', error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
