import React, { PropTypes } from 'react';
import ReactDom from 'react-dom';
// import Section from './Section';
import AceEditor from './ace';
import * as x from 'kit-utils';
import $ from 'jquery'

import 'brace/mode/markdown';
import 'brace/theme/dawn';

export default React.createClass({

    getInitialState: () => {
        return {
            content: '# 欢迎使用 Markdown 编辑阅读器\n\n\n\n'
        };
    },

    scrollTo: function (scrollTop) {
        this.refs.edit.scrollTop = scrollTop;
    },

    componentDidMount: function () {
        let edit = this.refs.edit;

        edit.addEventListener('scroll', () => {
            if (this.on_target) {
                this.props.onScroll(edit.scrollTop);
            }
        });

        this.emitChange();
        let timer = setInterval(() => {
            this.emitChange({});
        }, 3000);
    },

    onInput: function (content) {
        this.setState({ content });
        this.emitChange();
    },

    emitChange: function () {
        let editor = ReactDom.findDOMNode(this.refs.__ace__),
            children = $(editor).find('.ace_line_group'),
            {content, divs_h_list} = this.state,
            divs_offsetY, cur_offset = 0;

        divs_offsetY = x.reduce((cur, next) => {
            cur_offset += $(next).height();
            cur.push(cur_offset);
            return cur;
        }, [0], children);

        this.props.onChange(content, divs_offsetY);
    },

    render: function () {
        let onMouseOver, onMouseOut, onFocus, onBlur, obj, config;

        onMouseOver = onFocus = () => this.on_target = true;
        onMouseOut  = onBlur  = () => this.on_target = false;

        obj = {onMouseOver, onMouseOut, onBlur, onFocus};

        config = {
            ref: '__ace__',
            mode: 'markdown',
            theme: 'dawn',
            name: 'md_editor',
            className: 'section ace-dawn',
            value: this.state.content,
            onChange: this.onInput
        };

        return (<div className='edit' ref='edit' {...obj} >
                    <AceEditor {...config} />
                </div>);
    }
});
