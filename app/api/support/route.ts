import { NextResponse } from 'next/server';
import { insertSupportRequest, recordAuditLog } from '@/lib/booking/store';
import { getSessionUser } from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      type?: 'contact' | 'newsletter';
      name?: string;
      email?: string;
      bookingReference?: string;
      subject?: string;
      message?: string;
      consent?: boolean;
    };

    if (!body.email || !body.email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (body.type === 'newsletter' && !body.consent) {
      return NextResponse.json(
        {
          error:
            'Explicit marketing consent is required to subscribe to route updates.',
        },
        { status: 400 }
      );
    }

    const user = await getSessionUser();
    const ticketId = `SUP-${Date.now().toString(36).toUpperCase()}`;

    if (body.type !== 'newsletter') {
      await insertSupportRequest({
        userId: user?.id,
        name: body.name?.trim() || user?.fullName || 'Website Visitor',
        email: body.email,
        subject: body.subject?.trim() || 'General Support Inquiry',
        message: body.message?.trim() || 'No additional details provided.',
        bookingReference: body.bookingReference,
      });
    }

    await recordAuditLog({
      actorId: user?.id,
      actorEmail: body.email,
      action:
        body.type === 'newsletter'
          ? 'NEWSLETTER_CONSENT_RECORDED'
          : 'SUPPORT_REQUEST_CREATED',
      resourceType:
        body.type === 'newsletter' ? 'newsletter' : 'support_request',
      resourceId: ticketId,
      afterState: {
        subject: body.subject ?? 'Newsletter Opt-In',
        bookingReference: body.bookingReference,
      },
    });

    return NextResponse.json({
      success: true,
      ticketId,
      message:
        body.type === 'newsletter'
          ? 'Subscribed with verified consent. You can unsubscribe at any time.'
          : `Support request ${ticketId} registered. Our team will respond within 4 hours.`,
    });
  } catch {
    return NextResponse.json(
      { error: 'Unable to submit request.' },
      { status: 500 }
    );
  }
}
