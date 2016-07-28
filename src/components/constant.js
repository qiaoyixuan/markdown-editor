var path = require('path');
require('./animation.less');

export const OUTPUT_PATH = path.join(__dirname, 'output');

export const MODAL = {
    PHOTO: 'PHOTO',
    LINK: 'LINK'
};

export const MODAL_STYLE = {
    content: {
        margin: '0 auto',
        padding: '0',
        border: 'none',
        bottom: 'initial',
        boxShadow: 'none',
        borderRadius: '5px',
        animationName: 'modal-animation',
    	animationDuration: '.25s',
        animationFillMode: 'forwards'
    	// animation-timing-function:linear;
    	// animation-delay:2s;
    	// animation-iteration-count:infinite;
    	// animation-direction:alternate;
    	// animation-play-state:running;
    },
    overlay: {
        animationName: 'modal-bg-animation',
        animationDuration: '.25s',
        animationFillMode: 'forwards'
    }
};
