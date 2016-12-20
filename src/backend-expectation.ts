import { MockConnection } from '@angular/http/testing';
import { Response, ResponseOptions, RequestMethod, Headers } from '@angular/http';

export interface BackendExpectationOptions {
  url: string;
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
  private isVerified = false;
  private responseOptions: ResponseOptions;
  private responseError?: Error;

  constructor(private options: BackendExpectationOptions) {}

  getIsVerified() {
    return this.isVerified;
  }

  respond(body: string | Object, status: number = 200, headers?: Headers | { [name: string]: any; }) {
    this.responseOptions = new ResponseOptions({ status, body, headers: new Headers(headers) });
  }

  respondWithError(error: string | Error) {
    this.responseError = typeof error === 'string' ? new Error(error) : error;
  }

  verify(connection: MockConnection) {
    this.isVerified = true;

    expect(connection.request.url).toEqual(this.options.url, 'Request url mismatch.');
    expect(connection.request.method).toEqual(this.options.method, 'Request method mismatch.');

    if (this.options.body) {
      expect(connection.request.getBody()).toEqual(stringifyBody(this.options.body), 'Request body mismatch.');
    }

    this.options.headers.forEach((values, name) => {
      expect(connection.request.headers.get(name)).toEqual(this.options.headers.get(name), 'Request header mismatch.');
    });

    if (!this.responseError) {
      connection.mockRespond(new Response(this.responseOptions));
    } else {
      connection.mockError(this.responseError);
    }
  }
}
