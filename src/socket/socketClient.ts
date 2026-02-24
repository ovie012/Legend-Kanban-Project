type Listener = (...args: unknown[]) => void;

class SocketClient {
  private listeners = new Map<string, Set<Listener>>();
  private _connected = false;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  connect() {
    this._connected = true;
    this.reconnectAttempts = 0;
    this.trigger('connect');
    console.log('[Socket] Connected (mock)');
  }

  disconnect() {
    this._connected = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.trigger('disconnect');
  }

  on(event: string, cb: Listener) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(cb);
  }

  off(event: string, cb: Listener) {
    this.listeners.get(event)?.delete(cb);
  }

  emit(event: string, ...args: unknown[]) {
    if (!this._connected) {
      console.warn(`[Socket] Cannot emit "${event}" — disconnected`);
      return;
    }
    console.log(`[Socket] Emit: ${event}`, ...args);
  }

  private trigger(event: string, ...args: unknown[]) {
    this.listeners.get(event)?.forEach(cb => cb(...args));
  }

  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => this.connect(), delay);
  }

  get connected() {
    return this._connected;
  }
}

export const socketClient = new SocketClient();
