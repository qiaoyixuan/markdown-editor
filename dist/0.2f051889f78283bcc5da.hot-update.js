webpackHotUpdate(0,{

/***/ 76:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */"use strict";

	if (true) {
	    (function () {
	        var ReactHotAPI = __webpack_require__(77),
	            RootInstanceProvider = __webpack_require__(85),
	            ReactMount = __webpack_require__(87),
	            React = __webpack_require__(139);module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () {
	            return RootInstanceProvider.getRootInstances(ReactMount);
	        }, React);
	    })();
	}try {
	    (function () {

	        'use strict';

	        function _interopRequireDefault(obj) {
	            return obj && obj.__esModule ? obj : { 'default': obj };
	        }

	        var _react = __webpack_require__(139);

	        var _react2 = _interopRequireDefault(_react);

	        var _reactDom = __webpack_require__(243);

	        var _reactDom2 = _interopRequireDefault(_reactDom);

	        var _redux = __webpack_require__(244);

	        var _reactRedux = __webpack_require__(254);

	        var _jquery = __webpack_require__(265);

	        var _jquery2 = _interopRequireDefault(_jquery);

	        var md = __webpack_require__(266)();
	        // mdContainer = require('markdown-it-container');
	        var token_height,
	            view_height = [];

	        md.core.ruler.at('replacements', function replace(state) {
	            token_height = [];
	            var tokens = state.tokens,
	                n = 0,
	                tmp_tokens = [],
	                divs = (0, _jquery2['default'])('.block_text').children(),
	                edit_height = [],
	                h = 0;

	            // console.log(divs)

	            (0, _jquery2['default'])(divs).each(function (idx, div) {
	                edit_height.push(h);
	                h += (0, _jquery2['default'])(div).height();
	            });

	            for (var i = 0; i < tokens.length; i++) {
	                tmp_tokens.push(tokens[i]);
	                n += tokens[i].nesting;
	                if (n == 0) {
	                    var map_0 = tmp_tokens[0].map[0];
	                    token_height.push(edit_height[map_0]);
	                    tmp_tokens = [];
	                }
	            };

	            // console.log('edit_height', edit_height);
	            // console.log('token_height', token_height);
	        });

	        var initial_state = {
	            block_num: 0,
	            block_text: [{
	                id: 0,
	                text: ''
	            }],
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
	        };

	        function stateUtil(state, action) {
	            if (state === undefined) state = initial_state;

	            var ns = Object.assign({}, state);
	            switch (action.type) {
	                case 'insert_block':
	                    ns.block_text.push({ id: ++ns.block_num, text: '' });
	                    return ns;
	                case 'editing':
	                    ns.block_text[action.data.block_id].text = action.data.block_text;
	                    var text = ns.block_text.reduce(function (prev, cur) {
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

	        var Editer = _react2['default'].createClass({
	            displayName: 'Editer',

	            componentDidMount: function componentDidMount() {
	                window.addEventListener('resize', this.props.handleResize);
	            },
	            render: function render() {
	                var _props = this.props;
	                var status = _props.status;
	                var insert_block = _props.insert_block;
	                var editing = _props.editing;
	                var handleResize = _props.handleResize;

	                return _react2['default'].createElement('div', { className: 'editer', style: { height: status.editer_style.height + 'px' } }, _react2['default'].createElement('div', { className: 'options' }, _react2['default'].createElement('button', { className: 'insert', onClick: insert_block }, 'newBlock')), _react2['default'].createElement(Edit, { status: status, editing: editing }), _react2['default'].createElement(View, { status: status, view_text: status.view_text }));
	            }
	        });

	        var Edit = _react2['default'].createClass({
	            displayName: 'Edit',

	            componentDidMount: function componentDidMount() {
	                var edit = _reactDom2['default'].findDOMNode(this.refs.edit),
	                    children = (0, _jquery2['default'])('.view')[0].children;
	                edit.addEventListener('scroll', function () {
	                    for (var i = 0; i < token_height.length - 1; i++) {
	                        if (this.scrollTop > token_height[i] && this.scrollTop < token_height[i + 1]) {
	                            var per = (this.scrollTop - token_height[i]) / (token_height[i + 1] - token_height[i]);
	                            if (per) {
	                                var offset = (view_height[i + 1] - view_height[i]) * per + view_height[i];
	                                (0, _jquery2['default'])('.container').scrollTop(offset);
	                            }
	                        }
	                    };
	                });
	            },
	            render: function render() {
	                var self = this;
	                var blocks = this.props.status.block_text.map(function (block, i) {
	                    return _react2['default'].createElement(Block, { block_id: block.id, key: i, editing: self.props.editing }, block.text);
	                });
	                return _react2['default'].createElement('div', { className: 'edit', ref: 'edit', style: { height: this.props.status.edit_style.height + 'px' } }, blocks);
	            }
	        });

	        var Block = _react2['default'].createClass({
	            displayName: 'Block',

	            render: function render() {
	                var self = this;
	                function getVal(fn) {
	                    return function () {
	                        fn(self.refs.textarea.getAttribute('data-block_id'), self.refs.textarea.innerText);
	                    };
	                }
	                return _react2['default'].createElement('div', { className: 'block' }, _react2['default'].createElement('div', { className: 'block_edit', ref: 'textarea', contentEditable: true, 'data-block_id': this.props.block_id, onInput: getVal(this.props.editing), className: 'block_text' }));
	            }
	        });

	        var View = _react2['default'].createClass({
	            displayName: 'View',

	            componentDidUpdate: function componentDidUpdate() {
	                var children = (0, _jquery2['default'])(this.refs.view).children(),
	                    h = 0;
	                // console.log('children', children)
	                view_height = [];
	                (0, _jquery2['default'])(children).each(function (idx, child) {
	                    view_height.push(h);
	                    h += (0, _jquery2['default'])(child).height();
	                });
	                console.log('view_height', view_height);
	            },
	            render: function render() {
	                return _react2['default'].createElement('div', { className: 'container', style: { height: this.props.status.view_style.height + 'px' } }, _react2['default'].createElement('div', { className: 'view', ref: 'view', dangerouslySetInnerHTML: { __html: this.props.view_text } }));
	            }
	        });

	        function handleChange() {
	            ///console.log('Current state:', store.getState());
	        }

	        var store = (0, _redux.createStore)(stateUtil),
	            unsubscribe = store.subscribe(handleChange);

	        Editer.propTypes = {
	            status: _react.PropTypes.object,
	            insert_block: _react.PropTypes.func,
	            handleResize: _react.PropTypes.func
	        };

	        /* actions */
	        var _insert_block = {
	            type: 'insert_block'
	        },
	            _editing = {
	            type: 'editing',
	            data: {
	                block_id: null,
	                block_text: null
	            }
	        },
	            _handleResize = {
	            type: 'handleResize'
	        };

	        /* map */
	        function mapStateToProps(state) {
	            return {
	                status: state
	            };
	        }

	        function mapDispatchToProps(dispatch) {
	            return {
	                insert_block: function insert_block() {
	                    dispatch(_insert_block);
	                },
	                editing: function editing(block_id, text) {
	                    _editing.data.block_id = block_id;
	                    _editing.data.block_text = text;
	                    dispatch(_editing);
	                },
	                handleResize: function handleResize() {
	                    dispatch(_handleResize);
	                }
	            };
	        }

	        var App = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Editer);

	        _reactDom2['default'].render(_react2['default'].createElement(_reactRedux.Provider, { store: store }, _react2['default'].createElement(App, null)), document.getElementById('editer'));

	        /* REACT HOT LOADER */
	    }).call(undefined);
	} finally {
	    if (true) {
	        (function () {
	            var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false;if (module.exports && module.makeHot) {
	                var makeExportsHot = __webpack_require__(336);if (makeExportsHot(module, __webpack_require__(139))) {
	                    foundReactClasses = true;
	                }var shouldAcceptModule = true && foundReactClasses;if (shouldAcceptModule) {
	                    module.hot.accept(function (err) {
	                        if (err) {
	                            console.error("Cannot not apply hot update to " + "index.js" + ": " + err.message);
	                        }
	                    });
	                }
	            }module.hot.dispose(function (data) {
	                data.makeHot = module.makeHot;data.foundReactClasses = foundReactClasses;
	            });
	        })();
	    }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module)))

/***/ }

})