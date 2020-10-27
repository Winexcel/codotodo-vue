<template>
  <form @submit.prevent="submitForm">
    <q-banner class="reg-banner q-pa-sm bg-grey-3">
      <q-icon
        size="35px"
        name="account_circle"
        color="primary"
        class="q-mr-xs"
      />
      {{ tab === 'login' ? 'Login' : 'Register' }} to access your todos anywhere!
    </q-banner>
    <div class="row q-mb-md">
      <q-input
        outlined
        v-model="formData.email"
        label="Email"
        stack-label
        class="col"
        :rules="[val => isValidEmail(val) || 'Enter a valid email']"
        lazy-rules
        ref="email"
      />
    </div>

    <div class="row q-mb-md">
      <q-input
        outlined
        v-model="formData.password"
        label="Password"
        stack-label
        type="password"
        class="col"
        :rules="[ val => val.length >= 6 || 'Please use minimum 6 characters']"
        lazy-rules
        ref="password"
      />
    </div>

    <div class="row">
      <q-space/>
      <q-btn
        color="primary"
        :label="tab"
        type="submit"/>
    </div>


  </form>
</template>

<script>
  import {mapActions} from 'vuex';

  export default {
    name: 'loginRegister',
    props: ['tab'],
    data() {
      return {
        formData: {
          email: '',
          password: '',
        }
      }
    },
    methods: {
      ...mapActions('auth', ['registerUser', 'loginUser']),
      isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      },
      submitForm() {
        this.$refs.email.validate();
        this.$refs.password.validate();

        if (!this.$refs.email.hasError && !this.$refs.password.hasError) {
          if(this.tab === 'login') {
            this.loginUser(this.formData);
          } else {
            this.registerUser(this.formData);
          }
        }
      }
    }
  }
</script>

<style
  lang="scss"
  scoped>
  .reg {
    &-banner {
      position: static;
      margin: -16px;
      margin-bottom: 16px;
      text-align: center;
    }
  }
</style>
