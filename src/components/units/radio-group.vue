<template>
  <el-radio-group v-bind="$attrs" v-model="comVal" @change="change">
    <el-radio v-for="item in options" :key="item.id" :label="item.id"
      >{{ item.text }}
    </el-radio>
  </el-radio-group>
</template>

<style lang="scss"></style>

<script>
export default {
  inheritAttrs: false,
  props: {
    options: {
      type: Array,
      required: false,
      default: () => {
        return [];
      }
    },

    modelValue: {
      // type: Array,
      // required: false,
      // default: () => {
      //   return [];
      // }
    }
  },

  data() {
    return {
      comVal: null
    };
  },

  components: {},

  created() {
    this.$data.comVal = this.modelValue;
  },

  methods: {
    change() {
      if (this.$data.comVal != this.modelValue) {
        this.$emit("update:modelValue", this.$data.comVal);
      }
    }
  },

  watch: {
    modelValue: {
      handler(newVal) {
        if (this.$data.comVal != newVal) {
          this.$data.comVal = newVal;
        }
      },
      deep: false
    }
  }
};
</script>
