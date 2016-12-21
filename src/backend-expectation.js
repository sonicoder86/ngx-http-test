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
        this.isVerified = false;
    }
    BackendExpectation.prototype.getIsVerified = function () {
        return this.isVerified;
    };
    BackendExpectation.prototype.respond = function (body, status, headers) {
        if (status === void 0) { status = 200; }
        this.responseOptions = new http_1.ResponseOptions({ status: status, body: body, headers: new http_1.Headers(headers) });
    };
    BackendExpectation.prototype.respondWithError = function (error) {
        this.responseError = typeof error === 'string' ? new Error(error) : error;
    };
    BackendExpectation.prototype.verify = function (connection) {
        var _this = this;
        this.isVerified = true;
        expect(connection.request.url).toEqual(this.options.url, 'Request url mismatch.');
        expect(connection.request.method).toEqual(this.options.method, 'Request method mismatch.');
        if (this.options.body) {
            expect(connection.request.getBody()).toEqual(stringifyBody(this.options.body), 'Request body mismatch.');
        }
        this.options.headers.forEach(function (values, name) {
            expect(connection.request.headers.get(name)).toEqual(_this.options.headers.get(name), 'Request header mismatch.');
        });
        if (this.responseError) {
            return connection.mockError(this.responseError);
        }
        if (!this.responseOptions) {
            var responseOptions = new http_1.ResponseOptions({ status: 200, body: '' });
            return connection.mockRespond(new http_1.Response(responseOptions));
        }
        connection.mockRespond(new http_1.Response(this.responseOptions));
    };
    return BackendExpectation;
}());
exports.BackendExpectation = BackendExpectation;
//# sourceMappingURL=backend-expectation.js.map