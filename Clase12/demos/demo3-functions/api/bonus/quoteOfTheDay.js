const { app } = require('@azure/functions');

// BONUS: Timer trigger (every minute).
// To use it, copy this file into src/functions/.
// Locally, timer triggers need storage: start Azurite and set
// "AzureWebJobsStorage": "UseDevelopmentStorage=true" in local.settings.json
app.timer('quoteOfTheDay', {
  schedule: '0 */1 * * * *',
  handler: async (timer, context) => {
    context.log(`Quote of the day at ${new Date().toISOString()}: Keep it simple.`);
  }
});
