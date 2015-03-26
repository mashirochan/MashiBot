
var modsandros = 'albert, ascriptmaster, floette, goddessbriyella, omegaxis14, sparkychild, themansavage, yana, leinfiniti, 421cherrim, afklbert, afkomegaxis14, aikachan, airwolf, airwolfvevo, annual, anttya, art2d2, artichano, articuno, articunt, astara, astaravistababy, baeonce, baesremmurd, bandannawaddledoo, bertal, bitchwomansavage, blitzbird, briyellabot, briyellasleep, briyellaway, bubblepixie, butchmansavage, charingo, charingodrawing, chiquimamidawn, chrystasleep, cornelly, dancebottt, demkyogres, dirpz, dratini, dreadzerotan, espeonscientist, facenemesis, fairystorm, flowerbless, freeroamer, freewasted, gernernjer, gobosox, goddesscherrim, goddesschrysta, goddessjessilina, goddessmashiro, goddesspotato, hellohappiness, hoborobohomo, hydroimpact, ihatebriyella, innovamania, insanelover, istalkpeople, jessilina, jessleague, jetbrback, jetpack, khrysta, kimilsaturn, kittyjulia, ladyyukari, laladeda, lostatpreview, loudicolo, lovesage, lucina09, lucinastudying, lucyheartfillia, luige, lunistrius, lyse, magistrum, mashibot, mashirochan, milktownomega, minunchan, misakaa, monohearted, neribusy, neridinnur, neridrawing, nerina, nerinclass, notprovocative, oldgensbot, oldgensbottt, omroomkiller, osiris, partywooper, prankster, princessjulia, princesskathryn, pumpkaboo, queenchrista, queenlala, queenlaladeda, queenlina, queez, ransei, revdatbooty, rhythms, rosiethevenusaur, saltmagnet, sasstara, sayaka, shamrocks, slutqueen, social, solarisfaux, solarisfox, somomo, sparkl3y, sparkl3ydrawing, starbloom, studyingjulia, thirsty4briyella, tr1ckster, trickster, wanderingaria, weebl, whimsicott, winry, wrengalo, yellowchan, zester';

