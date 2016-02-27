import React, { PropTypes } from 'react'
import $ from 'jquery'

var Section = React.createClass({
    propTypes: {
        onUpdate: PropTypes.func.isRequired
    },

    render: function(){
        let self    = this,
            onInput = function(){
                return function(){
                    let section     = self.refs.section,
                        text        = section.innerText,
                        children    = $(section).children(),
                        height_list = [];
                    $(children).each(function(idx, child){
                        height_list.push($(child).height());
                    });
                    self.props.onUpdate({
                        id: self.props.section.section_id,
                        raw_text: text,
                        divs_height_list: height_list
                    });
                }
            }

        return (<div className='section-warpper'>
                    <div className='section' ref='section' contentEditable onInput={onInput()}></div>
                </div>)
    }
});

export default Section