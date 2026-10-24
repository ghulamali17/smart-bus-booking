import { jsPDF } from 'jspdf';

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */
const C = {
  page: [241, 245, 249],
  card: [255, 255, 255],
  navy: [30, 27, 75],
  indigo: [79, 70, 229],
  indigoSoft: [238, 242, 255],
  indigoLine: [199, 210, 254],
  amber: [245, 158, 11],
  ink: [15, 23, 42],
  slate: [100, 116, 139],
  line: [226, 232, 240],
  mist: [248, 250, 252],
  greenBg: [236, 253, 245],
  greenLine: [167, 243, 208],
  greenInk: [6, 95, 70],
  warnBg: [255, 251, 235],
  warnLine: [253, 230, 138],
  warnInk: [146, 64, 14],
};

const fill = (doc, c) => doc.setFillColor(c[0], c[1], c[2]);
const stroke = (doc, c) => doc.setDrawColor(c[0], c[1], c[2]);
const ink = (doc, c) => doc.setTextColor(c[0], c[1], c[2]);

/** Draw text and shrink the font until it fits in maxW. */
function fitText(doc, text, x, y, maxW, size, opts) {
  let s = size;
  doc.setFontSize(s);
  while (doc.getTextWidth(text) > maxW && s > 6) {
    s -= 0.5;
    doc.setFontSize(s);
  }
  doc.text(text, x, y, opts);
}

/** Small vector bus icon centred on (cx, cy). */
function drawBus(doc, cx, cy, w, body, detail) {
  const h = w * 0.72;
  const x = cx - w / 2;
  const y = cy - h / 2;
  fill(doc, body);
  doc.roundedRect(x, y, w, h, w * 0.14, w * 0.14, 'F');
  // windows
  fill(doc, detail);
  const winW = w * 0.2;
  const winH = h * 0.3;
  for (let i = 0; i < 3; i++) {
    doc.rect(x + w * 0.1 + i * (winW + w * 0.07), y + h * 0.16, winW, winH, 'F');
  }
  // stripe + headlight
  doc.rect(x + w * 0.1, y + h * 0.58, w * 0.8, h * 0.07, 'F');
  // wheels
  doc.circle(x + w * 0.27, y + h, w * 0.09, 'F');
  doc.circle(x + w * 0.73, y + h, w * 0.09, 'F');
}

/* ------------------------------------------------------------------ */
/*  Code 39 barcode (scannable)                                        */
/* ------------------------------------------------------------------ */
const CODE39 = {
  '0': 'nnnwwnwnn', '1': 'wnnwnnnnw', '2': 'nnwwnnnnw', '3': 'wnwwnnnnn',
  '4': 'nnnwwnnnw', '5': 'wnnwwnnnn', '6': 'nnwwwnnnn', '7': 'nnnwnnwnw',
  '8': 'wnnwnnwnn', '9': 'nnwwnnwnn', A: 'wnnnnwnnw', B: 'nnwnnwnnw',
  C: 'wnwnnwnnn', D: 'nnnnwwnnw', E: 'wnnnwwnnn', F: 'nnwnwwnnn',
  G: 'nnnnnwwnw', H: 'wnnnnwwnn', I: 'nnwnnwwnn', J: 'nnnnwwwnn',
  K: 'wnnnnnnww', L: 'nnwnnnnww', M: 'wnwnnnnwn', N: 'nnnnwnnww',
  O: 'wnnnwnnwn', P: 'nnwnwnnwn', Q: 'nnnnnnwww', R: 'wnnnnnwwn',
  S: 'nnwnnnwwn', T: 'nnnnwnwwn', U: 'wwnnnnnnw', V: 'nwwnnnnnw',
  W: 'wwwnnnnnn', X: 'nwnnwnnnw', Y: 'wwnnwnnnn', Z: 'nwwnwnnnn',
  '-': 'nwnnnnwnw', '.': 'wwnnnnwnn', ' ': 'nwwnnnwnn', '*': 'nwnnwnwnn',
};

