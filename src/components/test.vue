<template>
  <div class="hello">
    <!-- <input v-model="testValue" @change="changeHandler"/> -->
    <a-input v-model:value="testValue" placeholder="Basic usage" />
    <slot :text="testValue">default</slot>
    <slot name="test">test</slot>
    <div>{{ readersNumber }} {{ readersNumber2 }} {{ book.title }}</div>
    <div>{{ tt }}</div>
  </div>
</template>

<script>
import {ref, reactive, watchEffect} from 'vue'
export default {
  name: "HelloWorld",
  data: function() {
    return {
      testValue: "test"
    };
  },
  emits: {
    // 没有验证
    click: null,

    // 验证submit 事件
    change: ({ value }) => {
      if (typeof value === "string") {
        return true;
      } else {
        // console.warn('Invalid submit event payload!')
        return false;
      }
    }
  },
  setup() {
      const readersNumber = ref(0)
      const readersNumber2 = ref(0)
      const book = reactive({ title: 'Vue 3 Guide' })
      let tt = 8

      watchEffect(() => console.log(+new Date(), readersNumber.value))
        // -> logs 0

        // setInterval(() => {
        //   readersNumber.value++
        //   // -> logs 1
        // }, 1000)

      // expose to template
      return {
        readersNumber,
        readersNumber2,
        book,
        tt
      }
    },
  methods: {
    changeHandler() {
      console.log(arguments);
      // this.$emit("change", this.testValue)
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
