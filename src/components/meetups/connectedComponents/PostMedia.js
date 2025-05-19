import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
/*
  Stripes-util library getHeaderWithCredentials reference.
  You can view some other helpful utilities at stripes-util as well. 
  https://github.com/folio-org/stripes-util/blob/74e6a4b06c40ff58cb557935699db2e788d014b4/lib/getHeaderWithCredentials.js#L34
*/
import { getHeaderWithCredentials } from '@folio/stripes/util';
import { MeetupContext } from '../../../contexts/MeetupsContext';


/*
  CreateMedia is responsible for uploading media files to the relevant OKAPI service
  for the meetups module. It handles preparing the request by setting up headers with 
  the appropriate credentials, and it manipulates those headers to allow the browser
  to automatically set the proper "multipart/form-data" content type when sending 
  binary media data.
*/
class CreateMedia extends React.Component {
  static contextType = MeetupContext;

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
    this.createMedia(this.props.id, this.props.formDataArray);
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.id !== prevProps.id &&
      this.props.formDataArray !== prevProps.formDataArray
    ) {
      this.createMedia(this.props.id, this.props.formDataArray);
    }
  };

  /*
    createMedia function handles the media upload process.
    It constructs the appropriate FormData for each attachment, removes the 
    OKAPI default "Content-Type" header to let the browser set it correctly 
    and sends each media file via POST request. 
  */
  createMedia = async (id, formDataArray) => {    
    const { stripes } = this.props;
    // Retrieve headers that include necessary OKAPI credentials
    const headersWithCredentials = getHeaderWithCredentials(stripes.okapi);
    // Clone the headers so we can modify them
    const headers = { ...headersWithCredentials.headers };
    /* 
      Remove the "Content-Type" header because:
      - The default header may be set to "application/json".
      - When posting FormData, the browser automatically sets the "Content-Type" for multipart/form-data, which is required for media uploads.
    */   
    delete headers['Content-Type'];

    const readyAttachmentsArray = formDataArray.map((att) => {
      const metadata = {
        id: att.id,
        description: att.description,
        contentType: att.contentType,
      };
      const formData = new FormData();
      formData.append('metadata', JSON.stringify(metadata));
      formData.append('file', att.file)

      return formData;
    });

    try{
      const results = [];
      /* 
        Iterate through each FormData instance to send media attachments ensuring
        that each attachment is posted individually
      */ 
      for(const attachment of readyAttachmentsArray) {
        const response = await fetch(`${this.okapiURL}/meetups/${id}/media`, {
          method: 'POST',
          headers: {
            ...headers,
          },
          body: attachment,
        });
        results.push(response)
      };

      const allSuccess = results.every(response => response.status === 201);
      if (!allSuccess) {
        console.error('one or more attachments failed to save')
        return;
      };

      if (this.props.context === 'edit') {
        // console.log('Success - media upload - in EDIT context');
        this.context.setIdForMediaCreate(null);
        this.context.setFormDataArrayForMediaCreate(null);
        this.context.setAttachmentsData([]);
        this.context.setMeetupsList([]);
        this.context.setUseGetList(false);
        this.context.setIsLoadingDetails(false);
        this.context.setIsUpdatingMeetup(false);
        this.props.handleCloseEdit();
        
      } else if (this.props.context === 'new') {
        // console.log('Success - media upload - in NEW context');
        this.context.setIdForMediaCreate(null);
        this.context.setFormDataArrayForMediaCreate(null);
        this.context.setAttachmentsData([]);
        this.context.setMeetupsList([]);
        this.context.setIsCreatingMeetup(false);
        this.props.handleCloseNewOnSuccess(id); //initialized at CreatePane
      };
    } catch (error) {
      this.context.setUseGetList(false);
      console.error('@CreateMedia - in CATCH - error uploading files: ', error);
    };
  };

  render() {
    return <></>;
  };
};

CreateMedia.contextType = MeetupContext;
CreateMedia.propTypes = {
  stripes: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  formDataArray: PropTypes.arrayOf(
    PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    contentType: PropTypes.string.isRequired,
    file: PropTypes.instanceOf(File).isRequired,
   })
  ).isRequired,
  handleCloseEdit: PropTypes.func,
  handleCloseNewOnSuccess: PropTypes.func,
  context: PropTypes.shape({
    setIdForMediaCreate: PropTypes.func.isRequired,
    setFormDataArrayForMediaCreate: PropTypes.func.isRequired,
    setAttachmentsData: PropTypes.func.isRequired,
    setMeetupsList: PropTypes.func.isRequired,
    setUseGetList: PropTypes.func.isRequired,
  }).isRequired,
};

export default stripesConnect(CreateMedia, '@spokane-folio/meetups');