import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
// import { useStripes } from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  LoadingPane,
  MetaSection,
  Pane,
  Button,
  Row,
  Col,
  PaneHeader,
  Label
} from '@folio/stripes/components';
import tempData from '../../data/meetupsList';
import sampleImage from '../../data/images/sampleImage.jpg';
import GetMedia from './connectedComponents/GetMedia';
import GetDetails from './connectedComponents/GetDetails.js';
import GetName from './connectedComponents/GetName.js';
import { useMeetups } from '../../contexts/MeetupsContext.js';
import ThumbnailSkeleton from './ThumbnailSkeleton.js';
import Thumbnail from './Thumbnail.js';
import ModalViewMedia from './ModalViewMedia';


const DetailsPane = ({ ...props }) => {
  const { id } = useParams();
  const history = useHistory();
  // const stripes = useStripes();
  const {
    setIsDetailsPaneOpen,
    setIsEditPaneOpen,
    isImageArrayLoading,
    setIsImageArrayLoading, 
    isModalViewImage,
    setIsModalViewImage,
    singleMeetup, // response data a meetup record  
    isLoadingDetails,
    setIsLoadingDetails
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

  const [loadingStatus, setLoadingStatus] = useState({});
  const [mediaSrc, setMediaSrc] = useState({});
  const [mediaArray, setMediaArray] = useState([]);
  const [modalViewImageData, setModalViewImageData] = useState({});
  // Init as sectioned off from response record data for Metasection component:
  const [renderMetadata, setRenderMetadata] = useState({
    createdDate: "",
    createdByUserId: "",
    updatedDate: "",
    updatedByUserId: ""
  });
  // Values from GetName response for local UI render:
  const [metadataCreatedByName, setMetadataCreatedByName] = useState({
    firstName: "",
    lastName: "",
  });
  // Values from GetName response for local UI render
  const [updatedByForRender, setUpdatedByForRender] = useState({
    firstName: '',
    lastName: ''
  });

 
  /*
   *** TODO *** 
   Move to obj destructuring assignment once using real req/res data.
   e.g. const { name, location, etc.. } = singleMeetup; <-- singleMeetup is global 
   context var with setter setSingleMeetup, which is invoked at GetDetails response block.
  */  
  // const { 
  //   name = "",
  //   location = "",
  //   description = "",
  //   facilitator = {},
  //   frequency = "",
  //   active = false,
  //   attachments = [],
  //   metadata = {}
  // } = singleMeetup; 

  // *** START temp data blocks ***
  const [tempDataDetails, setTempDataDetails] = useState({
    name: "",
    location: "",
    description: "",
    facilitator: {
      id: "",
      firstName: "",
      lastName: ""
    },
    frequency: "",
    active: false,
    attachments: []
  });

  const mockAttachments = [
    {
      id: 'sample-1',
      contentType: 'image/jpeg',
      description: 'Local sample image',
      url: sampleImage,
    }
  ];

  useEffect(() => {
    // map and find record via 'id' at tempData
    if (id) {
      const record = tempData.find((obj) => obj.id === id);
      if (record) {
        setTempDataDetails({
          name: record.name,
          location:record.location,
          description: record.description,
          facilitator: {
            id: record.facilitator.id,
            firstName: record.facilitator.firstName,
            lastName: record.facilitator.lastName
          },
          frequency: record.frequency,
          active: record.active,
          metadata: {
            createdByUserId: record.metadata.createdByUserId,
            createdDate: record.metadata.createdDate
          }
        });
        // for UI render of MetaSection
        setRenderMetadata({
          createdDate: record.metadata.createdDate || "",
          createdByUserId: record.metadata.createdByUserId || "",
          updatedDate: record.metadata.updatedDate || "",
          updatedByUserId: record.metadata.updatedByUserId || ""
        });
        // pass in mock attachment for media array
        setMediaArray(mockAttachments) 
      };
    };
  }, [id]);

  // *** END temp data blocks ***

  // useEffect(() => {
  //   setRenderMetadata({
  //     createdDate: metadata.createdDate ?? '',
  //     createdByUserId: metadata.createdByUserId ?? '',
  //     updatedDate: metadata.updatedDate ?? '',
  //     updatedByUserId: metadata.updatedByUserId ?? ''
  //   });
  //   setMediaArray(attachments) 
  // }, [singleMeetup]);

  /* 
    *** TODO ***
    In the below useEffect for setting mediaArray and loading status:
    Refactor from 'tempDataDetails.attachments' to 'attachments' 
    after moving to 'singleMeetup'
  */
  useEffect(() => {
    if(tempDataDetails.attachments && tempDataDetails.attachments.length > 0) {
      const medias = tempDataDetails.attachments.filter((att) => att.contentType.startsWith('image'));
      setMediaArray(medias);

      const newLoadingStatus = medias.reduce((acc, att) => ({
        ...acc,
        [att.id]: true  // start all media as loading true
      }), {});
      setLoadingStatus(newLoadingStatus);
      setIsImageArrayLoading(true);
    };
  }, [tempDataDetails.attachments]);

  // helper for set media source and loading status
  const handleMediaUrl = (mediaUrl, attachmentId) => {
    setMediaSrc(prev => ({ ...prev, [attachmentId]: mediaUrl }));
    setLoadingStatus(prev => ({ ...prev, [attachmentId]: false }));
  };

  // *** For temp development use only ***
  // When moving to singleMeetup and wiring real req/res cycle 
  // simply remove this useEffect
  useEffect(() => {
    handleMediaUrl(sampleImage, 'sample-1')
  },[tempDataDetails.attachments]);

  useEffect(() => {
    const allImagesLoaded = Object.values(loadingStatus).every(status => !status);
    if (allImagesLoaded) {
      setIsImageArrayLoading(false);
    }
  }, [loadingStatus, setIsImageArrayLoading]);

  const handleImageClick = (imageObj) => {
    setModalViewImageData(imageObj)
    setIsModalViewImage(true);
  };

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

  const handleDismissDetails = () => {
    setIsDetailsPaneOpen(false);
    history.push(`/meetups`);
  };

  const handleOpenEdit = (recordId) => {
    setIsDetailsPaneOpen(false);
    setIsEditPaneOpen(true);
    history.push(`/meetups/${recordId}/edit`);
  };

  /* 
   *** Utilize Stripes object method hasPerm() ***
   If logged in user has that permission, show actionMenu (Edit)
   else undefined (do not render actionMenu)

   Will need to use import useStripes and reference to it, see at top of file.

   hasPerm(arg) = a comma-delimited string of permissions to check

   Possible implementation:
   const actionMenu = stripes.hasPerm('ui-meetups.edit')
      ?
      getActionMenu
      : undefined;

  */   

  const getActionMenu = ({ onToggle }) => (
    <>
      <Button
        buttonStyle='primary'
        onClick={() => handleOpenEdit(id)}
      >
        <FormattedMessage id="meetups.edit-button" />
      </Button>
    </>
  );

  return (
    <>
    {/* 
      *** TODO ***
      For real req/res cycle uncomment GetDetails invocation
    */}
    {/* {id && <GetDetails id={id}/>} */}

    {renderMetadata.createdByUserId && 
      <GetName 
        uuid={renderMetadata.createdByUserId}
        handleGetCreatedByName={handleGetCreatedByName}
        context="createdByName"
      />
    }

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
        paneTitle={<FormattedMessage id="create-pane.loading-pane-details-paneTitle" />}
      />
    ) : (
    <Pane
      defaultWidth='fill'
      paneTitle={<FormattedMessage id="meetups.accordion.details" />} 
      {...props}
      renderHeader={(...renderProps) => (
        <PaneHeader 
          {...renderProps}
          dismissible
          onClose={handleDismissDetails}
          paneTitle={<FormattedMessage id="meetups.accordion.details" />}
          actionMenu={getActionMenu} // pass actionMenu instead if implementing hasPerm        
        />
      )}>

    {isModalViewImage && 
      modalViewImageData && 
      <ModalViewMedia 
        modalViewImageData={modalViewImageData}/>
    }

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
          you'll find an entry like: "stripes-components.metaSection.source": "{source}"
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
        {/* 
          *** TODO ***
          - Utilize obj destructing assignment once using real req/res data
            via singleMeetup context var
          - In JSX for details values, use {name} etc. instead of {tempDataDetails.name}
        */}
        <Row style={{ marginTop: '25px'}}>
          <Col xs={3}>
            <Label size='medium' tag='h2'>
              <FormattedMessage id="meetups.label.name" />
            </Label>
            {tempDataDetails.name} 
          </Col>
        
          <Col xs={3}>
            <Label size='medium' tag='h2'>
              <FormattedMessage id="meetups.label.location" />
            </Label>
            {tempDataDetails.location}
          </Col>

          <Col xs={3}>
            <Label size='medium' tag='h2'>
              <FormattedMessage id="meetups.label.frequency" />
            </Label>
            {tempDataDetails.frequency}
          </Col>
        </Row>

        <Row style={{ marginTop: '25px'}}>
          <Col xs={3}>
            <Label size='medium' tag='h2'>
              <FormattedMessage id="meetups.label.active" />
            </Label>
            {tempDataDetails.active ? 
              <FormattedMessage id="meetups.active-value-true" /> 
              : <FormattedMessage id="meetups.active-value-false" />
            }
          </Col>
        </Row>

        <Row style={{ marginTop: '25px' }}>
          <Col xs={3}>
            <Label size='medium' tag='h2'>
              <FormattedMessage id= "meetups.label.facilitator" />
            </Label>
              <a 
                href={`/users/preview/${tempDataDetails.facilitator.id}`}
                target="_blank"
                aria-label="Link to facilitator in users application"
                style={{
                  textDecoration: 'none',
                  color: 'rgb(0,0,238)',
                  fontWeight: 'bold',
                }}
                rel="noreferrer"
              >
               {`${tempDataDetails.facilitator.lastName}, ${tempDataDetails.facilitator.firstName ? tempDataDetails.facilitator.firstName : ''}`}
            </a>
          </Col>
        </Row>

        <Row style={{ marginTop: '25px', marginBottom: '45px' }}>
             <Col xs={6}>
            <Label size='medium' tag='h2'>
              <FormattedMessage id= "meetups.label.description" />
            </Label>
            {tempDataDetails.description}
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
          <Col xs={2} key={attachment.id}>
          {loadingStatus[attachment.id] && isImageArrayLoading ? <ThumbnailSkeleton />
          : <Thumbnail
              key={attachment.id}
              context='details'
              handleImageClick={() => handleImageClick({
                "id": id,
                "imageId": attachment.id,
                "key": attachment.id, 
                "alt": attachment.description,
                "contentType": attachment.contentType,
                "imageDescription": attachment.description
              })} 
              src={mediaSrc[attachment.id]}
              alt={attachment.description}
              imageDescription={attachment.description}
            />
          }
          </Col>
        ))}
      </Row>
      </Accordion>
    </AccordionSet>
    </Pane>
    )}
    </>
  );
};

export default DetailsPane; 