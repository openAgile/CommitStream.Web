const decoratorNames = [
  'svnDecorator'
];

const decorators = decoratorNames.map(name => require(`../halDecorators/${name}`));

class DecoratorFactory {
  create(hypermedia) {
    for(let decorator of decorators) {
      if (decorator.shouldDecorate(hypermedia)) return decorator;
    }
    return undefined;
  }
}

export default new DecoratorFactory();