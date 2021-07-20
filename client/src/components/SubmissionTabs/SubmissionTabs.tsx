import React from 'react';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import TabPanel from '@material-ui/core/Tab';
import { Typography } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import useStyles from './useStyles';

import SubmissionCard from './SubmissionCard/SubmissionCard';
import SubmissionCardProps from './SumissionCardInterface';

interface cardProps {
  card: SubmissionCardProps[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function SubmissionTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div hidden={value !== index} id={`landing-tab-panel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function SubmissionTabs({ card }: cardProps): JSX.Element {
  const [value, setValue] = React.useState(0);
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<unknown>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Grid>
      <Tabs
        indicatorColor={'primary'}
        value={value}
        aria-label="simple tabs"
        className={classes.tabRoot}
        variant="fullWidth"
        onChange={handleChange}
      >
        <Tab label="Designs (30)" />
        <Tab label="Brief" />
      </Tabs>
      <Paper elevation={1}>
        <Box p={3}>
          <SubmissionTabPanel value={value} index={0}>
            <Grid container spacing={5}>
              {card.map((data, key) => (
                <Grid item md={3} xs={12} key={key}>
                  <SubmissionCard imageSrc={data.imageSrc} title={data.title} text={data.text} />
                </Grid>
              ))}
            </Grid>
          </SubmissionTabPanel>
          <SubmissionTabPanel value={value} index={1}>
            <h1>Brief</h1>
          </SubmissionTabPanel>
        </Box>
      </Paper>
    </Grid>
  );
}

export default SubmissionTabs;
