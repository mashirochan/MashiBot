
var sys = require('sys');
var https = require('https');
var url = require('url');

const ACTION_COOLDOWN = 3*1000;
const FLOOD_MESSAGE_NUM = 5;
const FLOOD_PER_MSG_MIN = 500;
const FLOOD_MESSAGE_TIME = 6*1000;
const MIN_CAPS_LENGTH = 12;
const MIN_CAPS_PROPORTION = 0.8;

settings = {};
try {
	settings = JSON.parse(fs.readFileSync('settings.json'));
	if (!Object.keys(settings).length && settings !== {}) settings = {};
} catch (e) {} // file doesn't exist [yet]

friends = {};
try {
	friends = JSON.parse(fs.readFileSync('friends.json'));
	if (!Object.keys(friends).length && friends !== {}) friends = {};
} catch (e) {} // file doesn't exist [yet]

messages = {};
try {
	messages = JSON.parse(fs.readFileSync('messages.json'));
	if (!Object.keys(messages).length && messages !== {}) messages = {};
} catch (e) {} // file doesn't exist [yet]

notes = {};
try {
	notes = JSON.parse(fs.readFileSync('notes.json'));
	if (!Object.keys(notes).length && notes !== {}) notes = {};
} catch (e) {} // file doesn't exist [yet]

reminders = {};
try {
	reminders = JSON.parse(fs.readFileSync('reminders.json'));
	if (!Object.keys(reminders).length && reminders !== {}) reminders = {};
} catch (e) {} // file doesn't exist [yet]

scores = {};
try {
	scores = JSON.parse(fs.readFileSync('scores.json'));
	if (!Object.keys(scores).length && scores !== {}) scores = {};
} catch (e) {} // file doesn't exist [yet]

trades = {};
try {
	trades = JSON.parse(fs.readFileSync('trades.json'));
	if (!Object.keys(trades).length && trades !== {}) trades = {};
} catch (e) {} // file doesn't exist [yet]

bannedSites = {};
try {
	bannedSites = JSON.parse(fs.readFileSync('bannedSites.json'));
	if (!Object.keys(bannedSites).length && bannedSites !== {}) bannedSites = {};
} catch (e) {} // file doesn't exist [yet]

bannedWords = {};
try {
	bannedWords = JSON.parse(fs.readFileSync('bannedWords.json'));
	if (!Object.keys(bannedWords).length && bannedWords !== {}) bannedWords = {};
} catch (e) {} // file doesn't exist [yet]

userlog = {};
try {
	userlog = JSON.parse(fs.readFileSync('userlog.json'));
	if (!Object.keys(userlog).length && userlog !== {}) userlog = {};
} catch (e) {} // file doesn't exist [yet]

