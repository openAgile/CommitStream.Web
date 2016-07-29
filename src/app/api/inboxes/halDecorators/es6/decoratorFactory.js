const decoratorNames = [
  'svnDecorator'
];

const decorators = decoratorNames.map(name => require(`../halDecorators/${name}`));

class DecoratorFactory {
  create(req) {
    for(let decorator of decorators) {
      if (decorator.shouldDecorate(req)) return decorator;
    }
    return undefined;
  }
}

export default new DecoratorFactory();