import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import $ from 'jquery'

var md          = require('guide-markdown')(),
    mdContainer = require('markdown-it-container');

var initial_state = {
    section_num : 1,
    token_offsetY: [],
    preview_offsetY: [],
    view_html: '',
    sections: [{
            section_id: 0,
            md_text: '',
            section_div_height: [0],
            section_tokens: []
        }
    ],
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

var Editor = React.createClass({
    propTypes: {
        status: PropTypes.object,
        onInsert: PropTypes.func,
        onResize: PropTypes.func,
        onPreviewUpdate: PropTypes.func
    },
    componentDidMount: function() {
        window.addEventListener('resize', this.props.onResize);
    },
    render: function(){
        const {status, onInsert, onEdit, onResize, onPreviewUpdate} = this.props;
        return (<div className='editor' style={{height:status.editer_style.height + 'px'}}>
                    <div className='options'>
                        <button className='insert' onClick={onInsert}>newBlock</button>
                    </div>
                    <Edit 
                        status={status} 
                        onEdit={onEdit}/>
                    <View 
                        onPreviewUpdate={onPreviewUpdate} 
                        view_style={status.view_style} 
                        view_html={status.view_html}/>
                </div>)
    }
});

var Edit = React.createClass({
    componentDidMount: function(){
        var edit = this.refs.edit,
            children = $('.view').children();
        // edit.addEventListener('scroll', function(){
        //     for (var i = 0; i < token_offsetY.length - 1; i++) {
        //         if(this.scrollTop > token_offsetY[i] && this.scrollTop < token_offsetY[i + 1]){
        //             var per = (this.scrollTop - token_offsetY[i]) / (token_offsetY[i + 1] - token_offsetY[i]);
        //             if(per){
        //                 var offset = (preview_offsetY[i + 1] - preview_offsetY[i]) * per + preview_offsetY[i];
        //                 $('.container').scrollTop(offset);
        //             }
        //         }
        //     };
        // });
    },
    render: function(){
        var self = this
        var blocks = this.props.status.sections.map(function(section, i){
            return (<Block section={section} key={i} onEdit={self.props.onEdit}>{section.md_text}</Block>)
        })
        return (<div className='edit' ref='edit' style={{height:this.props.status.edit_style.height + 'px'}}>
                    {blocks}
                </div>)
    }
});

var Block = React.createClass({
    render: function(){
        var self = this;
        var onInput = function(){
            return function(){
                    let section = self.refs.section, section_div_height = [];
                // token_offsetY  = [];
                // var tokens     = md.parse(this.refs.section.innerText, {}), 
                // n              = 0, 
                // h              = 0,
                // tmp_tokens     = [],
                // divs_offsetY   = [],
                // divs           = $(this.refs.section).children();
                // $(divs).each(function(idx, div){ 
                //     divs_offsetY.push(h);
                //     h += $(div).height();
                // });

                // for (var i = 0; i < tokens.length; i++) {
                //     tmp_tokens.push(tokens[i]);
                //     n += tokens[i].nesting;
                //     if(n == 0){
                //         var map_0 = tmp_tokens[0].map[0];
                //         token_offsetY.push(divs_offsetY[map_0]);
                //         tmp_tokens = [];
                //     }
                // };
                $(section).children().each(function(){
                    section_div_height.push($(this).height());
                });
                self.props.onEdit({
                    section_id: self.props.section.section_id,
                    md_text: section.innerText,
                    section_div_height: section_div_height,
                    section_tokens: md.parse(section.innerText, {})
                })
            }
        }
        return (<div className='section-warpper'>
                    <div className='section' ref='section' contentEditable onInput={onInput()}></div>
                </div>)
    }
})

var View = React.createClass({
    update: function(){
        var self = this;
        var children = $(this.refs.view).children(), h = 0, preview_offsetY = [];
        $(children).each(function(idx, child){
            preview_offsetY.push(h);
            h += $(child).height();
        });
        return preview_offsetY;
    },
    componentDidMount: function(){
        var self = this;
        setInterval(function(){
            self.props.onPreviewUpdate(self.update());
        }, 2500);    
    },
    render: function(){
        return (<div className='container' style={{height:this.props.view_style.height + 'px'}}>
                    <div className='view' ref='view' dangerouslySetInnerHTML={{ __html: this.props.view_html }}></div>
                </div>)
    }
});

function handleChange(){
    console.log('Current state:', store.getState());
}

var store = createStore(stateUtil),
    unsubscribe = store.subscribe(handleChange);

function stateUtil (state = initial_state, action) {
    var ns = Object.assign({}, state);
    switch (action.type) {
        case 'onInsert':
            ns.sections.push({
                section_id: ns.section_num++, 
                md_text: '',
                section_div_height: [0],
                section_tokens: []
            });
            return ns;
        case 'onEdit':
            let section = ns.sections[action.data.section_id];
            section.md_text = action.data.md_text;
            section.section_div_height = action.data.section_div_height;
            section.section_tokens = action.data.section_tokens;
            var md_text = ns.sections.reduce(function(prev, cur){
               return prev += cur.md_text;
            }, '');
            ns.view_html = md.render(md_text);
            return ns;
        case 'onResize':
            ns.editer_style.height = window.innerHeight;
            ns.edit_style.height = ns.view_style.height = window.innerHeight - 50;
            return ns;
        case 'onPreviewUpdate':
            ns.preview_offsetY = action.data.preview_offsetY;
            return ns;
        default:
            return ns;
    }
}

function mapStateToProps(state){
    return {
        status: state
    }
}

function mapDispatchToProps(dispatch){
    var onInsert = {
        type: 'onInsert',
        data: null
    }, onEdit = {
        type: 'onEdit',
        data: null
    }, onResize = {
        type: 'onResize',
        data: null
    }, onPreviewUpdate = {
        type: 'onPreviewUpdate',
        data: null
    }
    return {
        onInsert: function(){
            dispatch(onInsert);
        },
        onEdit: function(section){
            onEdit.data = section;
            dispatch(onEdit);
        },
        onResize: function(){
            dispatch(onResize);
        },
        onPreviewUpdate: function(preview_offsetY){
            onPreviewUpdate.data = preview_offsetY;
            console.log(preview_offsetY)
            dispatch(onPreviewUpdate);            
        }
    }
}

var App = connect(mapStateToProps, mapDispatchToProps)(Editor)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('editer')
)