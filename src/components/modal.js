import React from 'react';

require('./modal.less');

export default React.createClass({
    render: function () {
        return (<div className="modal-inner">
                    {this.props.children}
                </div>);
    }
});
