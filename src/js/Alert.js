import { alertMessage, assetUrl } from './utils.mjs';

export default class Alert {
    constructor(jsonPath) {
        this.jsonPath = jsonPath;
        this.init();
    }

    async init() {
        try {
            const response = await fetch(
                assetUrl(this.jsonPath.replace(/^\//, '')),
            );
            if (!response.ok) throw new Error(`Alert: ${response.status}`);
            const data = await response.json();

            if (Array.isArray(data?.messages)) {
                data.messages.forEach((m) => this.#show(m?.message, m?.scroll));
            } else if (typeof data?.message === 'string') {
                this.#show(data.message, data?.scroll);
            }
        } catch (error) {
            // Non-fatal: log and continue
            /* eslint-disable-next-line no-console */
            console.warn('Alert: failed to load', this.jsonPath, error);
        }
    }

    #show(message, scroll = true) {
        if (!message) return;
        alertMessage(message, Boolean(scroll));
    }
}
