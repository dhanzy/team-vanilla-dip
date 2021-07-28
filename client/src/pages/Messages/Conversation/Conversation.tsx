import { useEffect } from 'react';
import { useAuth } from '../../../context/useAuthContext';
import { ConversationProps } from './interface/Conversation';
import fetchUser from '../../../helpers/APICalls/getUserById';
import useStyles from './useStyles';
import profilePic from '../../../Images/profile.png';
import { Typography, Grid, ListItem, Divider, ListItemAvatar, Avatar, ListItemText, Badge } from '@material-ui/core';

export default function Conversation({ participants }: ConversationProps): JSX.Element {
  const classes = useStyles();
  const { loggedInUser } = useAuth();

  const participantId = participants?.find((participant: string) => participant !== loggedInUser?.id);
  console.log(participantId);

  useEffect(() => {
    let active = true;

    async function getUserInfo() {
      const response = await fetchUser({
        id: participantId,
      });

      if (active && response && response.user) {
        console.log(response.user);
      }
    }

    getUserInfo();

    return () => {
      active = false;
    };
  }, [participantId]);

  return (
    <>
      <ListItem alignItems="flex-start" button>
        <Grid container>
          <Grid item container alignItems="center" justifyContent="flex-start" xs={9}>
            <Grid item xs={2}>
              <ListItemAvatar style={{ paddingLeft: '0.5em' }}>
                <Badge
                  overlap="circular"
                  variant="dot"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  classes={{ badge: classes.inactiveBadge }}
                >
                  <Avatar alt="profile picture" src={profilePic} />
                </Badge>
              </ListItemAvatar>
            </Grid>
            <Grid item xs={10}>
              <ListItemText disableTypography style={{ paddingLeft: '0.5em' }}>
                <Typography variant="h6" style={{ fontWeight: 700 }}>
                  John Doe
                </Typography>
                <Typography variant="body1" className={classes.messageSnippet}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua.
                </Typography>
              </ListItemText>
            </Grid>
          </Grid>
          <Grid item container alignItems="center" justifyContent="flex-end" xs={3}>
            <Grid item>
              <ListItemText disableTypography>
                <Typography variant="body1" style={{ padding: '1em' }}>
                  Yesterday
                </Typography>
              </ListItemText>
            </Grid>
          </Grid>
        </Grid>
      </ListItem>
      <Divider />
    </>
  );
}
