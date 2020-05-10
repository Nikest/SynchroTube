import { classNameResolver } from './classNameResolver';

export const cd = (styles: any, method?: string) => (Component) => {
  const render = Component.prototype.render;

  Component.prototype.render = function () {
    return render.call(this, classNameResolver(styles()));
  };

  if (method) {
    const mthd = Component.prototype[method];

    Component.prototype[method] = function () {
      return mthd.call(this, classNameResolver(styles()));
    };
  }

  return Component;
};
