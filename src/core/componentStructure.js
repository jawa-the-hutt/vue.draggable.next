const getHtmlElementFromNode = node => {
  const nodeType = node.el.nodeType;
  const parentElementCount = node.el.parentElement.childElementCount;
  const parentChildNodesCount = node.el.parentElement.childNodes.length;

  // we might have a text node fragment that Vue3 uses when the parent element
  // has multiple root nodes.  For instance:
  //
  // <draggable v-model="rowData" tag="tbody" item-key="id">
  //   <template #item="{ element, index }">
  //     <table-row
  //       :row="element"
  //       :index="index
  //     />
  //   </template>
  // </draggable>
  //
  // so we test for it here and if so, we return the next sibling as we don't want the
  // __draggable_context added to what is essentially an empty, unreachable page element
  if (nodeType === 3 && parentElementCount !== parentChildNodesCount) {
    node = node.el.nextElementSibling;
  }

  if (node.el) return node.el;
  else return node; // then we probably are returning the nextSibling.
};
const addContext = (domElement, context) =>
  (domElement.__draggable_context = context);
const getContext = domElement => domElement.__draggable_context;

class ComponentStructure {
  constructor({
    nodes: { header, default: defaultNodes, footer },
    root,
    realList
  }) {
    this.defaultNodes = defaultNodes;
    this.children = [...header, ...defaultNodes, ...footer];
    this.externalComponent = root.externalComponent;
    this.rootTransition = root.transition;
    this.tag = root.tag;
    this.realList = realList;
  }

  get _isRootComponent() {
    return this.externalComponent || this.rootTransition;
  }

  render(h, attributes) {
    const { tag, children, _isRootComponent } = this;
    const option = !_isRootComponent ? children : { default: () => children };
    return h(tag, attributes, option);
  }

  updated() {
    const { defaultNodes, realList } = this;
    defaultNodes.forEach((node, index) => {
      addContext(getHtmlElementFromNode(node), {
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
      element => element === firstDomListElement
    );
    return domIndex < indexFirstDomListElement ? 0 : length;
  }
}

export { ComponentStructure };
