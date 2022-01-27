const getHtmlElementFromNode = (node, isMultiRootComponent) => {
  // we might have a text node fragment that Vue3 uses when the parent element
  // has multiple root nodes. if so, we return the next sibling as we don't want the
  // __draggable_context added to what is essentially an empty, unreachable page element
  if (isMultiRootComponent) {
    node = node.el.nextElementSibling;
  }

  if (node.el) return node.el;
  else return node; // then we probably are returning the nextElementSibling.
};

const addContext = (domElement, context) => (domElement.__draggable_context = context);
const getContext = (domElement) => domElement.__draggable_context;

const getMultiRootComponent = (node) => {
  const nodeType = node.el.nodeType;
  const parentElementCount = node.el.parentElement.childElementCount;
  const parentChildNodesCount = node.el.parentElement.childNodes.length;

  // we might have a text node fragment that Vue3 uses when the parent element
  // has multiple root nodes.
  if (nodeType === 3 && parentElementCount !== parentChildNodesCount) return true;
  return false;
};

class ComponentStructure {
  constructor({ nodes: { header, default: defaultNodes, footer }, root, realList }) {
    this.defaultNodes = defaultNodes;
    this.children = [...header, ...defaultNodes, ...footer];
    this.externalComponent = root.externalComponent;
    this.rootTransition = root.transition;
    this.tag = root.tag;
    this.realList = realList;
    this.isMultiRootComponent = false;
  }

  get _isRootComponent() {
    return this.externalComponent || this.rootTransition;
  }

  get _isMultiRootComponent() {
    const { defaultNodes } = this;
    if (defaultNodes.length > 0) {
      return getMultiRootComponent(defaultNodes[0]);
    }
  }

  render(h, attributes) {
    const { tag, children, _isRootComponent } = this;
    const option = !_isRootComponent ? children : { default: () => children };
    return h(tag, attributes, option);
  }

  updated() {
    const { defaultNodes, realList, _isMultiRootComponent } = this;
    this.isMultiRootComponent = _isMultiRootComponent;
    defaultNodes.forEach((node, index) => {
      addContext(getHtmlElementFromNode(node, this.isMultiRootComponent), {
        element: realList[index],
        index
      });
    });
  }

  getUnderlyingVm(domElement) {
    return getContext(domElement);
  }

  getVmIndexFromDomIndex(domIndex, element) {
    const { defaultNodes } = this;
    const { length } = defaultNodes;
    const domChildren = element.children;
    const domElement = domChildren.item(domIndex);

    if (domElement === null) {
      return length;
    }
    const context = getContext(domElement);
    if (context) {
      return context.index;
    }

    if (length === 0) {
      return 0;
    }
    const firstDomListElement = getHtmlElementFromNode(defaultNodes[0]);
    const indexFirstDomListElement = [...domChildren].findIndex(
      (element) => element === firstDomListElement
    );
    return domIndex < indexFirstDomListElement ? 0 : length;
  }
}

export { ComponentStructure };
