import React from 'react';
import ReactDom from 'react-dom';
import AceEditor from './ace';
import {noop, reduce, map, compose} from 'kd-utils';
import $ from 'jquery'

import 'brace/mode/markdown';
import 'brace/theme/github';

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

    onInput: function(text){

        let editor = ReactDom.findDOMNode(this.refs.__ace__),
            children = $(editor).find('.ace_line_group'),
            {id, content, divs_h_list}   = this.state;

        divs_h_list = map(function(item){
            return $(item).height();
        }, children);
        // console.log(divs_h_list)
        this.props.onUpdate({
            id: id,
            content: text,
            divs_h_list: divs_h_list
        });

        this.setState({
            content: text
        });
    },

    render: function(){
        return (<div className='section-warpper'>
                    <AceEditor
    					ref='__ace__'
    					mode="markdown"
    					theme="github"
    					className="section"
    					name={'_' + this.state.id}
    					value={this.props.section.content}
                        onChange={this.onInput} />
                </div>)
    }
});
