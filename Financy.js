import {Markup, Telegraf, Composer} from "telegraf";


const url = 'https://www.cbr-xml-daily.ru/daily_json.js';

//Бот

const bot = new Telegraf('6736350377:AAFKVner7z3OqoGAZqnzzlWYFBSQrxDefBE');

//Меню

const menu = [
    {
        command: '/start',
        description: 'Запуск бота'
    },
    {
        command: '/about',
        description: 'Информация о боте'
    },
    {
        command: '/restart',
        description: 'Перезапустить бота'
    },
]

bot.telegram.setMyCommands(menu);


//Клавиатура курсов

const main_key = Markup.inlineKeyboard(
    [
        Markup.button.callback('Курсы валют', '/rate'),
        Markup.button.callback('Конвертер', '/convert'),
        Markup.button.callback('Советы', '/financy')
    ]
)

//Конвертер валюты клавиатура

const choice_keyboard = Markup.inlineKeyboard(
    [
        Markup.button.callback('₽ =>', 'rub_in...'),
        Markup.button.callback('Другая => ...', 'other_in...'),
    ]
)

const convert_rub_in_eng = Markup.inlineKeyboard(
    [
        Markup.button.callback('₽ = $', 'rub_in_doll'),
        Markup.button.callback('₽ = €', 'rub_in_eur'),
        Markup.button.callback('₽ = £', 'rub_in_ster'),
    ]
)

const convert_eng_in_rub = Markup.inlineKeyboard(
    [
        Markup.button.callback('$ = ₽', 'rub_in_doll'),
        Markup.button.callback('€ = ₽', 'eur_in_rub'),
        Markup.button.callback('£ = ₽', 'ster_in_rub'),
    ]
)



const rate_keyboard = Markup.inlineKeyboard(
    [
        Markup.button.callback('$', 'dollars'),
        Markup.button.callback('€', 'euro'),
        Markup.button.callback('£', 'sterling'),
    ]
)


//База

bot.hears('/start', msg => {
    msg.reply('💸Привет, я - Financy!💸 Ваш помощник в мире финансов!💰 Чем могу быть полезен?', main_key)
})

//Restart

bot.hears('/restart', msg => {
    msg.reply('🛠️Перезагружаюсь...🛠️');

    setTimeout(() => {

        bot.stop();
        bot.launch();

        msg.reply('🤖Готов к работе!🤖', main_key);
    }, 1000)
})

bot.action('/financy', msg => {
    msg.reply(
        '1. Создайте бюджет и придерживайтесь его. Определите свои доходы и расходы, чтобы понимать, сколько денег у вас есть и куда они уходят. 💰📊\n' +
        '\n' +
        '2. Накопления - это ключевой элемент финансовой стабильности. Старайтесь откладывать определенную сумму каждый месяц на чрезвычайные ситуации, пенсию или другие цели. 💰🚨\n' +
        '\n' +
        '3. Избегайте долгов. Если вы все же берете кредит, убедитесь, что вы можете его погасить вовремя, чтобы избежать накопления процентов. 👍💳\n' +
        '\n' +
        '4. Инвестируйте в свое образование. Образованные люди имеют больше возможностей для карьерного роста и заработка. 📚💼\n' +
        '\n' +
        '5. Разнообразьте свои инвестиции. Не стоит вкладывать все свои деньги в одно направление, разнообразьте портфель инвестиций для снижения рисков. 📈💸\n' +
        '\n' +
        '6. Страхование - это важно. Защитите себя и свое имущество от непредвиденных обстоятельств. 🛡️\n' +
        '\n' +
        '7. Планируйте свою пенсию. Чем раньше вы начнете откладывать на пенсию, тем больше у вас будет времени нарастить сбережения. 🕰️💰\n' +
        '\n' +
        '8. Образуйтесь в финансовых вопросах. Чем больше вы знаете о финансах, тем лучше сможете управлять своими деньгами. 📚💰\n' +
        '\n' +
        '9. Будьте осторожны с крупными покупками. Прежде чем совершить большую покупку, тщательно подумайте и изучите все возможные варианты. 💳🤔\n' +
        '\n' +
        '10. Не забывайте о своих целях. Определите свои финансовые цели и постоянно стремитесь к их достижению. 🌟🎯'
    )
})

