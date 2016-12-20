var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions, RequestMethod, Headers } from '@angular/http';
import { BackendExpectation } from './backend-expectation';
var FakeBackend = (function (_super) {
    __extends(FakeBackend, _super);
    function FakeBackend() {
        var _this = _super.call(this) || this;
        _this._connections = [];
        _this._expectations = [];
        _this.autoRespond = true;
        _this.connections.subscribe(function (connection) {
            _this._connections.push(connection);
            if (_this.autoRespond) {
                _this._verifyExpectation(_this._connections.length - 1);
            }
        });
        return _this;
    }
    FakeBackend.getProviders = function () {
        return [
            FakeBackend,
            BaseRequestOptions,
            {
                provide: Http,
                useFactory: function (backend, defaultOptions) {
                    return new Http(backend, defaultOptions);
                },
                deps: [FakeBackend, BaseRequestOptions]
            }
        ];
    };
    FakeBackend.prototype.setAutoRespond = function (autoRespond) {
        this.autoRespond = autoRespond;
    };
    FakeBackend.prototype.expect = function (method, url, body, headers) {
        return this._addExpectation({
            url: url,
            method: method,
            body: body,
            headers: new Headers(headers)
        });
    };
    FakeBackend.prototype.expectGET = function (url, headers) {
        return this._addExpectation({
            url: url,
            method: RequestMethod.Get,
            headers: new Headers(headers)
        });
    };
    FakeBackend.prototype.expectPost = function (url, body, headers) {
        return this._addExpectation({
            url: url,
            method: RequestMethod.Post,
            body: body,
            headers: new Headers(headers)
        });
    };
    FakeBackend.prototype.expectPut = function (url, body, headers) {
        return this._addExpectation({
            url: url,
            method: RequestMethod.Put,
            body: body,
            headers: new Headers(headers)
        });
    };
    FakeBackend.prototype.expectDelete = function (url, body, headers) {
        return this._addExpectation({
            url: url,
            method: RequestMethod.Delete,
            body: body,
            headers: new Headers(headers)
        });
    };
    FakeBackend.prototype.flush = function () {
        var _this = this;
        this._connections.forEach(function (connection, order) {
            _this._verifyExpectation(order);
        });
    };
    FakeBackend.prototype._addExpectation = function (options) {
        var expectation = new BackendExpectation(options);
        this._expectations.push(expectation);
        return expectation;
    };
    FakeBackend.prototype._verifyExpectation = function (order) {
        this._expectations[order].verify(this._connections[order]);
    };
    return FakeBackend;
}(MockBackend));
export { FakeBackend };
//# sourceMappingURL=fake-backend.js.map