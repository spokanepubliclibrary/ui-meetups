import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  AccordionSet,
  Checkbox,
  LoadingPane,
  MetaSection,
  PaneFooter,
  PaneHeader,
  Pane,
  Button,
  Headline,
  Row,
  Col,
  Icon,
  TextField,
  TextArea
} from '@folio/stripes/components';
import tempData from '../../data/meetupsList';
import sampleImage from '../../data/images/sampleImage.jpg';
import GetMediaOption from '../../settings/connectedComponents/GetMediaOption.js';
import GetMedia from './connectedComponents/GetMedia.js';
import GetDetails from './connectedComponents/GetDetails.js';
import GetName from './connectedComponents/GetName.js';
import GetSelf from './connectedComponents/GetSelf.js';
import PutMeetup from './connectedComponents/PutMeetup.js';
import PostMedia from './connectedComponents/PostMedia.js';
import ModalSelectFacilitator from './ModalSelectFacilitator.js';
import ModalAddMedia from './ModalAddMedia.js';
import makeId from './helpers/makeId';
import Thumbnail from './Thumbnail';
import ThumbnailSkeleton from './ThumbnailSkeleton';
import ThumbnailMarkRemoval from './ThumbnailMarkRemoval'; 
import ThumbnailTempPreSave from './ThumbnailTempPreSave.js';
import { useMeetups } from '../../contexts/MeetupsContext.js';


