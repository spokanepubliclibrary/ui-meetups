import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  AccordionSet,
  Checkbox,
  LoadingPane,
  PaneFooter,
  PaneHeader,
  Pane,
  Button,
  Headline,
  Row,
  Col,
  Icon,
  TextField,
  TextArea,
} from '@folio/stripes/components';
import ModalSelectFacilitator from './ModalSelectFacilitator.js';
import ModalAddMedia from './ModalAddMedia.js';
import { useMeetups } from '../../contexts/MeetupsContext.js';
import PostMeetup from './connectedComponents/PostMeetup.js';
import makeId from './helpers/makeId';
import ThumbnailTempPreSave from './ThumbnailTempPreSave.js';
import GetMediaOption from '../../settings/connectedComponents/GetMediaOption.js';
import GetSelf from './connectedComponents/GetSelf.js';
import PostMedia from './connectedComponents/PostMedia.js';

const CreatePane = ({ setIsDetailsOpen, ...props }) => {
  const history = useHistory();
  const {
    isCreatePaneOpen,
    setIsCreatePaneOpen,
    isModalFacilitator, 
    setIsModalFacilitator,
    setIsModalAddMedia,
    self,
    configMediaOption,
    setAttachmentsData,
    idForMediaCreate,
    setIdForMediaCreate,
    formDataArrayForMediaCreate,
    setFormDataArrayForMediaCreate,
    isCreatingMeetup, 
    setIsCreatingMeetup,
  } = useMeetups();

  const [postData, setPostData] = useState({});
  const [formData, setFormData] = useState({
    id: "abcd1234-abcd-4bcd-8def-0123456789ab", //placeholder (server generates UUID)
    name: "",
    location: "",
    description: "",
    facilitator: {}, 
    frequency: "",
    active: false,
    attachments: []
  });

  if (!isCreatePaneOpen) {
    return null;
  };

  const handleChange = (event) => {
    let { name, value, type, checked } = event.target;    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // *** Ready logging for reference ***
  // useEffect(() => {
  //   console.log('formData: ', JSON.stringify(formData, null, 2))
  // }, [formData]);

  const handleOpenFacilitatorModal = () => {
    setIsModalFacilitator(true);
  };

  // prepare 'facilitator' obj for saving
  const makeFacilitatorObject = (facilitatorObj) => {
    const readyFacilitatorObj = {
      id: facilitatorObj.id,
      barcode: facilitatorObj.barcode || '',
      firstName: facilitatorObj.firstName,
      lastName: facilitatorObj.lastName
    }
    return readyFacilitatorObj;
  };

  const handleAddFacilitator = (facilitatorObj) => {
    setFormData((prev) => ({
      ...prev,
      facilitator: makeFacilitatorObject(facilitatorObj)
    }));
  };

  const handleRemoveFacilitator = () => {
    setFormData((prev) => ({
      ...prev,
      facilitator: {}
    }));
  };

  const handleOpenModalMedia = () => {
    setIsModalAddMedia(true);
    // can add other things... 
  };

  const handleAddMediaAtCreate = (mediaObj) => {
    const readyMediaObj = {
      ...mediaObj,
      id: makeId(mediaObj.description),
      description: mediaObj.description.trim(),
    };
    setFormData((prevFormData) => ({
      ...prevFormData,
      attachments: [...prevFormData.attachments, readyMediaObj]
    }))
  };

  const handleRemoveUnsavedMediaCreate = (unsavedId) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      attachments: prevFormData.attachments.filter((obj) => obj.id !== unsavedId)
    }))
  };

  const handleDismissCreate = () => {
    setIdForMediaCreate(null);
    setFormDataArrayForMediaCreate(null);
    setAttachmentsData([]);
    setIsCreatePaneOpen(false);
    history.push(`/meetups`);
  };
        
  const handleCloseNewOnSuccess = (id) => {
    setIsCreatePaneOpen(false);
    history.push(`/meetups/${id}`);
  };

  const isFormDataValid = () => {
    const isNameValid = formData.name && formData.name !== '';
    const isLocationValid = formData.location && formData.location !== '';
    const isFrequencyValid = formData.frequency && formData.frequency !== '';
    const isDescriptionValid = formData.description && formData.description !== '';
    const isFacilitatorValid = formData.facilitator && Object.keys(formData.facilitator).length > 0;
    return (
      isNameValid && 
      isLocationValid &&
      isFrequencyValid && 
      isDescriptionValid && 
      isFacilitatorValid
    )
  };

  const handleSubmit = () => {
    const trimmedFormData = {
      ...formData,
      name: formData.name.trim(),
      location: formData.location.trim(),
      description: formData.description.trim(),
      frequency: formData.frequency.trim(),
      facilitator: formData.facilitator && {
        ...formData.facilitator,
        id: formData.facilitator.id ? formData.facilitator.id.trim() : '',
        firstName: formData.facilitator.firstName ? formData.facilitator.firstName.trim() : '',
        lastName: formData.facilitator.lastName ? formData.facilitator.lastName.trim() : ''
      }
    };
    const data = {
      ...trimmedFormData,
      metadata: {
        createdByUserId: self.id // self is the logged in user retreived from GetSelf
      }
    };
    console.log("data: ", JSON.stringify(data, null, 2));
    /* 
      *** TODO *** 
      When wiring up real req/res cycle, 
      uncomment the below data setter and set the is creation loading flag
    */ 
    // setPostData(data);
    // setIsCreatingMeetup(true);
  };

  const footer = (
    <PaneFooter
      renderStart={
        <Button onClick={handleDismissCreate}>
          <FormattedMessage id="meetups.cancel-button" />
        </Button>
      }
      renderEnd={
        <Button
          buttonStyle="primary"
          onClick={handleSubmit}
          disabled={!isFormDataValid()}
        >
          <FormattedMessage id="meetups.save-and-close-button" />
        </Button>
      }
    />
  );

  return (
   <>
   {/* 
    *** TODO *** 
    When using real req/res cycle, uncomment the PostMeetup and PostMedia
    invocations. 
   */}
    {/* {postData && 
      <PostMeetup 
        data={postData} 
        handleCloseNewOnSuccess={handleCloseNewOnSuccess}
      />
    } 

    {idForMediaCreate && formDataArrayForMediaCreate && (
      <PostMedia 
        context="new"
        id={idForMediaCreate}
        formDataArray={formDataArrayForMediaCreate}
        handleCloseNewOnSuccess={handleCloseNewOnSuccess}
      />
    )} */}

    {isCreatingMeetup ? (
      <LoadingPane 
        defaultWidth="fill"
        paneTitle={<FormattedMessage id="create-pane.loading-pane-submit-paneTitle" />}
      />
    ) : (
      <Pane
        dismissible
        defaultWidth='100%'
        paneTitle={<FormattedMessage id="meetups-create-pane.paneTitle" />}
        {...props}
        renderHeader={(...renderProps) => (
          <PaneHeader 
            {...renderProps}
            dismissible
            onClose={handleDismissCreate}
            paneTitle={<FormattedMessage id="meetups-create-pane.paneTitle" />}
          />
        )}
        footer={footer}
        >

      <GetMediaOption />
      <GetSelf />

    
      {isModalFacilitator && 
        <ModalSelectFacilitator 
          handleAddFacilitator={handleAddFacilitator}
      />}

      <ModalAddMedia 
        context='create'
        handleAddMediaAtCreate={handleAddMediaAtCreate}
        />
    

      <AccordionSet>
        <Accordion
          label={<FormattedMessage id="meetups.accordion.details" />}
        >
          <Row style={{ marginTop: '25px'}}>
            <Col xs={3}>            
              <TextField 
                required
                name='name'
                label={<FormattedMessage id="meetups.label.name" />}
                value={formData.name}
                onChange={handleChange}
              />
            </Col>

            <Col xs={3}>
              <TextField 
                required
                name='location'
                label={<FormattedMessage id="meetups.label.location" />}
                value={formData.location}
                onChange={handleChange}
              />
            </Col>

            <Col xs={3}>
              <TextField 
                required
                name='frequency'
                label={<FormattedMessage id="meetups.label.frequency" />}
                value={formData.frequency}
                onChange={handleChange}
              />
            </Col>

          </Row>

          <Row style={{ marginTop: '15px' }}>
            <Col xs={3}>
              <Checkbox 
                name='active'
                label={<FormattedMessage id="meetups.label.active" />}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row style={{ marginTop: '45px' }}>
            <Col xs={3}>
            <Button
              onClick={handleOpenFacilitatorModal}
            >
              <FormattedMessage id= "meetups.search-add-facilitator-button" />
            </Button>
            </Col>
          </Row>

          <Row style={{ marginTop: '15px' }}>
            <Col xs={3}>
              <Headline 
                size='medium'
                margin='medium'
                tag='h2'
              >
                <FormattedMessage id= "meetups.label.facilitator" />
              </Headline>
            </Col>
          </Row>

      {formData.facilitator.firstName && formData.facilitator.lastName ? (
            <Row>
              <Col xs={6} style={{ display: 'flex', alignItems: 'center' }}>
                <Headline 
                  size="medium"
                  margin="medium"
                  tag="p"
                >
                  {formData.facilitator.lastName}, {formData.facilitator.firstName}
                </Headline>
                <button 
                  onClick={handleRemoveFacilitator}
                  aria-label="Remove facilitator"
                  style={{ marginLeft: '10px', marginBottom: '20px'}}
                >
                  <Icon icon="trash" />
                </button>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col xs={6}>
                <Headline 
                  size="medium"
                  margin="medium"
                  tag="p"
                  style={{ color: 'red' }}
                >
                  <FormattedMessage id= "meetups.label.facilitator-required" />
                </Headline>
              </Col>
            </Row>
          )}

          <Row style={{ marginTop: '25px', marginBottom: '45px' }}>
            <Col xs={6}>
              <TextArea 
                required
                name='description'
                label={<FormattedMessage id= "meetups.label.description" />}
                value={formData.description}
                onChange={handleChange}
              />
            </Col>
          </Row>
        </Accordion>

        <Accordion
          label={<FormattedMessage id="meetups.accordion.media" />}
          style={{ marginTop: '25px' }}
        >
          <Row style={{ margin: '25px' }}>
              <Col xs={1} style={{ visibility: 'hidden' }}></Col>
              {formData.attachments.map((attachment) => (
                <Col xs={2} key={attachment.id}>
                  <ThumbnailTempPreSave 
                    key={attachment.id}
                    context='create'
                    handleRemoveUnsavedMediaCreate={handleRemoveUnsavedMediaCreate}
                    mediaId={attachment.id}
                    src={attachment.filePreviewUrl}
                    alt={attachment.description}
                    imageDescription={attachment.description}
                  />
                </Col>
              ))}
          </Row>

          <Row style={{ marginBottom:'500px'}}>
          {configMediaOption === false ? (
              <Row style={{ marginLeft: '10px' }}>
                <Col xs={12}>
                <p>Media option is disabled.</p>
                </Col>
              </Row>
            ) : (
              <Col xs={6}>
                <Button onClick={handleOpenModalMedia}>
                  <FormattedMessage id="meetups.add-media-button" />
                </Button>
            </Col>
          )}
          </Row>
        </Accordion>
      </AccordionSet>
    </Pane>
    )}
   </>
  );
};

export default CreatePane; 