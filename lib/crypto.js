const crypto = require('crypto');
const assert = require('assert');
const os = require('os');

function addSeq (p, node) {
	// Generate sequence number
	const seq = (node.context().get('seq') || 0) + 1;
	node.context().set('seq', seq);

	// Use node id as context for sequence counting
	const ctx = `${os.hostname()}-${node.id}`;

	Object.assign(p, {seq, ctx});
}

function checkSeq (p, node) {
	assert(typeof p.seq === 'number', 'Seqence must be a number');
	assert(typeof p.ctx === 'string' && p.ctx.length > 8, 'Context name missing or invalid');
	const lastSeenSeq = node.context().get(p.ctx) || 0;
	assert(p.seq > lastSeenSeq, 'Replay attack!');
	return () => node.context().set(p.ctx, p.seq);
}

function calcHmac (p, key) {
	const hmac = crypto.createHmac('sha256', key);

	// Hash ctx / id
	assert(typeof p.ctx === 'string' && p.ctx.length > 8, 'Context name missing or invalid');
	assert(typeof p.seq === 'number', 'Seqence must be a number');
	hmac.update(`${p.ctx}\0${p.seq}\0`);

	// Hash payload
	assert(typeof p.data === 'string');
	hmac.update(p.data);

	return hmac.digest('hex');
}

function addHmac (p, key) {
	p.hmac = calcHmac(p, key);
}

function checkHmac (p, key) {
    assert(p.hmac, 'No HMAC present');
	assert(p.hmac === calcHmac(p, key), 'Invalid HMAC');
}

function encrypt (data, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const ciphertext = Buffer.concat([
        cipher.update(JSON.stringify(data), 'utf8'),
        cipher.final()
    ]).toString('base64');
    return {data: ciphertext.toString('base64'), iv: iv.toString('base64')};
}

function decrypt ({data, iv}, key) {
    assert(typeof iv === 'string');
    iv = Buffer.from(iv, 'base64');
    assert(iv.length === 16);
    assert(typeof data === 'string');
    data = Buffer.from(data, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    return JSON.parse(Buffer.concat([
        decipher.update(data),
        decipher.final()
    ]).toString('utf8'));
}

module.exports = {addSeq, checkSeq, addHmac, checkHmac, encrypt, decrypt};
