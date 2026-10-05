const { app } = require('@azure/functions');

// Demo 3: GET /api/hello?name=Coban
app.http('hello', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    const name = request.query.get('name') || 'world';
    context.log(`Greeting ${name}`);
    return {
      jsonBody: {
        message: `Hello, ${name}!`,
        time: new Date().toISOString()
      }
    };
  }
});
