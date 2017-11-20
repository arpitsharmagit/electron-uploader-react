import React, { Component } from 'react';
const setDropIndicator = (e, off) => {
	try {
		const nodeContainer = e.target.closest('.node-container').firstChild.lastChild;
		nodeContainer.style.display = off ? 'none' : 'block';
	} catch (err) {
		console.log(`element not found ${err}`);
	}
};
export default class TreeView extends Component {
	constructor(props) {
		super(props);
		this.nodeClick = this.nodeClick.bind(this);
		this.preventDefault = this.preventDefault.bind(this);
		this.dragenter = this.dragenter.bind(this);
		this.dragleave = this.dragleave.bind(this);
		this.drop = this.drop.bind(this);
		this.selectNode = this.selectNode.bind(this);
	}
	shouldComponentUpdate() {
		return true;
	}
	selectNode(nodeId) {
		this.props.onSelectNode(nodeId);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.projectId !== this.state.projectId || this.props.showFiles !== nextProps.showFiles) {
			this.setState({ projectId: nextProps.projectId, root: null });
		}
	}
	preventDefault(event) {
		event.preventDefault();
		event.dataTransfer.dropEffect = "copy";
	}
	dragenter(event, node, key) {
		event.preventDefault();
		if (node.state === 'collapsed') {
			this.nodeClick(null, null, key);
		}
		setDropIndicator(event);
		event.dataTransfer.dropEffect = "copy";
		return false;
	}
	dragleave(event) {
		setDropIndicator(event, true);
		event.preventDefault();
		return false;
	}
	drop(event, node) {
		event.preventDefault();
		setDropIndicator(event, true);
		const nodeId = node.item.id;
		const onDrop = this.props.onDrop;
		event.dataTransfer.items &&
			event.dataTransfer.files.length &&
			onDrop(event.dataTransfer.items, nodeId);
		event.dataTransfer.items &&
			event.dataTransfer.files.length && this.addRefreshIcon(node);
	}
	addRefreshIcon(node) {
		node.refreshIcon = true;
		this.forceUpdate();
	}
	loadNodes(parent) {
		const _onGetNodes = this.props.onGetNodes;
		const fileRoomitem = parent ? parent.item : null;
		const fileRoomRes = _onGetNodes(fileRoomitem);
		const self = this;
		return fileRoomRes.then(items => {
			if (!items) {
				return [];
			}
			const nodes = self.createNodes(items);
			return nodes;
		});
	}

	createNodes(items) {
		const isLeaf = this.props.checkLeaf;
		return items.map(item => {
			const leaf = isLeaf ? isLeaf(item) : false;
			return { item: item, state: 'collapsed', children: null, leaf: leaf, refreshIcon: false };
		});
	}

	createNodesView() {
		const self = this;
		const mountList = function (nlist, level, parentkey) {
			let count = 0;
			const fileRoomLst = [];
			const totalNodes = nlist.length;
			nlist.forEach((node) => {
				let childerns;
				const key = (parentkey ? parentkey + '.' : '') + count;
				if (node.state !== 'collapsed' && !node.leaf && node.children) {
					childerns = mountList(node.children, level + 1, key);
				} else {
					childerns = mountList([], level + 1, key);
				}
				const row = self.createNodeRow(node, level, key, childerns, count === totalNodes - 1);
				fileRoomLst.push(row);
				count++;
			});
			const divkey = (parentkey ? parentkey : '') + '';
			return (
				<ul className="tre-list" key={divkey + 'trans'}>
					{fileRoomLst}
				</ul>
			);
		};
		return mountList(this.state.root, 0, null);
	}

	resolveIcon(node) {
		const prop = this.props;
		let icon;
		const { docType } = node.item;
		if (node.leaf && docType !== 'DOCUMENT') {
			icon = prop.iconLeaf;
		} else if (node.leaf && docType === 'DOCUMENT') {
			icon = prop.iconFile;
		}
		else {
			icon = node.state !== 'collapsed' ? prop.iconMinus : prop.iconPlus;
		}
		var className = 'fa fa-' + icon + ' fa-fw';
		icon = <i className={className} />;
		return icon;
	}
	resolveFolderIcon(node) {
		const { docType } = node.item;
		const prop = this.props;
		let folderIcon = node.state !== 'collapsed' ? prop.folderOpen : prop.folderCollapsed;
		var className = 'fa fa-' + folderIcon + ' fa-fw';
		folderIcon = docType === 'DOCUMENT' ? null : <i className={className} />;
		return folderIcon;
	}

	createNodeRow(node, level, key, childerns, isLast) {
		const prop = this.props;
		const nodeId = node.item.id;
		const { docType } = node.item;
		const needRefresh = node.refreshIcon;
		const content = prop.innerRender ? prop.innerRender(node.item, node.item.id) : node.item;
		const icon = this.resolveIcon(node);
		const folerIcon = this.resolveFolderIcon(node);
		const nodeClass = `droptraget node node-${docType}`;
		const waitIcon = node.state === 'expanding' ?
			<span className={`fa ${prop.refreshIcon}`} /> : null;
		const nodeIcon = node.leaf ?
			icon :
			<a className="node-link" onClick={this.nodeClick} data-item={key}>
				{icon}
			</a>;
		const nodeRefreshIcon = needRefresh ?
			<span
				onClick={() => { this.refreshclick(node, key); }}
				className={` ${prop.nodeRefreshIcon}`} /> : null;
		const nodeRow = (
			<div className='node-container'>
				<div
					onDragEnter={(e) => { this.dragenter(e, node, key); }}
					onDragOver={this.preventDefault}
					onDrop={(e) => { this.drop(e, node); }}
					key={key} className={nodeClass}>
					{nodeIcon}
					{nodeRefreshIcon}
					<span className="node-content" onClick={() => { this.selectNode(nodeId); }}>
						{folerIcon}
						{waitIcon}
						{content}
					</span>
					<div
						onDragLeave={(e, data) => { this.dragleave(e); }}
						className="tree-drop-target"></div>
				</div>
			</div>
		);
		return prop.outerRender ? prop.outerRender(nodeRow, node.item, childerns, isLast) : nodeRow;
	}
	refreshclick(node, key) {
		node.refreshIcon = false;
		node.state = 'collapsed';
		node.children = null;
		this.nodeClick(null, null, key);
	}
	nodeClick(evt, data, _key) {
		const key = _key || evt.currentTarget.getAttribute('data-item');
		let lst = this.state.root;
		let node = null;
		key.split('.').forEach(index => {
			node = lst[Number(index)];
			lst = node.children;
		});
		if (node.state === 'collapsed') {
			this.expandNode(node);
		}
		else {
			this.collapseNode(node);
		}
	}

	expandNode(node) {
		if (!node.children) {
			node.state = 'expanding';
			this.forceUpdate();
			const self = this;
			this.loadNodes(node)
				.then(res => {
					node.state = 'expanded';
					node.children = res;
					self.forceUpdate();
				}).catch(() => {
					node.state = 'collapsed';
					node.children = null;
					self.forceUpdate();
				});
		}
		else {
			node.state = 'expanded';
			this.forceUpdate();
		}
	}

	collapseNode(node) {
		node.state = 'collapsed';
		this.forceUpdate();
	}
	renderTopBorderHider() {
		return (<span className="tree-top-border-control" />);
	}
	render() {
		const root = this.state ? this.state.root : null;
		const { refreshIcon } = this.props;
		if (!root) {
			const self = this;
			this.loadNodes()
				.then(res => self.setState({ root: res }));
			return <i className={`fa ${refreshIcon}`} />;
		}
		return <div className="tree-view">
			{this.renderTopBorderHider()}
			{this.createNodesView()}
		</div>;
	}
}

TreeView.defaultProps = {
	iconPlus: 'plus-square-o',
	iconMinus: 'minus-square-o',
	iconLeaf: 'noleaf',
	iconFile: 'file-o file-icon',
	folderCollapsed: 'folder folder-nu',
	folderOpen: 'folder-open folder-nu',
	refreshIcon: 'fa-refresh fa-fw fa-spin',
	nodeRefreshIcon: 'fa fa-refresh node-refresh',
	iconSize: 1,
	indent: 30
};
