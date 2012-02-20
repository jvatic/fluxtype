var Status;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Status = (function() {

  function Status(base) {
    var _base, _base2, _name, _name2;
    this.base = base;
    this.recordMiss = __bind(this.recordMiss, this);
    this.recordHit = __bind(this.recordHit, this);
    this.recordHitSpeed = __bind(this.recordHitSpeed, this);
    this.wpmAvg = __bind(this.wpmAvg, this);
    this.wpmBufferAvg = __bind(this.wpmBufferAvg, this);
    this.update = __bind(this.update, this);
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
    (_base = this.hit_counts)[_name = this.session_date] || (_base[_name] = 0);
    this.miss_counts = this.saved_data.get('miss_counts');
    (_base2 = this.miss_counts)[_name2 = this.session_date] || (_base2[_name2] = 0);
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
    this.update();
  }

  Status.prototype.update = function() {
    var accuracy, hit_count, miss_count;
    hit_count = this.hit_counts[this.session_date];
    miss_count = this.miss_counts[this.session_date];
    this.$hits.text(hit_count);
    this.$misses.text(miss_count);
    this.$wpm.text(this.wpmBufferAvg().toFixed(2));
    accuracy = ((hit_count - miss_count) / (hit_count + miss_count)) * 100;
    accuracy || (accuracy = 0);
    return this.$accuracy.text(accuracy.toFixed(2));
  };

  Status.prototype.wpmBufferAvg = function() {
    var wpms;
    wpms = _.rest(this.wpms, Math.min(this.wpms.length - this.wpm_buffer, this.wpms.length - 1));
    return this.wpmAvg(wpms);
  };

  Status.prototype.wpmAvg = function(wpms) {
    return ((_.inject(wpms, (__bind(function(sum, wpm) {
      return sum + wpm;
    }, this)), 0)) / wpms.length) || 0;
  };

  Status.prototype.recordHitSpeed = function(seconds) {
    var hits, speed, time;
    this.hit_speeds.push(seconds);
    this.saved_data.set('hit_speeds', this.hit_speeds);
    hits = _.rest(this.hit_speeds, this.hit_speed_index);
    if (hits.length === this.word_length) {
      this.hit_speed_index = this.hit_speeds.length;
      this.saved_data.set('hit_speed_index', this.hit_speed_index);
      time = _.inject(hits, (__bind(function(sum, time) {
        return sum += time;
      }, this)), 0);
      speed = 60 / time;
      this.wpms.push(speed);
      return this.saved_data.set('wpms', this.wpms);
    }
  };

  Status.prototype.recordHit = function(page_space) {
    var current_hit_at, last_hit_at;
    last_hit_at = this.last_hit_at;
    current_hit_at = new Date;
    this.last_hit_at = current_hit_at;
    this.recordHitSpeed((current_hit_at - last_hit_at) / 1000);
    this.hits.push(page_space);
    this.hit_counts[this.session_date] += 1;
    this.saved_data.set('hit_counts', this.hit_counts);
    return this.update();
  };

  Status.prototype.recordMiss = function(page_space) {
    this.misses.push(page_space);
    this.miss_counts[this.session_date] += 1;
    this.saved_data.set('miss_counts', this.miss_counts);
    return this.update();
  };

  return Status;

})();
