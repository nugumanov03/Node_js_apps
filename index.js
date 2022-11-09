const TOKEN = '5412144437:AAES3jpaWY6vhamVdoA04cr0P9Am7FjkacQ';
var TelegramBot = require('node-telegram-bot-api');
/*const options = {
  webHook: {
    port: process.env.PORT
  }
};*/
// const url = process.env.APP_URL || 'https://discordapp.com/api/webhooks/626046425444384797/8swx-Dujp1nIHOScJM0nM-IYRQCJiMf-fQAPoQbLsIlCWWs8QBDyRM2MYLZzksncrTFH';
//const bot = new TelegramBot(TOKEN, options);
const bot = new TelegramBot(TOKEN, { polling: true });

//bot.setWebHook(`${url}/bot${TOKEN}`);
//
const hellomsg = 'Для авторизации отправьте боту комманду /me и через пробел свой уникальный код, выданный нами. \nНапример: \n\n/me abc123';
// var firebase = require('firebase');

// const firebaseConfig = {
// 	apiKey: "AIzaSyBKyXAzLALDBw_Z2fJLf_kPDc7naAsTkP0",
// 	authDomain: "slayerkbtubot.firebaseapp.com",
// 	databaseURL: "https://slayerkbtubot.firebaseio.com",
// 	projectId: "slayerkbtubot",
// 	storageBucket: "slayerkbtubot.appspot.com",
// 	messagingSenderId: "971500832165",
// 	appId: "1:971500832165:web:39ce6f4ee987dc4ad7544c"
//   };

// var app = firebase.initializeApp(firebaseConfig);
// var database = firebase.database();
// const { database } = require('./firebase.js')
const { initializeApp } = require('firebase/app')
const { getDatabase, ref , set , onValue} = require('firebase/database')

const firebaseConfig = {
    apiKey: "AIzaSyA5lpwu7SjYosrOYRyRS7cLHPDEmCY3Buw",
    authDomain: "tg-bot-kiperlot.firebaseapp.com",
    databaseURL: "https://tg-bot-kiperlot-default-rtdb.firebaseio.com",
    projectId: "tg-bot-kiperlot",
    storageBucket: "tg-bot-kiperlot.appspot.com",
    messagingSenderId: "200722192344",
    appId: "1:200722192344:web:58ecfe6f9acca8252444ad",
    measurementId: "G-LR4Q3LTVRH"
};
// // const serviceAccount = require('./creds.json')

// // initializeApp({
// //     credential: cert(serviceAccount)
// // })
const app = initializeApp(firebaseConfig)
const database = getDatabase()


const adminChatId = -333949531;
const admins = ['Dr33Deathman', 'divvert', '754962982', '474659479', 'nugumanov03'];
const superAdmins = ['Dr33Deathman', 'divvert', '754962982', '474659479' , 'nugumanov03'];


// var playerss = ref(database , "/players/" + "13" )
// set(playerss ,{
// 	username : "Salam",
// 	emal : "Salam2"
// })
// console.log(playerss)

bot.onText(/\/start/, msg => {
	bot.sendMessage(msg.chat.id, hellomsg);
});


bot.onText(/\/begin_game/, msg => {
	if (superAdmins.includes(msg.from.username)) {
		var ref = database.ref('/players');
		onValue(database, (snapshot) => {
		// ref.once('value', function(snapshot) {
			var players = [];

			snapshot.forEach(function(childSnapshot) {
				var chat_id = childSnapshot.val().chat_id;
				if (chat_id !== undefined) {
					players.push(childSnapshot);
				}
			});

			for (var i = 0; i < players.length; i++) {
				(function(i) {
					setTimeout(function() {
						bot.sendMessage(players[i].val().chat_id, `Игра началсь, ${players[i].val().fname}!\nСкоро вам выдадут жертву!`);
					}, 40);
				}(i));
			}

			players = shuffle(players);

			for (var i = 0; i < players.length-1 ; i++) {
				(function(i) {
					setTimeout(function() {
						var newRef = database.ref('/players/' + players[i].key + '/victim');
						newRef.set(players[i+1].key);
						bot.sendPhoto(players[i].val().chat_id, players[i+1].val().photo_id, {caption:  
																'Ваша жертва: \n'   + players[i+1].val().fname + ' '
																					+ players[i+1].val().lname + ', '
																					+ players[i+1].val().faculty + ', '
																					+ players[i+1].val().year });
					}, 1000);
				}(i));
			}

			var lastPlayer = database.ref('/players/' + players[players.length-1].key + '/victim');
			lastPlayer.set(players[0].key);
			bot.sendPhoto(players[players.length-1].val().chat_id, players[0].val().photo_id, {caption:  
																'Ваша жертва: \n'   + players[0].val().fname + ' '
																					+ players[0].val().lname + ', '
																					+ players[0].val().faculty + ', '
																					+ players[0].val().year });	
		}, {
			onlyOnce: true
		  });
	}else{
		bot.sendMessage(msg.chat.id, "Ты не Админ))");
	}
});

bot.onText(/\/kill/, msg => {
	var id = msg.text.slice(6);
	id = id.trim();

	if (id !== '') {
		var victimRef = database.ref('/players/' + id);
		victimRef.once('value', function(snapshot) {
			var test = snapshot.val();
			if (test === null) {
				bot.sendMessage(msg.chat.id, 'Убийство не удалось, проверьте правильность команды.');
			} else {
				var killerChatRef = database.ref('chats/' + msg.chat.id);
				killerChatRef.once('value', function(killerChatRefSnap) {
					var killer_id = killerChatRefSnap.val();
					var killerRef = database.ref('players/' + killer_id);
					killerRef.once('value', function(killerSnap) {
						if (killerSnap.val().status === 'alive') {
							var victim_id = killerSnap.val().victim;
							var selfKIll = 'Не знаете ли, что тела ваши суть храм живущего в вас Святого Духа, Которого имеете вы от Бога, и вы не свои? Ибо вы куплены дорогою ценою';
							if (id === killerSnap.key) {
								bot.sendMessage(msg.chat.id, selfKIll);
							} 
							else if (id === victim_id) {
								var killer_killcount = killerSnap.val().killcount;
								var killerKillCountRef = database.ref('players/' + killer_id + '/killcount');
								killerKillCountRef.set(parseInt(killer_killcount)+1);
								var killerKillListRef = database.ref('players/' + killer_id + '/kills/' + new Date());
								killerKillListRef.set(victim_id);

								var victimStatusRef = database.ref('players/' + victim_id + '/status');
								victimStatusRef.set('dead');
								bot.sendMessage(snapshot.val().chat_id, 'Вы были убиты!');

								var nextVictimRef = database.ref('players/' + snapshot.val().victim);
								nextVictimRef.once('value', function(nextVictimSnap) {
									var newKillerVictimRef = database.ref('players/' + killer_id + '/victim');
									newKillerVictimRef.set(nextVictimSnap.key);	
									var newKillerVictimInfo = nextVictimSnap.val().fname + ' ' 
															+ nextVictimSnap.val().lname + ', '
															+ nextVictimSnap.val().faculty + ', '
															+ nextVictimSnap.val().year;

									bot.sendMessage(adminChatId, killerSnap.val().fname + ' ' + killerSnap.val().lname + ' ' + 
																 killerSnap.val().faculty + ' ' + killerSnap.val().year);
									bot.sendMessage(msg.chat.id, 'Вы убили свою жертву!');
									setTimeout(function() {
										bot.sendPhoto(msg.chat.id, nextVictimSnap.val().photo_id, {caption: 'Ваша следующая жертва \n' 
																											+ newKillerVictimInfo});
									}, 2000);
								});
							} else {
								bot.sendMessage(msg.chat.id, 'Убийство не удалось, проверьте правильность команды.');
							}
						} else {
							bot.sendMessage(msg.chat.id, 'Вы мертвы');
						}					
					});
				});
			}
		});
	} else {
		bot.sendMessage(msg.chat.id, 'Введите /kill и код вашей жертвы. Например: \n/kill abc123');
	}
});

