const { app } = require('@azure/functions');

// Lab: in-memory ON PURPOSE to discuss statelessness.
// Every instance has its own copy and it's lost on scale-in or idle.
const quotes = [
  { text: 'Simplicity is prerequisite for reliability.', author: 'Edsger Dijkstra' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' }
];

// GET  /api/quotes        -> random quote
// GET  /api/quotes?all=1  -> all quotes (homework: split into its own endpoint)
// POST /api/quotes        -> { "text": "...", "author": "..." }
app.http('quotes', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  route: 'quotes',
  handler: async (request, context) => {
    if (request.method === 'GET') {
      if (request.query.get('all')) {
        return { jsonBody: { total: quotes.length, quotes } };
      }
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      return { jsonBody: quote };
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return { status: 400, jsonBody: { error: 'Invalid JSON body' } };
    }

    if (!body?.text?.trim() || !body?.author?.trim()) {
      return { status: 400, jsonBody: { error: 'Both "text" and "author" are required' } };
    }

    const quote = { text: body.text.trim(), author: body.author.trim() };
    quotes.push(quote);
    context.log(`New quote added. Total in THIS instance: ${quotes.length}`);
    return { status: 201, jsonBody: { added: quote, total: quotes.length } };
  }
});
