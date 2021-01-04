import Event from './event';
import { KEYS } from './constants';
import { last as __last } from './util';

const DEFAULT_CONFIG = {
	font_size: 18,
	padding: 4,
	spacing: 3
};

class Page {
	constructor(base, config) {
		this.base = base;
		this.config = this.__expandConfig(config);

		this._initTemplate();

		this.rows = [];

		this.events = {
			next_space: new Event,
			next_page: new Event,
			hit: new Event,
			miss: new Event
		};

		this.base.events.manager_init.subscribe((manager) => {
			manager.events.key_press.subscribe(this._processKeyPress.bind(this));
			return manager.events.key_down.subscribe((charCode, keyCode) => {
				// Always match backspace events to allow getting out of a miss space
				if (keyCode === KEYS.BACKSPACE) {
					return this.current_space.match(keyCode);
				}
			});
		});

		this.__initText();
	}

	__expandConfig(config) {
		var config = Object.assign({}, DEFAULT_CONFIG, config);
		config.space_size = config.font_size + (config.padding * 2) + (config.spacing * 2);
		config.num_columns = Math.floor((config.width / config.space_size) + 1);
		config.num_rows = Math.max(Math.floor(config.height / config.space_size), 1);
		config.max_chars = config.num_columns * config.num_rows;
		return config;
	}

	__initText(text) {
		if (!text) {
			return this.base.defaultText((text) => {
				return this.__initText(text);
			});
		}
		this.words = text.split(/[\s\n\t]+/).map((word) => {
			return Word(this, word);
		});
		this.word_index = 0;
		return this.drawText();
	}

	drawText() {
		this.resetRows();
		if (this._start_with_space === true) {
			this._start_with_space = false;
			this.rows[0].spaces[0].setSpace();
			this.rows[0].space_index = 1;
		}
		if (this.word_index >= this.words.length) return this.__initText();
		this.rows.forEach((row, row_index) => {
			for (let i = 0, _ref = this.words.slice(this.word_index), _len = _ref.length; i < _len; i++) {
				let word = _ref[i];
				if (row.spaces.slice(row.space_index).length >= word.chars.length) {
					row.push.apply(row, word.chars);
					this.word_index += 1;
				} else {
					let last_space = row.spaces[row.space_index - 1];
					if (last_space) last_space.isLast();
					break;
				}
			};
		});
		var last_space = __last((__last(this.rows) || []).spaces);
		if (last_space.typeable && !last_space.is_space) this._start_with_space = true;
		this.current_space = this.rows[0].spaces[0];
		if (!this.current_space.typeable) this.nextSpace();
		this.current_space.select();
		return this.events.next_page.trigger();
	}

	nextSpace() {
		this.current_space.deselect();
		var space = this.current_space;
		var next = space.row.spaces[space.index + 1];
		var next_row;
		if (next_row = this.rows[space.row.index + 1]) {
			if (!next) next = next_row.spaces[0];
		}
		if (!next) return this.drawText();
		this.events.next_space.trigger({
			current: space,
			next: next
		});
		this.current_space = next;
		if (!this.current_space.typeable) this.nextSpace();
		return this.current_space.select();
	}

	resetRows() {
		this.rows.forEach((row) => { row.destroy(); });
		var rows = [];
		for (let i = 0, _len = this.config.num_rows; i < _len; i++) {
			rows[i] = new Row(this, i);
		}
		this.rows = rows;
	}

	_processKeyPress(charCode) {
		if (!this.current_space) return;
		if (this.current_space.match(charCode)) {
			this.current_space.hit();
			return this.nextSpace();
		} else {
			return this.current_space.miss(charCode);
		}
	}

	_initTemplate() {
		var element_id_index, html;
		element_id_index = {
			outer_container: 'page-outer-container',
			container: 'page-container'
		};
		html = "<div id='" + element_id_index.outer_container + "'>\n  <div id='" + element_id_index.container + "'>\n	</div>\n	<div class='clear'></div>\n</div>";
		($(html)).appendTo(this.base.$container);
		return this.$container = $("#" + element_id_index.container);
	}
}

