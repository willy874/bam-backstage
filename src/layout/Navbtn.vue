<template>
  <div @click="clickBtn" class="navbtn" :class="{ active: global[stateName] }">
    <div class="navbtn__line top-line"></div>
    <div class="navbtn__line center-line"></div>
    <div class="navbtn__line bottom-line"></div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Navbtn',
  props: {
    stateName: {
      type: String,
    },
    commit: {
      type: String,
    },
    action: {
      type: String,
    },
  },
  setup(props) {
    const store = useStore()
    return {
      global: ref(store.state.global),
      clickBtn: () => {
        store.commit(props.commit, !store.state.global[props.stateName])
      },
    }
  },
}
</script>
<style lang="scss" scoped>
.navbtn {
  position: relative;
  width: 25px;
  height: 20px;
  cursor: pointer;
  .navbtn__line {
    position: absolute;
    right: 0;
    left: 0;
    background-color: currentColor;
  }
  .top-line {
    top: 0;
    height: 16%;
    transition: height 300ms ease;
  }
  .bottom-line {
    bottom: 0;
    height: 18%;
    transition: height 300ms ease;
  }
  .center-line {
    top: 0;
    bottom: 0;
    clip-path: polygon(50% 50%, 0 50%, 0 42%, 50% 42%, 100% 42%, 100% 50%, 50% 50%, 100% 50%, 100% 58%, 50% 58%, 0 58%, 0 50%);
    transition: clip-path 300ms linear;
    will-change: clip-path;
  }
  &.active {
    .center-line {
      clip-path: polygon(40% 50%, 10% 10%, 20% 0%, 50% 40%, 80% 0%, 90% 10%, 60% 50%, 90% 90%, 80% 100%, 50% 60%, 20% 100%, 10% 90%);
    }
    .top-line,
    .bottom-line {
      height: 0;
    }
  }
}
</style>