bot.onText(/\/code/, msg => {
	var chatIdRef = database.ref('chats/' + msg.chat.id);
	chatIdRef.once('value', function(snapshot) {
		if (snapshot.val() === null) {
			bot.sendMessage(msg.chat.id, 'Вы не авторизованы');
		} else {
			bot.sendMessage(msg.chat.id, `Ваш секретный код: ${snapshot.val()}`);
		}
	});
});

bot.onText(/\/stats/, msg => {
	var chatIdRef = database.ref('chats/' + msg.chat.id);
	chatIdRef.once('value', function(snapshot) {
		if (snapshot.val() === null) {
			bot.sendMessage(msg.chat.id, 'Вы не авторизованы');
		} else {
			var playerRef = database.ref('players/' + snapshot.val());
			playerRef.once('value', function(playerSnap) {
				bot.sendMessage(msg.chat.id, 	'Имя: ' + playerSnap.val().fname + '\n' +
												'Фамилия: ' + playerSnap.val().lname + '\n' + 
												'Факультет: ' + playerSnap.val().faculty + '\n' + 
												'Год обучения: ' + playerSnap.val().year + '\n' + 
												'Статус: ' + playerSnap.val().status + '\n' + 
												'Количество убийств: ' + playerSnap.val().killcount);
			});
		}
	});
});

bot.onText(/\/rules/, msg => {
	bot.sendMessage(msg.chat.id, "С правилами игрового процесса вы можете ознакомиться по ссылке:\nhttps://teletype.in/@slayer_kbtu_bot/BkmVDi2DH");
	console.log(msg.chat.id);
	console.log(msg.from.username);
});

bot.onText(/\/report/, msg => {
	var reportText = msg.text.slice(8);
	if (reportText !== "") {
		console.log(msg.from);
		bot.sendMessage(adminChatId, `Report from ${msg.from.username} ${msg.from.id}\n${reportText}`);
	}
});

bot.onText(/\/msg/, msg => {
	if (admins.includes(msg.from.username)) {
		if (msg.caption !== "") {
			var MSG = msg.text.slice(5);
			var arr = MSG.split(' ');
			if (arr.length > 1) {
				bot.sendMessage(arr[0], msg.text.slice(14));
			} else {
				bot.sendMessage(msg.chat.id, 'Отправка сообщения не удалась. Вы некорректно ввели данные');
			}
		} else {
			bot.sendMessage(msg.chat.id, 'Отправка сообщения не удалась. Вы некорректно ввели данные');
		}
	} else {
		bot.sendMessage(msg.chat.id, 'Отправка сообщения не удалась. Вы не админ' );
	}
});

bot.onText(/\/broadcast/, msg => {
	if (superAdmins.includes(msg.from.username)) {
		var broadcastMsg = msg.text.slice(11);
		if (broadcastMsg !== '') {
			var registeredChatsRef = database.ref('chats');
			registeredChatsRef.once('value', function(snapshot) {
				snapshot.forEach(function(childSnapshot) {
					setTimeout(function() {
						bot.sendMessage(childSnapshot.key, broadcastMsg);
					}, 1000); 
				});
			});

		}
	}
});

bot.onText(/\/delete/, msg => {
	if (admins.includes(msg.from.username)) {
		if (msg.text[7] === " ") {
			var id = msg.text.slice(8)
			if (id !== "") {
				var playerRef = database.ref('/players/' + id);
				playerRef.child('status').set('dead');
				playerRef.once('value', function(snapshot) {
					var chat_id = snapshot.val().chat_id;
					bot.sendMessage(chat_id, 'Вы были дисквалифицированы');
					var victim_id = snapshot.val().victim;
					var prevKiller_id = '';

					var playersRef = database.ref('/players');
					playersRef.once('value', function(snapshot) {
						snapshot.forEach(function(childSnapshot) {
							if (childSnapshot.val().victim === id && childSnapshot.val().status === 'alive') {
								var prevKillersVictimRef = database.ref('/players/' + childSnapshot.key + '/victim');
								prevKillersVictimRef.set(victim_id);
								bot.sendMessage(childSnapshot.val().chat_id, 'Ваша жертва была дисквалифицриована.');
								var newVictimRef = database.ref('/players/' + victim_id);
								newVictimRef.once('value', function(newVictimSnap) {
									var newVictimInfo = newVictimSnap.val().fname + ' ' + newVictimSnap.val().lname + '\n'
														+ newVictimSnap.val().faculty + ', ' + newVictimSnap.val().year;
									setTimeout(function() {
										bot.sendPhoto(childSnapshot.val().chat_id, newVictimSnap.val().photo_id, {caption: 
											'Ваша новая жертва \n' + newVictimInfo});
									}, 2000);
								});
							}
						});
					});
				});
			}		
		}
	}
});


