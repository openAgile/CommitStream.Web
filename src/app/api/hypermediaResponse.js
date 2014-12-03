(function(hypermediaResponse) {

	hypermediaResponse.digest = function(protocol, host, digestId) {
    return {
      'id': digestId,
      'digestUrl': protocol + '://' + host + '/api/digest/' + digestId,
      '_links': [
        {
          'href' : protocol + '://' + host + '/api/digest/' + digestId + '/inbox/new',
          'method': 'GET',
          'description': 'Navigate to form for creating an inbox for a repository',
          'rel': 'inbox-form'
        }
      ]
    }
  }

})(module.exports)