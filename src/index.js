/**
 * Создай фронтенд часть приложения поиска и просмотра изображений по ключевому слову.
 * Добавь оформление элементов интерфейса. Посмотри демо видео работы приложения.
 *
 * Форма изначально есть в HTML документе. Пользователь будет вводить строку
 * для поиска в текстовое поле, а при сабмите формы необходимо выполнять HTTP-запрос.
 * 
//  * HTTP-запросы
// В качестве бэкенда используй публичный API сервиса Pixabay. 
// Зарегистрируйся, получи свой уникальный ключ доступа и ознакомься с документацией.

// Список параметров строки запроса которые тебе обязательно необходимо указать:

// key - твой уникальный ключ доступа к API.
// q - термин для поиска. То, что будет вводить пользователь.
// image_type - тип изображения. Мы хотим только фотографии, поэтому задай значение photo.
// orientation - ориентация фотографии. Задай значение horizontal.
// safesearch - фильтр по возрасту. Задай значение true.
// В ответе будет массив изображений удовлетворивших критериям параметров запроса. 

// Каждое изображение описывается объектом, из которого тебе интересны только 
// следующие свойства:

// webformatURL - ссылка на маленькое изображение для списка карточек.
// largeImageURL - ссылка на большое изображение.
// tags - строка с описанием изображения. Подойдет для атрибута alt.
// likes - количество лайков.
// views - количество просмотров.
// comments - количество комментариев.
// downloads - количество загрузок.

// Если бэкенд возвращает пустой массив, значит ничего подходящего найдено небыло. 
// В таком случае показывай уведомление с текстом 
// "Sorry, there are no images matching your search query. Please try again.". 
// Для уведомлений используй библиотеку notiflix.

// Галерея и карточка изображения

// Элемент div.gallery изначально есть в HTML документе, и в него необходимо
// рендерить разметку карточек изображений. При поиске по новому ключевому слову 
// необходимо полностью очищать содержимое галереи, чтобы не смешивать результаты.


// Шаблон разметки карточки одного изображения для галереи.

// Пагинация

// Pixabay API поддерживает пагинацию и предоставляет параметры page и per_page. 
// Сделай так, чтобы в каждом ответе приходило 40 объектов (по умолчанию 20).

// Изначально значение параметра page должно быть 1.
// При каждом последующем запросе, его необходимо увеличить на 1.

// При поиске по новому ключевому слову значение page надо вернуть в исходное, 
// так как будет пагинация по новой коллекции изображений.

// В HTML документе уже есть разметка кнопки при клике по которой необходимо 
// выполнять запрос за следующей группой изображений и добавлять разметку к уже 
// существующим элементам галереи.

// <button type="button" class="load-more">Load more</button>

// Изначально кнопка должна быть скрыта.
// После первого запроса кнопка появляется в интерфейсе под галереей.
// При повторном сабмите формы кнопка сначала прячется, а после запроса опять 
// отображается.
// В ответе бэкенд возвращает свойство totalHits - общее количество изображений 
// которые подошли под критерий поиска (для бесплатного аккаунта). 
// Если пользователь дошел до конца коллекции, пряч кнопку и выводи уведомление 
// с текстом "We're sorry, but you've reached the end of search results.".

// Уведомление

// После первого запроса при каждом новом поиске выводить уведомление в котором 
// будет написано сколько всего нашли изображений (свойство totalHits).
// Текст уведомления "Hooray! We found totalHits images."

Библиотека SimpleLightbox

Добавить отображение большой версии изображения с библиотекой SimpleLightbox 
для полноценной галереи.

В разметке необходимо будет обернуть каждую карточку изображения в ссылку, 
как указано в документации.
У библиотеки есть метод refresh() который обязательно нужно вызывать каждый раз 
после добавления новой группы карточек изображений.
Для того чтобы подключить CSS код библиотеки в проект, необходимо добавить еще 
один импорт, кроме того который описан в документации.

// Описан в документации
import SimpleLightbox from "simplelightbox";
// Дополнительный импорт стилей
// import "simplelightbox/dist/simple-lightbox.min.css";

Прокрутка страницы

Сделать плавную прокрутку страницы после запроса и отрисовки каждой следующей 
группы изображений. Вот тебе код подсказка, а разберись в нём самостоятельно.

const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});

Бесконечный скролл

Вместо кнопки «Load more» можно сделать бесконечную загрузку изображений при прокрутке 
страницы. Мы предоставлям тебе полную свободу действий в реализации, 
можешь использовать любые библиотеки.

 */

