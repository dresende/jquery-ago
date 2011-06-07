(function ($) {
	var s = [
		[ 100, "just now" ],
		[ 300, "a few minutes ago" ],
		[ 1800, "half hour ago" ],
		[ 3600, "1 hour ago" ],
		[ 7200, "2 hours ago" ],
		[ 10800, "3 hours ago" ],
		[ 14400, "4 hours ago" ],
		[ 21600, "6 hours ago" ],
		[ 43200, "half day ago" ],
		[ 86400, "1 day ago" ],
		[ 172800, "2 days ago" ],
		[ 259200, "3 days ago" ]
	], sMax = "more than 3 days ago", o = [], tid = null, nt = [];

	var parseDate = function (st) {
		var dt = new Date();
		dt.setTime(Date.parse(st));
		return dt;
	};
	var updateDate = function (item) {
		var dt = (new Date()).getTime(),
		    idt = item.ago.getTime();
		for (var j = 0; j < s.length; j++) {
			if (dt - idt < parseInt(s[j][0]) * 1e3) {
				$(item).html(s[j][1]);
				
				queueDate(item, dt + (s[j][0] * 1e3) - (dt - idt));
				return;
			}
		}
		
		$(item).html(sMax);
	};
	var queueDate = function (item, ts) {
		for (var i = 0; i < nt.length; i++) {
			if (nt[i].ts > ts) {
				nt.splice(i, 0, { ts: ts, i: item });
				return;
			}
		}
		nt.push({ ts: ts, i: item });
	};
	var unqueueDate = function () {
		if (!nt.length) return;
		var dt = (new Date()).getTime();
		
		while (nt.length && nt[0].ts <= dt) {
			var o = nt.splice(0, 1)[0];
			updateDate(o.i);
		}
		if (nt.length) {
			//console.log("setting timeout for", (nt[0].ts - dt)/1e3, "secs");
			tid = setTimeout(unqueueDate, nt[0].ts - dt);
		}
	};

	$.ago = function (items) {
		for (var i = 0; i < items.length; i++) {
			if (typeof items[i].ago != "undefined") {
				continue;
			}
			items[i].ago = parseDate($(items[i]).attr("title") || items[i].innerHTML);
			$(items[i]).attr("title", items[i].innerHTML);

			updateDate(items[i]);

			o.push(items[i]);
		}
		
		if (tid) {
			clearTimeout(tid);
		}
		if (nt.length) {
			var dt = (new Date()).getTime();
			//console.log("setting timeout for", (nt[0].ts - dt)/1e3, "secs");
			tid = setTimeout(unqueueDate, nt[0].ts - dt);
		}
	};
})(jQuery);
