<template>
  <div class="dynamic-tags">
    <el-tag
      :key="tag + '-' + index"
      v-for="(tag, index) in comVal"
      :closable="!disabled"
      :disable-transitions="true"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    >
    </el-input>
    <el-button
      v-else-if="!inputVisible && !disabled"
      class="button-new-tag"
      size="small"
      @click="showInput"
      >{{ addText }}</el-button
    >
  </div>
</template>

<script>
import utils from "@/libs/utils";
/**
 * 可通过this.$emit('notify-submit')通知提交数据事件
 */
export default {
  /* ====================== 生命周期 ====================== */

  created() {
    // console.log("tags组件生成了...");
    this.comVal = utils.deepCopy(this.modelValue);
  },

  /* ====================== 数据绑定 ====================== */

  data() {
    return {
      inputVisible: false,
      inputValue: "",
      comVal: []
    };
  },

  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },

    modelValue: {
      type: Array,
      required: false,
      default: () => {
        return [];
      }
    },

    addText: {
      type: String,
      required: false,
      default: "+ 添加"
    }
  },

  watch: {
    modelValue(newVal) {
      if (JSON.stringify(this.comVal) !== JSON.stringify(newVal)) {
        this.comVal = utils.deepCopy(this.modelValue);
      }
    }
  },

  /* ====================== 事件处理 ====================== */

  methods: {
    handleClose(tag) {
      this.comVal.splice(this.comVal.indexOf(tag), 1);
      this.$emit("close", tag);
      this.$emit("update:modelValue", this.comVal);
      this.$emit("change", this.comVal);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      inputValue = inputValue.replace(/^(\s|\n|\t)+|(\s|\n|\t)+$/g, "");
      if (inputValue) {
        if (!this.comVal.includes(inputValue)) {
          this.comVal.push(inputValue);
          this.$emit("update:modelValue", this.comVal);
          this.$emit("change", this.comVal);
        } else {
          this.$message({
            message: '"' + inputValue + '" 已存在',
            type: "warning"
          });
        }
      }
      this.inputVisible = false;
      this.inputValue = "";
    }
  }
};
</script>

<style lang="scss">
$marginTop: 3px;
.dynamic-tags {
  .el-tag {
    margin-top: $marginTop;
    margin-bottom: $marginTop;
    margin-right: 10px;
  }

  .button-new-tag {
    margin-top: $marginTop;
    margin-bottom: $marginTop;
    margin-right: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    margin-top: $marginTop;
    margin-bottom: $marginTop;
    width: 90px;
    margin-right: 10px;
    vertical-align: bottom;
  }
}
</style>
