import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import MediaPaneset from './MediaPaneset.js';

export default class MeetupsSettings extends React.Component {
  pages = [
    {
      route: 'allow-media',
      label: <FormattedMessage id="settings.media" />,
      component: (props) => <MediaPaneset {...props}/>,
    }
  ];

  render() {
    return (
      <Settings {...this.props} pages={this.pages} paneTitle="meetups" />
    );
  };
};