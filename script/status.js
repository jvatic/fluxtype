var Status;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Status = (function() {

  function Status(base) {
    this.base = base;
    this.recordMiss = __bind(this.recordMiss, this);
    this.recordHit = __bind(this.recordHit, this);
    this.update = __bind(this.update, this);
    this.hits = [];
    this.misses = [];
    this.last_hit_at = null;
    this.word_index = 0;
    this.word_length = 5;
    this.hit_speeds = [];
    this.hit_speed_index = 0;
    this.wpms = [];
    this.wpm_buffer = 3;
    this.$container = ($("<div class = 'status-container'></div>")).appendTo(this.base.$container);
    this.$hits = ($("<div class = 'status-hits'>0.0</div>")).appendTo(this.$container);
    this.$misses = ($("<div class = 'status-misses'>0.0</div>")).appendTo(this.$container);
    this.$wpm = ($("<div class = 'status-wpm'>0.0</div>")).appendTo(this.$container);
    this.$accuracy = ($("<div class = 'status-accuracy'>100</div>")).appendTo(this.$container);
  }

  Status.prototype.update = function() {
    var accuracy, wpm_avg, wpms;
    this.$hits.text(this.hits.length);
    this.$misses.text(this.misses.length);
    wpms = _.rest(this.wpms, Math.min(this.wpms.length - this.wpm_buffer, this.wpms.length - 1));
    wpm_avg = ((_.inject(wpms, (__bind(function(sum, wpm) {
      return sum + wpm;
    }, this)), 0)) / wpms.length) || 0;
    this.$wpm.text(wpm_avg.toFixed(2));
    accuracy = ((this.hits.length - this.misses.length) / (this.hits.length + this.misses.length)) * 100;
    return this.$accuracy.text(accuracy.toFixed(2));
  };

  Status.prototype.recordHit = function(page_space) {
    var current_hit_at, hits, last_hit_at, speed, time;
    last_hit_at = this.last_hit_at;
    current_hit_at = new Date;
    this.last_hit_at = current_hit_at;
    this.hit_speeds.push((current_hit_at - last_hit_at) / 1000);
    hits = _.rest(this.hit_speeds, this.hit_speed_index);
    if (hits.length === this.word_length) {
      this.hit_speed_index = this.hit_speeds.length;
      time = _.inject(hits, (__bind(function(sum, time) {
        return sum += time;
      }, this)), 0);
      speed = 60 / time;
      this.wpms.push(speed);
    }
    this.hits.push(page_space);
    return this.update();
  };

  Status.prototype.recordMiss = function(page_space) {
    this.misses.push(page_space);
    return this.update();
  };

  return Status;

})();
