<template>
  <el-menu
    :default-active="$route.path"
    :router="true"
    class="nav-box"
    background-color="#324157"
    text-color="#fff"
    active-text-color="#409eff"
    :unique-opened="true"
  >
    <template v-for="(item, index) in navList" :key="index">
      <el-submenu v-if="!item.link" :index="index + ''">
        <template v-slot:title>
          <i :class="item.icon"></i>
          <span>{{ item.name }}</span>
        </template>
        <el-menu-item
          v-for="(subItem, subIndex) in item.children"
          :index="subItem.link || index + '-' + subIndex"
          :key="subIndex"
          :route="{ path: subItem.link || '' }"
        >
          <i :class="subItem.icon"></i>
          <template v-slot:title>
            <span>{{ subItem.name }}</span>
          </template>
        </el-menu-item>
      </el-submenu>

      <el-menu-item
        v-else
        :index="item.link || index + ''"
        :route="{ path: item.link || '' }"
      >
        <i :class="item.icon"></i>
        <template v-slot:title>
          <span>{{ item.name }}</span>
        </template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
/* 设置注意：当:router="true"时，点击切换页面，会先判断:route="{path: subItem.link || ''}"有没有值，再判断它的:index */

// import utils from "@/libs/utils";

import navRoute from "@/router/nav-route";

export default {
  props: {},

  data: function() {
    return {
      // defaultActive: "/", // defaultActive不能二次变化，变化程序有问题（跟vue2不同，vue2不会报错）
      navList: navRoute.getNav()
    };
  },

  computed: {},

  created() {
    // console.log(this.$route, this.$router);  // 无论url怎么，初始化时都是$route.path='/',这个跟vue2不同
    // // this.navList = navRoute.getNav();
    // var hash = location.hash + "";
    // var path = hash.substr(1);
    // if (path) {
    //   var querychar = "?";
    //   var queryPosition = path.indexOf(querychar);
    //   if (queryPosition >= 0) {
    //     path = path.substr(0, queryPosition);
    //   }
    //   this.defaultActive = path;
    // }
    // console.log(this.$route.path);
  },

  mounted() {
    // console.log(2, this.$route, this.$router);
  },

  unmounted() {},

  methods: {},

  watch: {
    // $route: function() {
    //   // setTimeout(() => {
    //   //   console.log("this.$route", this.$route, this.$router);
    //   //   this.defaultActive = this.$route.path;
    //   // }, 2000)
    // }
  }
};
</script>

<style lang="scss">
.nav-box {
  border-right: 0 !important;
  padding-bottom: 10px;

  .el-submenu.is-active {
    .el-submenu__title {
      color: rgb(64, 158, 255) !important;
    }

    .el-icon-menu {
      color: rgb(64, 158, 255);
    }
  }
}

/*.fullHeight {
        height: 100%;
    }*/
</style>
