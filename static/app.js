import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Edit from './Edit'
import View from './View'

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

            onChange = function(all_content, divs_offsetY){
                tokens_level1_offsetY = [];

                let tokens = md.parse(all_content, {}),
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
                preview_html = md.render(all_content);

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
                        <ul className='opt-btns'>
                            <li><i className='fa fa-asterisk' onClick={newSection}></i></li>
                            <li><i className='fa fa-asterisk' onClick={newSection}></i></li>
                            <li><i className='fa fa-asterisk' onClick={newSection}></i></li>
                        </ul>
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

ReactDOM.render(
    <Editor />,
    document.getElementById('editer')
)
