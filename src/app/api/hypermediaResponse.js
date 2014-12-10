(function(hypermediaResponse) {

  hypermediaResponse.digest = function(protocol, host, digestId) {
    return {
      'id': digestId,
      'digestUrl': protocol + '://' + host + '/api/digests/' + digestId,
      '_links': [
        {
          'href': protocol + '://' + host + '/api/digests',
          'rel': 'self'
        },
        {
          'href' : protocol + '://' + host + '/api/digests/' + digestId + '/inbox/new',
          'method': 'GET',
          'description': 'Navigate to form for creating an inbox for a repository on digest ' + digestId,
          'rel': 'inbox-form'
        },
        {
          'href' : protocol + '://' + host + '/api/digests/' + digestId + '/inbox',
          'method': 'POST',
          'description': 'Endpoint for creating an inbox for a repository on digest ' + digestId,
          'rel': 'inbox-create'
        }
      ]
    }
  }

  hypermediaResponse.inbox = function(protocol, host, inboxId) {
    return {
              'id': inboxId,
              'inboxUrl': protocol + '://' + host + '/api/inbox/' + inboxId,
              '_links': [
              {
                'href': protocol + '://' + host + '/api/inbox',
                'rel': 'self'
              },
              {
                  'href' : protocol + '://' + host + '/api/digest/new',
                  'method': 'GET',
                  'description': 'Navigate to form for creating digest for a group of inboxes',
                  'rel': 'digest-form'
                }
              ]
           }
  }

})(module.exports)