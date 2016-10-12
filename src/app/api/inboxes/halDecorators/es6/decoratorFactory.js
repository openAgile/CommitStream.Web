const decoratorNames = [
  'svnDecorator',
  'p4vDecorator'
];

const decorators = decoratorNames.map(name => require(`../halDecorators/${name}`));

class DecoratorFactory {
  create(vcsFamily) {
    for(let decorator of decorators) {
      if (decorator.shouldDecorate(vcsFamily)) return decorator;
    }
    return undefined;
  }
}

export default new DecoratorFactory();