const {
  DEFAULT_OPTIONS,
  imageClass,
  imageBackgroundClass,
} = require("./constants");

exports.onInitialClientRender = function onInitialClientRender({ pluginOptions }) {
  const options = Object.assign({}, DEFAULT_OPTIONS, pluginOptions);
  document.addEventListener('load', event => {
    if (event.target instanceof HTMLImageElement && event.target.classList.contains(imageClass)) {
      const imageElement = event.target;
      const backgroundElement = event.target.previousElementSibling;
      imageElement.style.opacity = 0;
      imageElement.style.transition = "opacity 0.5s";
      if (backgroundElement && backgroundElement.classList.contains(imageBackgroundClass)) {
        backgroundElement.style.transition = "opacity 0.5s 0.5s";
        backgroundElement.style.opacity = 0;
      }

      imageElement.style.opacity = 1;
      imageElement.style.color = "inherit";
      imageElement.style.boxShadow = "inset 0px 0px 0px 400px " + options.backgroundColor;
    }
  }, true);
}