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

function offdate(date) {
    var d = new Date(date);
    return d.getUTCFullYear() + '-' + (d.getUTCMonth() + 1).zeropad() + '-' + d.getUTCDate().zeropad();
}

String.prototype.capital = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function makeset() {
    return {
        nologin: false,
        ready: false,
        access: {},
        cookies: {},
        attrs: [ 'group', 'label', 'priority' ],
        items: [ 'attribute', 'label', 'priority', 'private', 'service', 'value', 'value_type', 'value_type_description' ],
        colours: {
            normal: ['#CC0000', '#FF8888', '#3366CC', '#DC3912', '#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC', '#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC'],
            print:  ['#BBBBBB', '#888888'],
        },
        moods: {
            '1': { group: 'terrible', label: 'Terrible' },
            '2': { group: 'bad', label: 'Bad' },
            '3': { group: 'ok', label: 'Ok' },
            '4': { group: 'good', label: 'Good' },
            '5': { group: 'great', label: 'Great' }
        },
        groups: {
            weather: {
                weather_temp_min: ['weather_temp_max'],
                weather_temp_max: ['!disabled']
            },
            sleep: {
                sleep_goal: ['!disabled']
            }
        },
        overrides: {
            activity: {
                steps: {
                    value_type_description: 'Count'
                },
                steps_active_min: {
                    value_type_description: 'Period (min)'
                },
                steps_distance: {
                    value_type_description: 'Distance (km)'
                },
                steps_goal: {
                    value_type_description: 'Count'
                },
            },
            events: {
                events: {
                    value_type_description: 'Count'
                },
                events_duration: {
                    value_type_description: 'Period (min)'
                },
            },
            health: {
                heartrate: {
                    value_type_description: 'Beats (per min)'
                },
                weight: {
                    value_type_description: 'Weight (kg)'
                },
            },
            location: {
                location: {
                    value_type_description: 'Lat/Long'
                }
            },
            media: {
                tracks: {
                    value_type_description: 'Count'
                }
            },
            mood: {
                mood: {
                    desc: {
                        '1': { group: 'terrible', label: 'Terrible' },
                        '2': { group: 'bad', label: 'Bad' },
                        '3': { group: 'ok', label: 'Ok' },
                        '4': { group: 'good', label: 'Good' },
                        '5': { group: 'great', label: 'Great' }
                    },
                    minval: 1,
                    maxval: 5,
                    value_type_description: '1 to 5'
                }
            },
            personal: {
                cycle: {
                    minval: 1,
                    maxval: 5,
                    label: 'Depressed/Manic',
                    value_type_description: '1 to 5'
                },
                pain: {
                    minval: 0,
                    maxval: 5,
                    value_type_description: '0 to 5'
                },
                pef: {
                    label: 'Peak Expiratory Flow',
                    value_type_description: 'L/min'
                }
            },
            productivity: {
                distracting_min: {
                    label: 'Leisure time'
                }
            },
            sleep: {
                sleep: {
                    value_type_description: 'Period (min)'
                },
                awakenings: {
                    value_type_description: 'Count'
                },
                time_in_bed: {
                    value_type_description: 'Period (min)'
                }
            },
            weather: {
                weather_precipitation: {
                    value_type_description: 'Percentage'
                },
                weather_temp_max: {
                    value_type_description: 'Temp (°C)'
                },
                weather_temp_min: {
                    value_type_description: 'Temp (°C)'
                },
                weather_wind_speed: {
                    value_type_description: 'Speed (km/h)'
                }
            },
            workouts: {
                workouts: {
                    value_type_description: 'Count'
                },
                workouts_distance: {
                    value_type_description: 'KM'
                },
                workouts_min: {
                    value_type_description: 'Period (min)'
                }
            }
        },
        print: {
            on: ['/print.css'],
            off: ['/bits/css/default.css', '/bits/css/common.css', '/exist.css']
        },
        page: {
            id: 'chart',
            date: makedate(),
            range: 31,
            chart: null,
            print: false,
        }
    };
}