function drawBarcode(doc, value, centerX, y, height, maxWidth) {
  const clean = String(value).toUpperCase().replace(/[^0-9A-Z\-. ]/g, '-');
  const data = `*${clean}*`;
  const ratio = 2.5;

  // total width in "narrow units"
  let units = 0;
  for (const ch of data) {
    for (const e of CODE39[ch]) units += e === 'w' ? ratio : 1;
    units += 1; // inter-character gap
  }
  units -= 1;

  const narrow = Math.min(0.45, maxWidth / units);
  let x = centerX - (units * narrow) / 2;

  fill(doc, C.ink);
  for (const ch of data) {
    const pattern = CODE39[ch];
    for (let i = 0; i < pattern.length; i++) {
      const w = (pattern[i] === 'w' ? ratio : 1) * narrow;
      if (i % 2 === 0) doc.rect(x, y, w, height, 'F'); // even index = bar
      x += w;
    }
    x += narrow; // gap
  }
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */
/**
 * Downloads a professional A5 PDF boarding pass directly to the user's
 * device without opening the browser print dialog.
 */
export function downloadTicket(booking, route) {
  if (!booking) return;

  const routeCode = booking.route_id || route?.route_id || 'R101';
  const depCity = (route?.departure_city || 'Origin').toUpperCase();
  const destCity = (route?.destination_city || 'Destination').toUpperCase();
  const depTime = route?.departure_time || '08:00 AM';
  const seats = Number(booking.seats) || 1;
  const fare = Number(
    booking.total_fare || (route?.ticket_price ? route.ticket_price * seats : 1200)
  );
  const passengerName = booking.passenger_name || 'Passenger';
  const passengerAge = booking.passenger_age || 25;
  const bookingId = (booking.booking_id || 'B1001').toUpperCase();
  const timestamp = booking.timestamp || new Date().toLocaleString();

  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
    const PW = 148;
    const PH = 210;

    const CX = 8; // card x
    const CY = 6; // card y
    const CW = 132; // card width
    const CH = 198; // card height
    const PAD = 6; // inner padding
    const L = CX + PAD; // content left  (14)
    const R = CX + CW - PAD; // content right (134)
    const MID = CX + CW / 2; // 74

    /* ---------- Page background & card ---------- */
    fill(doc, C.page);
    doc.rect(0, 0, PW, PH, 'F');

    // soft shadow
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(CX + 0.6, CY + 0.9, CW, CH, 5, 5, 'F');

    fill(doc, C.card);
    stroke(doc, C.line);
    doc.setLineWidth(0.25);
    doc.roundedRect(CX, CY, CW, CH, 5, 5, 'FD');

    /* ---------- Header ---------- */
    fill(doc, C.navy);
    doc.roundedRect(CX, CY, CW, 34, 5, 5, 'F');
    doc.rect(CX, CY + 20, CW, 14, 'F'); // square off bottom corners

    // accent stripe
    fill(doc, C.amber);
    doc.rect(CX, CY + 34, CW, 1.6, 'F');

    // logo tile
    fill(doc, [255, 255, 255]);
    doc.roundedRect(L, CY + 8, 16, 16, 3.5, 3.5, 'F');
    drawBus(doc, L + 8, CY + 15.5, 11, C.indigo, [255, 255, 255]);

    // brand
    ink(doc, [255, 255, 255]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('SmartBus Express', L + 20, CY + 14.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    ink(doc, [165, 180, 252]);
    doc.text('E-TICKET  |  BOARDING PASS', L + 20, CY + 20);

    // booking reference
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    ink(doc, [165, 180, 252]);
    doc.text('BOOKING REF', R, CY + 10.5, { align: 'right' });
    fill(doc, C.indigo);
    doc.roundedRect(R - 30, CY + 13, 30, 10, 2.5, 2.5, 'F');
    ink(doc, [255, 255, 255]);
    doc.setFont('helvetica', 'bold');
    fitText(doc, bookingId, R - 15, CY + 19.6, 26, 11, { align: 'center' });

    /* ---------- Route ---------- */
    const routeY = 52;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    ink(doc, C.slate);
    doc.text('FROM', L, routeY);
    doc.text('TO', R, routeY, { align: 'right' });

    ink(doc, C.ink);
    doc.setFont('helvetica', 'bold');
    fitText(doc, depCity, L, routeY + 8, 46, 16);
    fitText(doc, destCity, R, routeY + 8, 46, 16, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    ink(doc, C.indigo);
    doc.text(`Departs ${depTime}`, L, routeY + 14);
    ink(doc, C.slate);
    doc.text('Final stop', R, routeY + 14, { align: 'right' });

    // connector between cities
    const lineY = routeY + 3.5;
    stroke(doc, C.indigoLine);
    doc.setLineWidth(0.5);
    doc.setLineDashPattern([1.2, 1.2], 0);
    doc.line(MID - 17, lineY + 4, MID + 17, lineY + 4);
    doc.setLineDashPattern([], 0);
    fill(doc, C.indigo);
    doc.circle(MID - 19, lineY + 4, 1.1, 'F');
    doc.circle(MID + 19, lineY + 4, 1.1, 'F');

    // bus badge in middle
    fill(doc, C.card);
    stroke(doc, C.indigoLine);
    doc.setLineWidth(0.4);
    doc.circle(MID, lineY + 4, 5.2, 'FD');
    drawBus(doc, MID, lineY + 4, 6.4, C.indigo, [255, 255, 255]);

    doc.setLineWidth(0.25);

    /* ---------- Info strip ---------- */
    const sy = 74;
    const sh = 16;
    fill(doc, C.mist);
    stroke(doc, C.line);
    doc.roundedRect(L, sy, R - L, sh, 3, 3, 'FD');

    const colW = (R - L) / 3;
    stroke(doc, C.line);
    doc.line(L + colW, sy + 3, L + colW, sy + sh - 3);
    doc.line(L + colW * 2, sy + 3, L + colW * 2, sy + sh - 3);

    const cols = [
      ['DEPARTURE', String(depTime)],
      ['ROUTE CODE', String(routeCode)],
      ['SEATS', `${seats} Seat${seats > 1 ? 's' : ''}`],
    ];
    cols.forEach(([label, value], i) => {
      const cx = L + colW * i + colW / 2;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      ink(doc, C.slate);
      doc.text(label, cx, sy + 6.2, { align: 'center' });
      ink(doc, C.ink);
      fitText(doc, value, cx, sy + 12.4, colW - 6, 10.5, { align: 'center' });
    });

    /* ---------- Passenger details ---------- */
    const py = 98;
    fill(doc, C.indigo);
    doc.roundedRect(L, py - 3.2, 1.4, 4.4, 0.7, 0.7, 'F');
    ink(doc, C.ink);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('PASSENGER DETAILS', L + 4, py);

    const rows = [
      ['Passenger Name', String(passengerName)],
      ['Age', `${passengerAge} years`],
      ['Issued On', String(timestamp)],
    ];
    rows.forEach(([label, value], i) => {
      const ry = py + 8 + i * 8.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      ink(doc, C.slate);
      doc.text(label, L, ry);
      ink(doc, C.ink);
      doc.setFont('helvetica', 'bold');
      fitText(doc, value, R, ry, 75, 9, { align: 'right' });
      if (i < rows.length - 1) {
        stroke(doc, C.line);
        doc.line(L, ry + 3, R, ry + 3);
      }
    });

    /* ---------- Fare box ---------- */
    const fy = 131;
    fill(doc, C.indigoSoft);
    stroke(doc, C.indigoLine);
    doc.roundedRect(L, fy, R - L, 16, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    ink(doc, C.slate);
    doc.text('TOTAL FARE PAID', L + 5, fy + 6.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`${seats} seat${seats > 1 ? 's' : ''} reserved`, L + 5, fy + 11.5);

    ink(doc, C.indigo);
    doc.setFont('helvetica', 'bold');
    fitText(doc, `Rs. ${fare.toLocaleString()}`, R - 5, fy + 10.5, 56, 17, { align: 'right' });

    /* ---------- Perforation with notches ---------- */
    const perfY = 154;
    stroke(doc, [203, 213, 225]);
    doc.setLineWidth(0.3);
    doc.setLineDashPattern([1.6, 1.6], 0);
    doc.line(CX + 6, perfY, CX + CW - 6, perfY);
    doc.setLineDashPattern([], 0);
    fill(doc, C.page);
    doc.circle(CX, perfY, 4, 'F');
    doc.circle(CX + CW, perfY, 4, 'F');
    doc.setLineWidth(0.25);

    /* ---------- Stub ---------- */
    // paid badge
    fill(doc, C.greenBg);
    stroke(doc, C.greenLine);
    doc.roundedRect(MID - 21, 159, 42, 7, 3.5, 3.5, 'FD');
    fill(doc, C.greenInk);
    doc.circle(MID - 15.5, 162.5, 1.2, 'F');
    ink(doc, C.greenInk);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('CONFIRMED & PAID', MID + 2, 163.8, { align: 'center' });

    // barcode
    drawBarcode(doc, bookingId, MID, 169, 12, 100);
    doc.setFont('courier', 'bold');
    doc.setFontSize(7);
    ink(doc, C.slate);
    doc.text(`${bookingId} - ${routeCode}`, MID, 185, { align: 'center' });

    // instructions
    fill(doc, C.warnBg);
    stroke(doc, C.warnLine);
    doc.roundedRect(L, 188, R - L, 13.5, 2.5, 2.5, 'FD');
    ink(doc, C.warnInk);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text('BOARDING INSTRUCTIONS', L + 3.5, 192.2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.text(
      'Arrive 15 min early  |  Carry original CNIC / ID  |  20 kg baggage per seat',
      L + 3.5,
      196.2
    );
    doc.text('Non-transferable digital ticket. Show this pass at boarding.', L + 3.5, 199.4);

    // footer
    doc.setFontSize(6.5);
    ink(doc, C.slate);
    doc.text('Thank you for travelling with SmartBus Express', MID, 207, { align: 'center' });

    doc.save(`SmartBus-Ticket-${bookingId}.pdf`);
  } catch (err) {
    console.error('jsPDF generation failed, using direct download fallback:', err);
    downloadBlobFallback(booking, route);
  }
}

function downloadBlobFallback(booking, route) {
  const bookingId = booking.booking_id || 'B1001';
  const content = `
=====================================================
          SMARTBUS EXPRESS - BOARDING PASS
=====================================================
Booking ID:     ${bookingId}
Passenger:      ${booking.passenger_name} (${booking.passenger_age} yrs)
Route:          ${route?.departure_city || 'Origin'} -> ${route?.destination_city || 'Destination'} (${booking.route_id})
Departure:      ${route?.departure_time || '08:00 AM'}
Seats Reserved: ${booking.seats} seat(s)
Total Fare:     Rs. ${booking.total_fare}
Status:         CONFIRMED & PAID
Date Issued:    ${booking.timestamp || new Date().toLocaleString()}
=====================================================
Please arrive 15 minutes prior to departure. CNIC required.
=====================================================
`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SmartBus-Ticket-${bookingId}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}