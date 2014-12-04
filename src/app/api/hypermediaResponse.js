(function(hypermediaResponse) {

  hypermediaResponse.digest = function(protocol, host, digestId) {
    return {
      'id': digestId,
      'digestUrl': protocol + '://' + host + '/api/digest/' + digestId,
      '_links': [
        {
          'href' : protocol + '://' + host + '/api/digest/' + digestId + '/inbox/new',
          'method': 'GET',
          'description': 'Navigate to form for creating an inbox for a repository on digest ' + digestId,
          'rel': 'inbox-form'
        },
        {
          'href' : protocol + '://' + host + '/api/digest/' + digestId + '/inbox/',
          'method': 'POST',
          'description': 'Create an inbox for a repository on digest ' + digestId,
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
                  'href' : protocol + '://' + host + '/api/digest/new',
                  'method': 'GET',
                  'description': 'Navigate to form for creating digest for a group of inboxes',
                  'rel': 'digest-form'
                }
              ]
           }
  }

})(module.exports)

// see jsonpath, appcatalog has some in it appcatalogentry.schema
// {
//   "digestUrl": "http://host/api/digest/1f1aa47629c44116a3ca08a9bb911309",
//   "_links": [
//     {
//     "href": "http://host/api/digest/1f1aa47629c44116a3ca08a9bb911309/inbox/new",
//     "rel": "inbox",
//     "name": "Navigate to form for creating an inbox for a repository",
//     "method": "GET"
//     }
//   ]
// }


// {
//   'digest' : {
//     'id' : '1f1aa47629c44116a3ca08a9bb911309',
//     'href' : 'http://host/api/digest/',
//     'links' : {
//       'inbox' : {
//         'href' : ''
//       }
//     }
//   }
// }