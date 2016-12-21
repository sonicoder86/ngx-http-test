import { MockBackend } from '@angular/http/testing';
import { RequestMethod, Headers } from '@angular/http';
import { Provider } from '@angular/core';
import { BackendExpectation } from './backend-expectation';
export declare class FakeBackend extends MockBackend {
    private _connections;
    private _expectations;
    autoRespond: boolean;
    static getProviders(): Provider[];
    constructor();
    setAutoRespond(autoRespond: boolean): void;
    expect(method: RequestMethod, url: string, body?: string | Object, headers?: Headers | {
        [name: string]: any;
    }): BackendExpectation;
    expectGet(url: string, headers?: Headers | {
        [name: string]: any;
    }): BackendExpectation;
    expectPost(url: string, body?: string | Object, headers?: Headers | {
        [name: string]: any;
    }): BackendExpectation;
    expectPut(url: string, body?: string | Object, headers?: Headers | {
        [name: string]: any;
    }): BackendExpectation;
    expectDelete(url: string, body?: string | Object, headers?: Headers | {
        [name: string]: any;
    }): BackendExpectation;
    expectPatch(url: string, body?: string | Object, headers?: Headers | {
        [name: string]: any;
    }): BackendExpectation;
    expectHead(url: string, headers?: Headers | {
        [name: string]: any;
    }): BackendExpectation;
    expectOptions(url: string, headers?: Headers | {
        [name: string]: any;
    }): BackendExpectation;
    flush(): void;
    verifyNoPendingExpectations(): void;
    verifyNoPendingRequests(): void;
    private _addExpectation(options);
    private _verifyExpectation(order);
}
