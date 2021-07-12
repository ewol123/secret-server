import { boot } from "quasar/wrappers";

export default boot(({ app }) => {
  app.directive("hover-shadow", {
    beforeMount(el, binding, vnode) {
      el.style.transition = "0.2s";

      function mouseover() {
        el.classList.add("shadow-24");
      }

      function mouseout() {
        el.classList.remove("shadow-24");
      }

      el.addEventListener("mouseover", mouseover, false);
      el.addEventListener("mouseout", mouseout, false);
    },
  });
});
