<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <input
      v-model="testValue"
      @change="changeHandler"
      @update:modelValue="blurHandler"
    />
    <test @add-item="addItem" v-model="testValue"></test>
    <div>
      For a guide and recipes on how to configure / customize this project,<br />
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener"
        >vue-cli documentation</a
      >.
      <a-input
        v-model:value="testValue"
        placeholder="Basic usage"
        @change="changeHandler"
        @blur="blurHandler"
      />
      <!-- <a-button @click="cancel">Default1</a-button> -->
      <a-button @click="storageHandler('set')">markRaw set</a-button>
      <a-button @click="storageHandler('get')">markRaw get</a-button>
      <a-button @click="storageHandler('remove')">markRaw remove</a-button>
      <div>{{ shallowStr }}</div>
      <div>{{ shallow.name }}</div>
      <div>{{ mark.name }}</div>
      <!-- <a-input
        v-model:value="testValue"
        placeholder="Basic usage"
        @change="changeHandler"
        @blur="blurHandler"
      />
      <a-input-number
        id="inputNumber"
        v-model:value="numValue"
        :min="1"
        :max="10"
        @change="changeHandler"
        @blur="blurHandler"
      /> -->
    </div>
    <!-- <h3>Installed CLI Plugins</h3> -->
    <!-- <ul>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel"
          target="_blank"
          rel="noopener"
          >babel</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-router"
          target="_blank"
          rel="noopener"
          >router</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-vuex"
          target="_blank"
          rel="noopener"
          >vuex</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint"
          target="_blank"
          rel="noopener"
          >eslint</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-unit-mocha"
          target="_blank"
          rel="noopener"
          >unit-mocha</a
        >
      </li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li>
        <a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a>
      </li>
      <li>
        <a href="https://forum.vuejs.org" target="_blank" rel="noopener"
          >Forum</a
        >
      </li>
      <li>
        <a href="https://chat.vuejs.org" target="_blank" rel="noopener"
          >Community Chat</a
        >
      </li>
      <li>
        <a href="https://twitter.com/vuejs" target="_blank" rel="noopener"
          >Twitter</a
        >
      </li>
      <li>
        <a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a>
      </li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li>
        <a href="https://router.vuejs.org" target="_blank" rel="noopener"
          >vue-router</a
        >
      </li>
      <li>
        <a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-devtools#vue-devtools"
          target="_blank"
          rel="noopener"
          >vue-devtools</a
        >
      </li>
      <li>
        <a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener"
          >vue-loader</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
          rel="noopener"
          >awesome-vue</a
        >
      </li>
    </ul> -->
  </div>
</template>

<script>
import test from "./test.vue";
// import { addResize, removeResize } from "../base/libs/resize.js";
// import { getStorage, removeStorage, setStorage } from "../base/libs/storage.js";
import { shallowRef, markRaw } from "vue";
export default {
  name: "HelloWorld",
  components: {
    test
  },
  props: {
    msg: String
  },
  data: function() {
    return {
      testValue: "666",
      numValue: 5,
      listenerId: 0,
      shallowStr: 666,
      shallow: { name: 1 },
      mark: { name: 2 }
    };
  },
  created() {
    this.shallow = shallowRef({ name: "shallow" });
    this.mark = markRaw({ name: "mark" });
    this.shallowStr = shallowRef(9888);
  },
  methods: {
    cancel() {
      // removeResize(this.$data.listenerId2);
      // removeResize(this.changeHandler);
    },
    changeHandler() {
      console.log("changeHandler:", this);
    },

    blurHandler() {
      console.log("blurHandler:", arguments);
    },

    storageHandler(type) {
      // var testKey = "testKey";
      if (type == "set") {
        // this.shallowStr = "set shallowStr";
        this.shallow.name = "set shallow";
        this.mark.name = "set mark";
      } else if (type == "get") {
        this.shallowStr = "get shallowStr";
        this.shallow = { name: "get shallow2" };
        this.mark = markRaw({ name: "get mark" });
      } else {
        // removeStorage(testKey);
        console.log(this.shallow);
        console.log(this.mark);
      }
    },

    addItem(value) {
      this.$emit("add-item", value);
    }
  },
  beforeUnmount() {
    // removeResize(this.$data.listenerId);
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
