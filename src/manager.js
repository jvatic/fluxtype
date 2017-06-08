import Event from './event';
import { KEYS, TOUCHY_KEYS } from './constants';

export default class Manager {
	constructor(base) {
		this.base = base;
		this.$hidden_input = ($("<textarea type='text' class='hidden-input' value='Q'></textarea>")).prependTo(this.base.$container);
		this.events = {
			key_press: new Event,
			key_down: new Event,
			key_up: new Event
		};
		this.base.events.manager_init.trigger(this);
		($(document)).bind('keypress', this.processKeyPress.bind(this));
		($(document)).bind('keydown', this.processKeyDown.bind(this));
		($(document)).bind('keyup', this.processKeyUp.bind(this));
		($(document)).bind('focus', () => {
			[KEYS.CONTROL, KEYS.COMMAND, KEYS.OPTION, KEYS.SHIFT].forEach((keyCode) => {
				this.base.keyboard.deselectKey(null, keyCode);
			});
		});
	}

	processKeyPress(e) {
		this.$hidden_input.val('Q');
		if (e.keyCode === KEYS.BACKSPACE) return null;
		e.charCode || (e.charCode = e.which);
		return this.events.key_press.trigger(e.charCode);
	}

	processKeyDown(e) {
		if (TOUCHY_KEYS.indexOf(e.keyCode) !== -1) e.preventDefault();
		return this.events.key_down.trigger(e.charCode, e.keyCode);
	}

	processKeyUp(e) {
		return this.events.key_up.trigger(e.charCode, e.keyCode);
	}
}
