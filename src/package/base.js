/**
 * base.js
 *
 * Copyright (c) 2019 chengaohe All rights reserved.
 *
 * 无缝对接vue组件
 *
 */

import utils from "./libs/utils.js";
import constant from "./libs/constant.js";
import dataCache from "./libs/data-cache.js";
import {
  parseComponent,
  getModelEvent,
  needModelEvent
} from "./libs/component-utils";

import {
  h as createElement,
  resolveDirective,
  withDirectives,
  isVNode,
  resolveComponent
} from "vue";

export default {
  // name: "esBase",
  render: function() {
    return this.renderUi(this.config, false, constant.COM_TARGET_REF);
  },
  // inheritAttrs: false,
  props: {
    config: {
      type: Object,
      required: true,
      default: () => {
        return {
          name: "" //lg-element 组件 原生组件
          // value: "",
          // attrs: {},
          // style: {},
          // class: {},
          // props: {}
        };
      }
    },

    // 当!!this.info为非真时，处理事件会让父级处理
    info: {
      type: Object,
      required: false,
      default: undefined
    },

    /* 是否是主组件：也就是右边的组件；当为真时，处理事件会让父级处理 */
    isMain: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data() {
    return {
      emitOn: null,
      scopedSlots: undefined
    };
  },

  created() {
    this.initUi();
  },

  methods: {
    initUi() {
      var ref = constant.COM_TARGET_REF;
      this.$data.emitOn = this.createEmitOn(this.config, this.isMain, ref);
      this.$data.scopedSlots = this.createScopedSlots(this.config, ref);
    },

    /**
     * 渲染函数
     * @param {*} config        组件设置
     * @param {*} isSlotCom     是否插槽的组件，因为事件不一样，插槽数据也不一样
     * @returns VNode
     */
    renderUi(config, isSlotCom, ref) {
      // config = config || {};
      var vnode;
      // 根据vue源代码, VNode是不会被劫持的
      if (isVNode(config)) {
        vnode = config;
      } else if (utils.isObj(config)) {
        if (!config.name) {
          console.error("错误的config: ", config);
          throw "es-base config.name必须存在";
        }

        // 防止props不存在
        var configProps = config.props ? config.props : {};

        // 计算出props, attrs
        var newProps = {};

        var componentName = config.name.toLowerCase
          ? config.name.toLowerCase()
          : config.name;
        if (
          componentName === constant.TAG_INPUT && // 不区分大小写
          (configProps.type === constant.TYPE_RADIO ||
            configProps.type === constant.TYPE_CHECKBOX)
        ) {
          if (configProps.type === constant.TYPE_RADIO) {
            Object.assign(newProps, configProps);
            if (utils.hasOwn("value", config)) {
              // 用户设置了value的情况
              newProps.checked = config.value === configProps.value;
            } else {
              // 没有用户value
              newProps.checked =
                utils.hasOwn("checked", configProps) &&
                configProps.checked !== false
                  ? true
                  : false;
            }
          } else {
            var checked = false;
            if (utils.hasOwn("value", config)) {
              if (!utils.isUndef(configProps.trueValue)) {
                // 经测试，若指定了trueValue，无论falseValue是否指定，只有值等于trueValue，checked才为true
                if (config.value === configProps.trueValue) {
                  checked = true;
                } else {
                  checked = false;
                }
              } else if (!utils.isUndef(configProps.falseValue)) {
                // 经测试：当trueValue没有指定，falseValue指定，只有值等于falseValue，checked才为false
                if (config.value === configProps.falseValue) {
                  checked = false;
                } else {
                  checked = true;
                }
              } else {
                // 经测试：当trueValue和falseValue没有指定，checked才为!!config.value
                checked = !!config.value;
              }
            } else {
              checked =
                utils.hasOwn("checked", configProps) &&
                configProps.checked !== false
                  ? true
                  : false;
            }
            Object.assign(newProps, configProps);
            newProps.checked = checked;
          }
        } else {
          Object.assign(newProps, configProps);
          if (needModelEvent(config)) {
            // 有双向绑定事件，需要写model
            var newValue;
            if (utils.hasOwn("value", config)) {
              newValue = utils.isRefVal(config.value)
                ? utils.deepCopy(config.value)
                : config.value; // 这样防止引用地址被组件内部修改
            } else {
              newValue = configProps.value;
            }
            newProps[config.model] = newValue;
          }
        }

        let emitOn, scopedSlots;
        if (!isSlotCom) {
          // 内容组件，非插槽组件: 因为常用，所以计算好
          emitOn = this.$data.emitOn;
          scopedSlots = this.$data.scopedSlots;
        } else {
          // 很少用，且scopedSlots有可能包含函数，必须实时解析
          emitOn = this.createEmitOn(config, false, ref);
          scopedSlots = this.createScopedSlots(config, ref);
        }

        scopedSlots = scopedSlots || {};

        Object.assign(newProps, emitOn);
        // COM_TARGET_REF时ref必须存在，因为要搜索
        if (
          ref === constant.COM_TARGET_REF ||
          (emitOn && Object.keys(emitOn).length > 0)
        ) {
          newProps.ref = ref;
        }

        if (config.class) {
          newProps.class = config.class;
        }
        if (config.style) {
          newProps.style = config.style;
        }

        var configComponent;
        if (
          utils.isStr(config.name) &&
          !constant.HTML_TAGS.includes(config.name)
        ) {
          configComponent = resolveComponent(config.name); // 经测试resolveComponent('div1')返回div1
          if (!configComponent) {
            configComponent = config.name;
          }
        } else {
          configComponent = config.name;
        }

        vnode = createElement(
          configComponent,
          newProps,
          Object.keys(scopedSlots).length > 0 ? scopedSlots : undefined
        );

        newProps = null;

        configProps = null;
      } else if (utils.isFunc(config)) {
        var options = {
          global: dataCache.getGlobal(this.config.__formId), // 直接取组件__formId，插槽是没有__formId的
          rootData: dataCache.getRoot(this.config.__formId), // 兼容1.7.0以前，不包括1.7.0
          root: dataCache.getRoot(this.config.__formId),
          idxChain: this.info.idxChain,
          index: this.info.index,
          pathKey: this.info.pathKey,
          $hidden: dataCache.getHiddenFunc(this.config.__formId)
        };

        vnode = config(options);
        if (!isVNode(vnode)) {
          vnode = this.renderUi(vnode, isSlotCom, ref);
        }
        options = null;
      } else if (
        utils.isStr(vnode) ||
        utils.isUndef(vnode) ||
        utils.isNum(vnode) ||
        utils.isBool(vnode) ||
        utils.isNull(vnode)
      ) {
        // console.log("vnode", vnode)
        vnode = createElement("span", vnode); // 经验证，这样写没有问题：vnode不用加""
      } else {
        console.error("错误的config: ", config);
        throw "es-base config当是一个函数时，其返回值必须是一个虚拟节点或字符串";
      }

      // 这个不能删除：vue机制，主要是为了执行config.__refreshIndex；当表单改变时，同步更新页面
      if (
        !isSlotCom &&
        config &&
        config.__refreshIndex
        // this.__slotUpdateTime
      ) {
        // 永远都不会进入这，因为__slotUpdateTime没有值的
        // this.__slotUpdateTime++;
      }

      var directives = config.directives;
      // ? utils.deepCopy(config.directives)
      // : []; // false, 不是数组也没有事

      if (directives && directives.length) {
        var drts = [];
        directives.forEach(function(directive) {
          if (directive.name) {
            var drt = utils.isStr(directive.name)
              ? resolveDirective(directive.name)
              : directive.name; // 局部组件只有本身（base/index.js）才能取得到，引用（base/index.js）的那个组件定义了也取不到的
            if (drt) {
              drts.push([
                drt,
                directive.value,
                directive.arg,
                directive.modifiers
              ]);
            }
          }
        });
        if (drts.length) {
          return withDirectives(vnode, drts);
        }
      }
      // console.log('here...', vnode);
      return vnode;
    },

    eventHandler(config, eventName, args, isMain, ref) {
      args = args ? args : [];
      // console.log("eventHandler", this.$refs[ref].$el);
      if (isMain) {
        var modelValueEvent = getModelEvent(config); // v-model双向绑定事件
        // 主组件：让父类去处理
        this.$emit(
          "trigger",
          eventName,
          args,
          this.$refs[ref],
          modelValueEvent === eventName
        );
      } else {
        // 一般组件，自己处理
        var options = {
          value: utils.deepCopy(config.value),
          event: args[0],
          args: args,
          pathKey: this.info.pathKey,
          index: this.info.index,
          idxChain: this.info.idxChain,
          target: this.$refs[ref]
        };

        var handlers = [];
        var actions = config.actions;
        if (actions) {
          actions.forEach(action => {
            if (action.trigger && action.trigger.includes(eventName)) {
              handlers.push(action.handler);
            }
          });
        }

        if (handlers.length > 0) {
          var thisFrom = this.__getForm();
          thisFrom._handleEvents(handlers, options);
        }
      }
    },

    __getForm() {
      var formItem = this.$parent;
      while (formItem) {
        var type = formItem._getType ? formItem._getType() : "";
        if (type == constant.UI_FORM) {
          return formItem; // 到达表单层
        } else if (type == constant.UI_ARRAY) {
          // checkSchema.push(formItem._getSchema());
        } else {
          // ... 往上派
        }
        formItem = formItem.$parent;
      }
    },

    __parseModelEvent(config, eventData) {
      var eventValue;
      if (eventData && eventData.target && eventData.target.nodeName) {
        var tagName = eventData.target.tagName;
        var nodeType = eventData.target.type;
        if (tagName.toLowerCase() === constant.TAG_INPUT) {
          var configProps;
          if (nodeType === constant.TYPE_RADIO) {
            // 防止props不存在
            configProps = config.props ? config.props : {};
            if (eventData.target.checked) {
              eventValue = configProps.value;
            } else {
              eventValue = undefined;
            }
          } else if (nodeType === constant.TYPE_CHECKBOX) {
            // 防止props不存在
            configProps = config.props ? config.props : {};
            if (eventData.target.checked) {
              eventValue = true;
              if (!utils.isUndef(configProps.trueValue)) {
                eventValue = configProps.trueValue;
              }
            } else {
              eventValue = false;
              if (!utils.isUndef(configProps.falseValue)) {
                eventValue = configProps.falseValue;
              }
            }
          } else {
            eventValue = eventData.target.value;
          }
        } else {
          eventValue = eventData.target.value;
        }
      } else {
        eventValue = eventData;
      }
      return eventValue;
    },

    /**
     * 创建emit派发所需要监听的事件
     */
    createEmitOn(config, isMain, ref) {
      var _thisVm = this;

      var hasOwnValue = utils.hasOwn("value", config);
      var modelValueEvent = needModelEvent(config)
        ? getModelEvent(config)
        : false; // v-model双向绑定事件
      var emitEvents;
      if (modelValueEvent) {
        // 不需要双向绑定事件
        if (config.__emitEvents) {
          emitEvents = utils.deepCopy(config.__emitEvents);
          if (hasOwnValue && !emitEvents.includes(modelValueEvent)) {
            emitEvents.push(modelValueEvent);
          }
        } else {
          if (hasOwnValue) {
            emitEvents = [modelValueEvent];
          } else {
            emitEvents = [];
          }
        }
      } else {
        emitEvents = config.__emitEvents
          ? utils.deepCopy(config.__emitEvents)
          : [];
      }

      // emit发出的事件
      var emitOn = {};
      emitEvents.forEach(eventName => {
        var onEventName = "on" + utils.firstUpper(eventName);
        if (eventName == modelValueEvent && hasOwnValue) {
          emitOn[onEventName] = function(eventData) {
            var eventValue = _thisVm.__parseModelEvent(config, eventData);
            if (config.value !== eventValue) {
              config.value = eventValue;
              _thisVm.eventHandler(config, eventName, arguments, isMain, ref);
            }
          };
        } else {
          emitOn[onEventName] = function() {
            _thisVm.eventHandler(config, eventName, arguments, isMain, ref);
          };
        }
      });

      return emitOn;
    },

    createScopedSlots(config, pref) {
      var scopedSlots = config.scopedSlots || config.slots; // 以后直接统一为slots
      if (scopedSlots) {
        var newScopedSlots = {};
        for (var key in scopedSlots) {
          newScopedSlots[key] = this.newSlotFunc(key, scopedSlots[key], pref);
        }
        // console.log("newScopedSlots", config.name, Object.keys(newScopedSlots));
        return newScopedSlots;
      } else {
        return undefined;
      }
    },

    newSlotFunc(key, slotValue, pref) {
      var vm = this;
      return function(scoped) {
        // console.log("scoped", scoped);
        var vnodes;
        if (utils.isFunc(slotValue)) {
          var options = {
            global: dataCache.getGlobal(vm.config.__formId),
            rootData: dataCache.getRoot(vm.config.__formId), // 兼容1.7.0以前，不包括1.7.0
            root: dataCache.getRoot(vm.config.__formId),
            idxChain: vm.info.idxChain,
            index: vm.info.index,
            pathKey: vm.info.pathKey,
            $hidden: dataCache.getHiddenFunc(vm.config.__formId)
          };
          scoped = scoped ? scoped : {};
          vnodes = slotValue(options, scoped);
          if (!utils.isArr(vnodes)) {
            vnodes = [vnodes];
          }
          var tmpVNodes = [];
          vnodes.forEach(function(vnode) {
            if (!utils.isVNode(vnode) && utils.isObj(vnode)) {
              var newComponent = parseComponent(
                vnode,
                vm.info.pathKey + "> scopeSlots(function返回值) > " + key,
                true,
                false
              );
              if (newComponent) {
                tmpVNodes.push(newComponent);
              }
            } else {
              tmpVNodes.push(vnode);
            }
          });
          vnodes = tmpVNodes;
        } else {
          vnodes = [slotValue];
        }

        if (
          key === "default" &&
          vm.config.text !== undefined &&
          vm.config.text !== null
        ) {
          vnodes.unshift(vm.config.text);
        }

        var newVNode,
          newVNodes = [];
        vnodes.forEach(function(vnode, index) {
          if (!utils.isVNode(vnode) && utils.isObj(vnode)) {
            if (!vnode.hidden) {
              newVNode = vm.renderUi(vnode, true, pref + "_" + index);
              newVNodes.push(newVNode);
            }
          } else {
            newVNodes.push(vnode);
          }
        });

        if (newVNodes.length <= 0) {
          newVNodes = undefined;
        }

        return newVNodes;
      };
    }
  },

  unmounted() {
    this.$data.emitOn = null;
    // this.$data.nativeOn = null;
    this.$data.scopedSlots = null;
  },

  watch: {
    config: {
      handler: function(/* newVal, oldVal */) {
        this.initUi();
      },
      deep: false
    }
  }
};
