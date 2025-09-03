type Listener = (payload: any) => void;

class SimpleEventBus {
  private listeners: Record<string, Set<Listener>> = {};

  addListener(eventName: string, listener: Listener) {
    if (!this.listeners[eventName]) this.listeners[eventName] = new Set();
    this.listeners[eventName].add(listener);
    return () => this.removeListener(eventName, listener);
  }

  removeListener(eventName: string, listener: Listener) {
    this.listeners[eventName]?.delete(listener);
  }

  emit(eventName: string, payload?: any) {
    this.listeners[eventName]?.forEach((l) => l(payload));
  }
}

export default new SimpleEventBus();

