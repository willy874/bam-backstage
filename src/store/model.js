export default {
  state: {},
  mutations: {
    clearImageAssetsSelected(state) {
      if (state.ImageAssets) {
        state.ImageAssets.data.forEach(model => {
          model.selected = false
        })
      }
    },
  },
  actions: {},
}