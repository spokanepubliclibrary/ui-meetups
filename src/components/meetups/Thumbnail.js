import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@folio/stripes/components';
import { 
  thumbnailContainerStyle, 
  thumbnailTextStyle,
  buttonContainerStyle,
  thumbnailStyle,
  buttonStyle
} from './ThumbnailStyles';

import { FormattedMessage } from 'react-intl';
const Thumbnail = React.memo(({ 
    context, // DetailsPane will pass str
    handleImageClick, // open ModalViewMedia at DetailsPane (no view at EditPane)
    handleMarkForRemoval, // func for remove at EditPane 
    mediaId, // value for remove at EditPane
    src, 
    alt, 
    imageDescription
  }) => {

  return (
    <>
    <div style={thumbnailContainerStyle}>
      <button onClick={handleImageClick} type="button">
        <img 
          src={src} 
          alt={alt} 
          style={thumbnailStyle} 
        />
      </button>

      <div style={thumbnailTextStyle}>
        <p>{imageDescription}</p>
      </div>

      {context === 'details' ? null : (
        <div style={buttonContainerStyle}>
          <Button
            buttonStyle='default'
            style={buttonStyle}
            onClick={() => handleMarkForRemoval(mediaId)}
            type="button"
            aria-label={`Remove ${imageDescription}`}
          >
            <FormattedMessage id="remove-button" />
          </Button>
        </div>)}
    </div>
    </>
  );
}); 

Thumbnail.propTypes = {
  context: PropTypes.string,
  handleImageClick: PropTypes.func, 
  handleMarkForRemoval: PropTypes.func,
  mediaId: PropTypes.string,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  imageDescription: PropTypes.string.isRequired
};

export default Thumbnail;