//Вытаскиваю все валюты:

let USD;
let EUR;
let GBP;

//Получаю курсы на данный момент. Объявлена глобально, т.к существенно оптимизирует код и работает быстрее:

fetch(url) //Кладу сюда ссылку по которой идёт запрос
    .then(response => {
        if (!response.ok) {
            console.log('Ошибка запроса сервера! Попробуйте позже');
        }
        return response.json(); //Возвращаем ответ в формате JSON
    })
    .then(data => {

        //Получение значения объекта
        USD = data.Valute.USD.Value;
        EUR = data.Valute.EUR.Value;
        GBP = data.Valute.GBP.Value;

    })

//Курсы валют:

bot.action('/rate', msg => {
    msg.reply('Какой курс вам необходим:', rate_keyboard);
})

//Доллары

bot.action('dollars', msg => {
    msg.reply(`📈💲 = ${USD.toFixed(2)} ₽`);
})

//Евро

bot.action('euro', msg => {
    msg.reply(`📈€ = ${EUR.toFixed(2)} ₽`);
})

//Стерлинги

bot.action('sterling', msg => {
    msg.reply(`📈£ = ${GBP.toFixed(2)} ₽`);
})


//Конвертер рублей во что-то:

//Основной вопрос
bot.action('/convert', msg => {
    msg.reply('Что вы хотите конвертировать?', choice_keyboard);
})

bot.action('rub_in...', msg => {
    msg.reply('Выберите валюту', convert_rub_in_eng)
})

bot.action('other_in...', msg => {
    msg.reply('Выберите валюту', convert_eng_in_rub)
})

//Рубли в доллары:

bot.action('rub_in_doll',  msg => {
    msg.reply('Введите сумму в рублях:')
    bot.use((ctx, next) => {
        let user_value = +(ctx.message.text);
        let result = user_value / USD;
        ctx.reply(` Это ${result.toFixed(2)} $`)
            .then(next);
    })
})

//Рубли в евро

bot.action('rub_in_eur',  msg => {
    msg.reply('Введите сумму в рублях:')
    bot.use((ctx) => {
        let user_value = +(ctx.message.text);
        let result = user_value / EUR;
        ctx.reply(` Это ${result.toFixed(2)} €`)
    })
})

//Рубли в стерлинги

bot.action('rub_in_ster',  msg => {
    msg.reply('Введите сумму в рублях:')
    bot.use((ctx) => {
        let user_value = +(ctx.message.text);
        let result = user_value / GBP;
        ctx.reply(` Это ${result.toFixed(2)} £`)
    })
})

//Доллары:


//Доллары в рубли

bot.action('doll_in_rub',  msg => {
    msg.reply('Введите сумму в долларах:')
    bot.use((ctx) => {
        let user_value = +(ctx.message.text);
        let result = user_value * USD;
        ctx.reply(` Это ${result} ₽`)
    })
})

//Евро в рубли

bot.action('eur_in_rub',  msg => {
    msg.reply('Введите сумму в евро:')
    bot.use((ctx) => {
        let user_value = +(ctx.message.text);
        let result = user_value * EUR;
        ctx.reply(` Это ${result} ₽`, convert_eng_in_rub)
    })
})

// Стерлинги в рубли

bot.action('eur_in_rub',  msg => {
    msg.reply('Введите сумму в стерлингах:')
    bot.use((ctx) => {
        let user_value = +(ctx.message.text);
        let result = user_value * GBP;
        ctx.reply(` Это ${result} ₽`)
    })
})

bot.hears('/about', msg => {
    msg.reply(`💰Financy поможет вам узнать актуальный курс валют, сконвертировать рубли в иностранную валюту или наоборот💰`)
})


//Запуск


bot.launch();
