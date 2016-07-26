import React from 'react';
import {MODAL} from './constant';

export default React.createClass({

    propTypes: function () {
        return {
            style: React.PropTypes.Object,
            openModal: React.PropTypes.func
        };
    },

    render: function () {
        let {openModal} = this.props;
        return (<div className="context-menu" style={this.props.style}>
                    <ul>
                        <li onClick={() => openModal(MODAL.PHOTO)}><span>插入图片</span></li>
                        <li onClick={() => openModal(MODAL.LINK)}><span>插入链接</span></li>
                    </ul>
                </div>);
    }
});
