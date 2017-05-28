import '../vendor/jquery.min.js';
import '../vendor/store-js.js';
import _ from '../vendor/underscore.js';
import Raphael from '../vendor/raphael.min.js';
import FluxType from './fluxtype';

window._ = _;
window.flux_type = new FluxType($('#application'));
