import React from 'react';
import { stripesConnect } from '@folio/stripes/core';
import { getHeaderWithCredentials } from '@folio/stripes/util';

/*
  GetMedia is responsible for fetching media from the OKAPI service associated 
  with the meetups module. It handles both thumbnail and original image requests.
*/
class GetMedia extends React.Component {
  constructor(props) {
    super(props);
    /*
      Extract OKAPI configuration from the provided stripes prop.
      This gives us the base URL needed to construct our API endpoints.
    */
    const { stripes } = this.props;
    const { okapi } = stripes;
    this.okapiURL = okapi.url;
  };

  componentDidMount() {
    this.GetMedia()
  };

  componentDidUpdate(prevProps) {
    if(this.props.id !== prevProps.id || this.props.imageId !== prevProps.imageId) {
      this.GetMedia()
    }
  };

  /*
   GetMedia is an asynchronous function that performs the media fetching.
   It uses the getHeaderWithCredentials utility to create headers that include
   necessary authentication and session credentials for OKAPI requests.
  */
  GetMedia = async () => {
    const { id, imageId, mediaHandler, context } = this.props;
    const { stripes } = this.props;
    // Refactor headers to include credentials from the OKAPI config
    const headersWithCredentials = getHeaderWithCredentials(stripes.okapi);
    const { headers } = headersWithCredentials
    // *** Ready logging for reference ***
    // console.log("headersWithCredentials: ", JSON.stringify(headersWithCredentials, null, 2))
    // console.log("this.okapiURL: ", this.okapiURL)

    if (context === 'thumbnail') {
      try {
        // Construct the URL for fetching the thumbnail version of the media
        const response = await fetch(`${this.okapiURL}/meetups/${id}/media/${imageId}?format=thumbnail`, {
          method: 'GET',
          headers: {
            ...headers
          }
        });
        if(response.status === 200) {
          const blob = await response.blob();
          const mediaUrl = URL.createObjectURL(blob)
          this.props.mediaHandler(mediaUrl, this.props.imageId)
        } 
      } catch (error) {
        console.error('@GetMedia thumbnail context - error: ', error)
      }
    } else if (context === 'original') {
      try {
        // Construct the URL for fetching the original version of the media
        const response = await fetch(`${this.okapiURL}/meetups/${id}/media/${imageId}`, {
          method: 'GET',
          headers: {
            ...headers
          }
        });
        if(response.status === 200) {
          const blob = await response.blob();
          const mediaUrl = URL.createObjectURL(blob)
          this.props.handleDataResponse(mediaUrl)
          // this.props.mediaHandler(mediaUrl, this.props.imageId)
        } 
      } catch (error) {
        console.error('@GetMedia - error: ', error)
      }
    } else {
      console.log("@GetMedia - no context provided")
    }
  };

  render() {
    return <></>
  }
};

export default stripesConnect(GetMedia, '@spokane-folio/meetups')