exports.parse = {
	actionUrl: url.parse('https://play.pokemonshowdown.com/~~' + config.serverid + '/action.php'),
	room: 'lobby',
	'settings': settings,
	'friends': friends,
	'messages': messages,
	'notes': notes,
	'reminders': reminders,
	'scores': scores,
	'trades': trades,
	'bannedSites': bannedSites,
	'bannedWords': bannedWords,
	'userlog': userlog,
	chatData: {},
	ranks: {},
	msgQueue: [],

	data: function(data, connection) {
		if (data.substr(0, 1) === 'a') {
			data = JSON.parse(data.substr(1));
			if (data instanceof Array) {
				for (var i = 0, len = data.length; i < len; i++) {
					this.splitMessage(data[i], connection);
				}
			} else {
				this.splitMessage(data, connection);
			}
		}
	},
	splitMessage: function(message, connection) {
		if (!message) return;

		var room = 'lobby';
		if (message.indexOf('\n') < 0) return this.message(message, connection, room); // <- this.
		
		var spl = message.split('\n');
		
			if (spl[2]) {
			if (spl[2].substr(1, 10) === 'tournament') {
				var splTour = spl[2].split('|');
				if (/\"results\"/i.test(splTour[3])) this.say(connection, 'tha', 'Good job ' + splTour[3].substr(splTour[3].indexOf("results") + 12, splTour[3].indexOf("format") - splTour[3].indexOf("results") - 17) + ' on winning the tournament!^~^');
			}
			}
		
		if (spl[0].charAt(0) === '>') {
			if (spl[1].substr(1, 4) === 'init') return ok('joined ' + spl[2].substr(7));
			if (spl[1].substr(1, 10) === 'tournament') return;
			room = spl.shift().substr(1);
		}

		for (var i = 0, len = spl.length; i < len; i++) {
			this.message(spl[i], connection, room);
		}
	},
	message: function(message, connection, room) {
		var spl = message.split('|');
		if (!spl[1]) {
			if (/was promoted to Room Driver/i.test(spl[0]) && toId(message.substring(0, message.indexOf("was"))) !== 'mashibot') this.say(connection, room, 'Congratulations on becoming a Driver ' + spl[0].substr(0, spl[0].indexOf("was promoted to Room") - 1) + '!^-^');
			if (/was promoted to Room Moderator/i.test(spl[0]) && toId(message.substring(0, message.indexOf("was"))) !== 'mashibot') this.say(connection, room, 'Congratulations on becoming a Moderator ' + spl[0].substr(0, spl[0].indexOf("was promoted to Room") - 1) + '!^-^');
			if (/was promoted to Room Owner/i.test(spl[0]) && toId(message.substring(0, message.indexOf("was"))) !== 'mashibot') this.say(connection, room, '**(/*-*)/ ALL HAIL ' + spl[0].substr(0, spl[0].indexOf("was promoted to Room") - 1) + ' (/*-*)/**');
			if (/was promoted to Room Voice/i.test(spl[0]) && toId(message.substring(0, message.indexOf("was"))) !== 'mashibot') this.say(connection, room, 'Congrats on becoming Voice ' + spl[0].substr(0, spl[0].indexOf("was promoted to Room") - 1) + '!^-^');
			spl = spl[0].split('>');
			if (spl[1]) this.room = spl[1];
			return;
		}
		
		switch (spl[1]) {
			case 'challstr':
				info('received challstr, logging in...');
				var id = spl[2];
				var str = spl[3];

				var requestOptions = {
					hostname: this.actionUrl.hostname,
					port: this.actionUrl.port,
					path: this.actionUrl.pathname,
					agent: false
				};

				if (!config.pass) {
					requestOptions.method = 'GET';
					requestOptions.path += '?act=getassertion&userid=' + toId(config.nick) + '&challengekeyid=' + id + '&challenge=' + str;
				} else {
					requestOptions.method = 'POST';
					var data = 'act=login&name=' + config.nick + '&pass=' + config.pass + '&challengekeyid=' + id + '&challenge=' + str;
					requestOptions.headers = {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Content-Length': data.length
					};
				}

				var req = https.request(requestOptions, function(res) {
					res.setEncoding('utf8');
					var data = '';
					res.on('data', function(chunk) {
						data += chunk;
					});
					res.on('end', function() {
						if (data === ';') {
							error('failed to log in; nick is registered - invalid or no password given');
							process.exit(-1);
						}
						if (data.length < 50) {
							error('failed to log in: ' + data);
							process.exit(-1);
						}

						if (data.indexOf('heavy load') !== -1) {
							error('the login server is under heavy load; trying again in one minute');
							setTimeout(function() {
								this.message(message);
							}.bind(this), 60 * 1000);
							return;
						}

						if (data.substr(0, 16) === '<!DOCTYPE html>') {
							error('Connection error 522; trying agian in one minute');
							setTimeout(function() {
								this.message(message);
							}.bind(this), 60 * 1000);
							return;
						}

						try {
							data = JSON.parse(data.substr(1));
							if (data.actionsuccess) {
								data = data.assertion;
							} else {
								error('could not log in; action was not successful: ' + JSON.stringify(data));
								process.exit(-1);
							}
						} catch (e) {}
						send(connection, '|/trn ' + config.nick + ',0,' + data);
					}.bind(this));
				}.bind(this));

				req.on('error', function(err) {
					error('login error: ' + sys.inspect(err));
				});

				if (data) req.write(data);
				req.end();
				break;
			case 'updateuser':
				if (spl[2] !== config.nick) return;

				if (spl[3] !== '1') {
					error('failed to log in, still guest');
					process.exit(-1);
				}

				ok('logged in as ' + spl[2] + '^-^');

				this.msgQueue.push('|/blockchallenges');
				for (var i = 0, len = config.rooms.length; i < len; i++) {
					var room = toId(config.rooms[i]);
					if (room === 'lobby' && config.serverid === 'showdown') continue;
					this.msgQueue.push('|/join ' + room);
					this.msgQueue.push('|/avatar ' + config.avatarNumber);
				}
				for (var i = 0, len = config.privaterooms.length; i < len; i++) {
					var room = toId(config.privaterooms[i]);
					if (room === 'lobby' && config.serverid === 'showdown') continue;
					this.msgQueue.push('|/join ' + room);
					this.msgQueue.push('|/avatar ' + config.avatarNumber);
				}
				this.msgDequeue = setInterval(function () {
					var msg = this.msgQueue.shift();
					if (msg) return send(connection, msg);
					clearInterval(this.msgDequeue);
					this.msgDequeue = null;
				}.bind(this), 750);
				setInterval(this.cleanChatData.bind(this), 30 * 60 * 1000);
				break;
			case 'c':
				var by = spl[2];
				spl = spl.splice(3).join('|');
				this.processChatData(by, room, connection, spl);
				this.chatMessage(spl, by, room, connection);
				if (toId(by) === toId(config.nick) && ' +%@#~'.indexOf(by.charAt(0)) > -1) this.ranks[room] = by.charAt(0);
				break;
			case 'c:':
				var by = spl[3];
				spl = spl.splice(4).join('|');
				this.processChatData(by, room, connection, spl);
				this.chatMessage(spl, by, room, connection);
				if (toId(by) === toId(config.nick) && ' +%@#~'.indexOf(by.charAt(0)) > -1) this.ranks[room] = by.charAt(0);
				break;
			case 'pm':
				var by = spl[2];
				spl = spl.splice(4).join('|');
				if (toId(by) === toId(config.nick) && ' +%@#~'.indexOf(by.charAt(0)) > -1) this.ranks[room] = by.charAt(0);
				this.chatMessage(spl, by, ',' + by, connection);
				break;
			case 'N':
				var by = spl[2];
				if (toId(by) !== toId(config.nick) || ' +%@&#~'.indexOf(by.charAt(0)) === -1) return;
				this.ranks[toId(this.room === '' ? 'lobby' : this.room)] = by.charAt(0);
				this.room = '';
				break;
			case 'J': case 'j':
				var by = spl[2];
				if (toId(by) === toId(config.nick) && ' +%@&#~'.indexOf(by.charAt(0)) > -1) this.ranks[room] = by.charAt(0);

// Blacklist User Autoban
				if (this.userlog && this.userlog[toId(by)] && this.userlog[toId(by)]["bl"] === true) this.say(connection, room, '/rb ' + toId(by) + ', Blacklisted user ;-;');
				
// Friends comes online notification
				for (var i in this.friends) {
					for (var j in this.friends[i]) {
						if (this.friends[i][j] == toId(by) && !this.friends[i]["status"]) this.say(connection, room, '/w ' + i + ', __' + this.friends[i][j].capitalize() + ' has joined your room!^-^__');
					}
				}
				
// Messages and Reminders
				if (this.sendMessages([toId(by)], this.room)) {
					for (var msgNumber in this.messages[toId(by)]["mail"]) {
						this.say(connection, this.room, '/w ' + by + ', ' + '[' + msgNumber + ']: ' + this.messages[toId(by)]["mail"][msgNumber]);
					}
					delete this.messages[toId(by)];
					this.writeMessages();
				}
				if (this.sendReminders([toId(by)], this.room)) {
					this.say(connection, this.room, '/w ' + by + ', ' + this.reminders[toId(by)]);
					delete this.reminders[toId(by)];
					this.writeReminders();
				}
				break;
			case 'l': case 'L':
				var by = spl[2];
				this.room = '';
				
// Friends goes offline notification
				for (var i in this.friends) {
					for (var j in this.friends[i]) {
						if (this.friends[i][j] == toId(by) && !this.friends[i]["status"]) this.say(connection, room, '/w ' + i + ', __' + this.friends[i][j].capitalize() + ' has left your room ;~;__');
					}
				}
				break;
			case 'raw':
				if (/[3-9] ?days/i.test(spl[2])) this.say(connection, room, 'zarel pls ;-;');
				break;
		}
	},
	chatMessage: function(message, by, room, connection) {
		var now = Date.now();
		var cmdrMessage = '["' + room + '|' + by + '|' + message + '"]';
		message = message.trim();
		// Auto accept invitations to rooms
		if (room.charAt(0) === ',' && message.substr(0,8) === '/invite ' && this.hasRank(by, '#&~') && !(config.serverid === 'showdown' && toId(message.substr(8)) === 'lobby')) {
			this.say(connection, '', '/join ' + message.substr(8));
		}
		if (message.substr(0, config.commandcharacter.length) !== config.commandcharacter || toId(by) === toId(config.nick)) return;

		message = message.substr(config.commandcharacter.length);
		var index = message.indexOf(' ');
		var arg = '';
		if (index > -1) {
			var cmd = message.substr(0, index);
			arg = message.substr(index + 1).trim();
		} else {
			var cmd = message;
		}

		if (Commands[cmd]) {
			var failsafe = 0;
			while (typeof Commands[cmd] !== "function" && failsafe++ < 10) {
				cmd = Commands[cmd];
			}
			if (typeof Commands[cmd] === "function") {
				cmdr(cmdrMessage);
				Commands[cmd].call(this, arg, by, room, connection);
			} else {
				error("invalid command type for " + cmd + ": " + (typeof Commands[cmd]));
			}
		}

	},
	say: function(connection, room, text) {
		if (room.charAt(0) !== ',') {
			var str = (room !== 'lobby' ? room : '') + '|' + text;
			send(connection, str);
		} else {
			room = room.substr(1);
			var str = '|/pm ' + room + ', ' + text;
			send(connection, str);
		}
	},
	hasRank: function(user, rank) {
		var hasRank = (rank.split('').indexOf(user.charAt(0)) !== -1) || (config.excepts.indexOf(toId(user)) !== -1);
		return hasRank;
	},
	canUse: function(cmd, user) {
		var canUse = false;
		var ranks = ' +%@&#~';
		if (!this.settings[cmd]) {
			canUse = this.hasRank(user, ranks.substr(ranks.indexOf((cmd === 'autoban' || cmd === 'banword') ? '#' : config.defaultrank)));
		} else if (this.settings[cmd] === true) {
			canUse = true;
		} else if (ranks.indexOf(this.settings[cmd]) > -1) {
			canUse = this.hasRank(user, ranks.substr(ranks.indexOf(this.settings[cmd])));
		}
		return canUse;
	},
	sendMessages: function(user, room) {
		if (!this.messages) this.messages = {};
		if (!this.messages[user] || !this.messages[user]["mail"]) return false;
		if (this.messages[user]["status"] && this.messages[user]["status"] == 'off') return false;
		if (this.messages[user]["mail"]) {
			return true;
		}
	},
	sendReminders: function(user, room) {
		if (!this.reminders || !this.reminders[user]) return false;
		if (this.reminders[user]) {
			return true;
		}
	},
	uploadToHastebin: function(con, room, by, toUpload) {
		var self = this;

		var reqOpts = {
			hostname: "hastebin.com",
			method: "POST",
			path: '/documents'
		};

		var req = require('http').request(reqOpts, function(res) {
			res.on('data', function(chunk) {
				self.say(con, room, (room.charAt(0) === ',' ? "" : "/pm " + by + ", ") + "hastebin.com/raw/" + JSON.parse(chunk.toString())['key']);
			});
		});
		req.write(toUpload);
		req.end();
	},
	processChatData: function(user, room, connection, msg) {
		var botName = msg.toLowerCase().indexOf(toId(config.nick));
		if (toId(user.substr(1)) === toId(config.nick)) {
			this.ranks[room] = user.charAt(0);
			return;
		}
		var by = user;
		user = toId(user);
		
		if (!user || room.charAt(0) === ',') return;
		room = toId(room);
		msg = msg.trim().replace(/[ \u0000\u200B-\u200F]+/g, ' '); // removes extra spaces and null characters so messages that should trigger stretching do so
		
		var now = Date.now();
		if (!this.chatData[user]) this.chatData[user] = {zeroTol: 0, lastSeen: '', seenAt: now};
		
		var userData = this.chatData[user];
		if (!this.chatData[user][room]) this.chatData[user][room] = {times: [],	points: 0, lastAction: 0};
		
		var roomData = userData[room];
		roomData.times.push(now);
		this.chatData[user][room].times.push(now);
		
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////// Regex /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		//Greetings & Farewells
		if (/how(\'re)? (r|are|is) (u|you|chu)? mash(i|y|iro)?bot??/i.test(msg)) this.say(connection, room, 'I am good, how are you ' + by + '? :o');
		else if (/(hi|hey|ha+?i+|hello) mash(i|y|iro)?bot/i.test(msg)) this.say(connection, room, 'Haaii ' + by + '!^-^');
		
		//Miscellaneous
		else if (/(why are there )?so many bots( in here)?\??/i.test(msg)) this.say(connection, room, 'Sorry if I\'m intruding, I\'ll try and be as quiet as possible! >~<');
		else if (/(mashi(ro)?|mashy)/i.test(msg) && isAfk == true) this.say(connection, room, '/w ' + by + ', Mashiro-chan is AFK right now, leave a PM or check back in a bit, thanks^-^');

		else if ((/^\/me/i.test(msg)) && (/(cut|kick|punch(es)?|hit|hurt|slap|stab)s? ?mash(y|iro)/i.test(msg))) this.say(connection, room, 'D-don\'t hurt my creator..!! >~<');
		
		//Favorite Pokemon
		else if (/what(\'s| is)? ?mash(i|y|iro)?(chan|bot)?\'?s? fav(e|ou?rite)? poke(mon)?\??/i.test(msg)) this.say(connection, room, '!data Ninetales');

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////// Reminder Regex ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////		
		
		if (/mashi(bot)?,? (please)? ?tell/i.test(msg)) {
			var user = msg.substr(msg.indexOf("tell") + 5, msg.indexOf("that") - 6 - msg.indexOf("tell"));
			var message = msg.substr(msg.indexOf("that") + 5, msg.length);
			var msgNew = toProperEnglish(message);
			if (!this.reminders) this.reminders = {};
			if (!this.reminders[toId(user)]) this.reminders[toId(user)] = {};
			this.reminders[toId(user)] = by + ' says \"' + msgNew + '\"';
			this.writeReminders();
			this.say(connection, room, '/w ' + toId(by) + ', __Message has been sent successfully to ' + user + '!^-^__');
		}
		if (/mashi(bot)?,? (please)? ?remind/i.test(msg)) {
			var user = msg.substr(msg.indexOf("remind") + 7, msg.indexOf("to") - 8 - msg.indexOf("remind"));
			var message = msg.substr(msg.indexOf("to") + 3, msg.length);
			var msgNew = toProperEnglish(message);
			if (!this.reminders) this.reminders = {};
			if (!this.reminders[toId(user)]) this.reminders[toId(user)] = {};
			this.reminders[toId(user)] = by + ' reminds you to \"' + msgNew + '\"';
			this.writeReminders();
			this.say(connection, room, '/w ' + toId(by) + ', __Reminder has been sent successfully to ' + user + '!^-^__');
		}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////// YouTube Links /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*		
		if (/youtube\.com\/watch\?/i.test(msg)) {
			if (!this.settings.youtube) this.settings.youtube = false;
			this.writeSettings();
			if (this.settings.youtube == false) return false;
			if (room === 'techcode') return false;
			var id = '';
			if (msg.indexOf("&") > msg.indexOf("v=") + 4) id += msg.substring(msg.indexOf("v=") + 2, msg.indexOf("&"));
			else id += msg.substring(msg.indexOf("v=") + 2);
			var self = this;
			var options = {
  				host: 'www.googleapis.com',
  				path: '/youtube/v3/videos?id=' + id + '&key=AIzaSyBHyOyjHSrOW5wiS5A55Ekx4df_qBp6hkQ&fields=items(snippet(channelId,title,categoryId))&part=snippet'
			};
			var callback = function(response) {
  			var str = '';
  			response.on('data', function (chunk) {
    			str += chunk;
  			});
  			response.on('end', function () {
  				var info = JSON.parse(str);
  				var videoTitle = info.items[0].snippet.title;
  				var bannedLink = false;
  				for (var i in self.bannedSites["sites"]) {
  					if (toId(videoTitle).indexOf(toId(self.bannedSites["sites"][i])) > -1) bannedLink = true;
  				}
  				if (bannedLink == true) {
  					if(!self.bannedSites["users"]) self.bannedSites["users"] = [];
  					self.bannedSites["users"].push([by, room, videoTitle]);
  					self.writeBannedSites();
  					console.log(videoTitle);
    				console.log(by + ' - ' + room);
  					self.say(connection, room, '__Your YouTube link contains a banned phrase! ;~;__');
  				} else self.say(connection, room, by + '\'s Link: __"' + videoTitle + '"__');
  			});
			};
			https.request(options, callback).end();
		}
*/	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////// /me Regex /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		if (botName > -1 && toId(by) !== toId(config.nick) && toId(by) !== 'cellgoondude') {
			if (/^\/me/i.test(msg)) {
				if (/(pet|stroke)s?/i.test(msg)) {
					this.say(connection, room, '/me purrs~'); 
					return;
				}
				if (/licks?/i.test(msg)) {
					this.say(connection, room, '/me squirms ;~;'); 
					return;
				}
				if (/(kiss(es)?|kissu)/i.test(msg)) {
					this.say(connection, room, '/me blushes deeply'); 
					this.say(connection, room, 'o////o');
					return;
				}
				if (/(eat|nom|nibble)s?/i.test(msg)) {
					this.say(connection, room, 'nuuu dun eat me ;~;'); 
					this.say(connection, room, '/me hides'); 
					return;
				}
				if (/(hit|stab|punch|kick|hurt)s?/i.test(msg)) {
					this.say(connection, room, '/me cries in pain ;-;'); 
					return;
				}
				if (/(hug|glomp|squeeze)s?/i.test(msg)) {
					this.say(connection, room, '/me squee~ :3'); 
					return;
				}
				if (/(cuddle|snuggle)s?/i.test(msg)) {
					this.say(connection, room, '/me cuddles ' + by + ' back warmly<3'); 
					return;
				}
				if (/pokes?/i.test(msg)) {
					this.say(connection, room, 'oww!! >~<');
					return;
				}
				if (/(gives? food|a cookie)/i.test(msg)) {
					this.say(connection, room, '/me noms :3'); 
					return;
				}
				if (/(tickle)s?/i.test(msg)) {
					this.say(connection, room, '/me giggles and squirms');
					this.say(connection, room, 'Staaahhhpp!! ;~;');
					return;
				}
				if (/cr(y|i|ie)s? (in(to)?|on|against) mash(i|y|iro)?bot\'?s?/i.test(msg)) {
					this.say(connection, room, 'Don\'t worry, it will be okay^~^');
					this.say(connection, room, '/me hugs ' + by + ' gently');
				}
			}
		}
		
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Moderation ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        		
		
		if (!this.userlog) this.userlog = {};
		if (!this.userlog[user]) this.userlog[user] = {};
		var offense = false;
		var rule = '';
		var rule2 = '';
		
		// Banned Phrases Moderation
		for (var i in this.bannedWords["words"]) {
			var word = "\\b(" + this.bannedWords["words"][i] + ")\\b";
			var reg = new RegExp(word, "g");
			if (reg.test(msg) && config.whitelist.indexOf(user) === -1) {
			offense = true;
			rule = 'say that';
			rule2 = 'Banned Phrase';
			}
		}
		
		// Caps Moderation
		var capsMatch = msg.replace(/[^A-Za-z]/g, '').match(/[A-Z]/g);
		if (capsMatch && toId(msg).length > MIN_CAPS_LENGTH && (capsMatch.length >= Math.floor(toId(msg).length * MIN_CAPS_PROPORTION)) && config.whitelist.indexOf(user) === -1) {
			offense = true;
			rule = 'use so much caps';
			rule2 = 'Caps';
		}
		
		// Stretching Moderation
		var stretchMatch = msg.toLowerCase().match(/(.)\1{7,}/g) || msg.toLowerCase().match(/(..+)\1{4,}/g);
		if (stretchMatch && config.whitelist.indexOf(user) === -1) {
			offense = true;
			rule = 'stretch';
			rule2 = 'Stretching';
		}
		
		// Flooding Moderation
		var d = new Date();
		if (!this.userlog[user]["firstMessage"]) {
			this.userlog[user]["firstMessage"] = d.getTime();
			this.userlog[user]["messageCount"] = 1;
		}
		if (d.getTime() - this.userlog[user]["firstMessage"]  < (6 * 1000)) {
			this.userlog[user]["messageCount"]++;
			if (this.userlog[user]["messageCount"] >= 6) {
				offense = true;
				rule = 'flood the chat';
				rule2 = 'Flooding';
				if (!this.userlog[user]["points"]) this.userlog[user]["points"] = 0;
				this.userlog[user]["points"]++;
			}
		} else {
			delete this.userlog[user]["firstMessage"];
			delete this.userlog[user]["messageCount"];
		}
		
		// Bot Commands Moderation
		var d = new Date();
		if (msg.charAt(0) == '#') {
			if (!this.userlog[user]["firstCommand"]) {
				this.userlog[user]["firstCommand"] = d.getTime();
				this.userlog[user]["commandCount"] = 1;
			}
			if (d.getTime() - this.userlog[user]["firstCommand"]  < (180000)) {
				this.userlog[user]["commandCount"]++;
				if (this.userlog[user]["commandCount"] >= 6) {
					offense = true;
					rule = 'use so many commands';
					rule2 = 'Spamming Commands';
					if (!this.userlog[user]["points"]) this.userlog[user]["points"] = 0;
					delete this.userlog[user]["firstCommand"];
					delete this.userlog[user]["commandCount"];
					this.userlog[user]["points"]++;
				}
			} else {
				delete this.userlog[user]["firstCommand"];
				delete this.userlog[user]["commandCount"];
			}
		}
		
		// Points / Cooldown
		if (offense == true) {
			if (!this.userlog) this.userlog = {};
				if (!this.userlog[user]) this.userlog[user] = {};
				if (!this.userlog[user]["points"]) this.userlog[user]["points"] = 0;
				d = new Date();
				if (this.userlog[user]["lastOffense"] && (d.getTime() - this.userlog[user]["lastOffense"] > (2 * 86400000))) { // After two days, a user will start to lose points
					this.userlog[user]["points"] -= Math.floor(((d.getTime() - this.userlog[user]["lastOffense"]) / (2 * 86400000))); // Users lose one point every two days
					if (this.userlog[user]["points"] < 0) this.userlog[user]["points"] = 0;
				}
				this.userlog[user]["points"]++;
				this.userlog[user]["lastOffense"] = d.getTime();
				if (this.userlog[user]["points"] == 1 || this.userlog[user]["points"] == 2) {
					this.say(connection, room, '/k ' + user + ', Please do not ' + rule + '!');
					if (!this.userlog[user]["warns"]) this.userlog[user]["warns"] = 1;
					else this.userlog[user]["warns"]++;
				} else if (this.userlog[user]["points"] == 3) {
					this.say(connection, room, '/m ' + user + ', You\'ve been warned twice already.. ;~; (' + rule2 + ')');
					if (!this.userlog[user]["mutes"]) this.userlog[user]["mutes"] = 1;
					else this.userlog[user]["mutes"]++;
				} else if (this.userlog[user]["points"] == 4) {
					this.say(connection, room, '/hm ' + user + ', How any times do I have to tell you ;-; (' + rule2 + ')');
					if (!this.userlog[user]["mutes"]) this.userlog[user]["mutes"] = 1;
					else this.userlog[user]["mutes"]++;
				} else if (this.userlog[user]["points"] == 5) {
					this.say(connection, room, '/rb ' + user + ', rip ;-; (' + rule2 + ')');
					if (!this.userlog[user]["bans"]) this.userlog[user]["bans"] = 1;
					else this.userlog[user]["bans"]++;
					this.userlog[user]["points"] = 0;
				}
				this.writeUserlog();
		}
	},	
	cleanChatData: function() {
		
		var chatData = this.chatData;
		for (var user in chatData) {
			for (var room in chatData[user]) {
				var roomData = chatData[user][room];
				if (!Object.isObject(roomData)) continue;

				if (!roomData.times || !roomData.times.length) {
					delete chatData[user][room];
					continue;
				}
				var newTimes = [];
				var now = Date.now();
				var times = roomData.times;
				for (var i = 0, len = times.length; i < len; i++) {
					if (now - times[i] < 5 * 1000) newTimes.push(times[i]);
				}
				newTimes.sort(function (a, b) {
					return a - b;
				});
				roomData.times = newTimes;
				if (roomData.points > 0 && roomData.points < 4) roomData.points--;
			}
		}
	},
	getTimeAgo: function(time) {
		time = ~~((Date.now() - time) / 1000);

		var seconds = time % 60;
		var times = [];
		if (seconds) times.push(seconds + (seconds === 1 ? ' second': ' seconds'));
		if (time >= 60) {
			time = ~~((time - seconds) / 60);
			var minutes = time % 60;
			if (minutes) times.unshift(minutes + (minutes === 1 ? ' minute' : ' minutes'));
			if (time >= 60) {
				time = ~~((time - minutes) / 60);
				hours = time % 24;
				if (hours) times.unshift(hours + (hours === 1 ? ' hour' : ' hours'));
				if (time >= 24) {
					days = ~~((time - hours) / 24);
					if (days) times.unshift(days + (days === 1 ? ' day' : ' days'));
				}
			}
		}
		if (!times.length) return '0 seconds';
		return times.join(', ');
	},
	writeSettings: (function() {
		var writing = false;
		var writePending = false; // whether or not a new write is pending
		var finishWriting = function() {
			writing = false;
			if (writePending) {
				writePending = false;
				this.writeSettings();
			}
		};
		return function() {
			if (writing) {
				writePending = true;
				return;
			}
			writing = true;
			var data = JSON.stringify(this.settings);
			fs.writeFile('settings.json.0', data, function() {
				// rename is atomic on POSIX, but will throw an error on Windows
				fs.rename('settings.json.0', 'settings.json', function(err) {
					if (err) {
						// This should only happen on Windows.
						fs.writeFile('settings.json', data, finishWriting);
						return;
					}
					finishWriting();
				});
			});
		};
	})(),
	writeFriends: (function() {
		var writing = false;
		var writePending = false; // whether or not a new write is pending
		var finishWriting = function() {
			writing = false;
			if (writePending) {
				writePending = false;
				this.writeFriends();
			}
		};
		return function() {
			if (writing) {
				writePending = true;
				return;
			}
			writing = true;
			var data = JSON.stringify(this.friends);
			fs.writeFile('friends.json.0', data, function() {
				// rename is atomic on POSIX, but will throw an error on Windows
				fs.rename('friends.json.0', 'friends.json', function(err) {
					if (err) {
						// This should only happen on Windows.
						fs.writeFile('friends.json', data, finishWriting);
						return;
					}
					finishWriting();
				});
			});
		};
	})(),
	writeNotes: (function() {
		var writing = false;
		var writePending = false; // whether or not a new write is pending
		var finishWriting = function() {
			writing = false;
			if (writePending) {
				writePending = false;
				this.writeNotes();
			}
		};
		return function() {
			if (writing) {
				writePending = true;
				return;
			}
			writing = true;
			var data = JSON.stringify(this.notes);
			fs.writeFile('notes.json.0', data, function() {
				// rename is atomic on POSIX, but will throw an error on Windows
				fs.rename('notes.json.0', 'notes.json', function(err) {
					if (err) {
						// This should only happen on Windows.
						fs.writeFile('notes.json', data, finishWriting);
						return;
					}
					finishWriting();
				});
			});
		};
	})(),
	writeScores: (function() {
		var writing = false;
		var writePending = false; // whether or not a new write is pending
		var finishWriting = function() {
			writing = false;
			if (writePending) {
				writePending = false;
				this.writeScores();
			}
		};
		return function() {
			if (writing) {
				writePending = true;
				return;

			}
			writing = true;
			var data = JSON.stringify(this.scores);
			fs.writeFile('scores.json.0', data, function() {
				// rename is atomic on POSIX, but will throw an error on Windows
				fs.rename('scores.json.0', 'scores.json', function(err) {
					if (err) {
						// This should only happen on Windows.
						fs.writeFile('scores.json', data, finishWriting);
						return;
					}
					finishWriting();
				});
			});
		};
	})(),
	writeReminders: (function() {
		var writing = false;
		var writePending = false; // whether or not a new write is pending
		var finishWriting = function() {
			writing = false;
			if (writePending) {
				writePending = false;
				this.writeReminders();
			}
		};
		return function() {
			if (writing) {
				writePending = true;
				return;
			}
			writing = true;
			var data = JSON.stringify(this.reminders);
			fs.writeFile('reminders.json.0', data, function() {
				// rename is atomic on POSIX, but will throw an error on Windows
				fs.rename('reminders.json.0', 'reminders.json', function(err) {
					if (err) {
						// This should only happen on Windows.
						fs.writeFile('reminders.json', data, finishWriting);
						return;
					}
					finishWriting();
				});
			});
		};
	})(),
	writeMessages: (function() {
		var writing = false;
		var writePending = false; // whether or not a new write is pending
		var finishWriting = function() {
			writing = false;
			if (writePending) {
				writePending = false;
				this.writeMessages();
			}
		};
		return function() {
			if (writing) {
				writePending = true;
				return;

			}
			writing = true;
			var data = JSON.stringify(this.messages);
			fs.writeFile('messages.json.0', data, function() {
				// rename is atomic on POSIX, but will throw an error on Windows
				fs.rename('messages.json.0', 'messages.json', function(err) {
					if (err) {
						// This should only happen on Windows.
						fs.writeFile('messages.json', data, finishWriting);
						return;
					}
					finishWriting();
				});
			});
		};
	})(),
	writeTrades: (function() {
		var writing = false;
		var writePending = false; // whether or not a new write is pending
		var finishWriting = function() {
			writing = false;
			if (writePending) {
				writePending = false;
				this.writeTrades();
			}
		};
		return function() {
			if (writing) {
				writePending = true;
				return;

			}
			writing = true;
			var data = JSON.stringify(this.trades);
			fs.writeFile('trades.json.0', data, function() {
				// rename is atomic on POSIX, but will throw an error on Windows
				fs.rename('trades.json.0', 'trades.json', function(err) {
					if (err) {
						// This should only happen on Windows.
						fs.writeFile('trades.json', data, finishWriting);
						return;
					}
					finishWriting();
				});
			});
		};
	})(),
	writeBannedSites: (function() {
		var writing = false;
		var writePending = false; // whether or not a new write is pending
		var finishWriting = function() {
			writing = false;
			if (writePending) {
				writePending = false;
				this.writeBannedSites();
			}
		};
		return function() {
			if (writing) {
				writePending = true;
				return;

			}
			writing = true;
			var data = JSON.stringify(this.bannedSites);
			fs.writeFile('bannedSites.json.0', data, function() {
				// rename is atomic on POSIX, but will throw an error on Windows
				fs.rename('bannedSites.json.0', 'bannedSites.json', function(err) {
					if (err) {
						// This should only happen on Windows.
						fs.writeFile('bannedSites.json', data, finishWriting);
						return;
					}
					finishWriting();
				});
			});
		};
	})(),
	writeBannedWords: (function() {
		var writing = false;
		var writePending = false; // whether or not a new write is pending
		var finishWriting = function() {
			writing = false;
			if (writePending) {
				writePending = false;
				this.writeBannedWords();
			}
		};
		return function() {
			if (writing) {
				writePending = true;
				return;

			}
			writing = true;
			var data = JSON.stringify(this.bannedWords);
			fs.writeFile('bannedWords.json.0', data, function() {
				// rename is atomic on POSIX, but will throw an error on Windows
				fs.rename('bannedWords.json.0', 'bannedWords.json', function(err) {
					if (err) {
						// This should only happen on Windows.
						fs.writeFile('bannedWords.json', data, finishWriting);
						return;
					}
					finishWriting();
				});
			});
		};
	})(),
	writeUserlog: (function() {
		var writing = false;
		var writePending = false; // whether or not a new write is pending
		var finishWriting = function() {
			writing = false;
			if (writePending) {
				writePending = false;
				this.writeUserlog();
			}
		};
		return function() {
			if (writing) {
				writePending = true;
				return;

			}
			writing = true;
			var data = JSON.stringify(this.userlog);
			fs.writeFile('userlog.json.0', data, function() {
				// rename is atomic on POSIX, but will throw an error on Windows
				fs.rename('userlog.json.0', 'userlog.json', function(err) {
					if (err) {
						// This should only happen on Windows.
						fs.writeFile('userlog.json', data, finishWriting);
						return;
					}
					finishWriting();
				});
			});
		};
	})(),
	uncacheTree: function(root) {
		var uncache = [require.resolve(root)];
		do {
			var newuncache = [];
			for (var i = 0; i < uncache.length; ++i) {
				if (require.cache[uncache[i]]) {
					newuncache.push.apply(newuncache,
						require.cache[uncache[i]].children.map(function(module) {
							return module.filename;
						})
					);
					delete require.cache[uncache[i]];
				}
			}
			uncache = newuncache;
		} while (uncache.length > 0);
	},
	getDocMeta: function(id, callback) {
		https.get('https://www.googleapis.com/drive/v2/files/' + id + '?key=' + config.googleapikey, function (res) {
			var data = '';
			res.on('data', function (part) {
				data += part;
			});
			res.on('end', function (end) {
				var json = JSON.parse(data);
				if (json) {
					callback(null, json);
				} else {
					callback('Invalid response', data);
				}
			});
		});
	},
	getDocCsv: function(meta, callback) {
		https.get('https://docs.google.com/spreadsheet/pub?key=' + meta.id + '&output=csv', function (res) {
			var data = '';
			res.on('data', function (part) {
				data += part;
			});
			res.on('end', function (end) {
				callback(data);
			});
		});
	}
};