bot.onText(/\/all/, msg => {
	var playersRef = database.ref('/players');
	playersRef.ref.orderByChild('killcount').once('value', function(snapshot) {
		var players = [];
		snapshot.forEach(function(childSnapshot) {
			if (childSnapshot.val().status === 'alive' && childSnapshot.val().chat_id !== undefined) {
				players.push(childSnapshot.val());
			}
		});

		players = players.reverse();
		var len = players.length;
		var cycles = Math.floor(len / 60);
		let str = 'Топ всех игроков: \n\n';	
		
			for (let index = 1; index < cycles+1; index++) {
				for (var i = 60*(index-1); i < 60*index; i++) {
					str += (i + 1) + `. ${players[i].fname} ${players[i].lname}, ${players[i].killcount} убийств\n`;
				}
					setTimeout(function sendmsgsimple(str) {
						bot.sendMessage(msg.chat.id, str);
					}, 100, str);
					str = "";
			}
				
		let str1 = "";
		for (let index = cycles*60; index < len; index++) {
			str1 += (index + 1) + `. ${players[index].fname} ${players[index].lname}, ${players[index].killcount} убийств\n`;
		}
		setTimeout(function sendmsgsimple() {
			bot.sendMessage(msg.chat.id, str1);
		}, 1500);
		
	});
});


bot.onText(/\/top/, msg => {
	var playersRef = database.ref('/players');
	playersRef.ref.orderByChild('killcount').once('value', function(snapshot) {
		var players = [];
		snapshot.forEach(function(childSnapshot) {
			if (childSnapshot.val().status === 'alive' && childSnapshot.val().chat_id !== undefined) {
				players.push(childSnapshot.val());
			}
		});

		players = players.reverse();
		var len = 10;
		if(players.length < 10) len = players.length;
		var str = '🏆 Топ игроков 🏆\n\n';
		for (var i = 0; i < len; i++) {
			str += (i + 1) + `. ${players[i].fname} ${players[i].lname}, ${players[i].killcount} убийств\n`;
		}
		bot.sendMessage(msg.chat.id, str);
	});
});



bot.onText(/\/victim/, msg => {
	var chatRef = database.ref('/chats/' + msg.chat.id);
	chatRef.once('value', function(snapshot) {
		if (snapshot.val() !== null) {
			var player_id = snapshot.val();
			var playerRef = database.ref('players/' + player_id);
			playerRef.once('value', function(playerSnap) {
				var victim_id = playerSnap.val().victim;
				var victimRef = database.ref('players/' + victim_id);
				victimRef.once('value', function(victimSnap) {
					if (victimSnap.val() !== null) {
						var victimInfo  = victimSnap.val().fname + ' ' 
									+ victimSnap.val().lname + ', '
									+ victimSnap.val().faculty + ', '
									+ victimSnap.val().year; 
						bot.sendPhoto(msg.chat.id, victimSnap.val().photo_id, {caption: 'Ваша жертва: \n' + victimInfo});
					}
				});
			});
		} else {
			bot.sendMessage(msg.chat.id, 'Вы не авторизованы');
		}
	});
});

bot.onText(/\/check_status/, msg => {
	if(superAdmins.includes(msg.from.username)) {
		var playersRef = database.ref('/players');
		playersRef.once('value', function(snapshot) {
			var alive = 0;
			snapshot.forEach(function(child) {
				if (child.val().status === 'alive') {
					alive += 1;
				}
			});
			bot.sendMessage(adminChatId, 'Количество живых игроков: ' + alive);
		});
	}
});

