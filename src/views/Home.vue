<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <!-- <component
      :is="'HelloWorld'"
      msg="Welcome to Your Vue.js App"
      @add-item="addItem"
    /> -->
    <es-form ref="form" :schema="schema"></es-form>
    <div style="overflow: hidden;">
      <g-select
        v-model="selectValue"
        :options="options"
        multiple
        clearable
        placeholder="请选择活动区域"
        @change="selectChangeHandler"
      ></g-select>

      <el-select
        v-model="selectValue2"
        class="a12345"
        multiple
        clearable
        placeholder="请选择活动区域"
      >
        <el-option
          v-for="item in options2"
          :key="item.id"
          :label="item.text"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-color-picker v-model="color1" show-alpha></el-color-picker>
      <el-date-picker
        class="a12345"
        style="width: 300px;"
        v-model="dateValue"
        type="year"
        placeholder="选择日期"
      >
      </el-date-picker>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
// import test from "@/components/test.vue";
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
    // HelloWorld
  },
  data() {
    return {
      dateValue: "2000",
      selectValue: [2],
      color1: "#409EFF",

      options: [
        { text: "区域1", id: 1 },
        { text: "区域2", id: 2 }
      ],

      selectValue2: [3],
      options2: [
        { text: "区域3", id: 3 },
        { text: "区域4", id: 4 }
      ],
      schema: {
        regions: {
          value: [2],
          label: "活动区域",
          component: {
            name: "g-select",
            props: {
              placeholder: "请选择活动区域",
              clearable: true,
              multiple: true,
              options: [
                { text: "区域1", id: 1 },
                { text: "区域2", id: 2 }
              ]
            },
            actions: {
              trigger: "change",
              handler: function() {
                console.log("Select $listener");
              }
            }
          },
          rules: {
            required: true,
            emptyMsg: "请选择"
          }
        },
        // test: {
        //   label: "your test",
        //   component: {
        //     name: "a-input",
        //     ref: "test",
        //     props: {
        //       placeholder: "Basic usage"
        //     },
        //     text: "1"
        //   },
        //   rules: {
        //     required: true,
        //     class: {
        //       a: true,
        //       b1: false
        //     },
        //     checks: {
        //       trigger: "true",
        //       handler: function() {
        //         return "errofr";
        //       }
        //     }
        //   },
        //   array: {
        //     value: ["123"],
        //     hasSort: true,
        //     hasCopy: true,
        //     rules: {
        //       required: true,
        //       checks: {
        //         trigger: ["input1"],
        //         handler: function() {
        //           return "erro22222fr";
        //         }
        //       }
        //     }
        //   },

        //   value: "首页位置"
        // },

        // test2: {
        //   // hidden: true,
        //   array: {
        //     value: [{ test21: "21", test22: "22" }],
        //     hasSort: true,
        //     hasCopy: true,
        //     rules: {
        //       required: true,
        //       checks: {
        //         trigger: ["input1"],
        //         handler: function() {
        //           return "erro22222fr";
        //         }
        //       }
        //     }
        //   },

        //   properties: {
        //     test21: {
        //       label: "test21",
        //       component: {
        //         name: "a-input",
        //         ref: "test21",
        //         props: {
        //           placeholder: "Basic usage"
        //         },
        //         text: "1"
        //       },
        //       rules: {
        //         required: true,
        //         class: {
        //           a: true,
        //           b1: false
        //         },
        //         checks: {
        //           trigger: "true",
        //           handler: function() {
        //             return "errofr";
        //           }
        //         }
        //       },

        //       col: 12,

        //       value: "首页位置"
        //     },

        //     test22: {
        //       hidden: "es: $index%2 ? true : false",
        //       label: "test22",
        //       component: {
        //         ref: "test",
        //         name: "a-input",
        //         props: {
        //           placeholder: "Basic usage"
        //         },
        //         text: "1"
        //       },

        //       col: 12,

        //       value: "首页位置"
        //     },

        //     test3: {
        //       // hidden: true,
        //       array: {
        //         value: [{ test21: "21", test22: "22" }],
        //         hasSort: true,
        //         hasCopy: true,
        //         rules: {
        //           required: true,
        //           checks: {
        //             trigger: ["input1"],
        //             handler: function() {
        //               return "erro22222fr";
        //             }
        //           }
        //         }
        //       },

        //       properties: {
        //         test31: {
        //           label: "test31",
        //           component: {
        //             name: "a-input",
        //             ref: "test31",
        //             props: {
        //               placeholder: "Basic usage"
        //             },
        //             text: "1"
        //           },
        //           rules: {
        //             required: true,
        //             class: {
        //               a: true,
        //               b1: false
        //             },
        //             checks: {
        //               trigger: "true",
        //               handler: function() {
        //                 return "errofr";
        //               }
        //             }
        //           },

        //           col: 12,

        //           value: "首页位置"
        //         },

        //         test32: {
        //           hidden: "es: $index%2 || $root.checkbox ? true : false",
        //           label: "test32",
        //           component: {
        //             ref: "test",
        //             name: "a-input",
        //             props: {
        //               placeholder: "Basic usage"
        //             },
        //             text: "1"
        //           },

        //           col: 12,

        //           value: "首页位置"
        //         }
        //       }
        //     }
        //   }
        // },

        name: {
          hidden: "es: !!$root.checkbox",
          label: "div",
          component: {
            name: "input",
            // ref: "name",
            props: {
              value: "344"
            },
            value: "??????",
            text: "首页位置"
          }
        },
        // input: {
        //   label: "input",
        //   component: {
        //     name: "input",
        //     value: "首页位置",
        //     actions: [
        //       {
        //         trigger: "input",
        //         handler: function() {
        //           console.log("update:modelValue");
        //         }
        //       }
        //     ]
        //   }
        // },
        checkbox: {
          label: "checkbox",
          component: {
            name: "input",
            props: {
              type: "checkbox"
            },
            value: true
            // actions: [
            //   {
            //     trigger: "input",
            //     handler: function() {
            //       console.log("update:modelValue");
            //     }
            //   }
            // ]
          }
        },
        radio: {
          // hidden: "es: !!$root.checkbox",
          label: "radio",
          component: {
            name: "input",
            props: {
              type: "radio",
              value: false
            },
            value: false,
            actions: [
              {
                trigger: "update:modelValue",
                handler: function() {
                  console.log("update:modelValue");
                }
              }
            ]
          }
        }
        // textarea: {
        //   label: "textarea",
        //   component: {
        //     name: "textarea",
        //     props: {
        //       // type: "radio",
        //       // value: false
        //     },
        //     value: "true",
        //     actions: [
        //       {
        //         trigger: "input",
        //         handler: function() {
        //           console.log("update:modelValue");
        //         }
        //       }
        //     ]
        //   }
        // },
        // "a-input": {
        //   label: "a-input",
        //   component: {
        //     name: "a-input",
        //     props: {
        //       placeholder: "Basic usage"
        //     },
        //     model: "value",
        //     actions: [
        //       {
        //         trigger: "update:value",
        //         handler: function() {
        //           console.log("123...");
        //         }
        //       },
        //       {
        //         trigger: "change.native",
        //         handler: function() {
        //           console.log(1243);
        //         }
        //       },
        //       // "@enterSubmit",
        //       // "change=@submit"
        //     ]
        //   },
        //   rules: {
        //     required: true,
        //     checks: 222
        //   },
        //   value: "首页位置"
        // }
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
      console.log("formSubmit:", arguments);
    },
    formChange() {
      console.log("formChange:", arguments);
    },
    addItem() {
      // console.log("value:", value, arguments);
      // this.$emit("add-item", 123);
      console.log(this.$refs.form.getRef("test", true, 0));
    },
    selectChangeHandler() {
      console.log("g-select:", this.selectValue);
    }
  }
};
</script>