import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const inputEl = formEl.querySelector('input');
const btnFormSubmit = formEl.querySelector('#submit');
const btnLoadMore = document.querySelector('.load-more');
const pictureGallery = document.querySelector('.gallery');

let pageNumber = 1;
let totalPages = 0;
const numberImagesInRequest = 40;

const KEY = '29837319-52dd2bde37e487871542beaa5';
const BASE_URL = 'https://pixabay.com/api/';

btnLoadMore.classList.add('visually-hidden');

formEl.addEventListener('submit', onFormSubmit);

btnLoadMore.addEventListener('click', () => {
  renderMarkupGallery(inputEl.value);
});

inputEl.addEventListener('input', onHandleInput);

function onFormSubmit(evt) {
  evt.preventDefault();
  btnFormSubmit.setAttribute('disabled', true);
  const inputValue = evt.currentTarget.elements.searchQuery.value;
  renderMarkupGallery(inputValue);
  onHandleInput(inputValue);

  // scroll();
}

function onHandleInput(value) {
  if (inputEl.value !== value) {
    pageNumber = 1;
    clearMarkUp();
  }
}

async function renderMarkupGallery(value) {
  try {
    const gallery = await fetchPictures(value);
    const { data } = gallery;
    totalPages = Math.ceil(data.totalHits / numberImagesInRequest);
    btnLoadMore.classList.remove('visually-hidden');

    if (pageNumber === 1 && data.hits.length !== 0) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      btnLoadMore.classList.add('visually-hidden');
    }

    if (data.hits.length !== 0 && pageNumber >= totalPages) {
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      btnLoadMore.classList.add('visually-hidden');
      pageNumber = 1;
    }

    pageNumber += 1;
    markupTemplate(data.hits);
    openImgModal();
    scroll();
  } catch (err) {
    console.log(err.message);
  }
}

function markupTemplate(pictures) {
  const markup = pictures
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
            <a href="${largeImageURL}" class="img-link">
                 <img src="${webformatURL}" alt="${tags}" loading="lazy" class="img"/>
            </a>
            <div class="info">
                    <p class="info-item">
                    <b>Likes </b>${likes}
                </p>
                <p class="info-item">
                        <b>Views </b>${views}
                </p>
                <p class="info-item">
                    <b>Comments </b>${comments}
                </p>
                <p class="info-item">
                    <b>Downloads </b>${downloads}
                </p>
            </div>
        </div>`;
      }
    )
    .join('');
  pictureGallery.insertAdjacentHTML('beforeend', markup);
  return pictureGallery;
}

async function fetchPictures(searchValue) {
  const urlParams = `?key=${KEY}&per_page=${numberImagesInRequest}&page=${pageNumber}&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true&`;
  const picturesArray = await axios.get(`${BASE_URL}${urlParams}`);

  return picturesArray;
}

function clearMarkUp() {
  btnLoadMore.classList.add('visually-hidden');
  btnFormSubmit.removeAttribute('disabled');
  return (pictureGallery.innerHTML = '');
}

function openImgModal() {
  let mainGallery = new SimpleLightbox('.photo-card a', {
    overlayOpacity: 0.8,
    captionDelay: 250,
    captionsData: 'alt',
    heightRatio: 0.8,
  });
  pictureGallery.addEventListener('click', event => {
    event.preventDefault();
    mainGallery.on('show.simplelightbox', function () {
      mainGallery.defaultOptions.captionDelay = 250;
    });
  });
  mainGallery.refresh();
}

// Прокрутка страницы

// function scroll() {
//   const element = pictureGallery.firstElementChild.getBoundingClientRect();
//   const { height: cardHeight } = element;
//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }
