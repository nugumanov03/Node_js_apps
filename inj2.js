const TOKEN = '5412144437:AAES3jpaWY6vhamVdoA04cr0P9Am7FjkacQ';
var TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(TOKEN, { polling: true });

const { initializeApp } = require('firebase/app')
const { getDatabase, ref , set , onValue , query , orderByChild, child} = require('firebase/database')

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

const app = initializeApp(firebaseConfig)
const database = getDatabase()



const adminChatId =  784892442;
const chages = 123123;
const admins = ['nugumanov03'];
const superAdmins = ['nugumanov03'];

const hellomsg = 'Для авторизации отправьте боту комманду /me и через пробел свой уникальный код, выданный нами. \nНапример: \n\n/me abc123';

// * done
bot.onText(/\/start/, msg => {
	bot.sendMessage(msg.chat.id, hellomsg);
});

// ? need test  
bot.onText(/\/begin_game/, msg => {
	console.log("No error 0");

	if (superAdmins.includes(msg.from.username)) {
		var ref2 = ref(database , 'players/');
		console.log("No error 1");
		onValue(ref2, (snapshot) => {
		// ref.once('value', function(snapshot) {
			console.log("No error 2");

			var players = [];

			snapshot.forEach(function(childSnapshot) {
				console.log("No error 3");

				var chat_id = childSnapshot.val().chat_id;
				console.log(chat_id)
				if (chat_id !== undefined) {
					players.push(childSnapshot);
				}
			});
			console.log("End of not shuffled")

			for (var i = 0; i < players.length; i++) {
				(function(i) {
					console.log(players[i].val().chat_id);
					console.log(players[i].val().fname);
					setTimeout(function() {
						bot.sendMessage(players[i].val().chat_id, `Игра началсь, ${players[i].val().fname}!\nСкоро вам выдадут жертву!`);
					}, 40);
				}(i));
			}
			console.log("No error 4");

			players = shuffle(players);
			console.log(players)	

			for (var i = 0; i < players.length-1 ; i++) {
				(function(i) {
					console.log("NO error => " , i);
					setTimeout(function() {
						var newRef = ref(database , 'players/' + players[i].key  + '/victim');
						// var lastPlayer = ref(database , '/players/' + players[players.length-1].key + '/victim');
						set( newRef , players[i+1].key);

						// var kk =players[i+1].key;
						// set(newRef , {
						// 	fname : players[i].val().fname,
						// 	lname : players[i].val().lname,
						// 	faculty :players[i].val().faculty,
						// 	year : players[i].val().year,
						// 	// photo_id : msg.photo[msg.photo.length - 1].file_id,
						// 	killcount : players[i].val().killcount,
						// 	admin : players[i].val().admin,
						// 	victim : kk});
						console.log("No error 5");

						// newRef.set(players[i+1].key);
						// bot.sendMessage(players[i].val().chat_id ,'Ваша жертва: \n'   + players[i+1].val().fname + ' '
						// + players[i+1].val().lname + ', '
						// + players[i+1].val().faculty + ', '
						// + players[i+1].val().year )
						// bot.sendPhoto(players[i].val().chat_id, players[i+1].val().photo_id, {caption:  
						bot.sendPhoto(players[i].val().chat_id, players[i+1].val().photo_id, {caption:  
																'Ваша жертва: \n'   + players[i+1].val().fname + ' '
																					+ players[i+1].val().lname + ', '
																					+ players[i+1].val().faculty + ', '
																					+ players[i+1].val().year });
					}, 1000);
				}(i));
			}

			var lastPlayer = ref(database , '/players/' + players[players.length-1].key + '/victim');

			console.log("No error 6");

			set( lastPlayer , players[0].key);
				console.log("No error 7");
				// bot.sendMessage(players[players.length-1].val().chat_id ,'Ваша жертва: \n'   + players[0].val().fname + ' '
				// + players[0].val().lname + ', '
				// + players[0].val().faculty + ', '
				// + players[0].val().year )
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
// ? need test 
bot.onText(/\/kill/, msg => {
	var id = msg.text.slice(6);
	id = id.trim();
	console.log("No error 1");
	if (id === '') {
		bot.sendMessage(msg.chat.id, 'Введите /kill и код вашей жертвы. Например: \n/kill abc123');
		return;
	}
	var victimRef = ref(database ,'/players/' + id);
	console.log("No error 2");

	// victimRef.once('value', function(snapshot) {
	onValue(victimRef, (snapshot) => {
		var test = snapshot.val();
		console.log("No error 4");
		if (test === null) {
			console.log("No error 5");
			bot.sendMessage(msg.chat.id, 'Убийство не удалось, проверьте правильность команды.');
			return;
		} 
		console.log("No error 6");

		var killerChatRef = ref(database,'chats/' + msg.chat.id);
		console.log("No error 7");

		onValue(killerChatRef, (killerChatRefSnap) => {
			console.log("No error 8");


			var killer_id = killerChatRefSnap.val();
			var killerRef = ref( database ,'players/' + killer_id);
			console.log("No error 9");

			onValue(killerRef, (killerSnap) => {
				console.log("No error 10r");


			if (killerSnap.val().status !== 'alive') {
				bot.sendMessage(msg.chat.id, 'Вы мертвы');
				return;
			}

			// if (killerSnap.val().status === 'alive') {
			console.log("No error 11");

			var victim_id = killerSnap.val().victim;
			var selfKIll = 'Не знаете ли, что тела ваши суть храм живущего в вас Святого Духа, Которого имеете вы от Бога, и вы не свои? Ибо вы куплены дорогою ценою';
			if (id === killerSnap.key) {
				bot.sendMessage(msg.chat.id, selfKIll);
				console.log("No error 12");
				return;
			} 
			console.log("No error 14");

				// var killer_killcount = killerSnap.val().killcount;
				var killer_killcount = 3;
				var killerKillCountRef = ref(database ,'players/' + killer_id + '/killcount');
				set(killerKillCountRef , parseInt(killer_killcount)+1)
				console.log("No error 15");

				// killerKillCountRef.set(parseInt(killer_killcount)+1);
				// var killerKillListRef = ref(database , 'players/' + killer_id + '/kills/' + new Date());
				var killerKillListRef = ref(database , 'players/' + killer_id + '/kills/');
				console.log("No error 16");

				// killerKillListRef.set(victim_id);
				dattt = new Date();
				set(killerKillListRef , {
					dattt : victim_id
								})
								console.log("No error 17");


								var victimStatusRef = ref(database , 'players/' + victim_id + '/status');
								// var victimStatusRef = ref(database , 'players/' + victim_id );
								// victimStatusRef.set('dead');
								set(victimStatusRef , 'dead')
								console.log("No error 18");

								bot.sendMessage(snapshot.val().chat_id, 'Вы были убиты!');

								var nextVictimRef = ref(database, 'players/' + snapshot.val().victim);
								console.log("No error 19");

								// nextVictimRef.once('value', function(nextVictimSnap) {
                                    onValue(nextVictimRef, (nextVictimSnap) => {
										console.log("No error 20");

									var newKillerVictimRef = ref( database ,'players/' + killer_id + '/victim');
									console.log("No error 21");

									// var newKillerVictimRef = ref( database ,'players/' + killer_id );
									// newKillerVictimRef.set(nextVictimSnap.key);	
									set(newKillerVictimRef , nextVictimSnap.key)
									console.log("No error 22");

									var newKillerVictimInfo = nextVictimSnap.val().fname + ' ' 
															+ nextVictimSnap.val().lname + ', '
															+ nextVictimSnap.val().faculty + ', '
															+ nextVictimSnap.val().year;
															console.log("No error 13");


									bot.sendMessage(adminChatId, killerSnap.val().fname + ' ' + killerSnap.val().lname + ' ' + 
																 killerSnap.val().faculty + ' ' + killerSnap.val().year);
									bot.sendMessage(msg.chat.id, 'Вы убили свою жертву!');
									setTimeout(function() {
										bot.sendMessage(msg.chat.id ,'Ваша следующая жертва \n' + newKillerVictimInfo )
										// bot.sendPhoto(msg.chat.id, nextVictimSnap.val().photo_id, {caption: 'Ваша следующая жертва \n' 
										// 																	+ newKillerVictimInfo});
									}, 2000);
								}, {
                                    onlyOnce: true
                                  });
                                
										
					}, {
                        onlyOnce: true
                      });
                    
				}, {
                    onlyOnce: true
                  });
			}
		,{
            onlyOnce: true
          });
});

// * done  
bot.onText(/\/code/, msg => {
	var chatIdRef = ref(database ,'chats/' + msg.chat.id);
	// chatIdRef.once('value', function(snapshot) {
        onValue(chatIdRef, (snapshot) => {
		if (snapshot.val() === null) {
			bot.sendMessage(msg.chat.id, 'Вы не авторизованы');
		} else {
			bot.sendMessage(msg.chat.id, `Ваш секретный код: ${snapshot.val()}`);
		}
	},{
        onlyOnce: true
      });
});

// * done
bot.onText(/\/stats/, msg => {
	console.log("No error 1");
	var chatIdRef = ref(database,'chats/' + msg.chat.id);
	// chatIdRef.once('value', function(snapshot) {
        onValue(chatIdRef, (snapshot) => {
			console.log("No error 2");

            if (snapshot.val() === null) {
				console.log("No error 3");

			bot.sendMessage(msg.chat.id, 'Вы не авторизованы');
		} else {
			console.log("No error 4");

			var playerRef = ref(database ,'players/' + snapshot.val());
			// playerRef.once('value', function(playerSnap) {
                onValue(playerRef, (playerSnap) => {
						console.log("No error 5");


				bot.sendMessage(msg.chat.id, 	'Имя: ' + playerSnap.val().fname + '\n' +
												'Фамилия: ' + playerSnap.val().lname + '\n' + 
												'Факультет: ' + playerSnap.val().faculty + '\n' + 
												'Год обучения: ' + playerSnap.val().year + '\n' + 
												'Статус: ' + playerSnap.val().status + '\n' + 
												'Количество убийств: ' + playerSnap.val().killcount);
			}, {
                onlyOnce: true
              });
            
		}
	},{
        onlyOnce: true
      });
    
});

// * done
bot.onText(/\/rules/, msg => {
	bot.sendMessage(msg.chat.id, "С правилами игрового процесса вы можете ознакомиться по ссылке:\nhttps://teletype.in/@slayer_kbtu_bot/BkmVDi2DH");
	console.log(msg.chat.id);
	console.log(msg.from.username);
});

// * done
bot.onText(/\/report/, msg => {
	var reportText = msg.text.slice(8);
	if (reportText !== "") {
		console.log(msg.from);
		bot.sendMessage(adminChatId, `Report from ${msg.from.username} ${msg.from.id}\n${reportText}`);
	}
});
// * done
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


// * done
bot.onText(/\/broadcast/, msg => {
	if (superAdmins.includes(msg.from.username)) {
		var broadcastMsg = msg.text.slice(11);
		if (broadcastMsg !== '') {
			var registeredChatsRef = ref(database ,'chats');
			onValue(registeredChatsRef, (snapshot) => {
				snapshot.forEach((childSnapshot) => {
					// snapshot.forEach(function(childSnapshot) {
						setTimeout(function() {
							bot.sendMessage(childSnapshot.key, broadcastMsg);
						}, 1000); 
					// });
				});
			  }, {
				onlyOnce: true
			  });			  
			  console.log("OK)")
			// registeredChatsRef.once('value', function(snapshot) {
			// 	snapshot.forEach(function(childSnapshot) {
			// 		setTimeout(function() {
			// 			bot.sendMessage(childSnapshot.key, broadcastMsg);
			// 		}, 1000); 
			// 	});
			// });

		}
	}
});

// ? need test
bot.onText(/\/delete/, msg => {
	if (admins.includes(msg.from.username)) {
		if (msg.text[7] === " ") {
			var id = msg.text.slice(8)
			if (id !== "") {
				var playerRef = ref(database ,'/players/' + id);
				var playerRefSTATUS = ref(database ,'/players/' + id + '/status');
				set(playerRefSTATUS , 'dead');
				// playerRef.child('status').set('dead');
				// playerRef.once('value', function(snapshot) {
                    onValue(playerRef, (snapshot) => {

					var chat_id = snapshot.val().chat_id;
					bot.sendMessage(chat_id, 'Вы были дисквалифицированы');
					var victim_id = snapshot.val().victim;
					var prevKiller_id = '';

					var playersRef = ref(database ,'/players');
					// playersRef.once('value', function(snapshot) {
                        onValue(playersRef, (snapshot) => {

						snapshot.forEach(function(childSnapshot) {
							if (childSnapshot.val().victim === id && childSnapshot.val().status === 'alive') {
								// var prevKillersVictimRef = ref(database ,'/players/' + childSnapshot.key + '/victim');
								var prevKillersVictimRef = ref(database ,'/players/' + childSnapshot.key);
								set(prevKillersVictimRef , victim_id)
								// prevKillersVictimRef.set(victim_id);
								
								bot.sendMessage(childSnapshot.val().chat_id, 'Ваша жертва была дисквалифицриована.');
								var newVictimRef = ref( database , '/players/' + victim_id);
								// newVictimRef.once('value', function(newVictimSnap) {
                                    onValue(newVictimRef, (newVictimSnap) => {

									var newVictimInfo = newVictimSnap.val().fname + ' ' + newVictimSnap.val().lname + '\n'
														+ newVictimSnap.val().faculty + ', ' + newVictimSnap.val().year;
									setTimeout(function() {
										bot.sendPhoto(childSnapshot.val().chat_id, newVictimSnap.val().photo_id, {caption: 
											'Ваша новая жертва \n' + newVictimInfo});
									}, 2000);
								}, {
                                    onlyOnce: true
                                  });
							}
						});
					}, {
                        onlyOnce: true
                      });
				}, {
                    onlyOnce: true
                  });
			}		
		}
	}
});

// * done
bot.onText(/\/all/, msg => {
	// var playersRef = ref(database , '/players/');
	// var playersRef = ref(database , "/players/" )
	const playersRef = query(ref(database, '/players/'), orderByChild('killcount'));
	// console.log(playersRef)
	// playersRef.ref.orderByChild('killcount').once('value', function(snapshot) {
		onValue(playersRef, (snapshot) => {
		var players = [];
		snapshot.forEach(function(childSnapshot) {
			console.log(childSnapshot.val().status);
			if (childSnapshot.val().status === 'alive' && childSnapshot.val().chat_id !== undefined) {
			// if (childSnapshot.val().status === 'alive') {
				players.push(childSnapshot.val());
			}
		});
		console.log(players)

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
		
	},{
		onlyOnce: true
	});
});

// * done
bot.onText(/\/top/, msg => {
	// var playersRef = ref(database ,'/players');
	const playersRef = query(ref(database, '/players'), orderByChild('killcount'));
	onValue(playersRef, (snapshot) => {
		// const data = snapshot.val();
		// updateStarCount(postElement, data);
		//   });
		// playersRef.ref.orderByChild('killcount').once('value', function(snapshot) {
		var players = [];
		// console.log(snapshot)
		// console.log(snapshot)
		snapshot.forEach(function(childSnapshot) {
			// console.log(childSnapshot.val().lname);
			if (childSnapshot.val().status === 'alive' && childSnapshot.val().chat_id !== undefined) {
			// if (childSnapshot.val().status === 'alive' ) {
				players.push(childSnapshot.val());
			}
		});
		// console.log(players);

		players = players.reverse();
		var len = 10;
		if(players.length < 10) len = players.length;
		var str = '🏆 Топ игроков 🏆\n\n';
		for (var i = 0; i < len; i++) {
			str += (i + 1) + `. ${players[i].fname} ${players[i].lname}, ${players[i].killcount} убийств\n`;
		}
		bot.sendMessage(msg.chat.id, str);
	},{
		onlyOnce: true
	});
});


// * done  
bot.onText(/\/victim/, msg => {
	var chatRef = ref(database ,'/chats/' + msg.chat.id);
	// chatRef.once('value', function(snapshot) {
        onValue(chatRef, (snapshot) => {

		if (snapshot.val() !== null) {
			var player_id = snapshot.val();
			var playerRef = ref(database , 'players/' + player_id);
			// playerRef.once('value', function(playerSnap) {
                onValue(playerRef, (playerSnap) => {

				var victim_id = playerSnap.val().victim;
				var victimRef = ref(database ,'players/' + victim_id);
				// victimRef.once('value', function(victimSnap) {
                    onValue(victimRef, (victimSnap) => {

					if (victimSnap.val() !== null) {
						var victimInfo  = victimSnap.val().fname + ' ' 
									+ victimSnap.val().lname + ', '
									+ victimSnap.val().faculty + ', '
									+ victimSnap.val().year; 
						// bot.sendMessage(msg.chat.id,'Ваша жертва: \n' + victimInfo);
						bot.sendPhoto(msg.chat.id, victimSnap.val().photo_id, {caption: 'Ваша жертва: \n' + victimInfo});
					}
				}, {
                    onlyOnce: true
                  });
			}, {
                onlyOnce: true
              });
		} else {
			bot.sendMessage(msg.chat.id, 'Вы не авторизованы');
		}
	}, {
        onlyOnce: true
      });
});
// * done 
bot.onText(/\/check_status/, msg => {
	if(superAdmins.includes(msg.from.username)) {
		var playersRef = ref(database ,'/players');
		// playersRef.once('value', function(snapshot) {
            onValue(playersRef, (snapshot) => {

			var alive = 0;
			snapshot.forEach(function(child) {
				if (child.val().status === 'alive') {
					alive += 1;
				}
			});
			bot.sendMessage(adminChatId, 'Количество живых игроков: ' + alive);
		}, {
            onlyOnce: true
          });
	}
});
// * done 
bot.onText(/\/check_todelete/, msg => {
	if(superAdmins.includes(msg.from.username)) {
		var playersRef = ref(database , '/players');
		// playersRef.once('value', function(snapshot) {
            onValue(playersRef, (snapshot) => {
			var str = 'To delete: \n\n';
			snapshot.forEach(function(child) {
				if (child.val().status === 'alive' && child.val().killcount === 0) {
					str += child.key + ' ' + child.val().fname + ' ' + child.val().lname + '\n';
				}
			});
			bot.sendMessage(adminChatId, str);
		}, {
            onlyOnce: true
          });
        
	}
});

// * done
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
// * done
bot.on('photo', (msg) => {
	if (admins.includes(msg.from.username)) {
		// var ref = ref(database ,'players/')
		var player_id = Math.random().toString(36).slice(2).substr(0,6);
		// var player_id = 1;
		if (msg.caption !== "") {
			var info = msg.caption;
			// info = info.replace(/ /g,''); Теперь формат ввода "Имя Фамилия Факультет Курс" без запятых
			var arr = info.split(' ');
			if (arr.length === 4) {
				set(ref(database , 'players/' +player_id),{
					fname : arr[0],
					lname : arr[1],
					faculty : arr[2],
					year : arr[3],
					photo_id : msg.photo[msg.photo.length - 1].file_id,
					killcount : 0,
					status : 'alive',
					admin : msg.from.username,
				})
				// ref.child(player_id).child("fname").set(arr[0]);
				// ref.child(player_id).child("lname").set(arr[1]);
				// ref.child(player_id).child("faculty").set(arr[2]);
				// ref.child(player_id).child("year").set(arr[3]);
				// ref.child(player_id).child("photo_id").set(msg.photo[msg.photo.length - 1].file_id);
				// ref.child(player_id).child("status").set('alive');
				// ref.child(player_id).child("killcount").set(0);
				// ref.child(player_id).child("admin").set(msg.from.username);
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
// *done
bot.onText(/\/me/, msg => {
	console.log("no error 1");
	var id = msg.text.slice(4);
	id = id.trim();
	if (id !== '') {
		console.log("no error 2");
		var ref1 = ref( database ,'players/' + id);
		console.log("no error 3");
	
		// console.log(ref1);
		// onValue( database , function(snapshot) =>{
		// })
		// ref.once('value', function(snapshot) {
            onValue(ref1, (snapshot) => {
			var test = snapshot.val();
			// console.log(snapshot.val());
			console.log("no error 4");
				// ! fix
			if (test === null) {
				bot.sendMessage(msg.chat.id, 'Авторизация не удалась, проверьте правильность команды.');
			}
			else {
				console.log("no error -> good");

				var refChatsList = ref(database ,'chats/' + msg.chat.id);
				// var refChatsList = ref(database ,'chats/');
				// refChatsList.set(id);
				// var ch = msg.chat.id; 
				set(refChatsList , id);
				// ref.child('chat_id').set(msg.chat.id);
				var tepr = msg.chat.id
				var ref23 = ref( database ,'players/' + id + '/chat_id');
				set(ref23,tepr)
				// set(child(ref1 , 'chat_id'), tepr)

				bot.sendMessage(msg.chat.id, 'Вы успешно авторизованы. Ожидайте начала игры.');
			}
		}, {
            onlyOnce: true
          });
	} else {
		bot.sendMessage(msg.chat.id, 'Введите /me и ваш код');
	}
});
// * done
bot.onText(/\/check_amount/, msg => {
	if(superAdmins.includes(msg.from.username)) {
		var playersRef = ref(database,'/players');
		// playersRef.once('value', function(snapshot) {
            onValue(playersRef, (snapshot) => {

			var registeredCount = 0;
			snapshot.forEach(function(child) {
				registeredCount += 1;
			});
			var chatsRef = ref(database,'/chats');
			// chatsRef.once('value', function(snap) {
                onValue(chatsRef, (snap) => {

				var authorizedCount = 0;
				snap.forEach(function(childSnap) {
					authorizedCount += 1;
				})
				bot.sendMessage(msg.chat.id, 'Registered: ' + registeredCount + '\nAuthorized: ' + authorizedCount);
			}, {
                onlyOnce: true
              });
		}, {
            onlyOnce: true
          });
	}
});
// * done
bot.onText(/\/check_non_authorized/, msg => {
	if(superAdmins.includes(msg.from.username)) {
		var playersRef = ref(database ,'/players');
		// playersRef.once('value', function(snapshot) {
            onValue(playersRef, (snapshot) => {
			var non = '';
			snapshot.forEach(function(child) {
				if (child.val().chat_id === undefined) {
					non += child.val().fname + ' ' + child.val().lname + '\n';
				}
			});
			if(non == ""){
				non = "Все зарегестрированы)";
			}
			bot.sendMessage(msg.chat.id, non);
		}, {
            onlyOnce: true
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


