import { useParams } from "react-router-dom";
import axios from 'axios';
import Button from '@material-ui/core/Button';
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import DetailAreaDialogs from './popup';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Draggable from 'react-draggable';
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
        position: 'relative',
        width: "100%",
        height: "auto",
        maxWidth: 1024
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
            fill: 'rgb(218 69 103 / 20%) !important',
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
        zIndex: 10,
        transition: 'right .3s',
        "&:hover": {
            cursor: 'pointer'
        }
    },
    leftMenuAct: {
        right: -250
    },
    openLeftMenu: {
        top: 10,
        left: -30,
        position: 'absolute',
        width: 22,
        height: 23,
        zIndex: 9,
        padding: 5,
        backgroundColor: '#fff',
        borderLeft: '1px solid rgb(102 102 102 / 28%)'
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
    },
    editDiv: {
        padding: '15px 8px 10px',
        cursor: 'pointer',
        marginLeft: 10,

    },
    editIcon: {
        "&:hover": {
            webkitBoxShadow: '0px 2px 5px 1px rgba(187,187,187,1)',
            mozBoxShadow: '0px 2px 5px 1px rgba(187,187,187,1)',
            boxShadow: '0px 2px 5px 1px rgba(187,187,187,1)',
            borderRadius: '2px'
        }
    },
    itemAreaAtc: {
        webkitBoxShadow: '0px 2px 5px 1px rgba(187,187,187,0.4)',
        mozBoxShadow: '0px 2px 5px 1px rgba(187,187,187,0.4)',
        boxShadow: '0px 2px 5px 1px rgba(187,187,187,0.4)',
        backgroundColor: 'rgb(153 153 153 / 43%)'
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
    const [areaAct, setAreaAct] = useState(-1);
    const [indexArea, setIndexArea] = useState(-1);
    const [isRemoveArea, setRemoveArea] = useState(false);
    const imageRef = useRef();
    const [isOpenSuccess, setOpenSuccess] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [typeSnackbar, setTypeSnackbar] = useState("error");
    const [isOpenLeftMenu, setOpenLeftMenu] = useState(false);
    const [isShowDot, setShowDot] = useState({index: -1, idArea: -1}); // isShowDot > -1 status is edit
    const [xyDots, setXYDots] = useState('');
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

    useEffect(async () => {
        if (!isOpenPopup && indexArea > -1) {
            document.getElementById("area-scroll-" + indexArea).style.fill = `rgb(${indexArea + 51} ${indexArea + 151} 219 / 57%)`
            setAreaAct(-1)
        }

        // remove a area
        if (isRemoveArea && indexArea > -1) {
            let fd = new FormData()
            fd.append("id", dataDetail.id);
            try {
                await axios({
                    method: 'DELETE',
                    url: process.env.REACT_APP_URL_API + '/remove-area/' + dataDetail.id
                }).then(response => {
                    setDataDetail({})
                    setListArea(response.data.data)
                    setSnackbar(true, response.data.success, 'success')
                }).catch(function (error) {
                    console.log('Error ' + (Object.assign({}, error).response?.status || ''));
                })
            } catch (error) {
                console.log('Error', JSON.stringify(error))
            }
            setIndexArea(-1)
            setAreaAct(-1)
            setRemoveArea(false)
        }
    }, [isOpenPopup])

    const onAddMap = () => {
        if (isAdd) {
            setPolygonPoint('');
        }
        setAdd(!isAdd)
    }

    const drawPoint = (e) => {
        if (isAdd && infoImg) {
            const a = polygonPoint + ' ' + (e.pageX - infoImg.left) + ',' + (e.pageY - infoImg.top + 2)
            setPolygonPoint(a)
            setXYDots(a)
        }
    }

    const showDotOfArea = (index, idArea) => {
        setShowDot({index, idArea})
        setPolygonPoint(listArea[index].coordinatesSVG)
        setXYDots(listArea[index].coordinatesSVG)
    }

    const onMouseOverPoint = (e) => {
        if (isAdd) {
            document.getElementById('con-image').style.cursor = "pointer"
            if (infoImg?.width > 0) {
                document.getElementById('con-svg').style.cursor = "pointer"
            }
        } else {
            document.getElementById('con-image').style.cursor = "unset"
            if (infoImg?.width > 0) {
                document.getElementById('con-svg').style.cursor = "unset"
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
        setAreaAct(i)
    }

    const showDetailArea = (i) => {
        scrollIntoView(i)
        setIndexArea(i)
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
                    setListArea(response.data.data)
                    setSnackbar(true, response.data.success, 'success')
                    setXYDots('')
                }).catch(function (error) {
                    setSnackbar(true, 'Error ' + Object.assign({}, error).response?.status)
                    setXYDots('')
                })
            } catch (error) {
                setSnackbar(true, 'Error' + JSON.stringify(error))
                setXYDots('')
            }
            reset();
            setAdd(false);
            setPolygonPoint('');
        }
    }

    const setSnackbar = (isOpen = false, message = '', type = 'error') => {
        setOpenSuccess(isOpen)
        setSnackbarMessage(message)
        setTypeSnackbar(type)
    }

    const handleCloseAlert = () => {
        setOpenSuccess(false)
    }

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    function openLeftMenu() {
        setOpenLeftMenu(!isOpenLeftMenu);
    }

    const handleStart = (e, i) => {
        e.preventDefault();
    }

    const handleDrag = (e, i) => {
        e.preventDefault();
        if (isShowDot.index >= -1) {
            let editDots = polygonPoint.split(" ")
            if (e.layerX >= 0 && e.layerX <= infoImg.width && e.layerY >= 0 && e.layerY <= infoImg.height && e.target.localName === 'circle') {
                editDots[i] = e.layerX + "," + e.layerY
                setPolygonPoint(editDots.join(' '))
            } else {
                // console.log(e)
            }
        }
    }

    const handleStop = (e, i) => {
        e.preventDefault();
    }

    const upDateArea = (e) => {
        setShowDot({index: -1, idArea: -1});
        setPolygonPoint('')
        setXYDots('')
    }

    const cancelUpdate = () => {
        setShowDot({index: -1, idArea: -1});
        setPolygonPoint('')
        setXYDots('')
    }

    // Render HTML
    return dataMap.length ? (
        <div className={classes.root}>
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                open={isOpenSuccess}
                autoHideDuration={2000}
                onClose={() => handleCloseAlert()}
            >
                <Alert onClose={handleCloseAlert} severity={typeSnackbar}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            {
                isOpenPopup ? <DetailAreaDialogs setOpenPopup={setOpenPopup} isOpenPopup={isOpenPopup}
                    dataDetail={dataDetail} setListArea={setListArea} setOpenSuccess={setOpenSuccess}
                    setAreaAct={setAreaAct} setRemoveArea={setRemoveArea}
                /> : ''
            }
            {
                listArea.length > 0 ?
                    <div className={isOpenLeftMenu ? `${classes.leftMenu} ${classes.leftMenuAct}` : `${classes.leftMenu}`}>
                        <div className={classes.openLeftMenu}>
                            {
                                isOpenLeftMenu ? <ChevronLeftIcon onClick={openLeftMenu} /> : <ChevronRightIcon onClick={openLeftMenu} />
                            }
                        </div>
                        {
                            listArea.map((item, i) => {
                                return (
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <p onClick={() => scrollIntoView(i)} className={`${classes.itemArea} ${areaAct === i ? classes.itemAreaAtc : ''}`}>{item.title}</p>
                                        {
                                            isShowDot.index === -1 && !isAdd ?
                                                (<div className={classes.editDiv}><EditIcon className={classes.editIcon} onClick={() => showDotOfArea(i, listArea.id)} /></div>) : ""
                                        }
                                    </div>
                                )
                            })
                        }
                    </div> : ''
            }

            <div>
                <h3>{dataMap[0].title}</h3>
                <div className={classes.conBtn}>
                    {
                        isShowDot.index === -1 ? (
                            <>
                                <Button variant="contained" color="primary" onClick={onAddMap}>
                                    {!isAdd ? "Thêm" : "Hủy"}
                                </Button>
                                <Button variant="contained" disabled={!isAdd} color="primary" onClick={onSubmit} style={{ marginLeft: 10 }}>
                                    {"Save"}
                                </Button>
                            </>
                        ) : (
                                <>
                                    <Button variant="contained" color="primary" style={{ marginLeft: 10 }} onClick={upDateArea}>
                                        {"Update"}
                                    </Button>
                                    <Button variant="contained" style={{ marginLeft: 10 }} onClick={cancelUpdate}>
                                        {"Cancel"}
                                    </Button>
                                </>
                            )
                    }
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
                                    {
                                        xyDots.split(" ").map((val, i) => {
                                            return isShowDot.index === -1 ? (
                                                <circle cx={+val.split(",")[0]} cy={+val.split(",")[1]} r="5" stroke="red" fill="transparent" />
                                            ) : (
                                                    <Draggable
                                                        onStart={(e) => handleStart(e, i)}
                                                        onDrag={(e) => handleDrag(e, i)}
                                                        onStop={(e) => handleStop(e, i)}>
                                                        <circle cx={+val.split(",")[0]} cy={+val.split(",")[1]} r="5" stroke="red" fill="transparent" />
                                                    </Draggable>
                                                )
                                        })
                                    }
                                </g>
                                {
                                    listArea.length > 0 && isShowDot.index === -1 ?
                                        listArea.map((item, i) => {
                                            return (
                                                <g fill={`rgb(${i + 51} ${i + 151} 219 / 57%)`} className={`${classes.hoverSVG}`}
                                                    strokeWidth="1" stroke={`rgb(${i + 51} ${151 + i} 219 / 57%)`}
                                                >
                                                    <polygon points={item.coordinatesSVG + ""} onClick={(e) => showDetailArea(i)} id={"area-scroll-" + i} />
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