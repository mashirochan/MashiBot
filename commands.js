
var http = require('http');
var sys = require('sys');
var osuapi = require('osu-api');
var osu = new osuapi.Api('d71c2876656c6fcbd2e0456a7410272208360a5d');
var LolApi = require('leagueapi');

var CDchecker = {
	roomkick: 0,
	pair: 0,
};

var CDtime = {
	roomkick: 10,
	pair: 2,
};

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
		text += '__MashiBot__ source code: ' + config.fork;
		this.say(con, room, text);
	},
	guide: 'commands',
	help: 'commands',
	commands: function(arg, by, room, con) {
		this.say(con, room, 'Commands for MashiBot: ' + config.botguide);
	},
	about: function(arg, by, room, con) {
		if (!this.hasRank(by, ' +%@&#~') || room.charAt(0) === ',') return false;
		this.say(con, room, '__MashiBot__ is a bot that was created by Mashiro with the use of code from boTTT and Art2D2. Thanks to their respective owners for the help, I\'m a nub so I couldn\'t have done it without them o3o');
	},

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Developer commands ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        
	
	/**
	 * update is a function that reloads the commands.js file, updating any saved changes
	 * 
	 * @param commands.js exists
	 * @param user has a rank of Admin (~) or up
	 * 
	 * @return {String} - If there is an error, log in the console
	 * @return {String} - Sends a confirmation message that commands.js has been updated
	 */
	update: function(arg, by, room, con) {
		if (!this.hasRank(by, '~')) return false;
		try {
			this.uncacheTree('./commands.js');
			Commands = require('./commands.js').commands;
			this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__Commands updated^-^__');
		}
		catch (e) {
			error('failed to update: ' + sys.inspect(e));
		}

	},
	/**
	 * leave is a function that makes the bot leave the room that the user of the command is currently in
	 * 
	 * @param user has a rank of Admin (~) or up
	 * 
	 * @return {String} - Returns a string that makes the bot leave the current room
	 */
	leave: function(arg, by, room, con) {
		if (!this.hasRank(by, '~')) return false;
		this.say(con, room, '/leave');
	},
	/**
	 * disconnect is a function that makes the bot leave the server entirely
	 * 
	 * @param user has a rank of Admin (~) or up
	 * 
	 * @return - Returns a command that closes the connection of the bot
	 */
	disconnect: function(arg, by, room, con) {
		if (!this.hasRank(by, '~')) return false;
		con.close();
	},
	afk: function(arg, by, room, con) {
		var tarRoom = room;
		if (toId(by) !== 'mashirochan') return false;
		if (isAfk === false) {
			isAfk = true;
			this.say(con, room, '/w ' + by + ', you are now in AFK mode.');
		}
		else if (isAfk === true) {
			isAfk = false;
			this.say(con, room, '/w ' + by + ', AFK mode turned off.');
		}
	},
	/**
	 * say is a function that makes the bot say what the user inputs, in the specified rooms
	 * 
	 * @param user has a username of 'mashirochan'
	 * 
	 * @return {String} - Sends a message to the specified room
	 */
	say: function(arg, by, room, con) {
		if (toId(by) !== 'mashirochan') return false;
		if (arg.indexOf(", ") == -1) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__No room has been specified!__');
		var input = arg.split(", ");
		var tarRoom = toId(input[0]);
		var message = input[1];
		this.say(con, tarRoom, message);
	},
	/**
	 * js is a function that alows the testing of JavaScript code in the client
	 * 
	 * @param user has a username of 'mashirochan' 
	 * @param {String} arg - Code that you want to test
	 * 
	 * @return returns the output of the code that is input
	 */
	js: function(arg, by, room, con) {
		if (toId(by) !== 'mashirochan') return false;
		try {
			var result = eval(arg.trim());
		}
		catch (e) {
			this.say(con, room, e.name + ": " + e.message);
		}
	},
	/**
	 * avatar is a function that changes the avatar of the bot
	 * 
	 * @param 0 < avatarnumber < 295
	 * 
	 * @return sets the bot's avatar to the avatar associated with the specified avatar number
	 */
	avatar: function(arg, by, room, con) {
		if (!this.canUse('avatar', room, by)) return false;
		if (toId(by) !== 'mashirochan') return false;
		var avatarnumber = Math.round(stripCommands(arg))
		this.say(con, room, '/avatar ' + avatarnumber);
		if (avatarnumber < 295) {
			this.say(con, room, '/w ' + by + ', __The avatar was changed to number ' + avatarnumber + '.__');
		}
		else if (avatarnumber > 294) {
			this.say(con, room, '/w ' + by + ', __Please choose a valid avatar (1 - 294).__');
		}
		else if (typeof stripCommands(arg) !== 'number') {
			this.say(con, room, '/w ' + by + ', __That isn\'t a number... ._.__');
		}
	},

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Moderation commands ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

	warn: function(arg, by, room) {
		if (!this.canUse('warn', room, by)) return false;
		var warnMsg = arg.split(', ');
		var tarRoom = 'tha';
		this.say(con, tarRoom, '__' + warnMsg[0] + ' has been warned by ' + by + '. Reason: ' + warnMsg[1] + '.__');
	},
	rk: 'roomkick',
	roomkick: function(arg, by, room, con) {
		if (!(CDchecker.roomkick !== 1)) return false;
		if (!this.canUse('roomkick', room, by)) return false;
		CDchecker.roomkick = 1;
		this.say(room, '/roomban ' + arg + ', you have been bad!!! D:<');
		this.say(con, room, '/unroomban ' + arg);
		this.say(con, room, '/modnote ' + arg + ' has been roomkick\'ed by ' + by + '!');
		setTimeout(function() {
			CDchecker.roomkick = 0;
		}, CDtime.roomkick * 1000);
	},
	set: function(arg, by, room, con) {
		if (!this.hasRank(by, '#~') || room.charAt(0) === ',') return false;

		var settable = {
			profile: 1,
			setprofile: 1,
			setfavemon: 1,
			selfie: 1,
			setselfie: 1,
			favemap: 1,
			setfavemap: 1,
			setquote: 1,
			quote: 1,
			favemon: 1,
			setfriends: 1,
			moderation: 1,
			friends: 1,
			say: 1,
			warn: 1,
			senpai: 1,
			kitty: 1,
			cri: 1,
			roomkick: 1,
			pair: 1,
			shorten: 1,
			runtour: 1,
			love: 1,
		};
		var modOpts = {
			flooding: 0,
			caps: 0,
			stretching: 0,
			bannedwords: 0
		};

		var opts = arg.split(',');
		var cmd = toId(opts[0]);
		if (cmd === 'mod' || cmd === 'm' || cmd === 'modding') {
			if (!opts[1] || !toId(opts[1]) || !(toId(opts[1]) in modOpts)) return this.say(con, room, 'Incorrect command: correct syntax is .set mod, [' +
				Object.keys(modOpts).join('/') + '](, [on/off])');

			if (!this.settings['modding']) this.settings['modding'] = {};
			if (!this.settings['modding'][room]) this.settings['modding'][room] = {};
			if (opts[2] && toId(opts[2])) {
				if (!this.hasRank(by, '#~')) return false;
				if (!(toId(opts[2]) in {
						on: 1,
						off: 1
					})) return this.say(con, room, 'Incorrect command: correct syntax is .set mod, [' +
					Object.keys(modOpts).join('/') + '](, [on/off])');
				if (toId(opts[2]) === 'off') {
					this.settings['modding'][room][toId(opts[1])] = 0;
				}
				else {
					delete this.settings['modding'][room][toId(opts[1])];
				}
				this.writeSettings();
				this.say(con, room, 'Moderation for ' + toId(opts[1]) + ' in this room is now ' + toId(opts[2]).toUpperCase() + '.');
				return;
			}
			else {
				this.say(con, room, 'Moderation for ' + toId(opts[1]) + ' in this room is currently ' +
					(this.settings['modding'][room][toId(opts[1])] === 0 ? 'OFF' : 'ON') + '.');
				return;
			}
		}
		else {
			if (!Commands[cmd]) return this.say(con, room, '#' + opts[0] + ' is not a valid command.');
			var failsafe = 0;
			while (!(cmd in settable)) {
				if (typeof Commands[cmd] === 'string') {
					cmd = Commands[cmd];
				}
				else if (typeof Commands[cmd] === 'function') {
					if (cmd in settable) {
						break;
					}
					else {
						this.say(con, room, 'The settings for #' + opts[0] + ' cannot be changed.');
						return;
					}
				}
				else {
					this.say(con, room, 'Something went wrong. PM SolarisFox here or on Smogon with the command you tried.');
					return;
				}
				failsafe++;
				if (failsafe > 5) {
					this.say(con, room, 'The command "#' + opts[0] + '" could not be found.');
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
					msg = '#' + cmd + ' is available for nerds of rank ' + ((cmd === 'autoban' || cmd === 'banword') ? '#' : config.defaultrank) + ' and above.';
				}
				else if (this.settings[cmd][room] in settingsLevels) {
					msg = '#' + cmd + ' is available for nerds of rank ' + this.settings[cmd][room] + ' and above.';
				}
				else if (this.settings[cmd][room] === true) {
					msg = '#' + cmd + ' is available for all nerds in this room.';
				}
				else if (this.settings[cmd][room] === false) {
					msg = '#' + cmd + ' is not available for use in this room.';
				}
				this.say(con, room, msg);
				return;
			}
			else {
				if (!this.hasRank(by, '#~')) return false;
				var newRank = opts[1].trim();
				if (!(newRank in settingsLevels)) return this.say(con, room, 'Unknown option: "' + newRank + '". Valid settings are: off/disable, +, %, @, &, #, ~, on/enable.');
				if (!this.settings[cmd]) this.settings[cmd] = {};
				this.settings[cmd][room] = settingsLevels[newRank];
				this.writeSettings();
				this.say(con, room, 'The command #' + cmd + ' is now ' +
					(settingsLevels[newRank] === newRank ? ' available for users of rank ' + newRank + ' and above.' :
						(this.settings[cmd][room] ? 'available for all users in this room.' : 'unavailable for use in this room.')));
			}
		}
	},
	disablecommands: function(arg, by, room, con) {
		if (!this.canUse('disablecommands', room, by)) return false;
		config.defaultrank = '#';
		this.say(con, room, 'Commands now disabled.');
	},
	enablecommands: function(arg, by, room, con) {
		if (!this.canUse('enablecommands', room, by)) return false;
		config.defaultrank = '+';
		this.say(con, room, 'Commands now enabled.');
	},
	canmod: 'canmoderate',
	canmoderate: function(arg, by, room, con) {
		if (!this.canUse('canmoderate', room, by)) return false;
		if (config.allowmute == true) {
			this.say(con, room, config.nick + ' **can** apply moderation to users.');
		}
		else if (config.allowmute == false) {
			this.say(con, room, config.nick + ' **cannot** apply moderation to users.');
		}
	},
	watch: 'moderation',
	mod: 'moderation',
	moderation: function(arg, by, room, con) {
		if (!this.canUse('moderation', room, by)) return false;
		var toggle = toId(stripCommands(arg));

		switch (toggle) {
			case 'on':
			case 'true':
				if (config.allowmute === true) {
					this.say(con, room, 'I\'m already watching. __I\'m always watching.__');
				}
				else {
					config.allowmute = true;
					this.say(con, room, 'I am now watching all of you o.o');
				}
				break;
			case 'off':
			case 'false':
				if (config.allowmute === false) {
					this.say(con, room, 'I\'m already on break, leave me alone! ;~;');
				}
				else {
					config.allowmute = false;
					this.say(con, room, 'I\'m going off duty, enjoy your freedom everyone!^-^');
				}
				break;
			case 'cmdmaker':
				this.say(con, room, 'This command was made by Rhythms! Thanks to him!!! ^-^');
				break;
			default:
				this.say(con, room, '\'' + toggle + '\' is not a valid choice for moderation toggling... The correct syntax is ' + config.commandcharacter + 'moderation **[on/true]/[off/false]** ^-^');
		}
	},
	banphrase: 'banword',
	banword: function(arg, by, room, con) {
		if (!this.hasRank(by, '#~')) return false;
		if (!this.settings.bannedphrases) this.settings.bannedphrases = {};
		arg = arg.trim().toLowerCase();
		if (!arg) return false;
		var tarRoom = room;

		if (room.charAt(0) === ',') {
			if (!this.hasRank(by, '~')) return false;
			tarRoom = 'global';
		}

		if (!this.settings.bannedphrases[tarRoom]) this.settings.bannedphrases[tarRoom] = {};
		if (arg in this.settings.bannedphrases[tarRoom]) return this.say(con, room, "Phrase \"" + arg + "\" is already banned.");
		this.settings.bannedphrases[tarRoom][arg] = 1;
		this.writeSettings();
		this.say(con, room, "Phrase \"" + arg + "\" is now banned.");
	},
	unbanphrase: 'unbanword',
	unbanword: function(arg, by, room, con) {
		if (!this.hasRank(by, '#~')) return false;
		arg = arg.trim().toLowerCase();
		if (!arg) return false;
		var tarRoom = room;

		if (room.charAt(0) === ',') {
			if (!this.hasRank(by, '~')) return false;
			tarRoom = 'global';
		}

		if (!this.settings.bannedphrases || !this.settings.bannedphrases[tarRoom] || !(arg in this.settings.bannedphrases[tarRoom]))
			return this.say(con, room, "Phrase \"" + arg + "\" is not currently banned.");
		delete this.settings.bannedphrases[tarRoom][arg];
		if (!Object.size(this.settings.bannedphrases[tarRoom])) delete this.settings.bannedphrases[tarRoom];
		if (!Object.size(this.settings.bannedphrases)) delete this.settings.bannedphrases;
		this.writeSettings();
		this.say(con, room, "Phrase \"" + arg + "\" is no longer banned.");
	},
	viewbannedphrases: 'viewbannedwords',
	vbw: 'viewbannedwords',
	viewbannedwords: function(arg, by, room, con) {
		if (!this.hasRank(by, '@#~')) return false;
		arg = arg.trim().toLowerCase();
		var tarRoom = room;

		if (room.charAt(0) === ',') {
			if (!this.hasRank(by, '~')) return false;
			tarRoom = 'global';
		}

		var text = "";
		if (!this.settings.bannedphrases || !this.settings.bannedphrases[tarRoom]) {
			text = "No phrases are banned in this room.";
		}
		else {
			if (arg.length) {
				text = "The phrase \"" + arg + "\" is currently " + (arg in this.settings.bannedphrases[tarRoom] ? "" : "not ") + "banned " +
					(room.charAt(0) === ',' ? "globally" : "in " + room) + ".";
			}
			else {
				var banList = Object.keys(this.settings.bannedphrases[tarRoom]);
				if (!banList.length) return this.say(con, room, "No phrases are banned in this room.");
				this.uploadToHastebin(con, room, by, "The following phrases are banned " + (room.charAt(0) === ',' ? "globally" : "in " + room) + ":\n\n" + banList.join('\n'));
				return;
			}
		}
		this.say(con, room, text);
	},
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Friends commands ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

	setfriends: 'addfriend',
	addfriend: function(arg, by, room, con) {
		if (!this.friends) this.friends = {};
		if (toId(arg) === toId(by)) return this.say(con, room, '__You can\'t add yourself to your friends list, silly :3__');
		if (arg.length <= 0 || arg.length > 18) return this.say(con, room, 'That\'s not a real username!');
		if (!this.friends[toId(by)]) this.friends[toId(by)] = {};
		var alreadyInFriends = false;
		for (var i in this.friends[toId(by)]) {
			if (this.friends[toId(by)][i] == toId(arg)) {
				this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__' + arg + ' is already in your friends list!__');
				alreadyInFriends = true;
			}
		}
		if (alreadyInFriends == true) return false;
		var friendNumber = 0;
		for (var i in this.friends[toId(by)]) {
			friendNumber++;
		}
		this.friends[toId(by)][friendNumber] = toId(arg);
		this.writeFriends();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__' + arg + ' has been added to your friends list!^-^__');
	},
	friendslist: 'allfriends',
	allfriends: function(arg, by, room, con) {
		if (!this.friends[toId(by)]) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__You have no friends in your friends list ;~;__');
		var friendsList = [];
		for (var i in this.friends[toId(by)]) {
			friendsList.push(' ' + this.friends[toId(by)][i]);
		}
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '**Friends list:** ' + friendsList);
	},
	removefriend: function(arg, by, room, con) {
		var inFriends = false;
		for (var i in this.friends[toId(by)]) {
			if (this.friends[toId(by)][i] == toId(arg)) {
				delete this.friends[toId(by)][i];
				inFriends = true;
			}
		}
		if (inFriends == false) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__This user is not in your friends list ;~;__');
		this.writeFriends();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__' + arg + ' has been successfully deleted from your friends list!^-^__');

	},
	clearfriends: function(arg, by, room, con) {
		delete this.friends[toId(by)];
		this.writeFriends();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__Friends list has been cleared successfully!^-^__');
	},
	hidejoins: 'hidefriends',
	hidenotifications: 'hidefriends',
	hidefriends: function(arg, by, room, con) {
		if (!this.friends[toId(by)]) this.friends[toId(by)] = {};
		if (this.friends[toId(by)]["status"] == 'off') return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__You are already hiding friend notifications!__');
		this.friends[toId(by)]["status"] = 'off';
		this.writeFriends();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__Now hiding all friend notifications!__');
	},
	showjoins: 'showfriends',
	shownotifications: 'showfriends',
	showfriends: function(arg, by, room, con) {
		if (!this.friends[toId(by)]) this.friends[toId(by)] = {};
		if (!this.friends[toId(by)]["status"]) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__You are already showing friend notifications!__');
		delete this.friends[toId(by)]["status"];
		this.writeFriends();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__Friend notifications are now visible!^-^__');
	},
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Tournament Commands ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////       

	tour: 'runtour',
	runtour: function(arg, by, room, con) {
		if (!this.hasRank(by, '@#~')) return false;
		
		var tourCommand = arg.split(', ');
		var TourStartTimer = 5 * 60 * 1000;
		var tourType = tourCommand[0].replace(/\s/g, '');
		var autoDq = 5 * 60 * 1000;
		var rounds = 1 * 60 * 1000;
		var eliminationType = ['elimination', 'roundrobin'];
		
		if (tourCommand[1]) {
			TourStartTimer = tourCommand[1].replace(/\s/g, '') * 60 * 1000;
		}
		if (tourCommand[2]) {
			autoDq = tourCommand[2].replace(/\s/g, '') * 60 * 1000;
		}
		if (tourCommand[3]) {
			rounds = tourCommand[3].replace(/\s/g, '') * 60 * 1000;
		}
		
		if (tourType === '1v1' || tourType === 'cc1v1' || tourType === 'challengecup1v1') {
			eliminationType[1];
		} else {
			eliminationType[0];
		}
		
		if (typeof TourStartTimer!== 'number' || typeof autoDq !== 'number') {
			this.say(con, room, '__You\'re supposed to enter **numbers**, baka!!__');
		} else if (!tourCommand[0]) {
			this.say(con, room, 'Correct syntax: "#tour [type], [signup time], [autodq timer], [elimination rounds]".');
		} else {
			this.say(con, room, '/tour create ' + tourType + ', ' + eliminationType + ', ' + rounds / 60000);
			this.say(con, room, '/wall Tournament will be starting in **' + TourStartTimer / 60000 +'** minutes!^-^');
			this.say(con, room, '/wall I\'m setting the auto-disqualification timer to **' + autoDq / 60000 + '** minutes, okay?');
			
			setTimeout(function() {
				this.say(con, room, '/wall Tournament will be starting in **1** minute, last call for signups!');
			}.bind(this), TourStartTimer - (60 * 1000));
			
			setTimeout(function() {
				this.say(con, room, '/tour start');
				this.say(con, room, '/wall You have **' + autoDq / 60000 + '** minutes to challenge your opponent. Good luck and have fun everyone!^-^');
				this.say(con, room, '/tour setautodq ' + autoDq / 60000);
			}.bind(this), TourStartTimer);
		}
	},
	dq: 'tourdq',
	tourdq: function(arg, by, room, con) {
		if (!this.hasRank(by, '@#~')) return false;
		var user = toId(stripCommands(arg));
		this.say(con, room, '/tour dq ' + user);
	},

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Quote Commands ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      

	setqotd: 'setquote',
	setquote: function(arg, by, room, con) {
		if (!this.hasRank(by, '#~')) return false;
		if (!this.settings) this.settings = {};
		if (!this.settings["quote"]) this.settings["quote"] = {};
		var input = arg.split(", ");
		if (input.length > 2) {
			this.settings["quote"]["by"] = input[input.length - 1];
		} else {
			this.settings["quote"]["quote"] = input[0];
			this.settings["quote"]["by"] = input[1];
		}
		this.writeSettings();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__Quote has been set!^-^__');
	},
	qotd: 'quote',
	quote: function(arg, by, room, con) {
		if (!this.hasRank(by, '+%@&#~')) return false;
		if (!this.settings["quote"]) return this.say(con, room, '__No quote has been set ;-;__');
		this.say(con, room, 'Quote of the Day: __"' + this.settings["quote"]["quote"] + '"__ ~' + this.settings["quote"]["by"]);
	},


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Offline PM Commands ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////     
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      

	/**
	 * message is a function that sends messages to other users, usually used to message offline users
	 * 
	 * @param {String} username - The user that you want to send a message to
	 * @param {String} message  - The message that you want to send to the specified user
	 * 
	 * @return {String} text    - Returns a message sent confirmation message and stores the message to send it later
	 */
	mail: 'message',
	msg: 'message',
	message: function(arg, by, room, con) {
		if (!arg) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + 'Command syntax: #message ``[user], [message]``');
		if (arg.indexOf(",") == -1) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__You must seperate the user from the message with a comma! ;~;__');
		var input = arg.split(",");
		var username = toId(input[0]);
		if (username == 'mashibot') return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + 'h-hi im just a bot so please dont message me..!! >~<');
		var text = by + ': ' + input[1].trim();
		if (input.length > 2) {
		for (var i = 2; i < input.length; i++) {
			text += (',' + input[i]);
		}
		}
		if (!this.messages) this.messages = {};
		if (!this.messages[username]) this.messages[username] = {};
		if (!this.messages[username]["mail"]) this.messages[username]["mail"] = {};
		if (this.messages[username]["mail"][5]) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__' + username + '\'s message inbox is full!__');
		var msgNumber = 1;
		for (var i in this.messages[username]["mail"]) {
			msgNumber++;
		}
		this.messages[username]["mail"][msgNumber] = text;
		this.writeMessages();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__Message has been sent successfully to ' + input[0] + '!^-^__');
	},
	/**
	 * checkmail is a function that checks the user's mail, clearing them after they are sent
	 * 
	 * @param user has messages stored for them in the messages JSON
	 * 
	 * @return {String} - Returns any messages for the user in the messages JSON
	 */
	checkmessages: 'checkmail',
	checkmsgs: 'checkmail',
	checkmail: function(arg, by, room, con) {
		if (!this.messages || !this.messages[toId(by)] || !this.messages[toId(by)]["mail"]) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__You have no mail in your mailbox. ;-;__');
		for (var msgNumber in this.messages[toId(by)]["mail"]) {
			this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '[' + msgNumber + ']: ' + this.messages[toId(by)]["mail"][msgNumber]);
		}
		delete this.messages[toId(by)]["mail"];
		this.writeMessages();
	},
	/**
	 * blockmail is a function that blocks all incoming messages for the user
	 * 
	 * @param {String}         - If 'status' property of the user's message object exists, if so, what the status is
	 * 
	 * @return {String}        - If mail is already being blocked, returns an error message
	 * @return {String} status - Sets the user's message status in the JSON to 'off' 
	 */
	blockmessages: 'blockmail',
	blockmsgs: 'blockmail',
	blockmail: function(arg, by, room, con) {
		if (!this.messages) this.messages = {};
		if (!this.messages[toId(by)]) this.messages[toId(by)] = {};
		if (!this.messages[toId(by)]["status"]) this.messages[toId(by)]["status"] = {};
		if (this.messages[toId(by)]["status"] == 'off') return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__You are already blocking mail! ;~;__');
		this.messages[toId(by)]["status"] = 'off';
		this.writeMessages();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__Now blocking all mail!^-^__');
	},
	/**
	 * allowmail is a function that allows all incoming messages for the user
	 * 
	 * @param {String}         - If 'status' property of the user's message object exists, if so, what the status is
	 * 
	 * @return {String}        - If mail is already being allowed, returns an error message
	 * @return {String} status - Sets the user's message status in the JSON to 'on' 
	 * 						   - Send a user status change confirmation
	 */
	allowmessages: 'allowmail',
	allowmsgs: 'allowmail',
	allowmail: function(arg, by, room, con) {
		if (!this.messages) this.messages = {};
		if (!this.messages[toId(by)]) this.messages[toId(by)] = {};
		if (!this.messages[toId(by)]["status"]) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__You are already allowing mail, silly :3__');
		delete this.messages[toId(by)]["status"];
		this.writeMessages();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__All mail now allowed!^-^__');
	},
	/**
	 * clearmail is a function that clears all of the mail in either the user, or entire messages JSON
	 * 
	 * @param {String} arg - If arg exists, assume it is a username 
	 * 
	 * @return {String} - If arg exists, delete all messages in the user's JSON object
	 * 					- Send a user message deletion confirmation
	 * @return {String} - If arg does not exist, delete all messages in the messages JSON
	 * 					- Send a total message JSON wipe confirmation
	 */
	clearmessages: 'clearmail',
	clearmsgs: 'clearmail',
	clearmail: function(arg, by, room, con) {
		if (toId(by) !== 'mashirochan') return false;
		if (!arg) {
			delete this.messages;
			this.messages = {};
			this.writeMessages();
			this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__All messages and user statuses have been reset!__');
		} else {
			if (!this.messages[toId(arg)]) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__The user could not be found!__');
			delete this.messages[toId(arg)];
			this.messages[toId(arg)] = {};
			this.writeMessages();
		}
	},
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Note Commands /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      

	note: function(arg, by, room, con) {
		if (!arg) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + 'Command syntax: #note ``[note]``');
		if (!this.notes) this.notes = {};
		if (!this.notes[toId(by)]) this.notes[toId(by)] = {};
		if (this.notes[toId(by)][5]) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__Notebook is full!__');
		var noteNumber = 1;
		for (var i in this.notes[toId(by)]) {
			noteNumber++;
		}
		this.notes[toId(by)][noteNumber] = arg;
		this.writeNotes();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__Note has been taken!^-^__');
	},
	notes: 'checknotes',
	notebook: 'checknotes',
	checknotes: function(arg, by, room, con) {
		if (!this.notes || !this.notes[toId(by)]) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__No notes have been taken. ;-;__');
		for (var noteNumber in this.notes[toId(by)]) {
			this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '[' + noteNumber + ']: ' + this.notes[toId(by)][noteNumber]);
		}
	},
	deletenote: 'clearnote',
	erasenote: 'clearnote',
	clearnote: function(arg, by, room, con) {
		if (!this.notes || !this.notes[toId(by)]) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__You have no notes, silly :3__');
		if (!/^\d+$/.test(arg)) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__You must include the note number that you want to erase!__');
		if (!this.notes[toId(by)][arg]) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__That is not a valid note number!__');
		delete this.notes[toId(by)][arg];
		this.writeNotes();
		var place = '';
		if (arg == '1') place += 'st';
		else if (arg == '2') place += 'nd';
		else if (arg == '3') place += 'rd';
		else place += 'th';
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__Your ' + arg + place + ' note has been erased!^-^__');
	},
	erasenotes: 'clearnotes',
	erasenotebook: 'clearnotes',
	clearnotebook: 'clearnotes',
	clearnotes: function(arg, by, room, con) {
		if (!this.notes || !this.notes[toId(by)]) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__You have no notes, silly :3__');
		delete this.notes[toId(by)];
		this.writeNotes();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__All notes have been errased!^-^__');
	},

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Favorite Pokemon //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

	setfavemon: function(arg, by, room, con) {
		var tarRoom = room;
		if (!this.settings.favemon) this.settings.favemon = {};
		if (this.hasRank(by, '#~') && arg.split(", ").length !== 1) {
			if (!this.settings.favemon[tarRoom]) this.settings.favemon[tarRoom] = {};
			if (arg.split(", ").length !== 2) return this.say(con, room, 'Syntax is: #setfavemon [user], [pokemon]');
			var user = toId(arg.split(", ")[0]);
			var poke = arg.split(", ")[1];
			if (user.length < 1 || user.length > 18) return this.say(con, room, 'That\'s not a real username!');
		}
		else if (this.canUse('setfavemon', room, by)) {
			var poke = arg;
			var user = toId(by);
		}
		else {
			return false;
		}
		if (!this.settings.favemon[user]) this.settings.favemon[user] = {};
		var foundMon = false;
		var monId = toId(poke.replace(/(shiny|mega)/i, ''));
		for (mon in Pokedex) {
			if (toId(Pokedex[mon].species) === monId) {
				foundMon = true;
				break;
			}
		}
		if (!foundMon) return this.say(con, room, '\'' + poke + '\' is not a valid Pokemon!');
		this.settings.favemon[user]['favemon'] = poke;
		this.writeSettings();
		this.say(con, room, '/w ' + toId(by) + ', __Your favorite pokemon has been set to ' + poke + '!^-^__');
		var text = '';
	},
	favemon: function(arg, by, room, con) {
		if (this.canUse('favemon', room, by) || room.charAt(0) === ',') {
			var text = '';
		}
		else {
			var text = '/pm ' + by + ', ';
		}
		if (!arg) {
			if (this.settings.favemon[toId(by)]) {
				return this.say(con, room, by + '\'s favorite Pokemon is __' + this.settings.favemon[toId(by)]['link'] + '__!');
			}
			else {
				return this.say(con, room, 'There is no favorite Pokemon set for ' + by + '.');
			}
		}
		var user = toId(arg);
		if (user.length < 1 || user.length > 18) return this.say(con, room, 'That\'s not a real username!');
		if (!this.settings.favemon[user]) return this.say(con, room, '' + text + 'There is no favorite Pokemon set for ' + arg + '.');
		var poke = this.settings.favemon[user]['favemon'];
		this.say(con, room, arg + '\'s favorite Pokemon is __' + poke + '__!');
	},

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Selfie ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////     
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

	setselfie: function(arg, by, room, con) {
		var tarRoom = room;
		var bitLink = '';
		var BitlyAPI = require("node-bitlyapi");
		var Bitly = new BitlyAPI({
			client_id: "Something",
			client_secret: "Something"
		});
		if (!this.settings.selfie) this.settings.selfie = {};
		if (this.hasRank(by, '#~') && arg.split(", ").length !== 1) {
			if (!this.settings.selfie[tarRoom]) this.settings.selfie[tarRoom] = {};
			if (arg.split(", ").length !== 2) return this.say(con, room, 'Syntax is: #setselfie [user], [link]');
			var user = toId(arg.split(", ")[0]);
			var link = arg.split(", ")[1];
		}
		else if (this.canUse('setselfie', room, by)) {
			var link = arg;
			var user = toId(by);
		}
		else {
			return false;
		}
		if (!/https?:\/\//.test(link)) return this.say(con, room, 'Link must include http.');
		if (!this.settings.selfie[user]) this.settings.selfie[user] = {};
		Bitly.setAccessToken("c8a15558cbf4a555391b974849d7684e211fb707");
		Bitly.shortenLink(link, function(err, results) {
			var resObject = eval("(" + results + ")");
			bitLink += resObject.data.url;
			return bitLink;
		});
		var x = 0;
		var self = this;
		var timer = setInterval(function() {
			if (!bitLink) {
				x++;
				if (x > 50) {
					clearInterval(timer);
					return self.say(con, room, "__Bit.ly connection timed out! Try again later, sorry! ;~;__");
				}
			}
			else {
				clearInterval(timer);
				self.settings.selfie[user]['link'] = bitLink;
				self.writeSettings();
				self.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__Your selfie has been set!^-^__');
			}
		}, 100);
	},
	selfie: function(arg, by, room, con) {
		if (this.canUse('selfie', room, by) || room.charAt(0) === ',') {
			var text = '';
		}
		else {
			var text = '/pm ' + by + ', ';
		}
		if (!arg) {
			if (this.settings.selfie[toId(by)]) {
				return this.say(con, room, text + by + '\'s selfie is ' + this.settings.selfie[toId(by)]['link'] + '!');
			}
			else {
				return this.say(con, room, '__No selfie has been set ;-;__');
			}
		}
		var user = toId(arg);
		if (user.length < 1 || user.length > 18) return this.say(con, room, 'That\'s not a real username!');
		if (!this.settings.selfie[user]) return this.say(con, room, '__No selfie has been set ;-;__');
		var link = this.settings.selfie[user]['link'];
		this.say(con, room, arg + '\'s selfie:' + link + '!');

	},

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// General Commands //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

	pair: function(arg, by, room, con) {
		if (!(CDchecker.pair !== 1)) return false;
		if (!this.canUse('pair', room, by)) return false;
		CDchecker.pair = 1;
		var text = '';
		var rand = ~~(100 * Math.random() + 1);
		text += by + ' and ' + arg + ' are ' + rand + '% compatible!';
		this.say(con, room, text);
		setTimeout(function() {
			CDchecker.pair = 0;
		}, CDtime.pair * 1000);
	},
	senpai: function(arg, by, room, con) {
		if (!this.hasRank(by, '~')) return false;
		this.say(con, room, 'n-notice me ' + arg + '-senpai... ;~;');
	},
	kitty: function(arg, by, room, con) {
		if (!this.hasRank(by, '~')) return false;
		this.say(con, room, 'ima kitty =^.^= mew :3');
	},
	cry: 'cri',
	cri: function(arg, by, room, con) {
		if (!this.canUse('cri', room, by) || room.charAt(0) === ',') return false;
		this.say(con, room, 'Don\'t worry, it will be okay^~^');
		this.say(con, room, '/me hugs ' + by + ' gently');
	},
	shorten: function(arg, by, room, con) {
		if (!this.canUse('shorten', room, by)) return false;
		if (arg.indexOf("http") == -1) return this.say(con, room, 'Please input a __link__!');
		var BitlyAPI = require("node-bitlyapi");
		var Bitly = new BitlyAPI({
			client_id: "Something",
			client_secret: "Something"
		});
		var self = this;
		Bitly.setAccessToken("c8a15558cbf4a555391b974849d7684e211fb707");
		Bitly.shortenLink(arg, function(err, results) {
			var resObject = eval("(" + results + ")");
			self.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + resObject.data.url);
		});
	},
	math: function(arg, by, room, con) {
		var input = arg.replace(/ /g,'');
		var sign = '';
		var solution = '';
		if (input.indexOf('+') > -1) sign = '+';
		else if (input.indexOf('+') > -1) sign = '+';
		else if (input.indexOf('-') > -1) sign = '-';
		else if (input.indexOf('*') > -1) sign = '*';
		else if (input.indexOf('x') > -1) sign = 'x';
		else if (input.indexOf('/') > -1) sign = '/';
		else if (input.indexOf('%') > -1) sign = '%';
		else if (input.indexOf('^') > -1) sign = '^';
		else if (input.indexOf('pow') > -1) sign = '^';
		else if (input.indexOf('power') > -1) sign = '^';
		else if (input.indexOf('sqrt') > -1) {
			sign = 'sqrt';
			var num = input.substring(input.indexOf(sign) + sign.length, input.length);
			solution = Math.sqrt(parseInt(num, 10)).toFixed(4);
			return this.say(con, room, 'sqrt(' + num + ') = ' + solution);
		} else if (input.indexOf('root') > -1) {
			sign = 'root';
			var num = input.substring(input.indexOf(sign) + sign.length, input.length);
			solution = Math.sqrt(parseInt(num, 10)).toFixed(4);
			return this.say(con, room, 'sqrt(' + num + ') = ' + solution);
		} else return this.say(con, room, '__Please use a proper sign!__');
		var num1 = parseInt(input.substring(0, input.indexOf(sign)), 10);
		var num2 = parseInt(input.substring(input.indexOf(sign) + sign.length, input.length), 10);
		if (sign == '+') solution = num1 + num2;
		else if (sign == '-') solution = num1 - num2;
		else if (sign == '*' || sign == 'x') solution = num1 * num2;
		else if (sign == '/') solution = num1 / num2;
		else if (sign == '%') solution = num1 % num2;
		else if (sign == '^') solution = Math.pow(num1, num2);
		if (sign == '/' && num2 == 0) return this.say(con, room, 'You cannot divide by zero ;~;');
		this.say(con, room, num1 + ' ' + sign + ' ' + num2 + ' = ' + solution);
	},
	derive: function(arg, by, room, con) {
		var input = arg.replace(/ /g, '');
		var terms = input.split(/[+\-]+/);
		var signs = [];
		var inputArray = input.split('');
		for (var i in inputArray) if (inputArray[i] == '+' || inputArray[i] == '-') signs.push(inputArray[i]);
		for (var i in terms) {
			if (terms[i].indexOf('xsin(') > -1) {
				var base = parseInt(terms[i].substring(0, terms[i].indexOf('xsin(')));
				if (!base) var base = 1;
				var value = terms[i].substring(terms[i].indexOf('xsin(') + 5, terms[i].indexOf(')'));
				console.log(base);
				console.log(value);
				if (value.indexOf('x^') > -1) {
					var valueBase = parseInt(value.split('x^')[0]);
					if (!valueBase) var valueBase = 1;
					var valuePower = parseInt(value.split('x^')[1]);
					if (valuePower - 1 == 1) var newPower = '';
					else var newPower = '^' + valuePower - 1;
					terms[i] = base + '(xcos(' + value + ')(' + (valueBase * valuePower) + 'x' + newPower + ') + sin(' + value + '))';
				} else if (value.indexOf('x') > -1) {
					
					terms[i] = base + '(xcos(' + value + ')(' + (valueBase * valuePower) + 'x' + valueBase + ') + sin(' + value + '))';
				}
			} else if (terms[i].indexOf('sin(') > -1) {
				var value = terms[i].substring(4, terms[i].indexOf(')'));
				if (value.indexOf('x^') > -1) {
					var valueBase = parseInt(value.split('x^')[0]);
					if (!valueBase) var valueBase = 1;
					var valuePower = parseInt(value.split('x^')[1]);
					terms[i] = 'cos(' + value + ')(' + (valueBase * valuePower) + 'x^' + (valuePower - 1) + ')';
				} else if (value.indexOf('x') > -1) {
					var valueBase = parseInt(value.substring(0, value.indexOf('x')));
					terms[i] = 'cos(' + value + ')(' + valueBase + ')';
				} else if (value.indexOf('x') == -1) {
					terms.splice(i, 1);
					signs.splice(i, 1);
				}
			} else if (terms[i].indexOf('cos(') > -1) {
				var value = terms[i].substring(4, terms[i].indexOf(')'));
				if (value.indexOf('x^') > -1) {
					var valueBase = parseInt(value.split('x^')[0]);
					if (!valueBase) var valueBase = 1;
					var valuePower = parseInt(value.split('x^')[1]);
					terms[i] = 'sin(' + value + ')(' + (valueBase * valuePower) + 'x^' + (valuePower - 1) + ')';
					if (signs[i - 1] == '+') signs[i - 1] = '-';
					else if (signs[i - 1] == '-') signs[i - 1] = '+';
				} else if (value.indexOf('x') > -1) {
					var valueBase = parseInt(value.substring(0, value.indexOf('x')));
					terms[i] = 'sin(' + value + ')(' + valueBase + ')';
					if (signs[i - 1] == '+') signs[i - 1] = '-';
					else if (signs[i - 1] == '-') signs[i - 1] = '+';
				} else if (value.indexOf('x') == -1) {
					terms.splice(i, 1);
					signs.splice(i, 1);
				}
			} else if (terms[i].indexOf('x^') > -1) {
				var base = parseInt(terms[i].substring(0, terms[i].indexOf('x^')), 10);
				if (!base) var base = 1;
				var power = parseInt(terms[i].substring(terms[i].indexOf('x^') + 2, terms[i].length), 10);
				var newBase = base * power;
				var newPower = power - 1;
				if (newPower == 1) terms[i] = newBase + 'x';
				else terms[i] = newBase + 'x^' + newPower;
			} else if (terms[i].indexOf('x') > -1) {
				var newTerm = terms[i].substring(0, terms[i].indexOf('x'));
				if (!newTerm) var newTerm = 1;
				terms[i] = newTerm;
			} else if (terms[i].indexOf('x') == -1) {
				terms.splice(i, 1);
				signs.splice(i, 1);
			}
		}
		var equation = '';
		if (terms.length == 0) return this.say(con, room, 'f\'(x) = 0');
		for (var i in terms) {
			if (i == terms.length - 1) equation += terms[i];
			else equation += terms[i] + ' ' + signs[i] + ' ';
		}
		this.say(con, room, 'f\'(x) = ' + equation);
	},

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Move Effectivity //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////     
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////       	

	moveef: 'moveeffectiveness',
	ef: 'moveeffectiveness',
	moveeffectiveness: function(arg, by, room, con) {
		arg = arg.replace(/\s/g, '').toLowerCase().split(",");
		if (arg.length < 2) return this.say(con, room, '__Please input types to determine effectivity.__ ex: (#ef [atk type 1], [def type 1], [def type 2]).');
		var attacking = arg[0];
		var defending = arg[1].split(",");
		if (attacking in Movedex) {
			attacking = Movedex[attacking].type.toLowerCase();
		}
		if (defending[0] in Pokedex) {
			defending = Pokedex[defending[0]].type;
		}
		var types = {"normal":1,"fire":1,"water":1,"grass":1,"electric":1,"ice":1,"fighting":1,"poison":1,"ground":1,"flying":1,"psychic":1,"bug":1,"rock":1,"ghost":1,"dragon":1,"dark":1,"steel":1,"fairy":1};
		if (!(attacking in types) || !(defending[0] in types) || (defending[1] && !(defending[1] in types))) {
			return this.say(con, room, '__Please input a valid type!__');
		} else if (defending[1]) {
			var damage = Movedamage[attacking].damageDealt[defending[0]] * Movedamage[attacking].damageDealt[defending[1]];
			var msg = '';
			switch (damage) {
				case 0.25: msg += '__It\'s very very uneffective... rip__'; break;
				case 0.5: msg += '__It\'s not very effective... ;~;__'; break;
				case 1: msg += '__Normal effectivity__'; break;
				case 2: msg += '__It\'s super effective!__'; break;
				case 4: msg += '__It\'s super very effective!!__'; break;
			}
			this.say(con, room, msg);
		} else {
			var damage = Movedamage[attacking].damageDealt[defending[0]];
			var msg = '';
			switch (damage) {
				case 0.5: msg += '__It\'s not very effective... ;~;__'; break;
				case 1: msg += '__Normal effectivity__'; break;
				case 2: msg += '__It\'s super effective!__'; break;
				case 4: msg += '__It\'s super very effective!!__'; break;
			}
			this.say(con, room, msg);
		}
	},
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// osu! Room Commands ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////       

	desu: function(arg, by, room, con) {
		if (!this.hasRank(by, '+%@&#~') || room.charAt(0) === ',' || room !== 'osu') return false;
		this.say(con, room, 'kyaaaaa~');
	},
	blocko: function(arg, by, room, con) {
		if (!this.hasRank(by, '+%@&#~') || room.charAt(0) === ',' || room !== 'osu') return false;
		this.say(con, room, '(/*-*)/ (/*-*)/ ALL HAIL LORD BLOCKO \\(*-*\\) \\(*-*\\)');
	},
	users: function(arg, by, room, con) {
		if (room !== 'osu') return false;
		this.say(con, room, 'osu! room userlist: http://bit.ly/1xuzSBC');
	},
	osu: function(arg, by, room, con) {
		if (room !== 'osu') return false;
		this.say(con, room, 'osu! is a Japanese rhythm game where the player hits notes in time with the beat of the music. There are 5 different game modes, the most popular being standard osu! and osu! mania.');
	},
	setfavemap: function(arg, by, room, con) {
		var tarRoom = room;
		if (room !== 'osu') return false;
		if (!this.settings.favemap) this.settings.favemap = {};
		if (this.hasRank(by, '#~') && arg.split(", ").length !== 1) {
			if (!this.settings.favemap[tarRoom]) this.settings.favemap[tarRoom] = {};
			if (arg.split(", ").length !== 2) return this.say(con, room, 'Syntax is: #setfavemap [user], [link]');
			var user = toId(arg.split(", ")[0]);
			var link = arg.split(", ")[1];
		}
		else if (this.canUse('setfavemap', room, by)) {
			var link = arg;
			var user = toId(by);
		}
		else {
			return false;
		}
		if (!/https?:\/\//.test(link)) return this.say(con, room, 'Link must include http.');
		if (!this.settings.favemap[user]) this.settings.favemap[user] = {};
		this.settings.favemap[user]['link'] = link;
		this.writeSettings();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__Your favorite beatmap has been set!^-^__');
	},
	favemap: function(arg, by, room, con) {
		if (room !== 'osu') return false;
		if (this.canUse('favemap', room, by) || room.charAt(0) === ',') {
			var text = '';
		}
		else {
			var text = '/pm ' + by + ', ';
		}
		if (!arg) {
			if (this.settings.favemap[toId(by)]) {
				return this.say(con, room, text + by + '\'s favorite beatmap is ' + this.settings.favemap[toId(by)]['link'] + '!');
			}
			else {
				return this.say(con, room, '' + text + '__No favorite beatmap has been set ;-;__');
			}
		}
		var user = toId(arg);
		if (!this.settings.favemap[user]) return this.say(con, room, '__No favorite beatmap has been set ;-;__');
		var link = this.settings.favemap[user]['link'];
		this.say(con, room, text + arg + '\'s favorite is ' + link + '!');
	},
	user: function(arg, by, room, con, callback, error, output) {
		var osuCommand = arg.split(', ');
		var username = osuCommand[0];
		var modeType = osuCommand[1];
		if (room !== 'osu') return false;
		if (this.canUse('user', room, by)) {
			if (!modeType) {
				osu.setMode(osuapi.Modes.osu);
			}
			if (!osuCommand[0]) {
				this.say(con, room, 'Please specify an osu username.');
			}
			else if (osuCommand[0] == 'help') {
				this.say(con, room, 'This command shows the stats of a user. Syntax is #user [username]');
			}
			else {
				var self = this;
				osu.getUser(username, function(error, output) {
					var resObject = eval(output);
					var rank = resObject.pp_rank;
					var pp = ~~(resObject.pp_raw);
					var cRank = rank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					var cpp = pp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					var accLong = parseFloat(resObject.accuracy);
					var acc = accLong.toFixed(2);
					self.say(con, room, '**' + username + '**: Level: __' + ~~(resObject.level) + '__ Rank: __' + cRank + '__ Acc: __' + acc + '%__ pp: __' + cpp + '__ Country: __' + resObject.country + '__\nProfile: https://osu.ppy.sh/u/' + resObject.user_id);
				});
			}
		}
		else {
			return false;
		}
	},
	map: 'beatmap',
	beatmap: function(arg, by, room, con, callback, error, output) {
		var osuCommand = arg.split(', ');
		var id = osuCommand[0].substr(21, osuCommand[0].length);
		var modeType = osuCommand[1];
		if (room !== 'osu') return false;
		if (this.canUse('beatmap', room, by)) {
			if (!modeType) {
				osu.setMode(osuapi.Modes.osu);
			}
			if (!osuCommand[0]) {
				this.say(con, room, 'Please input a beatmap link.');
			}
			else if (osuCommand[0].length < 29) {
				this.say(con, room, 'Please input a __specific__ beatmap link (click on the difficulty).');
			}
			else if (osuCommand[0] == 'help') {
				this.say(con, room, 'This command shows the info of a beatmap. Syntax is #beatmap [link]');
			}
			else {
				var self = this;
				osu.getBeatmap(id, function(error, output) {
					var resObject = eval(output);
					var starsLong = parseFloat(resObject.difficultyrating);
					var stars = starsLong.toFixed(2);
					self.say(con, room, '| Stars: **6** | CS: **7** | AR: **8** | HP: **9** |');

					//		self.say(con, room, '**' + resObject.title + '** by ' + resObject.artist + ':\n| Stars: **' + stars + '** | CS: **' + resObject.diff_size + '** | AR: **' + resObject.diff_approach + '** | HP: **' + resObject.diff_drain + '** |');
				});
			}
		}
		else {
			return false;
		}
	},
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Anime and Manga Room Commands ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////       	
	
	setmal: function(arg, by, room, con) {
		var tarRoom = room;
		if (room !== 'animeandmanga') return false;
		if (!this.settings.mal) this.settings.mal = {};
		if (this.hasRank(by, '#~') && arg.split(", ").length !== 1) {
			if (!this.settings.mal[tarRoom]) this.settings.mal[tarRoom] = {};
			if (arg.split(", ").length !== 2) return this.say(con, room, 'Syntax is: #setmal [user], [link]');
			var user = toId(arg.split(", ")[0]);
			var link = arg.split(", ")[1];
		}
		else if (this.canUse('setmal', room, by)) {
			var link = arg;
			var user = toId(by);
		}
		else {
			return false;
		}
		if (!/https?:\/\//.test(link)) return this.say(con, room, 'Link must include http, __b-baka..!! ;~;__');
		if (!/myanimelist.net/.test(link)) return this.say(con, room, 'Link must be a MAL link! __b-baka..!! ;~;__');
		if (!this.settings.mal[user]) this.settings.mal[user] = {};
		this.settings.mal[user]['link'] = link;
		this.writeSettings();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__Your MAL has been set!^-^__');
	},
	mal: function(arg, by, room, con) {
		if (room !== 'animeandmanga') return false;
		if (this.canUse('mal', room, by) || room.charAt(0) === ',') {
			var text = '';
		}
		else {
			var text = '/pm ' + by + ', ';
		}
		if (!arg) {
			if (this.settings.mal[toId(by)]) {
				return this.say(con, room, text + by + '\'s MAL is ' + this.settings.mal[toId(by)]['link'] + '!');
			}
			else {
				return this.say(con, room, '' + text + '__No MAL has been set ;-;__');
			}
		}
		var user = toId(arg);
		if (!this.settings.mal[user]) return this.say(con, room, '__No MAL has been set ;-;__');
		var link = this.settings.mal[user]['link'];
		this.say(con, room, text + arg + '\'s MAL is ' + link + '!');
	},
	setfaveanime: function(arg, by, room, con) {
		var tarRoom = room;
		if (room !== 'animeandmanga') return false;
		if (!this.settings.faveanime) this.settings.faveanime = {};
		if (this.hasRank(by, '#~') && arg.split(", ").length !== 1) {
			if (!this.settings.faveanime[tarRoom]) this.settings.faveanime[tarRoom] = {};
			if (arg.split(", ").length !== 2) return this.say(con, room, 'Syntax is: #setfaveanime [user], [link]');
			var user = toId(arg.split(", ")[0]);
			var link = arg.split(", ")[1];
		}
		else if (this.canUse('setfaveanime', room, by)) {
			var link = arg;
			var user = toId(by);
		}
		else {
			return false;
		}
		if (/boku no pico/.test(link)) return this.say(con, room, 'l-lewd..!! ;~;');
		if (!this.settings.faveanime[user]) this.settings.faveanime[user] = {};
		this.settings.faveanime[user]['link'] = link;
		this.writeSettings();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__Your favorite anime has been set!^-^__');
	},
	faveanime: function(arg, by, room, con) {
		if (room !== 'animeandmanga') return false;
		if (this.canUse('faveanime', room, by) || room.charAt(0) === ',') {
			var text = '';
		}
		else {
			var text = '/pm ' + by + ', ';
		}
		if (!arg) {
			if (this.settings.faveanime[toId(by)]) {
				if (/http/.test(this.settings.faveanime[toId(by)]['link'])) return this.say(con, room, text + by + '\'s favorite anime is ' + this.settings.faveanime[toId(by)]['link'] + '!');
				else return this.say(con, room, text + by + '\'s favorite anime is __' + this.settings.faveanime[toId(by)]['link'] + '__!');
			}
			else {
				return this.say(con, room, '' + text + '__No favorite anime has been set ;-;__');
			}
		}
		var user = toId(arg);
		if (!this.settings.faveanime[user]) return this.say(con, room, '__No favorite anime has been set ;-;__');
		var link = this.settings.faveanime[user]['link'];
		if (/http/.test(link)) this.say(con, room, text + by + '\'s favorite anime is ' + link + '!');
		else this.say(con, room, text + arg + '\'s favorite anime is __' + link + '__!');
	},
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// MOBA Room Commands ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////       	
	
	/**
	 * ranked is a function that outputs the user's ranked stats
	 * 
	 * @param {String} name   - Username that you want to get data for
	 * @param {String} region - Region of the user that you want data for
	 * 
	 * @return {String}       - Returns wins and loses of a user in ranked games
	 */
	ranked: function(arg, by, room, con) {
		if (!this.hasRank(by, '+%@&#~')) return false;
		if (arg.indexOf(", ") == -1) {
			var name = toId(arg);
			var region = 'na';
			var season = '2015';
		} else if (arg.split(", ").length == 2) {
			var name = toId(arg.split(", ")[0]);
			var region = toId(arg.split(", ")[1]);
			var season = '2015';
		} else {
			var name = toId(arg.split(", ")[0]);
			var region = toId(arg.split(", ")[1]);
			var season = arg.split(", ")[2];
		}
		var self = this;
		LolApi.init('9596c295-4c9d-4895-b4b7-119e9848781c', region);
		LolApi.Summoner.getByName(name, region, function(err, summoner) {
			if (!err) {
			var id = summoner[name]["id"];
			LolApi.Stats.getPlayerSummary(id, season, function(err, stats) {
			    for (var i in stats) {
        			if (stats[i].playerStatSummaryType == "RankedSolo5x5") {
        				var rankedWins = stats[i].wins;
						var rankedLosses = stats[i].losses;
        			}
        		}
    		if (rankedWins == 0 && rankedLosses == 0) var rawWinRate = 0;
    		else var rawWinRate = (rankedWins / (rankedWins + rankedLosses)) * 100;
    		var winRate = rawWinRate.toFixed(2);
    		LolApi.getLeagueData(id, region, function(err, leagueData) {
    			if (!err) {
    				for (var i in leagueData[id][0]["entries"]) {
    					if (leagueData[id][0]["entries"][i]["playerOrTeamId"] == id) {
    						var division = ' ' + leagueData[id][0]["entries"][i]["division"];
    						var lp = leagueData[id][0]["entries"][i]["leaguePoints"];
    					}
    				}
					var tier = toId(leagueData[id][0].tier).capitalize();
					if (tier == 'Master' || tier == 'Challenger') division = '';
					self.say(con, room, '__Tier:__ **' + tier + division + '** | __LP:__ **' + lp + '**');
					self.say(con, room, '__Total Wins:__ **' + rankedWins + '** | __Total Losses:__ **' + rankedLosses + '** | __Win Rate:__ **' + winRate + '%**');
    			} else {
    				self.say(con, room, '__This user has no ranked data. ;-;__');
    			}
    			});
			});
		} else {
			return self.say(con, room, '__This user could not be found. ;-;__');
		}});
	},
	/**
	 * unranked is a function tha toutputs the user's unranked stats
	 * 
	 * @param {String} name   - Username that you want to get data for
	 * @param {String} region - Region of the user that you want data for
	 * 
	 * @return {String}       - Returns many stats of a user for all of the unranked games
	 */
	unranked: function(arg, by, room, con) {
		if (!this.hasRank(by, '+%@&#~')) return false;
		if (arg.indexOf(", ") == -1) {
			var name = toId(arg);
			var region = 'na';
			var season = '2015';
		} else if (arg.split(", ").length == 2) {
			var name = toId(arg.split(", ")[0]);
			var region = toId(arg.split(", ")[1]);
			var season = '2015';
		} else {
			var name = toId(arg.split(", ")[0]);
			var region = toId(arg.split(", ")[1]);
			var season = arg.split(", ")[2];
		}
		var self = this;
		LolApi.init('9596c295-4c9d-4895-b4b7-119e9848781c', region);
		LolApi.Summoner.getByName(name, region, function(err, summoner) {
			if (!err) {
			var id = summoner[name]["id"];
			LolApi.Stats.getPlayerSummary(id, season, function(err, stats) {
				for (var i in stats) {
        			if (stats[i].playerStatSummaryType == "Unranked") {
        				var unrankedWins = stats[i].wins;
						var unrankedKills = stats[i].aggregatedStats.totalChampionKills;
					if (unrankedKills == null) unrankedKills = '0';
					var unrankedAssists = stats[i].aggregatedStats.totalAssists;
					var unrankedCS = stats[i].aggregatedStats.totalMinionKills;
					var unrankedTurrets = stats[i].aggregatedStats.totalTurretsKilled;
					}
        		}
        		self.say(con, room, '__Total Kills:__ **' + unrankedKills + '** | __Total Wins:__ **' + unrankedWins + '** | __Total Assists:__ **' + unrankedAssists + '** | __Total CS:__ **' + unrankedCS + '** | __Total Turrets:__ **' + unrankedTurrets + '**');
		});
		} else {
			return self.say(con, room, '__This user could not be found. ;-;__');
		}});
	},
	/**
	 * freechamps is a function that returns the champions that are currently free in this week's rotation
	 * 
	 * @param {void}
	 * 
	 * @return {String} - Returns the free champs of the week
	 */
	freeweek: 'freechamps',
    freechamps: function(arg, by, room, con) {
        var names = [];
        var self = this;
    	LolApi.init('9596c295-4c9d-4895-b4b7-119e9848781c', 'na');
    	LolApi.getChampions(true, function(err, freeChamps) {
    		if (!err) {
    			for (var i in freeChamps) {
                    var id = freeChamps[i]["id"];
					LolApi.Static.getChampionById(id, "name", function(err, champ) {
						if (!err) {
							names.push(champ.name);
						}
            		});
    			}
        	}
    	});
    	if (names.length > 1) {
        setTimeout(function(){self.say(con, room, 'The free champs this week are: __' + names.join(', ') + '.__');},1500);
    	} else return this.say(con, room, '__There has been an error! ;~;__');
	},
	spectate: function(arg, by, room, con) {
		if (arg.indexOf(", ") == -1) {
			if (toId(arg) == 'help') return this.say(con, room, 'Command Syntax: #spectate: ``[username], [region]``. Paste the output into cmd in windows to start the spectator.');
			var name = toId(arg);
			var region = 'na';
		} else {
			var name = toId(arg.split(", ")[0]);
			var region = toId(arg.split(", ")[1]);
		}
		var regionDomain;
		var regionId;
		if (region == 'na') {
			regionDomain = 'spectator.na.lol.riotgames.com:80';
			regionId = 'NA1';
		} else if (region == 'euw') {
			regionDomain = 'spectator.euw1.lol.riotgames.com:80';
			regionId = 'EUW1';
		} else if (region == 'eune') {
			regionDomain = 'spectator.eu.lol.riotgames.com:8088';
			regionId = 'EUN1';
		} else if (region == 'kr') {
			regionDomain = 'spectator.kr.lol.riotgames.com:80';
			regionId = 'KR';
		} else if (region == 'oce') {
			regionDomain = 'spectator.oc1.lol.riotgames.com:80';
			regionId = 'OC1';
		} else if (region == 'br') {
			regionDomain = 'spectator.br.lol.riotgames.com:80';
			regionId = 'BR1';
		} else if (region == 'lan') {
			regionDomain = 'spectator.la1.lol.riotgames.com:80';
			regionId = 'LA1';
		} else if (region == 'las') {
			regionDomain = 'spectator.la2.lol.riotgames.com.com:80';
			regionId = 'LA2';
		} else if (region == 'ru') {
			regionDomain = 'spectator.ru.lol.riotgames.com:80';
			regionId = 'RU';
		} else if (region == 'tr') {
			regionDomain = 'spectator.tr.lol.riotgames.com:80';
			regionId = 'TR1';
		} else if (region == 'pbe') {
			regionDomain = 'spectator.pbe1.lol.riotgames.com:8080';
			regionId = 'PBE1';
		}
		var self = this;
		LolApi.init('9596c295-4c9d-4895-b4b7-119e9848781c', region);
		LolApi.Summoner.getByName(name, region, function(err, summoner) {
				var id = summoner[name]["id"];
				LolApi.getCurrentGame(id, region, function(err, game) {
					if (!err) {
						self.say(con, room, '/w mashirochan, __Copy all of this text and paste it into the command prompt:__ "C:\\Riot Games\\League of Legends\\RADS\\solutions\\lol_game_client_sln\\releases\\0.0.1.74\\deploy\\League of Legends.exe" "8394" "LoLLauncher.exe" "" "spectator ' + regionDomain + ' ' + game.observers.encryptionKey + ' ' + game.gameId + ' ' + regionId + '"');
					}
					else self.say(con, room, '__This user is not currently in a game. ;-;__');	
					});
		});
	},
	/**
	 * gameinfo is a function that returns info the the game that a user is currently in
	 * 
	 * @param {String} name   - Username that you want to get data for
	 * @param {String} region - The region of the user that you want to get data for
	 * 
	 * @return {String}       - Returns picks and bans of the game that the user is in
	 */
	gameinfo: function(arg, by, room, con) {
		var name = toId(arg.split(", ")[0]);
		var region = arg.split(", ")[1];
		var self = this;
		LolApi.init('9596c295-4c9d-4895-b4b7-119e9848781c', region);
		LolApi.Summoner.getByName(name, region, function(err, summoner) {
			try {
				var id = summoner[name]["id"];
				LolApi.getCurrentGame(id, region, function(err, game) {
					var blueChamps = [];
					var redChamps = [];
					var blueBans = [];
					var redBans = [];
					function uniq(a) {
   						var seen = {};
   						return a.filter(function(item) {
							return seen.hasOwnProperty(item) ? false : (seen[item] = true);
   						});
					}
					for (var i = 0; i < game.participants.length; i++) {
						var champName = '';
						for (var champ in leagueChamps.champs) {
							if (game.participants[i]["championId"] == leagueChamps.champs[champ]["id"]) {
								champName = leagueChamps.champs[champ]["name"];
							}
						}
						if (game.participants[i]["teamId"] == 100) {
							redChamps.push(' __' + game.participants[i]["summonerName"] + '__: **' + champName + '**');
						} else {
							blueChamps.push(' __' + game.participants[i]["summonerName"] + '__: **' + champName + '**');
						}
					}
					for (var j in game.bannedChampions) {
						var champName = '';
						for (var champ in leagueChamps.champs) {
							if (game.bannedChampions[j]["championId"] == leagueChamps.champs[champ]["id"]) {
								champName = leagueChamps.champs[champ]["name"];
							}
						}
						if (game.bannedChampions[j]["teamId"] == 100) {
							redBans.push(' __' + champName + '__');
						} else {
							blueBans.push(' __' + champName + '__');
						}
					}
					self.say(con, room, 'Blue Team: (Bans)' + blueBans + '\n' + blueChamps);
					self.say(con, room, 'Red Team: (Bans)' + redBans + '\n' + redChamps);
				});
			} catch(e) {
				if(e) {
					self.say(con, room, '__That user is not in a game. ;-;__');
				}
			}
	});
	},
	history: function(arg, by, room, con) {
		if (!arg || arg.split(", ").length > 3) return this.say(con, room, '__Correct syntax:__ #history ``[summoner name], [champ name]``');
		var self = this;
		if (arg.split(", ").length == 2) {
			var user = arg.split(", ")[0];
			var region = arg.split(", ")[1];
			console.log("User: '" + user + "'");
			console.log("Region: '" + region + "'");
			LolApi.init('9596c295-4c9d-4895-b4b7-119e9848781c', region);
			LolApi.Summoner.getByName(user, region, function(err, summoner) {
				if (!err) {
					var id = summoner[user]["id"];
					console.log("User ID: " + id);
					LolApi.getMatchHistory(id, region, function(err, match) {
						var lane = match["matches"][0]["participants"][0]["timeline"]["lane"];
						var champId = match["matches"][0]["participants"][0]["championId"];
						var kills = match["matches"][0]["participants"][0]["stats"]["kills"];
						var deaths = match["matches"][0]["participants"][0]["stats"]["deaths"];
						var assists = match["matches"][0]["participants"][0]["stats"]["assists"];
						var winner = '';
						if (match["matches"][0]["participants"][0]["stats"]["winner"] == 'true') winner = 'Loss';
						else winner = 'Win';
						for (var i in leagueChamps["champs"]) {
							if (leagueChamps["champs"][i]["id"] == champId) var champ = leagueChamps["champs"][i]["name"];
						}
						if (lane == 'MIDDLE') lane = 'MID';
						console.log('ChampID: ' + champId);
						console.log('Champ: ' + champ);
						console.log('Lane: ' + toId(lane).capitalize());
						console.log('KDA: ' + kills + '/' + deaths + '/' + assists);
						console.log(winner);
					});
				} else return self.say(con, room, '__There has been an error getting user id! ;~;__');
			});
		} else if (arg.split(", ").length == 3) {
			
		} else return this.say(con, room, '__There has been an error! ;~;__');
	},
	/**
	 * champsearch is a function that searches through all champions found in an included js file
	 * and outputs all champs that meet the criteria that is input by the user
	 * 
	 * @param {String} parameter - What data user wants to search through
	 * @param {String} sign      - How the user wants to search through the data
	 * @param {int or String}    - What value to start at for the search
	 * 
	 * @return {String}          - Returns any champs that meet the input criteria
	 */
	cs: 'champsearch',
	champsearch: function (arg, by, room, con) {
		if (!arg || arg.indexOf(" ") == -1 || arg.split(" ").length < 3) return this.say(con, room, '__Correct syntax:__ #champsearch ``[parameter] [sign] [value]``');
		var target = arg.split(" ");
		var parameter = target[0];
		if (leagueChamps.parameters.indexOf(parameter) < 0) return this.say(con, room, "__Please use a valid parameter!__ (hp, armor, movespeed, etc.)");
		var sign = target[1];
		if (sign.indexOf('>') < 0 && sign.indexOf('=') < 0 && sign.indexOf('<') < 0) return this.say(con, room, "__Please use a valid sign!__ (>, =, <)");
		var value;
		if (target[2].indexOf([0-9]) < 0) value = toId(target[2]); 
		else value = parseInt(target[2], 10);
		if (!(hasNum.test(value) || leagueChamps.roles.indexOf(value) > 0)) return this.say(con, room, "__Please use a valid value!__");
		var champList = [];
		if (parameter == 'role' || parameter == 'roles') {
			for (var i in leagueChamps.champs) {
				if (leagueChamps.champs[i]["tags"][0] == value.capitalize()) champList.push(' __' + leagueChamps.champs[i]["name"] + '__');
			}
		} else if (parameter == 'health') {
			parameter = 'hp';
		} else if (parameter == 'mana') {
			parameter = 'mp';
		} else if (parameter == 'ad') {
			parameter = 'attackdamage';
		}
		for (var i in leagueChamps.champs) {
			if (sign == '<' && leagueChamps.champs[i][parameter] < value) champList.push(' __' + leagueChamps.champs[i]["name"] + '__');
			else if (sign == '=' && leagueChamps.champs[i][parameter] == value) champList.push(' __' + leagueChamps.champs[i]["name"] + '__');
			else if (sign == '>' && leagueChamps.champs[i][parameter] > value) champList.push(' __' + leagueChamps.champs[i]["name"] + '__');
		}
		if (champList.length < 1) return this.say(con, room, '__No champs with the criteria could be found. ;-;__');
		if (champList.length == 1) return this.say(con, room, 'Champ meeting criteria:' + champList);
		if (champList.length == 2) {
			var lastChamp = champList[1];
			var newlastChamp = lastChamp.replace(/_/g, "").replace(/ /g, "");
			champList.splice(1, 1);
			champList[0] += ' __and ' + newlastChamp + '__';
			return this.say(con, room, 'Champs meeting criteria:' + champList);
		} else {
			var listLength = champList.length - 1;
			var lastChamp = champList[listLength];
			var newlastChamp = lastChamp.replace(/_/g, "");
			champList.splice(listLength, 1);
			newlastChamp = ' __and ' + newlastChamp + '__';
			champList.push(newlastChamp);
			return this.say(con, room, 'Champs meeting criteria:' + champList);
		}
	},
	/**
	 * itemsearch is a function that searches through all items found in an included js file
	 * and outputs all items that meet the criteria that is input by the user
	 * 
	 * @param {String} parameter - What data user wants to search through
	 * @param {String} sign      - How the user wants to search through the data
	 * @param {int} value        - What value to start at for the search
	 * 
	 * @return {String}          - Returns any items that meet the input criteria
	 */
	is: 'itemsearch',
	itemsearch: function (arg, by, room, con) {
		if (!arg || arg.indexOf(" ") == -1 || arg.split(" ").length < 3) return this.say(con, room, '__Correct syntax:__ #itemsearch ``[parameter] [sign] [value]``');
		var target = arg.split(" ");
		var parameter = target[0];
		if (leagueItems.parameters.indexOf(parameter) < 0) return this.say(con, room, "__Please use a valid parameter!__ (ad, crit, lifesteal, etc.)");
		var sign = target[1];
		if (sign.indexOf('>') < 0 && sign.indexOf('=') < 0 && sign.indexOf('<') < 0) return this.say(con, room, "__Please use a valid sign!__ (>, =, <)");
		var value = parseFloat(target[2]);
		if (!(hasNum.test(value))) return this.say(con, room, "__Please use numerical values only!__");
		var itemList = [];
		if (parameter == 'cost' || parameter == 'price') {
			for (var i in leagueItems.items) {
				if (sign == '<' && leagueItems.items[i]["gold"]["total"] < value) itemList.push(' __' + leagueItems.items[i]["name"] + '__');
				else if (sign == '=' && leagueItems.items[i]["gold"]["total"] == value) itemList.push(' __' + leagueItems.items[i]["name"] + '__');
				else if (sign == '>' && leagueItems.items[i]["gold"]["total"] > value) itemList.push(' __' + leagueItems.items[i]["name"] + '__');
			}
		} else if (parameter == 'sell' || parameter == 'sellprice') {
			for (var i in leagueItems.items) {
				if (sign == '<' && leagueItems.items[i]["gold"]["sell"] < value) itemList.push(' __' + leagueItems.items[i]["name"] + '__');
				else if (sign == '=' && leagueItems.items[i]["gold"]["sell"] == value) itemList.push(' __' + leagueItems.items[i]["name"] + '__');
				else if (sign == '>' && leagueItems.items[i]["gold"]["sell"] > value) itemList.push(' __' + leagueItems.items[i]["name"] + '__');
			}
		} else {
			if (parameter == 'health') {
				parameter = 'hp';
			} else if (parameter == 'attackdamage') {
				parameter = 'ad';
			} else if(parameter == 'mana') {
				parameter = 'mp';
			} else if (parameter == 'abilitypower') {
				parameter = 'ap';
			} else if (parameter == 'critchance' || parameter == 'crit') {
				parameter = 'crit';
				value /= 100.0;
			} else if (parameter == 'as' || parameter == 'attackspeed') {
				parameter = 'attackspeed';
				value /= 100.0;
			} else if (parameter == 'ms' || parameter == 'movementspeed' || parameter == 'movespeed') {
				parameter = 'movespeed';
				value /= 100.0;
			} else if (parameter == 'fms' || parameter == 'flatmovementspeed') {
				parameter = 'flatmovespeed';
			} else if (parameter == 'cdr' || parameter == 'cooldownreduction') {
				parameter = 'cdr';
				value /= 100.0;
			}
			for (var i in leagueItems.items) {
				if (sign == '<' && leagueItems.items[i]["stats"][parameter] < value) itemList.push(' __' + leagueItems.items[i]["name"] + '__');
				else if (sign == '=' && leagueItems.items[i]["stats"][parameter] == value) itemList.push(' __' + leagueItems.items[i]["name"] + '__');
				else if (sign == '>' && leagueItems.items[i]["stats"][parameter] > value) itemList.push(' __' + leagueItems.items[i]["name"] + '__');
			}
		}
		if (itemList.length < 1) return this.say(con, room, '__No items with the criteria could be found. ;-;__');
		else return this.say(con, room, 'Items meeting criteria:' + itemList);
	},
	/**
	 * champion is a function that outputs data for a specific champion in League of legends
	 * 
	 * @param {String} arg - What champion to look up data for 
	 * 
	 * @return {String}    - Returns basic data about the specified champion
	 */
	champ: 'champion',
	hero: 'champion',
	god: 'champion',
	champion: function(arg, by, room, con) {
		if (!this.hasRank(by, '+%@&#~')) return false;
		var input = arg.split(" ");
		var champName = toId(input[1]).capitalize();
		var inChamps = false;
		for (var i in leagueChamps.champs) {
			if (champName == leagueChamps.champs[i]) inChamps = true;
		}
		if (input[0] == 'info' || input[0] == 'overview') {
			if (inChamps == false) return this.say(con, room, '__The champ could not be found!__');
			if (leagueChamps.champs[champName].tags.length > 1) leagueChamps.champs[champName].tags[1] = " " + leagueChamps.champs[champName].tags[1];
			this.say(con, room, '**' + leagueChamps.champs[champName].name + '** - __' + leagueChamps.champs[champName].title + '__');
			this.say(con, room, '__Role:__ **' + leagueChamps.champs[champName].tags + '** | __AD:__ **' + leagueChamps.champs[champName]["attack"] + '** | __AP:__ **' + leagueChamps.champs[champName]["magic"] + '** | __Def:__ **' + leagueChamps.champs[champName]["defense"] + '** | __Dif:__ **' + leagueChamps.champs[champName]["difficulty"] + '**');
		} else if (input[0] == 'stats') {
			if (inChamps == false) return this.say(con, room, '__The champ could not be found!__');
			var attackSpeed = toAttackSpeed(leagueChamps.champs[champName]["attackspeedoffset"]);
			var mana;
			if (leagueChamps.champs[champName]["mp"] == 0.0) mana = 'None';
			else mana = Math.round(leagueChamps.champs[champName]["mp"]);
			this.say(con, room, '**' + leagueChamps.champs[champName].name + '** - __' + leagueChamps.champs[champName].title + '__');
			this.say(con, room, '__Health:__ **' + Math.round(leagueChamps.champs[champName]["hp"]) + '** | __Mana:__ **' + mana + '** | __AD:__ **' + Math.round(leagueChamps.champs[champName]["attackdamage"]) + '** | __Armor:__ **' + Math.round(leagueChamps.champs[champName]["armor"]) + '** | __MR:__ **' + Math.round(leagueChamps.champs[champName]["magicresist"]) + '** | __Movespeed:__ **' + leagueChamps.champs[champName]["movespeed"] + '** | __Attack Range:__ **' + leagueChamps.champs[champName]["attackrange"] + '** | __Attack Speed:__ **' + attackSpeed + '**');
		} else if (input[0] == 'abilities' || input[0] == 'spells' || input[0] == 'moves' || input[0] == 'skills') {
			if (inChamps == false) return this.say(con, room, '__The champ could not be found!__');
			this.say(con, room, '__This command will be comming soon, sorry! ;~;__');
		} else return this.say(con, room, 'Command syntax: #champion ``[info]|[stats]|[abilities] [champ name]``');
	},
	/**
	 * item is a function that outputs data for a specific item in League of Legends
	 * 
	 * @param {String} name - What item to look up data for
	 * 
	 * @return {String}     - Returns basic data about the specified item
	 */
	item: function(arg, by, room, con) {
		if (!this.hasRank(by, '+%@&#~')) return false;
		var input = arg.split(" ");
		if (input.length > 2) {
			var newInput = '';
			for (var i = 1; i < input.length; i++) {
				newInput += input[i];
			}
			newInput.replace(" ", "");
			input[1] = newInput;
		}
		var itemName = toId(input[1]);
		if (getItemId(itemName) == false) return this.say(con, room, '__The item could not be found!__');
		else var itemId = getItemId(itemName);
		if (input[0] == 'info' || input [0] == 'stats') {
			var itemStats = [];
			for (var i in leagueItems.items[itemId]["stats"]) {
				if (i == 'crit') {
					var value = leagueItems.items[itemId]["stats"][i];
					value *= 100;
					itemStats += ('+' + value + '% Crit Chance, ');
				} else if (i == 'attackspeed') {
					var value = leagueItems.items[itemId]["stats"][i];
					value *= 100;
					itemStats += ('+' + value + '% Attack Speed, ');
				} else if (i == 'movespeed') {
					var value = leagueItems.items[itemId]["stats"][i];
					value *= 100;
					itemStats += ('+' + value + '% Movement Speed, ');
				} else if (i == 'FlatMPRegenMod') {
					var value = leagueItems.items[itemId]["stats"][i];
					value *= 100;
					itemStats += ('+' + value + '% Mana Regen, ');
				} else if (i == 'FlatHPRegenMod') {
					var value = leagueItems.items[itemId]["stats"][i];
					value *= 100;
					itemStats += ('+' + value + '% Health Regen, ');
				} else if (i == 'lifesteal') {
					var value = leagueItems.items[itemId]["stats"][i];
					value *= 100;
					itemStats += ('+' + value + '% Lifesteal, ');
				} else if (i == 'cdr') {
					var value = leagueItems.items[itemId]["stats"][i];
					value *= 100;
					itemStats += ('+' + value + '% Cooldown Reduction, ');
				} else if (i == 'armorpen') {
					var value = leagueItems.items[itemId]["stats"][i];
					value *= 100;
					itemStats += ('+' + value + '% Armor Penetration, ');
				} else if (i == 'hpbonus') {
					var value = leagueItems.items[itemId]["stats"][i];
					value *= 100;
					itemStats += ('+' + value + '% Bonus Health, ');
				} else if (i == 'hp') {
					itemStats += ('+' + leagueItems.items[itemId]["stats"][i] + ' Health, ');
				} else if (i == 'mp') {
					itemStats += ('+' + leagueItems.items[itemId]["stats"][i] + ' Mana, ');
				} else if (i == 'ad') {
					itemStats += ('+' + leagueItems.items[itemId]["stats"][i] + ' AD, ');
				} else if (i == 'ap') {
					itemStats += ('+' + leagueItems.items[itemId]["stats"][i] + ' AP, ');
				} else if (i == 'armor') {
					itemStats += ('+' + leagueItems.items[itemId]["stats"][i] + ' Armor, ');
				} else if (i == 'mr') {
					itemStats += ('+' + leagueItems.items[itemId]["stats"][i] + ' Magic Resist, ');
				} else if (i == 'flatmovespeed') {
					itemStats += ('+' + leagueItems.items[itemId]["stats"][i] + ' Movement Speed, ');
				} else if (i == 'flatarmorpen') {
					itemStats += ('+' + leagueItems.items[itemId]["stats"][i] + ' Armor Penetration, ');
				} else {
					itemStats += ('+' + leagueItems.items[itemId]["stats"][i] + ' ' + i + ', ');
				}
			}
			if (itemStats.length == 0) return this.say(con, room, '__An error has occurred. ;-;__')
			itemStats = itemStats.substring(0, itemStats.length - 2);
			this.say(con, room, '**' + leagueItems.items[itemId]["name"] + '** - __' + leagueItems.items[itemId]["gold"]["total"] + 'g__');
			this.say(con, room, itemStats);
		} else if (input[0] == 'recipe' || input[0] == 'build') {
			if (!leagueItems.items[itemId]["from"]) return this.say(con, room, '__This item does not build from anything. ;-;__');
			var recipeItems = [];
			var recipePrices = '';
			for (var i in leagueItems.items[itemId]["from"]) {
				var id = leagueItems.items[itemId]["from"][i];
				recipeItems.push(' __' + leagueItems.items[id]["name"] + '__');
				recipePrices += leagueItems.items[id]["gold"]["total"] + 'g + ';
			}
			this.say(con, room, '**' + leagueItems.items[itemId]["name"] + '** - ' + recipeItems);
			this.say(con, room, recipePrices + leagueItems.items[itemId]["gold"]["base"] + 'g = **' + leagueItems.items[itemId]["gold"]["total"] + 'g**');
			this.say(con, room, '__Resell value: ' + leagueItems.items[itemId]["gold"]["sell"] + 'g__');
		} else if (input[0] == 'efficiency' || input[0] == 'value') {
			var multipliers = {"hp":2.666,"mp":2,"ad":36,"ap":21.75,"armor":20,"mr":20,"flatmovespeed":13,"flatarmorpen":12,"crit":50,"attackspeed":30,"movespeed":39.5,"lifesteal":55,"cdr":31.7,"armorpen":24.6,"FlatMPRegenMod":3.6,"FlatHPRegenMod":7.2};
			var statValue = 0;
			for (var i in leagueItems.items[itemId]["stats"]) {
				if (i == 'crit' || i == 'cdr' || i == 'lifesteal' || i == 'attackspeed' || i == 'movespeed' || i == 'armorpen' || i == 'FlatMPRegenMod' || i == 'FlatHPRegenMod') {
					statValue += leagueItems.items[itemId]["stats"][i] * multipliers[i] * 100;
				} else {
					statValue += leagueItems.items[itemId]["stats"][i] * multipliers[i];
				}
			}
			this.say(con, room, '**' + leagueItems.items[itemId]["name"] + '**');
			this.say(con, room, '__Cost:__ ' + leagueItems.items[itemId]["gold"]["total"] + ' | __Stat Value:__ ' + statValue + ' | __Gold Efficiency:__ **' + (Math.round(statValue / leagueItems.items[itemId]["gold"]["total"] * 100) + '%**'));
		} else return this.say(con, room, 'Command syntax: #item ``[info]|[recipe]|[efficiency] [item name]``');
	},
	/**
	 * trivia is a function that initiates a round of a League of Legends themed trivia game
	 * 
	 * @param {String} arg - Anything that is input after #trivia 
	 * 
	 * @return {boolean}   - Returns false if arg is "off"
	 * @return {String}    - Returns user wins if arg is a username
	 * @return {boolean}   - Returns true if no arg
	 */
	trivia: function(arg, by, room, con) {
		if (toId(arg) == 'off' || toId(arg) == 'end') {
			if (!this.hasRank(by, '@&#~')) return false;
			this.say(con, room, '__Trivia session has been aborted!__');
			triviaActive = false;
		} else if (arg) {
			if (!this.scores[toId(arg)]) return this.say(con, room, '__This user has not won any games yet ;-;__');
			if (this.scores[toId(arg)] == 1) return this.say(con, room, arg + ' has won ' + this.scores[toId(arg)] + ' game!^-^');
			if (this.scores[toId(arg)] > 1) return this.say(con, room, arg + ' has won ' + this.scores[toId(arg)] + ' games!^-^');
		} else {
			if (!this.hasRank(by, '@&#~')) return false;
			questionCounter = Math.round(Math.random() * Object.keys(Trivia).length);
			var self = this;
			participants.length = 0;
			triviaActive = true;
			this.say(con, room, '**New trivia round is now starting**, good luck everyone!^-^');
			setTimeout(function(){self.say(con, room, '**First Question!** ' + Trivia[questionCounter].question);}, 3000);
		}
	},
	setsong: function(arg, by, room, con) {
		if (toId(by) !== 'gymleaderteemo' && !this.hasRank(by, '#&~')) return false;
		if (!this.settings) this.settings = {};
		if (!this.settings["song"]) this.settings["song"] = {};
		if (arg.indexOf(", ") == -1) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + 'Command syntax: #setsong ``[name], [link]``');
		var input = arg.split(", ");
		this.settings["song"]["name"] = input[0];
		this.settings["song"]["link"] = input[1];
		this.writeSettings();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__The Song of the Day has been set!^-^__');
	},
	sotd: 'song',
	song: function(arg, by, room, con) {
		this.say(con, room, 'The Song of the Day is: __' + this.settings["song"]["name"] + '__');
		this.say(con, room, 'Link: ' + this.settings["song"]["link"]);
	},
	setvideo: function(arg, by, room, con) {
		if (toId(by) !== 'gymleaderteemo' && !this.hasRank(by, '#&~')) return false;
		if (!this.settings) this.settings = {};
		if (!this.settings["video"]) this.settings["video"] = {};
		if (arg.indexOf(", ") == -1) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + 'Command syntax: #setvideo ``[name], [link]``');
		var input = arg.split(", ");
		this.settings["video"]["name"] = input[0];
		this.settings["video"]["link"] = input[1];
		this.writeSettings();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__The Video of the Day has been set!^-^__');
	},
	votd: 'video',
	video: function(arg, by, room, con) {
		this.say(con, room, 'The Video of the Day is: __' + this.settings["video"]["name"] + '__');
		this.say(con, room, 'Link: ' + this.settings["video"]["link"]);
	},
	setguide: function(arg, by, room, con) {
		if (toId(by) !== 'gymleaderteemo' && !this.hasRank(by, '#&~')) return false;
		if (!this.settings) this.settings = {};
		if (!this.settings["guide"]) this.settings["guide"] = {};
		if (arg.indexOf(", ") == -1) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + 'Command syntax: #setguide ``[name], [link]``');
		var input = arg.split(", ");
		this.settings["guide"]["name"] = input[0];
		this.settings["guide"]["link"] = input[1];
		this.writeSettings();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__The Guide of the Day has been set!^-^__');
	},
	gotd: 'guide',
	guide: function(arg, by, room, con) {
		this.say(con, room, 'The Guide of the Day is: __' + this.settings["guide"]["name"] + '__');
		this.say(con, room, 'Link: ' + this.settings["guide"]["link"]);
	},
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Changelog /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////       	
/*
5-7-2015	
Mashiro-chan: 
-Got #champsearch up and running!
-Added checks for #champsearch input
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
5-8-2015    
Mashiro-chan: 
-Added new parameters to #champsearch as well as new vaules
-Added additional checks for new #champsearch parameters and values
-Begin work on leagueItems.js formatting
*/
