import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useHistory, useParams, Link } from 'react-router-dom';

import useStyles from './useStyles';
import Navbar from '../../components/Navbar/Navbar';
import SubmissionTabs from '../../components/SubmissionTabs/SubmissionTabs';
import { fetchSubmissionByContestId, fetchContestById } from '../../helpers/APICalls/searchContest';
import { Contest } from '../../interface/Contest';
import { Submission } from '../../interface/Submission';
import { SubmissionParams } from '../SubmitPage/SubmissionParams';
import { useAuth } from '../../context/useAuthContext';

export default function SubmissionPage(): JSX.Element {
  const { loggedInUser } = useAuth();
  const classes = useStyles();
  const { id } = useParams<SubmissionParams>();
  const [contest, setContest] = useState<Contest>();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const history = useHistory();

  useEffect(() => {
    const ac = new AbortController();
    fetchContestById({ id: id }).then((res) => {
      if (res.success) {
        setContest(res.success as Contest);
      }
    });
    return ac.abort();
  }, [id]);

  useEffect(() => {
    const ac = new AbortController();
    fetchSubmissionByContestId({ id: id }).then((res) => {
      if (res.submissions) {
        setSubmissions(res.submissions as Submission[]);
      }
    });
    return ac.abort();
  }, [id]);

  if (loggedInUser === undefined || !loggedInUser || contest == undefined || contest.userID == undefined)
    return <CircularProgress />;

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Box width="100%">
        <Navbar />
        <Box p={3} m={5}>
          <Grid container className={classes.returnPanel}>
            <ArrowBackIosIcon style={{ fontSize: 10 }} />
            <Button
              className={classes.return}
              onClick={() => {
                history.goBack();
              }}
            >
              Back to contests list
            </Button>
          </Grid>
          <Grid container className={classes.gridContainer}>
            <Grid item>
              <Typography component="h2" variant="h3" className={classes.contestTitle}>
                {contest == undefined ? <CircularProgress style={{ color: 'black' }} /> : contest.title}
                <Button className={classes.contestPriceBtn}>$150</Button>
              </Typography>
              <Box className={classes.profileDetails}>
                <Avatar />
                <Box className={classes.profileName}>
                  <Typography variant="h6" component="h3">
                    {contest?.userID == undefined ? (
                      <CircularProgress style={{ color: 'black' }} />
                    ) : (
                      contest.userID.username
                    )}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item>
              {loggedInUser.id != contest.userID._id && (
                <Button color="primary" component={Link} className={classes.submitBtn} to={`/contest/${id}/submit`}>
                  Submit Design
                </Button>
              )}
            </Grid>
          </Grid>
          <SubmissionTabs card={submissions} />
        </Box>
      </Box>
    </Grid>
  );
}
