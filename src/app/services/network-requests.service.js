'use strict';

angular.module('myApp').service('networkRequestsService', [function() {

    this.getRelevantRequestDetails = getRelevantRequestDetails;
    this.getStubbyMocksData = getStubbyMocksData;
    this.getStubbyProxiesData = getStubbyProxiesData;

    return this;

    function getRelevantRequestDetails(request) {
        let bodyObj = request.response.body.toString();
        bodyObj = JSON.parse(bodyObj);
        let splitRequestHeadersText = request.params.response.requestHeadersText.split(' '); 
        let requestMethod = splitRequestHeadersText[0];
        let requestEndpoint = splitRequestHeadersText[1];
        return {
            request: {
                id: request.params.requestId,
                url: request.params.response.url,
                timestamp: request.params.response.timestamp,
                type: request.params.response.type,
                mimeType: request.params.response.mimeType,
                remoteIPAddress: request.params.response.remoteIPAddress,
                remotePort: request.params.response.remotePort,
                headers: request.params.response.requestHeaders,
                server: request.params.response.headers.Server,
                method: requestMethod,
                endpoint: requestEndpoint
            },
            response: {
                status: request.params.response.status,
                statusText: request.params.response.statusText,
                body: bodyObj,
                headers: request.params.response.headers
            }
        };
    }

    function getStubbyMocksData(item) {
        let retObj = {
            "request": {
                "url" : item.details.request.url,
                "method": item.details.request.method
            },
            "response": {
                "status": item.details.response.status,
                "headers": {
                    "Access-Control-Allow-Origin": item.details.response.headers['Access-Control-Allow-Origin'],
                    "Content-Type": item.details.response.headers['Content-Type']
                },
                "body": item.details.response.body
            }
        };
        return retObj;
    }

    function getStubbyProxiesData(item) {
        let retObj = {
            "regex": "REGEX for " + item.details.request.endpoint,
            "endpoint": item.details.request.endpoint
        };
        return retObj;
    }

}]);