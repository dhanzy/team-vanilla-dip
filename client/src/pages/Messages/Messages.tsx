import React, { useState } from 'react';
import useStyles from './useStyles';
import Navbar from '../../components/Navbar/Navbar';
import Conversation from './Conversation/Conversation';
import Message from './Message/Message';
import profilePic from '../../Images/profile.png';
import {
  Typography,
  Grid,
  CssBaseline,
  Divider,
  Paper,
  List,
  Avatar,
  Badge,
  Button,
  TextField,
  CircularProgress,
} from '@material-ui/core';

export default function Messages(): JSX.Element {
  const classes = useStyles();

  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const handleNewMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleNewMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setNewMessage('');
    setTimeout(() => {
      console.log(newMessage);
      setSubmitting(false);
    }, 1000);
  };

  return (
    <Grid container className={classes.root} direction="column" alignItems="center">
      <CssBaseline />
      <Grid item container>
        <Navbar />
      </Grid>
      <Grid item container>
        <Grid item xs={4}>
          <Paper elevation={2} className={classes.navOffset}>
            <Grid container direction="column">
              <Grid item xs={12} className={classes.convoBannerTitle}>
                <Typography variant="h5" style={{ fontWeight: 700 }}>
                  Inbox Messages
                </Typography>
              </Grid>
              <Divider />
              <Grid item className={classes.convoListContainer}>
                <List>
                  <Conversation />
                  <Conversation />
                  <Conversation />
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Grid container direction="column" className={classes.navOffset}>
            <Grid item container alignItems="center" className={classes.messagingHeader}>
              <Grid item container justifyContent="center" xs={1}>
                <Grid item>
                  <Badge
                    overlap="circular"
                    variant="dot"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    classes={{ badge: classes.activeBadge }}
                  >
                    <Avatar alt="profile picture" src={profilePic} />
                  </Badge>
                </Grid>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="h6" style={{ fontWeight: 700 }}>
                  John Doe
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Button size="large" className={classes.detailButton}>
                  <Typography variant="h6" style={{ fontWeight: 700 }}>
                    . . .
                  </Typography>
                </Button>
              </Grid>
            </Grid>
            <Grid item container alignItems="flex-end" justifyContent="flex-end" className={classes.chatboxContainer}>
              <Message />
            </Grid>
            <form onSubmit={handleNewMessageSubmit} style={{ width: '100%' }}>
              <Divider />
              <Grid item container alignItems="center" className={classes.sendMessageContainer}>
                <Grid item container justifyContent="center" alignItems="center">
                  <Grid item xs={9} className={classes.textAreaContainer}>
                    <TextField
                      id="message"
                      name="message"
                      placeholder="Start typing here . . ."
                      value={newMessage}
                      color="primary"
                      variant="outlined"
                      onChange={handleNewMessageChange}
                      multiline
                      fullWidth
                      rows={3}
                    />
                  </Grid>
                  <Grid
                    item
                    container
                    justifyContent="center"
                    alignItems="center"
                    xs={3}
                    className={classes.submitButtonContainer}
                  >
                    <Button
                      type="submit"
                      size="medium"
                      variant="contained"
                      color="primary"
                      className={classes.submitMessage}
                    >
                      {isSubmitting ? <CircularProgress size={20} style={{ color: 'white' }} /> : 'SEND'}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
