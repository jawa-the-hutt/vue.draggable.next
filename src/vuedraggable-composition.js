import Sortable from 'sortablejs';
import {
  insertNodeAt,
  removeNode,
  multiRootComponentOnDragStart,
  multiRootComponentOnDragEnd,
  makeId
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
  computed,
  watch,
  ref,
  toRef,
  getCurrentInstance,
  h,
  defineComponent,
  provide,
  inject
} from 'vue';
import store from './useSortables';

const nextTickEmit = (evtName, instance, evtData) => {
  nextTick(() => instance?.proxy?.$emit(evtName.toLowerCase(), evtData));
};

const manage = (evtName, methodCalls, realList) => {
  return (evtData, originalElement) => {
    if (realList.value) {
      return methodCalls[`onDrag${evtName}`](evtData, originalElement);
    }
  };
};

const manageAndEmit = (evtName, instance, methodCalls, realList) => {
  const delegateCallBack = manage.call(this, evtName, methodCalls, realList);
  return (evtData, originalElement) => {
    delegateCallBack.call(this, evtData, originalElement);
    nextTickEmit.call(this, evtName, instance, evtData);
  };
};

const draggableComponent = defineComponent({
  name: 'draggable',
  inheritAttrs: false,
  props: {
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
  },
  emits: [
    'update:modelValue',
    'change',
    ...[...events.manageAndEmit, ...events.emit].map((evt) => evt.toLowerCase())
  ],
  setup(props, { attrs, slots, emit, expose }) {
    const instance = getCurrentInstance();
    //console.log('instance - ', instance.proxy);
    const id = makeId(5);

    // const list = ref(props.list);
    // const modelValue = ref(props.modelValue);
    // const itemKey = ref(props.itemKey);
    // const tag = ref(props.tag);
    // const componentData = ref(props.componentData);

    let draggingElement = null;
    let error = false;
    let targetDomElement = ref(null);
    let _sortable = ref(null);
    let componentStructure = null;
    let el = ref(null);
    let context = ref(null);
    const providedElement = {
      id,
      instance
    };

    const methodCalls = {
      onDragStart: (evtName) => onDragStart(evtName),
      onDragAdd: (evtName) => onDragAdd(evtName),
      onDragRemove: (evtName) => onDragRemove(evtName),
      onDragUpdate: (evtName) => onDragUpdate(evtName),
      onDragMove: (evtName) => onDragMove(evtName),
      onDragEnd: (evtName) => onDragEnd(evtName)
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
        if (!_sortable.value) return;
        getValidSortableEntries(newValue).forEach(([key, value]) => {
          _sortable.value.option(key, value);
        });
      },
      {
        deep: true
      }
    );

    // // const nextTickEmit = (evtName, evtData) => {
    // //   nextTick(() => emit(evtName.toLowerCase(), evtData));
    // // };

    // // const manage = (evtName) => {
    // //   return (evtData, originalElement) => {
    // //     if (realList.value) {
    // //       return methodCalls[`onDrag${evtName}`](evtData, originalElement);
    // //     }
    // //   };
    // // };

    // // const manageAndEmit = (evtName) => {
    // //   const delegateCallBack = manage.call(this, evtName);
    // //   return (evtData, originalElement) => {
    // //     delegateCallBack.call(this, evtData, originalElement);
    // //     nextTickEmit.call(this, evtName, evtData);
    // //   };
    // // };

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
      const updatePosition = (list) => {
        const element = list.splice(oldIndex, 1)[0];
        list.splice(newIndex, 0, element);
      };

      //const updatePosition = (list) => props.value.splice(newIndex, 0, props.value.splice(oldIndex, 1)[0]);

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
      return componentStructure.getVmIndexFromDomIndex(domIndex, targetDomElement.value);
    };

    const onDragStart = (evt) => {
      if (componentStructure.isMultiRootComponent) multiRootComponentOnDragStart(evt);

      context.value = getUnderlyingVm(evt.item);
      evt.item._underlying_vm_ = props.clone(context.value.element);
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
      const { index: oldIndex, element } = context.value;
      // @ts-ignore
      spliceList(oldIndex, 1);
      const removed = { element, oldIndex };
      emitChanges({ removed });
    };

    const onDragUpdate = (evt) => {
      removeNode(evt.item);
      insertNodeAt(evt.from, evt.item, evt.oldIndex);
      const oldIndex = context.value.index;
      const newIndex = getVmIndexFromDomIndex(evt.newIndex);
      updatePosition(oldIndex, newIndex);
      const moved = { element: context.value.element, oldIndex, newIndex };
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
      const parent = evt.to.$parent;
      const elll = evt.to.$el;


      if (!props.move || !realList.value) {
        return true;
      }
      const relatedContext = getRelatedContextFromMoveEvent(evt);
      const futureIndex = computeFutureIndex(relatedContext, evt);
      const draggedContext = {
        ...context.value,
        futureIndex
      };
      const sendEvent = {
        ...evt,
        relatedContext,
        draggedContext
      };
      return props.move(sendEvent, originalEvent);
    };

    const onDragEnd = (evt) => {
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
          // manageAndEmit: (event) => manageAndEmit.call(this, event, instance, methodCalls, realList),
          // emit: (event) => nextTickEmit.bind(this, event, instance),
          // manage: (event) => manage.call(this, event, methodCalls, realList)
          manageAndEmit: (event) => {
            // console.log('onMounted - manageEmit Callback - this - ', this);
            // console.log('onMounted - manageEmit Callback - event - ', event);
            return manageAndEmit.call(this, event, instance, methodCalls, realList)
          },
          emit: (event) => {
            // console.log('onMounted - emit Callback - this - ', this);
            // console.log('onMounted - emit Callback - event - ', event);
            return nextTickEmit.bind(this, event, instance)
          },
          manage: (event) => {
            // console.log('onMounted - manage Callback - this - ', this);
            // console.log('onMounted - manage Callback - event - ', event);
            return manage.call(this, event, methodCalls, realList)
          }
        }
      });

      if(componentStructure.externalComponent || componentStructure.rootTransition) {
        el.value = el.value.$el;
      }

      targetDomElement.value = el.value.nodeType === 1 ? el.value : el.value.parentElement;

      _sortable.value = new Sortable(targetDomElement.value, sortableOptions);
      targetDomElement.value.__draggable_component__ = instance;

      console.log('store.sortables - ', store.state.sortables);
      store.setSortablesAction(providedElement);
      console.log('store.sortables - ', store.state.sortables);
    });

    onUpdated(() => {
      componentStructure.updated();
    });

    onBeforeUnmount(() => {
      store.removeSortablesAction(providedElement)
      if (_sortable.value) _sortable.value.destroy();
    });

    try {
      error = false;

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

      expose({
        el,
        realList,
        getUnderlyingVm,
        getVmIndexFromDomIndex
      });

      return () => componentStructure.render(h, attributes);
    } catch (err) {
      error = true;
      console.error(err);
      return () => h('pre', { style: { color: 'red' } }, err.stack);
    }
  }
});

export default draggableComponent;