bot.onText(/\/check_todelete/, msg => {
	if(superAdmins.includes(msg.from.username)) {
		var playersRef = database.ref('/players');
		playersRef.once('value', function(snapshot) {
			var str = 'To delete: \n\n';
			snapshot.forEach(function(child) {
				if (child.val().status === 'alive' && child.val().killcount === 0) {
					str += child.key + ' ' + child.val().fname + ' ' + child.val().lname + '\n';
				}
			});
			bot.sendMessage(adminChatId, str);
		});
	}
});

function shuffle(arr) {
    var cnt = arr.length, temp, index;
    while (cnt > 0) {
        index = Math.floor(Math.random() * cnt);
        cnt--;
        temp = arr[cnt];
        arr[cnt] = arr[index];
        arr[index] = temp;
    }
    return arr;
}

bot.on('photo', (msg) => {
	if (admins.includes(msg.from.username)) {
		var ref = database.ref('players')
		var player_id = Math.random().toString(36).slice(2).substr(0,6);

		if (msg.caption !== "") {
			var info = msg.caption;
			// info = info.replace(/ /g,''); Теперь формат ввода "Имя Фамилия Факультет Курс" без запятых
			var arr = info.split(' ');
			if (arr.length === 4) {
				ref.child(player_id).child("fname").set(arr[0]);
				ref.child(player_id).child("lname").set(arr[1]);
				ref.child(player_id).child("faculty").set(arr[2]);
				ref.child(player_id).child("year").set(arr[3]);
				ref.child(player_id).child("photo_id").set(msg.photo[msg.photo.length - 1].file_id);
				ref.child(player_id).child("status").set('alive');
				ref.child(player_id).child("killcount").set(0);
				ref.child(player_id).child("admin").set(msg.from.username);
				bot.sendMessage(msg.chat.id, 'Регистрация прошла успешно! Код игрока: ' + player_id);
			} else {
				bot.sendMessage(msg.chat.id, 'Регистрация не удалась. Вы некорректно ввели данные');
			}
		} else {
			bot.sendMessage(msg.chat.id, 'Регистрация не удалась. Нет описания к фотке');
		}
	} else {
		bot.sendMessage(msg.chat.id, 'Регистрация не удалась. Вы не админ');
	}
});

bot.onText(/\/me/, msg => {
	var id = msg.text.slice(4);
	id = id.trim();

	if (id !== '') {
		var ref = database.ref('/players/' + id);
		ref.once('value', function(snapshot) {
			var test = snapshot.val();
			if (test === null) {
				bot.sendMessage(msg.chat.id, 'Авторизация не удалась, проверьте правильность команды.');
			}
			else {
				var refChatsList = database.ref('chats/' + msg.chat.id);
				refChatsList.set(id);
				ref.child('chat_id').set(msg.chat.id);
				bot.sendMessage(msg.chat.id, 'Вы успешно авторизованы. Ожидайте начала игры.');
			}
		});
	} else {
		bot.sendMessage(msg.chat.id, 'Введите /me и ваш код');
	}
});

bot.onText(/\/check_amount/, msg => {
	if(superAdmins.includes(msg.from.username)) {
		var playersRef = database.ref('/players');
		playersRef.once('value', function(snapshot) {
			var registeredCount = 0;
			snapshot.forEach(function(child) {
				registeredCount += 1;
			});
			var chatsRef = database.ref('/chats');
			chatsRef.once('value', function(snap) {
				var authorizedCount = 0;
				snap.forEach(function(childSnap) {
					authorizedCount += 1;
				})
				bot.sendMessage(msg.chat.id, 'Registered: ' + registeredCount + '\nAuthorized: ' + authorizedCount);
			});
		});
	}
});

bot.onText(/\/check_non_authorized/, msg => {
	if(superAdmins.includes(msg.from.username)) {
		var playersRef = database.ref('/players');
		playersRef.once('value', function(snapshot) {
			var non = '';
			snapshot.forEach(function(child) {
				if (child.val().chat_id === undefined) {
					non += child.val().fname + ' ' + child.val().lname + '\n';
				}
			});
			bot.sendMessage(msg.chat.id, non);
		});
	}
});



