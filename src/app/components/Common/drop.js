import React, { Component } from 'react';
import { connect } from 'react-redux';
import { upload } from "../../actions";
import helper from '../../helpers';
class DropContainer extends Component {
    constructor(props) {
        super(props);
        this.handleClickBrowse = this.handleClickBrowse.bind(this);
        this.checkFiles = this.checkFiles.bind(this);
    }
    componentDidMount() {
        // this.refs.fileUploader.setAttribute('webkitdirectory', '');
        // this.refs.fileUploader.setAttribute('directory', '');
        this.refs.fileUploader.setAttribute('multiple', '');
    }
    preventDefault(event) {
        event.preventDefault();
    }
    handleClickBrowse(e) {
        this.refs.fileUploader.click();
    }
    checkFiles(e) {
        const projectId = this.props.user.project.projectId;
        const folderId = this.props.location.folderId;
        this.props.createMetadata(projectId, folderId, e.target.files, true);
        e.target.value = "";
    }
    dragenter(event) {
        // remove drag over effect.
        event.preventDefault();
        const basket = document.getElementById("dropBasket");
        basket.style.background = "#DDF3FE";
    }
    dragleave(event) {
        // remove drag over effect.
        event.preventDefault();
        const basket = document.getElementById("dropBasket");
        basket.style.background = "#FFFFFF";
    }
    drop(event) {
        event.preventDefault();
        const basket = document.getElementById("dropBasket");
        basket.style.background = "#FFFFFF";
        let files = event.dataTransfer.items;
        event.dataTransfer.items
            && event.dataTransfer.files.length &&
            this.props.createMetadata(this.props.user.project.projectId, this.props.location.folderId, files);
    }
    render() {
        return (
            <div className="uploadPlaceholder"
                id="dropBasket"
                onDragEnter={this.dragenter.bind(this)}
                onDragLeave={this.dragleave.bind(this)}
                onDragOver={this.preventDefault.bind(this)}
                onDrop={this.drop.bind(this)}>
                <input type="file" id="file" ref="fileUploader"
                    onChange={(event) => { this.checkFiles(event); }} style={{ display: "none" }} />
                <div><i className="fa fa-arrow-down" aria-hidden="true" ></i></div>
                <div><i className="fa fa-folder fa-folder-large" aria-hidden="true" ></i></div>
                <div className="quick-drop">QuickDrop</div>
                <div>
                    <span className="drag-and-drop-files">Drag and drop files anywhere in this window or browse below
                 to upload to the "Desktop Upload" folder in your project.</span>
                </div>
                <div onClick={this.handleClickBrowse}><span className="browse-button">Browse</span></div>
            </div >);
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        location: state.location
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        createMetadata: (projectId, parentId, files, isPicker) =>
            dispatch(upload.createMetadata(projectId, parentId, files, isPicker))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(DropContainer);
