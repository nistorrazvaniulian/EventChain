const createTicketFlow = require('./createTicketFlow');

test('should throw an error if event does not exist', async () => {
  const fakeEventId = '000000000000000000000000'; // ID invalid
  const userId = '664fbe4ac18f6bc7aeb15722';     // user valid (poate fi orice)
  const userEmail = 'testuser@email.com';

  await expect(
    createTicketFlow({ userId, userEmail, eventId: fakeEventId })
  ).rejects.toThrow('Evenimentul nu a fost găsit');
}, 10000);
