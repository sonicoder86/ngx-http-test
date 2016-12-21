"use strict";
var http_1 = require("@angular/http");
function stringifyBody(body) {
    return typeof body === 'string'
        ? body
        : JSON.stringify(body, null, 2);
}
var BackendExpectation = (function () {
    function BackendExpectation(options) {
        this.options = options;
        this._isVerified = false;
    }
    BackendExpectation.prototype.getIsVerified = function () {
        return this._isVerified;
    };
    BackendExpectation.prototype.respond = function (body, status, headers) {
        if (status === void 0) { status = 200; }
        this._responseOptions = new http_1.ResponseOptions({ status: status, body: body, headers: new http_1.Headers(headers) });
    };
    BackendExpectation.prototype.respondWithError = function (error) {
        this._responseError = typeof error === 'string' ? new Error(error) : error;
    };
    BackendExpectation.prototype.verify = function (connection) {
        this._isVerified = true;
        this._verifyConnection(connection);
        this._respond(connection);
    };
    BackendExpectation.prototype._verifyConnection = function (connection) {
        var _this = this;
        expect(connection.request.url).toMatch(this.options.url, 'Request url mismatch.');
        expect(connection.request.method).toEqual(this.options.method, 'Request method mismatch.');
        if (this.options.body) {
            expect(connection.request.getBody()).toEqual(stringifyBody(this.options.body), 'Request body mismatch.');
        }
        this.options.headers.forEach(function (values, name) {
            expect(connection.request.headers.get(name)).toEqual(_this.options.headers.get(name), 'Request header mismatch.');
        });
    };
    BackendExpectation.prototype._respond = function (connection) {
        if (this._responseError) {
            return connection.mockError(this._responseError);
        }
        if (!this._responseOptions) {
            var responseOptions = new http_1.ResponseOptions({ status: 200, body: '' });
            return connection.mockRespond(new http_1.Response(responseOptions));
        }
        connection.mockRespond(new http_1.Response(this._responseOptions));
    };
    return BackendExpectation;
}());
exports.BackendExpectation = BackendExpectation;
//# sourceMappingURL=backend-expectation.js.map