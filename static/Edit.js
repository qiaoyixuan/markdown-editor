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

    propTypes: {
        scrollTo: PropTypes.func.isRequired,
        preview_offsetY: PropTypes.array.isRequired,
        tokens_level1_offsetY: PropTypes.array.isRequired
    },

    getInitialState: () => {
        return {
            sections: [newSec(0, '# 欢迎使用 Markdown 编辑阅读器\n')],
            section_num: 0
        }
    },

    setScrollTop: function (y) {
        if (!self.on_target) {
            this.refs.edit.scrollTop = y;
        }
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
        let self = this,
            edit = self.refs.edit;

        edit.addEventListener('scroll', () => {
            if (self.on_target) {
                var { scrollTo, preview_offsetY, tokens_level1_offsetY } = self.props,
                    other = tokens_level1_offsetY,
                    another = preview_offsetY,
                    scrollTop = self.refs.edit.scrollTop;
                for (let i = 0; i < other.length - 1; i++) {
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
