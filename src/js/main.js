/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-inner-declarations */

const viewportFix = (width) => {
  const meta = document.querySelector('meta[name="viewport"]');
  meta.setAttribute('content', `user-scalable=no, width=${screen.width <= width ? width : 'device-width'}`);
};

viewportFix(420);

document.addEventListener('DOMContentLoaded', function () {
  Fancybox.bind('[data-fancybox]', {
    dragToClose: false,
    autoFocus: false,
    placeFocusBack: false,
  });

  const maskOptions = {
    mask: '+7 (000) 000-00-00',
    // lazy: false,
    // placeholderChar: '_',
    onFocus: function () {
      if (this.value === '') this.value = '+7 ';
    },
    onBlur: function () {
      if (this.value === '+7 ') this.value = '';
    },
  };

  const maskedElements = document.querySelectorAll('.masked');
  maskedElements.forEach((item) => new IMask(item, maskOptions));

  if (document.querySelector('.reviews-slider')) {
    const reviewsSlider = new Splide('.reviews-slider', {
      type: 'loop',
      gap: '70px',
      autoHeight: true,
    });

    var heightMap = {};
    document.querySelectorAll('.splide__slide').forEach(function (e) {
      e.style.maxHeight = 0;
    });

    reviewsSlider.on('mounted', function () {
      var i = 0;
      document.querySelectorAll('.splide__slide').forEach(function (e) {
        if (!e.classList.contains('splide__slide--clone')) {
          heightMap[i] = e.scrollHeight;
          i++;
        }
      });
    });

    reviewsSlider.on('active', function (e) {
      // or e.index for non loop sliders
      var maxHeight = heightMap[e.slideIndex] + 'px';
      e.slide.style.maxHeight = maxHeight;
      e.slide.parentElement.style.maxHeight = maxHeight;
    });

    reviewsSlider.mount();
  }

  const faq = document.querySelector('.faq');
  if (faq) {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
      item.addEventListener('click', function () {
        item.classList.toggle('open');
      });
    });
  }
});
