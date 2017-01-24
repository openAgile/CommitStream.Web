export default (href, instance) => {
    const formatted = {
        "_links": {
            "self": {
                "href": href("/api/instances/" + instance.instanceId)
            },
            "digests": {
                "href": href("/api/" + instance.instanceId + "/digests")
            },
            "digest-create": {
                "href": href("/api/" + instance.instanceId + "/digests"),
                "method": "POST",
                "title": "Endpoint for creating a digest on instance " + instance.instanceId + "."
            }
        },
        "instanceId": instance.instanceId,
        "apiKey": instance.apiKey
    };
    return formatted;
}