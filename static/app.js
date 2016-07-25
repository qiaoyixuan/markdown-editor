import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import throttle from 'lodash/throttle';
import Edit from './Edit';
import View from './View';

var md          = require('kit-markdown')(),
    mdContainer = require('markdown-it-container');

const D = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
};

var Editor = React.createClass({

    getInitialState: () => {
        return {
            preview_offsetY: [],
            tokens_level1_offsetY: [],
            preview_html: '',
        };
    },

    render: function () {
        var self = this,
            { preview_html, tokens_level1_offsetY, preview_offsetY } = this.state,

            onScroll = direction => throttle(scrollTop => {
                var fr, to,
                    target_dict = {
                        [D.LEFT]:  self.refs.__view__,
                        [D.RIGHT]: self.refs.__edit__
                    };

                if(direction === D.LEFT) {
                    fr = tokens_level1_offsetY;
                    to = preview_offsetY;
                } else {
                    fr = preview_offsetY;
                    to = tokens_level1_offsetY;
                }

                for (let i = 0; i < fr.length - 1; i++) {
                    if(scrollTop > fr[i] && scrollTop < fr[i + 1]) {
                        var per = (scrollTop - fr[i]) / (fr[i + 1] - fr[i]);
                        if(per) {
                            var offsetY = (to[i + 1] - to[i]) * per + to[i];
                            target_dict[direction].scrollTo(offsetY);
                        }
                    }
                };
            }, 100),

            onChange = (all_content, divs_offsetY) => {
                tokens_level1_offsetY = [];

                var tokens = md.parse(all_content, {}),
                    tmp_tokens = [], n = 0;

                for (let i = 0; i < tokens.length; i++) {
                    tmp_tokens.push(tokens[i]);
                    n += tokens[i].nesting;
                    if(n == 0){
                        var map_0 = tmp_tokens[0].map[0];
                        tokens_level1_offsetY.push(divs_offsetY[map_0]);
                        tmp_tokens = [];
                    }
                };
                md.render(all_content).then(preview_html => {
                      self.setState({
                          preview_html,
                          tokens_level1_offsetY
                      });
                });
            },

            onRender = preview_offsetY => {
                self.setState({
                    preview_offsetY
                });
            };

        return (<div className='editor'>
                    <div className='options'>
                        <ul className='opt-btns'>
                            <li><i className='fa fa-asterisk'></i></li>
                        </ul>
                    </div>
                    <div className='editor-warpper'>
                        <Edit
                            ref='__edit__'
                            onChange={onChange}
                            onScroll={onScroll(D.LEFT)} />
                        <View
                            ref='__view__'
                            onRender={onRender}
                            onScroll={onScroll(D.RIGHT)}
                            preview_html={preview_html} />
                    </div>
                </div>);
    }
});

ReactDOM.render(<Editor />, document.getElementById('md_editor_app'));
