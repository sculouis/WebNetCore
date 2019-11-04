'use strict';

var Tabrail = {
	settings: {
		default_text: 'Tab ',
		show_first_tab_number: false
	},
	count: 0, //the tab count starts at 0.
	list: [{ //this is the first tab, Its persitant so is also hard coded.
		id: 0,
		selected: true,
		persistant: true,
		get title() {
			return Tabrail.settings.default_text;
		},
		nickname: false,
		open: true
	}],
	find: { //little api for finding tabs as objects in the list array.
		by_id: function by_id(id) {
			return Tabrail.list.find(function (tab) {
				return tab.id === id;
			});
		},
		selected: function selected(is) {
			return Tabrail.list.find(function (tab) {
				return tab.selected === is;
			});
		}
	},
	actions: {}, //add some actions further down.
	icon_font: 'zmdi', //icon class lib used.
	icons: {
		close: 'zmdi-close zmdi-hc-2x',
		add: 'zmdi-plus zmdi-hc-2x'
	}
},
    el = {}; //elements are stored here

//Micro templates
Tabrail.template = {};
Tabrail.template.btn = {};
Tabrail.template.btn.close = '\n<button data-close-tab>\n\t<span class=\'' + Tabrail.icon_font + ' ' + Tabrail.icons.close + '\'></span>\n</button>\n';
Tabrail.template.btn.add = '\n<li>\n\t<button title=\'New tab\' type=\'button\' data-add-tab>\n\t\t<span class=\'' + Tabrail.icon_font + ' ' + Tabrail.icons.add + '\'></span>\n\t</button>\n</li>\n';
//Full template
Tabrail.template.tab = function (spec) {
	return '\n<li class=\'active\' data-tab>\n\t<input type=\'text\' data-title placeholder=\'' + Tabrail.settings.default_text + '\' value=\'' + Tabrail.settings.default_text + ' ' + spec.count + '\' readonly/>\n\t\n\t' + Tabrail.template.btn.close + '\n</li>\n';
};
Tabrail.template.overflow = '\n<div class=\'tabrail-overflow\'></div>\n';
//Actions available
var actions = Tabrail.actions;
actions.add = function () {
	Tabrail.count++;
	var add_wrapper = $(this).parent('li'),
	    last_tab = add_wrapper.siblings('[data-tab]').last(),
	    overflow_wrap = add_wrapper.closest('.tabrail-overflow'),
	    tabs = add_wrapper.siblings('[data-tab]');

	var track = {
		id: Tabrail.count,
		selected: false,
		persistant: false,
		title: Tabrail.settings.default_text,
		nickname: false,
		open: true
	};
	Tabrail.list.push(track);

	//create the next tab at the end of the rail
	last_tab.after(Tabrail.template.tab({
		count: Tabrail.count
	}));
	//select the newest spawned tab that just happened.
	var spawned_tab = last_tab.next();
	//apply the active class to the new tab
	actions.active_class(spawned_tab);
	//test for dynamic clamp
	var offset = tabs.length * last_tab.outerWidth();
	overflow_wrap.scrollLeft(offset);
};
actions.close = function () {
	var closing_tab = $(this).parent();
	actions.active_class(closing_tab.prev());
	closing_tab.remove();
};
actions.edit = function () {
	var title = $(this).find('[data-title]');
	title.focus();
	title.addClass('editing');
	//Update nickname
	var track = Tabrail.find.by_id($(this).index());
	title.keyup(function () {
		track.nickname = $(this).val();
	});
};
actions.select = function (e) {
	e.stopPropagation();
	actions.active_class($(this));
	$(this).find('[data-title]').removeAttr('readonly');
	$(this).find('[data-title]').focusout(function () {
		$(this).attr('readonly', 'readonly');
		$(this).removeClass('editing');
	});
};
actions.active_class = function (el) {
	el.addClass('active').siblings().removeClass('active');
	//Update stat list
	var stat = Tabrail.find.by_id(el.index()),
	    old_stat = Tabrail.find.selected(true);
	if (stat && old_stat) {
		old_stat.selected = false;
		stat.selected = true;
	}
};
actions.hover = function () {
	var track = Tabrail.find.by_id($(this).index());
	//UX title improvements.
	if (track.nickname) {
		var text = track.nickname;
		$(this).attr('title', text);
		$(this).find('[data-close-tab]').attr('title', 'Close ' + text);
	} else {
		var text = track.title + ' ' + track.id;
		$(this).attr('title', text);
		$(this).find('[data-close-tab]').attr('title', 'Close ' + text);
	}
};
//Elements
el.container = $('[data-tab-rail]');
Object.defineProperty(el, 'tab', {
	get: function get() {
		return el.container.find('[data-tab]');
	}
});
el.btn = {};
Object.defineProperty(el.btn, 'add', {
	get: function get() {
		return el.container.find('[data-add-tab]');
	}
});
Object.defineProperty(el.btn, 'close', {
	get: function get() {
		return el.container.find('[data-close-tab]');
	}
});
Object.defineProperty(el, 'title', {
	get: function get() {
		return el.container.find('[data-title]');
	}
});

// el.container
// el.title
// el.tab
// el.btn.close
// el.btn.add

//Init
el.container.append(Tabrail.template.tab({
	count: Tabrail.settings.show_first_tab_number ? 0 : ''
}) + ' ' + Tabrail.template.btn.add).wrap(Tabrail.template.overflow);

//Attach actions
function attach() {
	el.btn.add.on('click', actions.add);
	//deligate from root container to keep events firing
	el.container.on('mouseenter', '[data-tab]', actions.hover);
	el.container.on('click', '[data-close-tab]', actions.close);
	el.container.on('click', '[data-tab]', actions.select);
	el.container.on('dblclick', '[data-tab].active', actions.edit);
}
attach();