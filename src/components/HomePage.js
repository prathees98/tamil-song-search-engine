import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Container, CssBaseline, Paper } from '@material-ui/core';
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    color: theme.palette.text.primary,
    backgroundColor: "#D1F5FF"
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(12),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    margin: theme.spacing(4, 0, 2),
    color: theme.palette.text.primary,
    textAlign: 'center',
  },
  body: {
    margin: theme.spacing(2, 0),
    textAlign: 'center',
    
   
  },
  button: {
    position: 'absolute',
    left: theme.spacing(2),
    bottom: theme.spacing(2),
  }
}));

export default function HomePage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Container component="main" className={classes.main} maxWidth="sm">
        <Paper className={classes.paper}>
          <Typography variant="h4" className={classes.title}>
            Here is the tamil A.R.Rahman hit song collection...
          </Typography>
          <Typography variant="body1" className={classes.body}>
                 You can search for a A.R.Rahman song!
          </Typography>
          <Typography variant="body1" className={classes.body}>
            You can find a best metaphor used in the song!
          </Typography>
          <Typography variant="body1" className={classes.body}>
            You also get the meaning of the metaphor!
          </Typography>
          <Link to="/search">
            <Button variant="contained" color="primary">
              Search For a Song
            </Button>
          </Link>
        </Paper>
      </Container>
    </div>
  );
}
