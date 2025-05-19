import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { MeetupContext } from '../../../contexts/MeetupsContext.js';

class PostMeetup extends React.Component {
  static contextType = MeetupContext;

  static manifest = Object.freeze({
    meetup: {
      type: 'okapi',
      records: 'meetups',
      POST: {
        path: 'meetups',
        // path: 'test_invalid_endpoint',
      },
      accumulate: true,
    },
  });

  // *** Ready logging for reference ***
  // console.log("manifest _resourceData:", JSON.stringify(_resourceData, null, 2));

  static propTypes = {
    data: PropTypes.object,
    mutator: PropTypes.shape({
      meetup: PropTypes.shape({
        POST: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.createMeetup(this.props.data);
    }
  };

  createMeetup = (data) => {
    console.log("@PostMeetup - data: ", JSON.stringify(data, null, 2));
    // handle create meetup w/ attachments
    if (data.attachments && data.attachments.length > 0) {
      const attachmentsArray = data.attachments.map(att => ({ ...att }) );
      const { attachments, ...preppedData } = data; // extract 'attachments' from 'data'

      // attachments key always required at Pydantic validation, send empty list.
      // PostMedia will utilize attachmentsArray to fill the list
      preppedData.attachments = [];
      this.props.mutator.meetup
        .POST(preppedData)
        .then((response) => {
          const id = response.data.id;
          // provide 'id' and 'attachmentsArray' to PostMedia
          this.context.setIdForMediaCreate(id);
          this.context.setFormDataArrayForMediaCreate(attachmentsArray);
          const defaultQuery = ''; // server response defaults to show most recent top 1000
          this.context.setQueryString(defaultQuery);
          return response;
        })
        .catch((error) => {
          console.error(
            '@createMeetup - WITH Attachments - Error occurred:',
            error
          );
        });

      // handle create meetup w/out attachments
    } else if (data.attachments && data.attachments.length === 0) {
      this.props.mutator.meetup
        .POST(data)
        .then((response) => {
          const id = response.data.id;
          this.context.setIdForMediaCreate(null);
          this.context.setFormDataArrayForMediaCreate(null);
          this.context.setMeetupsList([]);
          // this.context.setMode('createMode');
          const defaultQuery = ''; // server response defaults to show most recent n
          this.context.setQueryString(defaultQuery);
          this.context.setIsCreatingMeetup(false);
          this.props.handleCloseNewOnSuccess(id);
          return response;
        })
        .catch((error) => {
          console.error(
            '@createMeetup - NO Attachments - Error occurred:',
            error.message
          );
          console.error('The error object: ', JSON.stringify(error, null, 2));
        });
    }
  };

  render() {
    return <></>;
  };
};

PostMeetup.contextType = MeetupContext;
PostMeetup.propTypes = {
  handleCloseNewOnSuccess: PropTypes.func.isRequired,
};

export default stripesConnect(PostMeetup, '@spokane-folio/meetups');