<template>
  <div class="login-container">
    <div class="login">
      <h3 class="form-title">{{ isLoginMode ? "登录" : "注册" }}</h3>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        class="form"
        label-width="80px"
        v-loading="loading"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item
          v-if="!isLoginMode"
          label="确认密码"
          prop="confirmPassword"
        >
          <el-input type="password" v-model="form.confirmPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">
            {{ isLoginMode ? "登录" : "注册" }}
          </el-button>
          <el-button
            type="text"
            @click="toggleLoginMode"
            :loading="loading"
            v-if="!loading"
          >
            {{ isLoginMode ? "去注册" : "去登录" }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      isLoginMode: true,
      loading: false,
      form: {
        username: "",
        password: "",
        confirmPassword: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
        confirmPassword: [
          {
            required: true,
            message: "请再次输入密码",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              if (value !== this.form.password) {
                callback(new Error("两次输入的密码不一致"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    ...mapActions(["setToken"]),
    async setToken(token) {
      await this.$store.commit("setToken", token);
    },
    async login({ username, password }) {
      this.loading = true;
      try {
        const response = await axios.post("http://localhost:8080/api/login", {
          username,
          password,
        });
        const { success, token } = response.data;
        if (success === true) {
          localStorage.setItem("token", token);
          await this.setToken(token);
          this.$router.push("/home");
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        this.$message.error("登录失败");
      } finally {
        this.loading = false;
      }
    },
    async register({ username, password, confirmPassword }) {
      this.loading = true;
      try {
        const response = await axios.post(
          "http://localhost:8080/api/register",
          {
            username,
            password,
            confirmPassword,
          }
        );
        const { success, token } = response.data;
        if (success === true) {
          localStorage.setItem("token", token);
          await this.setToken(token);
          this.$router.push("/login");
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        this.$message.error("注册失败");
      } finally {
        this.loading = false;
      }
    },
    async handleSubmit() {
      const isValid = await this.$refs.form.validate();
      if (isValid) {
        if (this.isLoginMode) {
          console.log(this.$store);
          await this.login(this.form);
        } else {
          await this.register(this.form);
        }
      }
    },
    toggleLoginMode() {
      this.isLoginMode = !this.isLoginMode;
    },
  },
};
</script>
  
  <style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f5f5f5;
  padding: 30px;
  box-sizing: border-box;
}

.login {
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 360px;
}

.form {
  margin-top: 20px;
}

.form-title {
  text-align: center;
  margin-bottom: 20px;
}
</style>