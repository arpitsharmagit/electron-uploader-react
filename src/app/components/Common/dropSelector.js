import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fileroom } from "../../actions";
import { DropdownButton, MenuItem } from 'react-bootstrap';
class DropSelector extends Component {
    constructor(props) {
        super(props);
        this.handleSwitch = this.handleSwitch.bind(this);
    }
    handleSwitch(e){
        this.props.switchDropLocation(e);
    }
    render() {
        const title = this.props.isMyFolders ? "Choose a location" : "QuickDrop";
        return (
            <div className="upload-location">
                <DropdownButton title={title} id="locationSwitch" className="" onSelect={(e) => this.handleSwitch(e)}>
                    <MenuItem eventKey={false}>QuickDrop</MenuItem>
                    <MenuItem eventKey={true}>Choose a location</MenuItem>
                </DropdownButton>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        isMyFolders: state.location.isMyFolders
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        switchDropLocation: (isMyFolders) =>
            dispatch(fileroom.switchDropLocation(isMyFolders))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(DropSelector);


