import { useParams } from "react-router-dom";
import axios from 'axios';
import Button from '@material-ui/core/Button';
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import TextField from '@material-ui/core/TextField';
import DetailAreaDialogs from './popup';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles({
    root: {
        padding: 10,
        margin: 10
    },
    conImg: {
        border: '1px solid #888',
        width: 'fit-content',
        marginTop: 10
    },
    conImgSvg: {
        position: 'relative'
    },
    SVG: {
        position: "absolute",
        top: 0,
        left: 0
    },
    conBtn: {
        display: 'flex',
    },
    marginTop10: {
        marginTop: 10
    },
    hoverSVG: {
        "&:hover": {
            fill: '#DA4567 !important',
            cursor: 'pointer'
        }
    },
    leftMenu: {
        height: '100%',
        width: 250,
        position: 'fixed',
        right: 0,
        top: 0,
        webkitBoxShadow: '0px 2px 5px 1px rgba(187,187,187,1)',
        mozBoxShadow: '0px 2px 5px 1px rgba(187,187,187,1)',
        boxShadow: '0px 2px 5px 1px rgba(187,187,187,1)',
        borderRadius: 3,
        zIndex: 10
    },
    itemArea: {
        margin: 10,
        webkitBoxShadow: '0px 2px 5px 1px rgba(187,187,187,0.68)',
        mozBoxShadow: '0px 2px 5px 1px rgba(187,187,187,0.68)',
        boxShadow: '0px 2px 5px 1px rgba(187,187,187,0.68)',
        padding: '8px 8px 10px',
        lineHeight: 1,
        borderRadius: 4,
        cursor: 'pointer'
    }

});

