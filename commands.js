var http = require('http');
var sys = require('sys');
var osuapi = require('osu-api');
var osu = new osuapi.Api('d71c2876656c6fcbd2e0456a7410272208360a5d');
var LolApi = require('leagueapi');
var request = require('request');

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
		var text = '';
		if (!this.hasRank(by, '+%@#~')) text += ('/w ' + toId(by) + ', ');
		this.say(con, room, text + '__MashiBot__ source code: ' + config.fork);
	},
	shell: 'botshell',
	botshell: function(arg, by, room, con) {
		var text = '';
		if (!this.hasRank(by, '+%@#~')) text += ('/w ' + toId(by) + ', ');
		this.say(con, room, text + 'Mashiro-chan\'s Bot Shell Code: ' + config.botshell);
	},
	guide: 'commands',
	help: 'commands',
	commands: function(arg, by, room, con) {
		var text = '';
		if (!this.hasRank(by, '+%@#~')) text += ('/w ' + toId(by) + ', ');
		this.say(con, room, text + 'Commands for MashiBot: ' + config.botguide);
	},
	about: function(arg, by, room, con) {
		var text = '';
		if (!this.hasRank(by, '@#~')) text += ('/w ' + toId(by) + ', ');
		this.say(con, room, text + '__MashiBot__ is a bot that was created by Mashiro with the use of code from boTTT and Art2D2. Thanks to their respective owners for the help, I\'m a nub so I couldn\'t have done it without them o3o');
	},

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Developer commands ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

	reload: 'update',
	update: function(arg, by, room, con) {
		if (!this.hasRank(by, '~')) return false;
		try {
			this.uncacheTree('./commands.js');
			Commands = require('./commands.js').commands;
			this.say(con, room, '__Commands updated^-^__');
		}
		catch (e) {
			error('failed to update: ' + sys.inspect(e));
		}

	},
	join: function(arg, by, room, con) {
		if (!this.hasRank(by, '~')) return false;
		this.say(con, room, '/join ' + arg);
	},
	leave: function(arg, by, room, con) {
		if (!this.hasRank(by, '~')) return false;
		if (!arg) arg = room;
		this.say(con, arg, '/leave');
	},
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
	custom: 'say',
	say: function(arg, by, room, con) {
		if (toId(by) !== 'mashirochan') return false;
		if (arg.indexOf(", ") == -1) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__No room has been specified!__');
		var input = arg.split(", ");
		var tarRoom = input[0];
		var message = input[1];
		this.say(con, tarRoom, message);
	},
	java: 'js',
	code: 'js',
	js: function(arg, by, room, con) {
		if (!this.hasRank(by, '#~')) return false;
		try {
			var result = eval(arg.trim());
		}
		catch (e) {
			this.say(con, room, e.name + ": " + e.message);
		}
	},
	avatar: function(arg, by, room, con) {
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
	twitch: 'stream',
	stream: function(arg, by, room, con) {
		var text = '';
		if (!this.hasRank(by, '+%@#&~')) text += ('/w ' + toId(by) + ', ');
		this.say(con, room, text + 'Mashiro-chan\'s Twitch stream can be found at: twitch.tv/leinfiniti');
	},

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// These commands have been hidden! //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Moderation commands ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

	rk: 'roomkick',
	roomkick: function(arg, by, room, con) {
		if (!(CDchecker.roomkick !== 1)) return false;
		if (!this.hasRank(by, '@#&~')) return false;
		CDchecker.roomkick = 1;
		this.say(room, '/roomban ' + arg);
		this.say(con, room, '/unroomban ' + arg);
		this.say(con, room, '/modnote ' + arg + ' has been roomkick\'ed by ' + by + '.');
		setTimeout(function() {
			CDchecker.roomkick = 0;
		}, CDtime.roomkick * 1000);
	},
	set: function(arg, by, room, con) {
		if (!this.hasRank(by, '#~')) return false;

		var settable = {
			setfavemon: 1,
			favemon: 1,
			setselfie: 1,
			selfie: 1,
			setfavemap: 1,
			favemap: 1,
			setquote: 1,
			quote: 1,
			moderation: 1,
			say: 1,
			warn: 1,
			senpai: 1,
			kitty: 1,
			cri: 1,
			roomkick: 1,
			shorten: 1,
			runtour: 1,
			tourdq: 1,
			banword: 1,
			unbanword: 1,
			viewbannedwords: 1,
			js: 1,
			moveeffectiveness: 1,
			ranked: 1,
			unranked: 1,
			freechamps: 1,
			gameinfo: 1,
			history: 1,
			champsearch: 1,
			itemsearch: 1,
			champion: 1,
			item: 1,
			score: 1,
			cast: 1,
			plot: 1,
			awards: 1,
			info: 1,
			writers: 1,
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
			if (!opts[1] || !toId(opts[1]) || !(toId(opts[1]) in modOpts)) return this.say(con, room, 'Incorrect command: correct syntax is #set mod, [' +
				Object.keys(modOpts).join('/') + '](, [on/off])');

			if (!this.settings['modding']) this.settings['modding'] = {};
			if (!this.settings['modding'][room]) this.settings['modding'][room] = {};
			if (opts[2] && toId(opts[2])) {
				if (!this.hasRank(by, '#~')) return false;
				if (!(toId(opts[2]) in {
						on: 1,
						off: 1
					})) return this.say(con, room, 'Incorrect command: correct syntax is #set mod, [' +
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
				if (!this.settings["set"]) this.settings["set"] = {};
				if (!this.settings["set"][cmd] && this.settings["set"][cmd] !== false) {
					msg = '#' + cmd + ' is available for users of rank ' + ((cmd === 'autoban' || cmd === 'banword') ? '#' : config.defaultrank) + ' and above.';
				}
				else if (this.settings["set"][cmd] in settingsLevels) {
					msg = '#' + cmd + ' is available for users of rank ' + this.settings["set"][cmd] + ' and above.';
				}
				else if (this.settings["set"][cmd] === true) {
					msg = '#' + cmd + ' is available for all users.';
				}
				else if (this.settings["set"][cmd] === false) {
					msg = '#' + cmd + ' is not available for use.';
				}
				this.say(con, room, msg);
				return;
			}
			else {
				if (!this.hasRank(by, '#~')) return false;
				var newRank = opts[1].trim();
				if (!(newRank in settingsLevels)) return this.say(con, room, 'Unknown option: "' + newRank + '". Valid settings are: off/disable, +, %, @, &, #, ~, on/enable.');
				if (!this.settings["set"]) this.settings["set"] = {};
				if (!this.settings["set"][cmd]) this.settings["set"][cmd] = {};
				this.settings["set"][cmd] = settingsLevels[newRank];
				this.writeSettings();
				this.say(con, room, 'The command #' + cmd + ' is now ' +
					(settingsLevels[newRank] === newRank ? ' available for users of rank ' + newRank + ' and above.' :
						(this.settings["set"][cmd] ? 'available for all users.' : 'unavailable for use.')));
			}
		}
	},
	ab: 'blacklist',
	autoban: 'blacklist',
	blacklist: function(arg, by, room, con) {
		if (!this.hasRank(by, '@#&~')) return false;
		if (!this.userlog) this.userlog = {};
		if (!arg || arg.length > 18) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__A username must be input!__');
		var user = toId(arg);
		if (this.userlog[user] && this.userlog[user]["bl"] && this.userlog[user]["bl"] == true) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__This user is already in the blacklist!__');
		if (!this.userlog[user]) this.userlog[user] = {};
		this.userlog[user]["bl"] = true;
		this.writeUserlog();
		this.say(con, room, 'User \"' + arg + '\" has been added to the blacklist!');
	},
	unab: 'unblacklist',
	unautoban: 'unblacklist',
	unblacklist: function(arg, by, room, con) {
		if (!this.hasRank(by, '@#&~')) return false;
		if (!this.userlog) this.userlog = {};
		if (!arg || arg.length > 18) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__A username must be input!__');
		var user = toId(arg);
		if (this.userlog[user] && this.userlog[user]["bl"] && this.userlog[user]["bl"] == false) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__This user is not in the blacklist!__');
		if (!this.userlog[user]) this.userlog[user] = {};
		this.userlog[user]["bl"] = false;
		this.writeUserlog();
		this.say(con, room, 'User \"' + arg + '\" has been removed from the blacklist!');
	},
	banphrase: 'banword',
	banword: function(arg, by, room, con) {
		if (!this.hasRank(by, '@#&~')) return false;
		if (!this.hasRank(by, '@#&~')) return false;
		if (!this.bannedWords["words"]) this.bannedWords["words"] = [];
		this.bannedWords["words"].push(arg.toLowerCase());
		this.writeBannedWords();
		this.say(con, room, 'Phrase \"' + arg + '\" has been added to the banned words list!');
	},
	bansite: 'banwebsite',
	banwebsite: function(arg, by, room, con) {
		if (!this.hasRank(by, '@#&~')) return false;
		if (!this.hasRank(by, '@#&~')) return false;
		if (!this.bannedSites["sites"]) this.bannedSites["sites"] = [];
		this.bannedSites["sites"].push(arg.toLowerCase());
		this.writeBannedSites();
		this.say(con, room, 'Site \"' + arg + '\" has been added to the banned sites list!');
	},
	unbanphrase: 'unbanword',
	unbanword: function(arg, by, room, con) {
		if (!this.hasRank(by, '@#&~')) return false;
		if (!this.hasRank(by, '@#&~')) return false;
		if (!this.bannedWords["words"]) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__There are no banned phrases ;~;__');
		var wordFound = false;
		for (var i in this.bannedWords["words"]) {
			if (toId(this.bannedWords["words"][i]) == toId(arg)) {
				wordFound = true;
				this.bannedWords["words"].splice(i, 1);
				this.writeBannedWords();
			}
		}
		if (wordFound == true) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + 'Phrase \"' + arg + '\" has been removed from the banlist.');
		this.say(con, room, 'Phrase \"' + arg + '\" is not currently banned.');
	},
	unbansite: 'unbanwebsite',
	unbanwebsite: function(arg, by, room, con) {
		if (!this.hasRank(by, '@#&~')) return false;
		if (!this.hasRank(by, '@#&~')) return false;
		if (!this.bannedSites["sites"]) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__There are no banned sites ;~;__');
		var siteFound = false;
		for (var i in this.bannedSites["sites"]) {
			if (toId(this.bannedSites["sites"][i]) == toId(arg)) {
				siteFound = true;
				this.bannedSites["sites"].splice(i, 1);
				this.writeBannedSites();
			}
		}
		if (siteFound == true) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + 'Website \"' + arg + '\" has been removed from the banlist.');
		this.say(con, room, 'Website \"' + arg + '\" is not currently banned.');
	},
	viewbannedphrases: 'viewbannedwords',
	vbw: 'viewbannedwords',
	viewbannedwords: function(arg, by, room, con) {
		if (!this.hasRank(by, '@#&~')) return false;
		if (!this.bannedWords["words"] || this.bannedWords["words"] == []) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__There are no banned websites!__');
		this.uploadToHastebin(con, room, by, 'Banned phrases: ' + this.bannedWords["words"].join(', '));
	},
	viewbannedsites: 'viewbannedwebsites',
	vbs: 'viewbannedwebsites',
	viewbannedwebsites: function(arg, by, room, con) {
		if (!this.hasRank(by, '@#&~')) return false;
		if (!this.bannedSites["sites"] || this.bannedSites["sites"] == []) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__There are no banned websites!__');
		this.uploadToHastebin(con, room, by, 'Banned websites: ' + this.bannedSites["sites"].join(', '));
	},
	userlog: function(arg, by, room, con) {
		if (!this.userlog) this.userlog = {};
		if (!this.userlog) this.userlog = [];
		var user = toId(arg);
		if (!this.userlog[user]) return this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + '__Not Blacklisted__ | __Warns__: 0 | __Mutes__: 0 | __Bans__: 0');
		var bl;
		var warns;
		var mutes;
		var bans;
		if (!this.userlog[user]["bl"]) bl = false;
		else bl = this.userlog[user]["bl"];
		if (!this.userlog[user]["warns"]) warns = 0;
		else warns = this.userlog[user]["warns"];
		if (!this.userlog[user]["mutes"]) mutes = 0;
		else mutes = this.userlog[user]["mutes"];
		if (!this.userlog[user]["bans"]) bans = 0;
		else bans = this.userlog[user]["bans"];
		if (bl == true) bl = '**Blacklisted**';
		else bl = '__Not Blacklisted__';
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + toId(by) + ', ') + bl + ' | __Warns__: ' + warns + ' | __Mutes__: ' + mutes + ' | __Bans__: ' + bans);
	},
	youtube: function(arg, by, room, con) {
		if (!this.hasRank(by, '@#&~')) return false;
		if (toId(arg) == 'on') {
			if (!this.settings.youtube) this.settings.youtube = true;
			else this.settings.youtube = true;
			this.writeSettings();
			this.say(con, room, '__YouTube title displays are now on!^-^__');
		} else if (toId(arg) == 'off') {
			if (!this.settings.youtube) this.settings.youtube = false;
			else this.settings.youtube = false;
			this.writeSettings();
			this.say(con, room, '__YouTube title displays are now off ;~;__');
		} else this.say(con, room, 'Command syntax: #youtube ``on|off``');
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
		if (!this.settings["qotd"]) this.settings["qotd"] = {};
		if (arg.split(", ").length > 2) {
			this.settings["qotd"]["quote"] = arg.substring(0, arg.lastIndexOf(", "));
			this.settings["qotd"]["by"] = arg.substring(arg.lastIndexOf(", ") + 2, arg.length);
		} else {
			var input = arg.split(", ");
			this.settings["qotd"]["quote"] = input[0];
			this.settings["qotd"]["by"] = input[1];
		}
		this.writeSettings();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__Quote has been set!^-^__');
	},
	qotd: 'quote',
	quote: function(arg, by, room, con) {
		var text = '';
		if (this.hasRank(by, '+%@&#~')) text += ('/w ' + toId(by) + ', ');
		if (!this.settings["qotd"]) return this.say(con, room, '__No quote has been set ;-;__');
		this.say(con, room, text + 'Quote of the Day: __"' + this.settings["qotd"]["quote"] + '"__ ~' + this.settings["qotd"]["by"]);
	},


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Offline PM Commands ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////     
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      

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
		if (!this.userlog["favemon"]) this.userlog["favemon"] = {};
		if (!this.userlog[toId(by)]["favemon"]) this.userlog[toId(by)]["favemon"] = {};
		var foundMon = false;
		var monId = toId(arg.replace(/(shiny|mega)/i, ''));
		for (var mon in Pokedex) {
			if (toId(Pokedex[mon].species) === monId) {
				foundMon = true;
				break;
			}
		}
		if (!foundMon) return this.say(con, room, '\'' + arg + '\' is not a valid Pokemon!');
		this.userlog[toId(by)]["favemon"] = arg;
		this.writeUserlog();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__Your favorite pokemon has been set to ' + arg + '!^-^__');
	},
	favemon: function(arg, by, room, con) {
		if (!this.userlog[toId(by)]) this.userlog[toId(by)] = {};
		var text = '';
		if (!this.hasRank(by, '+%@#&~')) text += ('/w ' + toId(by) + ', ');
		if (!arg) {
			if (!this.userlog[toId(by)]["favemon"]) return this.say(con, room, 'You have not set your favorite Pokemon.');
			return this.say(con, room, by + '\'s favorite Pokemon is __' + this.userlog[toId(by)]["favemon"] + '__!');
		}
		var user = toId(arg);
		if (user.length < 1 || user.length > 18) return this.say(con, room, 'That\'s not a real username!');
		if (!this.userlog[toId(by)]["favemon"]) return this.say(con, room, text + 'There is no favorite Pokemon set for ' + arg + '.');
		this.say(con, room, text + arg + '\'s favorite Pokemon is __' + this.userlog[toId(by)]["favemon"] + '__!');
	},

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Selfie ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////     
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

	setselfie: function(arg, by, room, con) {
		var bitLink = '';
		var BitlyAPI = require("node-bitlyapi");
		var Bitly = new BitlyAPI({
			client_id: "Something",
			client_secret: "Something"
		});
		if (!this.userlog[toId(by)]) this.userlog[toId(by)] = {};
		if (!/https?:\/\//.test(arg)) return this.say(con, room, 'Link must include http.');
		if (!this.userlog[toId(by)]["selfie"]) this.userlog[toId(by)]["selfie"] = {};
		Bitly.setAccessToken("c8a15558cbf4a555391b974849d7684e211fb707");
		Bitly.shortenLink(arg, function(err, results) {
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
				self.userlog[toId(by)]["selfie"] = bitLink;
				self.writeUserlog();
				self.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__Your selfie has been set!^-^__');
			}
		}, 100);
	},
	selfie: function(arg, by, room, con) {
		var text = '';
		if (!this.hasRank(by, '+%@#&~')) text += ('/w ' + toId(by) + ', ');
		if (!arg) {
			if (!this.userlog[toId(by)]["selfie"]) return this.say(con, room, '__No selfie has been set ;-;__');
			return this.say(con, room, text + by + '\'s selfie is ' + this.userlog[toId(by)]["selfie"] + '!');
		}
		var user = toId(arg);
		if (user.length < 1 || user.length > 18) return this.say(con, room, 'That\'s not a real username!');
		if (!this.userlog[user]["selfie"]) return this.say(con, room, '__No selfie has been set ;-;__');
		this.say(con, room, text + arg + '\'s selfie:' + this.userlog[user]["selfie"] + '!');
	},

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// General Commands //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

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
		if (!this.canUse('cri', by) || room.charAt(0) === ',') return false;
		this.say(con, room, 'Don\'t worry, it will be okay^~^');
		this.say(con, room, '/me hugs ' + by + ' gently');
	},
	shorten: function(arg, by, room, con) {
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
	userinfo: function(arg, by, room, con) {
		var user = '';
		if (!arg) user = toId(by);
		else user = toId(arg);
		if (!this.userlog) return this.userlog = {};
		if (!this.userlog[user]) this.userlog[user] = {};
		var rank;
		if (!this.userlog[user]["rank"]) rank = '';
		else {
			if (user == 'mashirochan') rank = '#';
			else if (this.userlog[user]["rank"] == 'voice') rank = '+';
			else if (this.userlog[user]["rank"] == 'driver') rank = '%';
			else if (this.userlog[user]["rank"] == 'mod') rank = '@';
		}
		var favemon;
		if (!this.userlog[user]["favemon"]) favemon = 'Not set yet!';
		else favemon = this.userlog[user]["favemon"];
		var faveanime = '';
		if (this.userlog[user]["faveanime"]) faveanime = '\n\n//////////////////////////////////////////////////\n/// Favorite Anime ///////////////////////////////\n//////////////////////////////////////////////////\n\n' + this.userlog[user]["faveanime"];
		var mal = '';
		if (this.userlog[user]["mal"]) mal = '\n\n//////////////////////////////////////////////////\n/// MAL //////////////////////////////////////////\n//////////////////////////////////////////////////\n\n' + this.userlog[user]["mal"];
		var favemap = '';
		if (this.userlog[user]["favemap"]) favemap = '\n\n//////////////////////////////////////////////////\n/// Favorite Beatmap /////////////////////////////\n//////////////////////////////////////////////////\n\n' + this.userlog[user]["favemap"];
	    var selfie = '';
	    if (this.userlog[user]["selfie"]) selfie = '\n\nSelfie: ' + this.userlog[user]["selfie"];
	    var self = this;
		request('http://pokemonshowdown.com/users/' + user + '.json', function(err, response, body) {
			if (!err) {
				var info = JSON.parse(body);
				var regTime = new Date(1000 * info.registertime);
				var year = regTime.getFullYear();
				var monthInt = regTime.getMonth() + 1;
				var day = regTime.getDate();
				var month = '';
				if (monthInt === 1) month = 'January';
				else if (monthInt === 2) month = 'February';
				else if (monthInt === 3) month = 'March';
				else if (monthInt === 4) month = 'April';
				else if (monthInt === 5) month = 'May';
				else if (monthInt === 6) month = 'June';
				else if (monthInt === 7) month = 'July';
				else if (monthInt === 8) month = 'August';
				else if (monthInt === 9) month = 'September';
				else if (monthInt === 10) month = 'October';
				else if (monthInt === 11) month = 'November';
				else if (monthInt === 12) month = 'December';
				var suffix = '';
				if (day % 10 === 0 || day % 10 === 4 || day % 10 === 5 || day % 10 === 6 || day % 10 === 7 || day % 10 === 8 || day % 10 === 9) suffix = 'th';
				if (day % 10 === 1) suffix = 'st';
				if (day % 10 === 2) suffix = 'nd';
				if (day % 10 === 3) suffix = 'rd';
				var date = month + ' ' + day + suffix + ', ' + year;
				var rankedLaddersTitle = '//////////////////////////////////////////////////\n/// Ranked Ladders ///////////////////////////////\n//////////////////////////////////////////////////';
				var faveMonTitle = '//////////////////////////////////////////////////\n/// Favorite Pokemon /////////////////////////////\n//////////////////////////////////////////////////';
				var batRatings = '';
				if (Object.keys(info.ratings).length === 0) {
					batRatings = 'This user is not ranked in any ladders!\n\n';
				} else {
					for (var i in info.ratings) {
						var dashes = '';
						for (var j = 51 - (4 + i.length); j > 0; j--) dashes += '-';
						batRatings += ('- ' + i + ' ' + dashes + '\n\nelo: ' + Math.round(info.ratings[i].elo) + '\ngxe: ' + Math.round(info.ratings[i].gxe) + '\n\n');
					}
				}
				var slashes = '';
				for (var k = 50 - (6 + info.username.length); k > 0; k--) slashes += '/';
				self.uploadToHastebin(con, room, by, '/// ' + rank + info.username + ' ' + slashes + '\n\nRegister Date: ' + date + selfie + '\n\n' + rankedLaddersTitle + '\n\n' + batRatings + faveMonTitle + '\n\n' + favemon + faveanime + mal + favemap);
			} else {
				return self.say(con, room, '__There has been an error!__');
			}});
	},

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Breeding Room Commands ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

	trade: function(arg, by, room, con) {
		if (!this.trades) this.trades = {};
		if (!this.trades[toId(by)]) this.trades[toId(by)] = {};
		var pokemon = arg.replace(/\[/g, '').split("]");
		pokemon.splice(pokemon.length - 1, 1);
		console.log(pokemon);
		var foundMon = false;
		var monId = toId(pokemon[0].replace(/(mega)/i, ''));
		for(var i in pokemon) {
			for (var mon in Pokedex) {
				if (toId(Pokedex[mon].species) === monId) {
					foundMon = true;
					break;
				}
			}
		}
	},
	ivs: function(arg, by, room, con) {
		var types = ['dark','dragon','ice','psychic','electric','grass','water','fire','steel','ghost','bug','rock','ground','poison','flying','fighting'];
		var text = '';
		if (!this.hasRank(by, '+%@#&~')) text += ('/w ' + toId(by) + ', ');
		if (!arg) return this.say(con, room, text + '__You must input a type to display IVs for ;-;__');
		if (arg.indexOf(",") > -1 || arg.indexOf("/") > -1) {
			if (arg.indexOf(",") > -1) var stats = arg.replace(/ /g, '').split(",");
			else var stats = arg.replace(/ /g, '').split("/");
			var statsOutput = stats.join("/");
			if (stats.length < 6) return this.say(con, room, text + '__You must include all 6 stat IVs!__');
			var a = parseInt(stats[0]) % 2;
			var b = parseInt(stats[1]) % 2;
			var c = parseInt(stats[2]) % 2;
			var e = parseInt(stats[3]) % 2;
			var f = parseInt(stats[4]) % 2;
			var d = parseInt(stats[5]) % 2;
			var type = '';
			var n = '';
			var typeNum = Math.floor(((a + (2 * b) + (4 * c) + (8 * d) + (16 * e) + (32 * f)) * 15) / 63);
			var damage = Math.floor(((a + (2 * b) + (4 * c) + (8 * d) + (16 * e) + (32 * f)) * 40) / 63) + 30;
			switch (typeNum) {
				case 0: type += 'Fighting';
					break;
				case 1: type += 'Flying';
					break;
				case 2: type += 'Poison';
					break;
				case 3: type += 'Ground';
					break;
				case 4: type += 'Rock';
					break;
				case 5: type += 'Bug';
					break;
				case 6: type += 'Ghost';
					break;
				case 7: type += 'Steel';
					break;
				case 8: type += 'Fire';
					break;
				case 9: type += 'Water';
					break;
				case 10: type += 'Grass';
					break;
				case 11: type += 'Electric';
				n += 'n';
					break;
				case 12: type += 'Psychic';
					break;
				case 13: type += 'Ice';
				n += 'n';
					break;
				case 14: type += 'Dragon';
					break;
				case 15: type += 'Dark';
					break;
			}
			this.say(con, room, text + 'The IVs ' + statsOutput + ' give a' + n + ' **' + type + '** type Hidden Power, with a damage of **' + damage + '**!');
		} else {
		var type = toId(arg);
		if (types.indexOf(type) < 0) return this.say(con, room, text + '__That is not a valid type!__');
		if (type === 'dark') return this.say(con, room, text + 'IV\'s required for Dark type Hidden Power: 31/31/31/31/31/31');
		if (type === 'dragon') return this.say(con, room, text + 'IV\'s required for Dragon type Hidden Power: 30/31/31/31/31/31, 31/30/31/31/31/31, 30/30/31/31/31/31, 31/31/30/31/31/31');
		if (type === 'ice') return this.say(con, room, text + 'IV\'s required for Ice type Hidden Power: 30/31/30/31/31/31, 31/30/30/31/31/31, 30/30/30/31/31/31, 31/31/31/31/31/30');
		if (type === 'psychic') return this.say(con, room, text + 'IV\'s required for Psychic type Hidden Power: 30/31/31/31/31/30, 31/30/31/31/31/30, 30/30/31/31/31/30, 31/31/30/31/31/30');
		if (type === 'electric') return this.say(con, room, text + 'IV\'s required for Electric type Hidden Power: 30/31/30/31/31/30, 31/30/30/31/31/30, 30/30/30/31/31/30, 31/31/31/30/31/31');
		if (type === 'grass') return this.say(con, room, text + 'IV\'s required for Grass type Hidden Power: 30/31/31/30/31/31, 31/30/31/30/31/31, 30/30/31/30/31/31, 31/31/30/30/31/31, 30/31/30/30/31/31');
		if (type === 'water') return this.say(con, room, text + 'IV\'s required for Water type Hidden Power: 31/30/30/30/31/31, 30/30/30/30/31/31, 31/31/31/30/31/30, 30/31/31/30/31/30');
		if (type === 'fire') return this.say(con, room, text + 'IV\'s required for Fire type Hidden Power: 31/30/31/30/31/30, 30/30/31/30/31/30, 31/31/30/30/31/30, 30/31/30/30/31/30');
		if (type === 'steel') return this.say(con, room, text + 'IV\'s required for Steel type Hidden Power: 31/30/30/30/31/30, 30/30/30/30/31/30, 31/31/31/31/30/31, 30/31/31/31/30/31');
		if (type === 'ghost') return this.say(con, room, text + 'IV\'s required for Ghost type Hidden Power: 31/30/31/31/30/31, 30/30/31/31/30/31, 31/31/30/31/30/31, 30/31/30/31/30/31');
		if (type === 'bug') return this.say(con, room, text + 'IV\'s required for Bug type Hidden Power: 31/30/30/31/30/31, 30/30/30/31/30/31, 31/31/31/31/30/30, 30/31/31/31/30/30, 31/30/31/31/30/30');
		if (type === 'rock') return this.say(con, room, text + 'IV\'s required for Rock type Hidden Power: 30/30/31/31/30/30, 31/31/30/31/30/30, 30/31/30/31/30/30, 31/30/30/31/30/30');
		if (type === 'ground') return this.say(con, room, text + 'IV\'s required for Ground type Hidden Power: 30/30/30/31/30/30, 31/31/31/30/30/31, 30/31/31/30/30/31, 31/30/31/30/30/31');
		if (type === 'poison') return this.say(con, room, text + 'IV\'s required for Poison type Hidden Power: 30/30/31/30/30/31, 31/31/30/30/30/31, 30/31/30/30/30/31, 31/30/30/30/30/31');
		if (type === 'flying') return this.say(con, room, text + 'IV\'s required for Flying type Hidden Power: 30/30/30/30/30/31, 31/31/31/30/30/30, 30/31/31/30/30/30, 31/30/31/30/30/30');
		if (type === 'fighting') return this.say(con, room, text + 'IV\'s required for Fighting type Hidden Power: 30/30/31/30/30/30, 31/31/30/30/30/30, 30/31/30/30/30/30, 31/30/30/30/30/30, 30/30/30/30/30/30');
		}
	},

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// osu! Room Commands ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////       

	setfavemap: function(arg, by, room, con) {
		if (room !== 'osu') return this.say(con, room, '__That command is not available in this room ;-;__');
		if (!this.userlog[toId(by)]) userlog[toId(by)] = {};
		if (!/https?:\/\//.test(arg)) return this.say(con, room, 'Link must include http.');
		if (!this.userlog[toId(by)]["favemap"]) this.userlog[toId(by)]["favemap"] = {};
		this.userlog[toId(by)]["favemap"] = arg;
		this.writeUserlog();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__Your favorite beatmap has been set!^-^__');
	},
	favemap: function(arg, by, room, con) {
		if (room !== 'osu') return this.say(con, room, '__That command is not available in this room ;-;__');
		var text = '';
		if (!this.hasRank(by, '+%@#&~')) text += ('/w ' + toId(by) + ', ');
		if (!arg) {
			if (!this.userlog[toId(by)] || !this.userlog[toId(by)]["favemap"]) return this.say(con, room, '' + text + '__No favorite beatmap has been set ;-;__');
			return this.say(con, room, text + by + '\'s favorite beatmap is ' + this.userlog[toId(by)]["favemap"] + '!');
		}
		var user = toId(arg);
		if (!this.userlog[user] || !this.userlog[user]["favemap"]) return this.say(con, room, '__No favorite beatmap has been set ;-;__');
		this.say(con, room, text + arg + '\'s favorite is ' + this.userlog[user]["favemap"] + '!');
	},
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Anime and Manga Room Commands ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////       	
	
	setmal: function(arg, by, room, con) {
		if (!this.userlog[toId(by)]) this.userlog[toId(by)] = {};
		if (!/https?:\/\//.test(arg)) return this.say(con, room, 'Link must include http, __b-baka..!! ;~;__');
		if (!/myanimelist.net/.test(arg)) return this.say(con, room, 'Link must be a MAL link! __b-baka..!! ;~;__');
		if (!this.userlog[toId(by)]["mal"]) this.userlog[toId(by)]["mal"] = {};
		this.userlog[toId(by)]["mal"] = arg;
		this.writeUserlog();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__Your MAL has been set!^-^__');
	},
	mal: function(arg, by, room, con) {
		var text = '';
		if (!this.hasRank(by, '+%@#&~')) text += ('/w ' + toId(by) + ', ');
		if (!arg) {
			if (!this.userlog[toId(by)] || !this.userlog[toId(by)]["mal"]) return this.say(con, room, '' + text + '__No MAL has been set ;-;__');
			return this.say(con, room, text + by + '\'s MAL is ' + this.userlog[toId(by)]["mal"] + '!');
		}
		var user = toId(arg);
		if (!this.userlog[user] || !this.userlog[user]["mal"]) return this.say(con, room, '__No MAL has been set ;-;__');
		this.say(con, room, text + arg + '\'s MAL is ' + this.userlog[user]["mal"] + '!');
	},
	setfaveanime: function(arg, by, room, con) {
		if (!this.userlog[toId(by)]) this.userlog[toId(by)] = {};
		if (/boku no pico/.test(arg)) return this.say(con, room, 'l-lewd..!! ;~;');
		if (!this.userlog[toId(by)]["faveanime"]) this.userlog[toId(by)]["faveanime"] = {};
		this.userlog[toId(by)]["faveanime"] = arg;
		this.writeUserlog();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__Your favorite anime has been set!^-^__');
	},
	faveanime: function(arg, by, room, con) {
		if (!this.userlog[toId(by)]) this.userlog[toId(by)] = {};
		var text = '';
		if (!this.hasRank(by, '+%@#&~')) text += ('/w ' + toId(by) + ', ');
		if (!arg) {
			if (!this.userlog[toId(by)] || !this.userlog[toId(by)]["faveanime"]) return this.say(con, room, text + '__No favorite anime has been set ;-;__');
			if (/http/.test(this.userlog[toId(by)]["faveanime"])) return this.say(con, room, text + by + '\'s favorite anime is ' + this.userlog[toId(by)]["faveanime"] + '!');
			else return this.say(con, room, text + by + '\'s favorite anime is __' + this.userlog[toId(by)]["faveanime"] + '__!');
		}
		var user = toId(arg);
		if (!this.userlog[user] || !this.userlog[user]["faveanime"]) return this.say(con, room, '__No favorite anime has been set ;-;__');
		if (/http/.test(this.userlog[user]["faveanime"])) this.say(con, room, text + by + '\'s favorite anime is ' + this.userlog[user]["faveanime"] + '!');
		else this.say(con, room, text + arg + '\'s favorite anime is __' + this.userlog[user]["faveanime"] + '__!');
	},
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Chess Room Commands ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////       	

	chessuser: function(arg, by, room, con) {
		if (room !== 'chess') return this.say(con, room, '__That command is not available in this room ;-;__');
		var text = '';
		if (!this.hasRank(by, '+%@#&~')) text += ('/w ' + toId(by) + ', ');
		var self = this;
		var input = arg.replace(/ /g, '');
		if (arg.split(",").length < 2) return this.say(con, room, text + 'Command syntax: #chessuser ``[username], [game mode]``');
		var user = input.split(",")[0];
		var mode = toId(input.split(",")[1]);
		var modes = 'chess960,blitz,kingofthehill,threecheck,antichess,bullet,correspondence,horde,puzzle,atomic,opening,classical';
		if (modes.indexOf(mode) < 0) return this.say(con, room, text + '__Not a valid game mode ;-;__');
		request('http://en.lichess.org/api/user/' + user, function(err, response, body) {
			var info = JSON.parse(body);
			console.log(mode);
			if (info.online === true && info.playing) self.say(con, room, text + '**' + info.username + '** - __Current Game:__ ' + info.playing + ' | __Games:__ ' + info["perfs"][mode]["games"] + ' | __Rating:__ ' + info["perfs"][mode]["rating"] + ' +/- ' + info["perfs"][mode]["rd"]);
			else self.say(con, room, text + '**' + info.username + '** - __Games:__ ' + info["perfs"][mode]["games"] + ' | __Rating:__ ' + info["perfs"][mode]["rating"] + ' +/- ' + info["perfs"][mode]["rd"]);
		});
	},

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// TV & Books & Films Room Commands //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////       	
	
	score: function(arg, by, room, con) {
		if (room !== 'tvbooksfilms') return this.say(con, room, '__That command is not available in this room ;-;__');
		var text = '';
		if (!this.hasRank(by, '+%@#&~')) text += ('/w ' + toId(by) + ', ');
		var self = this;
		if (arg.split(", ").length == 2) {
			var title = arg.split(", ")[0].replace(/ /g, '+').replace(':', '');
			var type = arg.split(", ")[1];
			request('http://www.omdbapi.com/?t=' + title + '&type=' + type + '&y=&plot=short&r=json', function(err, response, body) {
			if (!err) {
			var info = JSON.parse(body);
			if (info.Response !== 'False') self.say(con, room, text + '**' + info.Title + '** - __Metascore:__ ' + info.Metascore + ' | __IMDb Rating:__ ' + info.imdbRating);
			else self.say(con, room, text + '__Incorrect movie/series title!__');
			}});
		} else if (arg.split(", ").length == 3) {
			var title = arg.split(", ")[0].replace(/ /g, '+').replace(':', '');
			var season = arg.split(", ")[1];
			var episode = arg.split(", ")[2];
			request('http://www.omdbapi.com/?t=' + title + '&Season=' + season + '&Episode=' + episode + '&y=&plot=short&r=json', function(err, response, body) {
			if (!err) {
			var info = JSON.parse(body);
			if (info.Response !== 'False') self.say(con, room, text + '**' + info.Title + '** - __Metascore:__ ' + info.Metascore + ' | __IMDb Rating:__ ' + info.imdbRating);
			else self.say(con, room, text + '__Incorrect movie/series title!__');
		}});
		} else {
			var title = arg.replace(/ /g,'+');
			request('http://www.omdbapi.com/?t=' + title + '&y=&plot=short&r=json', function(err, response, body) {
			if (!err) {
			var info = JSON.parse(body);
			if (info.Response !== 'False') self.say(con, room, text + '**' + info.Title + '** - __Metascore:__ ' + info.Metascore + ' | __IMDb Rating:__ ' + info.imdbRating);
			else self.say(con, room, text + '__Incorrect movie/series title!__');
			}});
		}
	},
	awards: function(arg, by, room, con) {
		if (room !== 'tvbooksfilms') return this.say(con, room, '__That command is not available in this room ;-;__');
		var text = '';
		if (!this.hasRank(by, '+%@#&~')) text += ('/w ' + toId(by) + ', ');
		var self = this;
		if (arg.split(", ").length == 2) {
			var title = arg.split(", ")[0].replace(/ /g, '+').replace(':', '');
			var type = arg.split(", ")[1];
			request('http://www.omdbapi.com/?t=' + title + '&type=' + type + '&y=&plot=short&r=json', function(err, response, body) {
			if (!err) {
			var info = JSON.parse(body);
			if (info.Response !== 'False') self.say(con, room, text + '**' + info.Title + '** - __Awards:__ ' + info.Awards);
			else self.say(con, room, text + '__Incorrect movie/series title!__');
			}});
		} else if (arg.split(", ").length == 3) {
			var title = arg.split(", ")[0].replace(/ /g, '+').replace(':', '');
			var season = arg.split(", ")[1];
			var episode = arg.split(", ")[2];
			request('http://www.omdbapi.com/?t=' + title + '&Season=' + season + '&Episode=' + episode + '&y=&plot=short&r=json', function(err, response, body) {
			if (!err) {
			var info = JSON.parse(body);
			if (info.Response !== 'False') self.say(con, room, text + '**' + info.Title + '** - __Awards:__ ' + info.Awards);
			else self.say(con, room, text + '__Incorrect movie/series title!__');
		}});
		} else {
			var title = arg.replace(/ /g,'+');
			request('http://www.omdbapi.com/?t=' + title + '&y=&plot=short&r=json', function(err, response, body) {
			if (!err) {
			var info = JSON.parse(body);
			if (info.Response !== 'False') self.say(con, room, text + '**' + info.Title + '** - __Awards:__ ' + info.Awards);
			else self.say(con, room, text + '__Incorrect movie/series title!__');
			}});
		}
	},
	actors: 'cast',
	cast: function(arg, by, room, con) {
		if (room !== 'tvbooksfilms') return this.say(con, room, '__That command is not available in this room ;-;__');
		var text = '';
		if (!this.hasRank(by, '+%@#&~')) text += ('/w ' + toId(by) + ', ');
		var self = this;
		if (arg.split(", ").length == 2) {
			var title = arg.split(", ")[0].replace(/ /g, '+').replace(':', '');
			var type = arg.split(", ")[1];
			request('http://www.omdbapi.com/?t=' + title + '&type=' + type + '&y=&plot=short&r=json', function(err, response, body) {
			if (!err) {
			var info = JSON.parse(body);
			if (info.Response !== 'False') self.say(con, room, text + '**' + info.Title + '** - __Director(s):__ ' + info.Director + ' | __Actors:__ ' + info.Actors);
			else self.say(con, room, text + '__Incorrect movie/series title!__');
			}});
		} else if (arg.split(", ").length == 3) {
			var title = arg.split(", ")[0].replace(/ /g, '+').replace(':', '');
			var season = arg.split(", ")[1];
			var episode = arg.split(", ")[2];
			request('http://www.omdbapi.com/?t=' + title + '&Season=' + season + '&Episode=' + episode + '&y=&plot=short&r=json', function(err, response, body) {
			if (!err) {
			var info = JSON.parse(body);
			if (info.Response !== 'False') self.say(con, room, text + '**' + info.Title + '** - __Director(s):__ ' + info.Director + ' | __Actors:__ ' + info.Actors);
			else self.say(con, room, text + '__Incorrect movie/series title!__');
		}});
		} else {
			var title = arg.replace(/ /g,'+');
			request('http://www.omdbapi.com/?t=' + title + '&y=&plot=short&r=json', function(err, response, body) {
			if (!err) {
			var info = JSON.parse(body);
			if (info.Response !== 'False') self.say(con, room, text + '**' + info.Title + '** - __Director(s):__ ' + info.Director + ' | __Actors:__ ' + info.Actors);
			else self.say(con, room, text + '__Incorrect movie/series title!__');
			}});
		}
	},
	summary: 'plot',
	plot: function(arg, by, room, con) {
		if (room !== 'tvbooksfilms') return this.say(con, room, '__That command is not available in this room ;-;__');
		var text = '';
		if (!this.hasRank(by, '+%@#&~')) text += ('/w ' + toId(by) + ', ');
		var self = this;
		if (arg.split(", ").length == 2) {
			var title = arg.split(", ")[0].replace(/ /g, '+').replace(':', '');
			var type = arg.split(", ")[1];
			request('http://www.omdbapi.com/?t=' + title + '&type=' + type + '&y=&plot=short&r=json', function(err, response, body) {
			if (!err) {
			var info = JSON.parse(body);
			if (info.Response !== 'False') self.say(con, room, text + '**' + info.Title + '** - __Plot:__ ' + info.Plot);
			else self.say(con, room, text + '__Incorrect movie/series title!__');
			}});
		} else if (arg.split(", ").length == 3) {
			var title = arg.split(", ")[0].replace(/ /g, '+').replace(':', '');
			var season = arg.split(", ")[1];
			var episode = arg.split(", ")[2];
			request('http://www.omdbapi.com/?t=' + title + '&Season=' + season + '&Episode=' + episode + '&y=&plot=short&r=json', function(err, response, body) {
			if (!err) {
			var info = JSON.parse(body);
			if (info.Response !== 'False') self.say(con, room, text + '**' + info.Title + '** - __Plot:__ ' + info.Plot);
			else self.say(con, room, text + '__Incorrect movie/series title!__');
		}});
		} else {
			var title = arg.replace(/ /g,'+');
			request('http://www.omdbapi.com/?t=' + title + '&y=&plot=short&r=json', function(err, response, body) {
			if (!err) {
			var info = JSON.parse(body);
			if (info.Response !== 'False') self.say(con, room, text + '**' + info.Title + '** - __Plot:__ ' + info.Plot);
			else self.say(con, room, text + '__Incorrect movie/series title!__');
			}});
		}
	},
	info: function(arg, by, room, con) {	
		if (room !== 'tvbooksfilms') return this.say(con, room, '__That command is not available in this room ;-;__');
		var text = '';
		if (!this.hasRank(by, '+%@#&~')) text += ('/w ' + toId(by) + ', ');
		var self = this;
		if (arg.split(", ").length == 2) {
			var title = arg.split(", ")[0].replace(/ /g, '+').replace(':', '');
			var type = arg.split(", ")[1];
			request('http://www.omdbapi.com/?t=' + title + '&type=' + type + '&y=&plot=short&r=json', function(err, response, body) {
			if (!err) {
			var info = JSON.parse(body);
			if (info.Response !== 'False') self.say(con, room, text + '**' + info.Title + '** - __Released:__ ' + info.Year + ' | __Rated:__ ' + info.Rated + ' | __Genres:__ ' + info.Genre + ' | __Runtime:__ ' + info.Runtime);
			else self.say(con, room, text + '__Incorrect movie/series title!__');
			}});
		} else if (arg.split(", ").length == 3) {
			var title = arg.split(", ")[0].replace(/ /g, '+').replace(':', '');
			var season = arg.split(", ")[1];
			var episode = arg.split(", ")[2];
			request('http://www.omdbapi.com/?t=' + title + '&Season=' + season + '&Episode=' + episode + '&y=&plot=short&r=json', function(err, response, body) {
			if (!err) {
			var info = JSON.parse(body);
			if (info.Response !== 'False') self.say(con, room, text + '**' + info.Title + '** - __Released:__ ' + info.Year + ' | __Rated:__ ' + info.Rated + ' | __Genres:__ ' + info.Genre + ' | __Runtime:__ ' + info.Runtime);
			else self.say(con, room, text + '__Incorrect movie/series title!__');
		}});
		} else {
			var title = arg.replace(/ /g,'+');
			request('http://www.omdbapi.com/?t=' + title + '&y=&plot=short&r=json', function(err, response, body) {
			if (!err) {
			var info = JSON.parse(body);
			if (info.Response !== 'False') self.say(con, room, text + '**' + info.Title + '** - __Released:__ ' + info.Year + ' | __Rated:__ ' + info.Rated + ' | __Genres:__ ' + info.Genre + ' | __Runtime:__ ' + info.Runtime);
			else self.say(con, room, text + '__Incorrect movie/series title!__');
			}});
		}
	},
	writers: function(arg, by, room, con) {
		if (room !== 'tvbooksfilms') return this.say(con, room, '__That command is not available in this room ;-;__');
		var text = '';
		if (!this.hasRank(by, '+%@#&~')) text += ('/w ' + toId(by) + ', ');
		var self = this;
		if (arg.split(", ").length == 2) {
			var title = arg.split(", ")[0].replace(/ /g, '+').replace(':', '');
			var type = arg.split(", ")[1];
			request('http://www.omdbapi.com/?t=' + title + '&type=' + type + '&y=&plot=short&r=json', function(err, response, body) {
			if (!err) {
			var info = JSON.parse(body);
			if (info.Response !== 'False') self.say(con, room, text + '**' + info.Title + '** - __Writers:__ ' + info.Writer);
			else self.say(con, room, text + '__Incorrect movie/series title!__');
			}});
		} else if (arg.split(", ").length == 3) {
			var title = arg.split(", ")[0].replace(/ /g, '+').replace(':', '');
			var season = arg.split(", ")[1];
			var episode = arg.split(", ")[2];
			request('http://www.omdbapi.com/?t=' + title + '&Season=' + season + '&Episode=' + episode + '&y=&plot=short&r=json', function(err, response, body) {
			if (!err) {
			var info = JSON.parse(body);
			if (info.Response !== 'False') self.say(con, room, text + '**' + info.Title + '** - __Writers:__ ' + info.Writer);
			else self.say(con, room, text + '__Incorrect movie/series title!__');
		}});
		} else {
			var title = arg.replace(/ /g,'+');
			request('http://www.omdbapi.com/?t=' + title + '&y=&plot=short&r=json', function(err, response, body) {
			if (!err) {
			var info = JSON.parse(body);
			if (info.Response !== 'False') self.say(con, room, text + '**' + info.Title + '** - __Writers:__ ' + info.Writer);
			else self.say(con, room, text + '__Incorrect movie/series title!__');
			}});
		}
	},
	recs: 'staffrecommendations',
	reclist: 'staffrecommendations',
	staffrecs: 'staffrecommendations',
	staffrecommendations: function(arg, by, room, con) {
		if (room !== 'tvbooksfilms') return this.say(con, room, '__That command is not available in this room ;-;__');
		var text = '';
		if (!this.hasRank(by, '+%@#&~')) text += ('/w ' + toId(by) + ', ');
		if (!arg) return this.say(con, room, text + 'Staff Recommendations: https://docs.google.com/document/d/1_Lhwcp-c_TAKXdgRw0-vXpdicGF4o1PMpY8J0sO3Nvo/edit');
		if (toId(arg) === 'saburo') return this.say(con, room, text + 'Saburo\'s Recommendations: https://docs.google.com/spreadsheets/d/1Q46JUogMuN2Kv82SorxhLX7P6mN2f3LwKQ478vIACPs/edit#gid=0');
		if (toId(arg) === 'ace') return this.say(con, room, text + 'Ace\'s Recommendations: https://docs.google.com/spreadsheets/d/1dwDT91WIINhpE_g82i6TvplEWE6vq1B2N9VONCcRe-w/edit#gid=0');
		if (toId(arg) === 'angeela') return this.say(con, room, text + 'Angeela\'s Recommendations: https://docs.google.com/spreadsheets/d/1VcXKatIzGI5yxrogrPEGWBWAYJvYlSgnQkURAe2WLUs/edit#gid=0');
		if (toId(arg) === 'valentina16') return this.say(con, room, text + 'Valentina\'s Recommendations: https://docs.google.com/spreadsheets/d/1-NQE8-AZSF7uI2Ec9_rsExLh_VUOQWx7kirIWooIpLQ/edit#gid=0');
		if (toId(arg) === 'hallowedthoughts') return this.say(con, room, text + 'Hallowed Thoughts\'s Recommendations: https://docs.google.com/spreadsheets/d/14_eXf31Ei3r6tppq0ekdZvondZ_92bOx_0LyXViw_eU/edit#gid=0');
		if (toId(arg) === 'himynamesl') return this.say(con, room, text + 'HiMyNamesL\'s Recommendations: https://docs.google.com/spreadsheets/d/1NVtyWvYUVKpXohd2YbVcC5u0gDizbyAtRl-c1e2dOnc/edit#gid=0');
	},
	prenoms: function(arg, by, room, con) {
		if (room !== 'tvbooksfilms') return this.say(con, room, '__That command is not available in this room ;-;__');
		var text = '';
		if (!this.hasRank(by, '+%@#&~')) text += ('/w ' + toId(by) + ', ');
		this.say(con, room, text + 'Pre-nominations: https://docs.google.com/spreadsheets/d/18wrB42cHhBcqqse-WxOTEOUYK3YkA90IPuCXttMIiiw/edit#gid=0');
	},
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// MOBA Room Commands ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////       	
	
	ranked: function(arg, by, room, con) {
		if (room !== 'moba') return this.say(con, room, '__That command is not available in this room ;-;__');
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
	unranked: function(arg, by, room, con) {
		if (room !== 'moba') return this.say(con, room, '__That command is not available in this room ;-;__');
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
	freeweek: 'freechamps',
    freechamps: function(arg, by, room, con) {
    	if (room !== 'moba') return this.say(con, room, '__That command is not available in this room ;-;__');
    	if (!this.canUse('freechamps', by)) return false;
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
    	setTimeout(function(){
    		if (names.length > 1) self.say(con, room, 'The free champs this week are: __' + names.join(', ') + '.__');
    		else return this.say(con, room, '__There has been an error! ;~;__');
    	},1500);
	},
	spectate: function(arg, by, room, con) {
		if (room !== 'moba') return this.say(con, room, '__That command is not available in this room ;-;__');
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
	gameinfo: function(arg, by, room, con) {
		if (room !== 'moba') return this.say(con, room, '__That command is not available in this room ;-;__');
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
							blueChamps.push(' __' + game.participants[i]["summonerName"] + '__: **' + champName + '**');
						} else {
							redChamps.push(' __' + game.participants[i]["summonerName"] + '__: **' + champName + '**');
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
							blueBans.push(' __' + champName + '__');
						} else {
							redBans.push(' __' + champName + '__');
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
/*	history: function(arg, by, room, con) {
		if (room !== 'moba') return this.say(con, room, '__That command is not available in this room ;-;__');
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
			
		} else return this.say(con, room, '__Correct syntax:__ #history ``[summoner name], [champ name]``');
	}, */
	cs: 'champsearch',
	champsearch: function (arg, by, room, con) {
		if (room !== 'moba') return this.say(con, room, '__That command is not available in this room ;-;__');
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
	is: 'itemsearch',
	itemsearch: function (arg, by, room, con) {
		if (room !== 'moba') return this.say(con, room, '__That command is not available in this room ;-;__');
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
	champ: 'champion',
	hero: 'champion',
	god: 'champion',
	champion: function(arg, by, room, con) {
		if (room !== 'moba') return this.say(con, room, '__That command is not available in this room ;-;__');
		if (!this.hasRank(by, '+%@&#~')) return false;
		if (arg.split(" ").length < 2) return this.say(con, room, 'Command syntax: #champion ``[info]|[stats]|[abilities] [champ name]``');
		var input = arg.split(" ");
		var champName = toId(input[1]).capitalize();
		var inChamps = false;
		for (var i in leagueChamps.champs) {
			if (champName == i) inChamps = true;
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
	randomchamp: function(arg, by, room, con) {
		 if (room !== 'moba') return this.say(con, room, '__That command is not available in this room ;-;__');
		var rand = Math.round(Math.random() * 124);
		var champArray = Object.keys(leagueChamps.champs).map(function (key) {return leagueChamps.champs[key]});
		this.say(con, room, 'Your random champ is: __' + champArray[rand]["name"] + '__');
	},
	item: function(arg, by, room, con) {
		if (room !== 'moba') return this.say(con, room, '__That command is not available in this room ;-;__');
		if (!this.hasRank(by, '+%@&#~')) return false;
		var input = arg.split(" ");
		if (input.length < 2) return this.say(con, room, 'Command syntax: #item ``[info]|[recipe]|[efficiency] [item name]``');
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
};
