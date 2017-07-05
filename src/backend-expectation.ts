import { MockConnection } from '@angular/http/testing';
import { Response, ResponseOptions, RequestMethod, Headers } from '@angular/http';

export interface BackendExpectationOptions {
  url: string | RegExp;
  method: RequestMethod;
  headers: Headers;
  body?: string | Object;
}

function stringifyBody(body: string | Object) {
  return typeof body === 'string'
    ? body
    : JSON.stringify(body, null, 2);
}

export class BackendExpectation {
  private _isVerified = false;
  private _responseOptions?: ResponseOptions;
  private _responseError?: Error;

  public constructor(private options: BackendExpectationOptions) {}

  public getIsVerified() {
    return this._isVerified;
  }

  public respond(body: string | Object, status: number = 200, headers?: Headers | { [name: string]: any; }) {
    this._responseOptions = new ResponseOptions({ status, body, headers: new Headers(headers) });
  }

  public respondWithError(error: string | Error) {
    this._responseError = typeof error === 'string' ? new Error(error) : error;
  }

  public verify(connection: MockConnection) {
    this._isVerified = true;
    this._verifyConnection(connection);
    this._respond(connection);
  }

  private _verifyConnection(connection: MockConnection) {
    if (typeof this.options.url === 'string') {
      expect(connection.request.url).toEqual(this.options.url, 'Request url mismatch.');
    } else {
      expect(connection.request.url).toMatch(this.options.url, 'Request url mismatch.');
    }
    expect(connection.request.method).toEqual(this.options.method, 'Request method mismatch.');

    if (this.options.body) {
      expect(connection.request.getBody()).toEqual(stringifyBody(this.options.body), 'Request body mismatch.');
    }

    this.options.headers.forEach((_values, name) => {
      expect(connection.request.headers.get(name)).toEqual(this.options.headers.get(name), 'Request header mismatch.');
    });
  }

  private _respond(connection: MockConnection) {
    if (this._responseError) {
      return connection.mockError(this._responseError);
    }

    if (!this._responseOptions) {
      let responseOptions = new ResponseOptions({ status: 200, body: '' });
      return connection.mockRespond(new Response(responseOptions));
    }

    connection.mockRespond(new Response(this._responseOptions));
  }
}
