import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../actions";
import status from '../../helpers/constants';
import { ProgressBar, Button, Glyphicon } from 'react-bootstrap';
import { upload } from "../../actions";
import config from '../../../../config';

const { datasiteBasePath } = config.get('app');
const { dsFolderPath } = config.get('API');

export class ContentRow extends Component {
    constructor(props) {
        super(props);
        this.handleClick.bind(this);
    }
    handleClick(content, e) {
        if (content.status === status.ERROR) {
            if (content.allowRetry) {
                this.props.uploadContent(content.id, true);
            } else {
                this.props.removeContent(content.id);
            }
        }
        if (content.status === status.INPROGRESS ||
            content.status === status.PENDING) {
            this.props.cancelUpload(content.id);
        }
    }
    render() {
        const content = this.props.content;
        const CssClass = this.props.getCssClass(content.status);
        const glyClass = this.props.getGlyphClass(content);
        const bgClass = this.props.getbgClass(content);
        if (content.type === "DOCUMENT") {
            return (<div className="show-grid" key={content.id}>
                <div>
                    <div className="uploaderFolder">
                        <h3>{content.name}</h3>
                        <p>
                            <span className={bgClass}><b>{content.progress}% </b></span>
                            <span className="progressMsg"> / {content.message} {content.status === status.INPROGRESS && (content.attempts > 1 && content.attempts <= 3) && (` / Auto upload retry attempt ${content.attempts}.`)}</span>
                            <span className="progressMsg"> {content.status === status.COMPLETE && (
                                <span> / <a href="#" onClick={() => this.props.handleDeeplink(content)}> View in Datasite</a></span>
                            )}</span>
                        </p>
                    </div>
                    <ProgressBar
                        className="progressCustom"
                        bsClass="progressCustom-bar"
                        bsStyle={CssClass}
                        now={content.progress} />
                </div>
                <Button bsSize="large" onClick={() => this.handleClick(content)}>
                    <Glyphicon glyph={glyClass} className={bgClass} />
                </Button>
            </div>);
        }
        let depth = [];
        let depthCount = content.depth;
        while (depthCount > 0) {
            depth.push(<i key={depthCount} className="fa fa-minus minus-icon"></i>);
            depthCount--;
        }
        return (
            <div className="folder-row" key={content.id}>
                <div className="folder-content">
                    <span>{depth} <i className="fa fa-folder folder-icon" />
                        <span className="folder-name"> {content.name}</span>
                    </span>
                </div>
            </div>
        );
    }
}
const makeMapStateToProps = (initialState, initialOwnProps) => {
    const { contentId } = initialOwnProps;
    const mapStateToProps = (state) => {
        const content = state.upload.uploadList[contentId];
        return {
            content
        };
    };
    return mapStateToProps;
};
const mapDispatchToProps = (dispatch) => {
    return {
        uploadContent: (contentId, isRetry) => dispatch(upload.uploadContent(contentId, isRetry)),
        cancelUpload: (contentId) => dispatch(upload.cancelUpload(contentId)),
        removeContent: (contentId) => dispatch(upload.removeUpload(contentId))
    };
};
export default connect(makeMapStateToProps, mapDispatchToProps)(ContentRow);
