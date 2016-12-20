import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, RequestMethod, Headers } from '@angular/http';
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

  flush() {
    this._connections.forEach((connection, order) => {
      this._verifyExpectation(order);
    });
  }

  private _addExpectation(options: BackendExpectationOptions) {
    let expectation = new BackendExpectation(options);
    this._expectations.push(expectation);
    return expectation;
  }

  private _verifyExpectation(order: number) {
    this._expectations[order].verify(
      this._connections[order]
    );
  }
}
