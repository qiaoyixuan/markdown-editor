import React, { PropTypes } from 'react';
import Section from './Section';

const newSec = (id, content) => {
    return {
        id: id,
        content: content,
        divs_h_list: []
    };
}

export default React.createClass({

    getInitialState: () => {
        return {
            sections: [newSec(0, '# 欢迎使用 Markdown 编辑阅读器\n')],
            section_num: 0
        };
    },

    scrollTo: function (scrollTop) {
        this.refs.edit.scrollTop = scrollTop;
    },

    insert_section: function () {
        let { section_num, sections } = this.state;
        section_num ++;
        sections.push(newSec(section_num, '新区块\n'));
        this.setState({
            section_num,
            sections
        });
    },

    componentDidMount: function () {
        let edit = this.refs.edit;

        edit.addEventListener('scroll', () => {
            if (this.on_target) {
                this.props.onScroll(edit.scrollTop);
            }
        });

    },

    onUpdate: function (section) {
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
                    {sections.map((section, i) => {
                        return (<Section
                                    key={i}
                                    section={section}
                                    onUpdate={self.onUpdate} />);
                    })}
                </div>);
    }
});
