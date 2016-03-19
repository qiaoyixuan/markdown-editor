import React, { PropTypes } from 'react'
import $ from 'jquery'

var View = React.createClass({

    propTypes: {
        onRender: PropTypes.func.isRequired,
        preview_html: PropTypes.string,
        scrollTo: PropTypes.func.isRequired,
        preview_offsetY: PropTypes.array.isRequired,
        tokens_level1_offsetY: PropTypes.array.isRequired
    },

    update: function(){
        let self            = this,
            children        = $(self.refs.view).children(),
            h               = 0,
            preview_offsetY = []


        $(children).each(function(idx, child){
            preview_offsetY.push(h);
            h += $(child).outerHeight(true);
        });
        return preview_offsetY;
    },

    setScrollTop: function(y){
        if (!self.on_target) {
            this.refs.preview.scrollTop = y;
        }
    },

    componentDidMount: function(){
        let self = this,
            preview = self.refs.preview;

        preview.addEventListener('scroll', function(){
            if (self.on_target) {
                let { scrollTo, preview_offsetY, tokens_level1_offsetY } = self.props,
                    another = tokens_level1_offsetY,
                    other = preview_offsetY,
                    scrollTop = self.refs.preview.scrollTop;
                for (var i = 0; i < other.length - 1; i++) {
                    if(scrollTop > other[i] && scrollTop < other[i + 1]){
                        var per = (scrollTop - other[i]) / (other[i + 1] - other[i]);
                        if(per){
                            var offsetY = (another[i + 1] - another[i]) * per + another[i];
                            scrollTo(false, offsetY);
                        }
                    }
                };
            }
        });

        setInterval(function(){
            self.props.onRender(self.update());
        }, 2500);

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

export default View
