import React, { PropTypes } from 'react';
import ReactDom from 'react-dom';
import ReactModal from 'react-modal';

import * as x from 'kit-utils';
import $ from 'jquery';
import _ from 'lodash';
import {MODAL, MODAL_STYLE} from './constant';
import {getRelativePosition, expendObject} from './utils';

import AceEditor   from './ace';
import UploadPhoto from './upload_photo';
import InsertLink  from './insert_link';
import ContextMenu from './contextMenu';

import 'brace/mode/markdown';
import 'brace/theme/dawn';

export default React.createClass({

    getInitialState: () => {
        return {
            content: '# 欢迎使用 Markdown 编辑阅读器\n\n\n\n',
            contextMenuPosition: {
                top: 0,
                left: 0
            },
            ['MODAL_' + MODAL.PHOTO]: false,
            ['MODAL_' + MODAL.LINK]: false
        };
    },

    scrollTo: function (scrollTop) {
        this.refs.edit.scrollTop = scrollTop;
    },

    onInsert: function (text) {
        this.refs.__ace__.onInsert(text);
    },

    componentDidMount: function () {
        var edit = this.refs.edit;

        edit.addEventListener('scroll', () => {
            if (this.on_target) {
                this.props.onScroll(edit.scrollTop);
            }
        });

        this.emitChange();
        setInterval(() => {
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
            cur_offset += $(next).outerHeight(true);
            cur.push(cur_offset);
            return cur;
        }, [0], children);

        this.props.onChange(content, divs_offsetY);
    },

    render: function () {
        let onMouseOver, onMouseOut, onFocus, onBlur, onClick, onContextMenu, obj, config,
            {contextMenuPosition} = this.state;

        onMouseOver = onFocus = () => this.on_target = true;
        onMouseOut  = onBlur  = () => this.on_target = false;

        onClick = () => {
            this.setState({
                contextMenuPosition: {
                    display: 'none'
                }
            });
        };

        onContextMenu = (e) => {
            var parPosition = getRelativePosition(this.refs.edit),
                position = [e.pageX - parPosition[0], e.pageY - parPosition[1]];
            this.setState({
                contextMenuPosition: {
                    display: 'block',
                    left: position[0],
                    top:  position[1]
                }
            });
            e.preventDefault();
            e.stopPropagation();
        };

        obj = {onMouseOver, onMouseOut, onBlur, onFocus, onClick, onContextMenu};

        config = {
            ref: '__ace__',
            mode: 'markdown',
            theme: 'dawn',
            name: 'md_editor',
            className: 'section ace-dawn',
            value: this.state.content,
            onChange: this.onInput
        };

        let openModal = (modal) => {
            this.setState({
                ['MODAL_' + modal]: true
            });
        },
        closeModal = (modal) => {
            this.setState({
                ['MODAL_' + modal]: false
            });
        };

        return (<div className='edit' ref='edit' {...obj} >
                    <AceEditor {...config} />
                    <ContextMenu style={contextMenuPosition} openModal={openModal} />
                    <ReactModal
                        style={expendObject(MODAL_STYLE, {content: {
                            width: '500px',
                            height: '200px'
                        }})}
                        isOpen={this.state['MODAL_' + MODAL.PHOTO]}
                        onRequestClose={() => this.setState({['MODAL_' + MODAL.PHOTO]: false})} >
                        <UploadPhoto onInsert={this.onInsert} closeModal={closeModal} />
                    </ReactModal>
                    <ReactModal
                        style={expendObject(MODAL_STYLE, {content: {
                            width: '500px',
                            height: '200px'
                        }})}
                        isOpen={this.state['MODAL_' + MODAL.LINK]}
                        onRequestClose={() => this.setState({['MODAL_' + MODAL.LINK]: false})} >
                        <InsertLink onInsert={this.onInsert} closeModal={closeModal} />
                    </ReactModal>
                </div>);
    }
});
