import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'

var md          = require('guide-markdown')(),
    mdContainer = require('markdown-it-container');

var Editor = React.createClass({

    getInitialState: function(){
        return {
            preview_offsetY: [],
            tokens_level1_offsetY: [],
            preview_html: '',
        }
    },

    render: function(){
        let self  = this,
            { preview_html, tokens_level1_offsetY, preview_offsetY } = this.state,
            
            onChange = function(divs_raw_text, divs_offsetY){

                tokens_level1_offsetY = [];

                let tokens = md.parse(divs_raw_text, {}),
                    tmp_tokens = [], n = 0;

                for (var i = 0; i < tokens.length; i++) {
                    tmp_tokens.push(tokens[i]);
                    n += tokens[i].nesting;
                    if(n == 0){
                        var map_0 = tmp_tokens[0].map[0];
                        tokens_level1_offsetY.push(divs_offsetY[map_0]);
                        tmp_tokens = [];
                    }
                };
                preview_html = md.render(divs_raw_text);
                self.setState({
                    preview_html,
                    tokens_level1_offsetY
                });

            },

            onRender = function(preview_offsetY){
                self.setState({
                    preview_offsetY
                });
            },

            scrollTo = function(dict, scrollTop){
                if(scrollTop){
                    if(dict)
                        self.refs.__view__.setScrollTop(scrollTop);
                    else
                        self.refs.__edit__.setScrollTop(scrollTop);
                }
            },

            newSection = function(){
                self.refs.__edit__.insert_section();
            }

        return (<div className='editor'>
                    <div className='options'>
                        <button className='insert' onClick={newSection}>插入</button>
                    </div>
                    <div className='editor-warpper'>
                        <Edit 
                            ref='__edit__'
                            onChange={onChange} 
                            scrollTo={scrollTo}
                            preview_offsetY={preview_offsetY}
                            tokens_level1_offsetY={tokens_level1_offsetY}/>
                        <View 
                            ref='__view__'
                            onRender={onRender} 
                            scrollTo={scrollTo} 
                            preview_html={preview_html}
                            preview_offsetY={preview_offsetY}
                            tokens_level1_offsetY={tokens_level1_offsetY}/>
                    </div>
                </div>)
    }
});

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
})

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
            h += $(child).height();
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


ReactDOM.render(
    <Editor />,
    document.getElementById('editer')
)