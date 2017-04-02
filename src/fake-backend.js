"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/http/testing");
var http_1 = require("@angular/http");
var backend_expectation_1 = require("./backend-expectation");
function isConnectionPending(connection) {
    return connection.readyState === http_1.ReadyState.Open;
}
var FakeBackend = (function (_super) {
    __extends(FakeBackend, _super);
    function FakeBackend() {
        var _this = _super.call(this) || this;
        _this._connections = [];
        _this._expectations = [];
        _this._autoRespond = true;
        _this.connections.subscribe(function (connection) {
            _this._connections.push(connection);
            if (_this._autoRespond) {
                _this._verifyExpectation(_this._connections.length - 1);
            }
        });
        return _this;
    }
    FakeBackend.getProviders = function () {
        return [
            FakeBackend,
            http_1.BaseRequestOptions,
            {
                provide: http_1.Http,
                useFactory: function (backend, defaultOptions) {
                    return new http_1.Http(backend, defaultOptions);
                },
                deps: [FakeBackend, http_1.BaseRequestOptions]
            }
        ];
    };
    FakeBackend.prototype.setAutoRespond = function (autoRespond) {
        this._autoRespond = autoRespond;
    };
    FakeBackend.prototype.expect = function (method, url, body, headers) {
        return this._addExpectation({
            url: url,
            method: method,
            body: body,
            headers: new http_1.Headers(headers)
        });
    };
    FakeBackend.prototype.expectGet = function (url, headers) {
        return this._addExpectation({
            url: url,
            method: http_1.RequestMethod.Get,
            headers: new http_1.Headers(headers)
        });
    };
    FakeBackend.prototype.expectPost = function (url, body, headers) {
        return this._addExpectation({
            url: url,
            method: http_1.RequestMethod.Post,
            body: body,
            headers: new http_1.Headers(headers)
        });
    };
    FakeBackend.prototype.expectPut = function (url, body, headers) {
        return this._addExpectation({
            url: url,
            method: http_1.RequestMethod.Put,
            body: body,
            headers: new http_1.Headers(headers)
        });
    };
    FakeBackend.prototype.expectDelete = function (url, body, headers) {
        return this._addExpectation({
            url: url,
            method: http_1.RequestMethod.Delete,
            body: body,
            headers: new http_1.Headers(headers)
        });
    };
    FakeBackend.prototype.expectPatch = function (url, body, headers) {
        return this._addExpectation({
            url: url,
            method: http_1.RequestMethod.Patch,
            body: body,
            headers: new http_1.Headers(headers)
        });
    };
    FakeBackend.prototype.expectHead = function (url, headers) {
        return this._addExpectation({
            url: url,
            method: http_1.RequestMethod.Head,
            headers: new http_1.Headers(headers)
        });
    };
    FakeBackend.prototype.expectOptions = function (url, headers) {
        return this._addExpectation({
            url: url,
            method: http_1.RequestMethod.Options,
            headers: new http_1.Headers(headers)
        });
    };
    FakeBackend.prototype.flushNext = function () {
        var pendingConnectionIndex = this._connections.findIndex(isConnectionPending);
        this._verifyExpectation(pendingConnectionIndex);
    };
    FakeBackend.prototype.flush = function () {
        var _this = this;
        if (this._connections.length === 0) {
            throw new Error('No connections to flush');
        }
        this._connections.forEach(function (connection, order) {
            _this._verifyExpectation(order);
        });
    };
    FakeBackend.prototype.verifyNoPendingExpectations = function () {
        var notVerifiedExpectations = this._expectations.filter(function (expectation) { return !expectation.getIsVerified(); });
        if (notVerifiedExpectations.length > 0) {
            throw new Error("Pending expectations found: " + notVerifiedExpectations.length);
        }
    };
    FakeBackend.prototype.verifyNoPendingRequests = function () {
        var notVerifiedConnections = this._connections.filter(isConnectionPending);
        if (notVerifiedConnections.length > 0) {
            throw new Error("Pending connections found: " + notVerifiedConnections.length);
        }
    };
    FakeBackend.prototype._addExpectation = function (options) {
        var expectation = new backend_expectation_1.BackendExpectation(options);
        this._expectations.push(expectation);
        return expectation;
    };
    FakeBackend.prototype._verifyExpectation = function (order) {
        if (!this._expectations[order]) {
            throw new Error('No expectation to fulfill');
        }
        if (this._expectations[order].getIsVerified()) {
            return;
        }
        this._expectations[order].verify(this._connections[order]);
    };
    return FakeBackend;
}(testing_1.MockBackend));
exports.FakeBackend = FakeBackend;
//# sourceMappingURL=fake-backend.js.map