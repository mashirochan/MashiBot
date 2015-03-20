/**
 * This is the file where the bot commands are located
 *
 * @license MIT license
 */

var http = require('http');
var sys = require('sys');

if (config.serverid === 'showdown') {
	var https = require('https');
	var csv = require('csv-parse');
}

exports.commands = {
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Help commands /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

	git: function(arg, by, room, con) {
		var text = config.excepts.indexOf(toId(by)) < 0 ? '/pm ' + by + ', ' : '';
		text += '__MashiBot__ source code: ' + config.fork + '__';
		this.say(con, room, text);
	},

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Developer commands ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

	update: function(arg, by, room, con) {
		if (toId(by) !== 'goddessmashiro') return false;
		try {
			this.uncacheTree('./commands.js');
			Commands = require('./commands.js').commands;
			this.say(con, room, '__Commands updated^-^__');
		} catch (e) {
			error('failed to update: ' + sys.inspect(e));
		}
	},
	afk: function (arg, by, room, con) {
          var tarRoom = room;
    if (toId(by) !== 'goddessmashiro') return false;
	if (isAfk == false) {
		isAfk = true;
		this.say(con, room, '/w ' + by + ', you are now in AFK mode.');
	}
	else if (isAfk == true) {
		isAfk = false;
		this.say(con, room, '/w ' + by + ', AFK mode turned off.');
	}
    },
	leave: function(arg, by, room, con) {
		if(toId(by) !== 'goddessmashiro')return false;
		this.say(con, room, '/leave')
	},
	tell: 'custom',
	custom: function (arg, by, room, con) {
        if (toId(by) !== 'goddessmashiro') return false;
        var tarRoom = 'tha';
		this.say(con, tarRoom, arg);
	},
	
	js: function(arg, by, room, con) {
		if (toId(by) !== 'goddessmashiro') return false;
		try {
			var result = eval(arg.trim());
		//	this.say(con, room, JSON.stringify(result));
		} catch (e) {
			this.say(con, room, e.name + ": " + e.message);
		}
	},
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Mail Commands /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
	
	note: function(arg, by, room, con) {
		if (toId(by) !== 'goddessmashiro') return false;
		
		var user = 'goddessmashiro';
		var message = arg;
		if (!this.messages) this.messages = {};
		if (!this.messages[user]) {
			this.messages[user] = {};
			this.messages[user].timestamp = Date.now();
		}
		if (this.messages[user]["4"]) return this.say(con, room, user + '\'s message inbox is full.');
		var msgNumber = 0;
		for (var i in this.messages[user]) {
			msgNumber++;
		}
		msgNumber = "" + msgNumber;
		this.messages[user][msgNumber] = message;
		this.writeMessages();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__Note has been saved!^-^__');
	},
	checknotes: function(arg, by, room, con) {
		var text = (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ');
		if (!this.messages[toId(by)]) return this.say(con, room, text + '__No notes have been taken ;-;__');
		for (var msgNumber in this.messages[toId(by)]) {
			if (msgNumber === 'timestamp') continue;
			this.say(con, room, text + [msgNumber] + ': ' + this.messages[toId(by)][msgNumber]);
		}
		this.writeMessages();
	},
	clearnotes: function(arg, by, room, con) {
		if (!this.hasRank(by, '#~')) return false;
		if (!arg) delete this.messages[toId(by)];
		if (!this.messages) return this.say(con, room, 'The message file is empty.');
		else {
			var user = toId(arg);
			if (!this.messages[user]) return this.say(con, room, user + '/pm ' + by + ', __All notes have been erased!__');
			delete this.messages[user];
			this.writeMessages();
			this.say(con, room, 'Messages for ' + user + ' have been erased.');
		}
	}, 

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Room Owner Commands ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

	settings: 'set',
	set: function(arg, by, room, con) {
		if (!this.hasRank(by, '#~') || room.charAt(0) === ',') return false;

		var settable = {
			say: 1,
			joke: 1,
			choose: 1,
			lewd: 1,
			pair: 1,
			blush: 1,
			kupo: 1,
			usagestats: 1,
			'8ball': 1,
		};
		var modOpts = {
			flooding: 1,
			caps: 1,
			stretching: 1,
			bannedwords: 1
		};

		var opts = arg.split(',');
		var cmd = toId(opts[0]);
		if (cmd === 'mod' || cmd === 'm' || cmd === 'modding') {
			if (!opts[1] || !toId(opts[1]) || !(toId(opts[1]) in modOpts)) return this.say(con, room, 'Incorrect command: correct syntax is ' + config.commandcharacter + 'set mod, [' +
				Object.keys(modOpts).join('/') + '](, [on/off])');

			if (!this.settings['modding']) this.settings['modding'] = {};
			if (!this.settings['modding'][room]) this.settings['modding'][room] = {};
			if (opts[2] && toId(opts[2])) {
				if (!this.hasRank(by, '#~')) return false;
				if (!(toId(opts[2]) in {on: 1, off: 1}))  return this.say(con, room, 'Incorrect command: correct syntax is ' + config.commandcharacter + 'set mod, [' +
					Object.keys(modOpts).join('/') + '](, [on/off])');
				if (toId(opts[2]) === 'off') {
					this.settings['modding'][room][toId(opts[1])] = 0;
				} else {
					delete this.settings['modding'][room][toId(opts[1])];
				}
				this.writeSettings();
				this.say(con, room, 'Moderation for ' + toId(opts[1]) + ' in this room is now ' + toId(opts[2]).toUpperCase() + '.');
				return;
			} else {
				this.say(con, room, 'Moderation for ' + toId(opts[1]) + ' in this room is currently ' +
					(this.settings['modding'][room][toId(opts[1])] === 0 ? 'OFF' : 'ON') + '.');
				return;
			}
		} else {
			if (!Commands[cmd]) return this.say(con, room, config.commandcharacter + '' + opts[0] + ' is not a valid command.');
			var failsafe = 0;
			while (!(cmd in settable)) {
				if (typeof Commands[cmd] === 'string') {
					cmd = Commands[cmd];
				} else if (typeof Commands[cmd] === 'function') {
					if (cmd in settable) {
						break;
					} else {
						this.say(con, room, 'The settings for ' + config.commandcharacter + '' + opts[0] + ' cannot be changed.');
						return;
					}
				} else {
					this.say(con, room, 'Something went wrong. PM TalkTakesTime here or on Smogon with the command you tried.');
					return;
				}
				failsafe++;
				if (failsafe > 5) {
					this.say(con, room, 'The command "' + config.commandcharacter + '' + opts[0] + '" could not be found.');
					return;
				}
			}

			var settingsLevels = {
				off: false,
				disable: false,
				'+': '+',
				'%': '%',
				'@': '@',
				'&': '&',
				'#': '#',
				'~': '~',
				on: true,
				enable: true
			};
			if (!opts[1] || !opts[1].trim()) {
				var msg = '';
				if (!this.settings[cmd] || (!this.settings[cmd][room] && this.settings[cmd][room] !== false)) {
					msg = '.' + cmd + ' is available for users of rank ' + ((cmd === 'autoban' || cmd === 'banword') ? '#' : config.defaultrank) + ' and above.';
				} else if (this.settings[cmd][room] in settingsLevels) {
					msg = '.' + cmd + ' is available for users of rank ' + this.settings[cmd][room] + ' and above.';
				} else if (this.settings[cmd][room] === true) {
					msg = '.' + cmd + ' is available for all users in this room.';
				} else if (this.settings[cmd][room] === false) {
					msg = '' + config.commandcharacter+''+ cmd + ' is not available for use in this room.';
				}
				this.say(con, room, msg);
				return;
			} else {
				if (!this.hasRank(by, '#~')) return false;
				var newRank = opts[1].trim();
				if (!(newRank in settingsLevels)) return this.say(con, room, 'Unknown option: "' + newRank + '". Valid settings are: off/disable, +, %, @, &, #, ~, on/enable.');
				if (!this.settings[cmd]) this.settings[cmd] = {};
				this.settings[cmd][room] = settingsLevels[newRank];
				this.writeSettings();
				this.say(con, room, 'The command ' + config.commandcharacter + '' + cmd + ' is now ' +
					(settingsLevels[newRank] === newRank ? ' available for users of rank ' + newRank + ' and above.' :
					(this.settings[cmd][room] ? 'available for all users in this room.' : 'unavailable for use in this room.')))
			}
		}
	},

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// General Commands //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

	say: function(arg, by, room, con) {
		if (!this.hasRank(by, '~') || room.charAt(0) === ',') return false;
		this.say(con, room, stripCommands(arg));
	},
	pair: function(arg, by, room, con) {
		if (!this.hasRank(by, '#~') || room.charAt(0) === ',') return false;
		var rand = ~~(100 * Math.random()) + 1;
		this.say(con, room, by + ' and ' + stripCommands(arg) + ' are ' + rand + '% compatible.');	
	},
	lewd: function(arg, by, room, con) {
        if (!this.hasRank(by, '+%@&#~') || room.charAt(0) === ',') return false;
        this.say(con, room, 'l-lewd..!! /.\\');
    },
	kupo: function(arg, by, room, con) {
		if (!this.hasRank(by, '+%@&#~') || room.charAt(0) === ',') return false;
		this.say(con, room, '/me pokes kupo on the nose o3o');
	},
	love: function(arg, by, room, con) {
		if (!this.hasRank(by, '#~') || room.charAt(0) === ',') return false;
		this.say(con, room, '/w goddessmashiro, __"I love you^-^<3 ~Bri"__');
	},
	commands: function(arg, by, room, con) {
		if (!this.hasRank(by, '+%@&#~') || room.charAt(0) === ',') return false;
		this.say(con, room, 'Commands for MashiBot: http://pastebin.com/QGrSXCQ3');
	},
	holdhands: function(arg, by, room, con) {
        if (!this.hasRank(by, '+%@&#~') || room.charAt(0) === ',') return false;
        this.say(con, room, 'ヽ( ͡° ͜ʖ͡°)ﾉヽ( ͡° ͜ʖ͡°)ﾉ');
    },
	senpai: function(arg, by, room, con) {
        if (!this.hasRank(by, '#~') || room.charAt(0) === ',') return false;
        this.say(con, room, 'n-notice me Bri-senpai... ;~;');
    },
	kitty: function(arg, by, room, con) {
		if (!this.hasRank(by, '#~') || room.charAt(0) === ',') return false;
        this.say(con, room, 'ima kitty =^.^= mew :3');
	},
	blush: function(arg, by, room, con) {
        if (!this.hasRank(by, '+%@&#~') || room.charAt(0) === ',') return false;
        this.say(con, room, 'o////o');
    },
	cri: function(arg, by, room, con) {
        if (!this.hasRank(by, '+%@&#~') || room.charAt(0) === ',') return false;
		this.say(con, room, 'Don\'t worry, it will be okay^~^');
        this.say(con, room, '/me hugs ' + by + ' gently');
    },
	favemon: function(arg, by, room, con) {
		if (!this.hasRank(by, '+%@&#~') || room.charAt(0) === ',') return false;
	},
	about: function(arg, by, room, con) {
		if (!this.hasRank(by, '+%@&#~') || room.charAt(0) === ',') return false;
		this.say(con, room, '__MashiBot__ is a bot that was created by Mashiro with the use of code from boTTT and Art2D2. Thanks to their respective owners for the help, I\'m a nub so I couldn\'t have done it without them o3o');
	},
	joke: function(arg, by, room, con) {
		if (!this.canUse('joke', room, by) || room.charAt(0) === ',') return false;
		var self = this;

		var reqOpt = {
			hostname: 'api.icndb.com',
			path: '/jokes/random',
			method: 'GET'
		};
		var req = http.request(reqOpt, function(res) {
			res.on('data', function(chunk) {
				try {
					var data = JSON.parse(chunk);
					self.say(con, room, data.value.joke.replace(/&quot;/g, "\""));
				} catch (e) {
					self.say(con, room, 'Sorry, couldn\'t fetch a random joke... :(');
				}
			});
		});
		req.end();
	},
	choose: function(arg, by, room, con) {
		if (arg.indexOf(',') === -1) {
			var choices = arg.split(' ');
		} else {
			var choices = arg.split(',');
		}
		choices = choices.filter(function(i) {return (toId(i) !== '')});
		if (choices.length < 2) return this.say(con, room, (room.charAt(0) === ',' ? '': '/pm ' + by + ', ') + '.choose: You must give at least 2 valid choices.');

		var choice = choices[Math.floor(Math.random()*choices.length)];
		this.say(con, room, ((this.canUse('choose', room, by) || room.charAt(0) === ',') ? '':'/pm ' + by + ', ') + stripCommands(choice));
	},
	seen: function(arg, by, room, con) { // this command is still a bit buggy
		var text = (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ');
		arg = toId(arg);
		if (!arg || arg.length > 18) return this.say(con, room, text + 'Invalid username.');
		if (arg === toId(by)) {
			text += 'Have you looked in the mirror lately?';
		} else if (arg === toId(config.nick)) {
			text += 'You might be either blind or illiterate. Might want to get that checked out.';
		} else if (!this.chatData[arg] || !this.chatData[arg].seenAt) {
			text += 'The user ' + arg + ' has never been seen.';
		} else {
			text += arg + ' was last seen ' + this.getTimeAgo(this.chatData[arg].seenAt) + ' ago' + (
				this.chatData[arg].lastSeen ? ', ' + this.chatData[arg].lastSeen : '.');
		}
		this.say(con, room, text);
	},
	'8ball': function(arg, by, room, con) {
		if (this.canUse('8ball', room, by) || room.charAt(0) === ',') {
			var text = '';
		} else {
			var text = '/pm ' + by + ', ';
		}

		var rand = ~~(20 * Math.random()) + 1;

		switch (rand) {
	 		case 1: text += "Signs point to yes."; break;
	  		case 2: text += "Yes."; break;
			case 3: text += "Reply hazy, try again."; break;
			case 4: text += "Without a doubt."; break;
			case 5: text += "My sources say no."; break;
			case 6: text += "As I see it, yes."; break;
			case 7: text += "You may rely on it."; break;
			case 8: text += "Concentrate and ask again."; break;
			case 9: text += "Outlook not so good."; break;
			case 10: text += "It is decidedly so."; break;
			case 11: text += "Better not tell you now."; break;
			case 12: text += "Very doubtful."; break;
			case 13: text += "Yes - definitely."; break;
			case 14: text += "It is certain."; break;
			case 15: text += "Cannot predict now."; break;
			case 16: text += "Most likely."; break;
			case 17: text += "Ask again later."; break;
			case 18: text += "My reply is no."; break;
			case 19: text += "Outlook good."; break;
			case 20: text += "Don't count on it."; break;
		}
		this.say(con, room, text);
	},
};
