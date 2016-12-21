import { MockConnection } from '@angular/http/testing';
import { RequestMethod, Headers } from '@angular/http';
export interface BackendExpectationOptions {
    url: string | RegExp;
    method: RequestMethod;
    headers: Headers;
    body?: string | Object;
}
export declare class BackendExpectation {
    private options;
    private _isVerified;
    private _responseOptions?;
    private _responseError?;
    constructor(options: BackendExpectationOptions);
    getIsVerified(): boolean;
    respond(body: string | Object, status?: number, headers?: Headers | {
        [name: string]: any;
    }): void;
    respondWithError(error: string | Error): void;
    verify(connection: MockConnection): void;
    private _verifyConnection(connection);
    private _respond(connection);
}
