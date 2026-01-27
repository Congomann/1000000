/**
 * Real-Time Communication Service
 * Handles WebSocket connections, automatic reconnection, and event broadcasting.
 */

const USE_REAL_SOCKETS = true; // Set to true only when backend server is running

class SocketService {
  private socket: WebSocket | null = null;
  
  // Dynamically determine the WebSocket URL based on current environment
  private get url(): string {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    if (isLocal) {
        return `${protocol}//localhost:3001/ws`;
    }
    // If deployed, assume the WS server is on the same host
    return `${protocol}//${window.location.host}/ws`;
  }

  private listeners: ((data: any) => void)[] = [];
  private reconnectInterval: number = 3000;

  connect() {
    if (!USE_REAL_SOCKETS) {
      console.log('SocketService: Running in simulation mode (No active backend connection).');
      return;
    }

    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    console.log(`SocketService: Attempting connection to ${this.url}...`);
    try {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
          console.log('WebSocket Connected');
        };

        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.listeners.forEach(callback => callback(data));
          } catch (e) {
            console.error('Failed to parse WebSocket message', e);
          }
        };

        this.socket.onclose = () => {
          console.log('WebSocket Disconnected. Reconnecting...');
          setTimeout(() => this.connect(), this.reconnectInterval);
        };

        this.socket.onerror = (err) => {
          console.error('WebSocket Error', err);
          this.socket?.close();
        };
    } catch (e) {
        console.warn("WebSocket connection failed to initialize", e);
    }
  }

  send(data: any) {
    if (!USE_REAL_SOCKETS) {
        // In simulation mode, we just log the outbound message
        console.log('[Socket Simulated Send]:', data);
        return;
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket not connected. Message queued or lost.');
    }
  }

  subscribe(callback: (data: any) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();