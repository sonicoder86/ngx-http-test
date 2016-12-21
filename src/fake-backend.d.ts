import { MockBackend } from '@angular/http/testing';
import { RequestMethod, Headers } from '@angular/http';
import { Provider } from '@angular/core';
import { BackendExpectation } from './backend-expectation';
export declare class FakeBackend extends MockBackend {
    private _connections;
    private _expectations;
    private _autoRespond;
    static getProviders(): Provider[];
    constructor();
    setAutoRespond(autoRespond: boolean): void;
    expect(method: RequestMethod, url: string | RegExp, body?: string | Object, headers?: Headers | {
        [name: string]: any;
    }): BackendExpectation;
    expectGet(url: string | RegExp, headers?: Headers | {
        [name: string]: any;
    }): BackendExpectation;
    expectPost(url: string | RegExp, body?: string | Object, headers?: Headers | {
        [name: string]: any;
    }): BackendExpectation;
    expectPut(url: string | RegExp, body?: string | Object, headers?: Headers | {
        [name: string]: any;
    }): BackendExpectation;
    expectDelete(url: string | RegExp, body?: string | Object, headers?: Headers | {
        [name: string]: any;
    }): BackendExpectation;
    expectPatch(url: string | RegExp, body?: string | Object, headers?: Headers | {
        [name: string]: any;
    }): BackendExpectation;
    expectHead(url: string | RegExp, headers?: Headers | {
        [name: string]: any;
    }): BackendExpectation;
    expectOptions(url: string | RegExp, headers?: Headers | {
        [name: string]: any;
    }): BackendExpectation;
    flushNext(): void;
    flush(): void;
    verifyNoPendingExpectations(): void;
    verifyNoPendingRequests(): void;
    private _addExpectation(options);
    private _verifyExpectation(order);
}
