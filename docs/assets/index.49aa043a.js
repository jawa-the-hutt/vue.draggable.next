var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import { resolveComponent, TransitionGroup, defineComponent, h, nextTick, openBlock, createElementBlock, createElementVNode, createVNode, withCtx, toDisplayString, pushScopeId, popScopeId, withDirectives, vModelText, createBlock, vModelCheckbox, normalizeClass, Fragment, renderList, createTextVNode, mergeProps, resolveDynamicComponent, createStaticVNode, createApp } from "vue";
import Sortable from "sortablejs";
import { $, c as createStore, a as createRouter, b as createWebHashHistory, E as ElementPlus } from "./vendor.d35b12d0.js";
const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
function removeNode(node) {
  if (node.parentElement !== null) {
    node.parentElement.removeChild(node);
  }
}
function insertNodeAt(fatherNode, node, position) {
  const refNode = position === 0 ? fatherNode.children[0] : fatherNode.children[position - 1].nextSibling;
  fatherNode.insertBefore(node, refNode);
}
function multiRootComponentOnDragStart(evt) {
  const parent = evt.item.parentNode;
  const currentChildNodes = parent.childNodes;
  const newChildNodes = [];
  const childNodesHoldingGroups = [];
  for (let i = 0; i < currentChildNodes.length; i++) {
    const currentNode = currentChildNodes[i];
    if (currentNode.nodeType === 8) {
      newChildNodes.push(currentNode);
      const childGroupObj = [];
      childNodesHoldingGroups.push(childGroupObj);
      continue;
    }
    if (currentNode.nodeType === 3 && currentNode.nextElementSibling && currentNode.nextElementSibling.__draggable_context) {
      const newParent = currentNode.nextElementSibling;
      newChildNodes.push(newParent);
      const childGroupObj = [currentNode, newParent.nextSibling];
      childNodesHoldingGroups.push(childGroupObj);
      i = i + 2;
    }
  }
  for (let i = 0; i < newChildNodes.length; i++) {
    const currentNode = newChildNodes[i];
    if (currentNode.nodeType === 8)
      continue;
    const newChildren = childNodesHoldingGroups[i];
    for (let j = 0; j < newChildren.length; j++) {
      newChildNodes[i].appendChild(newChildren[j]);
    }
  }
  parent.replaceChildren(...newChildNodes);
}
function multiRootComponentOnDragEnd(evt) {
  const parent = evt.item.parentNode;
  const currentChildNodes = parent.childNodes;
  const newChildNodes = [];
  for (let i = 0; i < currentChildNodes.length; i++) {
    if (currentChildNodes[i].nodeType === 8) {
      newChildNodes.push(currentChildNodes[i]);
      continue;
    }
    const oldChildNodes = [].slice.call(currentChildNodes[i].childNodes);
    const textNodePrepend = oldChildNodes[oldChildNodes.length - 2];
    const textNodeAppend = oldChildNodes[oldChildNodes.length - 1];
    oldChildNodes.splice(oldChildNodes.length - 2, 2);
    currentChildNodes[i].replaceChildren(...oldChildNodes);
    newChildNodes.push(textNodePrepend);
    newChildNodes.push(currentChildNodes[i]);
    newChildNodes.push(textNodeAppend);
  }
  parent.replaceChildren(...newChildNodes);
}
function getConsole() {
  if (typeof window !== "undefined") {
    return window.console;
  }
  return global.console;
}
const console$1 = getConsole();
function cached(fn) {
  const cache = Object.create(null);
  return function cachedFn(str) {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}
const regex = /-(\w)/g;
const camelize = cached((str) => str.replace(regex, (_, c) => c.toUpperCase()));
const manageAndEmit$1 = ["Start", "Add", "Remove", "Update", "End"];
const emit$1 = ["Choose", "Unchoose", "Sort", "Filter", "Clone"];
const manage$1 = ["Move"];
const eventHandlerNames = [manage$1, manageAndEmit$1, emit$1].flatMap((events2) => events2).map((evt) => `on${evt}`);
const events = {
  manage: manage$1,
  manageAndEmit: manageAndEmit$1,
  emit: emit$1
};
function isReadOnly(eventName) {
  return eventHandlerNames.indexOf(eventName) !== -1;
}
const tags = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "math",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rb",
  "rp",
  "rt",
  "rtc",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "slot",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "svg",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr"
];
function isHtmlTag(name) {
  return tags.includes(name);
}
function isTransition(name) {
  return ["transition-group", "TransitionGroup"].includes(name);
}
function isHtmlAttribute(value) {
  return ["id", "class", "role", "style"].includes(value) || value.startsWith("data-") || value.startsWith("aria-") || value.startsWith("on");
}
function project(entries) {
  return entries.reduce((res, [key, value]) => {
    res[key] = value;
    return res;
  }, {});
}
function getComponentAttributes({ ref, $attrs, componentData = {} }) {
  const attributes = project(Object.entries($attrs).filter(([key, _]) => isHtmlAttribute(key)));
  return __spreadValues(__spreadValues({
    ref
  }, attributes), componentData);
}
function createSortableOption({ $attrs, callBackBuilder }) {
  const options = project(getValidSortableEntries($attrs));
  Object.entries(callBackBuilder).forEach(([eventType, eventBuilder]) => {
    events[eventType].forEach((event) => {
      options[`on${event}`] = eventBuilder(event);
    });
  });
  const draggable = `[data-draggable]${options.draggable || ""}`;
  return __spreadProps(__spreadValues({}, options), {
    draggable
  });
}
function getValidSortableEntries(value) {
  return Object.entries(value).filter(([key, _]) => !isHtmlAttribute(key)).map(([key, value2]) => [camelize(key), value2]).filter(([key, _]) => !isReadOnly(key));
}
const getHtmlElementFromNode = (node, isMultiRootComponent) => {
  if (isMultiRootComponent) {
    node = node.el.nextElementSibling;
  }
  if (node.el)
    return node.el;
  else
    return node;
};
const addContext = (domElement, context) => domElement.__draggable_context = context;
const getContext = (domElement) => domElement.__draggable_context;
const getMultiRootComponent = (node) => {
  const nodeType = node.el.nodeType;
  const parentElementCount = node.el.parentElement.childElementCount;
  const parentChildNodesCount = node.el.parentElement.childNodes.length;
  if (nodeType === 3 && parentElementCount !== parentChildNodesCount)
    return true;
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
  render(h2, attributes) {
    const { tag, children, _isRootComponent } = this;
    const option = !_isRootComponent ? children : { default: () => children };
    return h2(tag, attributes, option);
  }
  updated() {
    const { defaultNodes, realList, _isMultiRootComponent } = this;
    this.isMultiRootComponent = _isMultiRootComponent;
    defaultNodes.forEach((node, index2) => {
      addContext(getHtmlElementFromNode(node, this.isMultiRootComponent), {
        element: realList[index2],
        index: index2
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
    const indexFirstDomListElement = [...domChildren].findIndex((element2) => element2 === firstDomListElement);
    return domIndex < indexFirstDomListElement ? 0 : length;
  }
}
function getSlot(slots, key) {
  const slotValue = slots[key];
  return slotValue ? slotValue() : [];
}
function computeNodes({ $slots, realList, getKey }) {
  const normalizedList = realList || [];
  const [header, footer] = ["header", "footer"].map((name) => getSlot($slots, name));
  const { item } = $slots;
  if (!item) {
    throw new Error("draggable element must have an item slot");
  }
  const defaultNodes = normalizedList.flatMap((element, index2) => item({ element, index: index2 }).map((node) => {
    node.key = getKey(element);
    node.props = __spreadProps(__spreadValues({}, node.props || {}), { "data-draggable": true });
    return node;
  }));
  if (defaultNodes.length !== normalizedList.length) {
    throw new Error("Item slot must have only one child");
  }
  return {
    header,
    footer,
    default: defaultNodes
  };
}
function getRootInformation(tag) {
  const transition = isTransition(tag);
  const externalComponent = !isHtmlTag(tag) && !transition;
  return {
    transition,
    externalComponent,
    tag: externalComponent ? resolveComponent(tag) : transition ? TransitionGroup : tag
  };
}
function computeComponentStructure({ $slots, tag, realList, getKey }) {
  const nodes = computeNodes({ $slots, realList, getKey });
  const root = getRootInformation(tag);
  return new ComponentStructure({ nodes, root, realList });
}
function emit(evtName, evtData) {
  nextTick(() => this.$emit(evtName.toLowerCase(), evtData));
}
function manage(evtName) {
  return (evtData, originalElement) => {
    if (this.realList !== null) {
      return this[`onDrag${evtName}`](evtData, originalElement);
    }
  };
}
function manageAndEmit(evtName) {
  const delegateCallBack = manage.call(this, evtName);
  return (evtData, originalElement) => {
    delegateCallBack.call(this, evtData, originalElement);
    emit.call(this, evtName, evtData);
  };
}
let draggingElement = null;
const props$1 = {
  list: {
    type: Array,
    required: false,
    default: null
  },
  modelValue: {
    type: Array,
    required: false,
    default: null
  },
  itemKey: {
    type: [String, Function],
    required: true
  },
  clone: {
    type: Function,
    default: (original) => {
      return original;
    }
  },
  tag: {
    type: String,
    default: "div"
  },
  move: {
    type: Function,
    default: null
  },
  componentData: {
    type: Object,
    required: false,
    default: null
  }
};
const emits = [
  "update:modelValue",
  "change",
  ...[...events.manageAndEmit, ...events.emit].map((evt) => evt.toLowerCase())
];
const draggableComponent = defineComponent({
  name: "draggable",
  inheritAttrs: false,
  props: props$1,
  emits,
  data() {
    return {
      error: false
    };
  },
  render() {
    try {
      this.error = false;
      const { $slots, $attrs, tag, componentData, realList, getKey } = this;
      const componentStructure = computeComponentStructure({
        $slots,
        tag,
        realList,
        getKey
      });
      this.componentStructure = componentStructure;
      const attributes = getComponentAttributes({ ref: "el", $attrs, componentData });
      return componentStructure.render(h, attributes);
    } catch (err) {
      this.error = true;
      return h("pre", { style: { color: "red" } }, err.stack);
    }
  },
  created() {
    if (this.list !== null && this.modelValue !== null) {
      console$1.error("modelValue and list props are mutually exclusive! Please set one or another.");
    }
  },
  mounted() {
    if (this.error) {
      return;
    }
    const { $attrs, componentStructure } = this;
    componentStructure.updated();
    const sortableOptions = createSortableOption({
      $attrs,
      callBackBuilder: {
        manageAndEmit: (event) => manageAndEmit.call(this, event),
        emit: (event) => emit.bind(this, event),
        manage: (event) => manage.call(this, event)
      }
    });
    let el = this.$refs.el;
    if (componentStructure.externalComponent || componentStructure.rootTransition) {
      el = el.$el;
    }
    const targetDomElement = el.nodeType === 1 ? el : el.parentElement;
    this._sortable = new Sortable(targetDomElement, sortableOptions);
    this.targetDomElement = targetDomElement;
    targetDomElement.__draggable_component__ = this;
  },
  updated() {
    this.componentStructure.updated();
  },
  beforeUnmount() {
    if (this._sortable !== void 0)
      this._sortable.destroy();
  },
  computed: {
    realList() {
      const { list } = this;
      return list ? list : this.modelValue;
    },
    getKey() {
      const { itemKey } = this;
      if (typeof itemKey === "function") {
        return itemKey;
      }
      return (element) => element[itemKey];
    }
  },
  watch: {
    $attrs: {
      handler(newOptionValue) {
        const { _sortable } = this;
        if (!_sortable)
          return;
        getValidSortableEntries(newOptionValue).forEach(([key, value]) => {
          _sortable.option(key, value);
        });
      },
      deep: true
    }
  },
  methods: {
    getUnderlyingVm(domElement) {
      return this.componentStructure.getUnderlyingVm(domElement) || null;
    },
    getUnderlyingPotencialDraggableComponent(htmElement) {
      return htmElement.__draggable_component__;
    },
    emitChanges(evt) {
      nextTick(() => this.$emit("change", evt));
    },
    alterList(onList) {
      if (this.list) {
        onList(this.list);
        return;
      }
      const newList = [...this.modelValue];
      onList(newList);
      this.$emit("update:modelValue", newList);
    },
    spliceList() {
      const spliceList = (list) => list.splice(...arguments);
      this.alterList(spliceList);
    },
    updatePosition(oldIndex, newIndex) {
      const updatePosition = (list) => list.splice(newIndex, 0, list.splice(oldIndex, 1)[0]);
      this.alterList(updatePosition);
    },
    getRelatedContextFromMoveEvent({ to, related }) {
      const component = this.getUnderlyingPotencialDraggableComponent(to);
      if (!component) {
        return { component };
      }
      const list = component.realList;
      const context = { list, component };
      if (to !== related && list) {
        const destination = component.getUnderlyingVm(related) || {};
        return __spreadValues(__spreadValues({}, destination), context);
      }
      return context;
    },
    getVmIndexFromDomIndex(domIndex) {
      return this.componentStructure.getVmIndexFromDomIndex(domIndex, this.targetDomElement);
    },
    onDragStart(evt) {
      if (this.componentStructure.isMultiRootComponent)
        multiRootComponentOnDragStart(evt);
      this.context = this.getUnderlyingVm(evt.item);
      evt.item._underlying_vm_ = this.clone(this.context.element);
      draggingElement = evt.item;
    },
    onDragAdd(evt) {
      const element = evt.item._underlying_vm_;
      if (element === void 0) {
        return;
      }
      removeNode(evt.item);
      const newIndex = this.getVmIndexFromDomIndex(evt.newIndex);
      this.spliceList(newIndex, 0, element);
      const added = { element, newIndex };
      this.emitChanges({ added });
    },
    onDragRemove(evt) {
      insertNodeAt(this.$el, evt.item, evt.oldIndex);
      if (evt.pullMode === "clone") {
        removeNode(evt.clone);
        return;
      }
      const { index: oldIndex, element } = this.context;
      this.spliceList(oldIndex, 1);
      const removed = { element, oldIndex };
      this.emitChanges({ removed });
    },
    onDragUpdate(evt) {
      removeNode(evt.item);
      insertNodeAt(evt.from, evt.item, evt.oldIndex);
      const oldIndex = this.context.index;
      const newIndex = this.getVmIndexFromDomIndex(evt.newIndex);
      this.updatePosition(oldIndex, newIndex);
      const moved = { element: this.context.element, oldIndex, newIndex };
      this.emitChanges({ moved });
    },
    computeFutureIndex(relatedContext, evt) {
      if (!relatedContext.element) {
        return 0;
      }
      const domChildren = [...evt.to.children].filter((el) => el.style["display"] !== "none");
      const currentDomIndex = domChildren.indexOf(evt.related);
      const currentIndex = relatedContext.component.getVmIndexFromDomIndex(currentDomIndex);
      const draggedInList = domChildren.indexOf(draggingElement) !== -1;
      return draggedInList || !evt.willInsertAfter ? currentIndex : currentIndex + 1;
    },
    onDragMove(evt, originalEvent) {
      const { move, realList } = this;
      if (!move || !realList) {
        return true;
      }
      const relatedContext = this.getRelatedContextFromMoveEvent(evt);
      const futureIndex = this.computeFutureIndex(relatedContext, evt);
      const draggedContext = __spreadProps(__spreadValues({}, this.context), {
        futureIndex
      });
      const sendEvent = __spreadProps(__spreadValues({}, evt), {
        relatedContext,
        draggedContext
      });
      return move(sendEvent, originalEvent);
    },
    onDragEnd(evt) {
      if (this.componentStructure.isMultiRootComponent)
        multiRootComponentOnDragEnd(evt);
      draggingElement = null;
    }
  }
});
var draggableList_vue_vue_type_style_index_0_scoped_true_lang = "";
var _export_sfc = (sfc, props2) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props2) {
    target[key] = val;
  }
  return target;
};
var futureIndex_vue_vue_type_style_index_0_scoped_true_lang = "";
var slotExample_vue_vue_type_style_index_0_scoped_true_lang = "";
let idGlobal$1 = 8;
const _sfc_main$h = {
  name: "clone-on-control",
  display: "Clone on Control",
  instruction: "Press Ctrl to clone element from list 1",
  order: 4,
  components: {
    draggable: draggableComponent
  },
  data() {
    return {
      list1: [
        { name: "Jesus", id: 1 },
        { name: "Paul", id: 2 },
        { name: "Peter", id: 3 }
      ],
      list2: [
        { name: "Luc", id: 5 },
        { name: "Thomas", id: 6 },
        { name: "John", id: 7 }
      ],
      controlOnStart: true
    };
  },
  methods: {
    clone({ name }) {
      return { name, id: idGlobal$1++ };
    },
    pullFunction() {
      return this.controlOnStart ? "clone" : true;
    },
    start({ originalEvent }) {
      this.controlOnStart = originalEvent.ctrlKey;
    }
  }
};
const _hoisted_1$f = { class: "row" };
const _hoisted_2$f = { class: "col-3" };
const _hoisted_3$f = /* @__PURE__ */ createElementVNode("h3", null, "Draggable 1", -1);
const _hoisted_4$d = { class: "list-group-item" };
const _hoisted_5$d = { class: "col-3" };
const _hoisted_6$c = /* @__PURE__ */ createElementVNode("h3", null, "Draggable 2", -1);
const _hoisted_7$7 = { class: "list-group-item" };
function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_draggable = resolveComponent("draggable");
  const _component_rawDisplayer = resolveComponent("rawDisplayer");
  return openBlock(), createElementBlock("div", _hoisted_1$f, [
    createElementVNode("div", _hoisted_2$f, [
      _hoisted_3$f,
      createVNode(_component_draggable, {
        class: "dragArea list-group",
        list: $data.list1,
        clone: $options.clone,
        group: { name: "people", pull: $options.pullFunction },
        onStart: $options.start,
        "item-key": "id"
      }, {
        item: withCtx(({ element }) => [
          createElementVNode("div", _hoisted_4$d, toDisplayString(element.name), 1)
        ]),
        _: 1
      }, 8, ["list", "clone", "group", "onStart"])
    ]),
    createElementVNode("div", _hoisted_5$d, [
      _hoisted_6$c,
      createVNode(_component_draggable, {
        class: "dragArea list-group",
        list: $data.list2,
        group: "people",
        "item-key": "id"
      }, {
        item: withCtx(({ element }) => [
          createElementVNode("div", _hoisted_7$7, toDisplayString(element.name), 1)
        ]),
        _: 1
      }, 8, ["list"])
    ]),
    createVNode(_component_rawDisplayer, {
      class: "col-3",
      value: $data.list1,
      title: "List 1"
    }, null, 8, ["value"]),
    createVNode(_component_rawDisplayer, {
      class: "col-3",
      value: $data.list2,
      title: "List 2"
    }, null, 8, ["value"])
  ]);
}
var cloneOnControl = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$h]]);
var __glob_0_0 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": cloneOnControl
});
const _sfc_main$g = {
  name: "clone",
  display: "Clone",
  order: 2,
  components: {
    draggable: draggableComponent
  },
  data() {
    return {
      list1: [
        { name: "John", id: 1 },
        { name: "Joao", id: 2 },
        { name: "Jean", id: 3 },
        { name: "Gerard", id: 4 }
      ],
      list2: [
        { name: "Juan", id: 5 },
        { name: "Edgard", id: 6 },
        { name: "Johnson", id: 7 }
      ]
    };
  },
  methods: {
    log(evt) {
      window.console.log(evt);
    }
  }
};
const _hoisted_1$e = { class: "row" };
const _hoisted_2$e = { class: "col-3" };
const _hoisted_3$e = /* @__PURE__ */ createElementVNode("h3", null, "Draggable 1", -1);
const _hoisted_4$c = { class: "list-group-item" };
const _hoisted_5$c = { class: "col-3" };
const _hoisted_6$b = /* @__PURE__ */ createElementVNode("h3", null, "Draggable 2", -1);
const _hoisted_7$6 = { class: "list-group-item" };
function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_draggable = resolveComponent("draggable");
  const _component_rawDisplayer = resolveComponent("rawDisplayer");
  return openBlock(), createElementBlock("div", _hoisted_1$e, [
    createElementVNode("div", _hoisted_2$e, [
      _hoisted_3$e,
      createVNode(_component_draggable, {
        class: "dragArea list-group",
        list: $data.list1,
        group: { name: "people", pull: "clone", put: false },
        onChange: $options.log,
        "item-key": "name"
      }, {
        item: withCtx(({ element }) => [
          createElementVNode("div", _hoisted_4$c, toDisplayString(element.name), 1)
        ]),
        _: 1
      }, 8, ["list", "onChange"])
    ]),
    createElementVNode("div", _hoisted_5$c, [
      _hoisted_6$b,
      createVNode(_component_draggable, {
        class: "dragArea list-group",
        list: $data.list2,
        group: "people",
        onChange: $options.log,
        "item-key": "name"
      }, {
        item: withCtx(({ element }) => [
          createElementVNode("div", _hoisted_7$6, toDisplayString(element.name), 1)
        ]),
        _: 1
      }, 8, ["list", "onChange"])
    ]),
    createVNode(_component_rawDisplayer, {
      class: "col-3",
      value: $data.list1,
      title: "List 1"
    }, null, 8, ["value"]),
    createVNode(_component_rawDisplayer, {
      class: "col-3",
      value: $data.list2,
      title: "List 2"
    }, null, 8, ["value"])
  ]);
}
var clone = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$g]]);
var __glob_0_1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": clone
});
let idGlobal = 8;
const _sfc_main$f = {
  name: "custom-clone",
  display: "Custom Clone",
  order: 3,
  components: {
    draggable: draggableComponent
  },
  data() {
    return {
      list1: [
        { name: "dog 1", id: 1 },
        { name: "dog 2", id: 2 },
        { name: "dog 3", id: 3 },
        { name: "dog 4", id: 4 }
      ],
      list2: [
        { name: "cat 5", id: 5 },
        { name: "cat 6", id: 6 },
        { name: "cat 7", id: 7 }
      ]
    };
  },
  methods: {
    log(evt) {
      window.console.log(evt);
    },
    cloneDog({ id: id2 }) {
      return {
        id: idGlobal++,
        name: `cat ${id2}`
      };
    }
  }
};
const _hoisted_1$d = { class: "row" };
const _hoisted_2$d = { class: "col-3" };
const _hoisted_3$d = /* @__PURE__ */ createElementVNode("h3", null, "Draggable 1", -1);
const _hoisted_4$b = { class: "list-group-item" };
const _hoisted_5$b = { class: "col-3" };
const _hoisted_6$a = /* @__PURE__ */ createElementVNode("h3", null, "Draggable 2", -1);
const _hoisted_7$5 = { class: "list-group-item" };
function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_draggable = resolveComponent("draggable");
  const _component_rawDisplayer = resolveComponent("rawDisplayer");
  return openBlock(), createElementBlock("div", _hoisted_1$d, [
    createElementVNode("div", _hoisted_2$d, [
      _hoisted_3$d,
      createVNode(_component_draggable, {
        class: "dragArea list-group",
        list: $data.list1,
        group: { name: "people", pull: "clone", put: false },
        clone: $options.cloneDog,
        onChange: $options.log,
        "item-key": "id"
      }, {
        item: withCtx(({ element }) => [
          createElementVNode("div", _hoisted_4$b, toDisplayString(element.name), 1)
        ]),
        _: 1
      }, 8, ["list", "clone", "onChange"])
    ]),
    createElementVNode("div", _hoisted_5$b, [
      _hoisted_6$a,
      createVNode(_component_draggable, {
        class: "dragArea list-group",
        list: $data.list2,
        group: "people",
        onChange: $options.log,
        "item-key": "id"
      }, {
        item: withCtx(({ element }) => [
          createElementVNode("div", _hoisted_7$5, toDisplayString(element.name), 1)
        ]),
        _: 1
      }, 8, ["list", "onChange"])
    ]),
    createVNode(_component_rawDisplayer, {
      class: "col-3",
      value: $data.list1,
      title: "List 1"
    }, null, 8, ["value"]),
    createVNode(_component_rawDisplayer, {
      class: "col-3",
      value: $data.list2,
      title: "List 2"
    }, null, 8, ["value"])
  ]);
}
var customClone = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$f]]);
var __glob_0_2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": customClone
});
var footerslot_vue_vue_type_style_index_0_scoped_true_lang = "";
let id$4 = 1;
const _sfc_main$e = {
  name: "footerslot",
  display: "Footer slot",
  order: 12,
  components: {
    draggable: draggableComponent
  },
  data() {
    return {
      list: [
        { name: "John", id: 0 },
        { name: "Joao", id: 1 },
        { name: "Jean", id: 2 }
      ],
      dragging: false,
      componentData: {
        type: "transition",
        name: "flip-list"
      }
    };
  },
  methods: {
    add() {
      this.list.push({ name: "Juan " + id$4, id: id$4++ });
    },
    replace() {
      this.list = [{ name: "Edgard", id: id$4++ }];
    }
  }
};
const _withScopeId$4 = (n) => (pushScopeId("data-v-7e0cbd14"), n = n(), popScopeId(), n);
const _hoisted_1$c = { class: "row" };
const _hoisted_2$c = { class: "col-8" };
const _hoisted_3$c = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ createElementVNode("h3", null, "Draggable with footer", -1));
const _hoisted_4$a = { class: "list-group-item" };
const _hoisted_5$a = {
  class: "btn-group list-group-item",
  role: "group",
  "aria-label": "Basic example",
  key: "footer"
};
function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_draggable = resolveComponent("draggable");
  const _component_rawDisplayer = resolveComponent("rawDisplayer");
  return openBlock(), createElementBlock("div", _hoisted_1$c, [
    createElementVNode("div", _hoisted_2$c, [
      _hoisted_3$c,
      createVNode(_component_draggable, {
        tag: "transition-group",
        componentData: $data.componentData,
        list: $data.list,
        animation: 100,
        onStart: _cache[2] || (_cache[2] = ($event) => $data.dragging = true),
        onEnd: _cache[3] || (_cache[3] = ($event) => $data.dragging = false),
        "item-key": "name"
      }, {
        item: withCtx(({ element }) => [
          createElementVNode("div", _hoisted_4$a, toDisplayString(element.name), 1)
        ]),
        footer: withCtx(() => [
          createElementVNode("div", _hoisted_5$a, [
            createElementVNode("button", {
              class: "btn btn-secondary",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.add && $options.add(...args))
            }, "Add"),
            createElementVNode("button", {
              class: "btn btn-secondary",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.replace && $options.replace(...args))
            }, "Replace")
          ])
        ]),
        _: 1
      }, 8, ["componentData", "list"])
    ]),
    createVNode(_component_rawDisplayer, {
      class: "col-3",
      value: $data.list,
      title: "List"
    }, null, 8, ["value"])
  ]);
}
var footerslot = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$e], ["__scopeId", "data-v-7e0cbd14"]]);
var __glob_0_3 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": footerslot
});
var handle_vue_vue_type_style_index_0_scoped_true_lang = "";
let id$3 = 3;
const _sfc_main$d = {
  name: "handle",
  display: "Handle",
  instruction: "Drag using the handle icon",
  order: 5,
  components: {
    draggable: draggableComponent
  },
  data() {
    return {
      list: [
        { name: "John", text: "", id: 0 },
        { name: "Joao", text: "", id: 1 },
        { name: "Jean", text: "", id: 2 }
      ],
      dragging: false
    };
  },
  computed: {
    draggingInfo() {
      return this.dragging ? "under drag" : "";
    }
  },
  methods: {
    removeAt(idx) {
      this.list.splice(idx, 1);
    },
    add() {
      id$3++;
      this.list.push({ name: "Juan " + id$3, id: id$3, text: "" });
    }
  }
};
const _withScopeId$3 = (n) => (pushScopeId("data-v-b73bc9ba"), n = n(), popScopeId(), n);
const _hoisted_1$b = { class: "row" };
const _hoisted_2$b = { class: "col-1" };
const _hoisted_3$b = { class: "col-7" };
const _hoisted_4$9 = { class: "list-group-item" };
const _hoisted_5$9 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ createElementVNode("i", { class: "fa fa-align-justify handle" }, null, -1));
const _hoisted_6$9 = { class: "text" };
const _hoisted_7$4 = ["onUpdate:modelValue"];
const _hoisted_8$2 = ["onClick"];
function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_draggable = resolveComponent("draggable");
  const _component_rawDisplayer = resolveComponent("rawDisplayer");
  return openBlock(), createElementBlock("div", _hoisted_1$b, [
    createElementVNode("div", _hoisted_2$b, [
      createElementVNode("button", {
        class: "btn btn-secondary button",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.add && $options.add(...args))
      }, "Add")
    ]),
    createElementVNode("div", _hoisted_3$b, [
      createElementVNode("h3", null, "Draggable " + toDisplayString($options.draggingInfo), 1),
      createVNode(_component_draggable, {
        tag: "ul",
        list: $data.list,
        class: "list-group",
        handle: ".handle",
        "item-key": "name"
      }, {
        item: withCtx(({ element, index: index2 }) => [
          createElementVNode("li", _hoisted_4$9, [
            _hoisted_5$9,
            createElementVNode("span", _hoisted_6$9, toDisplayString(element.name), 1),
            withDirectives(createElementVNode("input", {
              type: "text",
              class: "form-control",
              "onUpdate:modelValue": ($event) => element.text = $event
            }, null, 8, _hoisted_7$4), [
              [vModelText, element.text]
            ]),
            createElementVNode("i", {
              class: "fa fa-times close",
              onClick: ($event) => $options.removeAt(index2)
            }, null, 8, _hoisted_8$2)
          ])
        ]),
        _: 1
      }, 8, ["list"])
    ]),
    createVNode(_component_rawDisplayer, {
      class: "col-3",
      value: $data.list,
      title: "List"
    }, null, 8, ["value"])
  ]);
}
var handle = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$d], ["__scopeId", "data-v-b73bc9ba"]]);
var __glob_0_4 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": handle
});
let id$2 = 1;
const _sfc_main$c = {
  name: "headerslot",
  display: "Header slot",
  order: 13,
  components: {
    draggable: draggableComponent
  },
  data() {
    return {
      list: [
        { name: "John 1", id: 0 },
        { name: "Joao 2", id: 1 },
        { name: "Jean 3", id: 2 }
      ],
      dragging: false
    };
  },
  methods: {
    add() {
      this.list.push({ name: "Juan " + id$2, id: id$2++ });
    },
    replace() {
      this.list = [{ name: "Edgard", id: id$2++ }];
    },
    log(evt) {
      window.console.log(evt);
    }
  }
};
const _hoisted_1$a = { class: "row" };
const _hoisted_2$a = { class: "col-8" };
const _hoisted_3$a = /* @__PURE__ */ createElementVNode("h3", null, "Draggable with header", -1);
const _hoisted_4$8 = {
  class: "btn-group list-group-item",
  role: "group"
};
const _hoisted_5$8 = {
  class: "btn-group list-group-item",
  role: "group"
};
const _hoisted_6$8 = { class: "list-group-item item" };
function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_draggable = resolveComponent("draggable");
  const _component_rawDisplayer = resolveComponent("rawDisplayer");
  return openBlock(), createElementBlock("div", _hoisted_1$a, [
    createElementVNode("div", _hoisted_2$a, [
      _hoisted_3$a,
      createVNode(_component_draggable, {
        list: $data.list,
        class: "list-group",
        onStart: _cache[2] || (_cache[2] = ($event) => $data.dragging = true),
        onEnd: _cache[3] || (_cache[3] = ($event) => $data.dragging = false),
        onChange: $options.log,
        "item-key": "name"
      }, {
        header: withCtx(() => [
          createElementVNode("div", _hoisted_4$8, [
            createElementVNode("button", {
              class: "btn btn-secondary",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.add && $options.add(...args))
            }, "Add")
          ])
        ]),
        footer: withCtx(() => [
          createElementVNode("div", _hoisted_5$8, [
            createElementVNode("button", {
              class: "btn btn-secondary",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.replace && $options.replace(...args))
            }, "Replace")
          ])
        ]),
        item: withCtx(({ element }) => [
          createElementVNode("div", _hoisted_6$8, toDisplayString(element.name), 1)
        ]),
        _: 1
      }, 8, ["list", "onChange"])
    ]),
    createVNode(_component_rawDisplayer, {
      class: "col-3",
      value: $data.list,
      title: "List"
    }, null, 8, ["value"])
  ]);
}
var headerslot = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$c]]);
var __glob_0_5 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": headerslot
});
var nested_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$b = {
  props: {
    tasks: {
      required: true,
      type: Array
    }
  },
  components: {
    draggable: draggableComponent
  },
  name: "nested-draggable"
};
function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_nested_draggable = resolveComponent("nested-draggable");
  const _component_draggable = resolveComponent("draggable");
  return openBlock(), createBlock(_component_draggable, {
    class: "dragArea",
    tag: "ul",
    list: $props.tasks,
    group: { name: "g1" },
    "item-key": "name"
  }, {
    item: withCtx(({ element }) => [
      createElementVNode("li", null, [
        createElementVNode("p", null, toDisplayString(element.name), 1),
        createVNode(_component_nested_draggable, {
          tasks: element.tasks
        }, null, 8, ["tasks"])
      ])
    ]),
    _: 1
  }, 8, ["list"]);
}
var nestedDraggable = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b], ["__scopeId", "data-v-85a8545e"]]);
const _sfc_main$a = {
  name: "nested-example",
  display: "Nested",
  order: 15,
  components: {
    nestedDraggable
  },
  data() {
    return {
      list: [
        {
          name: "task 1",
          tasks: [
            {
              name: "task 2",
              tasks: []
            }
          ]
        },
        {
          name: "task 3",
          tasks: [
            {
              name: "task 4",
              tasks: []
            }
          ]
        },
        {
          name: "task 5",
          tasks: []
        }
      ]
    };
  }
};
const _hoisted_1$9 = { class: "row" };
const _hoisted_2$9 = { class: "col-8" };
const _hoisted_3$9 = /* @__PURE__ */ createElementVNode("h3", null, "Nested draggable", -1);
function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_nested_draggable = resolveComponent("nested-draggable");
  const _component_rawDisplayer = resolveComponent("rawDisplayer");
  return openBlock(), createElementBlock("div", _hoisted_1$9, [
    createElementVNode("div", _hoisted_2$9, [
      _hoisted_3$9,
      createVNode(_component_nested_draggable, { tasks: $data.list }, null, 8, ["tasks"])
    ]),
    createVNode(_component_rawDisplayer, {
      class: "col-3",
      value: $data.list,
      title: "List"
    }, null, 8, ["value"])
  ]);
}
var nestedExample = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a]]);
var __glob_0_6 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": nestedExample
});
var simple_vue_vue_type_style_index_0_scoped_true_lang = "";
let id$1 = 1;
const _sfc_main$9 = {
  name: "simple",
  display: "Simple",
  order: 0,
  components: {
    draggable: draggableComponent
  },
  data() {
    return {
      enabled: true,
      list: [
        { name: "John", id: 0 },
        { name: "Joao", id: 1 },
        { name: "Jean", id: 2 }
      ],
      dragging: false
    };
  },
  computed: {
    draggingInfo() {
      return this.dragging ? "under drag" : "";
    }
  },
  methods: {
    add() {
      this.list.push({ name: "Juan " + id$1, id: id$1++ });
    },
    replace() {
      this.list = [{ name: "Edgard", id: id$1++ }];
    },
    checkMove(e) {
      window.console.log("Future index: " + e.draggedContext.futureIndex);
    }
  }
};
const _withScopeId$2 = (n) => (pushScopeId("data-v-4ed1eca6"), n = n(), popScopeId(), n);
const _hoisted_1$8 = { class: "row" };
const _hoisted_2$8 = { class: "col-2" };
const _hoisted_3$8 = { class: "form-group" };
const _hoisted_4$7 = {
  class: "btn-group-vertical buttons",
  role: "group",
  "aria-label": "Basic example"
};
const _hoisted_5$7 = { class: "form-check" };
const _hoisted_6$7 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createElementVNode("label", {
  class: "form-check-label",
  for: "disabled"
}, "DnD enabled", -1));
const _hoisted_7$3 = { class: "col-6" };
function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_draggable = resolveComponent("draggable");
  const _component_rawDisplayer = resolveComponent("rawDisplayer");
  return openBlock(), createElementBlock("div", _hoisted_1$8, [
    createElementVNode("div", _hoisted_2$8, [
      createElementVNode("div", _hoisted_3$8, [
        createElementVNode("div", _hoisted_4$7, [
          createElementVNode("button", {
            class: "btn btn-secondary",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.add && $options.add(...args))
          }, "Add"),
          createElementVNode("button", {
            class: "btn btn-secondary",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.replace && $options.replace(...args))
          }, "Replace")
        ]),
        createElementVNode("div", _hoisted_5$7, [
          withDirectives(createElementVNode("input", {
            id: "disabled",
            type: "checkbox",
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.enabled = $event),
            class: "form-check-input"
          }, null, 512), [
            [vModelCheckbox, $data.enabled]
          ]),
          _hoisted_6$7
        ])
      ])
    ]),
    createElementVNode("div", _hoisted_7$3, [
      createElementVNode("h3", null, "Draggable " + toDisplayString($options.draggingInfo), 1),
      createVNode(_component_draggable, {
        list: $data.list,
        disabled: !$data.enabled,
        "item-key": "name",
        class: "list-group",
        "ghost-class": "ghost",
        move: $options.checkMove,
        onStart: _cache[3] || (_cache[3] = ($event) => $data.dragging = true),
        onEnd: _cache[4] || (_cache[4] = ($event) => $data.dragging = false)
      }, {
        item: withCtx(({ element }) => [
          createElementVNode("div", {
            class: normalizeClass(["list-group-item", { "not-draggable": !$data.enabled }])
          }, toDisplayString(element.name), 3)
        ]),
        _: 1
      }, 8, ["list", "disabled", "move"])
    ]),
    createVNode(_component_rawDisplayer, {
      class: "col-3",
      value: $data.list,
      title: "List"
    }, null, 8, ["value"])
  ]);
}
var simple = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9], ["__scopeId", "data-v-4ed1eca6"]]);
var __glob_0_7 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": simple
});
var tableColumnExample_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$8 = {
  name: "table-column-example",
  display: "Table Column",
  order: 9,
  components: {
    draggable: draggableComponent
  },
  data() {
    return {
      headers: ["id", "name", "sport"],
      list: [
        { id: 1, name: "Abby", sport: "basket" },
        { id: 2, name: "Brooke", sport: "foot" },
        { id: 3, name: "Courtenay", sport: "volley" },
        { id: 4, name: "David", sport: "rugby" }
      ],
      dragging: false
    };
  }
};
const _withScopeId$1 = (n) => (pushScopeId("data-v-0d350c8d"), n = n(), popScopeId(), n);
const _hoisted_1$7 = { class: "row" };
const _hoisted_2$7 = { class: "col-8" };
const _hoisted_3$7 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createElementVNode("h3", null, "Draggable table", -1));
const _hoisted_4$6 = { class: "table table-striped" };
const _hoisted_5$6 = { class: "thead-dark" };
const _hoisted_6$6 = { scope: "col" };
function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_draggable = resolveComponent("draggable");
  const _component_rawDisplayer = resolveComponent("rawDisplayer");
  return openBlock(), createElementBlock("div", _hoisted_1$7, [
    createElementVNode("div", _hoisted_2$7, [
      _hoisted_3$7,
      createElementVNode("table", _hoisted_4$6, [
        createElementVNode("thead", _hoisted_5$6, [
          createVNode(_component_draggable, {
            modelValue: $data.headers,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.headers = $event),
            tag: "tr",
            "item-key": (key) => key
          }, {
            item: withCtx(({ element: header }) => [
              createElementVNode("th", _hoisted_6$6, toDisplayString(header), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "item-key"])
        ]),
        createElementVNode("tbody", null, [
          (openBlock(true), createElementBlock(Fragment, null, renderList($data.list, (item) => {
            return openBlock(), createElementBlock("tr", {
              key: item.name
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList($data.headers, (header) => {
                return openBlock(), createElementBlock("td", { key: header }, toDisplayString(item[header]), 1);
              }), 128))
            ]);
          }), 128))
        ])
      ])
    ]),
    createVNode(_component_rawDisplayer, {
      class: "col-2",
      value: $data.list,
      title: "List"
    }, null, 8, ["value"]),
    createVNode(_component_rawDisplayer, {
      class: "col-2",
      value: $data.headers,
      title: "Headers"
    }, null, 8, ["value"])
  ]);
}
var tableColumnExample = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8], ["__scopeId", "data-v-0d350c8d"]]);
var __glob_0_8 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": tableColumnExample
});
var tableExample_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$7 = {
  name: "table-example",
  display: "Table",
  order: 8,
  components: {
    draggable: draggableComponent
  },
  data() {
    return {
      list: [
        { id: 1, name: "Abby", sport: "basket" },
        { id: 2, name: "Brooke", sport: "foot" },
        { id: 3, name: "Courtenay", sport: "volley" },
        { id: 4, name: "David", sport: "rugby" }
      ],
      dragging: false
    };
  }
};
const _withScopeId = (n) => (pushScopeId("data-v-49c35880"), n = n(), popScopeId(), n);
const _hoisted_1$6 = { class: "row" };
const _hoisted_2$6 = { class: "col-8" };
const _hoisted_3$6 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("h3", null, "Draggable table", -1));
const _hoisted_4$5 = { class: "table table-striped" };
const _hoisted_5$5 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("thead", { class: "thead-dark" }, [
  /* @__PURE__ */ createElementVNode("tr", null, [
    /* @__PURE__ */ createElementVNode("th", { scope: "col" }, "Id"),
    /* @__PURE__ */ createElementVNode("th", { scope: "col" }, "Name"),
    /* @__PURE__ */ createElementVNode("th", { scope: "col" }, "Sport")
  ])
], -1));
const _hoisted_6$5 = { scope: "row" };
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_draggable = resolveComponent("draggable");
  const _component_rawDisplayer = resolveComponent("rawDisplayer");
  return openBlock(), createElementBlock("div", _hoisted_1$6, [
    createElementVNode("div", _hoisted_2$6, [
      _hoisted_3$6,
      createElementVNode("table", _hoisted_4$5, [
        _hoisted_5$5,
        createVNode(_component_draggable, {
          modelValue: $data.list,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.list = $event),
          tag: "tbody",
          "item-key": "name"
        }, {
          item: withCtx(({ element }) => [
            createElementVNode("tr", null, [
              createElementVNode("td", _hoisted_6$5, toDisplayString(element.id), 1),
              createElementVNode("td", null, toDisplayString(element.name), 1),
              createElementVNode("td", null, toDisplayString(element.sport), 1)
            ])
          ]),
          _: 1
        }, 8, ["modelValue"])
      ])
    ]),
    createVNode(_component_rawDisplayer, {
      class: "col-3",
      value: $data.list,
      title: "List"
    }, null, 8, ["value"])
  ]);
}
var tableExample = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7], ["__scopeId", "data-v-49c35880"]]);
var __glob_0_9 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": tableExample
});
const _sfc_main$6 = {
  name: "third-party",
  display: "Third party",
  order: 10,
  components: {
    draggable: draggableComponent
  },
  data() {
    const activeNames = [1];
    return {
      list: [
        {
          title: "Consistency",
          id: 1,
          text: [
            "Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;",
            "Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc."
          ]
        },
        {
          title: "Feedback",
          id: 2,
          text: [
            "Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects;",
            "Visual feedback: reflect current state by updating or rearranging elements of the page."
          ]
        },
        {
          title: "Efficiency",
          id: 3,
          text: [
            "Simplify the process: keep operating process simple and intuitive;",
            "Definite and clear: enunciate your intentions clearly so that the users can quickly understand and make decisions;",
            "Easy to identify: the interface should be straightforward, which helps the users to identify and frees them from memorizing and recalling."
          ]
        },
        {
          title: "Controllability",
          id: 4,
          text: [
            "Decision making: giving advices about operations is acceptable, but do not make decisions for the users;",
            "Controlled consequences: users should be granted the freedom to operate, including canceling, aborting or terminating current operation."
          ]
        }
      ],
      activeNames,
      collapseComponentData: {
        "onUpdate:modelValue": this.inputChanged,
        modelValue: activeNames
      }
    };
  },
  methods: {
    inputChanged(val) {
      this.activeNames = val;
    }
  }
};
const _hoisted_1$5 = { class: "row" };
const _hoisted_2$5 = { class: "col-7" };
const _hoisted_3$5 = /* @__PURE__ */ createElementVNode("h3", null, [
  /* @__PURE__ */ createTextVNode(" Integration with "),
  /* @__PURE__ */ createElementVNode("a", {
    href: "https://element-plus.org/#/en-US/component/collapse",
    target: "_blank"
  }, "Element+ collapse")
], -1);
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_el_collapse_item = resolveComponent("el-collapse-item");
  const _component_draggable = resolveComponent("draggable");
  const _component_rawDisplayer = resolveComponent("rawDisplayer");
  return openBlock(), createElementBlock("div", _hoisted_1$5, [
    createElementVNode("div", _hoisted_2$5, [
      _hoisted_3$5,
      createVNode(_component_draggable, {
        tag: "el-collapse",
        list: $data.list,
        "component-data": $data.collapseComponentData,
        "item-key": "id"
      }, {
        item: withCtx(({ element }) => [
          createVNode(_component_el_collapse_item, {
            title: element.title,
            name: element.id
          }, {
            default: withCtx(() => [
              (openBlock(true), createElementBlock(Fragment, null, renderList(element.text, (lign, idx) => {
                return openBlock(), createElementBlock("div", { key: idx }, toDisplayString(lign), 1);
              }), 128))
            ]),
            _: 2
          }, 1032, ["title", "name"])
        ]),
        _: 1
      }, 8, ["list", "component-data"])
    ]),
    createVNode(_component_rawDisplayer, {
      class: "col-3",
      value: $data.list,
      title: "List"
    }, null, 8, ["value"]),
    createVNode(_component_rawDisplayer, {
      class: "col-1",
      value: $data.activeNames,
      title: "activeNames"
    }, null, 8, ["value"])
  ]);
}
var thirdParty = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6]]);
var __glob_0_10 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": thirdParty
});
var transitionExample2_vue_vue_type_style_index_0_lang = "";
const message$1 = [
  "vue.draggable",
  "draggable",
  "component",
  "for",
  "vue.js 2.0",
  "based",
  "on",
  "Sortablejs"
];
const _sfc_main$5 = {
  name: "transition-example-2",
  display: "Transitions",
  order: 7,
  components: {
    draggable: draggableComponent
  },
  data() {
    return {
      list: message$1.map((name, index2) => {
        return { name, order: index2 + 1 };
      }),
      drag: false
    };
  },
  methods: {
    sort() {
      this.list = this.list.sort((a, b) => a.order - b.order);
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  }
};
const _hoisted_1$4 = { class: "row" };
const _hoisted_2$4 = { class: "col-2" };
const _hoisted_3$4 = { class: "col-6" };
const _hoisted_4$4 = /* @__PURE__ */ createElementVNode("h3", null, "Transition", -1);
const _hoisted_5$4 = { class: "list-group-item" };
const _hoisted_6$4 = ["onClick"];
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_draggable = resolveComponent("draggable");
  const _component_rawDisplayer = resolveComponent("rawDisplayer");
  return openBlock(), createElementBlock("div", _hoisted_1$4, [
    createElementVNode("div", _hoisted_2$4, [
      createElementVNode("button", {
        class: "btn btn-secondary button",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.sort && $options.sort(...args))
      }, "To original order")
    ]),
    createElementVNode("div", _hoisted_3$4, [
      _hoisted_4$4,
      createVNode(_component_draggable, mergeProps({
        class: "list-group",
        tag: "transition-group",
        "component-data": {
          tag: "ul",
          type: "transition-group",
          name: !$data.drag ? "flip-list" : null
        },
        modelValue: $data.list,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.list = $event)
      }, $options.dragOptions, {
        onStart: _cache[2] || (_cache[2] = ($event) => $data.drag = true),
        onEnd: _cache[3] || (_cache[3] = ($event) => $data.drag = false),
        "item-key": "order"
      }), {
        item: withCtx(({ element }) => [
          createElementVNode("li", _hoisted_5$4, [
            createElementVNode("i", {
              class: normalizeClass(element.fixed ? "fa fa-anchor" : "glyphicon glyphicon-pushpin"),
              onClick: ($event) => element.fixed = !element.fixed,
              "aria-hidden": "true"
            }, null, 10, _hoisted_6$4),
            createTextVNode(" " + toDisplayString(element.name), 1)
          ])
        ]),
        _: 1
      }, 16, ["component-data", "modelValue"])
    ]),
    createVNode(_component_rawDisplayer, {
      class: "col-3",
      value: $data.list,
      title: "List"
    }, null, 8, ["value"])
  ]);
}
var transitionExample2 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5]]);
var __glob_0_11 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": transitionExample2
});
var transitionExample_vue_vue_type_style_index_0_lang = "";
const message = [
  "vue.draggable",
  "draggable",
  "component",
  "for",
  "vue.js 2.0",
  "based",
  "on",
  "Sortablejs"
];
const _sfc_main$4 = {
  name: "transition-example",
  display: "Transition",
  order: 6,
  components: {
    draggable: draggableComponent
  },
  data() {
    return {
      list: message.map((name, index2) => {
        return { name, order: index2 + 1 };
      })
    };
  },
  methods: {
    sort() {
      this.list = this.list.sort((a, b) => a.order - b.order);
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  }
};
const _hoisted_1$3 = { class: "row" };
const _hoisted_2$3 = { class: "col-2" };
const _hoisted_3$3 = { class: "col-6" };
const _hoisted_4$3 = /* @__PURE__ */ createElementVNode("h3", null, "Transition", -1);
const _hoisted_5$3 = { class: "list-group-item" };
const _hoisted_6$3 = ["onClick"];
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_draggable = resolveComponent("draggable");
  const _component_rawDisplayer = resolveComponent("rawDisplayer");
  return openBlock(), createElementBlock("div", _hoisted_1$3, [
    createElementVNode("div", _hoisted_2$3, [
      createElementVNode("button", {
        class: "btn btn-secondary button",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.sort && $options.sort(...args))
      }, "To original order")
    ]),
    createElementVNode("div", _hoisted_3$3, [
      _hoisted_4$3,
      createVNode(_component_draggable, mergeProps({
        class: "list-group",
        "item-key": "order",
        tag: "transition-group",
        "component-data": { tag: "ul", name: "flip-list", type: "transition" },
        modelValue: $data.list,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.list = $event)
      }, $options.dragOptions, {
        onStart: _cache[2] || (_cache[2] = ($event) => _ctx.isDragging = true),
        onEnd: _cache[3] || (_cache[3] = ($event) => _ctx.isDragging = false)
      }), {
        item: withCtx(({ element }) => [
          createElementVNode("li", _hoisted_5$3, [
            createElementVNode("i", {
              class: normalizeClass(element.fixed ? "fa fa-anchor" : "glyphicon glyphicon-pushpin"),
              onClick: ($event) => element.fixed = !element.fixed,
              "aria-hidden": "true"
            }, null, 10, _hoisted_6$3),
            createTextVNode(" " + toDisplayString(element.name), 1)
          ])
        ]),
        _: 1
      }, 16, ["modelValue"])
    ]),
    createVNode(_component_rawDisplayer, {
      class: "col-3",
      value: $data.list,
      title: "List"
    }, null, 8, ["value"])
  ]);
}
var transitionExample = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4]]);
var __glob_0_12 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": transitionExample
});
let id = 1;
const _sfc_main$3 = {
  name: "two-list-headerslots",
  display: "Two list header slot",
  order: 14,
  components: {
    draggable: draggableComponent
  },
  data() {
    return {
      list: [
        { name: "John 1", id: 0 },
        { name: "Joao 2", id: 1 },
        { name: "Jean 3", id: 2 }
      ],
      list2: [
        { name: "Jonny 4", id: 3 },
        { name: "Guisepe 5", id: 4 }
      ]
    };
  },
  methods: {
    add() {
      this.list.push({ name: "Juan " + id, id: id++ });
    },
    replace() {
      this.list = [{ name: "Edgard", id: id++ }];
    },
    add2() {
      this.list2.push({ name: "Juan " + id, id: id++ });
    },
    replace2() {
      this.list2 = [{ name: "Edgard", id: id++ }];
    }
  }
};
const _hoisted_1$2 = { class: "row" };
const _hoisted_2$2 = { class: "col-4" };
const _hoisted_3$2 = /* @__PURE__ */ createElementVNode("h3", null, "First draggable with footer", -1);
const _hoisted_4$2 = { class: "list-group-item" };
const _hoisted_5$2 = {
  class: "btn-group list-group-item",
  role: "group"
};
const _hoisted_6$2 = { class: "col-4" };
const _hoisted_7$2 = /* @__PURE__ */ createElementVNode("h3", null, "Second draggable with header", -1);
const _hoisted_8$1 = { class: "list-group-item item" };
const _hoisted_9$1 = {
  class: "btn-group list-group-item",
  role: "group",
  "aria-label": "Basic example"
};
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_draggable = resolveComponent("draggable");
  const _component_rawDisplayer = resolveComponent("rawDisplayer");
  return openBlock(), createElementBlock("div", _hoisted_1$2, [
    createElementVNode("div", _hoisted_2$2, [
      _hoisted_3$2,
      createVNode(_component_draggable, {
        id: "first",
        "data-source": "juju",
        list: $data.list,
        class: "list-group",
        group: "a",
        "item-key": "name"
      }, {
        item: withCtx(({ element }) => [
          createElementVNode("div", _hoisted_4$2, toDisplayString(element.name), 1)
        ]),
        footer: withCtx(() => [
          createElementVNode("div", _hoisted_5$2, [
            createElementVNode("button", {
              class: "btn btn-secondary",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.add && $options.add(...args))
            }, "Add"),
            createElementVNode("button", {
              class: "btn btn-secondary",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.replace && $options.replace(...args))
            }, "Replace")
          ])
        ]),
        _: 1
      }, 8, ["list"])
    ]),
    createElementVNode("div", _hoisted_6$2, [
      _hoisted_7$2,
      createVNode(_component_draggable, {
        list: $data.list2,
        class: "list-group",
        group: "a",
        "item-key": "name"
      }, {
        item: withCtx(({ element }) => [
          createElementVNode("div", _hoisted_8$1, toDisplayString(element.name), 1)
        ]),
        header: withCtx(() => [
          createElementVNode("div", _hoisted_9$1, [
            createElementVNode("button", {
              class: "btn btn-secondary",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.add2 && $options.add2(...args))
            }, "Add"),
            createElementVNode("button", {
              class: "btn btn-secondary",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.replace2 && $options.replace2(...args))
            }, "Replace")
          ])
        ]),
        _: 1
      }, 8, ["list"])
    ]),
    createVNode(_component_rawDisplayer, {
      class: "col-2",
      value: $data.list,
      title: "List"
    }, null, 8, ["value"]),
    createVNode(_component_rawDisplayer, {
      class: "col-2",
      value: $data.list2,
      title: "List2"
    }, null, 8, ["value"])
  ]);
}
var twoListHeaderslots = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
var __glob_0_13 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": twoListHeaderslots
});
const _sfc_main$2 = {
  name: "two-lists",
  display: "Two Lists",
  order: 1,
  components: {
    draggable: draggableComponent
  },
  data() {
    return {
      list1: [
        { name: "John", id: 1 },
        { name: "Joao", id: 2 },
        { name: "Jean", id: 3 },
        { name: "Gerard", id: 4 }
      ],
      list2: [
        { name: "Juan", id: 5 },
        { name: "Edgard", id: 6 },
        { name: "Johnson", id: 7 }
      ]
    };
  },
  methods: {
    add() {
      this.list1.push({ name: "Juan" });
    },
    replace() {
      this.list1 = [{ name: "Edgard" }];
    },
    clone(el) {
      console.log("clone - el - ", el);
      return {
        name: el.name + " cloned"
      };
    },
    log(evt) {
      window.console.log(evt);
    }
  }
};
const _hoisted_1$1 = { class: "row" };
const _hoisted_2$1 = { class: "col-3" };
const _hoisted_3$1 = /* @__PURE__ */ createElementVNode("h3", null, "Draggable 1", -1);
const _hoisted_4$1 = { class: "list-group-item" };
const _hoisted_5$1 = { class: "col-3" };
const _hoisted_6$1 = /* @__PURE__ */ createElementVNode("h3", null, "Draggable 2", -1);
const _hoisted_7$1 = { class: "list-group-item" };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_draggable = resolveComponent("draggable");
  const _component_rawDisplayer = resolveComponent("rawDisplayer");
  return openBlock(), createElementBlock("div", _hoisted_1$1, [
    createElementVNode("div", _hoisted_2$1, [
      _hoisted_3$1,
      createVNode(_component_draggable, {
        class: "list-group",
        list: $data.list1,
        group: "people",
        onChange: $options.log,
        itemKey: "name"
      }, {
        item: withCtx(({ element, index: index2 }) => [
          createElementVNode("div", _hoisted_4$1, toDisplayString(element.name) + " " + toDisplayString(index2), 1)
        ]),
        _: 1
      }, 8, ["list", "onChange"])
    ]),
    createElementVNode("div", _hoisted_5$1, [
      _hoisted_6$1,
      createVNode(_component_draggable, {
        class: "list-group",
        list: $data.list2,
        group: "people",
        onChange: $options.log,
        itemKey: "name"
      }, {
        item: withCtx(({ element, index: index2 }) => [
          createElementVNode("div", _hoisted_7$1, toDisplayString(element.name) + " " + toDisplayString(index2), 1)
        ]),
        _: 1
      }, 8, ["list", "onChange"])
    ]),
    createVNode(_component_rawDisplayer, {
      class: "col-3",
      value: $data.list1,
      title: "List 1"
    }, null, 8, ["value"]),
    createVNode(_component_rawDisplayer, {
      class: "col-3",
      value: $data.list2,
      title: "List 2"
    }, null, 8, ["value"])
  ]);
}
var twoLists = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
var __glob_0_14 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": twoLists
});
var _imports_0 = "/assets/logo.2270608b.svg";
var App_vue_vue_type_style_index_0_lang = "";
const modules = { "./components/clone-on-control.vue": __glob_0_0, "./components/clone.vue": __glob_0_1, "./components/custom-clone.vue": __glob_0_2, "./components/footerslot.vue": __glob_0_3, "./components/handle.vue": __glob_0_4, "./components/headerslot.vue": __glob_0_5, "./components/nested-example.vue": __glob_0_6, "./components/simple.vue": __glob_0_7, "./components/table-column-example.vue": __glob_0_8, "./components/table-example.vue": __glob_0_9, "./components/third-party.vue": __glob_0_10, "./components/transition-example-2.vue": __glob_0_11, "./components/transition-example.vue": __glob_0_12, "./components/two-list-headerslots.vue": __glob_0_13, "./components/two-lists.vue": __glob_0_14 };
let components = {};
Object.keys(modules).map((key) => {
  const component = modules[key].default;
  components[component.name] = component;
});
const _sfc_main$1 = {
  name: "app",
  components,
  data() {
    const componentList = Object.values(components).filter((component) => component.show).sort((a, b) => a.order - b.order);
    return {
      componentList
    };
  },
  mounted() {
    this.toRoute(this.$route);
    $('a[data-toggle="tab"]').on("shown.bs.tab", (e) => {
      this.$router.push({ path: e.target.dataset.route });
    });
  },
  methods: {
    toRoute(route) {
      $(`a[data-route="${route.path}"]`).tab("show");
    }
  },
  watch: {
    $route: function(route) {
      this.toRoute(route);
    }
  }
};
const _hoisted_1 = { id: "app" };
const _hoisted_2 = /* @__PURE__ */ createElementVNode("a", {
  href: "https://github.com/SortableJS/vue.draggable.next",
  target: "_blank"
}, [
  /* @__PURE__ */ createElementVNode("img", {
    style: { "position": "fixed", "top": "0", "right": "0", "border": "0", "z-index": "99999" },
    width: "149",
    height: "149",
    src: "https://github.blog/wp-content/uploads/2008/12/forkme_right_gray_6d6d6d.png?resize=149%2C149",
    class: "attachment-full size-full",
    alt: "Fork me on GitHub",
    "data-recalc-dims": "1"
  })
], -1);
const _hoisted_3 = { class: "container" };
const _hoisted_4 = /* @__PURE__ */ createStaticVNode('<div class="jumbotron logo"><img class="draggable" alt="Vue.draggable logo" src="' + _imports_0 + '"><div id="badges"><a target="_blank" href="https://circleci.com/gh/SortableJS/vue.draggable.next"><img src="https://circleci.com/gh/SortableJS/vue.draggable.next.svg?style=shield"></a><a target="_blank" href="https://codecov.io/gh/SortableJS/vue.draggable.next"><img src="https://codecov.io/gh/SortableJS/vue.draggable.next/branch/master/graph/badge.svg"></a><a target="_blank" href="https://codebeat.co/projects/github-com-sortablejs-vue-draggable-master"><img src="https://codebeat.co/badges/7a6c27c8-2d0b-47b9-af55-c2eea966e713"></a><a target="_blank" href="https://github.com/SortableJS/vue.draggable.next/issues?q=is%3Aopen+is%3Aissue"><img src="https://img.shields.io/github/issues/SortableJS/vue.draggable.next.svg"></a><a target="_blank" href="https://www.npmjs.com/package/vuedraggable"><img src="https://img.shields.io/npm/dt/vuedraggable.svg"></a><a target="_blank" href="https://www.npmjs.com/package/vuedraggable/v/next"><img src="https://img.shields.io/npm/v/vuedraggable/next.svg"></a><a target="_blank" href="https://www.npmjs.com/package/vuedraggable"><img src="https://img.shields.io/npm/v/vuedraggable.svg"></a><a target="_blank" href="https://github.com/SortableJS/vue.draggable.next/blob/master/LICENSE"><img src="https://img.shields.io/github/license/SortableJS/vue.draggable.next.svg"></a></div></div>', 1);
const _hoisted_5 = {
  class: "nav nav-tabs",
  role: "tablist"
};
const _hoisted_6 = ["data-route", "href"];
const _hoisted_7 = {
  class: "tab-content",
  id: "tab-content"
};
const _hoisted_8 = ["id"];
const _hoisted_9 = { class: "justify-content-center jumbotron main-container" };
const _hoisted_10 = { class: "row icon-container" };
const _hoisted_11 = ["href"];
const _hoisted_12 = /* @__PURE__ */ createElementVNode("button", { class: "btn btn-secondary" }, [
  /* @__PURE__ */ createTextVNode(" View code "),
  /* @__PURE__ */ createElementVNode("i", { class: "fa fa-github icon-large" })
], -1);
const _hoisted_13 = [
  _hoisted_12
];
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    _hoisted_2,
    createElementVNode("div", _hoisted_3, [
      _hoisted_4,
      createElementVNode("ul", _hoisted_5, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($data.componentList, (component) => {
          return openBlock(), createElementBlock("li", {
            class: "nav-item",
            key: component.name
          }, [
            createElementVNode("a", {
              class: "nav-link",
              "data-toggle": "tab",
              "data-route": `/${component.name}`,
              href: `#${component.name}`,
              role: "tab",
              "aria-controls": "profile"
            }, toDisplayString(component.display), 9, _hoisted_6)
          ]);
        }), 128))
      ]),
      createElementVNode("div", _hoisted_7, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($data.componentList, (component) => {
          return openBlock(), createElementBlock("div", {
            class: "tab-pane show",
            id: component.name,
            role: "tabpanel",
            "aria-labelledby": "profile-tab",
            key: component.name
          }, [
            createElementVNode("div", _hoisted_9, [
              createElementVNode("div", _hoisted_10, [
                createElementVNode("div", null, toDisplayString(component.instruction), 1),
                createElementVNode("a", {
                  class: "icon github",
                  target: "_blank",
                  href: `https://github.com/SortableJS/vue.draggable.next/blob/master/example/components/${component.name}.vue`
                }, _hoisted_13, 8, _hoisted_11)
              ]),
              (openBlock(), createBlock(resolveDynamicComponent(component.name)))
            ])
          ], 8, _hoisted_8);
        }), 128))
      ])
    ])
  ]);
}
var App = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
function getRouteFromDirectory(ctx) {
  return Object.keys(ctx).map((key) => ({
    path: key.substring(1).replace("/components", "").replace("/debug-components", "").replace(".vue", ""),
    component: ctx[key].default
  }));
}
const showDebug = false;
window.console.log(showDebug, "");
function getRouteFilterFromConfiguration(configuration) {
  const routeFromConfiguration = configuration.split(",").filter((value) => value !== "");
  if (routeFromConfiguration.length === 0) {
    return () => true;
  }
  window.console.log(`Using route filter VITE_FILTER_ROUTE: "${configuration}"`);
  return (name) => routeFromConfiguration.includes(name);
}
const filterRoute = getRouteFilterFromConfiguration("");
const routes = [
  ...getRouteFromDirectory({ "./components/clone-on-control.vue": __glob_0_0, "./components/clone.vue": __glob_0_1, "./components/custom-clone.vue": __glob_0_2, "./components/footerslot.vue": __glob_0_3, "./components/handle.vue": __glob_0_4, "./components/headerslot.vue": __glob_0_5, "./components/nested-example.vue": __glob_0_6, "./components/simple.vue": __glob_0_7, "./components/table-column-example.vue": __glob_0_8, "./components/table-example.vue": __glob_0_9, "./components/third-party.vue": __glob_0_10, "./components/transition-example-2.vue": __glob_0_11, "./components/transition-example.vue": __glob_0_12, "./components/two-list-headerslots.vue": __glob_0_13, "./components/two-lists.vue": __glob_0_14 }),
  ...[]
];
routes.forEach((route) => route.component.show = filterRoute(route.component.display));
const filteredRoutes = routes.filter((route) => route.component.show);
if (filteredRoutes.length === 0) {
  throw new Error(`No routes to match "${""}". Available route: ${routes.map((route) => `"${route.component.display}"`).join(", ")} .Please check env variable: VITE_FILTER_ROUTE`);
}
const redirect = filteredRoutes.some((r) => r.path === "/simple") ? "/simple" : filteredRoutes[0].path;
const allRoutes = [
  ...filteredRoutes,
  { path: "/", redirect },
  { path: "/:pathMatch(.*)*", redirect }
];
var rawDisplayer_vue_vue_type_style_index_0_scoped_true_lang = "";
const props = {
  title: {
    required: true,
    type: String
  },
  value: {
    required: true
  }
};
const _sfc_main = {
  name: "raw-displayer",
  props,
  computed: {
    valueString() {
      return JSON.stringify(this.value, null, 2);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [
    createElementVNode("h3", null, toDisplayString(_ctx.title), 1),
    createElementVNode("pre", null, toDisplayString($options.valueString), 1)
  ]);
}
var rawDisplayer = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5267af20"]]);
const nested = {
  namespaced: true,
  state: {
    elements: [
      {
        id: 1,
        name: "Shrek",
        elements: []
      },
      {
        id: 2,
        name: "Fiona",
        elements: [
          {
            id: 4,
            name: "Lord Farquad",
            elements: []
          },
          {
            id: 5,
            name: "Prince Charming",
            elements: []
          }
        ]
      },
      {
        id: 3,
        name: "Donkey",
        elements: []
      }
    ]
  },
  mutations: {
    updateElements: (state, payload) => {
      state.elements = payload;
    }
  },
  actions: {
    updateElements: ({ commit }, payload) => {
      commit("updateElements", payload);
    }
  }
};
const store = createStore({
  namespaced: true,
  modules: {
    nested
  }
});
var bootstrap_min = "";
var fontAwesome = "";
var index = "";
const router = createRouter({
  history: createWebHashHistory("/vue.draggable.next/"),
  routes: allRoutes
});
const app = createApp(App).use(store).use(router).use(ElementPlus).component("rawDisplayer", rawDisplayer);
router.isReady().then(() => app.mount("#app"));
