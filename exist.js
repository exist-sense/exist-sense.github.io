// Helpers
Number.prototype.zeropad = function(len) {
    var s = String(this), c = '0';
    len = len || 2;
    while(s.length < len) s = c + s;
    return s;
}

String.prototype.spacepad = function(len) {
    var s = String(this), c = ' ';
    len = len || 2;
    while(s.length < len) s = c + s;
    return s;
}

Number.prototype.spacepad = function(len) {
    var s = String(this), c = ' ';
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
    if(idname != null) child.id = idname;
    if(classname != null) child.className = classname;
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

function isfunc(object) {
    return typeof(object) == 'function';
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
        moods: {
            '1': { group: 'terrible', label: 'Terrible' },
            '2': { group: 'bad', label: 'Bad' },
            '3': { group: 'ok', label: 'Ok' },
            '4': { group: 'good', label: 'Good' },
            '5': { group: 'great', label: 'Great' }
        },
        groups: {
            productivity: {
                productive_min: ['neutral_min', 'distracting_min'],
                distracting_min: ['!disabled'],
                neutral_min: ['!disabled'],
                emails_received: ['emails_sent'],
                emails_sent: ['!disabled']
            },
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
                group: 'activity',
                label: 'Activity',
                steps: { attribute: 'steps', label: 'Steps', value_type: 0, value_type_description: 'Count' },
                steps_active_min: { attribute: 'steps_active_min', label: 'Active time', value_type: 3, value_type_description: 'Period (min)' },
                steps_elevation: { attribute: 'steps_elevation', label: 'Elevation', value_type: 1, value_type_description: 'Distance (km)' },
                floors: { attribute: 'floors', label: 'Floors', value_type: 0, value_type_description: 'Count' },
                steps_distance: { attribute: 'steps_distance', label: 'Distance', value_type: 1, value_type_description: 'Distance (km)' },
                cycle_min: { attribute: 'cycle_min', label: 'Cycle time', value_type: 3, value_type_description: 'Period (min)' },
                cycle_distance: { attribute: 'cycle_distance', label: 'Cycle distance', value_type: 1, value_type_description: 'Distance (km)' },
            },
            workouts: {
                group: 'workouts',
                label: 'Workouts',
                workouts: { attribute: 'workouts', label: 'Workouts', value_type: 0, value_type_description: 'Integer' },
                workouts_min: { attribute: 'workouts_min', label: 'Minutes', value_type: 3, value_type_description: 'Period (min)' },
                workouts_distance: { attribute: 'workouts_distance', label: 'Distance', value_type: 1, value_type_description: 'Distance (km)' },
            },
            productivity: {
                group: 'productivity',
                label: 'Productivity',
                productive_min: { attribute: 'productive_min', label: 'Productive', value_type: 3, value_type_description: 'Period (min)' },
                neutral_min: { attribute: 'neutral_min', label: 'Neutral', value_type: 3, value_type_description: 'Period (min)' },
                distracting_min: { attribute: 'distracting_min', label: 'Distracting', value_type: 3, value_type_description: 'Period (min)' },
                commits: { attribute: 'commits', label: 'Source code checkins', value_type: 0, value_type_description: 'Count' },
                tasks_completed: { attribute: 'tasks_completed', label: 'Tasks', value_type: 0, value_type_description: 'Count' },
                words_written: { attribute: 'words_written', label: 'Words', value_type: 0, value_type_description: 'Count' },
                emails_sent: { attribute: 'emails_sent', label: 'Emails out', value_type: 0, value_type_description: 'Count' },
                emails_received: { attribute: 'emails_received', label: 'Emails in', value_type: 0, value_type_description: 'Count' },
            },
            food: {
                group: 'food',
                label: 'Food and drink',
                coffees: { attribute: 'coffees', label: 'Coffees', value_type: 0, value_type_description: 'Count' },
                alcoholic_drinks: { attribute: 'alcoholic_drinks', label: 'Alcoholic drinks', value_type: 0, value_type_description: 'Count' },
                energy: { attribute: 'energy', label: 'Energy', value_type: 1, value_type_description: 'Intake (kJ)' },
                water: { attribute: 'water', label: 'Water', value_type: 0, value_type_description: 'Intake (ml)' },
                carbohydrates: { attribute: 'carbohydrates', label: 'Carbohydrates', value_type: 1, value_type_description: 'Intake (g)' },
                fat: { attribute: 'fat', label: 'Fat', value_type: 1, value_type_description: 'Intake (g)' },
                fibre: { attribute: 'fibre', label: 'Fibre', value_type: 1, value_type_description: 'Intake (g)' },
                protein: { attribute: 'protein', label: 'Protein', value_type: 1, value_type_description: 'Intake (g)' },
                sugar: { attribute: 'sugar', label: 'Sugar', value_type: 1, value_type_description: 'Intake (g)' },
                sodium: { attribute: 'sodium', label: 'Sodium', value_type: 1, value_type_description: 'Intake (mg)' },
                cholesterol: { attribute: 'cholesterol', label: 'Cholesterol', value_type: 1, value_type_description: 'Intake (mg)' },
                caffeine: { attribute: 'caffeine', label: 'Caffeine', value_type: 1, value_type_description: 'Intake (mg)' },
            },
            finance: {
                group: 'finance',
                label: 'Finance',
                money_spent: { attribute: 'money_spent', label: 'Money spent', value_type: 1, value_type_description: 'Currency' },
            },
            mood: {
                group: 'mood',
                label: 'Mood',
                mood: {
                    attribute: 'mood',
                    label: 'Mood',
                    value_type_description: 'Scale (1 to 5)',
                    minval: 1,
                    maxval: 5,
                    desc: {
                        '1': { group: 'awful', label: 'Awful' },
                        '2': { group: 'bad', label: 'Bad' },
                        '3': { group: 'ok', label: 'Ok' },
                        '4': { group: 'good', label: 'Good' },
                        '5': { group: 'great', label: 'Great' }
                    },
                },
                mood_note: { attribute: 'mood_note', label: 'Mood note', value_type: 2, value_type_description: 'String' },
            },
            sleep: {
                group: 'sleep',
                label: 'Sleep',
                sleep: { attribute: 'sleep', label: 'Sleep time', value_type: 3, value_type_description: 'Period (min)' },
                time_in_bed: { attribute: 'time_in_bed', label: 'Time in bed', value_type: 3, value_type_description: 'Period (min)' },
                sleep_start: { attribute: 'sleep_start', label: 'Sleep Start', value_type: 6, value_type_description: 'Time (mins from midday)' },
                sleep_end: { attribute: 'sleep_end', label: 'Sleep End', value_type: 4, value_type_description: 'Time (mins from midnight)' },
                sleep_awakenings: { attribute: 'sleep_awakenings', label: 'Awakenings', value_type: 0, value_type_description: 'Count' },
            },
            events: {
                group: 'events',
                label: 'Events',
                events: { attribute: 'events', label: 'Events', value_type: 0, value_type_description: 'Count' },
                events_duration: { attribute: 'events_duration', label: 'Time in events', value_type: 3, value_type_description: 'Period (min)' },
            },
            health: {
                group: 'location',
                label: 'Location',
                weight: { attribute: 'weight', label: 'Weight', value_type: 1, value_type_description: 'Weight (kg)' },
                body_fat: { attribute: 'body_fat', label: 'Body fat', value_type: 5, value_type_description: 'Percentage (%)', value_conversion: 1 },
                heartrate: { attribute: 'heartrate', label: 'Heartrate', value_type: 0, value_type_description: 'Interval (beats per min)' },
                meditation_min: { attribute: 'meditation_min', label: 'Meditation', value_type: 3, value_type_description: 'Period (min)' },
            },
            location: {
                group: 'location',
                label: 'Location',
                checkins: { attribute: 'checkins', label: 'Checkins', value_type: 0, value_type_description: 'Count' },
                location: { attribute: 'location', label: 'Location', value_type: 2, value_type_description: 'Lat/Long' },
            },
            media: {
                group: 'media',
                label: 'Media',
                tracks: { attribute: 'tracks', label: 'Tracks played', value_type: 0, value_type_description: 'Count' },
                articles_read: { attribute: 'articles_read', label: 'Articles read', value_type: 0, value_type_description: 'Count' },
            },
            social: {
                group: 'social',
                label: 'Social',
                facebook_posts: { attribute: 'facebook_posts', label: 'Facebook posts', value_type: 0, value_type_description: 'Count' },
                facebook_reactions: { attribute: 'facebook_reactions', label: 'Facebook reactions', value_type: 0, value_type_description: 'Count' },
                facebook_comments: { attribute: 'facebook_comments', label: 'Facebook comments', value_type: 0, value_type_description: 'Count' },
                instagram_posts: { attribute: 'instagram_posts', label: 'Instagram posts', value_type: 0, value_type_description: 'Count' },
                instagram_comments: { attribute: 'instagram_comments', label: 'Instagram comments', value_type: 0, value_type_description: 'Count' },
                instagram_likes: { attribute: 'instagram_likes', label: 'Instagram likes', value_type: 0, value_type_description: 'Count' },
                instagram_username: { attribute: 'instagram_username', label: 'Instagram username', value_type: 2, value_type_description: 'String' },
            },
            twitter: {
                group: 'twitter',
                label: 'Twitter',
                tweets: { attribute: 'tweets', label: 'Tweets', value_type: 0, value_type_description: 'Count' },
                twitter_mentions: { attribute: 'twitter_mentions', label: 'Twitter mentions', value_type: 0, value_type_description: 'Count' },
                twitter_username: { attribute: 'twitter_username', label: 'Twitter username', value_type: 2, value_type_description: 'String' },
            },
            weather: {
                group: 'weather',
                label: 'Weather',
                weather_temp_max: { attribute: 'weather_temp_max', label: 'Max Temp', value_type: 1, value_type_description: 'Temp (°C)' },
                weather_temp_min: { attribute: 'weather_temp_min', label: 'Min Temp', value_type: 1, value_type_description: 'Temp (°C)' },
                weather_precipitation: { attribute: 'weather_precipitation', label: 'Precipitation', value_type: 1, value_type_description: 'Percentage (%)', value_conversion: 1 },
                weather_cloud_cover: { attribute: 'weather_cloud_cover', label: 'Cloud cover', value_type: 5, value_type_description: 'Percentage (%)', value_conversion: 1 },
                weather_wind_speed: { attribute: 'weather_wind_speed', label: 'Wind speed', value_type: 1, value_type_description: 'Speed (km/h)' },
                weather_summary: { attribute: 'weather_summary', label: 'Weather summary', value_type: 2, value_type_description: 'String' },
                weather_icon: { attribute: 'weather_icon', label: 'Icon', value_type: 2, value_type_description: 'String' },
                sunrise: { attribute: 'sunrise', label: 'Sunrise', value_type: 4, value_type_description: 'Time (mins from midnight)' },
                sunset: { attribute: 'sunset', label: 'Sunset', value_type: 6, value_type_description: 'Time (mins from midday)' },
            },
            personal: {
                group: 'personal',
                label: 'Personal',
                bpd: {
                    label: 'Bipolar cycle',
                    value_type_description: 'Scale (1 to 5)',
                    minval: 1,
                    maxval: 5,
                },
                pain: {
                    value_type_description: 'Scale (0 to 5)',
                    invert: true,
                    minval: 0,
                    maxval: 5,
                },
                pef: {
                    label: 'Peak expiratory flow',
                    value_type_description: 'Volume (L/min)',
                },
                sq: {
                    label: 'Sleep quality',
                    value_type_description: 'Scale (0 to 5)',
                    minval: 0,
                    maxval: 5,
                }
            },
            med: {
                group: 'med',
                label: 'Medication',
            },
            pact: {
                group: 'pact',
                label: 'Predominant activity',
            },
            proj: {
                group: 'proj',
                label: 'Active project',
            },
            symp: {
                group: 'symp',
                label: 'Symptom',
            },
        },
        print: {
            on: ['/print.css'],
            off: ['/bits/css/default.css', '/bits/css/common.css', '/exist.css']
        },
        page: {
            id: 'chart',
            date: makedate(),
            range: 31,
            values: null,
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
    makergba: function(xr, xg, xb, xa, xv) {
        var a = xa || 1.0, v = xv || 1.0,
            r = Math.floor(Math.max(Math.min(xr * v, 255), 0)),
            g = Math.floor(Math.max(Math.min(xg * v, 255), 0)),
            b = Math.floor(Math.max(Math.min(xb * v, 255), 0));
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
    },
    makecol: function(xa, xv) {
        var a = xa || 1.0, v = xv || 1.0;
        return [
            exist.makergba(32,  255, 32,  a, v),
            exist.makergba(200, 32,  32,  a, v),
            exist.makergba(200, 128, 32,  a, v),
            exist.makergba(200, 32,  200, a, v),
            exist.makergba(128, 200, 255, a, v),
            exist.makergba(255, 255, 64,  a, v),
            exist.makergba(255, 32,  32,  a, v),
            exist.makergba(64,  128, 255, a, v),
            exist.makergba(42,  42,  192, a, v),
            exist.makergba(32,  255, 64,  a, v),
            exist.makergba(255, 255, 32,  a, v),
            exist.makergba(255, 128, 255, a, v),
            exist.makergba(255, 128, 64,  a, v),
            exist.makergba(64,  64,  255, a, v),
        ];
    },
    makescol: function(xr, xa, xv, invert) {
        var r = Math.min(Math.max(xr, 0), 5), a = xa || 1.0, v = xv || 1.0,
            data = [
                exist.makergba(128, 128, 128, a, v),
                exist.makergba(255, 32,  32,  a, v),
                exist.makergba(255, 128, 32,  a, v),
                exist.makergba(255, 255, 32,  a, v),
                exist.makergba(32,  255, 128, a, v),
                exist.makergba(32,  255, 32,  a, v),
            ];
        if(invert && r > 0) r = 6-r;
        return data[r];
    },
    colour: function(iter, alpha, value) {
        var colours = exist.makecol(alpha, value);
        if(colours != null) return colours[iter%colours.length];
        return exist.makergba(128, 128, 128, alpha, value);
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
                load.innerHTML = exist.fa(type, exist.makergba(200, 200, 255), 0) + ' ' + title;
                load.visibility = 'visible';
            }
            else {
                load.innerHTML = '';
                load.visibility = 'hidden';
            }
        }
    },
    rangeanc: function(range, len) {
        return ' | <a href="#" onclick="return exist.seturl(\'range\', ' + len + ');" style="font-weight: ' + (range == len ? 900 : 400) + '; text-decoration: ' + (range == len ? 'underline' : 'none') + '">' + len + '</a>';
    },
    auth: function() {
        window.location = 'https://exist.io/oauth2/authorize?response_type=code&client_id=124d5b5764184a4d81c2&redirect_uri=https%3A%2F%2Fexist.redeclipse.net%2F&scope=read+write';
    },
    switch: function() {
        makecookie('access_token', '', 0);
        exist.settings.cookies.access_token = null;
        makecookie('refresh_token', '', 0);
        exist.settings.cookies.refresh_token = null;
        makecookie('token_type', '', 0);
        exist.settings.cookies.token_type = null;
        exist.start();
        return false;
    },
    checkurl: function(values, chg) {
        var url = window.location.href, hash = url.split('#'), params = hash[0].split('?'), value = params[0], print = exist.config('page.print');
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
        for(var i in exist.defaults.page) if(!isfunc(exist.defaults.page[i])) exist.settings.page[i] = exist.defaults.page[i];
        if(values || (hash.length >= 2 && hash[1] != '')) {
            if(hash.length >= 2 && hash[1] != '') {
                var code = hash[1].split('&');
                for(var i = 0; i < code.length; i++) {
                    var item = code[i].split('=');
                    exist.settings.page[item[0]] = item[1];
                }
            }
            for(var i in values) if(!isfunc(values[i])) exist.settings.page[i] = values[i];
            var opts = hash[0] + '#', vars = 0;
            for(var i in exist.settings.page) {
                if(isfunc(exist.settings.page[i])) continue;
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
            value = vars ? opts : hash[0];
        }
        if(!exist.config('ready') || exist.config('page.print') != print) {
            var head = document.getElementById('exist-body');
            if(head) head.innerHTML = '';
            var hdr = document.getElementsByTagName('head');
            if(hdr) {
                var ccss = document.getElementsByClassName('exist-css');
                for(var i = ccss.length-1; i >= 0; i--) ccss[i].parentNode.removeChild(ccss[i]);
                var list = exist.config('page.print') ? exist.config('print.on') : exist.config('print.off');
                for(var i = 0; i < list.length; i++) {
                    var child = document.createElement('link');
                    child.rel = 'stylesheet';
                    child.type = 'text/css';
                    child.href = list[i];
                    child.className = 'exist-css';
                    hdr[0].appendChild(child);
                }
            }
            if(chg && chg != null) window.history.replaceState({}, document.title, value);
            else window.history.pushState({}, document.title, value);
        }
        else if(chg || value != window.location.href) {
            if(chg && chg != null) window.history.replaceState({}, document.title, value);
            else window.history.pushState({}, document.title, value);
        }
        if(!exist.load.more() && exist.config('ready')) window.setTimeout(exist.load.draw, 50);
    },
    seturl: function(id, data) {
        var value = {};
        value[id] = data;
        exist.checkurl(value);
        return false;
    },
    makenav: function(data) {
        var nav = document.getElementById('navbar-sm');
        if(nav) {
            nav.innerHTML = '';
            var ul = nav.makechild('ul', 'navbar-list', 'nav navbar-nav navbar-right');
            ul.innerHTML += '<li class="navitem"><a href="https://github.com/exist-sense/core" title="GitHub Page"><span class="fab fa-github fa-fw" aria-hidden="true"></span><div class="navtext">GitHub Page</div></a></li>';
            ul.innerHTML += '<li class="navitem"><a href="https://github.com/exist-sense/core/issues/new" title="Submit a Feature Request or Bug Report"><span class="fas fa-list-alt fa-fw" aria-hidden="true"></span><div class="navtext">Requests &amp; Bugs</div></a></li>';
            ul.innerHTML += '<li class="navitem"><a href="mailto:exist-sense@redeclipse.net" title="Contact"><span class="fas fa-at fa-fw" aria-hidden="true"></span><div class="navtext">Contact</div></a></li>';
            if(data != null && data.length > 0) {
                var ul2 = nav.makechild('ul', 'navbar-list', 'nav navbar-nav navbar-right');
                for(var i = 0; i < data.length; i++) {
                    if(data[i] == null || isfunc(data[i])) continue;
                    ul2.innerHTML += data[i];
                }
            }
        }
    },
    start: function() {
        exist.makenav(['<li class="navitem"><a href="#" onclick="return exist.auth();" title="Login with Exist.io"><span class="fas fa-user-plus fa-fw" aria-hidden="true"></span><div class="navtext">Login</div></a></li>']);
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
        if(!exist.config('nologin')) {
            if(exist.settings.cookies.access_token != null)
                exist.login.draw({ token_type: exist.settings.cookies.token_type, access_token: exist.settings.cookies.access_token, refresh_token: exist.settings.cookies.refresh_token });
            else if(exist.settings.cookies.refresh_token != null)
                exist.login.start('refresh_token', 'refresh_token', exist.settings.cookies.refresh_token, exist.login.success, exist.login.refresh);
            else exist.load.draw();
        }
        else exist.status('Logging in..');
    },
    response: function(request, statname, data) {
        if(request.status == 403) {
            makecookie('access_token', '', 0);
            exist.settings.cookies.access_token = null;
            if(exist.settings.cookies.refresh_token != null)
                exist.login.start('refresh_token', 'refresh_token', exist.settings.cookies.refresh_token, exist.login.success, exist.login.refresh);
            else exist.auth();
        }
    },
    login: {
        error: function(request, statname, data) {
            var error = request != null && request.responseJSON != null ? request.responseJSON.error : '';
            exist.status('Authorisation ' + statname + ': ' + data + ' ' + error, 'fas fa-exclamation-circle');
        },
        refresh: function(request, statname, data) {
            var error = request != null && request.responseJSON != null ? request.responseJSON.error : '';
            exist.status('Refresh ' + statname + ': ' +  data + ' ' + error, 'fas fa-exclamation-circle');
            exist.auth();
        },
        draw: function(data) {
            exist.status('Logged in!', 'fas fa-check-circle');
            var top = document.getElementById('exist-login');
            if(top) {
                top.href = '#';
                top.title = 'Waiting for user information..';
                top.onclick = '';
            }
            exist.access = data;
            exist.request.start('today', 'GET', 'users/$self/today', {}, exist.load.today, exist.load.error);
        },
        success: function(request, statname, data) {
            if(request.token_type != null && request.refresh_token != null) {
                makecookie('token_type', request.token_type, request.expires_in / 60 / 60 / 24);
                exist.settings.cookies.token_type = request.token_type;
                if(request.access_token != null) {
                    makecookie('access_token', request.access_token, request.expires_in / 60 / 60 / 24);
                    exist.settings.cookies.access_token = data.access_token;
                }
                makecookie('refresh_token', request.refresh_token, request.expires_in / 60 / 60 / 24);
                exist.settings.cookies.refresh_token = request.refresh_token;
                exist.login.draw(request);
            }
            else exist.status('Login provided no refresh token details.', 'fas fa-exclamation-circle');
        },
        start: function(type, name, access_code, success_callback, error_callback) {
            var pname = name.replace('_', ' ');
            exist.status('Logging in with ' + pname + '..');
            var reqdata = {
                method: 'POST',
                url: 'https://exist.redeclipse.net/oauth2/access_token',
                data: {
                    grant_type: type,
                    client_id: '124d5b5764184a4d81c2',
                    client_secret: 'c2fa36b0daa451bb6fd5a89ee5856eaadf17b2aa',
                    redirect_uri: window.location.href
                },
                success: function(request, statname, data) {
                    console.log(type + ':', request, statname, data);
                    if(success_callback) success_callback(request, statname, data);
                },
                error: function(request, statname, data) {
                    console.log(type + ':', request, request.getAllResponseHeaders(), statname, data);
                    if(error_callback) error_callback(request, statname, data);
                    exist.response(request, statname, data);
                }
            }
            reqdata.data[name] = access_code;
            console.log(type + ': start', access_code, reqdata);
            $.ajax(reqdata);
        },
    },
    request: {
        error: function(request, statname, data, name) {
            exist.status('Loading ' + name + ' - ' + statname + ': ' + data, 'fas fa-exclamation-circle');
        },
        start: function(name, method, uri, values, success_callback, error_callback) {
            exist.status('Requesting ' + name + '..');
            var reqdata = {
                method: method,
                url: 'https://exist.io/api/1/' + uri + '/',
                data: method != 'POST' ? values : JSON.stringify(values),
                dataType: method != 'POST' ? null : 'json',
                contentType: method != 'POST' ? 'application/x-www-form-urlencoded' : 'application/json',
                headers: {
                    Authorization: exist.access.token_type + ' ' + exist.access.access_token
                },
                success: function(request, statname, data) {
                    console.log('request (' + name + '):', request, statname, data);
                    if(success_callback) success_callback(request, statname, data);
                },
                error: function(request, statname, data) {
                    console.log('request (' + name + '):', request, request.getAllResponseHeaders(), statname, data);
                    if(error_callback) error_callback(request, statname, data, name);
                    else exist.request.error(request, statname, data, name)
                    exist.response(request, statname, data);
                }
            }
            console.log('request (' + name + '): start', uri, reqdata);
            $.ajax(reqdata);
        },
    },
    load: {
        attrs: [ 'group', 'label', 'priority' ],
        items: [ 'attribute', 'label', 'priority', 'private', 'service', 'value', 'value_type', 'value_type_description' ],
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
                                var quot = 0, off = false;
                                for(var n = start; n < values.length; n++) {
                                    if(values[n] == 'q') {
                                        label = label + ' (';
                                        quot++;
                                    }
                                    else if(values[n] == 'n') off = true;
                                    else {
                                        var v = quot ? values[n] : values[n].capital();
                                        label = label != null ? (label + (quot == 1 ? '' : ' ') + v) : v;
                                        grp = grp != null ? (grp + '_' + values[n]) : values[n];
                                        if(quot) quot++;
                                    }
                                }
                                if(quot) label += ')';
                                if(!isnum && grp) slug = grp;
                                if(exist.data[name] == null) {
                                    exist.data[name] = {
                                        group: name,
                                        label: name.capital(),
                                        priority: item.priority
                                    };
                                }
                                if(exist.data[name][slug] == null) exist.data[name][slug] = { offset: off };
                                for(var k = 0; k < exist.load.items.length; k++) {
                                    var ex = exist.load.items[k];
                                    if(ex == 'attribute') exist.data[name][slug][ex] = slug;
                                    else if(ex == 'label') exist.data[name][slug][ex] = slug == 'pef' ? 'Peak Expiratory Flow' : (isnum ? slug.capital() : label);
                                    else if(ex == 'value' && isnum) exist.data[name][slug][ex] = pint;
                                    else if(ex == 'value' && !isnum) exist.data[name][slug][ex] = item.value != null ? item.value : 0;
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
                                for(var k = 0; k < exist.load.items.length; k++) {
                                    var ex = exist.load.items[k];
                                    exist.data[name][name][ex] = item[ex];
                                }
                            }
                            exist.data[name][slug].value_converted = false;
                        }
                    }
                }
                else {
                    if(exist.data[group] == null) exist.data[group] = {};
                    for(var j = 0; j < exist.load.attrs.length; j++) {
                        exist.data[group][exist.load.attrs[j]] = attr[exist.load.attrs[j]];
                    }
                    for(var j = 0; j < attr.items.length; j++) {
                        var item = attr.items[j];
                        if(exist.data[group][item.attribute] == null) exist.data[group][item.attribute] = {};
                        for(var k = 0; k < exist.load.items.length; k++) {
                            var ex = exist.load.items[k];
                            exist.data[group][item.attribute][ex] = item[ex];
                        }
                        exist.data[group][item.attribute].value_converted = false;
                    }
                }
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
                    var quot = 0, off = false;
                    for(var n = start; n < values.length; n++) {
                        if(values[n] == 'q') {
                            label = label + ' (';
                            quot++;
                        }
                        else if(values[n] == 'n') off = true;
                        else {
                            var v = quot ? values[n] : values[n].capital();
                            label = label != null ? (label + (quot == 1 ? '' : ' ') + v) : v;
                            grp = grp != null ? (grp + '_' + values[n]) : values[n];
                            if(quot) quot++;
                        }
                    }
                    if(quot) label += ')';
                    if(!isnum && grp) slug = grp;
                    if(exist.data[name] == null) {
                        exist.data[name] = {
                            group: name,
                            label: name.capital(),
                            priority: attr.priority
                        };
                    }
                    if(exist.data[name][slug] == null) exist.data[name][slug] = { offset: off, values: {} };
                    if(exist.data[name][slug]['values'] == null) exist.data[name][slug]['values'] = {};
                    for(var j = 0; j < attr.values.length; j++) {
                        var item = attr.values[j];
                        if(item.value || !isnum) {
                            if(exist.data[name][slug]['values'][item.date] == null) exist.data[name][slug]['values'][item.date] = {};
                            if(values.length >= 2) {
                                exist.data[name][slug]['values'][item.date]['value'] = isnum ? pint : (!isnum && item.value == null ? 0 : item.value);
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
                            exist.data[name][slug]['values'][item.date].value_converted = false;
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
                        if(item.value == null) continue;
                        if(group == 'mood' && attr.attribute == 'mood') {
                            var val = item.value.toString();
                            exist.data[group][attr.attribute]['values'][item.date]['group'] = moods[val].group;
                            exist.data[group][attr.attribute]['values'][item.date]['label'] = moods[val].label;
                        }
                        exist.data[group][attr.attribute]['values'][item.date].value_converted = false;
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
            if(value == null) value = {};
            for(var i in data) {
                if(value[i] == null) value[i] = {};
                if(isfunc(data[i])) continue;
                if(typeof(data[i]) == "object") exist.load.overrides(value[i], data[i], i);
                else value[i] = data[i];
            }
        },
        attributes: function(request, statname, data) {
            exist.status('Loading attributes..');
            exist.load.attr(request);
            if(!exist.load.more(true)) {
                console.log('user:', exist);
                exist.status('Ready.', 'fas fa-check-circle');
                exist.settings.ready = true;
                for(var i in exist.settings.overrides) if(!isfunc(exist.settings.overrides[i])) exist.load.overrides(exist.data[i], exist.settings.overrides[i], i);
                for(var i in exist.data) {
                    if(exist.data[i] == null || isfunc(exist.data[i])) continue;
                    for(var j in exist.data[i]) {
                        if(exist.data[i][j] == null || isfunc(exist.data[i][j])) continue;
                        if(exist.data[i][j].value_type != 2) {
                            if(exist.data[i][j].value_conversion == 1) {
                                if(!exist.data[i][j].value_converted && exist.data[i][j].value) {
                                    exist.data[i][j].value = parseInt(exist.data[i][j].value * 100);
                                    exist.data[i][j].value_converted = true;
                                }
                                exist.data[i][j].value_type = 0;
                                for(var k in exist.data[i][j].values) {
                                    if(!exist.data[i][j].values[k] || isfunc(exist.data[i][j].values[k])) continue;
                                    if(exist.data[i][j].values[k].value) {
                                        if(!exist.data[i][j].values[k].value_converted) {
                                            exist.data[i][j].values[k].value = parseInt(exist.data[i][j].values[k].value * 100);
                                            exist.data[i][j].values[k].value_converted = true;
                                        }
                                    }
                                }
                             }
                             if(exist.data[i][j].minval == null) {
                                exist.data[i][j].minval = exist.data[i][j].value;
                                exist.data[i][j].maxval = exist.data[i][j].value;
                                for(var k in exist.data[i][j].values) {
                                    if(!exist.data[i][j].values[k] || isfunc(exist.data[i][j].values[k])) continue;
                                    if(exist.data[i][j].values[k].value) {
                                        if(exist.data[i][j].values[k].value > exist.data[i][j].maxval) exist.data[i][j].maxval = exist.data[i][j].values[k].value;
                                        if(exist.data[i][j].values[k].value < exist.data[i][j].minval) exist.data[i][j].minval = exist.data[i][j].values[k].value;
                                    }
                                }
                             }
                        }
                    }
                }
                exist.load.draw();
            }
        },
        today: function(request, statname, data) {
            exist.status('Loading today..');
            jQuery.each(request, function(i, val) {
                if(i != 'attributes') exist.info[i] = val;
            });
            exist.load.data(request.attributes);
            var top = document.getElementById('exist-login');
            if(top) {
                top.innerHTML = '<img src="' + exist.info.avatar + '" />';
                top.href = 'https://exist.io/dashboard/';
                top.title = 'Logged in as: ' + exist.info.username + ' (#' + exist.info.id + ')';
                top.target = '_blank';
                top.onclick = '';
            }
            exist.makenav([
                '<li class="navitem"><a href="#" onclick="return exist.seturl(\'id\', \'day\');" title="Day View"><span class="fas fa-calendar-alt fa-fw" aria-hidden="true"></span><div class="navtext">Day View</div></a></li>',
                '<li class="navitem"><a href="#" onclick="return exist.seturl(\'id\', \'chart\');" title="Chart View"><span class="fas fa-chart-line fa-fw" aria-hidden="true"></span><div class="navtext">Chart View</div></a></li>',
                '<li class="navitem"><a href="#" onclick="return exist.seturl(\'print\', true);" title="Print View"><span class="fas fa-print fa-fw" aria-hidden="true"></span><div class="navtext">Print View</div></a></li>',
                '<li class="navitem"><a href="#" onclick="return exist.switch();" title="Logout"><span class="fas fa-user-times fa-fw" aria-hidden="true"></span><div class="navtext">Logout</div></a></li>'
            ]);
            exist.request.start('attributes', 'GET', 'users/$self/attributes', {limit: 31, date_max: makedate()}, exist.load.attributes);
        },
        draw: function() {
            var head = document.getElementById('exist-body');
            if(exist.info.id) {
                var page = exist.config('page.id');
                for (var i in Chart.instances) if(!isfunc(Chart.instances[i])) Chart.instances[i].destroy();
                Chart.instances = {};
                if(head) head.innerHTML = '';
                if(page == 'day') exist.day.display();
                else if(page == 'chart') exist.chart.display();
                else exist.day.display();
            }
            else {
                if(head) {
                    head.innerHTML = '';
                    var hrow = head.makechild('tr', 'exist-title-row', 'exist-center'),
                        hdr = hrow.makechild('td', 'exist-title-info', 'exist-center'),
                        span = hdr.makechild('span', 'exist-title-info', 'exist-center');
                        span.innerHTML += '<h4>About Exist Sense</h4>';
                        span.innerHTML += '<p>Exist Sense is a work in progress web app which aims to provide an interface to all Exist data along with converting custom tags into usable values. My main goal was to generate charts for my doctor, so all the app really does at the moment at the moment is spit out charts (because that was the point), but basically, it can detect custom tags which specify numeric values, and group together string values.</p>';
                        span.innerHTML += '<p>There are also (currently unexposed) features to pick a date (<tt>#date=YYYY-MM-DD</tt>, defaults to today), a history range (<tt>#range=&lt;num&gt;</tt>, defaults to 31), and a value selector (<tt>#values=&lt;first&gt;,&lt;second&gt;,etc</tt>) that is accessible through options embedded in the URL hash [#] (<a href="https://exist.redeclipse.net/#range=60&values=mood-mood,personal-pain,weather-temp">This example</a> compares ‘mood’ with ‘pain’ and ‘weather temperature’ over the last 60 days).</p>';
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
                        span.innerHTML += '<p>Please <b><a class="exist-left" href="#" onclick="return exist.auth();">Login with Exist.io</a></b> to continue.</p>';
                }
                exist.status('<a class="exist-left" href="#" onclick="return exist.auth();">Login with Exist.io</a> to continue', 'fas fa-user');
            }
        },
    },
    day: {
        maketest: function(b, isbool, r, date) {
            if(b == null || b.value_type == null || (r > 0 && (b.priority || 1) != r)) return false;
            return true;
        },
        make: function(table, date, data, q) {
            var list = data.split('-'), a = exist.data[list[0]];
            if(a && (q <= 0 || a.priority == q)) {
                var trow = table.makechild('tr', 'exist-inner-row');
                trow.innerHTML += '<th colspan="2">' + a.label + '</th><th class="hide-small"></th><th style="text-align: right; font-size: 12px;">Acquired</th>';
                for(var r = 1; r <= 10; r++) {
                    for(var j in a) {
                        if(isfunc(a[j])) continue;
                        var b = a[j], isbool = b.value_type_description == 'Boolean' ? true : false;
                        if(!exist.day.maketest(b, isbool, r, date)) continue;
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
                        var n = list[0] + '-' + j, o = b.value_type_description, t = b.label,
                            value = b.values != null && b.values[date] != null && b.values[date].value != null ? b.values[date].value : null,
                            acquired = b.service == 'exist_sense' ? true : false, irow = table.makechild('tr', 'exist-day-' + n);
                        if(b.offset) t += ' (last night)';
                        irow.innerHTML += '<td style="text-align: right;"><b>' + t + '</b></td>';
                        if(isbool) irow.innerHTML += '<td style="width: 200px; text-align: right;"><label class="checkbox"><input type="checkbox" id="exist-value-' + n + '" name="exist-value-' + n + '" ' + (value ? 'checked' : '') + ' /><span class="checkmark"></span></label></td>';
                        else if((b.minval == 0 || b.minval == 1) && (b.maxval >= 5 && b.maxval <= (list[0] == 'personal' ? 10 : 5))) {
                            var inputs = '';
                            for(var z = b.minval; z <= b.maxval; z++) {
                                var y = String(z), desc = b.desc && b.desc[y] ? (b.desc[y].label + ' (' + y + ')') : y;
                                if(z == 6) inputs += '<br />';
                                inputs += '<label class="radiobox" title="' + desc + '"><input type="radio" id="exist-value-' + n + '" name="exist-value-' + n + '" ' + (value == z ? 'checked' : '') + ' /><span id="value-' + (b.invert && z > 0 ? 11-z : z) + '" class="radiomark"></span></label>';
                            }
                            irow.innerHTML += '<td style="width: 200px; text-align: right">' + inputs + '</td>';
                        }
                        else irow.innerHTML += '<td style="width: 200px; text-align: right"><input type="text" autocomplete="off" id="exist-value-' + n + '" name="exist-value-' + n + '" value="' + (value || '') + '" style="width: 100%;" /></td>';
                        irow.innerHTML += '<td class="hide-small">' + o + '</td>';
                        irow.innerHTML += '<td style="text-align: right"><label class="checkbox" title="Owned by: ' + (b.service || 'none') + '">' +
                            '<input type="checkbox" id="exist-acquire-' + n + '" name="exist-acquire-' + n + '" ' + (acquired ? 'checked' : '') + ' />' + 
                            '<span class="checkmark"></span></label></td>';
                    }
                }
            }
        },
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
            var head = document.getElementById('exist-body'), day = (date != makedate() ? (date != makedate(-1) ? date : 'yesterday') : 'today');
            if(head) {
                head.innerHTML = '';
                var hrow = head.makechild('tr', 'exist-title-row', 'exist-center'),
                    hdr = hrow.makechild('td', 'exist-title-info', 'exist-center'),
                    span = hdr.makechild('span', 'exist-title-info', 'exist-center');
                span.makechild('h4', 'exist-title-info-welcome').innerHTML = 'Welcome ' + exist.info.first_name + ', here is your data for ' + day;
                if(exist.value(exist.data.weather.weather_summary, date)) {
                    var weather = exist.data.weather, par = span.makechild('p', 'exist-title-info-weather');
                    if(exist.value(weather.weather_icon, date))
                        par.innerHTML += ' <img src="https://exist.io/static/img/weather/' + exist.value(weather.weather_icon, date) + '.png" title="' + exist.value(weather.weather_summary, date) + '" class="exist-icon" />';
                    else par.innerHTML += ' ' + exist.fa('fas fa-sun', exist.makergba(255, 255, 0), 4, '0px 4px 0px 0px');
                    if(exist.value(weather.weather_summary, date))
                        par.innerHTML += ' <i>' + exist.value(weather.weather_summary, date) + '</i>';
                    if(exist.value(weather.weather_temp_min, date))
                        par.innerHTML += ' ' + weather.weather_temp_min.label + ' of <b>' + exist.value(weather.weather_temp_min, date) + '&deg;C</b>.';
                    if(exist.value(weather.weather_temp_max, date))
                        par.innerHTML += ' ' + weather.weather_temp_max.label + ' of <b>' + exist.value(weather.weather_temp_max, date) + '&deg;C</b>.';
                }
                var form = hdr.makechild('form', 'exist-form');
                form.action = '#';
                form.setAttribute('onSubmit', 'alert("Not yet implemented, sorry!"); return false;');
                var table = form.makechild('table', 'exist-inner'),
                    thead = table.makechild('thead', 'exist-inner-head'),
                    c = exist.config('page.values');
                table.align = 'center';
                if(c) {
                    var d = c.split(',');
                    for(var q = 0; q < d.length; q++) exist.day.make(thead, date, d[q], 0);
                }
                else {
                    for(var q = 1; q <= 10; q++) {
                        for(var i in exist.data) if(!isfunc(exist.data[i])) exist.day.make(thead, date, i, q);
                    }
                }
                var trow = thead.makechild('tr', 'exist-inner-finish');
                trow.innerHTML += '<th colspan="2">Finished</th><th class="hide-small"></th><th></th>';
                var vrow = thead.makechild('tr', 'exist-inner-submit');
                vrow.innerHTML += '<td colspan="2"><b>NOTE:</b> Exist Sense will only take ownership of attributes marked as acquired.</td><td class="hide-small"></td><td style="text-align: right"><input type="submit" name="Submit" value="Submit" title="Not implemented yet!" style="width: 100%" disabled /></td>';
            }
        },
    },
    chart: {
        list: [],
        data: [],
        resetwait: false,
        clickwait: null,
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
        defaults: function() {
            var print = exist.config('page.print'), bgcol = print ? exist.makergba(255, 255, 255) : exist.makergba(0, 0, 0), fgcol = print ? exist.makergba(0, 0, 0) : exist.makergba(255, 255, 255), brcol = print ? exist.makergba(64, 64, 64) : exist.makergba(192, 192, 192);
            Chart.defaults.global.defaultColor = fgcol;
            Chart.defaults.global.defaultFontColor = fgcol;
            Chart.defaults.global.defaultFontFamily = 'monospace';
            Chart.defaults.global.defaultFontSize = exist.chart.size(11);
            Chart.defaults.global.defaultFontStyle = 'bold';
            Chart.defaults.global.showLines = true;
        },
        size: function(size) {
            var sz = size, sq = exist.chart.width/1920.0; // 11 - 7 = 4, 640 / 1920 = 0.3333333333333333
            if(sq < 1.0) sz -= (size-6)*(1.0-sq);
            return Math.max(sz, 6);
        },
        click: function(values, name) {
            if(values.target.id) {
                if(exist.chart.clickwait == null) {
                    exist.chart.clickwait = exist.config('page.values');
                    if(exist.chart.clickwait == null) exist.chart.clickwait = '';
                    var label = values.target.id.replace('exist-chart-', ''), bits = label.split('-');
                    if(bits.length >= 2 && exist.data[bits[0]] && exist.data[bits[0]][bits[1]] && exist.data[bits[0]][bits[1]].value_type_description == 'Boolean') label = bits[0];
                    exist.seturl('values', label);
                }
                else {
                    exist.seturl('values', exist.chart.clickwait && exist.chart.clickwait != '' ? exist.chart.clickwait : null);
                    exist.chart.clickwait = null;
                }
                window.setTimeout(function(){window.scrollTo(0, $('#' + values.target.id).offset().top-($(window).height()/2)+($('#' + values.target.id).height()/2));}, 200);
            }
        },
        dataset: function(label, isbool, count, len) {
            var print = exist.config('page.print'), alpha = isbool ? (print ? 0.9 : 0.6) : (len > 1 ? 0.225+(1.0/len*0.75) : 0.6),
                col = exist.colour(count.length, alpha), brcol = exist.colour(count.length, 1.0, (print ? (isbool ? 0.25 : 0.5) : 1.65));
            var data = {
                label: label,
                data: [],
                spanGaps: true,
                fontColor: col,
                fontSize: exist.chart.size(11),
                fontStyle: 'bold',
                backgroundColor: col,
                borderColor: brcol,
                pointBorderColor: brcol,
                borderWidth: 1.5,
            };
            return data;
        },
        scale: function(min, max, display, label, isbool) {
            var print = exist.config('page.print'), bgcol = print ? exist.makergba(255, 255, 255) : exist.makergba(0, 0, 0), fgcol = print ? exist.makergba(0, 0, 0) : exist.makergba(255, 255, 255), brcol = print ? exist.makergba(64, 64, 64) : exist.makergba(192, 192, 192);
            var data = {
                display: display || false,
                position: 'left',
                offset: true,
                fontColor: fgcol,
                fontSize: exist.chart.size(11),
                fontStyle: 'bold',
                gridLines: {
                    display: display || false,
                    color: exist.makergba(32, 32, 32),
                    lineWidth: 1,
                    drawBorder: display || false,
                    drawOnChartArea: display || false,
                    drawTicks: display || false,
                    tickMarkLength: 4,
                    zeroLineWidth: 0,
                    zeroLineColor: exist.makergba(32, 32, 32),
                    zeroLineBorderDash: [],
                    zeroLineBorderDashOffset: 0,
                    offsetGridLines: min == null && isbool ? true : false,
                    borderDash: [],
                    borderDashOffset: 0
                },
                scaleLabel: {
                    display: min != null ? true : false,
                    fontColor: brcol,
                    fontSize: exist.chart.size(10),
                    fontStyle: 'bold',
                    labelString: isbool ? 'Bool' : label,
                    lineHeight: 1,
                    padding: {
                        top: 1,
                        bottom: 1
                    }
                },
                ticks: {
                    minRotation: 0,
                    maxRotation: 90,
                    suggestedMin: min,
                    suggestedMax: max,
                    mirror: false,
                    padding: 1,
                    reverse: false,
                    display: display || false,
                    autoSkip: true,
                    autoSkipPadding: 0,
                    labelOffset: 0,
                    fontColor: brcol,
                    fontSize: exist.chart.size(10),
                    fontStyle: 'bold',
                    fontFamily: 'monospace'
                },
            };
            return data;
        },
        config: function(id, type, title, name, isbool, len, descs) {
            var print = exist.config('page.print'), bgcol = print ? exist.makergba(255, 255, 255) : exist.makergba(0, 0, 0), fgcol = print ? exist.makergba(0, 0, 0) : exist.makergba(255, 255, 255), brcol = print ? exist.makergba(64, 64, 64) : exist.makergba(192, 192, 192);
            var data = {
                id: 'exist-chart-' + id,
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
                            radius: 1,
                            pointStyle: 'circle',
                            backgroundColor: brcol,
                            borderColor: bgcol,
                            borderWidth: 1,
                            hitRadius: 4,
                            hoverRadius: 2,
                            hoverBorderWidth: 8
                        },
                        rectangle: {
                            backgroundColor: bgcol,
                            borderColor: brcol,
                            borderSkipped: 'bottom',
                            borderWidth: 0
                        },
                    },
                    animation: {
                        duration: 0,
                        easing: 'easeOutQuart'
                    },
                    hover: { animationDuration: 0 },
                    tooltips: {
                        enabled: true,
                        mode: 'nearest',
                        position: 'nearest',
                        intersect: true,
                        backgroundColor: bgcol,
                        fontSize: exist.chart.size(10),
                        titleFontStyle: 'bold',
                        titleSpacing: 0,
                        titleMarginBottom: 0,
                        titleFontSize: exist.chart.size(10),
                        titleFontColor: fgcol,
                        titleAlign: 'left',
                        bodySpacing: 0,
                        bodyFontColor: fgcol,
                        bodyFontStyle: 'bold',
                        bodyFontSize: isbool ? 0 : exist.chart.size(10),
                        bodyAlign: 'left',
                        footerFontStyle: 'bold',
                        footerSpacing: 0,
                        footerMarginTop: 0,
                        footerFontColor: fgcol,
                        footerFontSize: isbool ? 0 : exist.chart.size(10),
                        footerAlign: 'left',
                        yPadding: 3,
                        xPadding: 4,
                        caretPadding: 2,
                        caretSize: 4,
                        cornerRadius: 4,
                        multiKeyBackground: bgcol,
                        displayColors: false,
                        borderColor: brcol,
                        borderWidth: 1.25,
                        callbacks: {
                            label: function(item, data) {
                                var label = item.yLabel;
                                if(descs != null && descs[item.yLabel] != null) label += ' (' + descs[item.yLabel].label + ')';
                                else {
                                    var val = name.split('(');
                                    if(val.length > 1) {
                                        var unit = val[1].replace(')', '');
                                        if(unit != null) label += ' ' + unit;
                                    }
                                }
                                return (data.datasets[item.datasetIndex].label ? (data.datasets[item.datasetIndex].label + ': ') : '') + label;
                            }
                        }
                    },
                    legend: {
                        display: len > 1 ? true : false,
                        position: 'top',
                        fullWidth: false,
                        labels: {
                            boxWidth: 11,
                            fontColor: fgcol,
                            fontSize: exist.chart.size(11),
                            fontStyle: 'bold',
                            reverse: false,
                            weight: 1000,
                            padding: 8
                        }
                    },
                    title: {
                        display: len <= 1 ? true : false,
                        fontColor: fgcol,
                        fontSize: exist.chart.size(11),
                        fontStyle: 'bold',
                        fullWidth: true,
                        lineHeight: 0.5,
                        padding: 8,
                        position: 'top',
                        weight: 2000,
                        text: title,
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
        create: function(name, type, title, desc, min, max, values, labels, descs, isbool, count) {
            var len = 0;
            for(var i in values) if(!isfunc(values[i])) len++;
            var data = exist.chart.config(name, type, title, desc, isbool, len, descs);
            data.options.scales.xAxes[0] = exist.chart.scale(null, null, true, null, isbool);
            data.options.scales.xAxes[0]['type'] = 'time';
            data.options.scales.xAxes[0]['time'] = {
                unit: 'day',
                minUnit: 'day',
                tooltipFormat: 'ddd MMM Do YYYY',
                displayFormats: {
                    day: 'DD'
                }
            };
            for(var i in values) {
                if(isfunc(values[i])) continue;
                data.options.scales.yAxes[i] = exist.chart.scale(min, max, i == 0 ? true : false, desc, isbool);
                data.options.scales.yAxes[i].ticks.callback = function(value, index, list) {
                    if(isbool) return '       ';
                    if(descs != null && descs[value] != null) return descs[value].label.substring(0, 7).spacepad(7);
                    return value.spacepad(7);
                };
                data.values[i] = values[i];
            }
            for(var i in labels) {
                if(isfunc(labels[i])) continue;
                data.data.datasets[i] = exist.chart.dataset(labels[i], isbool, count, len);
                count[count.length] = name;
            }
            return data;
        },
        maketest: function(b, isbool, g, r, date, len) {
            if(b == null || b.values == null) return false;
            if(b.value_type == 2 || (r > 0 && b.priority != r) || (!isbool && !b.minval && !b.maxval)) return false;
            if(g != null && g[0] == '!disabled') return false;
            for(var x = 0; x < len; x++) {
                var test = makedate(0-x, date);
                if(b.values[test] != null && b.values[test].value != 0) return true;
            }
            return false;
        },
        values: function(data, date, len) {
            var values = {};
            for(var x = 0; x < len; x++) {
                var fr = makedate(0-x, date), to = fr;
                if(data.offset) to = makedate(-1, fr);
                values[to] = data.values[fr];
            }
            return values;
        },
        make: function(head, len, date, size, data, q, count) {
            var list = data.split('-'), a = exist.data[list[0]];
            if(a && (q <= 0 || a.priority == q)) {
                for(var r = 1; r <= 10; r++) {
                    for(var j in a) {
                        if(isfunc(a[j])) continue;
                        var b = a[j], isbool = b.value_type_description == 'Boolean' ? true : false, g = exist.settings.groups[list[0]] ? exist.settings.groups[list[0]][j] : null;
                        if(!exist.chart.maketest(b, isbool, g, r, date, len)) continue;
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
                        var n = list[0] + '-' + j, o = b.value_type_description, t = b.label, minval = b.minval || 0, maxval = b.maxval || 0,
                            values = [exist.chart.values(b, date, len)], labels = [b.label], descs = [b.desc], extra = [];
                        if(g != null && g.length > 0) {
                            var k = j.split('_');
                            n = list[0] + '-' + (k.length >= 2 ? k[1] : k[0]);
                            for(var x = 0; x < g.length; x++) extra[extra.length] = g[x];
                        }
                        if(extra.length > 0) {
                            for(var x = 0; x < extra.length; x++) {
                                var c = a[extra[x]], cbool = c.value_type_description == 'Boolean' ? true : false;
                                if(!exist.chart.maketest(c, cbool, null, 0, date, len)) continue;
                                values[values.length] = exist.chart.values(c, date, len);
                                labels[labels.length] = c.label;
                                descs[descs.length] = c.desc;
                                if(c.minval != null && c.minval < minval) minval = c.minval;
                                if(c.maxval != null && c.maxval > maxval) maxval = c.maxval;
                            }
                        }
                        var sz = size;
                        if(isbool) {
                            var sq = 1920.0/exist.chart.width, range = exist.config('page.range');
                            if(sq > 1.0) sq = 1.0+(sq-1.0);
                            sz = 11.0*sq;
                            if(range > 31) sz += sz*((range-31)/31.0)*0.15;
                            t = a.label + ': ' + b.label;
                        }
                        else {
                            maxval = null;
                            minval = null;
                            for(var x = 0; x < descs.length; x++) {
                                for(var y in descs[x]) {
                                    if(isfunc(descs[x][y])) continue;
                                    var z = parseInt(y);
                                    if(y != z) continue;
                                    if(maxval == null || z > maxval) maxval = z;
                                    if(minval == null || z < minval) minval = z;
                                }
                            }
                            for(var x = 0; x < values.length; x++) {
                                if(values[x] == null) continue;
                                for(var y in values[x]) {
                                    if(values[x][y] == null || isfunc(values[x][y])) continue;
                                    if(values[x][y].value != null && (maxval == null || values[x][y].value > maxval)) maxval = values[x][y].value;
                                    if(values[x][y].value != null && (minval == null || values[x][y].value < minval)) minval = values[x][y].value;
                                }
                            }
                            if((maxval-minval) >= 10) sz = sz*7/4;
                        }
                        head.innerHTML += '<div class="exist-chart-container"><canvas id="exist-chart-' + n + '" class="exist-chart" width="400px" height="' + sz + 'px"></canvas></div>';
                        exist.chart.data[exist.chart.data.length] = exist.chart.create(
                            n, isbool ? 'bar' : 'line', t, o, isbool ? 0 : minval, isbool ? 1 : maxval, values, labels, b.desc, isbool, count
                        );
                    }
                }
            }
        },
        draw: function(head, indate, inlen) {
            var date = indate ? indate : makedate(), len = inlen || 31, count = [],
                c = exist.config('page.values'), sq = 1920.0/exist.chart.width,
                size = 31.0*(sq > 1.0 ? 1.0+(sq-1.0) : 1.0);
            exist.chart.data = [];
            if(c) {
                var d = c.split(',');
                if(d.length == 1) size *= 2;
                for(var q = 0; q < d.length; q++) exist.chart.make(head, len, date, size, d[q], 0, count);
            }
            else {
                for(var q = 1; q <= 10; q++) {
                    for(var i in exist.data) if(!isfunc(exist.data[i])) exist.chart.make(head, len, date, size, i, q, count);
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
            exist.chart.defaults();
            exist.chart.resetwait = false;
            exist.chart.width = exist.config('page.print') ? 1800 : (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
            exist.chart.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            var head = document.getElementById('exist-body');
            if(head) {
                head.innerHTML = '';
                var hrow = head.makechild('tr', 'exist-chart-row'),
                    head = hrow.makechild('td', 'exist-chart-info'),
                    range = exist.config('page.range'), nav = 'Range';
                nav += exist.rangeanc(range, 7);
                nav += exist.rangeanc(range, 14);
                nav += exist.rangeanc(range, 28);
                nav += exist.rangeanc(range, 31);
                nav += exist.rangeanc(range, 60);
                nav += exist.rangeanc(range, 90);
                nav += exist.rangeanc(range, 120);
                head.innerHTML += '<div id="exist-range" class="hide-print">' + nav + '</div>';
                head.innerHTML += '<h4 id="exist-chart-pre" class="exist-left">Last ' + range + ' days for ' + exist.info.first_name + '</h4>';
                exist.chart.draw(head, exist.config('page.date'), range);
            }
        },
        reset: function() {
            if(!exist.chart.resetwait) {
                var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                if(width != exist.chart.width) {
                    exist.chart.resetwait = true;
                    for (var i in Chart.instances) if(!isfunc(Chart.instances[i])) Chart.instances[i].destroy();
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
    exist.chart.clickwait = null;
    exist.checkurl(null, true);
});

$(window).resize(function() {
    if(exist.config('page.id') == 'chart') exist.chart.reset();
});
