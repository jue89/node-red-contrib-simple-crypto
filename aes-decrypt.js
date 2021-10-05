const {decrypt} = require('./lib/crypto.js');

module.exports = function (RED) {
	RED.nodes.registerType('aes-decrypt', function (config) {
		RED.nodes.createNode(this, config);

		// Get shared key
		const keyConfig = RED.nodes.getNode(config.key);
		if (!keyConfig) return;
		const sharedKey = keyConfig.sharedKey;

		// Handle input
		this.on('input', ({payload}) => {
			const msgOut = decrypt(payload, sharedKey);
			this.send(msgOut);
		});
	});
}
