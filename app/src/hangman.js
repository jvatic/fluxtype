export default class Hangman {
	constructor(base) {
		var height, width, x, y, _ref;
		this.base = base;
		_ref = [40, 350, 200, 200], x = _ref[0], y = _ref[1], width = _ref[2], height = _ref[3];
		this.paper = new Raphael(x, y, width, height);
		this.gallows = this.paper.path("M0," + height + " L" + width + "," + height + " M60," + height + " L60,0 L180,0 L180,40\nM60,60 L120,0");
		this.trapdoor = this.paper.path("M" + width + "," + height + " L" + (width - 100) + "," + height);
		this.trapdoor.attr('stroke', '#ffffff').hide();
		this.person = {
			head: this.paper.circle(180, 54, 14).hide(),
			torso: this.paper.path("M180,68 L180, 120").hide(),
			legs: {
				left: this.paper.path("M180,120 L160,160").hide(),
				right: this.paper.path("M180,120 L2009-0,160").hide()
			},
			arms: {
				left: this.paper.path("M180,80 L160,100").hide(),
				right: this.paper.path("M180,80 L200,100").hide()
			}
		};
		this.gameover = this.paper.text(140, 80, "Game Over\nReload to play again!");
		this.gameover.attr({
			'font-size': 10,
			stroke: '#E21A10',
			'cursor': 'pointer'
		});
		this.gameover.rotate(-20);
		this.gameover.hide();
		this.gameover.click(function() {
			return window.location.reload();
		});
		this.game_status = this.paper.text(90, 30, "Level 1\nScore: 0");
		this.game_status.rotate(-45);
		this.high_score_display = this.paper.text(105, 90, "High Score:");
		this.data = new Store('hangman', {
			high_score: 0
		});
		this.high_score = this.data.get('high_score');
		this.wpm_index = this.base.status.wpms.length;
		this.misses = 0;
		this.score = 0;
		this.level = 0;
		this.score = 0;
		this.page_number = -1;
		this.total_misses = 0;
		this.level_scale = {
			1: 4,
			2: 3,
			3: 2,
			4: 1,
			5: 0.5,
			6: 0.25,
			7: 0.125
		};
		this.behaviour = [
			{
				e: this.person.head,
				thresh: 1
			}, {
				e: this.person.torso,
				thresh: 2
			}, {
				e: this.person.arms.left,
				thresh: 3
			}, {
				e: this.person.arms.right,
				thresh: 4
			}, {
				e: this.person.legs.left,
				thresh: 5
			}, {
				e: this.person.legs.right,
				thresh: 6
			}
		];
		this.base.page.events.next_page.subscribe(this.upLevel.bind(this));
		this.base.page.events.hit.subscribe(this.hit.bind(this));
		this.base.page.events.miss.subscribe(this.miss.bind(this));
	}

	hit() {
		return this.updateGameStatus();
	}

	miss() {
		this.misses += 1;
		this.total_misses += 1;
		return this.process();
	}

	upLevel() {
		this.page_number += 1;
		if (this.score > this.high_score && this.level > 0) {
			this.high_score = this.score;
			this.data.set('high_score', this.score);
		}
		this.high_score_display.attr("text", "High Score: " + (this.high_score.toFixed(2)));
		if (this.level === 7) return this.updateGameStatus();
		this.level += 1;
		this.misses = 0;
		this.person.head.hide();
		this.person.torso.hide();
		this.person.legs.left.hide();
		this.person.legs.right.hide();
		this.person.arms.left.hide();
		this.person.arms.right.hide();
		return this.updateGameStatus();
	}

	updateGameStatus() {
		var wpm_avg;
		wpm_avg = this.base.status.wpmAvg(this.base.status.wpms.slice(this.wpm_index));
		this.score = 24 + (this.page_number * this.level) - this.total_misses + wpm_avg;
		return this.game_status.attr("text", "Level " + this.level + "\nScore: " + (this.score.toFixed(2)));
	}

	process() {
		var part, parts_shown, _i, _len, _ref;
		if (this.dead) return;
		this.updateGameStatus();
		parts_shown = 0;
		_ref = this.behaviour;
		for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			part = _ref[_i];
			if (this.misses >= (part.thresh * this.level_scale[this.level])) {
				part.e.show();
				parts_shown += 1;
			}
		}
		if (parts_shown === this.behaviour.length) {
			this.personDie();
			this.gameover.show();
			return this.dead = true;
		}
	}

	personDie() {
		this.person.head.animate({
			cy: 200
		}, 400, 'bounce');
		this.person.torso.animate({
			path: "M180,200"
		}, 400);
		this.person.legs.left.animate({
			path: "M180,200"
		}, 400);
		this.person.legs.right.animate({
			path: "M180,200"
		}, 400);
		this.person.arms.left.animate({
			path: "M180,200"
		}, 400);
		return this.person.arms.right.animate({
			path: "M180,200"
		}, 400);
	}
}
