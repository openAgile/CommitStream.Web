const decoratorNames = [
  'p4vUiDecorator',
  'svnUiDecorator'
];

const decorators = decoratorNames.map(name => require(`../uiDecorators/${name}`));

class UiDecoratorFactory {
  create(vcsFamily) {
    for(let decorator of decorators) {
      if (decorator.shouldDecorate(vcsFamily)) return decorator;
    }
    return undefined;
  }
}

export default new UiDecoratorFactory();