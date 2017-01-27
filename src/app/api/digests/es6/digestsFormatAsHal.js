export default (href, instanceId, digests) => {
const response = {
    "_links": {
      "self": {
        "href": href(`/api/${instanceId}/digests`)
      }
    },
    "count": digests ? digests.length : 0,
    "_embedded": {
      "digests": []
    }
  }

  function createDigestHyperMediaResult(digest) {
    return {
      "_links": {
        "self": {
         "href": href(`api/${instanceId}/digests/${digest.digestId}`);
        }
      },
      "digestId": digest.digestId,
      "description": digest.description
    }
  }

  if (digests) {
    digests.forEach( digest => {
      response._embedded.digests.push(createDigestHyperMediaResult(digest.content.data));
    });
  }

  return response;
};

