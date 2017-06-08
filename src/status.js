export default class Status {
	constructor(base) {
		this.base = base;
		this.hits = [];
		this.misses = [];

		this.session_date = (new Date).toString().replace(/(\d{2}\s\d{4}).*$/, "$1");
		this.saved_data = new Store('Status', {
			hit_speeds: [],
			hit_speed_index: 0,
			wpms: [],
			hit_counts: {},
			miss_counts: {}
		});

		this.hit_counts = this.saved_data.get('hit_counts');
		this.hit_counts[this.session_date] || (this.hit_counts[this.session_date] = 0);
		this.miss_counts = this.saved_data.get('miss_counts');
		this.miss_counts[this.session_date] || (this.miss_counts[this.session_date] = 0);

		this.last_hit_at = null;
		this.word_index = 0;
		this.word_length = 5;
		this.hit_speeds = this.saved_data.get('hit_speeds');
		this.hit_speed_index = this.saved_data.get('hit_speed_index');
		this.wpms = this.saved_data.get('wpms');
		this.wpm_buffer = 3;

		this.$container = ($("<div class='status-container'></div>")).appendTo(this.base.$container);
		this.$hits = ($("<div class='status-hits'>0.0</div>")).appendTo(this.$container);
		this.$misses = ($("<div class='status-misses'>0.0</div>")).appendTo(this.$container);
		this.$wpm = ($("<div class='status-wpm'>0.0</div>")).appendTo(this.$container);
		this.$accuracy = ($("<div class='status-accuracy'>100</div>")).appendTo(this.$container);

		this.base.events.page_init.subscribe(() => {
			this.base.page.events.hit.subscribe(this.recordHit.bind(this));
			this.base.page.events.miss.subscribe(this.recordMiss.bind(this));
		});

		this.update();
	}

	update() {
		var accuracy, hit_count, miss_count;
		hit_count = this.hit_counts[this.session_date];
		miss_count = this.miss_counts[this.session_date];
		this.$hits.text(hit_count);
		this.$misses.text(miss_count);
		this.$wpm.text(this.wpmBufferAvg().toFixed(2));
		accuracy = ((hit_count - miss_count) / (hit_count + miss_count)) * 100;
		accuracy || (accuracy = 0);
		return this.$accuracy.text(accuracy.toFixed(2));
	}

	wpmBufferAvg() {
		var wpms;
		wpms = this.wpms.slice(Math.min(this.wpms.length - this.wpm_buffer, this.wpms.length - 1));
		return this.wpmAvg(wpms);
	}

	wpmAvg(wpms) {
		return ((wpms.reduce(((sum, wpm) => {
			return sum + wpm;
		}), 0)) / wpms.length) || 0;
	}

	recordHitSpeed(seconds) {
		this.hit_speeds.push(seconds);
		this.saved_data.set('hit_speeds', this.hit_speeds);
		var hits = this.hit_speeds.slice(this.hit_speed_index);
		if (hits.length === this.word_length) {
			this.hit_speed_index = this.hit_speeds.length;
			this.saved_data.set('hit_speed_index', this.hit_speed_index);
			var time = hits.reduce(((sum, time) => {
				return sum += time;
			}), 0);
			var speed = 60 / time;
			this.wpms.push(speed);
			return this.saved_data.set('wpms', this.wpms);
		}
	}

	recordHit(page_space) {
		var last_hit_at = this.last_hit_at;
		var current_hit_at = new Date;
		this.last_hit_at = current_hit_at;
		this.recordHitSpeed((current_hit_at - last_hit_at) / 1000);
		this.hits.push(page_space);
		this.hit_counts[this.session_date] += 1;
		this.saved_data.set('hit_counts', this.hit_counts);
		return this.update();
	}

	recordMiss(page_space) {
		this.misses.push(page_space);
		this.miss_counts[this.session_date] += 1;
		this.saved_data.set('miss_counts', this.miss_counts);
		return this.update();
	}
}
