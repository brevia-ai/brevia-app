import type { StorageAdapterInterface } from '@atlasconsulting/bedita-sdk';
import type { SessionData } from 'h3';

export interface SessionManager {
  readonly id: string | undefined;
  readonly data: SessionData;
  update: (update: SessionData) => Promise<SessionManager>;
  clear: () => Promise<SessionManager>;
}

export default class SessionStorageAdapter implements StorageAdapterInterface {
  /**
   * The session manager
   */
  #session: SessionManager;

  constructor(session: SessionManager) {
    this.#session = session;
  }

  get(key: string): Promise<any> {
    return Promise.resolve(this.#session?.data?.[key]);
  }

  async set(key: string, value: any): Promise<any> {
    const data = this.#session.data;
    data[key] = value;
    await this.#session.update(data);

    return Promise.resolve();
  }

  async remove(key: string): Promise<any> {
    const data = this.#session.data;
    delete data?.[key];
    await this.#session.update(data);

    return Promise.resolve();
  }

  async empty(): Promise<boolean> {
    await this.#session.clear();

    return Promise.resolve(true);
  }
}