/*
1) Регистрация
	а) Игрок приходит в стекляшку
	б) Админ его фоткает и отправляет боту фотку с ФИО, факультет, курс
	в) Бот создает объект игрока в базе с уникальным id

2) Конец регистрации
	а) Игроки приходят в стекляшку за своим id и ссылкой на бота
	б) Игроки отправляют боту свой id (/me "id")
	в) Бот запоминает их в поле chat_id
	г) Бот оповещает игроков о времени старта игры и объясняет правила игры

3) Начало игры
	а) Админ оповещает игроков о скором старте игры (/broadcast "text")
	б) Админ запускает игру (/begin_game)
	в) Игрокам приходит сообщение о старте игры
	г) Игрокам приходит сообщение с фотографией и информацией о жертве

4) Ход игры
	а) Игрок убивает жертву
	б) Жертва отправляет боту команду (/code)
	в) Убийца отправляет боту команду (/kill "code")
	г) Жертве приходит сообщение - "Вас убили"
	д) Убийце приходит сообщение о следующей жертве


Команды админа:

/register photo (description - firstname, lastname, faculty, year) 
/delete player_id 
/begin_game 
/broadcast text (рассылка)
/top (выдает топ 10 живых игроков по убийствам (число можно поменять))
/rules 

Команды игрока: 

/me id 
/kill id 
/code (показывает код игрока)
/top (выдает топ 10 живых игроков по убийствам (число можно поменять))
/stats (информация об игроке)
/report text (сообщение админу (хз нужно или нет))
/rules 




Привет я Slayer Bot 🤖
Я помогу тебе авторизироваться, убить свою жертву, смотреть ТОП игроков и много чего еще!
Вот список доступных комманд: 


/rules:
Территория: Здание университета КБТУ, центральный двор КБТУ\n\nПравила игры:\n2.1. Суть игры заключается в охоте за жертвой. Каждый участник является охотником и жертвой одновременно.\n2.2. Игра начинается для всех одновременно: участник получает информацию о своей жертве (фотография, фамилия, имя, факультет, курс). В то же время, другой участник получает информацию об этом охотнике.\n2.3. Жертва считается убита, если охотник показал ей сообщение от бота с ее именем, сказав при этом кодовое слово ("Ничего личного"), находясь в здании КБТУ тет-а-тет в одном помещении или в случае, когда в радиусе 10 метров никого нет. Нельзя убивать при свидетелях - будь то участник игры или просто посторонний человек. Каждый участник обязан отдать своему охотнику свой уникальный код, в случае совершения убийства.\n\n⚠⚠⚠ВАЖНО⚠⚠⚠\n3.1. Каждый день в периодах 10:50-11:00, 13:50-14:00, 16:50-17:00 объявляется время Free Killing. В это время свидетели не будут являться помехой для вас (охотнику достаточно схватить руку своей жертвы на обозначенной территории.\n3.2. Участник, зарегистрировавший самое первое убийство, получает “бессмертие” на один день.\n3.3. Фиксация убийства проводится через бот, вам достаточно ввести команду /kill *id вашей жертвы*, если id правильный, вы получите информацию вашей следующей жертвы.\n3.4. Подпитка: Игроки в течение двух дней должны найти свою жертву, иначе будут исключаться из игры.\n3.5. Исключено полное физическое насилие со стороны охотника по отношению к жертве, в случае обнаружения данного факта, игрок будет дисквалифицирован.\n\nФинал игры:\nИгра заканчивается тогда, когда все жертвы убиты или тогда, когда вышло время, отведенное на игру.\nПобеждает охотник, который совершил наибольшее количество убийств. Если количество жертв у нескольких охотников одинаковое, учитывается время выполнения последнего убийства.\nИгроки, занявшие 1-ое, 2-ое и 3-е места, получат денежное вознаграждение в размере 1500 тг. за каждое убийство.




/me - id - Авторизоваться в системе
/kill - id - Убить жертву
/victim - Показать вашу текущую жертву
/code - Показать ваш код
/top - Выдает топ 10 живых игроков по убийствам
/all - Показать топ среди всех участвующих игроков
/stats - Ваша личная статистика (Не бейте регистрирующих за перепутанные имя и фамилию)
/report - text - Личное сообщение администратору игры
/rules - Правила игрового процесса
/broadcast - text (Команда для администраторов игры)
*/


