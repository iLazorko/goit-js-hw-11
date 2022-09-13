import axios from 'axios';

const KEY = '29837319-52dd2bde37e487871542beaa5';
const BASE_URL = 'https://pixabay.com/api/';

export default async function fetchPictures(
  searchValue,
  numberImagesInRequest,
  pageNumber
) {
  const urlParams = `?key=${KEY}&per_page=${numberImagesInRequest}&page=${pageNumber}&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true&`;
  const picturesArray = await axios.get(`${BASE_URL}${urlParams}`);

  return picturesArray;
}
