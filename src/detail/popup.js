import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    marginTop10: {
        marginTop: 10
    }
});
const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

export default function DetailAreaDialogs(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(props.isOpenPopup || false);
    const [dataDetail, setDataDetail] = React.useState(props.dataDetail || {});
    const [isOpenAlert, setOpenAlert] = useState(false)
    const { register, handleSubmit, reset, setValue, getValues } = useForm({
        defaultValues: {
            map_id: props.dataDetail?.map_id || 0,
            title: props.dataDetail?.title || '',
            coordinatesSVG: props.dataDetail?.coordinatesSVG || '',
            acreage: props.dataDetail?.acreage || 0,
            perimeter: props.dataDetail?.perimeter || 0,
            id: props.dataDetail?.id || 0,
        }
    });

    React.useEffect(() => {
        setOpen(props.isOpenPopup || false)
        setDataDetail(props.dataDetail || {})
    }, [props])

    const handleClose = () => {
        setOpen(false);
        props.setOpenPopup(false);
    };

    const onSubmit = async () => {
        try {
            let fd = new FormData()
            fd.append("title", getValues('title'));
            fd.append("id", getValues('id'));
            fd.append("acreage", getValues('acreage'));
            fd.append("perimeter", getValues('perimeter'));
            const res = await axios.put(process.env.REACT_APP_URL_API + '/update-area', getValues());
            if (res.status === 200) {
                setOpen(false);
                props.setOpenPopup(false);
                props.setListArea(res.data.listAreas || []);
                props.setOpenSuccess(true);
            }
        } catch (error) {
            console.log('Error', JSON.stringify(error))
        }
    }

    const openAlert = () => {
        setOpenAlert(true)
    }

    const handleCancelAlert = () => {
        setOpenAlert(false)
    }

    const handleOkAlert = () => {
        setOpenAlert(false)
        handleClose()
        props.setRemoveArea(true)
    }

    if (Object.keys(dataDetail).length > 0 && dataDetail.constructor === Object) {
        return (
            <div>
                <Dialog open={isOpenAlert}>
                    <DialogTitle >Are you sure?</DialogTitle>
                    <DialogActions>
                        <Button onClick={handleCancelAlert} color="primary">
                            {'Cancel'}
                        </Button>
                        <Button onClick={handleOkAlert} color="primary">
                            {'Ok'}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                    <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                        {dataDetail?.title}
                    </DialogTitle>
                    <DialogContent dividers style={{ minWidth: 300 }}>
                        <form>
                            <Typography gutterBottom>
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
                            </Typography>

                            <Typography gutterBottom>
                                <input ref={register} type="hidden" name="coordinatesSVG" />
                                <input ref={register} type="hidden" name="map_id" />
                                <input ref={register} type="hidden" name="id" />
                            </Typography>

                            <Typography gutterBottom>
                                <TextField
                                    className={classes.marginTop10}
                                    label="Diện tích"
                                    variant="outlined"
                                    size="small"
                                    type="number"
                                    name="acreage"
                                    autoComplete="off"
                                    InputLabelProps={{ shrink: true }}
                                    inputRef={register}
                                    onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                />
                            </Typography>

                            <Typography gutterBottom>
                                <TextField
                                    className={classes.marginTop10}
                                    label="Chu Vi"
                                    variant="outlined"
                                    size="small"
                                    type="number"
                                    name="perimeter"
                                    autoComplete="off"
                                    InputLabelProps={{ shrink: true }}
                                    inputRef={register}
                                    onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                />
                            </Typography>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            {'Close'}
                        </Button>
                        <Button onClick={openAlert} color="primary">
                            {'Remove'}
                        </Button>
                        <Button onClick={onSubmit} color="primary">
                            {'Save'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    } else {
        return <></>
    }
}
