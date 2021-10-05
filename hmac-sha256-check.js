const {checkSeq, checkHmac} = require('./lib/crypto.js');

module.exports = function (RED) {
	RED.nodes.registerType('hmac-sha256-check', function (config) {
		RED.nodes.createNode(this, config);

		// Get shared key
		const keyConfig = RED.nodes.getNode(config.key);
		if (!keyConfig) return;
		const sharedKey = keyConfig.sharedKey;

		// Handle input
		this.on('input', ({payload}) => {
			const storeSeq = checkSeq(payload, this);
            checkHmac(payload, sharedKey);
            storeSeq();
			msgOut = JSON.parse(payload.data);
			this.send(msgOut);
		});
	});
}
