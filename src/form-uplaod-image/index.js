import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import styles from './styles.module.css';
import axios from 'axios';
function FormUploadImage(props) {

  const { register, handleSubmit, reset, getValues, setValue } = useForm({
    defaultValues: {
      title: '',
      image: '',
      description: ''
    }
  });
  const [imgData, setImgData] = useState(null);

  const onChangeImage = event => {
    let file = event.target.files[0];
    if (file && file.type !== "image/png" && file.type !== "image/jpg" && file.type !== "image/jpeg") {
      window.alert("File does not support. You must use .png or .jpg ");
      setValue('image', '')
      return false;
    }
    if (file && file.size > 500000) {
      window.alert("Please upload a file smaller than 50 MB");
      setValue('image', '')
      return false;
    }
    setImgData(event.target.files[0]);
  };

  const onSubmit = async (dataForm) => {
    let fd = new FormData()
    fd.append("title", dataForm.title);
    fd.append("image", imgData);
    fd.append("description", dataForm.description);
    try {
      await axios({
        method: 'POST',
        url: process.env.REACT_APP_URL_API + '/upload-image',
        data: fd,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(response => {
        props.setListMap(response.data?.dataMaps || []);
        reset();
        console.log(response.data)
      }).catch(function (error) {
        alert('Error ' + Object.assign({}, error).response.status);
      })
    } catch (error) {
      console.log('Error', JSON.stringify(error))
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form} enctype="multipart/form-data">
        <TextField
          className={styles.inputWidth100}
          label="Title Map"
          variant="outlined"
          size="small"
          required
          name="title"
          autoComplete="off"
          InputLabelProps={{ shrink: true }}
          inputRef={register}
        />
        <div className={`${styles.labelTitle} ${styles.inputWidth100}`}>
          <input
            type="file"
            name="image"
            required
            ref={register}
            onChange={(e) => onChangeImage(e)}
          />
        </div>
        <TextField
          className={`${styles.marginTopDown10} ${styles.inputWidth100}`}
          label="Mo ta"
          name="description"
          variant="outlined"
          multiline
          rows={5}
          InputLabelProps={{ shrink: true }}
          inputRef={register}
        />
        <div style={{ marginTop: 10 }}>
          <Button type="reset" style={{ marginRight: 10 }} variant="contained" color="primary">
            {"Reset"}
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {"Lưu"}
          </Button>
        </div>
      </form>
    </div>
  )

}
export default FormUploadImage