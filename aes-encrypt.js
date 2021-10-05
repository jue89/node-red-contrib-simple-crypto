const {encrypt} = require('./lib/crypto.js');

module.exports = function (RED) {
	RED.nodes.registerType('aes-encrypt', function (config) {
		RED.nodes.createNode(this, config);

		// Get shared key
		const keyConfig = RED.nodes.getNode(config.key);
		if (!keyConfig) return;
		const sharedKey = keyConfig.sharedKey;

		// Handle input
		this.on('input', (msgIn) => {
			const payload = encrypt(msgIn, sharedKey);
			this.send({payload});
		});
	});
}