var http = require('http');
var sys = require('sys');

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
		text += '__MashiBot__ source code: ' + config.fork + '__';
		this.say(con, room, text);
	},
	commands: function(arg, by, room, con) {
		if (!this.hasRank(by, '+%@&#~') || room.charAt(0) === ',') return false;
		this.say(con, room, 'Commands for MashiBot: http://pastebin.com/QGrSXCQ3');
	},
	about: function(arg, by, room, con) {
		if (!this.hasRank(by, '+%@&#~') || room.charAt(0) === ',') return false;
		this.say(con, room, '__MashiBot__ is a bot that was created by Mashiro with the use of code from boTTT and Art2D2. Thanks to their respective owners for the help, I\'m a nub so I couldn\'t have done it without them o3o');
	},

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Developer commands ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

	update: function(arg, by, room, con) {
		if (!this.hasRank(by, '~')) return false;
		try {
			this.uncacheTree('./commands.js');
			Commands = require('./commands.js').commands;
			this.say(con, room, '__Commands updated^-^__');
		} catch (e) {
			error('failed to update: ' + sys.inspect(e));
		}
		
	},
	leave: function(arg, by, room, con) {
		if (!this.hasRank(by, '~')) return false;
		this.say(con, room, '/leave');
	},
	disconnect: function(arg, by, room, con) {
		if (!this.hasRank(by, '~')) return false;
		con.close();
	},
	afk: function (arg, by, room, con) {
        var tarRoom = room;
    	if (toId(by) !== 'goddessmashiro') return false;
	if (isAfk === false) {
		isAfk = true;
		this.say(con, room, '/w ' + by + ', you are now in AFK mode.');
	}
	else if (isAfk === true) {
		isAfk = false;
		this.say(con, room, '/w ' + by + ', AFK mode turned off.');
	}
    	},
	custom: function (arg, by, room, con) {
        if (toId(by) !== 'goddessmashiro') return false;
        var tarRoom = 'tha';
		this.say(con, tarRoom, arg);
	},
	js: function(arg, by, room, con) {
		if (config.excepts.indexOf(toId(by)) === -1) return false;
		try {
			var result = eval(arg.trim());
		} catch (e) {
			this.say(con, room, e.name + ": " + e.message);
		}
	},
	avatar: function (arg, by, room, con) { 
 			if (!this.canUse('avatar', room, by)) return false;
 			if (toId(by) !== 'goddessmashiro') return false;
 				var avatarnumber = Math.round(stripCommands(arg)) 
 				this.say(con, room, '/avatar ' + avatarnumber); 
 				if (avatarnumber < 295) { 
 					this.say(con, room, '/w ' + by + ', __The avatar was changed to number ' + avatarnumber + '.__'); 
 				} else if (avatarnumber > 294) { 
 					this.say(con, room, '/w ' + by + ', __Please choose a valid avatar (1 - 294).__'); 
 				} else if (typeof stripCommands(arg) !== 'number') { 
 					this.say(con, room, '/w ' + by + ', __That isn\'t a number... ._.__'); 
 				}
 	},

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Moderation commands ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        
 	
 	warn: function (arg, by, room, con) {
 		if (modsandros.indexOf(toId(by)) == -1) return false;
 		var warnMsg = arg.split(', ');
 		var tarRoom = 'tha';
 		this.say(con, tarRoom, '__' + warnMsg[0] + ' has been warned by ' + by + '. Reason: ' + warnMsg[1] + '.__');
 	},
 	rk: 'roomkick',
 	roomkick: function(arg, by, room, con) {
 		if (!(CDchecker.roomkick !== 1)) return false;
 		if (!this.canUse('roomkick', room, by)) return false;
 		CDchecker.roomkick = 1;
 		this.say(con, room, '/roomban ' + arg + ', you have been bad!!! D:<');
 		this.say(con, room, '/unroomban ' + arg);
 		this.say(con, room, '/modnote ' + arg + ' has been roomkick\'ed by ' + by + '!');
 		setTimeout(function(){CDchecker.roomkick = 0;}, CDtime.roomkick*1000);
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
			holdhands: 1,
			favemon: 1,
			say: 1,
			himafy: 1,
			warn: 1,
			senpai: 1,
			kitty: 1,
			cri: 1,
			pie: 1,
			roomkick: 1,
			pair: 1,
			blush: 1,
			lewd: 1,
			kupo: 1,
			shorten: 1,
			joke: 1,
			choose: 1,
			runtour: 1,
			tourdq: 1,
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
				if (!(toId(opts[2]) in {on: 1, off: 1}))  return this.say(con, room, 'Incorrect command: correct syntax is .set mod, [' +
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
			if (!Commands[cmd]) return this.say(con, room, '#' + opts[0] + ' is not a valid command.');
			var failsafe = 0;
			while (!(cmd in settable)) {
				if (typeof Commands[cmd] === 'string') {
					cmd = Commands[cmd];
				} else if (typeof Commands[cmd] === 'function') {
					if (cmd in settable) {
						break;
					} else {
						this.say(con, room, 'The settings for #' + opts[0] + ' cannot be changed.');
						return;
					}
				} else {
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
				} else if (this.settings[cmd][room] in settingsLevels) {
					msg = '#' + cmd + ' is available for nerds of rank ' + this.settings[cmd][room] + ' and above.';
				} else if (this.settings[cmd][room] === true) {
					msg = '#' + cmd + ' is available for all nerds in this room.';
				} else if (this.settings[cmd][room] === false) {
					msg = '#' + cmd + ' is not available for use in this room.';
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
				this.say(con, room, 'The command #' + cmd + ' is now ' +
					(settingsLevels[newRank] === newRank ? ' available for users of rank ' + newRank + ' and above.' :
					(this.settings[cmd][room] ? 'available for all users in this room.' : 'unavailable for use in this room.')))
			}
		}
	},
 	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Tournament Commands ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////       
 
 	tour: 'runtour',
	runtour: function(arg, by, room, con) {
		if (!this.canUse('runtour', room, by)) return false;
		if (!this.hasRank(by, '#~')) return false;
		
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
			this.say(con, room, '/wall Tournament will be starting in **' + TourStartTimer / 60000 +'** minutes!^-^')
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
	tourdq: function (arg, by, room, con) {
		if (!this.hasRank(by, '#~')) return false;
		var user = toId(stripCommands(arg));
		this.say(con, room, '/tour dq ' + user);
	},
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Quote Commands ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      

	setqotd: 'setquote',
	setquote: function(arg, by, room, con) {
		if (!this.hasRank(by, '#~')) return false;
		delete this.quotes;
		var user = 'goddessmashiro';
		var message = arg;
		if (!this.quotes) this.quotes = {};
		if (!this.quotes[user]) {
			this.quotes[user] = {};
			this.quotes[user].timestamp = Date.now();
		}
		var msgNumber = 0;
		for (var i in this.quotes[user]) {
			msgNumber++;
		}
		msgNumber = "" + msgNumber;
		this.quotes[user][msgNumber] = message;
		this.writeQuotes();
		this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__Quote has been set!^-^__');
	},
	qotd: 'quote',
	quote: function(arg, by, room, con) {
		if (!this.quotes['goddessmashiro']) return this.say(con, room, '__No quote has been set ;-;__');
		for (var quoteNumber in this.quotes['goddessmashiro']) {
			if (quoteNumber === 'timestamp') continue;
			this.say(con, room, 'Quote of the Day: __' + this.quotes['goddessmashiro'][quoteNumber] + '__');
		}
		this.writeQuotes();
	},
	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Note Commands /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
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
/// Favorite Pokemon //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

        setfavemon: function(arg, by, room, con) {
                var tarRoom = room;
                if (!this.settings.favemon) this.settings.favemon = {};
                if (this.hasRank(by, '#~') && arg.split(", ").length !== 1) {
                        if (!this.settings.favemon[tarRoom]) this.settings.favemon[tarRoom] = {};
                        if (arg.split(", ").length !== 2) return this.say(con, room, 'Syntax is: #setfavemon [user], [pokemon]');
                        var user = toId(arg.split(", ")[0]);
                        var link = arg.split(", ")[1];
                        if (user.length < 1 || user.length > 18) return this.say(con, room, 'That\'s not a real username!');
                } else if (this.canUse('setfavemon', room, by)) {
                        var link = arg;
                        var user = toId(by);
                } else {
                        return false;
                }
                if (!this.settings.favemon[user]) this.settings.favemon[user] = {};
                var foundMon = false;
                var monId = toId(link.replace(/(shiny|mega)/i, ''));
                for (mon in Pokedex) {
                        if (toId(Pokedex[mon].species) === monId) {
                                foundMon = true;
                                break;
                        }
                }
                if (!foundMon) return this.say(con, room, '\'' + link + '\' is not a valid Pokemon!');
                this.settings.favemon[user]['link'] = link;
                this.writeSettings();
                this.say(con, room, '/w ' + toId(by) + ', __Your favorite pokemon has been set to ' + link + '!^-^__');
                var text = '';
        },
        favemon: function(arg, by, room, con) {
                if (this.canUse('favemon', room, by) || room.charAt(0) === ',') {
                        var text = '';
                } else {
                        var text = '/pm ' + by + ', ';
                }
                if (!arg) {
                        if (this.settings.favemon[toId(by)]) {
                                return this.say(con, room, text + by + '\'s favorite Pokemon is __' + this.settings.favemon[toId(by)]['link'] + '__!');
                        } else {
                                return this.say(con, room, '' + text + 'There is no favorite Pokemon set for ' + arg + '.');
                        }
                }
                var user = toId(arg);
                if (user.length < 1 || user.length > 18) return this.say(con, room, 'That\'s not a real username!');
                if (!this.settings.favemon[user]) return this.say(con, room, '' + text + 'There is no favorite Pokemon set for ' + arg + '.');
                var link = this.settings.favemon[user]['link'];
                this.say(con, room, text + arg + '\'s favorite Pokemon: ' + link);
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
                } else if (this.canUse('setselfie', room, by)) {
                        var link = arg;
                        var user = toId(by);
                } else {
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
        		} else {
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
                } else {
                        var text = '/pm ' + by + ', ';
                }
                if (!arg) {
                        if (this.settings.selfie[toId(by)]) {
                                return this.say(con, room, text + by + '\'s selfie is ' + this.settings.selfie[toId(by)]['link'] + '!');
                        } else {
                                return this.say(con, room, '' + text + '__No selfie has been set ;-;__');
                        }
                }
                var user = toId(arg);
                if (user.length < 1 || user.length > 18) return this.say(con, room, 'That\'s not a real username!');
                if (!this.settings.selfie[user]) return this.say(con, room, '__No selfie has been set ;-;__');
                var link = this.settings.selfie[user]['link'];
                this.say(con, room, text + arg + '\'s selfie is ' + link + '!');
                
        },
        /*shorten: function (arg, by, room, con) {
 		if (!this.canUse('shorten', room, by) || room.charAt(0) === ',') return false;
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
                        self.say(con, room, resObject.data.url);
                });
    	},*/

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// General Commands //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

	pair: function(arg, by, room, con) {
		if (!(CDchecker.pair !== 1)) return false;
 		if (!this.canUse('pair', room, by)) return false;
 		CDchecker.pair = 1;
 		var text = '';
		if (toId(by) == 'goddessmashiro' && toId(arg) == 'goddessbriyella', 'omegaxis14', 'themansavage', 'starbloom') {
			var rand = ~~(40 * Math.random() + 1);
			text += by + ' and ' + arg + ' are ' + (60 + rand) + '% compatible!';
		} else {
        	var rand = ~~(100 * Math.random() + 1);
        	text += by + ' and ' + arg + ' are ' + rand + '% compatible!';
		}
        	this.say(con, room, text);
        	setTimeout(function(){CDchecker.pair = 0;}, CDtime.pair*1000);
	},
	lewd: function(arg, by, room, con) {
        	if (!this.canUse('lewd', room, by) || room.charAt(0) === ',') return false;
        	this.say(con, room, 'l-lewd..!! /.\\');
	},
	kupo: function(arg, by, room, con) {
		if (!this.canUse('kupo', room, by) || room.charAt(0) === ',') return false;
		this.say(con, room, '/me pokes kupo on the nose o3o');
	},
	holdhands: function(arg, by, room, con) {
		if (!this.canUse('holdhands', room, by) || room.charAt(0) === ',') return false;
		this.say(con, room, 'ヽ( ͡° ͜ʖ͡°)ﾉヽ( ͡° ͜ʖ͡°)ﾉ');
	},
	love: function(arg, by, room, con) {
		if (!this.canUse('love', room, by) || room.charAt(0) === ',') return false;
		this.say(con, room, '/w goddessmashiro, __"I love you^-^<3" ~' + by + '__');
	},
	himafy: function(arg, by, room, con) {
		var uMsg = "";
		if (!this.canUse('himafy', room, by) || room.charAt(0) === ',') return false;
		var narg = arg.split(" ");
		
		for (var n = 0; n < narg.length; n++)
		{
			uMsg += (narg[n] + 'u ');
		}
		this.say(con, room, uMsg);
	},
	senpai: function(arg, by, room, con) {
        	if (!this.canUse('senpai', room, by) || room.charAt(0) === ',') return false;
        	this.say(con, room, 'n-notice me Bri-senpai... ;~;');
    	},
	kitty: function(arg, by, room, con) {
		if (!this.canUse('kitty', room, by) || room.charAt(0) === ',') return false;
        	this.say(con, room, 'ima kitty =^.^= mew :3');
	},
	blush: function(arg, by, room, con) {
        	if (!this.canUse('blush', room, by) || room.charAt(0) === ',') return false;
        	this.say(con, room, 'o////o');
    	},
	cri: function(arg, by, room, con) {
        	if (!this.canUse('cri', room, by) || room.charAt(0) === ',') return false;
		this.say(con, room, 'Don\'t worry, it will be okay^~^');
        	this.say(con, room, '/me hugs ' + by + ' gently');
    	},
	pie: function(arg, by, room, con) {
        	if (!this.canUse('pie', room, by) || room.charAt(0) === ',') return false;
        	if (toId(arg) == 'goddessmashiro' || toId(arg) == 'mashiro' || toId(arg) == 'mashi' || toId(arg) == 'mashy' || toId(arg) == 'mash' || toId(arg) == 'mashibot')
        	this.say(con, room, 'Nuu, I dun wanna ;w;');
        	else {
        	if (!arg) arg = 'the air';
        	this.say(con, room, '/me throws a pie at ' + arg);
        	}
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
	seen:   function(arg, by, room, con) { // this command is still a bit buggy
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
	/*
	shorten: function (arg, by, room, con) {
 		if (!this.canUse('shorten', room, by) || room.charAt(0) === ',') return false;
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
                        self.say(con, room, resObject.data.url);
                });
    	},
    	*/
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
    		if(room !== 'osu') return false;
    		this.say(con, room, 'osu! is a Japanese rhythm game where the player hits notes in time with the beat of the music. There are 5 different game modes, the most popular being standard osu! and osu! mania.');
    	},
	setprofile: function(arg, by, room, con) {
                var tarRoom = room;
				if (room !== 'osu') return false;
                if (!this.settings.osuprofile) this.settings.osuprofile = {};
                if (this.hasRank(by, '#~') && arg.split(", ").length !== 1) {
                        if (!this.settings.osuprofile[tarRoom]) this.settings.osuprofile[tarRoom] = {};
                        if (arg.split(", ").length !== 2) return this.say(con, room, 'Syntax is: #setprofile [user], [link]');
                        var user = toId(arg.split(", ")[0]);
                        var link = arg.split(", ")[1];
                        if (user.length < 1 || user.length > 18) return this.say(con, room, 'That\'s not a real username!');
                } else if (this.canUse('setprofile', room, by)) {
                        var link = arg;
                        var user = toId(by);
                } else {
                        return false;
                }
                if (!/https?:\/\//.test(link)) return this.say(con, room, 'Link must include http.');
                if (!this.settings.osuprofile[user]) this.settings.osuprofile[user] = {};
				this.settings.osuprofile[user]['link'] = link;
				this.writeSettings();
				this.say(con, room, (room.charAt(0) === ',' ? '' : '/pm ' + by + ', ') + '__Your profile link has been set!^-^__');
        },
	profile: function(arg, by, room, con) {
                if (room !== 'osu') return false;
                if (this.canUse('profile', room, by) || room.charAt(0) === ',') {
                        var text = '';
                } else {
                        var text = '/pm ' + by + ', ';
                }
                if (!arg) {
                	if (!this.settings.osuprofile[toId(by)]) return this.say(con, room, '__No profile has been set ;-;__');
                        if (this.settings.osuprofile[toId(by)]) return this.say(con, room, text + by + '\'s osu! profile is ' + this.settings.osuprofile[toId(by)]['link'] + '!');
                }
                var user = toId(arg);
                if (user.length < 1 || user.length > 18) return this.say(con, room, 'That\'s not a real username!');
                if (!this.settings.osuprofile[user]) return this.say(con, room, '__No profile has been set ;-;__');
                var link = this.settings.osuprofile[user]['link'];
                this.say(con, room, text + arg + '\'s osu! profile is ' + link + '!');
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
                } else if (this.canUse('setfavemap', room, by)) {
                        var link = arg;
                        var user = toId(by);
                } else {
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
                } else {
                        var text = '/pm ' + by + ', ';
                }
                if (!arg) {
                        if (this.settings.favemap[toId(by)]) {
                                return this.say(con, room, text + by + '\'s favorite beatmap is ' + this.settings.favemap[toId(by)]['link'] + '!');
                        } else {
                                return this.say(con, room, '' + text + '__No favorite beatmap has been set ;-;__');
                        }
                }
                var user = toId(arg);
                if (!this.settings.favemap[user]) return this.say(con, room, '__No favorite beatmap has been set ;-;__');
                var link = this.settings.favemap[user]['link'];
                this.say(con, room, text + arg + '\'s favorite is ' + link + '!');
        },
};
