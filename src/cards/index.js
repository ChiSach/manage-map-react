import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Link } from "react-router-dom";
import axios from 'axios';

const useStyles = makeStyles({
    root: {
        maxWidth: 200,
        minHeight: 100,
        margin: 10
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    unTextDecoration: {
        textDecoration: 'none'
    }
});

export default function Cards(props) {

    const classes = useStyles();

    const [dataMaps, setDataMaps] = useState(props.listMap || []);

    useEffect(()=>{
        setDataMaps(props.listMap || [])
    }, [props])

    useEffect(() => {
        try {
            axios({
                method: 'GET',
                url: process.env.REACT_APP_URL_API
            }).then(response => {
                if (response.data.success === "Successfully")
                    setDataMaps(response.data.dataMaps)
            }).catch(function (error) {
                console.log('Error ' + (Object.assign({}, error).response?.status || ''));
            })
        } catch (error) {
            console.log('error', JSON.stringify(error))
        }
    }, [])

    // const bull = <span className={classes.bullet}>•</span>;
    const cards = dataMaps.map((val, i) => {
        return (
            <Grid item xs={12} sm={2} md={2}>
                <Link to={`/detail/${val.id}`} className={classes.unTextDecoration}>
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {val.title}
                            </Typography>
                            <Typography variant="p" component="p">
                                {val.description || ''}
                            </Typography>
                        </CardContent>
                    </Card>
                </Link>
            </Grid>
        )
    })
    return (
        <Grid
            container
            direction="row"
        >
            {cards}
        </Grid>
    );
}
