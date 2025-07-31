require('dotenv').config({path: '../.env'})

import path from 'path';

// Bun provides import.meta.dir as a reliable way to get the current directory
const buildPath = path.join(import.meta.dir, 'dist');
const indexPath = path.join(buildPath, 'index.html');

Bun.serve({
  port: process.env.VITE_FRONTEND_PORT,

  async fetch(req) {
    const url = new URL(req.url);
    const filePath = path.join(buildPath, url.pathname);

    // Try to serve a static file from the 'dist' folder
    const file = Bun.file(filePath);
    const fileExists = await file.exists();

    if (fileExists) {
      // If the file exists, serve it
      return new Response(file);
    }

    // If a static file is not found, serve the main index.html
    // This allows your client-side router to take over.
    return new Response(Bun.file(indexPath));
  },

  // A basic error handler
  error() {
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Bun server running on http://localhost:${process.env.VITE_FRONTEND_PORT} 🚀`);