const responderNames = [
  'tfsGitResponder'
];

const responders = responderNames.map(name => require(`../responders/${name}`));
console.log("here inside responderFactory()");

class ResponderFactory {

  create(req) {
    console.log("here inside responderFactory().create() before the for");
    for(let responder of responders) {
      console.log("here inside responderFactory().create() inside the for");
      if (responder.canRespond(req)) return responder;
    }
    console.log("here inside responderFactory().create() it can't respond");
    return undefined;
  }
  
}

export default new ResponderFactory();