// server.js

// Import Elysia and the CORS plugin
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import db from './db-connector.js';
import dotenv from 'dotenv';

dotenv.config({path: '../.env'})

// The 'path' module is not needed for this conversion
// since Elysia's routing handles paths directly.

// --- Security Whitelist ---
// This prevents SQL injection by only allowing known table names.
const ALLOWED_TABLES = new Set([
  'Pets',
  'Contacts',
  'PetRaces',
  'Applications',
  'AppAnswers',
  'AppQuestions',
]);

const PORT = process.env.VITE_BACKEND_PORT || 3000;

const app = new Elysia();

// Use the CORS plugin to handle CORS headers automatically
app.use(cors());

app.put('/delete/:table/:id', async ({params, set}) => {
  const { table, id } = params;

  try {
    const query = `call sp_delete${ table.substring(0, table.length - 1) }ByID(${id});`
    // console.log('calling...')
    await db.query(query)
    // console.log('done calling.')
    return { response: 'Successfully delete.'}
  } catch (error) {
    console.error('Error executing query:', error);
    set.status = 500;
    return { error: 'An error occurred on the server.' };
  }

})

app.put('/reset', async () => {
  try {
    const query = 'call sp_resetAll();'
    // console.log('calling...')
    await db.query(query)
    // console.log('done calling.')
    return { response: 'Successfully reset database.'}
  } catch (error) {
    console.error('Error executing query:', error);
    set.status = 500;
    return { error: 'An error occurred on the server.' };
  }
})

app.get('/:table/description', async ({ params, set }) => {
  const { table } = params;

  // --- Security Check ---
  if (!ALLOWED_TABLES.has(table)) {
    // Elysia's 'set' object handles the status and headers for you
    set.status = 400;
    return { error: 'Invalid table specified.' };
  }

  try {
    const query = `DESCRIBE ${table};`;
    const headers = await db.query(query);
    return headers;
  } catch (error) {
    console.error('Error executing query:', error);
    set.status = 500;
    return { error: 'An error occurred on the server.' };
  }
});

app.get('/:table/contents', async ({ params, set }) => {
  const { table } = params;

  // --- Security Check ---
  if (!ALLOWED_TABLES.has(table)) {
    // Elysia's 'set' object handles the status and headers for you
    set.status = 400;
    return { error: 'Invalid table specified.' };
  }

  try {
    const query = `SELECT * FROM ${table};`;
    const [rows] = await db.query(query);
    return rows;
  } catch (error) {
    console.error('Error executing query:', error);
    set.status = 500;
    return { error: 'An error occurred on the server.' };
  }
});

app.get('/Contacts/friendly', async ({ params, set }) => {
  try {
    const query = `call sp_getJoinedContactsID();`;
    const [rows] = await db.query(query);
    return rows;
  } catch (error) {
    console.error('Error executing query:', error);
    set.status = 500;
    return { error: 'An error occurred on the server.' };
  }
})

app.get('/Pets/friendly', async ({ params, set }) => {
  try {
    const query = `call sp_getJoinedPetsID();`;
    const [rows] = await db.query(query);
    return rows;
  } catch (error) {
    console.error('Error executing query:', error);
    set.status = 500;
    return { error: 'An error occurred on the server.' };
  }
})

app.listen(PORT, () => {
  console.log(`Elysia server started on http://localhost:${PORT}; press Ctrl-C to terminate.`);
});