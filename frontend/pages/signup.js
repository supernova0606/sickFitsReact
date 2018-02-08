import { Component } from 'react';
import withData from '../lib/withData';
import Signup from '../components/Signup';
import Signin from '../components/Signin';
import Page from '../components/Page';
import RequestReset from '../components/RequestReset';

const SignUpPage = () => (
  <Page>
    <p>I'm the Sign Up url!</p>
    <Signup />
    {/* <Signin /> */}
    <RequestReset />
  </Page>
);

export default withData(SignUpPage);
