import React, { useState } from 'react';
import { Col, Loading, Modal, Row } from '@folio/stripes/components';
import { useMeetups } from '../../contexts/MeetupsContext';
import GetMedia from './connectedComponents/GetMedia';

const ModalViewMedia = ({ modalViewImageData }) => {
  const { isModalViewImage, setIsModalViewImage } = useMeetups();
  const { id, imageId, alt, imageDescription} = modalViewImageData;
  const [mediaUrl, setMediaUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  if (!isModalViewImage) {
    return null;
  };

  const handleDataResponse = (url) => {
    setMediaUrl(url)
    setIsLoading(false)
  };
 
  const handleDismissClose = () => {
    setIsModalViewImage(false);
  };

  return (
    <Modal
      style={{ 
        minHeight: '550px',
        height: '60%', 
        maxHeight: '300vh', 
        maxWidth: '400vw', 
        width: '80%' 
      }}
      open
      dismissible
      closeOnBackgroundClick
      label={imageDescription}
      size="large"
      onClose={handleDismissClose}
    >
      {id && imageId && 
        <GetMedia 
          context='original'
          id={id} 
          imageId={imageId} 
          handleDataResponse={handleDataResponse}
        />}

      {isLoading ? (
        <Row 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginTop: "150px"
          }}>
            <Col>
              <div style={{ "display": "flex", "justiftContent": "center", "aligItems": "center", "height": "100%" }}>
                <Loading size='large'/>
              </div>
            </Col>
          </Row>
          ) : ( 
          <Row style={{ display: 'flex', justifyContent: 'center' }}>
            <Col xs={8} style={{ textAlign: 'center' }}>
              {mediaUrl && (<img
                src={mediaUrl}
                alt={alt}
                style={{ width: '550px', margin: 'auto' }}
                className="img-fluid"
              />)}
            </Col>
        </Row>
      )}
    </Modal>
  );
};

export default ModalViewMedia;