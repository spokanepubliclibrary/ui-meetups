import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import {  FormattedMessage, useIntl } from 'react-intl';
/* 
  Note that the configuration is stored as a single, monolithic JSON blob.
  This means we update the entire record rather than individual keys. 
  
  This approach is somewhat inspired by FOLIO's legacy mod-configurations. However, for developing a new application, it's recommended that configurations be managed within the application itself rather than relying on mod-configurations, which is deprecated, or mod-settings, which is intended for secure global and per-user settings for FOLIO. 

  To add additional configurations: 
  The set up follows a pre-instantiated key-value configuration pattern. Essentially, we
  store configurations as a single JSON blob for each key (like 'media-option') that is 
  created on the server side (mod-meetups). The UI (ui-meetups) is designed solely to 
  perform GET and PUT operations on these pre-existing entries rather than dynamically 
  generating new settings. Additional configurations should first be instantiated on the 
  server side, and then the UI can be refactored to handle them in the same way as the
  existing 'media-option'. 
*/

class PutMediaOption extends React.Component {
  static manifest = Object.freeze({
    mediaOption: {
      type: 'okapi',
      path: "meetups/configurations/media-option", 
      PUT: {
        path: "meetups/configurations/media-option", 
      },
      accumulate: true,
    },
  });

  static propTypes = {
    data: PropTypes.string,
    mutator: PropTypes.shape({
      mediaOption: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    context: PropTypes.string.isRequired,
  };

  componentDidMount() {
    if (this.props.data) {
      this.updateMediaOption(this.props.data);
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.updateMediaOption(this.props.data);
    }
  };

  updateMediaOption = (data) => {
    this.props.mutator.mediaOption
      .PUT(data)
      .then(() => {
        // console.log('@updateMediaOption update successful');
        this.props.setShowBanner({
          show: true,
          type: 'success',
          message: 'Media option successfully updated.' // use as formatted message here
        })
      })
      .catch((error) => {
        console.error('@updateMediaOption error updating: ', error);
        this.props.setShowBanner({
          show: true,
          type: 'error',
          message: `Update failed: ${error.message}` || 'Update failed: unknown error' // use as formatted message here
        })
      });
  };

  render() {
    return <></>;
  }
}

export default stripesConnect(PutMediaOption, '@spokane-folio/meetups');