const {addSeq, addHmac} = require('./lib/crypto.js');

module.exports = function (RED) {
	RED.nodes.registerType('hmac-sha256-gen', function (config) {
		RED.nodes.createNode(this, config);

		// Get shared key
		const keyConfig = RED.nodes.getNode(config.key);
		if (!keyConfig) return;
		const sharedKey = keyConfig.sharedKey;

		// Handle input
		this.on('input', (msgIn) => {
			const payload = {};
			addSeq(payload, this);
			payload.data = JSON.stringify(msgIn);
			addHmac(payload, sharedKey);
			this.send({payload});
		});
	});
}
