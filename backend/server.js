// server.js

// Bun automatically loads variables from .env files, so 'dotenv' is not needed.
// Use 'import' for ES modules. Let's assume db-connector is or can be an ES module.
import db from './db-connector.js';

require('dotenv').config({path: '../.env'})

const PORT = process.env.VITE_BACKEND_PORT

// --- Security Whitelist ---
// IMPORTANT: This prevents SQL injection by only allowing known table names.
const ALLOWED_TABLES = new Set([
    'Pets', 'Contacts', 'PetRaces', 'Applications', 'AppAnswers', 'AppQuestions'
]);

console.log(`Bun server started on http://localhost:${PORT}; press Ctrl-C to terminate.`);

Bun.serve({
  port: PORT,
  async fetch(req) {
    // Define CORS headers. This replaces the 'cors' middleware.
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // Or a specific origin like "http://localhost:5173"
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    };

    // Handle preflight requests for CORS
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Use URLPattern for robust routing and parameter extraction. This replaces app.get('/:table').
    const pattern = new URLPattern({ pathname: '/:table' });
    const match = pattern.exec(req.url);

    // Check if the request method and path match our route
    if (req.method === "GET" && match) {
      const { table } = match.pathname.groups;

      // --- Security Check ---
      if (!ALLOWED_TABLES.has(table)) {
        return new Response(JSON.stringify({ error: "Invalid table specified." }), {
          status: 400, // Bad Request
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      try {
        const query = `SELECT * FROM ${table};`;
        const [rows] = await db.query(query);

        // Return a successful JSON response. This replaces res.status().json().
        return new Response(JSON.stringify(rows), {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Error executing query:", error);
        return new Response(JSON.stringify({ error: "An error occurred on the server." }), {
          status: 500, // Internal Server Error
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Fallback for any other route
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  },
});