export default function DetailMap(props) {
    let { id } = useParams();
    const { register, handleSubmit, reset, setValue, getValues } = useForm({
        defaultValues: {
            title: '',
            coordinatesSVG: '',
            map_id: id || ''
        }
    });
    const classes = useStyles();
    const [listArea, setListArea] = useState([]);
    const [dataMap, setDataMap] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [infoImg, setInfoImg] = useState(null);
    const [isAdd, setAdd] = useState(false);
    const [isOpenPopup, setOpenPopup] = useState(false);
    const [dataDetail, setDataDetail] = useState({});
    const [polygonPoint, setPolygonPoint] = useState('');
    const [isOpenSuccess, setOpenSuccess] = useState(false);
    const [svg, setSVG] = useState('');
    const imageRef = useRef();

    useEffect(() => {
        try {
            axios({
                method: 'GET',
                url: process.env.REACT_APP_URL_API + '/detail/' + id
            }).then(response => {
                if (response.data.success === "Successfully") {
                    setDataMap(response.data.dataMap)
                    setLoading(false)
                }
            }).catch(function (error) {
                console.log('Error ' + (Object.assign({}, error).response?.status || ''));
            })
        } catch (error) {
            console.log('error', JSON.stringify(error))
        }

    }, [props])

    useEffect(() => {
        if (!isAdd) {
            try {
                axios({
                    method: 'GET',
                    url: process.env.REACT_APP_URL_API + '/list-area/' + id
                }).then(response => {
                    if (response.data.success === "Successfully") {
                        console.log(response.data.listArea)
                        setListArea(response.data.listArea)
                    }
                }).catch(function (error) {
                    console.log('Error ' + (Object.assign({}, error).response?.status || ''));
                })
            } catch (error) {
                console.log('error', JSON.stringify(error))
            }
        }
    }, [isAdd])

    useEffect(function () {
        setTimeout(() => {
            setInfoImg(document.getElementById('con-image')?.getBoundingClientRect())
        }, 1000);
    }, []);

    const onAddMap = () => {
        if(isAdd){
            setPolygonPoint('');
        }
        setAdd(!isAdd)
    }

    const drawPoint = (e) => {
        if (isAdd && infoImg) {
            setPolygonPoint(polygonPoint + ' ' + (e.pageX - infoImg.left) + ',' + (e.pageY - infoImg.top + 2))
        }
    }

    const onMouseOverPoint = (e) => {
        if (isAdd) {
            document.getElementById('con-image').style.cursor = "pointer"
            if (infoImg?.width > 0) {
                document.getElementById('con-svg').style.cursor = "pointer"
            }
        }
    }

    const scrollIntoView = (i) => {
        let count = 0
        const len = listArea.length
        while (count < len) {
            document.getElementById("area-scroll-" + count).style.fill = `rgb(${count + 51} ${count + 151} 219 / 57%)`
            count++
        }
        const elmnt = document.getElementById("area-scroll-" + i)
        elmnt.scrollIntoView({
            block: "start",
            behavior: "smooth"
        });
        elmnt.style.fill = '#DA4567'
    }

    const showDetailArea = (i) => {
        scrollIntoView(i)
        setDataDetail(listArea[i]);
        setOpenPopup(true);
    }

    const onSubmit = async () => {
        if (isAdd) {
            try {
                let fd = new FormData()
                fd.append("title", getValues('title'));
                fd.append("coordinatesSVG", polygonPoint);
                fd.append("map_id", getValues('map_id'));
                await axios({
                    method: 'POST',
                    url: process.env.REACT_APP_URL_API + '/add-area',
                    data: fd
                }).then(response => {
                    alert(response.data.success)
                }).catch(function (error) {
                    alert('Error ' + Object.assign({}, error).response?.status);
                })
            } catch (error) {
                console.log('Error', JSON.stringify(error))
            }
            reset();
            setAdd(false);
            setPolygonPoint('');
        }
    }

    const handleCloseAlert = () => {
        setOpenSuccess(false)
    }

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    return dataMap.length ? (
        <div className={classes.root}>
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                open={isOpenSuccess}
                autoHideDuration={2000}
            >
                <Alert onClose={handleCloseAlert} severity="success">
                    {'Success!'}
                </Alert>
            </Snackbar>
            {
                isOpenPopup ? <DetailAreaDialogs setOpenPopup={setOpenPopup} isOpenPopup={isOpenPopup}
                    dataDetail={dataDetail} setListArea={setListArea} setOpenSuccess={setOpenSuccess}
                /> : ''
            }
            {
                listArea.length > 0 ?
                    <div className={classes.leftMenu}>
                        {
                            listArea.map((item, i) => {
                                return (
                                    <div>
                                        <p onClick={() => scrollIntoView(i)} className={classes.itemArea}>{item.title}</p>
                                    </div>
                                )
                            })
                        }

                    </div> : ''
            }

            <div>
                <h3>{dataMap[0].title}</h3>
                <div className={classes.conBtn}>
                    <Button variant="contained" color="primary" onClick={onAddMap}>
                        {!isAdd ? "Thêm" : "Hủy"}
                    </Button>
                    <Button variant="contained" disabled={!isAdd} color="primary" onClick={onSubmit} style={{ marginLeft: 10 }}>
                        {"Save"}
                    </Button>
                </div>
                {
                    isAdd ? <form>
                        <TextField
                            className={classes.marginTop10}
                            label="Title Area"
                            variant="outlined"
                            size="small"
                            required
                            name="title"
                            autoComplete="off"
                            InputLabelProps={{ shrink: true }}
                            inputRef={register}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                        />
                        <input ref={register} name='map_id' type="hidden" />
                    </form> : <div style={{ height: 50 }}></div>
                }
            </div>
            <div className={classes.conImgSvg}>
                {
                    dataMap[0].url_image ? (
                        <div className={`${classes.conImg}`}>
                            <img src={'http://127.0.0.1:8000' + dataMap[0].url_image} ref={imageRef}
                                onClick={drawPoint}
                                onMouseOver={onMouseOverPoint}
                                id={`con-image`} />
                        </div>
                    ) : (<div></div>)
                }
                {
                    (infoImg?.width > 0) ? (
                        <div className={`${classes.SVG} `} id="con-svg" onClick={drawPoint}
                            onMouseOver={onMouseOverPoint}>
                            <svg xmlns="http://www.w3.org/2000/svg" height={infoImg.height} width={infoImg.width}>
                                <g fill="rgb(50 150 219 / 57%)" strokeWidth="1" className={`${classes.hoverSVG}`} stroke="rgb(50 150 219 / 57%)">
                                    <polygon points={polygonPoint + ""} />
                                </g>
                                {
                                    listArea.length > 0 ?
                                        listArea.map((item, i) => {
                                            return (
                                                <g fill={`rgb(${i + 51} ${i + 151} 219 / 57%)`} className={`${classes.hoverSVG}`}
                                                    strokeWidth="1" stroke={`rgb(${i + 51} ${151 + i} 219 / 57%)`}
                                                    onClick={(e) => showDetailArea(i)} id={"area-scroll-" + i}
                                                >
                                                    <polygon points={item.coordinatesSVG + ""} />
                                                </g>
                                            )
                                        })
                                        : ''
                                }
                            </svg>
                        </div>
                    ) : ''
                }
            </div>
        </div>
    ) : (<div>Loading...</div>)
}