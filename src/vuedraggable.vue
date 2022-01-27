<template>
  <render ref="el"></render>
</template>
<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'draggable',
  inheritAttrs: false
});
</script>
<script setup>
import Sortable from 'sortablejs';
import {
  insertNodeAt,
  removeNode,
  multiRootComponentOnDragStart,
  multiRootComponentOnDragEnd
} from './util/htmlHelper';
import { console } from './util/console';
import {
  getComponentAttributes,
  createSortableOption,
  getValidSortableEntries
} from './core/componentBuilderHelper';
import { computeComponentStructure } from './core/renderHelper';
import { events } from './core/sortableEvents';
import {
  nextTick,
  onMounted,
  onUpdated,
  onBeforeUnmount,
  defineProps,
  defineEmits,
  computed,
  watch,
  ref,
  useSlots,
  useAttrs,
  toRef,
  getCurrentInstance,
  h,
  onRenderTriggered,
  onRenderTracked
} from 'vue';

const props = defineProps({
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
    default: 'div'
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
});

const emit = defineEmits([
  'update:modelValue',
  'change',
  ...[...events.manageAndEmit, ...events.emit].map((evt) => evt.toLowerCase())
]);

const instance = getCurrentInstance();

const attrs = useAttrs();
const slots = useSlots();

let draggingElement = null;
let error = false;
let targetDomElement = null;
let _sortable = null;
let componentStructure = null;
let el = ref(null);
let context = null;

const methodCalls = {
  onDragStart: (evtName) => onDragStart(evtName),
  onDragAdd: (evtName) => onDragAdd(evtName),
  onDragRemove: (evtName) => onDragRemove(evtName),
  onDragUpdate: (evtName) => onDragUpdate(evtName),
  onDragMove: (evtName) => onDragMove(evtName),
  onDragEnd: () => onDragEnd()
};

if (props.list && props.modelValue) {
  console.error('modelValue and list props are mutually exclusive! Please set one or another.');
}

const realList = computed(() => {
  return props.list ? props.list : props.modelValue;
});

const getKey = computed(() => (element) => {
  if (typeof props.itemKey === 'function') {
    return props.itemKey;
  } else {
    return element[props.itemKey];
  }
});

watch(
  () => attrs,
  (newValue) => {
    console.log('watch - attrs has changed - ', newValue);
    if (!_sortable) return;
    getValidSortableEntries(newValue).forEach(([key, value]) => {
      _sortable.option(key, value);
    });
  },
  {
    deep: true
  }
);

const nextTickEmit = (evtName, evtData) => {
  nextTick(() => emit(evtName.toLowerCase(), evtData));
};

const manage = (evtName) => {
  return (evtData, originalElement) => {
    if (realList.value) {
      return methodCalls[`onDrag${evtName}`](evtData, originalElement);
    }
  };
};

const manageAndEmit = (evtName) => {
  const delegateCallBack = manage.call(this, evtName);
  return (evtData, originalElement) => {
    delegateCallBack.call(this, evtData, originalElement);
    nextTickEmit.call(this, evtName, evtData);
  };
};

const getUnderlyingVm = (domElement) => {
  return componentStructure.getUnderlyingVm(domElement) || null;
};

const getUnderlyingPotentialDraggableComponent = (htmElement) => {
  //TODO check case where you need to see component children
  return htmElement.__draggable_component__;
};

const emitChanges = (evt) => {
  nextTick(() => emit('change', evt));
};

const alterList = (onList) => {
  if (props.list) {
    onList(props.list);
    return;
  }
  const newList = [...props.modelValue];

  onList(newList);
  emit('update:modelValue', newList);
};

function spliceList() {
  // @ts-ignore
  const spliceList = (list) => {
    list.splice(...arguments);
  };
  alterList(spliceList);
}

const updatePosition = (oldIndex, newIndex) => {
  const updatePosition = (list) => list.splice(newIndex, 0, list.splice(oldIndex, 1)[0]);
  alterList(updatePosition);
};

const getRelatedContextFromMoveEvent = ({ to, related }) => {
  const component = getUnderlyingPotentialDraggableComponent(to);
  if (!component) {
    return { component };
  }
  const localList = component.exposed.realList.value;
  const localContext = { localList, component };
  if (to !== related && localList) {
    const destination = component.exposed.getUnderlyingVm(related) || {};
    return { ...destination, ...localContext };
  }
  return localContext;
};

