import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface EmailRequest {
  email: string;
  subject: string;
  htmlContent: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email, subject, htmlContent } = await request.json() as EmailRequest;

    // Check if RESEND_API_KEY is provided
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to send email',
        error: 'RESEND_API_KEY is not configured' 
      }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const response = await resend.emails.send({
      from: 'InfluencerReach <noreply@influencerreach.com>',
      to: email,
      subject: subject,
      html: htmlContent,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully',
      data: response 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to send email',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
