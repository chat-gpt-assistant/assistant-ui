import React from 'react';
import { CssBaseline, Grid } from '@mui/material';
import SidePanel from './components/SidePanel';
import MainContent from './components/MainContent';

function App() {
  return (
    <>
      <CssBaseline/>
      <Grid container sx={{height: '100vh'}}>
        <Grid item xs={12} sm={4} md={3} sx={{overflow: 'auto'}}>
          <SidePanel/>
        </Grid>
        <Grid item xs={12} sm={8} md={9} sx={{display: 'flex', flexDirection: 'column'}}>
          <MainContent/>
        </Grid>
      </Grid>
    </>
  );
}

export default App;
