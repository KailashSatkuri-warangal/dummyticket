import { NextResponse } from 'next/server';
import { listAllLeads, recordLead, updateLeadStatus } from '@/lib/booking/store';

export async function GET() {
  try {
    const leads = await listAllLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required fields.' },
        { status: 400 }
      );
    }

    const lead = await recordLead({
      name: body.name,
      email: body.email,
      phone: body.phone,
      origin: body.origin,
      destination: body.destination,
      departureDate: body.departureDate,
      tripType: body.tripType,
      plan: body.plan,
      passengersCount: body.passengersCount,
      notes: body.notes,
      status: body.status || 'new',
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to record lead' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.id || !body.status) {
      return NextResponse.json(
        { error: 'Lead id and status are required' },
        { status: 400 }
      );
    }

    const updated = await updateLeadStatus(body.id, body.status, body.notes);
    if (!updated) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update lead' },
      { status: 500 }
    );
  }
}
