import React, { PropTypes } from 'react'
import Section from './Section'

var Edit = React.createClass({

    propTypes: {
        scrollTo: PropTypes.func.isRequired,
        preview_offsetY: PropTypes.array.isRequired,
        tokens_level1_offsetY: PropTypes.array.isRequired
    },

    getInitialState: function(){
        return {
            sections: [{
                section_id: 0,
                section: null
            }],
            divs_offsetY: [],
            divs_raw_text: null,
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
        sections.push({
            section_id: section_num,
            section: null
        });
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

    render: function(){
        let self = this,
            { sections, divs_offsetY, divs_raw_text } = self.state,
            onUpdate = (section) => {
                divs_raw_text = '';
                sections[section.id].section = section;
                divs_offsetY = [];

                for (var i = 0, cur_offset = 0; i < sections.length; i++) {
                    divs_raw_text += sections[i].section.raw_text;
                    for (var j = 0; j < sections[i].section.divs_height_list.length; j++) {
                        divs_offsetY.push(cur_offset);
                        cur_offset += sections[i].section.divs_height_list[j];
                    };

                };

                self.setState({
                    sections,
                    divs_offsetY,
                    divs_raw_text
                });

                self.props.onChange(divs_raw_text, divs_offsetY);
            },
            onMouseOver, onMouseOut, onFocus, onBlur, obj;

        onMouseOver = onFocus = () => self.on_target = true;
        onMouseOut  = onBlur  = () => self.on_target = false;

        obj = {onMouseOver, onMouseOut, onBlur, onFocus};

        return (<div className='edit' ref='edit' {...obj}>
                    {sections.map(function(section, i){
                        return (<Section section={section} key={i} onUpdate={onUpdate}></Section>);
                    })}
                </div>);
    }
});

export default Edit