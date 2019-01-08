const responderNames = [
  'tfsGitResponder'
];

const responders = responderNames.map(name => require(`../responders/${name}`));
class ResponderFactory {

  create(req) {
    
    for(let responder of responders) {
      if (responder.canRespond(req)) return responder;
    }
    return undefined;
  }
  
}

export default new ResponderFactory();