function _removeFromArray<T>(array: T[], item: T) {
  const index = array.indexOf(item);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

class Emitter<T> {
  protected listeners: ((x: T) => unknown)[] = [];
  constructor() {
    //
  }

  on(listener: (x: T) => unknown): void {
    this.listeners.push(listener);
  }

  once(listener: (x: T) => unknown): void {
    const wrappedListener = (x: T) => {
      this.removeListener(wrappedListener);
      listener(x);
    };
    this.listeners.push(wrappedListener);
  }

  /**
   * Alias for #removeListener
   */
  off(listener: (x: T) => unknown): void {
    this.removeListener(listener);
  }

  removeListener(listener: (x: T) => unknown): void {
    _removeFromArray(this.listeners, listener);
  }

  /**
   * Keeps the reference to the original array after clear
   */
  removeAllListeners(): void {
    this.listeners.length = 0;
  }

  emit(data: T): void {
    this.listeners.forEach((listener) => {
      listener(data);
    });
  }
}

export { Emitter };
