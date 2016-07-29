import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import throttle from 'lodash/throttle';
import isString from 'lodash/isString';
import Edit from './Edit';
import View from './View';
import FuncMenu from './func_menu';

import {MODAL, OUTPUT_PATH} from './constant';

require('../static/editor.less')

var md          = require('kit-markdown')(),
    mdContainer = require('markdown-it-container');

const D = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
};

const getValidText = (text, string) => {
    return text === undefined || text === '' ? string : text;
};

const TAGS = [
    ['fa fa-bold', '加粗', function (text) {
        const reg = /\*{2}(.+)\*{2}/;
        let insertText = reg.test(text) ? text.match(reg)[1] : `**${getValidText(text, '粗体')}**`;
        this.insertTag(insertText);
    }],
    ['fa fa-italic', '斜体', function (text) {
        const reg = /\*{1}(.+)\*{1}/;
        let insertText = reg.test(text) ? text.match(reg)[1] : `*${getValidText(text, '斜体')}*`;
        this.insertTag(insertText);
    }],
    ['fa fa-link', '链接', function () {
        this.refs.__edit__.openModal(MODAL.LINK);
    }],
    ['fa fa-quote-left', '引用', '\n> 段落引用\n'],
    ['fa fa-code', '代码', '\n```javascript\nconsole.log(\'Hello World\');\n```\n'],
    ['fa fa-photo', '图片', function () {
        this.refs.__edit__.openModal(MODAL.PHOTO);
    }],
    ['fa fa-list-ul', '列表项', '\n- 列表项\n'],
    ['fa fa-list-alt', '标题', function (text) {
        const reg = /#{2}\s*(.+)/;
        let insertText = reg.test(text) ? text.match(reg)[1] : `## ${getValidText(text, '标题')}`;
        this.insertTag(insertText);
    }],
    ['fa fa-minus', '分割线', '\n----------\n'],
    ['fa fa-reply', '撤销', function () {
        this.undo();
    }],
    ['fa fa-share', '重复', function () {
        this.redo();
    }]
];

var Editor = React.createClass({

    getInitialState: () => {
        return {
            preview_offsetY: [],
            tokens_level1_offsetY: [],
            preview_html: '',
        };
    },

    insertTag: function (text) {
        this.refs.__edit__.onInsert(text);
    },

    redo: function () {
        this.refs.__edit__.redo();
    },

    undo: function () {
        this.refs.__edit__.undo();
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
            },

            onSave = (file_name) => {
                // var content = this.refs.__edit__.getContent();
                // var file_path = OUTPUT_PATH + '/' + file_name;
                // console.log(file_path, content);
                // this.refs.__edit__.redo();
            },

            renderTags = () => {
                var tags = [];
                TAGS.map((item, i) => {
                    tags.push(<li key={i} onClick={() => {
                        if(isString(item[2])) {
                            this.insertTag(item[2]);
                            return;
                        }
                        item[2].call(this, this.refs.__edit__.getSelectedText());
                    }}><i className={item[0]} title={item[1]}></i></li>);
                });
                return tags;
            };

        return (<div className='editor'>
                    <div className='options'>
                        <ul className='opt-btns ml80'>
                            {renderTags()}
                        </ul>
                        <FuncMenu onSave={onSave} />
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
