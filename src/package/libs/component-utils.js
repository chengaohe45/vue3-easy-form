/**
 * component-utils.js
 *
 * Copyright (c) 2020 chengaohe All rights reserved.
 *
 * 解析表单所需要的组件
 */

import utils from "./utils";
import constant from "./constant";
import { enterSubmit, onlySubmit } from "./submit";
import parse from "./parse";
import global from "./global";

import {
  markRaw
  // shallowRef
} from "vue";

("use strict");

/**
 * 解析主组件：如也就是右栏的组件
 */
export function parseMainComponent(propItem, formId, myPathKey) {
  var component = propItem.component;
  var newComponent,
    defaultAlign = false;
  if (utils.isVNode(component)) {
    throw myPathKey + " > 主组件暂不支持直接配置虚拟节点";
  } else if (utils.isObj(component) && Object.keys(component).length > 0) {
    if (utils.hasOwn("value", propItem)) {
      component = Object.assign({}, component);
      component.value = propItem.value;
    } else if (utils.hasOwn("value", component)) {
      // 说是取我本身
    } else {
      component = Object.assign({}, component);
      // 自动补充value: 因为是表单组件
      component.value =
        component.name === global.defaultCom ? global.defaultVal : undefined;
    }
    // 下面会继续统一判断
  } else if (utils.isStr(component)) {
    // 要自动补充value
    component = {
      name: component,
      // actions: [],
      // align: defaultAlign,
      // flex: false,
      value: utils.hasOwn("value", propItem)
        ? propItem.value
        : global.defaultCom === component
        ? global.defaultVal
        : undefined
    };
  } else {
    // 要自动补充value
    component = {
      name: global.defaultCom,
      // actions: [],
      // align: defaultAlign,
      // flex: false
      value: global.defaultVal
    };
  }

  if (!component.name) {
    component = Object.assign({}, component, { name: global.defaultCom }); // 补上组件name
  }
  newComponent = parseComponent(component, myPathKey);
  // 主组特有配置
  var ref = utils.isStr(component.ref) ? component.ref.trim() : null;
  if (ref) {
    newComponent.ref = ref;
  }

  newComponent.align = parseAlign(component.align, defaultAlign);
  newComponent.flex = parseFlex(component.flex, component.size);

  newComponent.__formId = formId;
  // newComponent.props = newComponent.props ? newComponent.props : {};

  return newComponent;
}

/**
 * 解析一般属性组件：如label, desc
 */
