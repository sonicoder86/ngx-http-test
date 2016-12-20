import { MockConnection } from '@angular/http/testing';
import { RequestMethod, Headers } from '@angular/http';
export interface BackendExpectationOptions {
    url: string;
    method: RequestMethod;
    headers: Headers;
    body?: string | Object;
}
export declare class BackendExpectation {
    private options;
    private isVerified;
    private responseOptions;
    private responseError?;
    constructor(options: BackendExpectationOptions);
    getIsVerified(): boolean;
    respond(body: string | Object, status?: number, headers?: Headers | {
        [name: string]: any;
    }): void;
    respondWithError(error: string | Error): void;
    verify(connection: MockConnection): void;
}
