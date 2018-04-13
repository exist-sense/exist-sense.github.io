// Helpers
Number.prototype.zeropad = function(len) {
    var s = String(this), c = '0';
    len = len || 2;
    while(s.length < len) s = c + s;
    return s;
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

Element.prototype.makechild = function(elemname, idname, classname) {
    var child = document.createElement(elemname);
    child.id = idname;
    child.className = classname;
    this.appendChild(child);
    return child;
}

Array.prototype.extend = function (data) {
    data.forEach(function(v) {
        this.push(v)
    }, this);    
}

function makecookie(name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    document.cookie = name + '=' + escape(value) + '; expires=' + exdate.toUTCString() + '; path=/';
}

function strncmp(a, b, n){
    return a.substring(0, n) == b.substring(0, n);
}

function makedate(offset, date) {
    var d = null, o = offset || 0;
    if(date) d = new Date(date);
    else d = new Date();
    if(o) d.setTime(d.getTime() + (24 * 60 * 60 * 1000 * o));
    return d.getFullYear() + '-' + (d.getMonth() + 1).zeropad() + '-' + d.getDate().zeropad();
}

String.prototype.capital = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function makeset() {
    return {
        nologin: false,
        printview: false,
        ready: false,
        access: {},
        cookies: {},
        page: {
            id: 'chart',
            date: makedate(),
            range: 31,
            chart: null,
        }
    };
}

// Exist Sense
var exist = {
    attrs: [ 'group', 'label', 'priority' ],
    items: [ 'attribute', 'label', 'priority', 'private', 'service', 'value', 'value_type', 'value_type_description' ],
    data: {}, info: {},
    defaults: makeset(),
    settings: makeset(),
    config: function(name) {
        var sets = exist.settings, defs = exist.defaults, conf = name.split('.'), count = 0;
        for(var i = 0; i < conf.length; i++) {
            defs = defs[conf[i]];
            if(sets) sets = sets[conf[i]];
            else if(defs) sets = defs[conf[i]];
            count++;
            if(sets == null) break;
        }
        if(sets) return sets;
        return null;
    },
    fa: function(type, colour, size, margin) {
        var value = '<span class="exist-fa ' + (type ? type : 'fas fa-cog fa-spin') + ' fa-fw" style="margin: ' + (margin ? margin : '0px 0px 0px 0px') + ';';
        if(colour) value += 'color: ' + colour + ';';
        if(size && size > 0) {
            value += '-webkit-filter: drop-shadow(-1px -1px ' + size + 'px ' + colour + ');';
            value += 'filter: drop-shadow(-1px -1px ' + size + 'px ' + colour + ');';
        }
        value += '"></span>';
        return value;
    },
    status: function(title, type) {
        var load = document.getElementById('exist-status');
        if(load) {
            if(title && title != '') {
                load.innerHTML = exist.fa(type, '#FFCCCC', 0) + ' ' + title;
                load.visibility = 'visible';
            }
            else {
                load.innerHTML = '';
                load.visibility = 'hidden';
            }
        }
    },
    auth: function() {
        window.location = 'https://exist.io/oauth2/authorize?response_type=code&client_id=124d5b5764184a4d81c2&redirect_uri=https%3A%2F%2Fexist.redeclipse.net%2F&scope=read+write';
    },
    switch: function() {
        makecookie('exist', '', 0);
        exist.auth();
    },
    login: {
        error: function(request, statname, errname) {
            exist.status('Authorisation ' + statname + ': ' + errname + ' ' + request.responseJSON.error, 'fas fa-exclamation-circle');
        },
        refresh: function(request, statname, errname) {
            exist.status('Refresh ' + statname + ': ' +  errname + ' ' + request.responseJSON.error, 'fas fa-exclamation-circle');
            exist.auth();
        },
        success: function(data, statname, request) {
            exist.status('Logged in!', 'fas fa-check-circle');
            var top = document.getElementById('exist-login');
            if(top) {
                top.href = '#';
                top.title = 'Waiting for user information..';
                top.onclick = '';
            }
            exist.access = data;
            makecookie('exist', exist.access.refresh_token, exist.access.expires_in / 60 / 60 / 24);
            exist.settings.cookies.exist = exist.access.refresh_token;
            exist.request.start('today', 'GET', 'users/$self/today', {}, exist.today);
        },
        start: function(type, name, access_code, success_callback, error_callback) {
            var pname = name.replace('_', ' ');
            exist.status('Logging in with ' + pname + '..');
            var reqdata = {
                method: 'POST',
                url: 'https://exist.redeclipse.net/oauth/access_token',
                data: {
                    grant_type: type,
                    client_id: '124d5b5764184a4d81c2',
                    client_secret: 'c2fa36b0daa451bb6fd5a89ee5856eaadf17b2aa',
                    redirect_uri: window.location.href
                },
                success: function(data, statname, request) {
                    console.log(type + ':', statname, request, data);
                    if(success_callback) success_callback(data, statname, request);
                },
                error: function(request, statname, errname) {
                    console.log(type + ':', statname, errname, request);
                    if(error_callback) error_callback(request, statname, errname);
                }
            }
            reqdata.data[name] = access_code;
            console.log(type + ': start', access_code, reqdata);
            $.ajax(reqdata);
        },
    },
    request: {
        error: function(request, statname, errname, name) {
            exist.status('Loading ' + name + ' - ' + statname + ': ' + errname, 'fas fa-exclamation-circle');
        },
        start: function(name, method, uri, data, success_callback, error_callback) {
            exist.status('Requesting ' + name + '..');
            var reqdata = {
                method: method,
                url: 'https://exist.redeclipse.net/api/1/' + uri + '/',
                data: method != 'POST' ? data : JSON.stringify(data),
                dataType: method != 'POST' ? null : 'json',
                contentType: method != 'POST' ? 'application/x-www-form-urlencoded' : 'application/json',
                headers: {
                    Authorization: exist.access.token_type + ' ' + exist.access.access_token
                },
                success: function(data, statname, request) {
                    console.log('request (' + name + '):', statname, request, data);
                    if(success_callback) success_callback(data, statname, request);
                },
                error: function(request, statname, errname) {
                    console.log('request (' + name + '):', statname, errname, request);
                    if(error_callback) error_callback(request, statname, errname, name);
                    else exist.request.error(request, statname, errname, name)
                }
            }
            console.log('request (' + name + '): start', uri, reqdata);
            $.ajax(reqdata);
        },
    },
    load: {
        mood: function() {
            return {
                '1': { group: 'terrible', label: 'Terrible' },
                '2': { group: 'bad', label: 'Bad' },
                '3': { group: 'ok', label: 'Ok' },
                '4': { group: 'good', label: 'Good' },
                '5': { group: 'great', label: 'Great' }
            };
        },
        data: function(data) {
            for(var i = 0; i < data.length; i++) {
                var attr = data[i], group = attr['group'];
                if(group.name) group = group.name;
                if(group == 'custom') {
                    for(var j = 0; j < attr.items.length; j++) {
                        var item = attr.items[j];
                        if(item.attribute != 'custom') {
                            var values = item.attribute.split('_'), name = values[0], string = item.label.split(' ');
                            if(values.length >= 2) {
                                var pint = parseInt(values[1]), slug = values[1], grp = null, label = null, isnum = false, start = 1;
                                if(values[1] == pint) {
                                    slug = name;
                                    name = 'personal';
                                    isnum = true;
                                    start = 2;
                                }
                                for(var n = start; n < values.length; n++) {
                                    if(grp == null) grp = values[n];
                                    else grp += '_' + values[n];
                                    if(label == null) label = values[n].capital();
                                    else label += ' ' + values[n];
                                }
                                if(!isnum && grp) slug = grp;
                                if(exist.data[name] == null) {
                                    exist.data[name] = {
                                        group: name,
                                        label: name.capital(),
                                        priority: item.priority
                                    };
                                }
                                if(exist.data[name][slug] == null) exist.data[name][slug] = {};
                                for(var k = 0; k < exist.items.length; k++) {
                                    var ex = exist.items[k];
                                    if(ex == 'attribute') exist.data[name][slug][ex] = slug;
                                    else if(ex == 'label') exist.data[name][slug][ex] = slug == 'pef' ? 'Peak Expiratory Flow' : (isnum ? slug.capital() : label);
                                    else if(ex == 'value' && isnum)
                                    {
                                        if(exist.data[name][slug]['minval'] == null || exist.data[name][slug]['minval'] > pint)
                                            exist.data[name][slug]['minval'] = pint;
                                        if(exist.data[name][slug]['maxval'] == null || exist.data[name][slug]['maxval'] < pint)
                                            exist.data[name][slug]['maxval'] = pint;
                                        if(item.value) exist.data[name][slug][ex] = pint;
                                    }
                                    else if(ex == 'value_type' && !isnum) exist.data[name][slug][ex] = 2;
                                    else if(ex == 'value_type_description' && !isnum) exist.data[name][slug][ex] = 'String';
                                    else exist.data[name][slug][ex] = item[ex];
                                }
                                if(grp) {
                                    var desc = isnum ? values[1] : slug;
                                    if(exist.data[name][slug]['desc'] == null) exist.data[name][slug]['desc'] = {};
                                    exist.data[name][slug]['desc'][desc] = {
                                        group: grp,
                                        label: label
                                    };
                                }
                            }
                            else {
                                if(exist.data[name] == null) {
                                    exist.data[name] = {
                                        group: name,
                                        label: name.capital(),
                                        priority: item.priority
                                    };
                                }
                                if(exist.data[name][name] == null) exist.data[name][name] = {};
                                for(var k = 0; k < exist.items.length; k++) {
                                    var ex = exist.items[k];
                                    exist.data[name][name][ex] = item[ex];
                                }
                            }
                        }
                    }
                }
                else {
                    if(exist.data[group] == null) exist.data[group] = {};
                    for(var j = 0; j < exist.attrs.length; j++) {
                        exist.data[group][exist.attrs[j]] = attr[exist.attrs[j]];
                    }
                    for(var j = 0; j < attr.items.length; j++) {
                        var item = attr.items[j];
                        if(exist.data[group][item.attribute] == null) exist.data[group][item.attribute] = {};
                        for(var k = 0; k < exist.items.length; k++) {
                            var ex = exist.items[k];
                            exist.data[group][item.attribute][ex] = item[ex];
                        }
                        if(item.value != null && item.value_type != 2) {
                            if(exist.data[group][item.attribute]['minval'] == null || exist.data[group][item.attribute]['minval'] > item.value)
                                exist.data[group][item.attribute]['minval'] = item.value;
                            if(exist.data[group][item.attribute]['maxval'] == null || exist.data[group][item.attribute]['maxval'] < item.value)
                                exist.data[group][item.attribute]['maxval'] = item.value;
                        }
                    }
                }
            }
            if(exist.data.mood.mood) {
                exist.data.mood.mood.minval = 1;
                exist.data.mood.mood.maxval = 5;
                exist.data.mood.mood.desc = exist.load.mood();
            }
        },
        attr: function(data) {
            for(var i = 0; i < data.length; i++) {
                var attr = data[i], group = attr['group'];
                if(group.name) group = group.name;
                if(group == 'custom' && attr.attribute != 'custom') {
                    var values = attr.attribute.split('_'), name = values[0], slug = values[1],
                        pint = parseInt(values[1]), grp = null, label = null, isnum = false, start = 1;
                    if(values[1] == pint) {
                        slug = name;
                        name = 'personal';
                        isnum = true;
                        start = 2;
                    }
                    for(var n = start; n < values.length; n++) {
                        if(grp == null) grp = values[n];
                        else grp += '_' + values[n];
                        if(label == null) label = values[n].capital();
                        else label += ' ' + values[n].capital();
                    }
                    if(!isnum && grp) slug = grp;
                    if(exist.data[name] == null) {
                        exist.data[name] = {
                            group: name,
                            label: name.capital(),
                            priority: attr.priority
                        };
                    }
                    if(exist.data[name][slug] == null) exist.data[name][slug] = { values: {} };
                    if(exist.data[name][slug]['values'] == null) exist.data[name][slug]['values'] = {};
                    for(var j = 0; j < attr.values.length; j++) {
                        var item = attr.values[j];
                        if(item.value || !isnum) {
                            if(exist.data[name][slug]['values'][item.date] == null) exist.data[name][slug]['values'][item.date] = {};
                            if(values.length >= 2) {
                                exist.data[name][slug]['values'][item.date]['value'] = isnum ? pint : item.value;
                                if(isnum) {
                                    if(exist.data[name][slug]['minval'] == null || exist.data[name][slug]['minval'] > pint)
                                        exist.data[name][slug]['minval'] = pint;
                                    if(exist.data[name][slug]['maxval'] == null || exist.data[name][slug]['maxval'] < pint)
                                        exist.data[name][slug]['maxval'] = pint;
                                }
                                if(grp) {
                                    var desc = isnum ? values[1] : slug;
                                    if(exist.data[name][slug]['values'][item.date]['group'] == null)
                                        exist.data[name][slug]['values'][item.date]['group'] = grp;
                                    if(exist.data[name][slug]['values'][item.date]['label'] == null)
                                        exist.data[name][slug]['values'][item.date]['label'] = label;
                                    if(exist.data[name][slug]['desc'] == null) exist.data[name][slug]['desc'] = {};
                                    if(exist.data[name][slug]['desc'][desc] == null) {
                                        exist.data[name][slug][slug]['desc'][desc] = {
                                            group: grp,
                                            label: label
                                        };
                                    }
                                }
                            }
                            else exist.data[name][slug]['values'][item.date] = { value: item.value };
                        }
                    }
                }
                else {
                    if(exist.data[group] == null) exist.data[group] = {};
                    if(exist.data[group][attr.attribute] == null) exist.data[group][attr.attribute] = {};
                    if(exist.data[group][attr.attribute]['values'] == null) exist.data[group][attr.attribute]['values'] = {};
                    var moods = exist.load.mood();
                    for(var j = 0; j < attr.values.length; j++) {
                        var item = attr.values[j];
                        exist.data[group][attr.attribute]['values'][item.date] = { value: item.value };
                        if(item.value != null && group == 'mood' && attr.attribute == 'mood') {
                            var val = item.value.toString();
                            exist.data[group][attr.attribute]['values'][item.date]['group'] = moods[val].group;
                            exist.data[group][attr.attribute]['values'][item.date]['label'] = moods[val].label;
                        }
                        if(item.value != null && exist.data[group][attr.attribute]['value_type'] != 2) {
                            if(exist.data[group][attr.attribute]['minval'] == null || exist.data[group][attr.attribute]['minval'] > item.value)
                                exist.data[group][attr.attribute]['minval'] = item.value;
                            if(exist.data[group][attr.attribute]['maxval'] == null || exist.data[group][attr.attribute]['maxval'] < item.value)
                                exist.data[group][attr.attribute]['maxval'] = item.value;
                        }
                    }
                }
            }
        }
    },
    value: function(data, date, type) {
        if(date) {
            if(data.values[date]) return data.values[date][type ? type : 'value'];
            else return null;
        }
        else return data.value;
    },
    display: function() {
        var date = exist.config('page.date'), len = exist.config('page.range');
        if(!exist.value(exist.data.weather.weather_summary, date)) date = makedate(date, -1);
        var hbody = document.getElementById('exist-header'), day = (date != makedate() ? (date != makedate(-1) ? date : 'yesterday') : 'today');
        if(hbody) {
            hbody.innerHTML = '';
            var hrow = hbody.makechild('tr', 'exist-title-row', 'exist-left'),
                head = hrow.makechild('td', 'exist-title-info', 'exist-left'),
                span = head.makechild('span', 'exist-title-info', 'exist-left');
            span.makechild('h4', 'exist-title-info-welcome', 'exist-left').innerHTML = 'Welcome ' + exist.info.first_name + ', here is your data for ' + day;
            if(exist.value(exist.data.weather.weather_summary, date)) {
                var weather = exist.data.weather, par = span.makechild('p', 'exist-title-info-weather', 'exist-left');
                if(exist.value(weather.weather_icon, date))
                    par.innerHTML += ' <img src="https://exist.io/static/img/weather/' + exist.value(weather.weather_icon, date) + '.png" title="' + exist.value(weather.weather_summary, date) + '" class="exist-icon" />';
                else par.innerHTML += ' ' + exist.fa('fas fa-sun', '#FFFF00', 4, '0px 4px 0px 0px');
                if(exist.value(weather.weather_summary, date))
                    par.innerHTML += ' <i>' + exist.value(weather.weather_summary, date) + '</i>';
                if(exist.value(weather.weather_temp_min, date))
                    par.innerHTML += ' ' + weather.weather_temp_min.label + ' of <b>' + exist.value(weather.weather_temp_min, date) + '&deg;C</b>.';
                if(exist.value(weather.weather_temp_max, date))
                    par.innerHTML += ' ' + weather.weather_temp_max.label + ' of <b>' + exist.value(weather.weather_temp_max, date) + '&deg;C</b>.';
            }
            if(exist.value(exist.data.activity.steps, date)) {
                var activity = exist.data.activity, par = span.makechild('p', 'exist-title-info-activity', 'exist-left');
                par.innerHTML = exist.fa('fas fa-street-view', '#00FF00', 4, '0px 4px 0px 0px');
                if(exist.value(activity.steps, date)) par.innerHTML += ' <b>' + exist.value(activity.steps, date) + '</b> ' + activity.steps.label.toLowerCase() + '.';
                if(exist.value(activity.steps_active_min, date)) par.innerHTML += ' <b>' + exist.value(activity.steps_active_min, date) + '</b> ' + activity.steps_active_min.label.toLowerCase() + '.';
                if(exist.value(activity.steps_distance, date)) par.innerHTML += ' <b>' + exist.value(activity.steps_distance, date) + '</b> ' + activity.steps_distance.label.toLowerCase() + '.';
            }
            if(exist.value(exist.data.sleep.sleep, date)) {
                var sleep = exist.data.sleep, par = span.makechild('p', 'exist-title-info-sleep', 'exist-left');
                par.innerHTML = exist.fa('fas fa-bed', '#FF00FF', 4, '0px 4px 0px 0px');
                if(exist.value(sleep.sleep, date)) par.innerHTML += ' <b>' + exist.value(sleep.sleep, date) + 'm</b> ' + sleep.sleep.label.toLowerCase() + '.';
                if(exist.value(sleep.time_in_bed, date)) par.innerHTML += ' <b>' + exist.value(sleep.time_in_bed, date) + 'm</b> ' + sleep.time_in_bed.label.toLowerCase() + '.';
                if(exist.value(sleep.sleep_awakenings, date)) par.innerHTML += ' <b>' + exist.value(sleep.sleep_awakenings, date) + '</b> ' + sleep.sleep_awakenings.label.toLowerCase() + '.';
            }
            if(exist.data.health) {
                var health = exist.data.health, par = span.makechild('p', 'exist-title-info-health', 'exist-left');
                par.innerHTML = exist.fa('fas fa-heart', '#FF0000', 4, '0px 4px 0px 0px');
                if(exist.value(health.weight, date)) {
                    par.innerHTML += ' ' + health.weight.label + ': <b>' + exist.value(health.weight, date) + '</b> kg.';
                    if(health.weight.service == 'googlefit') par.innerHTML += ' (<a href="https://fit.google.com" target="_blank">Google Fit</a>)';
                }
                var personal = exist.data.personal;
                if(exist.value(personal.pef, date))
                    par.innerHTML += ' ' + personal.pef.label + ': <b>' + exist.value(personal.pef, date) + '</b> L/min.';
            }
            if(exist.data.mood) {
                var mood = exist.data.mood, par = span.makechild('p', 'exist-title-info-mood', 'exist-left');
                par.innerHTML = exist.fa('fas fa-question-circle', '#00FFFF', 4, '0px 4px 0px 0px');
                if(exist.value(mood.mood, date)) par.innerHTML += ' ' + mood.mood.label + ': <b>' + exist.value(mood.mood, date) + '</b>/' + mood.mood.maxval + '.';
                else par.innerHTML += ' ' + mood.mood.label + ': <i>Not Rated.</i>';
                if(exist.value(mood.mood_note, date)) par.innerHTML += ' Notes: <i>' + exist.value(mood.mood_note, date) + '</i>.';
                if(personal.cycle) {
                    var cycle = personal.cycle;
                    par.innerHTML += ' ' + cycle.label + ':';
                    if(exist.value(cycle, date)) par.innerHTML += ' <b>' + exist.value(cycle, date) + '</b>/' + cycle.maxval + ' (' + exist.value(cycle, date, 'label')  + ').';
                    else par.innerHTML += ' <i>Not Rated.</i>';
                }
                if(mood.mood.service == 'exist_for_android') par.innerHTML += ' (<a href="https://exist.io/mood/timeline/edit/' + date +  '/" target="_blank">Exist</a>)';
            }
        }
        /*
        var hdata = document.getElementById('exist-body');
        if(hdata) {
            hdata.innerHTML = '';
            var hrow = hdata.makechild('tr', 'exist-data-row', 'exist-left'),
                head = hrow.makechild('td', 'exist-data-info', 'exist-left'),
                span = head.makechild('span', 'exist-data-info', 'exist-left');
            span.makechild('h4', 'exist-data-info-update', 'exist-left').innerHTML = 'Update ' + day;
        }
        */
    },
    acquire: function(data, statname, request) {
        exist.status('Ready.', 'fas fa-check-circle');
    },
    attributes: function(data, statname, request) {
        exist.status('Loading attributes..');
        exist.load.attr(data);
        console.log('user:', exist);
        exist.status('Ready.', 'fas fa-check-circle');
        exist.settings.ready = true;
        exist.draw();
        //exist.request.start('acquire', 'POST', 'attributes/acquire', [{ name: 'weight', active: true }], exist.acquire);
    },
    today: function(data, statname, request) {
        exist.status('Loading today..');
        jQuery.each(data, function(i, val) {
            if(i != 'attributes') exist.info[i] = val;
        });
        exist.load.data(data.attributes);
        var top = document.getElementById('exist-login');
        if(top) {
            top.innerHTML = '<img src="' + exist.info.avatar + '" />';
            top.href = 'https://exist.io/dashboard/';
            top.title = 'Logged in as: ' + exist.info.username + ' (#' + exist.info.id + ')';
            top.target = '_blank';
            top.onclick = '';
        }
        //var reqs = Math.floor(exist.config('page.range') / 31), remain = exist.config('page.range') - (reqs * 31), lastdate = exist.config('page.date') ? exist.config('page.date') : makedate();
        exist.request.start('attributes', 'GET', 'users/$self/attributes', {limit: 31, date_min: makedate(-30), date_max: makedate()}, exist.attributes);
    },
    colours: {
        normal: ['#CC0000', '#FF8888', '#FFDDDD', '#44FF44', '#4444FF' , '#FFFF44', '#44FFFF', '#FF44FF'],
        print:  ['#BBBBBB', '#777777', '#AA0000', '#00AA00', '#0000AA' , '#AAAA00', '#00AAAA', '#AA00AA'],
    },
    colour: function(iter) {
        return exist.colours[exist.config('printview') ? 'print' : 'normal'][iter % exist.colours[exist.config('printview') ? 'print' : 'normal'].length];
    },
    chart: {
        list: [],
        data: [],
        resetwait: false,
        clickwait: [null, null, null],
        groups: {
            weather: {
                weather_temp_min: ['weather_temp_max'],
                weather_temp_max: ['!disabled']
            }
        },
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
        getcolour: function(name) {
            return window.getComputedStyle(document.getElementById('exist-table'), null).getPropertyValue(name);
        },
        clickcb: function() {
            if(exist.chart.clickwait[0] != null || exist.chart.clickwait[1] != null) {
                var chart = exist.chart.clickwait[0], id = exist.chart.clickwait[2] ? exist.chart.clickwait[2] : '#content-area';
                if(chart == null) {
                    chart = exist.chart.clickwait[1];
                    if(chart == null) chart = exist.config('page.chart');
                    exist.chart.clickwait = [null, null, null];
                }
                else exist.chart.clickwait[0] = null;
                exist.checkurl({chart: (chart && chart != '' ? chart : null)});
                window.scrollTo(0, $(id).offset().top-($(window).height()/2)+($(id).height()/2));
            }
        },
        click: function(values, name) {
            if(exist.chart.clickwait[0] == null || exist.chart.clickwait[1] != null) {
                var id = values.target.id.replace('exist-chart-', '');
                if(id) {
                    if(exist.chart.clickwait[1] != null) {
                        exist.chart.clickwait[0] = exist.chart.clickwait[1];
                        exist.chart.clickwait[1] = null;
                    }
                    else {
                        exist.chart.clickwait[0] = id;
                        exist.chart.clickwait[1] = exist.config('page.chart');
                        if(exist.chart.clickwait[1] == null) exist.chart.clickwait[1] = '';
                    }
                    exist.chart.clickwait[2] = '#exist-chart-' + id;
                    window.setTimeout(exist.chart.clickcb, 250);
                }
            }
        },
        defaults: function() {
            var bgcol = exist.chart.getcolour('background-color'), fgcol = exist.chart.getcolour('color'), brcol = '#555555'; //exist.chart.getcolour('border-color');
            Chart.defaults.global.responsive = true;
            Chart.defaults.global.events = ['click', 'mousemove', 'mouseout'];
            Chart.defaults.global.onClick = exist.chart.click;
            Chart.defaults.global.responsiveAnimationDuration = 0;
            Chart.defaults.global.maintainAspectRatio = true;
            Chart.defaults.global.defaultColor = fgcol;
            Chart.defaults.global.defaultFontColor = fgcol;
            Chart.defaults.global.defaultFontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
            Chart.defaults.global.defaultFontSize = 12;
            Chart.defaults.global.defaultFontStyle = 'bold';
            Chart.defaults.global.showLines = true;
            Chart.defaults.global.elements.arc.backgroundColor = bgcol;
            Chart.defaults.global.elements.arc.borderColor = brcol;
            Chart.defaults.global.elements.arc.borderWidth = 2;
            Chart.defaults.global.elements.line.tension = 0.2;
            Chart.defaults.global.elements.line.backgroundColor = bgcol;
            Chart.defaults.global.elements.line.borderWidth = 1.5;
            Chart.defaults.global.elements.line.borderColor = brcol;
            Chart.defaults.global.elements.line.borderCapStyle = 'round';
            Chart.defaults.global.elements.line.borderDashOffset = 0;
            Chart.defaults.global.elements.line.borderJoinStyle = 'miter';
            Chart.defaults.global.elements.line.capBezierPoints = true;
            //Chart.defaults.global.elements.line.cubicInterpolationMode = 'monotone';
            Chart.defaults.global.elements.line.fill = true;
            Chart.defaults.global.elements.point.radius = 0;
            Chart.defaults.global.elements.point.pointStyle = 'circle';
            Chart.defaults.global.elements.point.backgroundColor = brcol;
            Chart.defaults.global.elements.point.borderColor = brcol;
            Chart.defaults.global.elements.point.borderWidth = 1;
            Chart.defaults.global.elements.point.hitRadius = 2;
            Chart.defaults.global.elements.point.hoverRadius = 3;
            Chart.defaults.global.elements.point.hoverBorderWidth = 1;
            Chart.defaults.global.elements.rectangle.backgroundColor = bgcol;
            Chart.defaults.global.elements.rectangle.borderColor = brcol;
            Chart.defaults.global.elements.rectangle.borderSkipped = 'bottom';
            Chart.defaults.global.elements.rectangle.borderWidth = 0;
            Chart.defaults.global.layout.padding.top = 10;
            Chart.defaults.global.layout.padding.right = 10;
            Chart.defaults.global.layout.padding.bottom = 10;
            Chart.defaults.global.layout.padding.left = 10;
            Chart.defaults.global.animation.duration = 1000;
            Chart.defaults.global.animation.easing = 'easeOutQuart';
            Chart.defaults.global.tooltips.enabled = true;
            Chart.defaults.global.tooltips.mode = 'nearest';
            Chart.defaults.global.tooltips.position = 'average';
            Chart.defaults.global.tooltips.intersect = true;
            Chart.defaults.global.tooltips.backgroundColor = '#000000';
            Chart.defaults.global.tooltips.titleFontStyle = 'bold';
            Chart.defaults.global.tooltips.titleSpacing = 0;
            Chart.defaults.global.tooltips.titleMarginBottom = 2;
            Chart.defaults.global.tooltips.titleFontColor = '#FFFFFF';
            Chart.defaults.global.tooltips.titleAlign = 'left';
            Chart.defaults.global.tooltips.bodySpacing = 2;
            Chart.defaults.global.tooltips.bodyFontColor = '#FFFFFF';
            Chart.defaults.global.tooltips.bodyAlign = 'left';
            Chart.defaults.global.tooltips.footerFontStyle = 'normal';
            Chart.defaults.global.tooltips.footerSpacing = 8;
            Chart.defaults.global.tooltips.footerMarginTop = 0;
            Chart.defaults.global.tooltips.footerFontColor = '#FFFFFF';
            Chart.defaults.global.tooltips.footerAlign = 'left';
            Chart.defaults.global.tooltips.yPadding = 6;
            Chart.defaults.global.tooltips.xPadding = 6;
            Chart.defaults.global.tooltips.caretPadding = 4;
            Chart.defaults.global.tooltips.caretSize = 6;
            Chart.defaults.global.tooltips.cornerRadius = 4;
            Chart.defaults.global.tooltips.multiKeyBackground = '#000000';
            Chart.defaults.global.tooltips.displayColors = false;
            Chart.defaults.global.tooltips.borderColor = '#FFFFFF';
            Chart.defaults.global.tooltips.borderWidth = 1;
            Chart.defaults.global.legend.display = true;
            Chart.defaults.global.legend.position = 'top';
            Chart.defaults.global.legend.fullWidth = true;
            Chart.defaults.global.legend.reverse = false;
            Chart.defaults.global.legend.weight = 1000;
            Chart.defaults.global.legend.labels.boxWidth = 16;
            Chart.defaults.global.legend.labels.padding = 10;
            Chart.defaults.global.title.display = false;
            Chart.defaults.global.title.fontStyle = 'bold';
            Chart.defaults.global.title.fullWidth = true;
            Chart.defaults.global.title.lineHeight = 1.2;
            Chart.defaults.global.title.padding = 10;
            Chart.defaults.global.title.position = 'top';
            Chart.defaults.global.title.weight = 2000;
        },
        dataset: function(name, iter) {
            var col = exist.colour(iter);
            var data = {
                label: name,
                data: [],
                spanGaps: true,
                fontColor: col,
                backgroundColor: col,
                borderColor: exist.config('printview') ? '#555555' : '#886666',
                pointBorderColor: col
            };
            return data;
        },
        scale: function(min, max, display, label, offset) {
            var data = {
                display: display || false,
                position: 'left',
                offset: true,
                gridLines: {
                    display: display || false,
                    color: '#333333',
                    lineWidth: 1,
                    drawBorder: display || false,
                    drawOnChartArea: display || false,
                    drawTicks: display || false,
                    tickMarkLength: 10,
                    zeroLineWidth: 0,
                    zeroLineColor: '#333333',
                    zeroLineBorderDash: [],
                    zeroLineBorderDashOffset: 0,
                    offsetGridLines: false,
                    borderDash: [],
                    borderDashOffset: 0
                },
                scaleLabel: {
                    display: label ? true : false,
                    labelString: label,
                    lineHeight: 1.2,
                    padding: {
                        top: 4,
                        bottom: 4
                    }
                },
                ticks: {
                    minRotation: 0,
                    maxRotation: 90,
                    suggestedMin: min,
                    suggestedMax: max,
                    mirror: false,
                    padding: 0,
                    reverse: false,
                    display: display || false,
                    autoSkip: true,
                    autoSkipPadding: 0,
                    labelOffset: offset || 0
                }
            };
            return data;
        },
        config: function(id, type, name) {
            var data = {
                id: id,
                type: type,
                label: name,
                values: [],
                data: {
                    labels: [],
                    datasets: []
                },
                options: {
                    layout: {
                        padding: {
                            left: 0,
                            right: 0,
                            top: 8,
                            bottom: 0
                        }
                    },
                    scales: {
                        yAxes: [],
                        xAxes: []
                    }
                }
            }
            return data;
        },
        create: function(name, type, desc, min, max, values, names) {
            var data = exist.chart.config('exist-chart-' + name, type, desc);
            data.options.scales.xAxes[0] = exist.chart.scale(null, null, true);
            for(var i in names) data.data.datasets[i] = exist.chart.dataset(names[i], i);
            for(var i in values) {
                data.options.scales.yAxes[i] = exist.chart.scale(min, max, i == 0 ? true : false, desc);
                data.values[i] = values[i];
            }
            return data;
        },
        check: function(group, label) {
            if(exist.config('page.chart')) {
                var chart = exist.config('page.chart').split(','), name = group + '.' + label;
                for(var id in chart) {
                    if(strncmp(chart[id], name, chart[id].length)) return true;
                }
                return false;
            }
            return true;
        },
        make: function(head, date, size, data, q) {
            var list = data.split('-'), a = exist.data[list[0]], yest = makedate(-1, date);
            if(a && (q == null || a.priority == q)) {
                for(var r = 1; r <= 10; r++) {
                    for(var j in a) {
                        var found = false;
                        if(list.length < 2) found = true;
                        else {
                            for(var x = 1; x < list.length; x++) {
                                var k = j.split('_'), val = (k.length >= 2 ? k[1] : k[0]);
                                if(list[x] == j || list[x] == val) {
                                    found = true;
                                    break;
                                }
                            }
                        }
                        if(found) {
                            var b = a[j], g = exist.chart.groups[list[0]] ? exist.chart.groups[list[0]][j] : null;
                            if(b && (g == null || g[0] != '!disabled')) {
                                if(b.value_type != 2 && b.priority == r && (b.minval || b.maxval) && b.values && ((b.values[date] && b.values[date].value != null) || (b.values[yest] && b.values[yest].value != null))) {
                                    var n = list[0] + '-' + j, minval = b.minval, maxval = b.maxval, values = [b.values], labels = [b.label];
                                    if(g && g[0] != '!disabled') {
                                        var k = j.split('_');
                                        n = list[0] + '-' + (k.length >= 2 ? k[1] : k[0]);
                                        for(var x = 0; x < g.length; x++) {
                                            var c = a[g[x]];
                                            if(c && c.value_type != 2 && (c.minval || c.maxval) && c.values && ((c.values[date] && c.values[date].value != null) || (c.values[yest] && c.values[yest].value != null))) {
                                                values[values.length] = c.values;
                                                labels[labels.length] = c.label;
                                                if(c.minval < minval) minval = c.minval;
                                                if(c.maxval > maxval) maxval = c.maxval;
                                            }
                                        }
                                    }
                                    head.innerHTML += '<canvas id="exist-chart-' + n + '" class="exist-chart" width="400px" height="' + size + 'px"></canvas><br />';
                                    exist.chart.data[exist.chart.data.length] = exist.chart.create(
                                        n, 'line', b.value_type_description, minval, maxval,
                                        values,
                                        labels
                                    );
                                }
                            }
                        }
                    }
                }
            }
        },
        draw: function(head, indate, inlen) {
            var date = indate ? indate : makedate(), len = inlen || 31, count = 0,
                size = exist.chart.width > 1280 ? 75 : 150, c = exist.config('page.chart');
            exist.chart.data = [];
            if(c) {
                var d = c.split(',');
                if(d.length == 1) size *= 2;
                for(var q = 0; q < d.length; q++) exist.chart.make(head, date, size, d[q]);
            }
            else {
                for(var q = 1; q <= 10; q++) {
                    for(var i in exist.data) exist.chart.make(head, date, size, i, q);
                }
            }
            for(var n = 0; n < len; n++) {
                var ndate = makedate(n - (len - 1), date);
                for(var m = 0; m < exist.chart.data.length; m++) {
                    exist.chart.data[m].data.labels[n] = ndate.split('-')[2];
                    for(var q = 0; q < exist.chart.data[m].values.length; q++) {
                        exist.chart.data[m].data.datasets[q].data[n] = exist.chart.data[m].values[q][ndate] ? exist.chart.data[m].values[q][ndate].value : null;
                    }
                }
            }
            exist.chart.list = [];
            for(var i = 0; i < exist.chart.data.length; i++) {
                var elem = document.getElementById(exist.chart.data[i].id);
                if(elem) exist.chart.list[i] = new Chart(elem.getContext('2d'), exist.chart.data[i]);
                else console.log('chart not found', exist.chart.data[i].id, elem);
            }
        },
        display: function() {
            exist.chart.resetwait = false;
            exist.chart.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            exist.chart.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            var hbody = document.getElementById('exist-header');
            if(hbody) {
                hbody.innerHTML = '';
                var hrow = hbody.makechild('tr', 'exist-chart-row', 'exist-left'),
                    head = hrow.makechild('td', 'exist-chart-info', 'exist-left'),
                    range = exist.config('page.range');
                head.innerHTML = '<h4 id="exist-chart-pre" class="exist-left">Last ' + range + ' days for ' + exist.info.first_name + '</h4>';
                exist.chart.draw(head, exist.config('page.date'), range);
            }
        },
        reset: function() {
            if(!exist.chart.resetwait) {
                var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                if(width != exist.chart.width) {
                    exist.chart.resetwait = true;
                    for (var i in Chart.instances) Chart.instances[i].destroy();
                    Chart.instances = {};
                    exist.chart.start();
                }
            }
        }
    },
    draw: function() {
        var page = exist.config('page.id');
        for (var i in Chart.instances) Chart.instances[i].destroy();
        Chart.instances = {};
        if(page == 'day') exist.display();
        else if(page == 'chart') exist.chart.display();
        else exist.display();
    },
    checkurl: function(values) {
        var url = window.location.href, hash = url.split('#'), params = hash[0].split('?'), value = params[0], count = 0;
        if(params.length >= 2) {
            var code = params[1].split('&');
            for(var i = 0; i < code.length; i++) {
                var item = code[i].split('=');
                if(item[0] == 'code') {
                    exist.settings.nologin = true;
                    exist.login.start('authorization_code', 'code', item[1], exist.login.success, exist.login.error);
                }
                else if(item[0] != 'state') {
                    if(item[0] == 'print' && item[1] != '0') exist.settings.printview = true;
                    if(!count) value += '?';
                    else value += '&';
                    value += item[0] + '=' + item[1];
                    count++;
                }
            }
        }
        for(var i in exist.defaults.page) exist.settings.page[i] = exist.defaults.page[i];
        if(values || (hash.length >= 2 && hash[1] != '')) {
            if(hash.length >= 2 && hash[1] != '') {
                var code = hash[1].split('&');
                for(var i = 0; i < code.length; i++) {
                    var item = code[i].split('=');
                    exist.settings.page[item[0]] = item[1];
                }
            }
            for(var i in values) exist.settings.page[i] = values[i];
            var opts = hash[0] + '#', vars = 0;
            for(var i in exist.settings.page) {
                if(exist.settings.page[i] == 'true') exist.settings.page[i] = true;
                else if(exist.settings.page[i] == 'false') exist.settings.page[i] = false;
                else if(exist.settings.page[i] == 'null') exist.settings.page[i] = null;
                else {
                    var pint = parseInt(exist.settings.page[i]);
                    if(exist.settings.page[i] == pint) exist.settings.page[i] = pint;
                }
                if(exist.settings.page[i] != exist.defaults.page[i]) {
                    if(vars) opts += '&';
                    opts += i + '=' + exist.settings.page[i];
                    vars++;
                }
            }
            window.history.replaceState({}, document.title, vars ? opts : hash[0]);
            if(exist.config('ready')) exist.draw();
        }
        else {
            window.history.replaceState({}, document.title, value);
            if(exist.config('ready')) exist.draw();
        }
    },
    start: function() {
        exist.settings.cookies = {};
        var cookies = decodeURIComponent(document.cookie).split(';');
        if(cookies.length > 0) {
            for(var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                while(cookie.charAt(0) == ' ') cookie = cookie.substring(1);
                var value = cookie.split('=');
                if(value.length >= 2) exist.settings.cookies[value[0]] = value[1];
            }
        }
        exist.checkurl();
        exist.chart.defaults();
        if(!exist.config('nologin')) {
            if(exist.config('cookies.exist') != null) {
                exist.login.start('refresh_token', 'refresh_token', exist.config('cookies.exist'), exist.login.success, exist.login.refresh);
            }
            else {
                var hbody = document.getElementById('exist-header');
                if(hbody) {
                    hbody.innerHTML = '';
                    var hrow = hbody.makechild('tr', 'exist-title-row', 'exist-left'),
                        head = hrow.makechild('td', 'exist-title-info', 'exist-left'),
                        span = head.makechild('span', 'exist-title-info', 'exist-left');
                        span.innerHTML = '<p>Exist Sense helps you make sense of your custom tag values.</p>';
                        span.innerHTML += '<p>Please <b><a class="exist-left" href="#" onclick="exist.auth();">Login with Exist.io</a></b> to continue.</p>';
                }
                exist.status('Login to continue.', 'fas fa-user');
            }
        }
        else {
            exist.status('Logging in..');
        }
    }
};

$(document).ready(function ($) {
    jQuery('time.timeago').timeago();
    jQuery.timeago.settings = {
        refreshMillis: 60000,
        allowPast: true,
        allowFuture: true,
        localeTitle: false,
        cutoff: 0,
        autoDispose: true,
        strings: {
            prefixAgo: null,
            prefixFromNow: null,
            suffixAgo: 'ago',
            suffixFromNow: 'from now',
            inPast: 'any moment',
            seconds: 'a moment',
            minute: '1 minute',
            minutes: '%d minutes',
            hour: '1 hour',
            hours: '%d hours',
            day: '1 day',
            days: '%d days',
            month: '1 month',
            months: '%d months',
            year: '1 year',
            years: '%d years',
            wordSeparator: ' ',
            numbers: []
        }
    }
    exist.start();
});

$(window).on('hashchange', function() {
    exist.checkurl();
});
$(window).resize(function() {
    exist.chart.reset();
});