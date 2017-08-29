'use strict';

angular.module('myApp').service('networkRequestsService', [function() {

    this.getRelevantRequestDetails = getRelevantRequestDetails;

    return this;

    function getRelevantRequestDetails(request) {
        let bodyObj = request.response.body.toString();
        bodyObj = JSON.parse(bodyObj);
        return {
            request: {
                id: request.params.requestId,
                url: request.params.response.url,
                timestamp: request.params.response.timestamp,
                type: request.params.response.type,
                mimeType: request.params.response.mimeType,
                remoteIPAddress: request.params.response.remoteIPAddress,
                remotePort: request.params.response.remotePort,
                headers: request.params.response.requestHeaders
            },
            response: {
                status: request.params.response.status,
                statusText: request.params.response.statusText,
                body: bodyObj,
                headers: request.params.response.headers
            }
        };
    }

}]);