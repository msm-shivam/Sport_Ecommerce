import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { AppDataSource } from '../data-source';
import { v4 as uuid } from 'uuid';

dotenv.config();

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addHours(date: Date, hours: number) {
  const d = new Date(date);
  d.setHours(d.getHours() + hours);
  return d;
}

async function seed() {
  console.log('Connecting...');
  await AppDataSource.initialize();
  const qr = AppDataSource.createQueryRunner();

  const cleanTables = [
    'ticket_tags', 'ticket_sla_logs', 'ticket_audits', 'ticket_notes',
    'ticket_ratings', 'ticket_assignments', 'ticket_attachments',
    'ticket_messages', 'support_tickets',
  ];
  for (const name of cleanTables) {
    try { await qr.query(`DELETE FROM "${name}"`); } catch { /* skip */ }
  }
  console.log('Cleared support data');

  const now = new Date();

  // Fetch users
  const userRows = await qr.query(
    `SELECT id, first_name, last_name, email, created_at FROM users WHERE deleted_at IS NULL ORDER BY created_at`,
  );
  console.log(`  Found ${userRows.length} users`);

  // Fetch admin users
  const adminRows = await qr.query(
    `SELECT id, name FROM admin_users ORDER BY created_at LIMIT 3`,
  );
  const adminId = adminRows[0]?.id ?? null;
  const adminId2 = adminRows[1]?.id ?? adminId;
  console.log(`  Found ${adminRows.length} admins`);

  // Fetch orders with their users
  const orderRows = await qr.query(
    `SELECT o.id, o.order_number, o.user_id, o.created_at
     FROM orders o ORDER BY o.created_at`,
  );

  const categories = ['ORDER_ISSUE', 'PAYMENT_ISSUE', 'SHIPPING_ISSUE', 'RETURN_ISSUE', 'REFUND_ISSUE', 'PRODUCT_ISSUE', 'ACCOUNT_ISSUE', 'OTHER'];
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  const statuses = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

  let ticketCount = 0, msgCount = 0, assignCount = 0, ratingCount = 0, noteCount = 0;

  // Create tickets based on orders
  for (let i = 0; i < Math.min(orderRows.length, 5); i++) {
    const order = orderRows[i];
    const user = userRows.find((u: any) => u.id === order.user_id);
    if (!user) continue;

    const ticketId = uuid();
    const createdAt = addDays(new Date(order.created_at), 1);
    const category = categories[i % categories.length];
    const priority = priorities[i % priorities.length];
    const status = statuses[Math.min(i, statuses.length - 1)];
    const isAssigned = status !== 'OPEN';
    const isResolved = status === 'RESOLVED' || status === 'CLOSED';

    const subjects = [
      'Wrong size delivered',
      'Payment not reflecting',
      'Shipment delayed',
      'Need to return item',
      'Product quality issue',
    ];

    await qr.query(
      `INSERT INTO support_tickets (id, ticket_number, customer_id, order_id, subject, category, priority, status, assigned_to, first_response_at, resolved_at, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $12)`,
      [ticketId, `TKT-${String(i + 1).padStart(4, '0')}`, user.id, order.id, subjects[i % subjects.length],
       category, priority, status,
       isAssigned ? (i % 2 === 0 ? adminId : adminId2) : null,
       isAssigned ? addHours(createdAt, 2) : null,
       isResolved ? addDays(createdAt, 3) : null,
       createdAt],
    );
    ticketCount++;

    // Customer message (first)
    const customerMessages = [
      'The shoes I received are too small. Please help me with a size exchange.',
      'I paid via card but the payment is still showing as pending. Please check.',
      'My order was supposed to arrive yesterday but tracking shows it\'s still in transit.',
      'I want to return the hoodie I ordered. The color does not match the picture.',
      'The stitching on the training tee is coming apart after just one wash.',
    ];
    await qr.query(
      `INSERT INTO ticket_messages (id, ticket_id, sender_id, sender_type, message, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $6)`,
      [uuid(), ticketId, user.id, 'CUSTOMER', customerMessages[i % customerMessages.length], addHours(createdAt, 1)],
    );
    msgCount++;

    if (isAssigned) {
      // Assignment record
      await qr.query(
        `INSERT INTO ticket_assignments (id, ticket_id, assigned_to, assigned_by, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $5)`,
        [uuid(), ticketId, i % 2 === 0 ? adminId : adminId2, adminId, addHours(createdAt, 2)],
      );
      assignCount++;

      // Admin reply
      const adminReplies = [
        'I apologize for the inconvenience. We can arrange a size exchange. Please share your size preference.',
        'I have checked with the payments team. Your payment was processed successfully. It should reflect within 24 hours.',
        'I apologize for the delay. Let me check with the logistics team and get back to you shortly.',
        'I understand. Please initiate a return from your account and we will process the refund once received.',
        'I apologize for the quality issue. Please return the item and we will process a full refund.',
      ];
      await qr.query(
        `INSERT INTO ticket_messages (id, ticket_id, sender_id, sender_type, message, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $6)`,
        [uuid(), ticketId, i % 2 === 0 ? adminId : adminId2, 'ADMIN', adminReplies[i % adminReplies.length], addHours(createdAt, 3)],
      );
      msgCount++;
    }

    if (isResolved) {
      // Ticket rating (4-5 stars)
      const rating = i % 2 === 0 ? 5 : 4;
      await qr.query(
        `INSERT INTO ticket_ratings (id, ticket_id, rating, comment, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $5)`,
        [uuid(), ticketId, rating, 'Support team was helpful and responsive.', addDays(createdAt, 4)],
      );
      ratingCount++;

      // SLA log
      await qr.query(
        `INSERT INTO ticket_sla_logs (id, ticket_id, first_response_at, resolved_at, response_minutes, resolution_minutes, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $7)`,
        [uuid(), ticketId, addHours(createdAt, 2), addDays(createdAt, 3), 120, 4320, createdAt],
      );

      // Internal admin note
      await qr.query(
        `INSERT INTO ticket_notes (id, ticket_id, note, created_by, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $5)`,
        [uuid(), ticketId, 'Resolved after coordination with warehouse team.', adminId, addDays(createdAt, 3)],
      );
      noteCount++;

      // Audit log
      await qr.query(
        `INSERT INTO ticket_audits (id, ticket_id, action, previous_status, new_status, performed_by, notes, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)`,
        [uuid(), ticketId, 'status_change', 'IN_PROGRESS', 'RESOLVED', adminId, 'Ticket resolved', addDays(createdAt, 3)],
      );
    }

    // Tag
    await qr.query(
      `INSERT INTO ticket_tags (id, ticket_id, tag, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $4)`,
      [uuid(), ticketId, category === 'ORDER_ISSUE' ? 'exchange' : 'refund', createdAt],
    );
  }

  // Additional tickets without orders (account issues)
  for (let i = 0; i < 2; i++) {
    const user = userRows[i % userRows.length];
    if (!user) continue;

    const ticketId = uuid();
    const createdAt = addDays(now, -(10 - i * 3));
    const category = 'ACCOUNT_ISSUE';

    await qr.query(
      `INSERT INTO support_tickets (id, ticket_number, customer_id, order_id, subject, category, priority, status, assigned_to, first_response_at, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11)`,
      [ticketId, `TKT-${String(ticketCount + i + 1).padStart(4, '0')}`, user.id, null,
       'Unable to login to my account', category, 'MEDIUM', 'OPEN', null, null, createdAt],
    );
    ticketCount++;

    await qr.query(
      `INSERT INTO ticket_messages (id, ticket_id, sender_id, sender_type, message, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $6)`,
      [uuid(), ticketId, user.id, 'CUSTOMER', 'I am unable to login to my account. It says invalid credentials even though I am sure my password is correct.', addHours(createdAt, 1)],
    );
    msgCount++;
  }

  console.log(`\nTickets: ${ticketCount}, Messages: ${msgCount}, Assignments: ${assignCount}, Ratings: ${ratingCount}, Notes: ${noteCount}`);

  await qr.release();
  await AppDataSource.destroy();
  console.log('\nSupport seed completed!');
}

seed().catch((err) => { console.error('Seed failed:', err); process.exit(1); });
