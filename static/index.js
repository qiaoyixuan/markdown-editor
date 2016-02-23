import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import $ from 'jquery'

var md          = require('markdown-it')(),
    mdContainer = require('markdown-it-container');
var token_height, view_height = [];
md.core.ruler.at('replacements', function replace(state) {
    token_height = [];
    var tokens = state.tokens, n = 0, tmp_tokens = [],
    divs = $('.block_text').children(), edit_height = [], h = 0;

    console.log(divs)

    $(divs).each(function(idx, div){ 
        edit_height.push(h);
        h += $(div).height();
    })

    for (var i = 0; i < tokens.length; i++) {
        tmp_tokens.push(tokens[i]);
        n += tokens[i].nesting;
        if(n == 0){
            var map_0 = tmp_tokens[0].map[0];
            token_height.push(edit_height[map_0])
            tmp_tokens = [];
        }
    };

    console.log('edit_height', edit_height);
    console.log('token_height', token_height);
});

var initial_state = {
	block_num : 0,
    block_text: [
        {
            id: 0,
            text: ''
        }
    ],
    view_text: '',
    editer_style: {
        height: window.innerHeight
    },
    edit_style: {
        height: window.innerHeight - 50
    },
    view_style: {
        height: window.innerHeight - 50
    }
}

function stateUtil (state = initial_state, action) {
    var ns = Object.assign({}, state);
    switch (action.type) {
        case 'insert_block':
            ns.block_text.push({id: ++ns.block_num, text: ''});
            return ns;
        case 'editing':
            ns.block_text[action.data.block_id].text = action.data.block_text;
            var text = ns.block_text.reduce(function(prev, cur){
               return prev += cur.text;
            }, '');
            ns.view_text = md.render(text);
            return ns;
        case 'handleResize':
            ns.editer_style.height = window.innerHeight;
            ns.edit_style.height = ns.view_style.height = window.innerHeight - 50;
            return ns;
        default:
        	return ns;
    }
}

var Editer = React.createClass({
    componentDidMount: function() {
        window.addEventListener('resize', this.props.handleResize);
    },
	render: function(){
        const {status, insert_block, editing, handleResize} = this.props;
		return (<div className='editer' style={{height:status.editer_style.height+'px'}}>
                    <div className='options'>
                        <button className='insert' onClick={insert_block}>newBlock</button>
                    </div>
					<Edit status={status} editing={editing}/>
					<View status={status} view_text={status.view_text}/>
				</div>)
	}
});

var Edit = React.createClass({
    componentDidMount: function(){
        var edit = ReactDOM.findDOMNode(this.refs.edit),
            children = $('.view')[0].children;
        edit.addEventListener('scroll', function(){
            for (var i = 0; i < token_height.length - 1; i++) {
                if(this.scrollTop > token_height[i] && this.scrollTop < token_height[i + 1]){
                    var per = (this.scrollTop - token_height[i]) / (token_height[i + 1] - token_height[i]);
                    if(per){
                        var offset = (view_height[i + 1] - view_height[i]) * per + view_height[i];
                        $('.container').scrollTop(offset);
                    }
                }
            };
        });
    },
	render: function(){
        var self = this
        var blocks = this.props.status.block_text.map(function(block, i){
            return (<Block block_id={block.id} key={i} editing={self.props.editing}>{block.text}</Block>)
        })
		return (<div className='edit' ref='edit' style={{height:this.props.status.edit_style.height + 'px'}}>
                    {blocks}
				</div>)
	}
});

var Block = React.createClass({
    render: function(){
        var self = this;
        function getVal(fn){
            return function(){
                fn(self.refs.textarea.getAttribute('data-block_id'), self.refs.textarea.innerText)
            }
        }
        return (<div className='block'>
                    <div className='block_edit' ref='textarea' contentEditable data-block_id={this.props.block_id} onInput={getVal(this.props.editing)} className='block_text'></div>
                </div>)
    }
})

var View = React.createClass({
    componentDidUpdate: function(){
        var children = $(ReactDOM.findDOMNode(this.refs.view))[0].children, h = 0;
        view_height = [];
        $(children).each(function(idx, child){
            view_height.push(h);
            h += $(child).height();
        })
        console.log('view_height', view_height)
    },
	render: function(){
		return (<div className='container' style={{height:this.props.status.view_style.height+'px'}}>
                    <div className='view' ref='view' dangerouslySetInnerHTML={{ __html: this.props.view_text }}></div>
                </div>)
	}
});

function handleChange(){
    ///console.log('Current state:', store.getState());
}

var store = createStore(stateUtil),
	unsubscribe = store.subscribe(handleChange);

Editer.propTypes = {
    status: PropTypes.object,
    insert_block: PropTypes.func,
    handleResize: PropTypes.func
}

/* actions */
var insert_block = {
	type: 'insert_block'
}, editing = {
    type: 'editing',
    data: {
        block_id: null,
        block_text: null
    }
}, handleResize = {
    type: 'handleResize'
}

/* map */
function mapStateToProps(state){
    return {
        status: state
    }
}

function mapDispatchToProps(dispatch){
    return {
        insert_block: function(){
            dispatch(insert_block);
        },
        editing: function(block_id, text){
            editing.data.block_id = block_id;
            editing.data.block_text = text;
            dispatch(editing);
        },
        handleResize: function(){
            dispatch(handleResize);
        }
    }
}

var App = connect(mapStateToProps, mapDispatchToProps)(Editer)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('editer')
)