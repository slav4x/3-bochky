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
    on: {
      reveal: (fancybox, slide) => {
        const form = slide.triggerEl.dataset.form;
        const formTitle = slide.triggerEl.dataset.title;
        const title = document.querySelector('.popup h3');
        const button = document.querySelector('.popup .btn p');
        const text = document.querySelector('.popup small span');
        const input = document.querySelector('.popup input[name="form"]');
        input.value = form;
        title.innerHTML = formTitle;
        button.innerHTML = formTitle;
        text.innerHTML = formTitle;
      },
    },
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

  if (document.querySelector('.item')) {
    const itemText = document.querySelector('.item-description__text');
    const itemMore = document.querySelector('.item-description__more');
    itemMore.addEventListener('click', function () {
      itemText.classList.toggle('open');
      itemMore.classList.toggle('open');
    });
  }

  const burger = document.querySelector('.header-burger');
  const nav = document.querySelector('.header-nav');
  burger.addEventListener('click', function () {
    nav.classList.toggle('open');
    burger.classList.toggle('open');
  });

  // Генерация случайного токена
  function generateToken() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 30; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
  }

  // Установка токена в скрытое поле формы
  function setToken(form) {
    const token = generateToken();
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 't';
    hiddenInput.value = token;
    form.appendChild(hiddenInput);
  }

  // Инициализация токена для каждой формы на странице
  const forms = document.querySelectorAll('form:not([method="get"])');
  forms.forEach(function (form) {
    setToken(form);

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const button = form.querySelector('button.btn');

      button.style.opacity = 0.5;
      button.style.cursor = 'not-allowed';
      button.disabled = true;

      const formUrl = form.getAttribute('action');
      const formData = new FormData(this);
      const goal = form.dataset.goal;

      fetch(formUrl, {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          window.location.href = '/thanks';
        })
        .catch((error) => console.error('Error:', error));
    });
  });

  // Функция для получения utm-меток из URL
  function getUtmParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};
    for (const [key, value] of urlParams.entries()) {
      if (key !== 's') {
        utmParams[key] = value;
      }
    }
    return utmParams;
  }

  // Функция для установки utm-меток в формы
  function setUtmParamsInForms(utmParams) {
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
      Object.keys(utmParams).forEach((key) => {
        if (key !== 's') {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = utmParams[key];
          form.appendChild(input);
        }
      });
    });
  }

  // Функция для сохранения utm-меток в localStorage с временной меткой
  function saveUtmParamsWithExpiration(utmParams) {
    const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
    const dataToSave = {
      utmParams,
      expirationTime,
    };
    localStorage.setItem('utmData', JSON.stringify(dataToSave));
  }

  // Функция для загрузки utm-меток из localStorage
  function loadUtmParamsFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('utmData'));
    if (data && data.expirationTime > new Date().getTime()) {
      return data.utmParams;
    } else {
      return {};
    }
  }

  // Функция для очистки utm-меток из localStorage по истечении срока действия
  function clearUtmParamsIfExpired() {
    const data = JSON.parse(localStorage.getItem('utmData'));
    if (data && data.expirationTime <= new Date().getTime()) {
      localStorage.removeItem('utmData');
    }
  }

  // Вызываем функции
  const utmParamsFromUrl = getUtmParams();
  const savedUtmParams = loadUtmParamsFromLocalStorage();

  if (Object.keys(utmParamsFromUrl).length > 0) {
    setUtmParamsInForms(utmParamsFromUrl);
    saveUtmParamsWithExpiration(utmParamsFromUrl);
  } else if (Object.keys(savedUtmParams).length > 0) {
    setUtmParamsInForms(savedUtmParams);
  }

  clearUtmParamsIfExpired();
});
