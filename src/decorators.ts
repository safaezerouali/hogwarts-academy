// Log, cache et validation
type AnyMethod = (this: any, ...args: any[]) => any;

export function Log(_target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor): void {
  const original = descriptor.value as AnyMethod;
  descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
    console.log(`[CALL] ${String(propertyKey)}`, args);
    try {
      const result = original.apply(this, args);
      console.log(`[RETURN] ${String(propertyKey)}`, result);
      return result;
    } catch (error) {
      console.error(`[ERROR] ${String(propertyKey)}`, error);
      throw error;
    }
  };
}

export function MeasureTime(_target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor): void {
  const original = descriptor.value as AnyMethod;
  descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
    const startedAt = performance.now();
    try { return original.apply(this, args); }
    finally { console.log(`[TIME] ${String(propertyKey)}: ${(performance.now() - startedAt).toFixed(2)} ms`); }
  };
}

export function ValidateSpellPower(_target: object, _key: string | symbol, descriptor: PropertyDescriptor): void {
  const original = descriptor.value as AnyMethod;
  descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
    const spell = args[0];
    if (typeof spell !== "object" || spell === null || !("power" in spell) ||
        typeof spell.power !== "number" || !Number.isFinite(spell.power) || spell.power < 0) {
      throw new Error("Spell power must be a non-negative finite number");
    }
    return original.apply(this, args);
  };
}


export function Cache(_target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor): void {
  const original = descriptor.value as AnyMethod;
  const caches = new WeakMap<object, Map<string, unknown>>();
  descriptor.value = function (this: object, ...args: unknown[]): unknown {
    let cache = caches.get(this);
    if (!cache) { cache = new Map<string, unknown>(); caches.set(this, cache); }
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log(`[CACHE HIT] ${String(propertyKey)}`);
      return cache.get(key);
    }
    console.log(`[CACHE MISS] ${String(propertyKey)}`);
    const result = original.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
