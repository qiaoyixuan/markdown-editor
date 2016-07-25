import React, { PropTypes } from 'react'
import $ from 'jquery'

export default React.createClass({

    propTypes: {
        onRender: PropTypes.func.isRequired,
        preview_html: PropTypes.string
    },

    update: function () {
        let self            = this,
            children        = $(self.refs.view).children(),
            h               = 0,
            preview_offsetY = []

        $(children).each((idx, child) => {
            preview_offsetY.push(h);
            h += $(child).outerHeight(true);
        });
        return preview_offsetY;
    },

    scrollTo: function (scrollTop) {
        this.refs.preview.scrollTop = scrollTop;
    },

    componentDidMount: function () {
        let preview = this.refs.preview;

        preview.addEventListener('scroll', () => {
            if (this.on_target) {
                this.props.onScroll(preview.scrollTop);
            }
        });

        setInterval(() => {
            this.props.onRender(this.update());
        }, 3000);

    },

    render: function(){
        let self = this,
            onMouseOver, onMouseOut, onFocus, onBlur, obj;

        onMouseOver = onFocus = () => self.on_target = true;
        onMouseOut  = onBlur  = () => self.on_target = false;

        obj = {onMouseOver, onMouseOut, onBlur, onFocus};

        return (<div className='preview-container' ref='preview' {...obj}>
                    <div className='view' ref='view' dangerouslySetInnerHTML={{ __html: this.props.preview_html }}></div>
                </div>)
    }
});
