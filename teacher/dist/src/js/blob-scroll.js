/**
 * Blob-scroll
 *
 * @version 1.0.0
 * @home https://github.com/Blobfolio/blob-scroll
 *
 * Copyright © 2018 Blobfolio, LLC <https://blobfolio.com>
 *
 * This work is free. You can redistribute it and/or modify
 * it under the terms of the Do What The Fuck You Want To
 * Public License, Version 2.
 */
var blobScroll = {
	// Keep track of ongoing scrolls.
	scrolling: false,

	/**
	 * Scroll Smoothly
	 *
	 * @param {mixed} el DOMElement or pixel value.
	 * @param {object} args Settings.
	 * @returns {void} Nothing.
	 */
	scroll: function(el, args) {
		// Parse settings, pull in defaults.
		let settings = {
			// Axis.
			axis: 'y',
			// Animation length in milliseconds.
			duration: 500,
			// If provided, will be added to the scroll target's true
			// position. To scroll beyond a target — to e.g. account
			// for a sticky header — supply a negative number; to under-
			// scroll, provide a positive one.
			offset: 0,
			// The parent. Default is the window.
			parent: document.scrollingElement || document.documentElement,
			// The type of scroll easing to use.
			transition: 'ease',
			// Optional callback to execute when finished.
			callback: null,
		};

		if ('object' !== typeof args) {
			args = {};
		}

		// The scroll axis.
		if (
			('string' === typeof args.axis) &&
			/x/i.test(args.axis)
		) {
			settings.axis = 'x';
		}

		// The duration of the scroll animation.
		if (!isNaN(args.duration) && 0 < args.duration) {
			settings.duration = parseInt(args.duration, 10) || settings.duration;
		}

		// Scroll offset, if any.
		if (!isNaN(args.offset)) {
			settings.offset = parseInt(args.offset, 10) || settings.offset;
		}

		// Parent.
		if (
			args.parent &&
			blobScroll.isElement(args.parent)
		) {
			settings.parent = args.parent;
		}
		else {
			// Microsoft can't decide between document.documentElement
			// and document.body for scrolling. To make matters worse,
			// some versions support getting the current scrollTop on
			// both, but only support setting for one. To know which is
			// which for the user, we have to try to scroll and see
			// what happens.
			let tmp = settings.parent.scrollTop;
			if (0 < tmp) {
				tmp -= 1;
			}
			else {
				tmp += 1;
			}

			settings.parent.scrollTop = tmp;
			if (settings.parent.scrollTop !== tmp) {
				settings.parent = document.body;
			}
		}


		// Transition type.
		if (
			('string' === typeof args.transition) &&
			('function' === typeof blobScroll.easing[args.transition])
		) {
			settings.transition = args.transition;
		}

		// End scroll callback.
		if ('function' === typeof args.callback) {
			settings.callback = args.callback;
		}

		// Where are we going?
		settings.scrollTarget = blobScroll.getScrollTarget(el, settings.parent, settings.axis);

		// Combined with the offset, our target cannot be less than
		// zero.
		settings.scrollTarget += settings.offset;
		if (0 > settings.scrollTarget) {
			settings.scrollTarget = 0;
		}

		// Let's go ahead and calculate the relative change.
		settings.scrollFrom = ('y' === settings.axis) ? settings.parent.scrollTop : settings.parent.scrollLeft;
		settings.scrollDistance = settings.scrollTarget - settings.scrollFrom;

		// If there is no distance to travel, we're done.
		if (!settings.scrollDistance) {
			this.progress = false;
			return;
		}
		// If an identical animation is already happening, let it
		// finish.
		else if (this.progress === settings.scrollTarget) {
			return;
		}
		// Otherwise start this one!
		this.progress = settings.scrollTarget;

		// We'll use a simple animation frame callback.
		var start = null;

		/**
		 * Tick Callback
		 *
		 * This will nudge the scroll according to the duration.
		 *
		 * @param {float} timestamp Timestamp.
		 * @returns {void} Nothing.
		 */
		var tick = function(timestamp) {
			// Did we lose it?
			if (blobScroll.progress !== settings.scrollTarget) {
				return;
			}

			if (null === start) {
				start = timestamp;
			}

			// Figure out time and scale.
			const elapsed = timestamp - start;
			const progress = Math.min(elapsed / settings.duration, 1);
			const scale = blobScroll.easing[settings.transition](progress);

			// Update the draw.
			if ('y' === settings.axis) {
				settings.parent.scrollTop = settings.scrollFrom + (settings.scrollDistance * scale);
			}
			else {
				settings.parent.scrollLeft = settings.scrollFrom + (settings.scrollDistance * scale);
			}

			// Call again?
			if (1 > scale) {
				return window.requestAnimationFrame(tick);
			}

			// Wrap it up; we're done!
			if ('y' === settings.axis) {
				settings.parent.scrollTop = settings.scrollTarget;
			}
			else {
				settings.parent.scrollLeft = settings.scrollTarget;
			}
			blobScroll.progress = false;
			if (null !== settings.callback) {
				settings.callback(el, settings);
			}
		};

		// Start animating!
		window.requestAnimationFrame(tick);
	},

	/**
	 * Is Element
	 *
	 * There are various cases where we want to see if an object is
	 * a node/dom element.
	 *
	 * @param {mixed} el Element.
	 * @returns {bool} True/false.
	 */
	isElement: function(el) {
		return (
			// Easy Node check.
			(('object' === typeof Node) && el instanceof Node) ||
			// Uglier Node check.
			(
				el &&
				('object' === typeof el) &&
				('number' === typeof el.nodeType) &&
				('string' === typeof el.nodeName)
			) ||
			// DOM2 check.
			(('object' === typeof HTMLElement) && el instanceof HTMLElement) ||
			(
				el &&
				('object' === typeof el) &&
				(null !== el) &&
				(1 === el.nodeType) &&
				('string' === typeof el.nodeName)
			)
		);
	},

	/**
	 * Scroll Target By Thing
	 *
	 * @param {mixed} thing Thing.
	 * @param {DOMElement} parent Parent.
	 * @param {string} axis Axis.
	 * @returns {int} Target.
	 */
	getScrollTarget: function(thing, parent, axis) {
		if (!thing) {
			return 0;
		}

		// A number just gets passed straight through.
		if (!isNaN(thing) || /^[\d.]+(px)?$/.test(thing)) {
			return parseInt(thing, 10) || 0;
		}

		// If this is an element, return its top or left.
		if (blobScroll.isElement(thing)) {
			if ('x' === axis) {
				return blobScroll.offset(thing, parent).left;
			}

			return blobScroll.offset(thing, parent).top;
		}

		// Maybe this is a jQuery-like array?
		if (
			('undefined' !== typeof thing[0]) &&
			blobScroll.isElement(thing[0])
		) {
			return blobScroll.getScrollTarget(thing[0], parent, axis);
		}

		// If this is a string, let's try to match it to something.
		if ('string' === typeof thing) {
			thing = parent.querySelector(thing);
			if (thing && blobScroll.isElement(thing)) {
				return blobScroll.getScrollTarget(thing, parent, axis);
			}
		}

		// Who knows? Haha.
		return 0;
	},

	/**
	 * Element Offsets
	 *
	 * Find the X and Y offsets for an element.
	 *
	 * @param {DOMElement} el Element.
	 * @param {DOMElement} parent Parent.
	 * @returns {object} Data.
	 */
	offset: function(el, parent) {
		let out = {
			top: 0,
			left: 0,
		};

		// We can't check non-elements.
		if (!blobScroll.isElement(el)) {
			return out;
		}

		// Is this relative to an element or the window?
		if (!parent || !blobScroll.isElement(parent)) {
			parent = document.documentElement;
		}

		try {
			const rect = el.getBoundingClientRect();
			const scrollY = parent.scrollTop;
			const scrollX = parent.scrollLeft;

			out = {
				top: rect.top + scrollY,
				left: rect.left + scrollX,
			};
		} catch (Ex) { return out; }

		return out;
	},

	/**
	 * Easing Helpers
	 *
	 * @see {https://gist.github.com/gre/1650294}
	 *
	 */
	easing: {
		/**
		 * Simple Linear
		 *
		 * @param {int} t Timestamp.
		 * @returns {float} Value.
		 */
		linear: function(t) {
			return t;
		},
		/**
		 * Alias: easeInOutCubic
		 *
		 * @param {int} t Timestamp.
		 * @returns {float} Value.
		 */
		ease: function(t) {
			return 0.5 > t ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
		},
		/**
		 * Quad: Accelerate in.
		 *
		 * @param {int} t Timestamp.
		 * @returns {float} Value.
		 */
		easeInQuad: function(t) {
			return t * t;
		},
		/**
		 * Quad: Decelerate out.
		 *
		 * @param {int} t Timestamp.
		 * @returns {float} Value.
		 */
		easeOutQuad: function(t) {
			return t * (2 - t);
		},
		/**
		 * Quad: Accelerate in, decelerate out.
		 *
		 * @param {int} t Timestamp.
		 * @returns {float} Value.
		 */
		easeInOutQuad: function(t) {
			return 0.5 > t ? 2 * t * t : -1 + (4 - 2 * t) * t;
		},
		/**
		 * Cubic: Accelerate in.
		 *
		 * @param {int} t Timestamp.
		 * @returns {float} Value.
		 */
		easeInCubic: function(t) {
			return t * t * t;
		},
		/**
		 * Cubic: Decelerate out.
		 *
		 * @param {int} t Timestamp.
		 * @returns {float} Value.
		 */
		easeOutCubic: function(t) {
			return (--t) * t * t + 1;
		},
		/**
		 * Cubic: Accelerate in, decelerate out.
		 *
		 * @param {int} t Timestamp.
		 * @returns {float} Value.
		 */
		easeInOutCubic: function(t) {
			return 0.5 > t ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
		},
		/**
		 * Quarter: Accelerate in.
		 *
		 * @param {int} t Timestamp.
		 * @returns {float} Value.
		 */
		easeInQuart: function(t) {
			return t * t * t * t;
		},
		/**
		 * Quarter: Decelerate out.
		 *
		 * @param {int} t Timestamp.
		 * @returns {float} Value.
		 */
		easeOutQuart: function(t) {
			return 1 - (--t) * t * t * t;
		},
		/**
		 * Quarter: Accelerate in, decelerate out.
		 *
		 * @param {int} t Timestamp.
		 * @returns {float} Value.
		 */
		easeInOutQuart: function(t) {
			return 0.5 > t ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
		},
		/**
		 * Quint: Accelerate in.
		 *
		 * @param {int} t Timestamp.
		 * @returns {float} Value.
		 */
		easeInQuint: function(t) {
			return t * t * t * t * t;
		},
		/**
		 * Quint: Decelerate out.
		 *
		 * @param {int} t Timestamp.
		 * @returns {float} Value.
		 */
		easeOutQuint: function(t) {
			return 1 + (--t) * t * t * t * t;
		},
		/**
		 * Quint: Accelerate in, decelerate out.
		 *
		 * @param {int} t Timestamp.
		 * @returns {float} Value.
		 */
		easeInOutQuint: function(t) {
			return 0.5 > t ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
		},
	},
};
