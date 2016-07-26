import React from 'react';
import ModalInner from './modal';
import _ from 'lodash';

export default React.createClass({

    getInitialState: function () {
        return {
            address: ''
        };
    },

    handleChange: _.partial((context, path, e) => {
        var value = e.target ? e.target.value : e;
        _.set(context, path, value);
        context.setState({
            ...context.state
        });
    }),

    render: function () {
        var {address} = this.state,
            config = {
                type: "text",
                value: address,
                className: "form-control",
                onChange: (e) => this.handleChange(this, 'state.address', e),
                placeholder: "http://example.com/images/diagram.jpg '可选标题'"
            };

        return (<div>
                    <ModalInner>
                        <div>插入图片</div>
                        <div>
                            <div className="form-group photo-modal-inner">
                                <label>图片地址</label>
                                <input {...config} />
                            </div>
                        </div>
                    </ModalInner>
                </div>);
    }
});
