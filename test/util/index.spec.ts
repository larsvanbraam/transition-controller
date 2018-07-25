import ChildComponentA from './component/ChildComponentA/ChildComponentA';
import ChildComponentB from './component/ChildComponentB/ChildComponentB';
import App from './App';
import { registerComponent } from 'muban-core';
import initComponents from 'muban-core/lib/utils/initComponents';
import cleanElement from 'muban-core/lib/utils/cleanElement';
import getComponentForElement from 'muban-core/lib/utils/getComponentForElement';

export const getDocument = () => {
  const body =  document.createElement('body');
  body.innerHTML = `
      <div id="app" data-component="app-root">
          <section data-component="child-component-a" data-scroll-component class="child-component-a">

            <button data-component="child-component-b"></button>

            <div class="js-loop-animation"></div>

          </section>
      </div>`;

  return <HTMLBodyElement>body;
};

const componentList = [
 ChildComponentB,
 ChildComponentA,
 App,
];

let nodeTemplate = <HTMLElement>getDocument().querySelector('#app');
export let appNode;

export const render = function () {
  appNode = nodeTemplate.cloneNode(true);
  cleanElement(appNode);

  componentList.forEach(function (blockConstructor) {
    registerComponent(blockConstructor);
  });

  initComponents(appNode);
};

export const getComponent = function (displayName: string) {
  const componentElement = <HTMLElement>appNode.querySelector(`[data-component="${displayName}"]`);
  return getComponentForElement(componentElement);
};

export const getApp = function() {
  return getComponentForElement(appNode)
};
