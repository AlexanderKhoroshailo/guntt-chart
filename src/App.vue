<template>
  <div>
    <header>
      <div class="wrapper">
        <h1 class="t-center">Gantt chart</h1>
        <nav>
          <span class="f-18">Orders </span>
          <div class="d-flex f-between">
            <div class="d-flex">
              <a
                v-for="order in $options.orderButtons"
                :key="order.id"
                href="#"
                class="butt"
                :value="order.value"
                @click="($event) => setCurrentOrder($event)"
                >{{ order.title }}</a
              >
            </div>
            <div>
              <a href="#" class="butt f-end w-auto c-pointer" @click="toRemove">Remove chart</a>
            </div>
          </div>
        </nav>
      </div>
    </header>
    <router-view v-slot="{ Component }">
      <component
        v-if="currentOrder"
        :is="Component"
        :currentOrder="currentOrder"
        :removed="removed"
        @emitRemoved="emitRemoved"
      />
    </router-view>
  </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'

export default {
  name: 'App',

  data() {
    return {
      currentOrder: null,
      removed: false
    }
  },

  orderButtons: [
    { id: 1, title: '5', value: 5 },
    { id: 2, title: '500', value: 500 },
    { id: 3, title: '5000', value: 5000 },
    { id: 4, title: '10000', value: 10000 }
  ],

  methods: {
    setCurrentOrder(event) {
      this.currentOrder = event.target.__vnode.props.value
    },
    toRemove() {
      this.removed = true
    },
    emitRemoved() {
      this.removed = false
    }
  }
}
</script>
