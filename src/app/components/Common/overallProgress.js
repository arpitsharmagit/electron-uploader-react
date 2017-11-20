import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../actions";
import status from '../../helpers/constants';
import { ProgressBar, Panel, Label, Grid, Row, Col } from 'react-bootstrap';

class OverallProgress extends Component {
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(newProps) {
        if (this.props.stats !== newProps.stats) {
            return true;
        }
        return false;
    }
    render() {
        return (
            <div className="summerycontainer">
                <div className="col-md-12 progressfile">
                    <Row>
                        <Col xs={4}>
                            <ProgressBar bsStyle="info" now={this.props.stats.overallProgress} />
                        </Col>
                        <Col xs={4}>
                            <strong>
                                <span style={{ color: '#0288D1' }}>{this.props.stats.overallProgress}%
                                </span> / {this.props.stats.countCompleted} of {this.props.stats.countTotal} uploaded
                            </strong>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const projectId = state.user.project.projectId;
    const stats = state.upload.stats[projectId];
    return {
        stats,
        projectId
    };
};
export default connect(mapStateToProps, null)(OverallProgress);