const EditPane = ({ setIsDetailsOpen, ...props }) => {
  const { id } = useParams();
  const history = useHistory();
  const {
    setIsEditPaneOpen,
    setIsDetailsPaneOpen,
    isModalFacilitator, 
    setIsModalFacilitator,
    setIsModalAddMedia,
    configMediaOption,
    isImageArrayLoading,
    setIsImageArrayLoading, // set isImageArrayLoading to true
    singleMeetup, // response data for a meetup record
    self,
    setAttachmentsData, // <PutMeetup /> passes setAttachmentsData to PostMedia
    isLoadingDetails,
    setIsLoadingDetails,
    isUpdatingMeetup, 
    idForMediaCreate,
    setIdForMediaCreate,
    formDataArrayForMediaCreate, 
    setFormDataArrayForMediaCreate,
  } = useMeetups();

  /*
   *** TODO ***
   In real req/res cycle use, uncomment the below useEffect
  */ 
  // useEffect(() => {
  //   if (id) {
  //     setIsLoadingDetails(true);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [id]);

  const [mediaArray, setMediaArray] = useState([]);
  const [mediaSrc, setMediaSrc] = useState({});
  const [loadingStatus, setLoadingStatus] = useState({});
  const [unsavedMediaArray, setUnsavedMediaArray] = useState([]); 

  // Init as sectioned off from response record data for Metasection component
  const [renderMetadata, setRenderMetadata] = useState({
    createdDate: "",
    createdByUserId: "",
    updatedDate: "",
    updatedByUserId: ""
  });
  // Values from GetName response for local UI render
  const [metadataCreatedByName, setMetadataCreatedByName] = useState({
    firstName: "",
    lastName: "",
  });
  // Values from GetName response for local UI render
  const [updatedByForRender, setUpdatedByForRender] = useState({
    firstName: '',
    lastName: ''
  });
  const [putData, setPutData] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    facilitator: {
      id: "",
      firstName: "",
      lastName: "",
      barcode: "",
    }, 
    frequency: "",
    active: false,
    attachments: []
  });

  const defaultFormData = {
    name: "",
    location: "",
    description: "",
    facilitator: {
      id: "",
      firstName: "",
      lastName: "",  
      barcode: "",
    }, 
    frequency: "",
    active: false,
    attachments: []
  };

  // *** For temp build / example only ***
  const mockAttachments = [
    {
      id: 'sample-1',
      contentType: 'image/jpeg',
      description: 'Local sample image',
      url: sampleImage,
    }
  ];

  // *** For temp build only ***
  useEffect(() => {
    // map and find record via 'id' at tempData
    if (id) {
      const record = tempData.find((obj) => obj.id === id);
      if (record) {
        setFormData({
          name: record.name || "",
          location: record.location || "",
          description: record.description || "",
          facilitator: {
            id: record.facilitator.id || "",
            firstName: record.facilitator.firstName || "",
            lastName: record.facilitator.lastName || ""
          } || {},
          frequency: record.frequency || "",
          active: record.active || false,
          attachments: record.attachments
        });
        /* 
          setRenderMetadata is for rendering MetaSection UI, not for form setting.
          Note that updatedByUserId is set in handleSubmit block.
        */ 
        setRenderMetadata({
          createdDate: record.metadata.createdDate || "",
          createdByUserId: record.metadata.createdByUserId || "",
          updatedDate: record.metadata.updatedDate || "",
          updatedByUserId: record.metadata.updatedByUserId || ""
        });
        // pass in mock attachment for media array
        setMediaArray(mockAttachments);
      };
    };
  }, [id]);


  /*
    *** TODO ***
    When using real req/res cycle uncomment
    and utilize the below:
    - [A] data memoization 
    - [B] useEffect for setting form data
    - [C] useEffect for setting metadata to be rendered
  */
  // *** [A] ***
  // const initialFormData = useMemo(() => {
  //   if (!singleMeetup || Object.keys(singleMeetup).length === 0) {
  //     return defaultFormData;
  //   };
  //   return {
  //     name: singleMeetup?.name || '',
  //     location: singleMeetup?.location || '',
  //     description: singleMeetup?.description || '',
  //     facilitator: {
  //       id: singleMeetup?.facilitator.id || '',
  //       firstName: singleMeetup?.facilitator.firstName || '',
  //       lastName: singleMeetup?.facilitator.lastName || '',
  //       barcode: singleMeetup?.facilitator.barcode || ''
  //     }, 
  //     frequency: singleMeetup?.frequency || '',
  //     active: singleMeetup?.active || false,
  //     attachments: singleMeetup?.attachments || []
  //   }
  // }, [singleMeetup]);

  // *** [B] *** 
  // useEffect(() => {
  //   setFormData(initialFormData)
  // }, [initialFormData]);

  // *** [C] ***
  // useEffect(() => {
  //   /* 
  //     setRenderMetadata is for rendering MetaSection UI, not for form setting.
  //     Note that updatedByUserId is set in handleSubmit block.
  //   */ 
  //   setRenderMetadata({
  //     createdDate: singleMeetup?.metadata?.createdDate || "",
  //     createdByUserId: singleMeetup?.metadata?.createdByUserId || "",
  //     updatedDate: singleMeetup?.metadata?.updatedDate || "",
  //     updatedByUserId: singleMeetup?.metadata?.updatedByUserId || ""
  //   });
  // }, [singleMeetup]);

  /* 
    *** TODO ***
    In the below useEffect for setting mediaArray and loading status:
    Refactor from 'tempDataDetails.attachments' to 'attachments' 
    after moving to 'singleMeetup'
  */
  useEffect(() => {
    if (formData.attachments && formData.attachments.length > 0) {
      const images = formData.attachments.filter((att) => att.contentType.startsWith('image'));
      setMediaArray(images);
      const newLoadingStatus = images.reduce((acc, att) => ({
        ...acc,
        [att.id]: loadingStatus[att.id] !== false // retain prev load status
        ? true // start as loading if not already set
        : false
      }), {});
      setLoadingStatus(newLoadingStatus);
      setIsImageArrayLoading(true);
    }
  }, [formData.attachments])

  const handleChange = ({ target: { name, type, checked, value } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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

  const handleDismissEdit = () => {
    setIsEditPaneOpen(false);
    history.push(`/meetups`);
  };

  const handleCloseEdit = () => {
    setIdForMediaCreate(null);
    setFormDataArrayForMediaCreate(null);
    setIsEditPaneOpen(false);
    setIsDetailsPaneOpen(true);
    history.push(`/meetups/${id}`)
  };

  const handleOpenModalMedia = () => {
    setIsModalAddMedia(true);
  };

  const handleAddMedia = (mediaObj) => {
    const readyMediaObj = {
      ...mediaObj,
      id: makeId(mediaObj.description),
      description: mediaObj.description.trim()
      
    };
    setUnsavedMediaArray((prev) => [
      ...prev,
      readyMediaObj
    ]);
  };

  const handleRemoveUnsavedMedia = (unsavedId) => {
    const updatedUnsavedMediaArray = unsavedMediaArray.filter((obj) => obj.id !== unsavedId)
    setUnsavedMediaArray(updatedUnsavedMediaArray);
  };

  const handleMediaUrl = (mediaUrl, attachmentId) => {
    setMediaSrc(prev => ({ ...prev, [attachmentId]: mediaUrl }));
    setLoadingStatus(prev => ({ ...prev, [attachmentId]: false }));
  };

  // *** For temp development use only ***
  // When moving to singleMeetup and real req/res cycle 
  // simply remove this useEffect
  useEffect(() => {
    handleMediaUrl(sampleImage, 'sample-1')
  },[formData.attachments]);

  const handleGetCreatedByName = (refinedRecord) => {
    setMetadataCreatedByName({
      firstName: refinedRecord.firstName,
      lastName: refinedRecord.lastName
    });
  };

  const handleGetUpdatedByName = (updatedByNameObj) => {
    if (updatedByNameObj) {
      setUpdatedByForRender({
        firstName: updatedByNameObj.firstName,
        lastName: updatedByNameObj.lastName
      })
    } else {
      setUpdatedByForRender({
        firstName: '',
        lastName: ''
      })
    }
  };

  const handleMarkForRemoval = (mediaId) => {
    const updatedAttachments = formData.attachments.map((attachment) =>
      attachment.id === mediaId
        ? { ...attachment, toBeRemoved: true }
        : attachment
    );
    setFormData((prevState) => ({
      ...prevState,
      attachments: updatedAttachments,
    }));
  };

  const handleUndo = (mediaId) => {
    const updatedAttachments = formData.attachments.map((attachment) => {
      if(attachment.id === mediaId) {
        const { toBeRemoved, ...rest } = attachment;
        return { ...rest };
      }
      return attachment
    });
    setFormData((prevState) => ({
      ...prevState,
      attachments: updatedAttachments,
    }));
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
      id: id,
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
        updatedByUserId: self.id // self is the logged in user retreived from GetSelf
      }
    };
    const readyToBeSavedAttachments = unsavedMediaArray.map((mediaObj) => {
      const { id, file, description, contentType } = mediaObj; 
      return {
        contentType: contentType,
        description: description,
        id: id,
        file: file,
      }
    });

    console.log("data: ", JSON.stringify(data, null, 2));
    console.log("readyToBeSavedAttachments: ", JSON.stringify(readyToBeSavedAttachments, null, 2));

    /*
      *** TODO ***
      When wiring up real req/res cycle,
      uncomment the below setters for attachments data and PUT data
    */
    // setAttachmentsData(readyToBeSavedAttachments);
    // setPutData(data);
  };

  // *** Ready logging for reference ***
  // useEffect(() => {
  //   console.log('formData: ', JSON.stringify(formData, null, 2))
  // }, [formData]);

  const footer = (
    <PaneFooter
      renderStart={
        <Button onClick={handleDismissEdit}>
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
     <GetMediaOption />

     <GetSelf />

     {/* {id && <GetDetails id={id}/>} */}

     {id && putData && (
      <PutMeetup 
        id={id} 
        data={putData} 
        handleCloseEdit={handleCloseEdit}/>
      )}
     {idForMediaCreate && formDataArrayForMediaCreate && (
        <PostMedia
          id={idForMediaCreate}
          formDataArray={formDataArrayForMediaCreate}
          handleCloseEdit={handleCloseEdit}
          context="edit"
        />
      )}
     {renderMetadata.createdByUserId && 
        <GetName 
          uuid={renderMetadata.createdByUserId}
          handleGetCreatedByName={handleGetCreatedByName}
          context="createdByName"
        />}

      {renderMetadata.updatedByUserId && (
        <GetName 
          uuid={renderMetadata.updatedByUserId}
          handleGetUpdatedByName={handleGetUpdatedByName}
          context="updatedByName"
        />
      )}

    {isLoadingDetails ? (
      <LoadingPane 
        defaultWidth='fill'
        paneTitle={<FormattedMessage id="edit-pane.loading-pane-details-edit-paneTitle" />}
      />
    ) : isUpdatingMeetup ? (
      <LoadingPane 
        defaultWidth='fill'
        paneTitle={<FormattedMessage id="edit-pane.loading-pane-submit-update-paneTitle" />}
      />
    ) : (
      <Pane
        defaultWidth='fill'
        paneTitle={<FormattedMessage id="meetups-edit-pane.paneTitle" />}
        {...props}
        renderHeader={(...renderProps) => (
          <PaneHeader 
            {...renderProps}
            dismissible
            onClose={handleDismissEdit}
            paneTitle={<FormattedMessage id="meetups-edit-pane.paneTitle" />}
          />
        )}
        footer={footer}
      >

      {isModalFacilitator && 
        <ModalSelectFacilitator 
          handleAddFacilitator={handleAddFacilitator}
      />}

    <ModalAddMedia 
      context='edit'
      handleAddMedia={handleAddMedia}
    />

     <AccordionSet>
       <MetaSection
          headingLevel={4}
          useAccordion
          showUserLink
          createdDate={renderMetadata.createdDate || null}
          lastUpdatedDate={renderMetadata.updatedDate || null}
          /*
            Note that the MetaSection component automatically maps the `createdBy` 
            and the `lastUpdatedBy` object from props
            to the {source} placeholder in the translation string. In the translation file (en_US.json),
            you'll find an entry: "stripes-components.metaSection.source": "{source}"
          */
          createdBy={{
            id: renderMetadata.createdByUserId,
            personal: {
              firstName: metadataCreatedByName.firstName,
              lastName: metadataCreatedByName.lastName
            }
          }}
          lastUpdatedBy={{
            id: renderMetadata.updatedByUserId,
            personal: {
              firstName: updatedByForRender.firstName,
              lastName: updatedByForRender.lastName,
            }
          }}
        />


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
              checked={formData.active}
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

      {formData.facilitator && formData.facilitator.lastName ? (
          <Row>
            <Col xs={6} style={{ display: 'flex', alignItems: 'center' }}>
              <Headline 
                size="medium"
                margin="medium"
                tag="p"
              >
                {formData.facilitator.lastName}
                {formData.facilitator.firstName ? 
                `, ${formData.facilitator.firstName}` : ''}
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
        style={{ marginTop: '25px'}}
      >

      <div>
        {mediaArray.map((attachment) => (
          <GetMedia 
            context='thumbnail'
            contentType={attachment.contentType}
            key={attachment.id}
            id={id}
            imageId={attachment.id}
            mediaHandler={(mediaUrl) => handleMediaUrl(mediaUrl, attachment.id)}
          />
        ))}
      </div>   


              <Row style={{ margin: '25px' }}>
                <Col xs={1} style={{ visibility: 'hidden' }}></Col>
                {mediaArray.slice(0, 5).map((attachment) => (
                  <Col xs={2} key={attachment.id} style={{ minHeight: '200px' }}>
                  {loadingStatus[attachment.id] && isImageArrayLoading ? <ThumbnailSkeleton />
                  : attachment.toBeRemoved ? (
                    <ThumbnailMarkRemoval 
                      undoId={attachment.id} 
                      handleUndo={handleUndo}
                      />
                  ) : <Thumbnail
                      key={attachment.id}
                      handleMarkForRemoval={handleMarkForRemoval}
                      mediaId={attachment.id}
                      src={mediaSrc[attachment.id]}
                      alt={attachment.description}
                      imageDescription={attachment.description}
                    />
                  }
                  </Col>
                ))}
              </Row>
              {/* Can map slice(5, 10) for another row of images... */}

      <Row style={{ margin: '25px' }}>
        <Col xs={1} style={{ visibility: 'hidden' }}></Col>
          {unsavedMediaArray.map((attachment) => (
            <Col xs={2} key={attachment.id}>
              <ThumbnailTempPreSave 
                contentType={attachment.contentType}
                handleRemoveUnsavedMedia={handleRemoveUnsavedMedia}
                key={attachment.id}
                mediaId={attachment.id}
                src={attachment.filePreviewUrl}
                alt={attachment.description}
                imageDescription={attachment.description}
              />
            </Col>
          ))}
        </Row>

        <Row style={{ marginBottom:'500px'}}>
          {configMediaOption === false ? null : (
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

export default EditPane; 