import Status from './status';
import { Page } from './page';
import Keyboard from './keyboard';
import Event from './event';
import Manager from './manager';
import Hangman from './hangman';
import { last as __last } from './util';

export default class FluxType {
	constructor($container) {
		this.$container = $container;
		this.events = {
			page_init: new Event,
			manager_init: new Event
		};
		this.drawUI();
	}

	drawUI() {
		this.status = new Status(this);
		this.page = new Page(this, {
			width: this.$container.innerWidth(),
			height: 160,
			left: 50,
			top: 20
		});
		this.events.page_init.trigger();
		this.keyboard = new Keyboard(this, {
			width: this.$container.width() - 100,
			height: 320
		});
		if (__last(window.location.href.split('/')) === 'hangman') {
			this.hangman = new Hangman(this);
		}
		this.manager = new Manager(this);
	}

	defaultText(callback) {
		return $.ajax({
			url: '/text',
			success: (text) => {
				callback(text);
			},
			error: () => {
				callback("Something went wrong.\n Please try again!");
			}
		});
	}
}
