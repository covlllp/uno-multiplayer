/* global io */
/* eslint import/no-mutable-exports: 0 */

export let socket = null;

export const initializeSocket = () => {
  socket = io();
};
