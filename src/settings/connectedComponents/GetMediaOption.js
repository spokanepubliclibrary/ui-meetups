import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { MeetupContext } from '../../contexts/MeetupsContext';
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

class GetMediaOption extends React.Component {
  static contextType = MeetupContext;
  static manifest = Object.freeze({
    mediaOption: {
      type: 'okapi',
      path: 'meetups/configurations/media-option',
      records: 'data'
    },
  });

  static propTypes = {
    mediaOption: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    resources: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.fetchMediaOption();
  };

  componentDidUpdate() {
    this.fetchMediaOption();
  };

  fetchMediaOption() {
    const res = this.props.resources.mediaOption;
    // console.log("full response: ", JSON.stringify(res, null, 2))

    if (!res || !res.hasLoaded || res.failed) {
      return
    }

    const record = res.records?.[0];
    if (!record) {     
      return
    }

    let { mediaOption } = record.value; 

    if (typeof mediaOption === 'string') {
      mediaOption = mediaOption.toLowerCase() === 'true';
    }

    if (mediaOption !== this.context.configMediaOption) {
      this.context.setConfigMediaOption(mediaOption)
    }
  };

  render() {
    return <></>;
  };
};

GetMediaOption.contextType = MeetupContext;

export default stripesConnect(
  GetMediaOption,
  '@spokane-folio/meetups'
);