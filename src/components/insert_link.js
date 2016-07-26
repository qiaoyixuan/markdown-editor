import React from 'react';
import ModalInner from './modal';
import _ from 'lodash';
import {MODAL} from './constant';

export default React.createClass({

    getInitialState: function () {
        return {
            input: ''
        };
    },

    handleChange: _.partial((context, path, e) => {
        var value = e.target ? e.target.value : e,
            state = _.cloneDeep(context.state, true);
        _.set(state, path, value);
        context.setState({
            ...state
        });
    }),

    render: function () {
        var {input} = this.state,
            info = input.split(/\s+/g),
            title = info[1] || '',
            address = info[0] || '',
            config = {
                type: "text",
                value: input,
                className: "form-control",
                onChange: (e) => this.handleChange(this, 'input', e),
                placeholder: "http://example.com/somewhere 标题"
            };

        return (<div>
                    <ModalInner>
                        <div>插入链接</div>
                        <div>
                            <div className="form-group photo-modal-inner">
                                <label>链接地址</label>
                                <input {...config} />
                            </div>
                            <button className="btn btn-primary pull-right mr30" onClick={() => {
                                this.props.onInsert(`[${title}](${address})`);
                                this.props.closeModal(MODAL.LINK);
                            }}>确定</button>
                        </div>
                    </ModalInner>
                </div>);
    }
});
