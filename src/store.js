/**
 * FinTrack Pro — Reactive State Store
 * Simple observer-pattern state management.
 * No frameworks — just publish/subscribe with IndexedDB persistence for settings.
 */

import { update as dbUpdate, getAll } from './db.js';

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  profile: null,           // Current user profile
  accounts: [],            // Financial accounts
  transactions: [],        // All transactions
  budgets: [],             // Budget definitions
  categories: [],          // Custom categories
  investments: [],         // User investments
  settings: {},            // App settings (persisted to IndexedDB)
  currentRoute: '',        // Current hash route
  notifications: [],       // In-app notifications queue
  filters: {               // Active filters for transactions view
    dateRange: null,
    category: null,
    account: null,
    type: null,
    search: '',
  },
};

// ─── Store Implementation ─────────────────────────────────────────────────────

class Store {
  constructor() {
    /** @type {Record<string, any>} */
    this._state = { ...initialState };

    /** @type {Record<string, Set<Function>>} */
    this._subscribers = {};

    /** @type {Set<Function>} */
    this._globalSubscribers = new Set();
  }

  /**
   * Get the full state (read-only copy).
   * @returns {Readonly<typeof initialState>}
   */
  get state() {
    return this._state;
  }

  /**
   * Get a specific state value by key.
   * @param {string} key
   * @returns {any}
   */
  getState(key) {
    return this._state[key];
  }

  /**
   * Set a state value and notify subscribers.
   * @param {string} key
   * @param {any} value
   */
  setState(key, value) {
    const oldValue = this._state[key];

    // Skip if value hasn't changed (shallow comparison)
    if (oldValue === value) return;

    this._state[key] = value;

    // Notify key-specific subscribers
    if (this._subscribers[key]) {
      for (const callback of this._subscribers[key]) {
        try {
          callback(value, oldValue, key);
        } catch (err) {
          console.error(`[Store] Subscriber error for key "${key}":`, err);
        }
      }
    }

    // Notify global subscribers
    for (const callback of this._globalSubscribers) {
      try {
        callback(key, value, oldValue);
      } catch (err) {
        console.error('[Store] Global subscriber error:', err);
      }
    }

    // Persist settings to IndexedDB when they change
    if (key === 'settings') {
      this._persistSettings(value);
    }
  }

  /**
   * Batch-update multiple state keys at once.
   * @param {Record<string, any>} updates
   */
  batchUpdate(updates) {
    for (const [key, value] of Object.entries(updates)) {
      this.setState(key, value);
    }
  }

  /**
   * Subscribe to changes on a specific state key.
   * @param {string} key
   * @param {Function} callback - (newValue, oldValue, key) => void
   * @returns {Function} Unsubscribe function
   */
  subscribe(key, callback) {
    if (!this._subscribers[key]) {
      this._subscribers[key] = new Set();
    }
    this._subscribers[key].add(callback);

    // Return unsubscribe function
    return () => {
      this._subscribers[key]?.delete(callback);
    };
  }

  /**
   * Subscribe to ALL state changes (any key).
   * @param {Function} callback - (key, newValue, oldValue) => void
   * @returns {Function} Unsubscribe function
   */
  subscribeAll(callback) {
    this._globalSubscribers.add(callback);
    return () => {
      this._globalSubscribers.delete(callback);
    };
  }

  /**
   * Add a notification to the queue.
   * @param {{ type: 'success'|'error'|'warning'|'info', message: string, duration?: number }} notification
   */
  notify(notification) {
    const id = crypto.randomUUID();
    const entry = { id, ...notification, timestamp: Date.now() };
    const current = [...this._state.notifications, entry];
    this.setState('notifications', current);

    // Auto-remove after duration (default 5s)
    const duration = notification.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        this.dismissNotification(id);
      }, duration);
    }
  }

  /**
   * Remove a notification by ID.
   * @param {string} id
   */
  dismissNotification(id) {
    const filtered = this._state.notifications.filter((n) => n.id !== id);
    this.setState('notifications', filtered);
  }

  /**
   * Reset state to initial values.
   */
  reset() {
    for (const [key, value] of Object.entries(initialState)) {
      this.setState(key, structuredClone(value));
    }
  }

  // ─── Private Methods ──────────────────────────────────────────────────────

  /**
   * Persist settings object to IndexedDB.
   * Each setting key-value pair is stored as a separate record.
   * @param {Record<string, any>} settings
   */
  async _persistSettings(settings) {
    try {
      for (const [k, v] of Object.entries(settings)) {
        await dbUpdate('settings', { key: k, value: v });
      }
    } catch (err) {
      console.error('[Store] Failed to persist settings:', err);
    }
  }

  /**
   * Load settings from IndexedDB into the store.
   */
  async loadSettings() {
    try {
      const records = await getAll('settings');
      const settings = {};
      for (const record of records) {
        // Skip internal flags
        if (record.key.startsWith('localstorage_')) continue;
        settings[record.key] = record.value;
      }
      this._state.settings = settings; // Direct set to avoid re-persisting
    } catch (err) {
      console.error('[Store] Failed to load settings:', err);
    }
  }
}

// ─── Singleton Export ─────────────────────────────────────────────────────────

export const store = new Store();
export default store;
