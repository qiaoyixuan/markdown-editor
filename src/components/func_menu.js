import React from 'react';

export default React.createClass({

    save: function () {
        var file_name = window.prompt("请输入文件名称");
        this.props.onSave(file_name);
    },

    render: function () {

        return (<ul className='opt-btns pull-right'>
                    <li><i className="fa fa-save" onClick={this.save} /></li>
                </ul>);
    }
});
