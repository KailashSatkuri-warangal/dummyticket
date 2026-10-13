import { NextResponse } from 'next/server';
import { getBookingByIdOrReference } from '@/lib/booking/store';
import {
  generatePaymentReceiptPdfBytes,
  generateSampleItineraryPdfBytes,
} from '@/lib/pdf/generator';

export async function GET(
  request: Request,
  context: { params: Promise<{ reference: string }> }
) {
  const { reference } = await context.params;
  const { searchParams } = new URL(request.url);
  const docType = searchParams.get('type') === 'receipt' ? 'receipt' : 'ticket';

  const booking = getBookingByIdOrReference(reference);

  if (!booking) {
    return NextResponse.json(
      { error: 'Itinerary reference not found.' },
      { status: 404 }
    );
  }

  if (docType === 'receipt') {
    const receiptBytes = await generatePaymentReceiptPdfBytes(booking);
    const receiptFilename = `DUMMYTICKET-RECEIPT-${booking.bookingReference}.pdf`;
    return new NextResponse(Buffer.from(receiptBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${receiptFilename}"`,
        'Cache-Control': 'no-store',
      },
    });
  }

  const pdfBytes = await generateSampleItineraryPdfBytes(booking);
  const filename = `${
    booking.fulfillmentMode === 'sample_demo'
      ? 'DUMMYTICKET-SAMPLE'
      : 'DUMMYTICKET-ITINERARY'
  }-${booking.bookingReference}.pdf`;

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
