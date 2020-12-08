<template>
  <el-select v-bind="$attrs" v-model="comVal">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.text"
      :value="item.id"
    >
    </el-option>
  </el-select>
</template>

<style lang="scss"></style>

<script>
import utils from "@/libs/utils";
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

    modelValue: {}
  },

  data() {
    return {
      comVal: null
    };
  },

  components: {},

  created() {
    this.$data.comVal = utils.deepCopy(this.modelValue);
  },

  methods: {
    change() {
      // if (this.$data.comVal != this.modelValue) {
      //   this.$emit("update:modelValue", this.$data.comVal);
      // }
    }
  },

  watch: {
    modelValue: {
      handler() {
        // console.log(utils.deepCopy(this.modelValue));
        if (JSON.stringify(this.$data.comVal) != JSON.stringify(this.modelValue)) {
          this.$data.comVal = utils.deepCopy(this.modelValue);
        }
      },
      deep: false
    }
  }
};
</script>
