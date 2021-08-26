import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const useStyles = makeStyles((theme) => ({
  bar: {
    position: 'absolute',
    bottom: '20%',
  },
}));

export default function SnackBar(props) {
  const classes = useStyles();

  return (
    <Snackbar
      open={props.open}
      autoHideDuration={6000}
      onClose={props.close}
      className={classes.bar}
    >
      <Alert onClose={props.close} severity='success'>
        {props.children}
      </Alert>
    </Snackbar>
  );
}