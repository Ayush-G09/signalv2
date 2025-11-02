// src/socket.js
import { io } from 'socket.io-client';

// Create one persistent socket connection
export const socket = io('http://localhost:4000', {
  transports: ['websocket'], // ensure stable connection
  reconnection: true,
});
