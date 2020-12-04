<template>
  <el-checkbox-group v-bind="$attrs" v-model="comVal" @change="change">
    <el-checkbox v-for="item in options" :label="item.id" :key="item.id"
      >{{ item.text }}
    </el-checkbox>
  </el-checkbox-group>
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
      type: Array,
      required: false,
      default: () => {
        return [];
      }
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