const getVmIndexFromDomIndex = (domIndex) => {
  return componentStructure.getVmIndexFromDomIndex(domIndex, targetDomElement);
};

const onDragStart = (evt) => {
  if (componentStructure.isMultiRootComponent) multiRootComponentOnDragStart(evt);

  context = getUnderlyingVm(evt.item);
  evt.item._underlying_vm_ = props.clone(context.element);
  draggingElement = evt.item;
};

const onDragAdd = (evt) => {
  const element = evt.item._underlying_vm_;
  if (element === undefined) {
    return;
  }
  removeNode(evt.item);
  const newIndex = getVmIndexFromDomIndex(evt.newIndex);
  // @ts-ignore
  spliceList(newIndex, 0, element);
  const added = { element, newIndex };
  emitChanges({ added });
};

const onDragRemove = (evt) => {
  insertNodeAt(el.value, evt.item, evt.oldIndex);
  if (evt.pullMode === 'clone') {
    removeNode(evt.clone);
    return;
  }
  const { index: oldIndex, element } = context;
  // @ts-ignore
  spliceList(oldIndex, 1);
  const removed = { element, oldIndex };
  emitChanges({ removed });
};

const onDragUpdate = (evt) => {
  removeNode(evt.item);
  insertNodeAt(evt.from, evt.item, evt.oldIndex);
  const oldIndex = context.index;
  const newIndex = getVmIndexFromDomIndex(evt.newIndex);
  updatePosition(oldIndex, newIndex);
  const moved = { element: context.element, oldIndex, newIndex };
  emitChanges({ moved });
};

const computeFutureIndex = (relatedContext, evt) => {
  if (!relatedContext.element) {
    return 0;
  }
  const domChildren = [...evt.to.children].filter((el) => el.style['display'] !== 'none');
  const currentDomIndex = domChildren.indexOf(evt.related);
  const currentIndex = relatedContext.component.exposed.getVmIndexFromDomIndex(currentDomIndex);
  const draggedInList = domChildren.indexOf(draggingElement) !== -1;
  return draggedInList || !evt.willInsertAfter ? currentIndex : currentIndex + 1;
};

const onDragMove = (evt, originalEvent) => {
  if (!props.move || !realList.value) {
    return true;
  }
  const relatedContext = getRelatedContextFromMoveEvent(evt);
  const futureIndex = computeFutureIndex(relatedContext, evt);
  const draggedContext = {
    ...context,
    futureIndex
  };
  const sendEvent = {
    ...evt,
    relatedContext,
    draggedContext
  };
  return props.move(sendEvent, originalEvent);
};

const onDragEnd = () => {
  if (componentStructure.isMultiRootComponent) multiRootComponentOnDragEnd(evt);

  draggingElement = null;
  //instance?.proxy?.$forceUpdate();
};

onMounted(() => {
  if (error) {
    return;
  }

  componentStructure.updated();

  const sortableOptions = createSortableOption({
    $attrs: attrs,
    callBackBuilder: {
      manageAndEmit: (event) => manageAndEmit.call(this, event),
      emit: (event) => nextTickEmit.bind(this, event),
      manage: (event) => manage.call(this, event)
    }
  });

  targetDomElement = el.value.nodeType === 1 ? el.value : el.value.parentElement;

  _sortable = new Sortable(targetDomElement, sortableOptions);
  targetDomElement.__draggable_component__ = instance;
});

onUpdated(() => {
  componentStructure.updated();
});

onRenderTracked((e) => {
  console.log('onRenderTracked - ', e);
});

onRenderTriggered((e) => {
  console.log('onRenderTriggered - ', e);
});

onBeforeUnmount(() => {
  if (_sortable) _sortable.destroy();
});

defineExpose({
  el,
  realList,
  getUnderlyingVm,
  getVmIndexFromDomIndex
});

const render = () => {
  try {
    error = false;
    //console.log('render el - ', el);

    componentStructure = computeComponentStructure({
      $slots: slots,
      tag: props.tag,
      realList: realList.value,
      getKey: getKey.value
    });

    const attributes = getComponentAttributes({
      ref: el,
      $attrs: attrs,
      componentData: props.componentData
    });

    return componentStructure.render(h, attributes);
  } catch (err) {
    error = true;
    console.error(err);
    return h('pre', { style: { color: 'red' } }, err.stack);
  }
};
</script>
