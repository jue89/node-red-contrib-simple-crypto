module.exports = function (RED) {
	RED.nodes.registerType('key', function (config) {
		RED.nodes.createNode(this, config);
		this.sharedKey = Buffer.from(config.sharedKey, 'hex');
	});
}