export function parsePropComponent(value, formId, myPathKey, canEmpty = false) {
  var newComponent;

  if (utils.isVNode(value)) {
    throw myPathKey + " > 组件暂不支持直接配置虚拟节点";
  } else if (utils.isObj(value) && Object.keys(value).length > 0) {
    newComponent = {};
    var name = utils.isStr(value.name) ? value.name.trim() : value.name;

    if (name) {
      newComponent = parseComponent(value, myPathKey);
      if (!newComponent) {
        return false;
      }
    } else {
      var rawText = value.text;
      if (!utils.isFunc(rawText)) {
        rawText = utils.toNormalText(rawText); // 转换为文本
      }
      if (rawText || canEmpty) {
        // 如label可为空
        var tmpValue = Object.assign({}, value, { name: "span" });
        newComponent = parseComponent(tmpValue, myPathKey);
        tmpValue = null;
        if (newComponent) {
          if (utils.hasOwn("name", newComponent)) {
            delete newComponent.name; // 本来就没有或为空，删除它
            delete newComponent.model;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    }

    if (parse.isEsOrFunc(value.hidden)) {
      newComponent.hidden = false;
      newComponent.__rawHidden = parse.newEsFuncion(value.hidden);
    } else {
      newComponent.hidden = !!value.hidden;
    }
  } else if (utils.isNormalText(value)) {
    value = utils.toNormalText(value);
    if (value || canEmpty) {
      if (parse.isEsOrFunc(value)) {
        newComponent = {
          text: value,
          __rawText: parse.newEsFuncion(value),
          hidden: false
        };
      } else {
        newComponent = {
          text: value,
          hidden: false
        };
      }
    } else {
      return false;
    }
  } else if (utils.isFunc(value)) {
    newComponent = {
      text: value,
      __rawText: value,
      hidden: false
    };
  } else {
    return false;
  }

  newComponent.__formId = formId;

  return newComponent;
}

/**
 * 解析标准组件：一个要是一个对象{name: xx}
 * @param {*} component
 * @param {*} myPathKey
 * @param {*} canNone 当格式不合法时返回false(现在只有名字为空时返回false)。默认为false
 * @param {*} needParse 是否需要解析，静态是不需要动态解析的。默认为true
 * @returns {Object} 标准对象写法
 */
export function parseComponent(
  component,
  myPathKey,
  canNone = false,
  needParse = true
) {
  if (utils.isObj(component) && component.name) {
    var newComponent = {};
    var name = utils.isStr(component.name)
      ? component.name.trim()
      : component.name;

    if (name) {
      if (utils.isStr(name) && !utils.validateComponentName(name)) {
        throw "组件名(" + " > " + name + ")存在html非法字符";
      }

      newComponent.name = name;
      // 属性
      var propInfo = parseComProps(
        component.props,
        ["style", "class"],
        needParse
      );
      // console.log(propInfo);
      if (propInfo.new) {
        newComponent.props = propInfo.new;
      }

      if (propInfo.raw) {
        newComponent.__rawProps = propInfo.raw;
      }

      if (propInfo.staticNames) {
        newComponent.__staticPropNames = propInfo.staticNames;
      }

      // 指令
      var directiveInfo = parseDirectives(
        utils.isUndef(component.directives)
          ? component.v
          : component.directives,
        needParse
      );

      if (directiveInfo.new) {
        newComponent.directives = directiveInfo.new;
      }

      if (directiveInfo.raw) {
        newComponent.__rawDirectives = directiveInfo.raw;
      }

      // 提取class和style
      Object.assign(newComponent, parseClassStyle(component, needParse));

      // value
      if (utils.hasOwn("value", component)) {
        newComponent.value = component.value;
      } else {
        // 无value, 证明不用双向绑定：这个不同于项组件的value, 人家会自动补充，这里没有
      }

      var rawText = component.text;
      if (needParse && parse.isEsOrFunc(rawText)) {
        newComponent.text = rawText;
        if (parse.isEsOrFunc(rawText)) {
          newComponent.__rawText = parse.newEsFuncion(rawText);
        }
      } else {
        newComponent.text = utils.toComText(rawText);
      }
    } else {
      if (!canNone) {
        throw myPathKey + "组件格式不正确，必须是一个对象，且name必须存在.";
      } else {
        return false;
      }
    }

    if (needParse && parse.isEsOrFunc(component.hidden)) {
      newComponent.hidden = false;
      newComponent.__rawHidden = parse.newEsFuncion(component.hidden);
    } else {
      newComponent.hidden = !!component.hidden;
    }
  } else {
    if (!canNone) {
      throw myPathKey + "组件格式不正确，必须是一个对象，且name必须存在";
    } else {
      return false;
    }
  }

  // slots要放在text后面
  var hasTextSlot = newComponent.__rawText || newComponent.text ? true : false;
  var slotInfo = parseScopedSlots(
    component.scopedSlots,
    hasTextSlot,
    myPathKey,
    needParse
  );
  if (slotInfo) {
    if (slotInfo.hasRuntime) {
      // 需要检测

      newComponent.__refreshIndex = 0;
    }
    newComponent.scopedSlots = slotInfo.scopedSlots;
  }

  newComponent.props = newComponent.props ? newComponent.props : {};

  newComponent.model = parseModelKey(newComponent, component.model);

  newComponent.actions = parseActions(
    component.actions,
    getModelEvent(newComponent),
    myPathKey
  ); // 要在model之后
  // 提取出所需要的监听事件（可以再次改造，如主组件去掉左中两边空格的事件就要重新改造合并）
  newComponent.__emitEvents = fetchActionEvent(newComponent.actions);

  if (utils.isObj(newComponent.name)) {
    newComponent.name = markRaw(newComponent.name); // ...
    newComponent[constant.COMPONENT_FLAG_KEY] = constant.COMPONENT_FLAG_VALUE;
  }

  return newComponent;
}

/**
 * 解析/标准化项组件的事件
 * @param {*} actions
 * @param {*} myPathKey
 */
export function parseActions(actions, modelEvent, myPathKey, fromArray) {
  // 解析是否为特殊写法
  var newActions = [];
  if (
    (utils.isObj(actions) && Object.keys(actions).length > 0) ||
    (utils.isArr(actions) && actions.length > 0) ||
    utils.isFunc(actions) ||
    utils.isStr(actions)
  ) {
    var tmpActions;
    if (utils.isFunc(actions)) {
      tmpActions = [{ trigger: constant.CLICK_EVENT, handler: actions }];
    } else if (utils.isObj(actions)) {
      tmpActions = [actions];
    } else if (utils.isStr(actions)) {
      tmpActions = [actions];
    } else {
      // 就是数组了
      tmpActions = actions;
    }
    tmpActions.forEach(tmpAction => {
      var newTrigger, newAction;
      if (utils.isStr(tmpAction)) {
        tmpAction = tmpAction.trim();
        if (tmpAction == constant.ENTER_SUBMIT) {
          // keyup.native提交事件
          newActions.push({
            trigger: [constant.KEYUP_EVENT],
            handler: enterSubmit
          });
        } else {
          var actionInfos = tmpAction.split(/\s*=\s*/);
          if (
            actionInfos &&
            actionInfos.length == 2 &&
            actionInfos[1] == constant.ONLY_SUBMIT
          ) {
            // newActions.push({trigger: actionInfos[0], handler: onlySubmit});
            newAction = {};
            newTrigger = parseTrigger(actionInfos[0], modelEvent, fromArray);
            newAction.trigger =
              newTrigger && newTrigger.length > 0
                ? newTrigger
                : [constant.CLICK_EVENT];
            newAction.handler = onlySubmit;
            newActions.push(newAction);
          } else {
            console.warn(
              "key(" + myPathKey + ")存在不合法的事件，将过滤去掉，不会执行."
            );
          }
        }
      } else if (utils.isFunc(tmpAction.handler)) {
        newAction = {};
        newTrigger = parseTrigger(tmpAction.trigger, modelEvent, fromArray);
        newAction.trigger =
          newTrigger && newTrigger.length > 0
            ? newTrigger
            : [constant.CLICK_EVENT];
        newAction.handler = tmpAction.handler;
        newActions.push(newAction);
      } else {
        // 非法写，不是函数，去掉它
        console.warn(
          "key(" + myPathKey + ")存在不合法的事件，将过滤去掉，不会执行"
        );
      }
    });
  } else {
    // console.warn("key(" + myPathKey + ")component事件类型不合法.");
  }

  return newActions.length > 0 ? newActions : null;
}

/**
 * 解析触发事件
 * @param {*} trigger
 * 1. 事件字件串或者以空格隔开的事件所组成的字符串，如"click" or "click change"
 * 2. 事件组成的数组
 * @returns 返回数据组，没有时返回一个null
 */
export function parseTrigger(trigger, modelEvent, fromArray) {
  modelEvent = modelEvent ? modelEvent : constant.MODEL_VALUE_EVENT;
  var tmpTriggers;
  if (trigger === true) {
    trigger = modelEvent;
  }
  if (utils.isArr(trigger) || utils.isStr(trigger)) {
    if (utils.isStr(trigger)) {
      trigger = trigger.trim();
      tmpTriggers = trigger.split(/\s+/);
    } else {
      tmpTriggers = [];
      trigger.forEach(item => {
        if (utils.isStr(item)) {
          item = item.trim();
          tmpTriggers = tmpTriggers.concat(item.split(/\s+/));
        } else if (item === true) {
          tmpTriggers.push(modelEvent);
        }
      });
    }

    tmpTriggers = tmpTriggers.map(item => {
      if (!item) {
        // 为空，直接写默认事件
        return constant.CLICK_EVENT;
      } else if (item.indexOf(".") === 0) {
        // 只有修饰，前面加默认事件
        return constant.CLICK_EVENT + item;
      } else if (fromArray && item === "input") {
        console.warn(
          "数组配置中的input事件已经移除，事件名可用true或change代替"
        );
        return modelEvent;
      } else {
        // 合法
        return item;
      }
    });
  } else {
    tmpTriggers = null;
  }
  return tmpTriggers && tmpTriggers.length > 0 ? tmpTriggers : null;
}

/**
 * 提取出class和style
 * @param {*} item
 * @returns {class和style}
 */
export function parseClassStyle(item, needParse = true) {
  var newItem = {};
  if (needParse && parse.isEsOrFunc(item.class)) {
    newItem.class = null;
    newItem.__rawClass = parse.newEsFuncion(item.class);
  } else {
    if (item.class) {
      newItem.class = utils.deepCopy(item.class);
    }
  }

  if (needParse && parse.isEsOrFunc(item.style)) {
    newItem.style = null;
    newItem.__rawStyle = parse.newEsFuncion(item.style);
  } else {
    if (utils.isObj(item.style) && Object.keys(item.style).length) {
      newItem.style = utils.deepCopy(item.style);
    }
  }
  return newItem;
}

/**
 * 整理出"表单"组件需要监听的外部事件
 */
export function fetchActionEvent(actions) {
  var emitEvents = [];
  var nativeEvents = [];
  var triggerList, nativeName;
  // 自定义事件
  if (actions) {
    actions.forEach(actionItem => {
      triggerList = actionItem.trigger;
      triggerList.forEach(triggerItem => {
        nativeName = getNativeName(triggerItem);
        if (nativeName) {
          // .native监听
          nativeEvents.push(nativeName);
        } else {
          emitEvents.push(triggerItem);
        }
      });
    });
  }
  if (nativeEvents.length > 0) {
    console.error(
      "组件：由于vue3事件是不区分native事件，此事件将失效:",
      nativeEvents.map(function(event) {
        return event + "." + constant.ADJ_NATIVE;
      })
    );
  }

  return emitEvents.length ? utils.unique(emitEvents) : null;
}

/**
 * 提取是否为.native事件
 * @param {*} eventName
 */
export function getNativeName(eventName) {
  var dotNative = "." + constant.ADJ_NATIVE;
  var lastIndex = eventName.lastIndexOf(dotNative);
  if (lastIndex != -1 && eventName.substr(lastIndex) === dotNative) {
    // .native监听
    var nativeName = eventName.substr(0, lastIndex);
    if (nativeName) {
      return nativeName;
    } else {
      return false; //因为eventName是经过处理的,不会出现点在前面，所以不会进入这里
    }
  } else {
    return false;
  }
}

/**
 * 解析项label和项组件的对齐方式
 */
export function parseAlign(align, defaultVal = "left") {
  var aligns = ["left", "center", "right"];
  if (aligns.includes(align)) {
    return align;
  }
  return defaultVal;
}

/**
 * 解析项label和项组件的在弹性布局中的占位情况
 */
export function parseFlex(flex, size) {
  var flexs = ["self", "full"];
  if (flexs.includes(flex)) {
    return flex;
  }

  // 兼容一下之前的东西
  var sizes = ["fixed", "auto"];
  var sizeIndex = sizes.indexOf(size);
  if (sizeIndex >= 0) {
    console.warn(
      'label.size and component.size ["fixed", "auto"]已经舍弃了，请使用flex ["self", "full"]'
    );
    return flexs[sizeIndex];
  }

  return false;
}

export function getModelEvent(component) {
  var componentName = component.name;
  if (utils.isStr(component.name)) {
    componentName = component.name.toLowerCase();
  }

  if (constant.FORM_INPUTS.includes(componentName)) {
    return "input";
  } else {
    return "update:" + component.model;
  }
}

export function needModelEvent(component) {
  var componentName = component.name;
  if (utils.isStr(component.name)) {
    componentName = component.name.toLowerCase();
  } else {
    return true;
  }
  if (constant.PLAIN_HTML_TAGS.includes(componentName)) {
    return false;
  } else {
    return true;
  }
}

function parseModelKey(component, rawModelKey) {
  var componentName = component.name;
  if (utils.isStr(component.name)) {
    componentName = component.name.toLowerCase();
  }
  if (constant.FORM_INPUTS.includes(componentName)) {
    return "value";
  } else {
    var newModelKey;
    if (utils.isStr(rawModelKey)) {
      if (rawModelKey) {
        newModelKey = rawModelKey.trim();
      }
    } else if (utils.isStr(component.name)) {
      newModelKey = global.customModels[component.name];
    }

    if (!newModelKey) {
      newModelKey = global.defaultModel;
    }

    return newModelKey;
  }
}

/**
 * 解析组件属性
 */
function parseComProps(props, excludeKeys, needParse = true) {
  var newProps = {},
    rawProps = {};
  var staticNames = [];

  if (!utils.isObj(props)) {
    props = {};
  }

  var hasEsFunc = false;

  // var PREFIXS = constant.PREFIX_STATIC_FUNC;

  var realKey, newRealKey;
  var staticKey, isStatic;
  var value, newValue;
  for (var key in props) {
    realKey = key; // 会保留空格的
    staticKey = needParse ? parse.getStaticKey(realKey) : false; // 取静态key,不是返回false
    // console.log(staticKey);
    isStatic = staticKey !== false ? true : false;
    if (isStatic) {
      realKey = staticKey;
    }

    if (!realKey.trim()) {
      // 全空，不必理会
      break;
    }

    newRealKey = utils.vueCamelCase(realKey);
    if (excludeKeys.includes(newRealKey)) {
      // 存在不能包括的属性，不必理会
      break;
    }

    value = props[key];
    if (needParse) {
      if (!isStatic && parse.isEsOrFunc(props[key])) {
        // 不是静态且需要转化
        hasEsFunc = true;
        newValue = parse.newEsFuncion(value);
        newProps[newRealKey] = newValue;
        rawProps[newRealKey] = newValue;
      } else if (!isStatic || !utils.isFunc(value)) {
        // 不是静态或是（静态，其值不是函数），保持原样
        newProps[newRealKey] = value;
        rawProps[newRealKey] = value;
      } else {
        // 是静态属性、值是函数
        newProps[newRealKey] = value;
        rawProps[newRealKey] = value; // 保持前缀，因为解析需要用到；为什么要这样
        staticNames.push(newRealKey); // 记录下来
      }
    } else {
      // 无需要解析
      newProps[newRealKey] = value;
      rawProps[newRealKey] = value;
    }
  }

  if (hasEsFunc) {
    for (var tmpkey in newProps) {
      newProps[tmpkey] = null;
    }
  } else {
    rawProps = {};
  }

  rawProps = Object.keys(rawProps).length > 0 ? rawProps : false;
  return {
    new: newProps,
    raw: rawProps,
    staticNames: staticNames.length ? staticNames : false
  };
}

/**
 * 解析指令
 */
function parseDirectives(directives, needParse = true) {
  var newDirectives = [],
    rawDirectives = [];
  if (!utils.isArr(directives)) {
    directives = [directives];
  }

  var hasEsFunc = false;

  // 转化为数组了
  directives.forEach(directiveItem => {
    var directive;
    if (utils.isStr(directiveItem)) {
      directive = { name: directiveItem };
    } else if (!utils.isObj(directiveItem)) {
      // 不合法，去掉
      return false;
    } else {
      directive = directiveItem;
    }

    // 全部转成对象了
    var name, value, expression, arg, modifiers;
    name = directive.name;
    var prefix = "v-";
    if (utils.isStr(name)) {
      name = name.trim();
      if (name.indexOf(prefix) === 0) {
        name = name.substr(prefix.length);
      }
    } else {
      name = false;
    }

    // 指令名合法
    if (name) {
      expression = utils.isStr(directive.expression)
        ? directive.expression.trim()
        : undefined;
      expression = expression ? expression : undefined;

      arg = utils.isStr(directive.arg) ? directive.arg.trim() : undefined;
      arg = arg ? arg : undefined;

      modifiers = utils.isObj(directive.modifiers)
        ? utils.deepCopy(directive.modifiers)
        : {};

      if (needParse && parse.isEsOrFunc(directive.value)) {
        hasEsFunc = true;
        value = parse.newEsFuncion(directive.value);
      } else {
        value = utils.deepCopy(directive.value);
      }

      var rawDirective = {
        name: name,
        value: value,
        expression: expression,
        arg: arg,
        modifiers: modifiers
      };
      rawDirectives.push(rawDirective);
    }
  });

  if (hasEsFunc) {
    rawDirectives.forEach(rawDirective => {
      var newDirective = {};
      Object.assign(newDirective, rawDirective);
      newDirective.value = null;
      newDirectives.push(newDirective);
    });
  } else {
    newDirectives = rawDirectives;
    rawDirectives = false;
  }

  newDirectives = newDirectives.length > 0 ? newDirectives : false;
  return { new: newDirectives, raw: rawDirectives };
}

/**
 * 解析scopedSlots
 */
function parseScopedSlots(
  scopedSlots,
  hasTextSlot,
  myPathKey,
  needParse = true
) {
  var newScopedSlots = {};
  var newSlots;

  var hasRuntime = false;
  // 根据vue源代码, VNode是不会被劫持的
  if (utils.isVNode(scopedSlots)) {
    // 要先判断VNode，因为VNode也属于Object
    console.warn(
      "插槽暂不支持直接配置虚拟节点，虚拟节点必须用函数包含并返回。此配置将忽略！"
    );
  } else if (utils.isArr(scopedSlots)) {
    newSlots = checkSlotArr(scopedSlots, "scopedSlots", myPathKey);
    if (newSlots.length) {
      newScopedSlots.default = newSlots;
    }
  } else if (!utils.isObj(scopedSlots) && isSlotType(scopedSlots)) {
    newScopedSlots.default = scopedSlots;
    if (utils.isFunc(scopedSlots)) {
      hasRuntime = true;
    }
  } else if (utils.isObj(scopedSlots) && Object.keys(scopedSlots).length > 0) {
    for (var key in scopedSlots) {
      var value = scopedSlots[key];
      if (utils.isArr(value)) {
        newSlots = checkSlotArr(value, key, myPathKey);
        if (newSlots.length) {
          newScopedSlots[key] = newSlots;
        }
      } else if (isSlotType(value)) {
        if (utils.isObj(value)) {
          newScopedSlots[key] = parseComponent(
            value,
            myPathKey + " > scopedSlots > " + key,
            true,
            needParse
          );
        } else {
          newScopedSlots[key] = value;
        }

        if (utils.isFunc(value)) {
          hasRuntime = true;
        }
      } else {
        if (!(utils.isUndef(value) || utils.isNull(value))) {
          console.warn(
            "插槽（" +
              myPathKey +
              " > " +
              key +
              "）的值不合法，将忽略（值必须是虚拟节点、函数、数字、字符串、布尔型）"
          );
        }
      }
    }
  } else {
    if (!(utils.isUndef(scopedSlots) || utils.isNull(scopedSlots))) {
      console.warn(
        "插槽（" +
          myPathKey +
          " > " +
          key +
          "）的值不合法，将忽略（值必须是虚拟节点、函数、数字、字符串、布尔型）"
      );
    }
  }
  if (hasTextSlot && !newScopedSlots["default"]) {
    newScopedSlots["default"] = function() {
      // 后面会统一处理text值
      return [];
    };
  }
  return Object.keys(newScopedSlots).length > 0
    ? { scopedSlots: newScopedSlots, hasRuntime: hasRuntime }
    : undefined;
}

function checkSlotArr(slots, key, myPathKey) {
  var newSlots = [];
  slots.forEach(function(slot, index) {
    if (utils.isVNode()) {
      console.warn("插槽暂不支持直接配置，请用函数包含并返回。此配置将忽略。");
    } else if (utils.isFunc(slot)) {
      throw "插槽（" +
        myPathKey +
        " > " +
        key +
        "）的数组不能存在函数，但可以用函数返回数组";
    } else if (isSlotType(slot)) {
      if (utils.isObj(slot)) {
        // 是一个标准的配置型组件
        var newComponent = parseComponent(
          slot,
          myPathKey + " > scopedSlots > " + key,
          true
        );
        if (newComponent) {
          newSlots.push(newComponent);
        }
      } else {
        newSlots.push(slot);
      }
    } else {
      console.warn(
        "插槽（" +
          myPathKey +
          " > " +
          key +
          "）中的数组存在(第" +
          (index + 1) +
          "个)不合法的，将忽略（数组中的值必须是虚拟节点、数字、字符串、布尔型）"
      );
    }
  });
  return newSlots;
}

/**
 * 是否是scopedSlot支持的类型
 * @param {*} value
 */
function isSlotType(value) {
  var isValidName = false;
  if (utils.isObj(value)) {
    // 判断对象是否正常的组件配置
    var name = utils.isStr(value.name) ? value.name.trim() : value.name;
    if (name) {
      isValidName = true;
    } else {
      isValidName = false;
    }
  }
  return (
    isValidName ||
    utils.isFunc(value) ||
    utils.isStr(value) ||
    utils.isNum(value) ||
    utils.isBool(value) ||
    false
  );
}
