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

const ThumbnailTempPreSave = React.memo(({ 
    context,
    handleRemoveUnsavedMediaCreate,
    handleRemoveUnsavedMedia,
    mediaId, 
    src, 
    alt, 
    imageDescription
  }) => {

  return (
    <>
      <div style={thumbnailContainerStyle}>
        <img 
          src={src} 
          alt={alt} 
          style={thumbnailStyle} 
        />
        
        <div style={thumbnailTextStyle}>
          <p>{imageDescription}</p>
        </div>

        <div style={buttonContainerStyle}>
          <Button
            buttonStyle='default'
            style={buttonStyle}
            onClick={context === 'create' ? 
              () => handleRemoveUnsavedMediaCreate(mediaId) 
              : () => handleRemoveUnsavedMedia(mediaId)}
            type="button"
            aria-label={`Remove ${imageDescription}`}
          >
          <FormattedMessage id="remove-button" />
          </Button>
        </div>
      </div>
    </>
  );
}); 

ThumbnailTempPreSave.propTypes = {
  context: PropTypes.str,
  handleRemoveUnsavedMediaCreate: PropTypes.func,
  handleRemoveUnsavedMedia: PropTypes.func,
  mediaId: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  imageDescription: PropTypes.string.isRequired
};

export default ThumbnailTempPreSave;