class Row {
	constructor(page, index) {
		this.page = page;
		this.index = index;
		this.spaces = [];
		for (let i = 0, _len = this.page.config.num_columns; i < _len; i++) {
			this.spaces[i] = new Space(this.page, this, i);
		}
		this.spaces[0].isFirst();
		this.space_index = 0;
	}

	push() {
		var chars, next_row;
		chars = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
		chars.forEach((char, char_index) => {
			this.spaces[this.space_index].set(char);
			return this.space_index += 1;
		});
		if (this.spaces[this.space_index]) {
			this.spaces[this.space_index].setSpace();
		} else {
			if (next_row = this.page.rows[this.index + 1]) {
				next_row.spaces[next_row.space_index].setSpace();
				next_row.space_index += 1;
			}
		}
		return this.space_index += 1;
	}

	destroy() {
		return this.spaces.forEach((space) => {
			return space.$element.remove();
		});
	}
}

class Space {
	constructor(page, row, index) {
		this.page = page;
		this.row = row;
		this.index = index;
		this.$element = ($("<div class='page-row-space empty'>&nbsp;</div>")).appendTo(this.page.$container);
		this.$element.css({
			width: this.page.config.font_size
		});
		this.char_codes = [" ".charCodeAt(0)];
		this.typeable = false;
	}

	setSpace() {
		this.typeable = true;
		this.is_space = true;
		this.$element.html("&nbsp;");
		this.$element.removeClass('empty');
		return this.$element.addClass('space');
	}

	set(char) {
		this.char = char;
		this.$element.text(this.char.text);
		this.$element.addClass('page-row-char');
		this.$element.removeClass('empty');
		this.typeable = this.char.typeable;
		if (!this.typeable) return this.$element.addClass('skip');
	}

	match(charCode) {
		if (this.miss_space) {
			if (charCode === KEYS.BACKSPACE) {
				this.miss_space.$element.remove();
				this.miss_space = void 0;
			}
			return false;
		}
		if (this.char) {
			return this.char.code === charCode;
		} else {
			return this.char_codes.indexOf(charCode) !== -1;
		}
	}

	select() {
		return this.$element.addClass('active');
	}

	deselect() {
		return this.$element.removeClass('active');
	}

	hit() {
		this.page.events.hit.trigger(this);
		return this.$element.addClass('hit');
	}

	miss(charCode) {
		this.page.events.miss.trigger(this);
		this.$element.addClass('miss');
		this.miss_space || (this.miss_space = new MissSpace(this));
		return this.miss_space.set(String.fromCharCode(charCode));
	}

	isFirst() {
		return this.$element.addClass('first');
	}

	isLast() {
		return this.char_codes.push("\r".charCodeAt(0));
	}
}

class MissSpace {
	constructor(space) {
		var left, next_space, top;
		this.space = space;
		this.$element = ($("<div class='page-row-miss-space'>&nbsp;</div>")).appendTo(this.space.page.$container);
		next_space = this.space.row.spaces[this.space.index + 1];
		if (!next_space) {
			next_space = ((this.space.page.rows[this.space.row.index + 1] || {}).spaces || [])[0] || null;
		}
		top = (next_space || this.space).$element.position().top + 1;
		left = (next_space || this.space).$element.position().left + 1;
		this.$element.css({
			position: 'absolute',
			top: top,
			left: left,
			width: this.space.$element.width(),
			height: this.space.$element.height()
		});
	}

	set(text) {
		return this.$element.text(text);
	};
}

const Word = function (page, text) {
	var word = {
		page: page,
		text: text
	};
	word.chars = text.split('').map((char) => {
		return Char(page, word, char);
	});
	return word;
}

const TYPEABLE_MATCHER = /^[-a-z0-9_~`!@#$%^&*\(\)-+=\|\\\}\{\[\]"':;?\/><,.\s\t]$/i;
const Char = function (page, word, text) {
	return {
		page: page,
		word: word,
		text: text,
		typeable: text.match(TYPEABLE_MATCHER) !== null,
		code: text.charCodeAt(0)
	};
}

export { Page, Row, Space, MissSpace, Word, Char };
export default Page;
