<template>
  <section class="subscription">
    <transition mode="out-in">
      <div v-if="state === 1" class="confirm" key="confirm">
        <h2 class="text-center">Thank you!</h2>      
        <p class="text-center">Please check your inbox and <strong>click the confirmation link,</strong></p>
      </div>

      <div v-if="state === 2" class="confirm" key="error">
        <h2 class="text-center">Ooops!</h2>
        <p class="text-center">Something went wrong. Try again later.</p>
        <p><a @click="state = 0"> &larr; Go back</a></p>
      </div>
      
      <div v-if="state === 0" key="form">
        <h2 class="text-center">Sign up for updates</h2>
        <form  @submit.prevent="submit" novalidate>
          <div class="field-group">
            <input 
              v-model="data.email" 
              v-validate="'required|email'" 
              :class="{'input': true, 'is-invalid-input': errors.has('email') }"
              name="email" 
              autocomplete="email"
              placeholder="Your email"
              data-vv-as="E-mail"
              type="text" />
      
            <button class="button" type="submit">Subscribe</button>
          </div>
          <span class="alert" v-show="errors.has('email')">{{ errors.first('email') }}</span>
          <div class="agreements">
            <div class="checkbox">
              <input 
                v-model="privacy" 
                v-validate="'required'" 
                id="privacy" 
                name="privacy" 
                type="checkbox" />
              <label for="privacy">
               I give my consent to receive 0xcert Newsletter.
              </label>
            </div>
            <span class="alert" v-show="errors.has('privacy')">You have to accept our Privacy Policy</span>
          </div>
        </form>
      </div>
    </transition>

  </section>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VeeValidate from 'vee-validate';
 
Vue.use(VeeValidate);
Vue.use(VueAxios, axios)

export default {
  data () {
    return {
      privacy: false,
      state: 0,
      data: {
        email: '',
        templateId: 'f579c417-2f6c-48be-ab9d-ca0937dc56bb',
        segment: '0xcert-docs-newsletter',
        listId: '3983919'
      }
    }
  },

  methods: {
    submit: async function () {
      try {
        if (await this.$validator.validate()) {
          await this.axios.post('https://api.0xcert.org/newsletters/request', this.data)
          this.state = 1
        }
      } catch (err) {
        console.log('Error:' + err)
        this.state = 2
      }
    }
  } 
}
</script>

<style lang="scss">
.subscription {
  padding: 2rem;
  background: #f5f7f9;
  color: #2c3e50;

  label {
    color: inherit;
  }

  h2 {
    margin-bottom: 10px !important;
  }

  .alert {
    display: block;
    margin: 10px 0;
    font-size: 12px;
    color: #d3304b;
  }

  form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .field-group {
    display: flex;
    flex-wrap: wrap;
    
    input {
      width: 250px;
      flex-grow: 1;
      background: #fff;
      margin: 0;
      padding: 0 10px;
      border-radius: 5px;
      border: 1px solid #dfe2e5;
      font-size: 14px;

      &:focus {
        outline: none;
      }
    }

    .button {
      flex-shrink: 1;
      justify-content: center;
      margin-top: 0;
      margin-left: -4px;
      margin-bottom: 0;
      box-shadow: none;
      z-index: 2;
      position: relative;
      font-size: 16px;
      border-color: transparent;
      cursor: pointer;

      &:hover {
        transform: none;
      }
    }

    .help {
      padding-top: 8px;
      color: #fff;
      font-size: 0.9rem;
    }
  }

  .agreements {
    font-size: 15px;
    margin-top: 1rem;

    a {
      text-decoration: underline;
      color: inherit;
    }
  }
}
</style>
