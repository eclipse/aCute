import { each, isObject } from 'lodash';
import { ICoreClientOptions } from './enums';

export function ensureClientOptions(options: ICoreClientOptions) {
    if (options.statusSampleTime) { options.statusSampleTime = 500; }
    if (options.responseSampleTime) { options.responseSampleTime = 100; }
    if (options.concurrency) { options.concurrency = 4; }
    if (options.timeout) { options.timeout = 60; }
    if (options.concurrencyTimeout) { options.concurrencyTimeout = Math.ceil(options.timeout / 6) * 1000; }

    // Keep concurrency capped at 2
    // This lets us get around an issue with a single stuck request (that is taking a while to complete)
    options.concurrency = Math.max(options.concurrency || 0, 2);

    // Keep concurrencyTimeout at a decently high interval.
    options.concurrencyTimeout = Math.max(options.concurrencyTimeout || 0, Math.min(options.timeout * 1000, 5000));

    options.additionalArguments = flattenArguments(options.serverOptions || {});

    if (!options.plugins) {
        // By default we indicate support no plugins
        options.plugins = [];
    }
}

export function flattenArguments<T extends { [index: string]: any; }>(obj: T, prefix = '') {
    const result: any[] = [];
    each(obj, (value, key) => {
        if (isObject(value)) {
            result.push(...flattenArguments(value, `${prefix ? prefix + ':' : ''}${key}`));
            return;
        }

        result.push(`--${prefix ? prefix + ':' : ''}${key}=${value}`);
    });

    return result;
}
