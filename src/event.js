export default class Event {
	constructor() {
		this.subscribers = [];
	}

	subscribe(callback) {
		if (!this.subscribers.find((cb) => { return cb === callback })) {
			return this.subscribers.push(callback);
		}
	}

	trigger() {
		var args = Array.prototype.slice.call(arguments, 0);
		this.subscribers.map((callback) => { callback.apply(null, args) });
	}
}
