import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, RequestMethod, Headers, ReadyState } from '@angular/http';
import { Provider } from '@angular/core';
import { BackendExpectation, BackendExpectationOptions } from './backend-expectation';

function isConnectionPending(connection: MockConnection) {
  return connection.readyState === ReadyState.Open;
}

export class FakeBackend extends MockBackend {
  private _connections: MockConnection[] = [];
  private _expectations: BackendExpectation[] = [];
  private _autoRespond = true;

  public static getProviders(): Provider[] {
    return [
      FakeBackend,
      BaseRequestOptions,
      {
        provide: Http,
        useFactory: (backend: FakeBackend, defaultOptions: BaseRequestOptions) => {
          return new Http(backend, defaultOptions);
        },
        deps: [FakeBackend, BaseRequestOptions]
      }
    ];
  }

  public constructor() {
    super();

    this.connections.subscribe((connection: MockConnection) => {
      this._connections.push(connection);

      if (this._autoRespond) {
        this._verifyExpectation(this._connections.length - 1);
      }
    });
  }

  public setAutoRespond(autoRespond: boolean) {
    this._autoRespond = autoRespond;
  }

  public expect(method: RequestMethod, url: string | RegExp, body?: string | Object, headers?: Headers | { [name: string]: any; }) {
    return this._addExpectation({
      url,
      method,
      body,
      headers: new Headers(headers)
    });
  }

  public expectGet(url: string | RegExp, headers?: Headers | { [name: string]: any; }) {
    return this._addExpectation({
      url,
      method: RequestMethod.Get,
      headers: new Headers(headers)
    });
  }

  public expectPost(url: string | RegExp, body?: string | Object, headers?: Headers | { [name: string]: any; }) {
    return this._addExpectation({
      url,
      method: RequestMethod.Post,
      body,
      headers: new Headers(headers)
    });
  }

  public expectPut(url: string | RegExp, body?: string | Object, headers?: Headers | { [name: string]: any; }) {
    return this._addExpectation({
      url,
      method: RequestMethod.Put,
      body,
      headers: new Headers(headers)
    });
  }

  public expectDelete(url: string | RegExp, body?: string | Object, headers?: Headers | { [name: string]: any; }) {
    return this._addExpectation({
      url,
      method: RequestMethod.Delete,
      body,
      headers: new Headers(headers)
    });
  }

  public expectPatch(url: string | RegExp, body?: string | Object, headers?: Headers | { [name: string]: any; }) {
    return this._addExpectation({
      url,
      method: RequestMethod.Patch,
      body,
      headers: new Headers(headers)
    });
  }

  public expectHead(url: string | RegExp, headers?: Headers | { [name: string]: any; }) {
    return this._addExpectation({
      url,
      method: RequestMethod.Head,
      headers: new Headers(headers)
    });
  }

  public expectOptions(url: string | RegExp, headers?: Headers | { [name: string]: any; }) {
    return this._addExpectation({
      url,
      method: RequestMethod.Options,
      headers: new Headers(headers)
    });
  }

  public flushNext() {
    let pendingConnectionIndex = this._connections.findIndex(isConnectionPending);
    this._verifyExpectation(pendingConnectionIndex);
  }

  public flush() {
    if (this._connections.length === 0) {
      throw new Error('No connections to flush');
    }

    this._connections.forEach((connection, order) => {
      this._verifyExpectation(order);
    });
  }

  public verifyNoPendingExpectations() {
    let notVerifiedExpectations = this._expectations.filter((expectation: BackendExpectation) => !expectation.getIsVerified());

    if (notVerifiedExpectations.length > 0) {
      throw new Error(`Pending expectations found: ${notVerifiedExpectations.length}`);
    }
  }

  public verifyNoPendingRequests() {
    let notVerifiedConnections = this._connections.filter(isConnectionPending);

    if (notVerifiedConnections.length > 0) {
      throw new Error(`Pending connections found: ${notVerifiedConnections.length}`);
    }
  }

  private _addExpectation(options: BackendExpectationOptions) {
    let expectation = new BackendExpectation(options);
    this._expectations.push(expectation);
    return expectation;
  }

  private _verifyExpectation(order: number) {
    if (!this._expectations[order]) {
      throw new Error('No expectation to fulfill');
    }

    if (this._expectations[order].getIsVerified()) {
      return;
    }

    this._expectations[order].verify(
      this._connections[order]
    );
  }
}
