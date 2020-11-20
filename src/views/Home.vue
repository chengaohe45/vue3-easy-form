<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <es-form :schema="schema" @submit="formSubmit"></es-form>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import test from "@/components/test.vue";
// import easyForm from "@/package/index.vue";
import utils from "@/package/libs/utils";
// import {
//   isProxy,
//   isReactive,
//   isReadonly,
//   isRef,
//   getCurrentInstance
// } from "vue";

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  data() {
    return {
      schema: {
        name: {
          label: "名称",
          component: {
            name: "div",
            text: "首页位置"
          }
        },
        name1: {
          label: "名称",
          component: {
            name: "input",
            value: "首页位置",
            actions: [{
              trigger: "input",
              handler: function() {
                console.log("update:modelValue");
              }
            }]
          }
        },
        name11: {
          label: "checkbox",
          component: {
            name: "input",
            props: {
              type: "checkbox"
            },
            value: true,
            actions: [{
              trigger: "input",
              handler: function() {
                console.log("update:modelValue");
              }
            }]
          }
        },
        name1dd1: {
          label: "radio",
          component: {
            name: "input",
            props: {
              type: "radio",
              value: false,
            },
            value: true,
            actions: [{
              trigger: "update:modelValue",
              handler: function() {
                console.log("update:modelValue");
              }
            }]
          }
        },
        name1dfdad1: {
          label: "textarea",
          component: {
            name: "textarea",
            props: {
              type: "radio",
              value: false,
            },
            value: "true",
            actions: [{
              trigger: "update:modelValue",
              handler: function() {
                console.log("update:modelValue");
              }
            }]
          }
        },
        name2: {
          label: "名称2",
          component: {
            name: "a-input",
            props: {
              placeholder: "Basic usage"
            },
            model: "value",
            actions: [{
              trigger: "update:value",
              handler: function() {
                console.log("123...");
              }
            }, {
              trigger: "change.native",
              handler: function() {
                console.log(1243);
              }
            }, "@enterSubmit", "change=@submit"] 
          },
          value: "首页位置"
        },
        name3: {
          label: "名称3",
          component: {
            name: test,
            ref: "test",
            props: {
              placeholder: "Basic usage"
            },
            scopedSlots: {
              default: function() {
                // console.log("data:", data);
                return "div";
              },
              test: () => <span>234</span>
            },
            text: 0,
            model: "value"
          },

          value: "首页位置"
        }
      }
    };
  },
  directives: {
    focus: {
      // 指令的定义
      mounted(el) {
        console.log("focus...");
        el.focus && el.focus();
      }
    }
  },
  created() {
    console.log(
      "created: ",
      this,
      utils.isObj(this.$data),
      utils.isObj(this.$props),
      utils.isObj(this.$refs),
      utils.isObj(this.$attrs)
    );
    console.log("created: ", this.$data, this.$props, this.$refs, this.$attrs);
    console.log("created: ", utils.isVue(this));
  },
  mounted() {
    const handler = {
      get: function(obj, prop) {
        return prop in obj ? obj[prop] : 37;
      }
    };

    const p = new Proxy({}, handler);
    p.a = 1;
    p.b = undefined;
    // var vm = this;
    // console.log("this and p", p, this, this.$refs.test);
    // console.log("isProxy(p)", isProxy(vm.$data), vm.$data);
    // console.log("getCurrentInstance(p)", getCurrentInstance().constructor);
    // console.log("isRef(this)", isRef(this));
    // console.log("isReactive(this)", isReactive(this));
    // console.log("isReadonly(this)", isReadonly(this));
    window.p = p;
    window.hh = this;
  },
  methods: {
    formSubmit() {
      console.log(arguments)
    }
  }
};
</script>
