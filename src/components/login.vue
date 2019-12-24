<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login_avatar">
        <img src="~assets/images/logo.png" alt />
      </div>

      <el-form label-width="0px" class="login_form" :model="form" :rules="rules" ref="LoginForm">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="6" :offset="6">
              <el-button type="primary" @click="login">登录</el-button>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-button>注册</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: 'admin',
        userpass: '123456'
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.LoginForm.validate(async res => {
        if (!res) return false
        const { data: infoList } = await this.$http.post('login', this.form)
        console.log(infoList)
        if (infoList.meta.status !== 200) return this.$message.error(infoList.meta.msg)
        this.$message.success('登录成功')
        console.log(infoList)
        window.sessionStorage.setItem('token', infoList.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style>
.login_container {
  background-color: #2b2b2b;
  height: 100%;
}
.login_box {
  background-color: ghostwhite;
  width: 450px;
  height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 3px;
}
.login_avatar {
  height: 130px;
  width: 130px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 1px solid #eeeeee;
  background-color: #ffffff;
  padding: 6px;
  box-shadow: 0 0 5px #ddd;
}
.login_avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid #eeeeee;
}
.login_form {
  width: 100%;
  padding: 0 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -35%);
  box-sizing: border-box;
}
</style>
