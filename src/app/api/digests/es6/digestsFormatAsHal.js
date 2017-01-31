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
  };

  const createDigestHyperMediaResult = digest => ({
    "_links": {
      "self": {
        "href": href(`/api/${instanceId}/digests/${digest.digestId}`)
      }
    },
    "digestId": digest.digestId,
    "description": digest.description
  });

  if (digests) {
    for(const digest of digests) {
      response._embedded.digests.push(createDigestHyperMediaResult(digest.content.data));
    }
  }

  return response;
};