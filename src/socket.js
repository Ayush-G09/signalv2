// src/socket.js
import { io } from 'socket.io-client';

// Create one persistent socket connection
export const socket = io('https://signalsv2-backend-production.up.railway.app', {
  transports: ['websocket'], // ensure stable connection
  reconnection: true,
});
