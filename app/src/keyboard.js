import { KEYS, TOUCHY_KEYS } from './constants';

class Keyboard {
	constructor(app, config) {
		this.app = app;
		this.config = Object.assign({
			width: 700,
			height: 320
		}, config);
		this.app.events.manager_init.subscribe((manager) => {
			manager.events.key_down.subscribe(this.selectKey.bind(this));
			manager.events.key_up.subscribe(this.deselectKey.bind(this));
		});
		this.$container = $("<div class='keyboard'></div>").appendTo(this.app.$container);
		this.key_types = [
			{
				type: 'default',
				ratio: "9:10",
				font_ratio: "15:7"
			}, {
				type: 'tab',
				ratio: "16:10",
				font_ratio: "15:5"
			}, {
				type: 'delete',
				ratio: "16:10",
				font_ratio: "15:5"
			}, {
				type: 'return',
				ratio: "18:10",
				font_ratio: "15:5"
			}, {
				type: 'caps lock',
				ratio: "19:10",
				font_ratio: "15:5"
			}, {
				type: 'shift',
				ratio: "24.5:10",
				font_ratio: "15:5"
			}, {
				type: 'modifier',
				ratio: "9.5:10",
				font_ratio: "15:4"
			}, {
				type: 'command',
				ratio: "11:10",
				font_ratio: "16:4"
			}, {
				type: 'space',
				ratio: "57:10"
			}
		];
		this.scale = 4.0;
		this.keys = [];
		this.shifted_keys = [];
		this.key_codes = [];
		this.keys.push(['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'delete']);
		this.shifted_keys.push(['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'delete']);
		this.key_codes.push([192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, KEYS.BACKSPACE]);
		this.keys.push(['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\']);
		this.shifted_keys.push(['tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|']);
		this.key_codes.push([KEYS.TAB, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 220]);
		this.keys.push(['caps lock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'return']);
		this.shifted_keys.push(['caps lock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'return']);
		this.key_codes.push([KEYS.CAPSLOCK, 65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222, KEYS.RETURN]);
		this.keys.push(['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift']);
		this.shifted_keys.push(['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 'shift']);
		this.key_codes.push([KEYS.SHIFT, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191, KEYS.SHIFT]);
		this.keys.push(['fn', 'control', 'option', 'command', 'space', 'command', 'option']);
		this.shifted_keys.push(this.keys[this.keys.length-1]);
		this.key_codes.push([null, KEYS.CONTROL, KEYS.OPTION, KEYS.COMMAND, KEYS.SPACE, KEYS.COMMAND, KEYS.OPTION]);
		this.rows = this.keys.map((row, index) => {
			return new Row(this, row, index);
		});
		this.$container.append($("<div class='clear'></div>"));
	}

	shiftKeys() {
		var key, row, _i, _len, _ref, _results;
		_ref = this.rows;
		_results = [];
		for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			row = _ref[_i];
			_results.push((function() {
				var _j, _len2, _ref2, _results2;
				_ref2 = row.keys;
				_results2 = [];
				for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
					key = _ref2[_j];
					_results2.push(key.shift());
				}
				return _results2;
			})());
		}
		return _results;
	}

	unShiftKeys() {
		var key, row, _i, _len, _ref, _results;
		_ref = this.rows;
		_results = [];
		for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			row = _ref[_i];
			_results.push((function() {
				var _j, _len2, _ref2, _results2;
				_ref2 = row.keys;
				_results2 = [];
				for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
					key = _ref2[_j];
					_results2.push(key.unShift());
				}
				return _results2;
			})());
		}
		return _results;
	}

	selectKey(charCode, keyCode) {
		var key, row, _i, _len, _ref, _results;
		_ref = this.rows;
		_results = [];
		for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			row = _ref[_i];
			_results.push((function() {
				var _j, _len2, _ref2, _results2;
				_ref2 = row.keys;
				_results2 = [];
				for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
					key = _ref2[_j];
					if (key.match(charCode, keyCode)) {
						_results2.push(key.select());
					} else {
						_results2.push(void 0);
					}
				}
				return _results2;
			})());
		}
		return _results;
	}

	deselectKey(charCode, keyCode) {
		var key, row, _i, _len, _ref, _results;
		_ref = this.rows;
		_results = [];
		for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			row = _ref[_i];
			_results.push((function() {
				var _j, _len2, _ref2, _results2;
				_ref2 = row.keys;
				_results2 = [];
				for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
					key = _ref2[_j];
					if (key.match(charCode, keyCode)) {
						_results2.push(key.deselect());
					} else {
						_results2.push(void 0);
					}
				}
				return _results2;
			})());
		}
		return _results;
	}
}

class Row {
	constructor(keyboard, keys, index) {
		var key_codes, shifted_keys;
		this.keyboard = keyboard;
		this.index = index;
		shifted_keys = this.keyboard.shifted_keys[this.index];
		key_codes = this.keyboard.key_codes[this.index];
		this.keys = keys.map((key, index) => {
			var code, key_class;
			code = key_codes[index];
			key_class = Key;
			if (code === KEYS.SHIFT) key_class = ShiftKey;
			if (code === KEYS.CAPSLOCK) key_class = CapsLockKey;
			return new key_class(this.keyboard, this, key, shifted_keys[index], code, index);
		});
		this.keys[0].isFirst();
	}
}

class Key {
	constructor(keyboard, row, text, shifted_text, code, index) {
		this.keyboard = keyboard;
		this.row = row;
		this.text = text;
		this.shifted_text = shifted_text;
		this.code = code;
		this.index = index;
		this.$element = ($("<div class='key'>" + this.text + "</div>")).appendTo(keyboard.$container);
		this._initType();
		this._calibrate();
		this.shifted = false;
		this.selected = false;
	}

	match(charCode, keyCode) {
		return this.code === keyCode;
	}

	shift() {
		this.shifted = true;
		return this.$element.text(this.shifted_text);
	}

	unShift() {
		this.shifted = false;
		return this.$element.text(this.text);
	}

	select() {
		this.$element.addClass('active');
		return this.selected = true;
	}

	deselect() {
		this.$element.removeClass('active');
		return this.selected = false;
	}

	isFirst() {
		return this.$element.addClass('clear');
	}

	_initType() {
		var t, _i, _len, _ref, _results;
		_ref = this.keyboard.key_types;
		_results = [];
		for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			t = _ref[_i];
			if (this.text.match(t.type) || t.type === 'default') this.type = t;
			if (this.text.match(/(control)|(option)|(fn)/) && t.type === 'modifier') {
				_results.push(this.type = t);
			} else {
				_results.push(void 0);
			}
		}
		return _results;
	}

	_calibrate() {
		var font_ratio, font_size, height, ratio, width;
		ratio = this._parseRatio(this.type.ratio);
		font_ratio = this.type.font_ratio ? this._parseRatio(this.type.font_ratio) : [0, 0];
		width = ratio[0] * this.keyboard.scale;
		height = ratio[1] * this.keyboard.scale;
		font_size = (height / font_ratio[0]) * font_ratio[1];
		this.$element.css({
			width: width + 'px',
			height: height + 'px',
			fontSize: font_size + 'px',
			'line-height': height + 'px'
		});
		if (!font_size) {
			this.$element.text('');
			this.text = '';
			return this.shifted_text = '';
		}
	}

	_parseRatio(string) {
		return string.split(':').map((i) => {
			return parseFloat(i);
		});
	}
}

class ShiftKey extends Key {
	constructor(keyboard, row, text, shifted_text, code, index) {
		super(keyboard, row, text, shifted_text, code, index);
		this.keyboard.shift_key = this;
	}

	select() {
		super.select();
		if (this.keyboard.caps_lock_key.selected) {
			return this.keyboard.unShiftKeys();
		} else {
			return this.keyboard.shiftKeys();
		}
	}

	deselect() {
		super.deselect();
		if (this.keyboard.caps_lock_key.selected) {
			return this.keyboard.shiftKeys();
		} else {
			return this.keyboard.unShiftKeys();
		}
	}
}

class CapsLockKey extends Key {
	constructor(keyboard, row, text, shifted_text, code, index) {
		super(keyboard, row, text, shifted_text, code, index);
		this.keyboard.caps_lock_key = this;
	}

	select() {
		super.select();
		if (this.keyboard.shift_key.selected) {
			return this.keyboard.unShiftKeys();
		} else {
			return this.keyboard.shiftKeys();
		}
	};

	deselect() {
		super.deselect();
		if (this.keyboard.shift_key.selected) {
			return this.keyboard.shiftKeys();
		} else {
			return this.keyboard.unShiftKeys();
		}
	};
}

export { Keyboard, Row, Key, ShiftKey, CapsLockKey };
export default Keyboard;
