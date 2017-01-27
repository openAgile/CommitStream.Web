import decoratorFactory from './halDecorators/decoratorFactory'

export default ((href, instanceId, inbox) => {
    let result = {
        "_links": {
            "self": {
                "href": href(`/api/${instanceId}/inboxes/${inbox.inboxId}`)
            },
            "digest-parent": {
                "href": href(`/api/${instanceId}/digests/${inbox.digestId}`)
            },
            "add-commit": {
                "href": href(`/api/${instanceId}/inboxes/${inbox.inboxId}/commits`)
            },
            "inbox-remove": {
                "href": href(`/api/${instanceId}/inboxes/${inbox.inboxId}`)
            }
        },
        "inboxId": inbox.inboxId,
        "family": inbox.family,
        "name": decodeURIComponent(inbox.name),
        "url": inbox.url
    };

    const halDecorator = decoratorFactory.create(inbox.family);
    if(halDecorator) {
        result = halDecorator.decorateHalResponse(result);
    };

    return result;
});
