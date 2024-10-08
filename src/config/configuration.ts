import type { Config, Objectype, Production } from './config.interface';

const util = {
  isObject<T>(value: T): value is T & Objectype {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  },
  merge<T extends Objectype, U extends Objectype>(target: T, source: U): T & U {
    for (const key of Object.keys(source)) {
      const targetValue = target[key];
      const sourceValue = source[key];
      if (this.isObject(targetValue) && this.isObject(sourceValue)) {
        Object.assign(sourceValue, this.merge(targetValue, sourceValue));
      }
    }
    return { ...target, ...source };
  },
};

export const configuration = async (): Promise<Config> => {
  const { config } = await import('./envs/default');

  let environmentConfig: Production;

  switch (process.env.NODE_ENV) {
    case 'production':
      environmentConfig = (await import('./envs/production')).config;
      break;
    case 'development':
      environmentConfig = (await import('./envs/development')).config;
      break;
    case 'test':
      environmentConfig = (await import('./envs/test')).config;
      break;
    default:
      throw new Error(`Unknown environment: ${process.env.NODE_ENV}`);
  }

  return util.merge(config, environmentConfig);
};
