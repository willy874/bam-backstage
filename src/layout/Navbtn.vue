<template>
  <div @click="clickBtn" class="navbtn" :class="[template, { active: global[stateName] }]">
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
    template: {
      type: String,
      default: 'default',
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
  cursor: pointer;
  &.default {
    width: 25px;
    height: 20px;
    .navbtn__line {
      position: absolute;
      right: 0;
      left: 0;
      background-color: currentColor;
    }
    .top-line {
      top: 0;
      height: 4px;
      transition: transform 300ms ease;
      transform-origin: left top;
    }
    .bottom-line {
      bottom: 0;
      height: 4px;
      transition: transform 300ms ease;
      transform-origin: left bottom;
    }
    .center-line {
      top: 50%;
      right: 0;
      left: 0;
      height: 4px;
      transition: opacity 300ms linear;
      transform: translateY(-50%);
    }
    &.active {
      .top-line {
        transform: rotate(45deg);
      }
      .bottom-line {
        transform: rotate(-45deg);
      }
      .center-line {
        opacity: 0;
      }
    }
  }
  &.rotate {
    width: 24px;
    height: 24px;
    .navbtn__line {
      position: absolute;
      right: 0;
      left: 0;
      background-color: currentColor;
    }
    .top-line {
      top: 8px;
      left: 7px;
      width: 10px;
      height: 2px;
      border-radius: 4px;
      transition: transform 300ms ease;
      transform: rotate(45deg);
      transform-origin: center top;
    }
    .bottom-line {
      bottom: 8px;
      left: 7px;
      width: 10px;
      height: 2px;
      border-radius: 4px;
      transition: transform 300ms ease;
      transform: rotate(-45deg);
      transform-origin: center bottom;
    }
    .center-line {
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: transparent;
      border: 3px solid currentColor;
      border-radius: 50%;
    }
    &.active {
      .top-line {
        transform: rotate(-45deg);
      }
      .bottom-line {
        transform: rotate(45deg);
      }
    }
  }
}
</style>
