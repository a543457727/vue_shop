<template>
  <el-container>
    <el-header>
      <div>
        <img src="~assets/images/heima.png" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">logout</el-button>
    </el-header>
    <el-container>
      <el-aside :width="menuStatus === true?'64px':'200px'">
        <div class="toggle-button" @click="toggleMenus">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#323744"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          unique-opened
          :collapse="menuStatus"
          :collapse-transition="false"
          :default-active="activeUrl"
        >
          <el-submenu :index="'/'+item.path" v-for="item in leftMenus" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/'+res.path"
              v-for="res in item.children"
              :key="res.id"
              @click="saveMenuStatus('/'+res.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ res.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  async created() {
    this.getMenusList()
    this.activeUrl = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      leftMenus: [],
      iconObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      menuStatus: false,
      activeUrl: ''
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenusList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(this.meta.msg)
      this.leftMenus = res.data
      console.log(this.leftMenus)
    },
    toggleMenus() {
      this.menuStatus = !this.menuStatus
    },
    // 保存链接的激活状态
    saveMenuStatus (activeUrl) {
      window.sessionStorage.setItem('activePath', activeUrl)
      this.activeUrl = activeUrl
    }
  }
}
</script>

<style>
.el-header {
  background-color: #323744;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 20px;
}
.el-aside {
  background-color: #323744;
}
.el-container {
  height: 100%;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  letter-spacing: 0.2em;
  text-align: center;
  cursor: pointer;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header div span {
  margin-left: 15px;
}
.iconfont {
  margin-right: 10px;
}
.el-menu {
  border-right: none;
}
</style>
