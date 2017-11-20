import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import { Nav, NavItem, Tabs, Tab, Badge, Grid, Button, Glyphicon, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as actions from "../../actions";
import status from '../../helpers/constants';
import OverallProgress from '../Common/overallProgress';
import ContentRow from '../Common/contentrow';
import Toast from '../Common/toaster';
import { upload } from "../../actions";
import config from '../../../../config';

const { datasiteBasePath } = config.get('app');
const { dsFolderPath } = config.get('API');
export class FileList extends Component {
    constructor(props) {
        super(props);
        this.getuploadList.bind(this);
        this.getCssClass.bind(this);
        this.getbgClass.bind(this);
        this.getGlyphClass.bind(this);
        this.handleDeeplink.bind(this);
        this.handleSelect.bind(this);
        this.state = { key: 1 };
    }
    shouldComponentUpdate(newProps, newState) {
        if ((this.props.Contents && this.props.Contents.length !== newProps.Contents.length) ||
            this.props.stats !== newProps.stats) {
            return true;
        }
        if (this.state.key !== newState.key) {
            return true;
        }
        return false;
    }
    getCssClass(contentStatus) {
        switch (contentStatus) {
            case status.PENDING:
                return "info";
            case status.ERROR:
            case status.CANCEL:
                return "danger";
            case status.INPROGRESS:
                return "warning";
            case status.COMPLETE:
                return "success";
            default:
                return "info";
        }
    }
    getbgClass(content) {
        switch (content.status) {
            case status.PENDING:
                return "pending";
            case status.ERROR:
            case status.CANCEL:
                return "danger";
            case status.INPROGRESS:
                return "warning";
            case status.COMPLETE:
                return "success";
            default:
                return "pending";
        }
    }
    getGlyphClass(content) {
        switch (content.status) {
            case status.CANCEL:
                return "ban-circle";
            case status.PENDING:
            case status.INPROGRESS:
                return "remove";
            case status.ERROR:
                return content.allowRetry ? "repeat" : "remove";
            case status.COMPLETE:
                return "ok";
            default:
                return "time";
        }
    }
    handleDeeplink(content) {
        const datasiteLink = datasiteBasePath + dsFolderPath.replace(':projectId', content.projectId).replace(":folderId", content.parentId);
        ipcRenderer && ipcRenderer.send('loadGH', datasiteLink);
    }
    getuploadList(filter) {
        let rootList = [];
        const contentList = [];
        this.props.Contents.forEach((content) => {
            const jsx = <ContentRow key={content.contentId}
                contentId={content.contentId}
                handleDeeplink={this.handleDeeplink}
                getbgClass={this.getbgClass}
                getGlyphClass={this.getGlyphClass}
                getCssClass={this.getCssClass}
            />;
            if (!filter) {
                if (content.isRoot) {
                    rootList.push(jsx);
                } else {
                    contentList.push(jsx);
                }
            }
            else if (content.status === filter && content.type === "DOCUMENT") {
                if (content.isRoot) {
                    rootList.push(jsx);
                } else {
                    contentList.push(jsx);
                }
            }
        });
        return (<div className="col-md-12 file-lists">
            {this.props.Contents.length > 0 && (
                <OverallProgress />)
            }
            <div className="rootFiles">
                {rootList}
            </div>
            <div className="allfiles">
                {contentList}
            </div>
        </div>);
    }
    handleSelect(key) {
        this.setState({ key });
    }
    render() {
        return (
            <div className="progressPlaceholder">
                <Nav bsStyle="pills" activeKey={this.state.key} onSelect={(e) => this.handleSelect(e)} id="uploads-tab">
                    <NavItem eventKey={1}>
                        <span> All Uploads <Badge>{this.props.stats.countTotal}</Badge></span>
                    </NavItem>
                    <NavItem eventKey={2}>
                        <span> Failed Uploads <Badge bsClass="badge-danger">{this.props.stats.countFailed}</Badge></span>
                    </NavItem>
                    <NavItem eventKey={3}>
                        <span> Successful Uploads <Badge bsClass="badge-success">{this.props.stats.countCompleted}</Badge></span>
                    </NavItem>
                    <NavItem eventKey={4}>
                        <span> Cancelled Uploads <Badge bsClass="badge-pending">{this.props.stats.countCancelled}</Badge></span>
                    </NavItem>
                </Nav>
                {this.state.key === 1 && this.getuploadList(null)}
                {this.state.key === 2 && this.getuploadList(status.ERROR)}
                {this.state.key === 3 && this.getuploadList(status.COMPLETE)}
                {this.state.key === 4 && this.getuploadList(status.CANCEL)}
            </div>
        );
    }
}
const mapStateToProps = state => {
    const projectId = state.user.project.projectId;
    const Contents = Object.keys(state.upload.uploadList)
        .filter((u) => state.upload.uploadList[u].projectId === projectId)
        .map(k => {
            const { isRoot, type, status: cStatus } = state.upload.uploadList[k];
            return {
                contentId: k,
                isRoot,
                type,
                status: cStatus
            };
        });
    const stats = state.upload.stats[projectId];
    return {
        Contents,
        projectId,
        stats
    };
};
export default connect(mapStateToProps)(FileList);
