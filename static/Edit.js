import React, { PropTypes } from 'react'
import Section from './Section'

let newSec = function(id) {
    return {
        id: id,
        content: '\n\n\n\n\n',
        divs_h_list: []
    };
}

export default React.createClass({

    propTypes: {
        scrollTo: PropTypes.func.isRequired,
        preview_offsetY: PropTypes.array.isRequired,
        tokens_level1_offsetY: PropTypes.array.isRequired
    },

    getInitialState: function(){
        return {
            sections: [newSec(0)],
            section_num: 0
        }
    },

    setScrollTop: function(y){
        if (!self.on_target) {
            this.refs.edit.scrollTop = y;
        }
    },

    insert_section: function(){
        let { section_num, sections } = this.state;
        section_num ++;
        sections.push(newSec(section_num));
        this.setState({
            section_num,
            sections
        });
    },

    componentDidMount: function(){
        let self = this,
            edit = self.refs.edit;

        edit.addEventListener('scroll', function(){
            if (self.on_target) {
                let { scrollTo, preview_offsetY, tokens_level1_offsetY } = self.props,
                    other = tokens_level1_offsetY,
                    another = preview_offsetY,
                    scrollTop = self.refs.edit.scrollTop;
                for (var i = 0; i < other.length - 1; i++) {
                    if(scrollTop > other[i] && scrollTop < other[i + 1]){
                        var per = (scrollTop - other[i]) / (other[i + 1] - other[i]);
                        if(per){
                            var offsetY = (another[i + 1] - another[i]) * per + another[i];
                            scrollTo(true, offsetY);
                        }
                    }
                };
            }
        });

    },

    onUpdate: function(section) {
        let { sections } = this.state,
            all_content  = '',
            divs_offsetY = [];

        for (var i = 0; i < sections.length; i++) {
            if( sections[i].id == section.id ) {
                sections[i].content = section.content;
                sections[i].divs_h_list = section.divs_h_list;
            }
        }

        for (var i = 0, cur_offset = 0; i < sections.length; i++) {
            all_content += sections[i].content;
            for (var j = 0; j < sections[i].divs_h_list.length; j++) {
                divs_offsetY.push(cur_offset);
                cur_offset += sections[i].divs_h_list[j];
            }
        }

        this.setState({
            sections,
            divs_offsetY,
            all_content
        });

        this.props.onChange(all_content, divs_offsetY);
    },

    render: function(){
        let self = this,
            { sections } = this.state,
            onMouseOver, onMouseOut, onFocus, onBlur, obj;

        onMouseOver = onFocus = () => self.on_target = true;
        onMouseOut  = onBlur  = () => self.on_target = false;

        obj = {onMouseOver, onMouseOut, onBlur, onFocus};

        return (<div className='edit' ref='edit' {...obj}>
                    {sections.map(function(section, i){
                        return (<Section
                                    key={i}
                                    section={section}
                                    onUpdate={self.onUpdate} />);
                    })}
                </div>);
    }
});
