import React from 'react';
import ReactDom from 'react-dom';
import AceEditor from './ace';
import {noop, reduce, map, compose} from 'kd-utils';
import $ from 'jquery'

import 'brace/mode/markdown';
import 'brace/theme/dawn';

export default React.createClass({

    propTypes: {
        onUpdate: React.PropTypes.func
    },

    getInitialState: function(){
        let {id, content} = this.props.section;
        return {
            id: id,
            content: content + '\n',
            divs_h_list: []
        };
    },

    componentDidMount: function(){
        this.emitChange();
        let timer = setInterval(() => {
            this.emitChange({});
        }, 3000);
    },

    onInput: function(content){
        this.setState({
            content
        });
    },

    emitChange: function(){
        let editor = ReactDom.findDOMNode(this.refs.__ace__),
            children = $(editor).find('.ace_line_group'),
            {id, content, divs_h_list}   = this.state;

        divs_h_list = map(function(item){
            return $(item).height();
        }, children);

        this.setState({
            divs_h_list
        });

        this.props.onUpdate(this.state);
    },

    render: function(){
        return (<div className='section-warpper'>
                    <AceEditor
    					ref='__ace__'
    					mode="markdown"
                        theme='dawn'
    					className="section ace-dawn"
    					name={'_' + this.state.id}
    					value={this.props.section.content}
                        onChange={this.onInput} />
                </div>)
    }
});
