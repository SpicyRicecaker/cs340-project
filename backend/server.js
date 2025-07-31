// server.js

// Bun automatically loads variables from .env files, so 'dotenv' is not needed.
// Use 'import' for ES modules. Let's assume db-connector is or can be an ES module.
import path from 'path';

import db from './db-connector.js';

require('dotenv').config({path: '../.env'})

const PORT = process.env.VITE_BACKEND_PORT

// Bun provides import.meta.dir as a reliable way to get the current directory
const buildPath = path.join(import.meta.dir, 'dist');
const indexPath = path.join(buildPath, 'index.html');

// --- Security Whitelist ---
// IMPORTANT: This prevents SQL injection by only allowing known table names.
const ALLOWED_TABLES = new Set([
    'Pets', 'Contacts', 'PetRaces', 'Applications', 'AppAnswers', 'AppQuestions'
]);

console.log(`Bun server started on http://localhost:${PORT}; press Ctrl-C to terminate.`);

Bun.serve({
  port: PORT,
  async fetch(req) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    };

    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(req.url);
    const pathname = url.pathname;

    // --- Routing Logic (Replaced URLPattern) ---
    // Check if the path is not just "/" and the method is GET
    if (pathname.length > 1 && req.method === "GET") {
      // Get the table name by removing the first character ("/") from the path
      const table = pathname.substring(1);

      // --- Security Check ---
      if (!ALLOWED_TABLES.has(table)) {
        return new Response(JSON.stringify({ error: "Invalid table specified." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      try {
        const query = `SELECT * FROM ${table};`;
        const [rows] = await db.query(query);

        return new Response(JSON.stringify(rows), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error executing query:", error);
        return new Response(JSON.stringify({ error: "An error occurred on the server." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Fallback for any other route (like "/" or non-GET requests)
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  },
});
