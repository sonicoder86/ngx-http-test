import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, RequestMethod, Headers, ReadyState } from '@angular/http';
import { Provider } from '@angular/core';
import { BackendExpectation, BackendExpectationOptions } from './backend-expectation';

export class FakeBackend extends MockBackend {
  private _connections: MockConnection[] = [];
  private _expectations: BackendExpectation[] = [];
  autoRespond = true;

  static getProviders(): Provider[] {
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

  constructor() {
    super();

    this.connections.subscribe((connection: MockConnection) => {
      this._connections.push(connection);

      if (this.autoRespond) {
        this._verifyExpectation(this._connections.length - 1);
      }
    });
  }

  setAutoRespond(autoRespond: boolean) {
    this.autoRespond = autoRespond;
  }

  expect(method: RequestMethod, url: string, body?: string | Object, headers?: Headers | { [name: string]: any; }) {
    return this._addExpectation({
      url,
      method,
      body,
      headers: new Headers(headers)
    });
  }

  expectGET(url: string, headers?: Headers | { [name: string]: any; }) {
    return this._addExpectation({
      url,
      method: RequestMethod.Get,
      headers: new Headers(headers)
    });
  }

  expectPost(url: string, body?: string | Object, headers?: Headers | { [name: string]: any; }) {
    return this._addExpectation({
      url,
      method: RequestMethod.Post,
      body,
      headers: new Headers(headers)
    });
  }

  expectPut(url: string, body?: string | Object, headers?: Headers | { [name: string]: any; }) {
    return this._addExpectation({
      url,
      method: RequestMethod.Put,
      body,
      headers: new Headers(headers)
    });
  }

  expectDelete(url: string, body?: string | Object, headers?: Headers | { [name: string]: any; }) {
    return this._addExpectation({
      url,
      method: RequestMethod.Delete,
      body,
      headers: new Headers(headers)
    });
  }

  expectPatch(url: string, body?: string | Object, headers?: Headers | { [name: string]: any; }) {
    return this._addExpectation({
      url,
      method: RequestMethod.Patch,
      body,
      headers: new Headers(headers)
    });
  }

  expectHead(url: string, headers?: Headers | { [name: string]: any; }) {
    return this._addExpectation({
      url,
      method: RequestMethod.Head,
      headers: new Headers(headers)
    });
  }

  expectOptions(url: string, headers?: Headers | { [name: string]: any; }) {
    return this._addExpectation({
      url,
      method: RequestMethod.Options,
      headers: new Headers(headers)
    });
  }

  flush() {
    this._connections.forEach((connection, order) => {
      this._verifyExpectation(order);
    });
  }

  public verifyNoPendingEpectations() {
    let notVerifiedExpectations = this._expectations.filter((expectation: BackendExpectation) => !expectation.getIsVerified());

    if (notVerifiedExpectations.length > 0) {
      throw new Error(`Pending expectations found: ${notVerifiedExpectations.length}`);
    }
  }

  public verifyNoPendingRequests() {
    let notVerifiedConnections = this._connections.filter((connection: MockConnection) => connection.readyState === ReadyState.Open);

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

    this._expectations[order].verify(
      this._connections[order]
    );
  }
}
