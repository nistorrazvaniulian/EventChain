const { getTicket } = require('./blockchainService');

test('should return a ticket object from blockchain when ticketId is valid', async () => {
  const ticketId = '685b0e1de2b107ec83503400';
  const ticket = await getTicket(ticketId);

  expect(ticket).toBeDefined();
  expect(ticket.ticketId).toBe(ticketId);
  expect(ticket).toHaveProperty('eventId');
});
