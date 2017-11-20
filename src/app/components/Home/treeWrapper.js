import React, { Component } from 'react';
import { connect } from 'react-redux';
import TreeView from './treeview';
import helper from '../../helpers';
import { upload } from "../../actions";
class Tree extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedNodeId: null,
			showFiles: false
		};
		this.getAsyncNodes = this.getAsyncNodes.bind(this);
		this.onDrop = this.onDrop.bind(this);
		this.onSelectNode = this.onSelectNode.bind(this);
		this.innerNode = this.innerNode.bind(this);
		this.handleClickBrowse = this.handleClickBrowse.bind(this);
		this.checkFiles = this.checkFiles.bind(this);
	}
	checkFiles(e) {
		const projectId = this.props.user.project.projectId;
		const { selectedNodeId } = this.state;
		this.props.createMetadata(projectId, selectedNodeId, e.target.files, true);
		e.target.value = "";
	}
	getNodes(parentFolder, folders) {
		const level = parentFolder ? parentFolder.level : 0;
		const size = folders.length;
		const nodeList = [];
		for (let i = 0; i < size; i++) {
			nodeList.push({ ...folders[i], level: level + 1 });
		}
		return nodeList;
	}
	checkLeaf(item) {
		return item.leaf || item.docType === "DOCUMENT";
	}

	getAsyncNodes(parentFolder) {
		const self = this;
		try {
			const apiCall = parentFolder && parentFolder.id ?
				() => {
					return helper.apiHelper.getFolders(this.props.projectId, parentFolder.id, this.state.showFiles);
				}
				:
				() => {
					return helper.apiHelper.getFileRoom(this.props.projectId);
				};
			return new Promise((resolve, reject) => {
				apiCall().then((response) => {
					return response.json();
				}).then((data) => {
					var folders = data.children.map((folder) => {
						const { id, type, name, leaf, extension } = folder;
						const fullName = type === 'DOCUMENT' && extension ? `${name}.${extension}` : name;
						return {
							id,
							name: fullName,
							leaf,
							docType: type
						};
					});
					resolve(self.getNodes(parentFolder, folders));
				}).catch(() => {
					reject("Fileroom error");
				});
			});
		} catch (e) {
			return null;
		}
	}

	innerNode(item, id) {
		const { selectedNodeId } = this.state;
		const className = selectedNodeId === id ? "tree-folder-name selected" : "tree-folder-name";
		return (<span className={className}>{item.name}</span>);
	}

	outerNode(content, item, children, isLastRow) {
		return (
			<li key={item.id} className={`treview-row container-tree ${isLastRow ? "last-row" : ""}`}>
				{content}
				{children}
			</li>
		);
	}
	onDrop(dropData, dropTarget) {
		this.props.createMetadata(this.props.user.project.projectId, dropTarget, dropData);
	}
	onSelectNode(nodeId) {
		this.setState({ selectedNodeId: nodeId });
	}
	handleClickBrowse() {
		this.refs.fileUploader.click();
	}
	onChangeShowFiles(checked){
		this.setState({showFiles: checked});
	}
	browseLink(isSelected) {
		return (<div>
			<p className="browse-myfiles">Drag and drop files on the folders below or {isSelected ? " click " : " select "}
				{isSelected && <span
					onClick={this.handleClickBrowse}
					className="browse-button-myfiles">Browse</span>}
				{!isSelected && (<span>folder</span>)}	 to upload.
				<label className="float-right-label"><input
			onChange={(e)=>{ this.onChangeShowFiles(e.target.checked); }} type="checkbox" value={this.state.showFiles} />show files</label></p>
			<input type="file" id="myfile" ref="fileUploader"
				onChange={(event) => { this.checkFiles(event); }} style={{ display: "none" }} />
		</div>);
	}
	render() {
		return (
			<div className="col-md-12 col-xs-12 col-lg-12 myfiles myfiles">
				{this.browseLink(this.state.selectedNodeId)}
				<div className="file-lists col-md-12 col-xs-12 col-lg-12">
					<TreeView onGetNodes={this.getAsyncNodes}
						innerRender={this.innerNode}
						outerRender={this.outerNode}
						onDrop={this.onDrop}
						checkLeaf={this.checkLeaf}
						showFiles={this.state.showFiles}
						onSelectNode={this.onSelectNode} />
				</div>
			</div>
			);
	}
}
const mapStateToProps = state => {
	return {
				user: state.user
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
				createMetadata: (projectId, parentId, files, isPicker) =>
			dispatch(upload.createMetadata(projectId, parentId, files, isPicker))
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Tree);
