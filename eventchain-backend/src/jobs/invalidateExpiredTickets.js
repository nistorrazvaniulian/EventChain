const cron = require('node-cron');
const Event = require('../models/Event');
const { connect } = require('../services/blockchainService');

const invalidateExpiredTicketsJob = () => {
    console.log('📆 Cron job pentru invalidare bilete inițializat...');
  cron.schedule('*/5 * * * *', async () => {
    console.log('🔄 Rulează job-ul de invalidare bilete expirate');

    try {
      const events = await Event.find({ isClosed: false });
      const now = new Date();

      for (const event of events) {
        const eventTime = new Date(event.date);
        const diffHours = (now - eventTime) / (1000 * 60 * 60);

        if (diffHours >= 3) {
          try {
            const { contract, gateway } = await connect();
            await contract.submitTransaction(
              'invalidateTicketsForEventIfExpired',
              event._id.toString(),
              event.date.toISOString()
            );

            event.isClosed = true;
            await event.save();
            await gateway.disconnect();
            console.log(`✅ Biletele pentru evenimentul ${event.title} au fost invalidate`);
          } catch (bcErr) {
            console.error(`❌ Eroare la blockchain pentru evenimentul ${event.title}:`, bcErr.message);
          }
        }
      }
    } catch (err) {
      console.error('❌ Eroare la job-ul de invalidare bilete:', err.message);
    }
  });
};

module.exports = invalidateExpiredTicketsJob;