// Exist Sense
var exist = {
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
    value: function(data, date, type) {
        if(date) {
            if(data.values[date]) return data.values[date][type ? type : 'value'];
            else return null;
        }
        else return data.value;
    },
    colour: function(iter) {
        return exist.settings.colours[exist.config('page.print') ? 'print' : 'normal'][(iter % exist.settings.colours[exist.config('page.print') ? 'print' : 'normal'].length)];
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
        makecookie('refresh_token', '', 0);
        exist.start();
    },
    checkurl: function(values) {
        var url = window.location.href, hash = url.split('#'), params = hash[0].split('?'), value = params[0];
        if(params.length >= 2) {
            var code = params[1].split('&');
            for(var i = 0; i < code.length; i++) {
                var item = code[i].split('=');
                if(item[0] == 'code') {
                    exist.settings.nologin = true;
                    exist.login.start('authorization_code', 'code', item[1], exist.login.success, exist.login.error);
                }
            }
        }
        for(var i in exist.defaults.page) exist.settings.page[i] = exist.defaults.page[i];
        if(values || (hash.length >= 2 && hash[1] != '')) {
            var print = exist.config('page.print');
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
            if(!exist.load.more() && exist.config('ready')) exist.load.draw();
        }
        else {
            window.history.replaceState({}, document.title, value);
            if(!exist.load.more() && exist.config('ready')) exist.load.draw();
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
        var head = document.getElementsByTagName('head');
        if(head) {
            var ccss = document.getElementsByClassName('exist-css');
            for(var i = ccss.length-1; i >= 0; i--) ccss[i].parentNode.removeChild(ccss[i]);
            var list = exist.config('page.print') ? exist.config('print.on') : exist.config('print.off');
            for(var i = 0; i < list.length; i++) {
                var child = document.createElement('link');
                child.rel = 'stylesheet';
                child.type = 'text/css';
                child.href = list[i];
                child.className = 'exist-css';
                head[0].appendChild(child);
            }
        }
        var print = exist.config('page.print'), bgcol = print ? '#FFFFFF' : '#000000', fgcol = print ? '#000000' : '#FFFFFF', brcol = '#555555';
        Chart.defaults.global.defaultColor = fgcol;
        Chart.defaults.global.defaultFontColor = fgcol;
        Chart.defaults.global.defaultFontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
        Chart.defaults.global.defaultFontSize = 10;
        Chart.defaults.global.defaultFontStyle = 'bold';
        Chart.defaults.global.showLines = true;
        if(!exist.config('nologin')) {
            if(exist.config('cookies.refresh_token') != null)
                exist.login.start('refresh_token', 'refresh_token', exist.config('cookies.refresh_token'), exist.login.success, exist.login.refresh);
            else exist.load.draw();
        }
        else exist.status('Logging in..');
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
            makecookie('refresh_token', exist.access.refresh_token, exist.access.expires_in / 60 / 60 / 24);
            exist.settings.cookies.refresh_token = exist.access.refresh_token;
            exist.request.start('today', 'GET', 'users/$self/today', {}, exist.load.today);
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
                                    else label += ' ' + values[n].capital();
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
                                for(var k = 0; k < exist.settings.items.length; k++) {
                                    var ex = exist.settings.items[k];
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
                                    else if(ex == 'value' && !isnum)
                                    {
                                        exist.data[name][slug][ex] = item.value != null ? item.value : 0;
                                        exist.data[name][slug]['minval'] = 0;
                                        exist.data[name][slug]['maxval'] = 1;
                                    }
                                    else if(ex == 'value_type' && !isnum) exist.data[name][slug][ex] = 0;
                                    else if(ex == 'value_type_description' && !isnum) exist.data[name][slug][ex] = 'Boolean';
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
                                for(var k = 0; k < exist.settings.items.length; k++) {
                                    var ex = exist.settings.items[k];
                                    exist.data[name][name][ex] = item[ex];
                                }
                            }
                        }
                    }
                }
                else {
                    if(exist.data[group] == null) exist.data[group] = {};
                    for(var j = 0; j < exist.settings.attrs.length; j++) {
                        exist.data[group][exist.settings.attrs[j]] = attr[exist.settings.attrs[j]];
                    }
                    for(var j = 0; j < attr.items.length; j++) {
                        var item = attr.items[j];
                        if(exist.data[group][item.attribute] == null) exist.data[group][item.attribute] = {};
                        for(var k = 0; k < exist.settings.items.length; k++) {
                            var ex = exist.settings.items[k];
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
                exist.data.mood.mood.desc = exist.config('moods');
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
                                else if(item.value == null) exist.data[name][slug]['values'][item.date]['value'] = 0;
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
                    var moods = exist.config('moods');
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
        },
        more: function(ready) {
            if(ready || exist.settings.ready) {
                var date = exist.config('page.date'), len = exist.config('page.range'), first = makedate(1-len, date);
                if(exist.data.mood.mood.values && exist.data.mood.mood.values[first] == null) {
                    var start = date, retry = null;
                    for(var i = 1; i < len; i++) {
                        var temp = makedate(0-i, date)
                        if(exist.data.mood.mood.values[temp] == null) {
                            if(retry != null) {
                                start = retry;
                                retry = null;
                                break;
                            }
                            else retry = temp;
                        }
                        else if(retry != null) retry = null;
                    }
                    if(exist.settings.lastattr != start) {
                        exist.settings.lastattr = start;
                        exist.request.start('attributes', 'GET', 'users/$self/attributes', {limit: 31, date_max: start}, exist.load.attributes);
                        return true;
                    }
                }
            }
            return false;
        },
        overrides: function(value, data, key) {
            for(var i in data) {
                if(value[i]) {
                    if(typeof(data[i]) == "object") exist.load.overrides(value[i], data[i], i);
                    else value[i] = data[i];
                }
            }
        },
        attributes: function(data, statname, request) {
            exist.status('Loading attributes..');
            exist.load.attr(data);
            if(!exist.load.more(true)) {
                console.log('user:', exist);
                exist.status('Ready.', 'fas fa-check-circle');
                exist.settings.ready = true;
                for(var i in exist.settings.overrides) exist.load.overrides(exist.data[i], exist.settings.overrides[i], i);
                exist.load.draw();
            }
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
            exist.request.start('attributes', 'GET', 'users/$self/attributes', {limit: 31, date_max: makedate()}, exist.load.attributes);
        },
        draw: function() {
            if(exist.info.id) {
                var page = exist.config('page.id');
                for (var i in Chart.instances) Chart.instances[i].destroy();
                Chart.instances = {};
                if(page == 'day') exist.day.display();
                else if(page == 'chart') exist.chart.display();
                else exist.day.display();
            }
            else {
                var hbody = document.getElementById('exist-header');
                if(hbody) {
                    hbody.innerHTML = '';
                    var hrow = hbody.makechild('tr', 'exist-title-row', 'exist-left'),
                        head = hrow.makechild('td', 'exist-title-info', 'exist-left'),
                        span = head.makechild('span', 'exist-title-info', 'exist-left');
                        span.innerHTML += '<h4>About Exist Sense</h4>';
                        span.innerHTML += '<p>Exist Sense is a work in progress web app which aims to provide an interface to all Exist data along with converting custom tags into usable values. My main goal was to generate charts for my doctor, so all the app really does at the moment at the moment is spit out charts (because that was the point), but basically, it can detect custom tags which specify numeric values, and group together string values.</p>';
                        span.innerHTML += '<p>There are also (currently unexposed) features to pick a date (<tt>#date=YYYY-MM-DD</tt>, defaults to today), a history range (<tt>#range=&lt;num&gt;</tt>, defaults to 31), and a chart selector (<tt>#chart=&lt;first&gt;,&lt;second&gt;,etc</tt>) that is accessible through options embedded in the URL hash [#] (<a href="https://exist.redeclipse.net/#range=60&chart=mood-mood,personal-pain,weather-temp">This example</a> compares ‘mood’ with ‘pain’ and ‘weather temperature’ over the last 60 days).</p>';
                        span.innerHTML += '<p>The format for custom tags is: <tt>&lt;tag&gt; &lt;value&gt; [label]</tt></p>';
                        span.innerHTML += '<p>Some examples of tags I use:<ul>';
                        span.innerHTML += '<li><b>pef 500</b> = numeric value ‘500’ for ‘pef’ (Peak Expiratory Flow)</li>';
                        span.innerHTML += '<li><b>pain 3 high</b> = numeric value ‘3’ for ‘pain’ labelled ‘high’</li>';
                        span.innerHTML += '<li><b>symptom insomnia</b> = string value for ‘symptom’ labelled ‘insomnia’</li>';
                        span.innerHTML += '<li><b>event all nighter</b> = string value for ‘event’ labelled ‘all nighter’</li>';
                        span.innerHTML += '</ul></p>';
                        span.innerHTML += '<h4>Demonstration</h4>';
                        span.innerHTML += '<p>See if you can spot the correlation I saw.</p>';
                        span.innerHTML += '<p><img src="/bits/exist-sense-demo.png" title="Demo Image" alt="Demo Image" style="padding-bottom: 12px" /></p>';
                        span.innerHTML += '<h4>Information</h4>';
                        span.innerHTML += '<p>At the moment, I’m just using the Exist app to update my tags according to this format, though once I get to writing the editor there will be a proper interface to rate a day in a more traditional fashion. Feel free to play around with it, watch the repo for updates, or submit an issue on GitHub to make feature requests. If there’s enough interest I’ll look at expanding this further as needed.</p>';
                        span.innerHTML += '<p>Links:<ul>';
                        span.innerHTML += '<li>Custom tracking: <a href="https://exist.io/blog/custom-tracking/">https://exist.io/blog/custom-tracking/</a></li>';
                        span.innerHTML += '<li>GitHub: <a href="https://github.com/exist-sense/core">https://github.com/exist-sense/core</a></li>';
                        span.innerHTML += '</ul></p>';
                        span.innerHTML += '<p>Please <b><a class="exist-left" href="#" onclick="exist.auth();">Login with Exist.io</a></b> to continue.</p>';
                }
                exist.status('<a class="exist-left" href="#" onclick="exist.auth();">Login with Exist.io</a> to continue', 'fas fa-user');
            }
        },
    },
    day: {
        display: function() {
            var date = exist.config('page.date'), len = exist.config('page.range');
            if(!exist.value(exist.data.weather.weather_summary, date)) {
                var temp = date;
                for(var i = 0; i < len; i++) {
                    temp = makedate(-1, temp);
                    if(exist.value(exist.data.weather.weather_summary, temp)) {
                        date = temp;
                        break;
                    }
                }
            }
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
    },
    chart: {
        list: [],
        data: [],
        resetwait: false,
        clickwait: null,
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
        click: function(values, name) {
            if(values.target.id) {
                if(exist.chart.clickwait == null) {
                    exist.chart.clickwait = exist.config('page.chart');
                    if(exist.chart.clickwait == null) exist.chart.clickwait = '';
                    exist.checkurl({chart: values.target.id.replace('exist-chart-', '')});
                }
                else {
                    exist.checkurl({chart: exist.chart.clickwait && exist.chart.clickwait != '' ? exist.chart.clickwait : null});
                    exist.chart.clickwait = null;
                }
                window.scrollTo(0, $('#' + values.target.id).offset().top-($(window).height()/2)+($('#' + values.target.id).height()/2));
            }
        },
        dataset: function(label, iter, isbool, bools) {
            var col = exist.colour(isbool && bools.length ? (exist.config('page.print') ? (bools.length-1)%2 : 1+bools.length) : iter);
            var data = {
                label: label,
                data: [],
                spanGaps: true,
                fontColor: col,
                fontSize: 10,
                fontStyle: 'bold',
                backgroundColor: col,
                borderColor: exist.config('page.print') ? '#666666' : '#886666',
                pointBorderColor: col,
                borderWidth: 1.5,
            };
            return data;
        },
        scale: function(min, max, display, label, isbool) {
            var print = exist.config('page.print'), bgcol = print ? '#FFFFFF' : '#000000', fgcol = print ? '#000000' : '#FFFFFF', brcol = '#555555';
            var data = {
                display: display || false,
                position: 'left',
                offset: true,
                fontColor: fgcol,
                fontSize: 10,
                fontStyle: 'bold',
                gridLines: {
                    display: display || false,
                    color: '#333333',
                    lineWidth: 1,
                    drawBorder: display || false,
                    drawOnChartArea: display || false,
                    drawTicks: display || false,
                    tickMarkLength: 5,
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
                    fontColor: fgcol,
                    fontSize: 10,
                    fontStyle: 'bold',
                    labelString: isbool ? 'Bool' : label,
                    lineHeight: 1,
                    padding: {
                        top: 4,
                        bottom: 4
                    }
                },
                ticks: {
                    minRotation: 0,
                    maxRotation: 80,
                    suggestedMin: min,
                    suggestedMax: max,
                    mirror: false,
                    padding: 0,
                    reverse: false,
                    display: display || false,
                    autoSkip: true,
                    autoSkipPadding: 0,
                    labelOffset: 0,
                    fontColor: fgcol,
                    fontSize: 10,
                    fontStyle: 'bold',
                }
            };
            return data;
        },
        config: function(id, type, name, isbool) {
            var print = exist.config('page.print'), bgcol = print ? '#FFFFFF' : '#000000', fgcol = print ? '#000000' : '#FFFFFF', brcol = '#555555';
            var data = {
                id: id,
                type: type,
                labels: name,
                values: [],
                data: {
                    labels: [],
                    datasets: []
                },
                options: {
                    responsive: true,
                    events: ['click', 'mousemove', 'mouseout'],
                    onClick: exist.chart.click,
                    responsiveAnimationDuration: 0,
                    maintainAspectRatio: true,
                    showLines: true,
                    elements: {
                        arc: {
                            backgroundColor: bgcol,
                            borderColor: brcol,
                            borderWidth: 2
                        },
                        line: {
                            tension: 0.2,
                            backgroundColor: bgcol,
                            borderWidth: 1.5,
                            borderColor: brcol,
                            borderCapStyle: 'round',
                            borderDashOffset: 0,
                            borderJoinStyle: 'miter',
                            capBezierPoints: true,
                            fill: true
                        },
                        point: {
                            radius: 0,
                            pointStyle: 'circle',
                            backgroundColor: brcol,
                            borderColor: brcol,
                            borderWidth: 1,
                            hitRadius: 2,
                            hoverRadius: 3,
                            hoverBorderWidth: 1
                        },
                        rectangle: {
                            backgroundColor: bgcol,
                            borderColor: brcol,
                            borderSkipped: 'bottom',
                            borderWidth: 0
                        },
                    },
                    animation: {
                        duration: 1000,
                        easing: 'easeOutQuart'
                    },
                    tooltips: {
                        enabled: isbool ? false : true,
                        mode: 'nearest',
                        position: 'average',
                        intersect: true,
                        backgroundColor: '#000000',
                        titleFontStyle: 'bold',
                        titleSpacing: 0,
                        titleMarginBottom: 4,
                        titleFontColor: '#FFFFFF',
                        titleAlign: 'left',
                        bodySpacing: 2,
                        bodyFontColor: '#FFFFFF',
                        bodyAlign: 'left',
                        footerFontStyle: 'normal',
                        footerSpacing: 8,
                        footerMarginTop: 0,
                        footerFontColor: '#FFFFFF',
                        footerAlign: 'left',
                        yPadding: 6,
                        xPadding: 6,
                        caretPadding: 4,
                        caretSize: 6,
                        cornerRadius: 4,
                        multiKeyBackground: '#000000',
                        displayColors: false,
                        borderColor: '#FFFFFF',
                        borderWidth: 1
                    },
                    legend: {
                        display: isbool ? false : true,
                        position: 'top',
                        fontColor: fgcol,
                        fontSize: 10,
                        fontStyle: 'bold',
                        fullWidth: false,
                        reverse: false,
                        weight: 1000,
                        boxWidth: 8,
                        padding: 0
                    },
                    title: {
                        display: isbool ? true : false,
                        fontColor: fgcol,
                        fontSize: 10,
                        fontStyle: 'bold',
                        fullWidth: true,
                        lineHeight: 1.2,
                        padding: 4,
                        position: 'top',
                        weight: 2000,
                        text: name,
                    },
                    layout: {
                        padding: {
                            left: 0,
                            right: 0,
                            top: 0,
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
        create: function(name, type, desc, min, max, values, labels, isbool, bools) {
            var data = exist.chart.config('exist-chart-' + name, type, desc, isbool);
            data.options.scales.xAxes[0] = exist.chart.scale(null, null, true, null, isbool);
            data.options.scales.xAxes[0]['type'] = 'time';
            data.options.scales.xAxes[0]['time'] = {
                unit: 'day',
                minUnit: 'day',
                tooltipFormat: 'LL',
                displayFormats: {
                    day: exist.config('page.range') > 31 ? 'MM-DD' : 'DD'
                }
            };
            for(var i in values) {
                data.options.scales.yAxes[i] = exist.chart.scale(min, max, i == 0 ? true : false, desc, isbool);
                data.values[i] = values[i];
            }
            var num = 0;
            for(var i in labels) {
                data.data.datasets[i] = exist.chart.dataset(labels[i], num, isbool, bools);
                num++;
            }
            return data;
        },
        maketest: function(b, isbool, g, r, date, yest, len) {
            if(b == null) return false;
            if(b.value_type == 2 || (r > 0 && b.priority != r) || (!isbool && !b.minval && !b.maxval)) return false;
            if(b.values == null || ((b.values[date] == null || b.values[date].value == null) & (b.values[yest] == null || b.values[yest].value == null))) return false;
            if(g != null && g[0] == '!disabled') return false;
            for(var x = 0; x < len; x++) {
                var test = makedate(0-x, date);
                if(b.values[test] != null && b.values[test].value != 0) return true;
            }
            return false;
        },
        make: function(head, len, date, size, data, q, bools) {
            var list = data.split('-'), a = exist.data[list[0]], yest = makedate(-1, date);
            if(a && (q <= 0 || a.priority == q)) {
                for(var r = 1; r <= 10; r++) {
                    for(var j in a) {
                        var b = a[j], isbool = b.value_type_description == 'Boolean' ? true : false, g = exist.settings.groups[list[0]] ? exist.settings.groups[list[0]][j] : null;
                        if(!exist.chart.maketest(b, isbool, g, r, date, yest, len)) continue;
                        if(list.length >= 2) {
                            var found = false;
                            for(var x = 1; x < list.length; x++) {
                                var k = j.split('_'), val = (k.length >= 2 ? k[1] : k[0]);
                                if(list[x] == j || list[x] == val) {
                                    found = true;
                                    break;
                                }
                            }
                            if(!found) continue;
                        }
                        var n = list[0] + '-' + j, o = b.value_type_description, minval = b.minval, maxval = b.maxval, values = [b.values], labels = [b.label], extra = [];
                        if(g != null && g.length > 0) {
                            var k = j.split('_');
                            n = list[0] + '-' + (k.length >= 2 ? k[1] : k[0]);
                            for(var x = 0; x < g.length; x++) extra[extra.length] = g[x];
                        }
                        if(extra.length > 0) {
                            for(var x = 0; x < extra.length; x++) {
                                var c = a[extra[x]], cbool = c.value_type_description == 'Boolean' ? true : false;
                                if(!exist.chart.maketest(c, cbool, null, 0, date, yest, len)) continue;
                                values[values.length] = c.values;
                                labels[labels.length] = c.label;
                                if(c.minval < minval) minval = c.minval;
                                if(c.maxval > maxval) maxval = c.maxval;
                            }
                        }
                        var sz = size;
                        if(isbool) {
                            sz = sz*3/10;
                            o = a.label + ': ' + b.label;
                            bools[bools.length] = n;
                        }
                        else {
                            bools = [];
                            if((maxval-minval) >= 10) sz = sz*7/6;
                        }
                        head.innerHTML += '<canvas id="exist-chart-' + n + '" class="exist-chart" width="400px" height="' + sz + 'px"></canvas>';
                        exist.chart.data[exist.chart.data.length] = exist.chart.create(
                            n, isbool ? 'bar' : 'line', o, isbool ? 0 : minval, isbool ? 1 : maxval, values, labels, isbool, isbool ? bools : null,
                        );
                    }
                }
            }
        },
        draw: function(head, indate, inlen) {
            var date = indate ? indate : makedate(), len = inlen || 31, count = 0, bools = [],
                size = exist.chart.width > 1280 ? 75 : 110, c = exist.config('page.chart');
            exist.chart.data = [];
            if(c) {
                var d = c.split(',');
                if(d.length == 1) size *= 2;
                for(var q = 0; q < d.length; q++) exist.chart.make(head, len, date, size, d[q], 0, bools);
            }
            else {
                for(var q = 1; q <= 10; q++) {
                    for(var i in exist.data) exist.chart.make(head, len, date, size, i, q, bools);
                }
            }
            for(var n = 0; n < len; n++) {
                var ndate = makedate(n - (len - 1), date);
                for(var m = 0; m < exist.chart.data.length; m++) {
                    exist.chart.data[m].data.labels[n] = offdate(ndate);
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
                    exist.chart.display();
                }
            }
        }
    }
};

$(document).ready(function ($) {
    /*
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
    */
    exist.start();
});

$(window).on('hashchange', function() {
    exist.checkurl();
});

$(window).resize(function() {
    if(exist.config('page.id') == 'chart') exist.chart.reset();
});
