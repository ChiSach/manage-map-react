import FormUploadImage from "./form-uplaod-image"
import Cards from "./cards"
import { useState } from 'react';
const Home = (props) => {
  const [listMap, setListMap] = useState([]);
  return (
    <div>
      <Cards listMap={listMap}/>
      <FormUploadImage setListMap={setListMap}/>
    </div>
  )
}

export default Home