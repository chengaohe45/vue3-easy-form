export default {
  data() {
    return {};
  },

  props: {
    canDelete: {
      type: Boolean,
      required: false,
      default: true
    },
    hasSort: {
      type: Boolean,
      required: false,
      default: false
    },
    isFirst: {
      type: Boolean,
      required: false,
      default: false
    },
    isLast: {
      type: Boolean,
      required: false,
      default: false
    },
    fixed: {
      // 固定行（前几）
      type: Number,
      required: false,
      default: 0
    }
  },

  methods: {
    upItem() {
      if (!this.isFirst) {
        this.$emit("up-item", this.index);
      }
    },

    downItem() {
      if (!this.isLast) {
        this.$emit("down-item", this.index);
      }
    }
  }
};
