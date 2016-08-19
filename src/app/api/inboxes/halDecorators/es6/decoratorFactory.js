const decoratorNames = [
  'svnDecorator'
];

const decorators = decoratorNames.map(name => require(`../halDecorators/${name}`));

class DecoratorFactory {
  create(family) {
    for(let decorator of decorators) {
      if (decorator.shouldDecorate(family)) return decorator;
    }
    return undefined;
  }
}

export default new DecoratorFactory();