import axios from 'axios';

export const showMapService = (formdata) => {
  axios.get('http://127.0.0.1:8000/api')
    .then(res => {
      console.log(res)
    })
    .catch(error => error)
}