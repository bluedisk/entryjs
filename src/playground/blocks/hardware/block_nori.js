'use strict';

Entry.NoriCoding = {
    id: '2D.2',
    name: 'NoriCoding',
    url: 'http://orum.or.kr/',
    imageName: 'nori.png',
    title: {
        ko: '노리코딩',
        en: 'Nori Coding',
    },
    setZero() {
        if (!Entry.hw.sendQueue.SET) {
            Entry.hw.sendQueue = {
                GET: {},
                SET: {},
            };
        } else {
            const keySet = Object.keys(Entry.hw.sendQueue.SET);
            keySet.forEach((key) => {
                Entry.hw.sendQueue.SET[key].data = 0;
                Entry.hw.sendQueue.SET[key].time = new Date().getTime();
            });
        }
        Entry.hw.update();
    },
    sleep(delay) {
        const waitTill = new Date(new Date().getTime() + delay);
        while(waitTill > new Date()){}
    },
    sensorTypes: {
        ALIVE: 0,

        BUZZER: 1,
        VOLUME: 2,
        SOUND: 3,
        BUTTON: 4,
        AMBIENT: 5,
        SERVO: 6,

        TONE: 7,
        MOTOR: 8,
        NEOPIXEL: 9,
        TEMPER: 10,
        ULTRASONIC: 11,
        IRRANGE: 12,
        TOUCH: 13,
        TEXTLCD: 14,
        SEGMENT: 15,
    },
    toneTable: {
        '0': 0,
        C: 1,
        CS: 2,
        D: 3,
        DS: 4,
        E: 5,
        F: 6,
        FS: 7,
        G: 8,
        GS: 9,
        A: 10,
        AS: 11,
        B: 12,
    },
    toneMap: {
        '1': [33, 65, 131, 262, 523, 1046, 2093, 4186],
        '2': [35, 69, 139, 277, 554, 1109, 2217, 4435],
        '3': [37, 73, 147, 294, 587, 1175, 2349, 4699],
        '4': [39, 78, 156, 311, 622, 1245, 2849, 4978],
        '5': [41, 82, 165, 330, 659, 1319, 2637, 5274],
        '6': [44, 87, 175, 349, 698, 1397, 2794, 5588],
        '7': [46, 92, 185, 370, 740, 1480, 2960, 5920],
        '8': [49, 98, 196, 392, 784, 1568, 3136, 6272],
        '9': [52, 104, 208, 415, 831, 1661, 3322, 6645],
        '10': [55, 110, 220, 440, 880, 1760, 3520, 7040],
        '11': [58, 117, 233, 466, 932, 1865, 3729, 7459],
        '12': [62, 123, 247, 494, 988, 1976, 3951, 7902],
    },
    highList: ['high', '1', 'on'],
    lowList: ['low', '0', 'off'],
    BlockState: {}
};

/*
#define BUZZER  1
#define VOLUME  2
#define SOUND   3
#define BUTTON  4
#define AMBIENT 5
#define SERVO   6

#define TONE        7
#define MOTOR       8
#define NEOPIXEL    9
#define TEMPER      10
#define ULTRASONIC  11
#define IRRANGE     12
#define TOUCH       13
#define LCD         14
#define SEGMENT     15
* */

Entry.NoriCoding.setLanguage = function() {
    return {
        ko: {
            template: {
                nori_set_buzzer: '%1번 포트 부저 %2 %3',
                nori_set_servo: '%1번 포트 서보 모터 각도를 %2도로 하기 %3',
                nori_get_volume: '%1번 포트 볼륨',
                nori_get_sound: '%1번 포트 소리 감지 됨',
                nori_get_button: '%1번 포트 버튼 눌림',
                nori_get_ambient: '%1번 포트 밝기 센서 값',
                nori_get_irrange: '%1번 포트 적외선 거리 센서 값',
                nori_get_ultrasonic: '%1번 포트 초음파 거리 센서 값',
                nori_display_number: '%1번 포트 숫자 표시 모듈에 %2 표시 %3',
                nori_display_time: '%1번 포트 숫자 표시 모듈에 %2시 %3분 표시 %4',
                nori_display_clear: '%1번 포트 숫자 표시 모듈 지우기 %2',
                nori_lcd_print: '%1번 포트 LCD 모듈 %2번줄에 %3 출력하기 %4',
                nori_get_temperatue: "%1번 포트 온습도센서 온도값",
                nori_get_humidity: "%1번 포트 온습도센서 습도값",
                nori_set_neocolor: "%1번 포트 %2번째 네오픽셀 RGB(%3 %4 %5)로 세팅하기 %6",
                nori_set_neoclear: "%1번 포트 네오픽셀 모두 끄기 %2",
            },
        },
        en: {
            template: {
                nori_set_buzzer: 'Set buzzer on port %1 %2 %3',
                nori_set_servo: 'Set servo angle on port %1 to %2 dgree',
                nori_get_volume: 'Volume level on port %1',
                nori_get_sound: 'Sound is detected on port %1',
                nori_get_button: 'button status on port %1',
                nori_get_ambient: 'Ambient value on port %1',
                nori_get_irrange: 'IR range sensor value on port %1',
                nori_get_ultrasonic: 'Ultrasonic range sensor value on port %1',
                nori_display_number: 'Display number on port %1 as %2 %3',
                nori_display_time: 'Display time on port %1 as %2 %3 %4',
                nori_display_clear: 'Clear display on port %1 %2',
                nori_lcd_print: 'Print to LCD module on port %1 line %2 as %3 %4',
                nori_get_temperatue: "Temperature of DHT11 on port %1",
                nori_get_humidity: "Humidity of DHT11 on port %1",
                nori_set_neocolor: "Set NeoPixel on port %1 pixel %2 to RGB(%3 %4 %5)로 세팅하기 %6",
                nori_set_neoclear: "Turn NeoPixel Off on port %1 %2",
            },
        },
    };
};

Entry.NoriCoding.blockMenuBlocks = [
    'nori_set_buzzer',
    'nori_set_servo',
    'nori_display_number',
    'nori_display_time',
    'nori_display_clear',
    'nori_lcd_print',
    'nori_set_neocolor',
    'nori_set_neoclear',
    'nori_get_volume',
    'nori_get_sound',
    'nori_get_button',
    'nori_get_ambient',
    'nori_get_irrange',
    'nori_get_ultrasonic',
    'nori_get_temperatue',
    'nori_get_humidity',
];

//region arduinoExt 아두이노 확장모드
Entry.NoriCoding.getBlocks = function() {
    return {
        nori_get_port_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic_string_field',
            statements: [],
            template: '%1',
            params: [
                {
                    type: 'Dropdown',
                    options: [['1', '0'], ['2', '1'], ['3', '2'], ['4', '3']],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
            ],
            events: {},
            def: {
                params: [null],
            },
            paramsKeyMap: {
                PORT: 0,
            },
            func(sprite, script) {
                return script.getStringField('PORT');
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: '%1',
                        textParams: [
                            {
                                type: 'Dropdown',
                                options: [['1', '0'], ['2', '1'], ['3', '2'], ['4', '3']],
                                value: '0',
                                fontSize: 11,
                                converter: Entry.block.converters.returnStringKey,
                                bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                                arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                            },
                        ],
                        keyOption: 'nori_get_port_number',
                    },
                ],
            },
        },

        nori_set_buzzer: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Dropdown',
                    options: [['끄기', '0'], ['켜기', '1']],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'nori_get_port_number',
                    },
                ],
                type: 'nori_set_buzzer',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'NoriCodingSet',
            isNotFor: ['NoriCoding'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);
                const value = script.getField('VALUE', script);

                if (!sq.SET) {
                    sq.SET = {};
                }
                sq.SET[port] = {
                    type: Entry.NoriCoding.sensorTypes.BUZZER,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Nori.playBuzzer(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        nori_get_volume: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'nori_get_port_number',
                    },
                ],
                type: 'nori_get_volume',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'NoriCodingGet',
            isNotFor: ['NoriCoding'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT', script);

                const HWPORT = Entry.hw.portData.PORT;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.NoriCoding.sensorTypes.VOLUME] = {
                    port,
                    time: new Date().getTime(),
                };
                return HWPORT ? HWPORT[port] || 0 : 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Nori.getVolume(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        nori_get_sound: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'nori_get_port_number',
                    },
                ],
                type: 'nori_get_sound',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'NoriCodingGet',
            isNotFor: ['NoriCoding'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT', script);

                const HWPORT = Entry.hw.portData.PORT;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.NoriCoding.sensorTypes.SOUND] = {
                    port,
                    time: new Date().getTime(),
                };
                return HWPORT ? HWPORT[port] || 0 : 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Nori.isSoundDetected(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        nori_get_button: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'nori_get_port_number',
                    },
                ],
                type: 'nori_get_button',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'NoriCodingGet',
            isNotFor: ['NoriCoding'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT', script);

                const HWPORT = Entry.hw.portData.PORT;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.NoriCoding.sensorTypes.BUTTON] = {
                    port,
                    time: new Date().getTime(),
                };
                return HWPORT ? HWPORT[port] || 0 : 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Nori.isButtonDown(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        nori_get_ambient: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'nori_get_port_number',
                    },
                ],
                type: 'nori_get_ambient',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'NoriCodingGet',
            isNotFor: ['NoriCoding'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT', script);

                const HWPORT = Entry.hw.portData.PORT;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.NoriCoding.sensorTypes.AMBIENT] = {
                    port,
                    time: new Date().getTime(),
                };
                return HWPORT ? HWPORT[port] || 0 : 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Nori.getAmbientLevel(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        nori_get_irrange: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'nori_get_port_number',
                    },
                ],
                type: 'nori_get_irrange',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'NoriCodingGet',
            isNotFor: ['NoriCoding'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT', script);

                const HWPORT = Entry.hw.portData.PORT;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.NoriCoding.sensorTypes.IRRANGE] = {
                    port,
                    time: new Date().getTime(),
                };
                return HWPORT ? HWPORT[port] || 0 : 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Nori.getIRRange(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        nori_get_ultrasonic: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'nori_get_port_number',
                    },
                ],
                type: 'nori_get_ultrasonic',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'NoriCodingGet',
            isNotFor: ['NoriCoding'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT', script);

                const HWPORT = Entry.hw.portData.PORT;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.NoriCoding.sensorTypes.ULTRASONIC] = {
                    port,
                    time: new Date().getTime(),
                };
                return HWPORT ? HWPORT[port] || 0 : 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Nori.getUltrasonicRange(%1)',
                        blockType: 'param',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

        nori_set_servo: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'nori_get_port_number',
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'nori_set_servo',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'NoriCodingSet',
            isNotFor: ['NoriCoding'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);
                let value = script.getNumberValue('VALUE', script);
                value = Math.min(180, value);
                value = Math.max(0, value);

                if (!sq.SET) {
                    sq.SET = {};
                }
                sq.SET[port] = {
                    type: Entry.NoriCoding.sensorTypes.SERVO,
                    data: value,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Nori.setServoAngle(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        nori_display_number: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'nori_get_port_number',
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'nori_display_number',
            },
            paramsKeyMap: {
                PORT: 0,
                VALUE: 1,
            },
            class: 'NoriCodingSet',
            isNotFor: ['NoriCoding'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);
                let value = script.getNumberValue('VALUE', script);
                value = value % 10000;

                if (!sq.SET) {
                    sq.SET = {};
                }
                sq.SET[port] = {
                    type: Entry.NoriCoding.sensorTypes.SEGMENT,
                    data: {
                        value,
                        colon: 0,
                    },
                    time: new Date().getTime(),
                };
                 
                Entry.hw.update();
                Entry.NoriCoding.sleep(10);

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Nori.displayNumber(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        nori_display_time: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'nori_get_port_number',
                    },
                    {
                        type: 'number',
                        params: ['12'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'nori_display_time',
            },
            paramsKeyMap: {
                PORT: 0,
                HOUR: 1,
                MINUTE: 2,
            },
            class: 'NoriCodingSet',
            isNotFor: ['NoriCoding'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);
                let hour = script.getNumberValue('HOUR', script);
                let minute = script.getNumberValue('MINUTE', script);
                hour = Math.min(Math.max(0, hour), 99);
                minute = Math.min(Math.max(0, minute), 99);

                const value = hour * 100 + minute;

                if (!sq.SET) {
                    sq.SET = {};
                }
                sq.SET[port] = {
                    type: Entry.NoriCoding.sensorTypes.SEGMENT,
                    data: {
                        value,
                        colon: 1,
                    },
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Nori.displayTime(%1, %2, %3)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        nori_display_clear: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'nori_get_port_number',
                    },
                ],
                type: 'nori_display_clear',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'NoriCodingSet',
            isNotFor: ['NoriCoding'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);

                if (!sq.SET) {
                    sq.SET = {};
                }
                sq.SET[port] = {
                    type: Entry.NoriCoding.sensorTypes.SEGMENT,
                    data: null,
                    time: new Date().getTime(),
                };

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Nori.displayClear(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        nori_lcd_print: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Dropdown',
                    options: [['1', '0'], ['2', '1']],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'nori_get_port_number',
                    },
                    null,
                    {
                        type: 'text',
                        params: ['Hello World!'],
                    },
                    null,
                ],
                type: 'nori_lcd_print',
            },
            paramsKeyMap: {
                PORT: 0,
                LINE: 1,
                TEXT: 2,
            },
            class: 'NoriCodingSet',
            isNotFor: ['NoriCoding'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);
                const dispLine = script.getField('LINE', script);
                let textValue = script.getStringValue('TEXT', script);
                textValue = textValue.substring(0, 16);

                if (!sq.SET) {
                    sq.SET = {};
                }

                sq.SET[port] = {
                    type: Entry.NoriCoding.sensorTypes.TEXTLCD,
                    data: {
                        line: dispLine,
                        value: textValue,
                    },
                    time: new Date().getTime(),
                };

                Entry.hw.update();
                Entry.NoriCoding.sleep(10);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Nori.printStringToLCD(%1, %2)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        nori_get_temperatue: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'nori_get_port_number',
                    },
                    null,
                ],
                type: 'nori_get_temperatue',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'NoriCodingGet',
            isNotFor: ['NoriCoding'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT', script);

                const HWPORT = Entry.hw.portData.PORT;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.NoriCoding.sensorTypes.TEMPER] = {
                    port,
                    time: new Date().getTime(),
                };
                return HWPORT ? HWPORT[port][0] || 0 : 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Nori.getTemerature(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        nori_get_humidity: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            fontColor: '#fff',
            skeleton: 'basic_string_field',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'nori_get_port_number',
                    },
                ],
                type: 'nori_get_humidity',
            },
            paramsKeyMap: {
                PORT: 0
            },
            class: 'NoriCodingGet',
            isNotFor: ['NoriCoding'],
            func(sprite, script) {
                const port = script.getNumberValue('PORT', script);

                const HWPORT = Entry.hw.portData.PORT;
                if (!Entry.hw.sendQueue.GET) {
                    Entry.hw.sendQueue.GET = {};
                }
                Entry.hw.sendQueue.GET[Entry.NoriCoding.sensorTypes.TEMPER] = {
                    port,
                    time: new Date().getTime(),
                };
                return HWPORT ? HWPORT[port][1] || 0 : 0;
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Nori.getHumidity(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        nori_set_neocolor: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                }, 
                {
                    type: 'Dropdown',
                    options: [
                        ['1', '0'], 
                        ['2', '1'], 
                        ['3', '2'], 
                        ['4', '3'], 
                        ['5', '4'], 
                        ['6', '5'], 
                        ['7', '6'], 
                        ['8', '7'], 
                        ['9', '8'], 
                        ['10', '9'],
                    ],
                    value: '0',
                    fontSize: 11,
                    bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                },
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'nori_get_port_number',
                    },
                    null,
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    {
                        type: 'number',
                        params: ['0'],
                    },
                    null,
                ],
                type: 'nori_set_neocolor',
            },
            paramsKeyMap: {
                PORT: 0,
                INDEX: 1,
                R: 2,
                G: 3,
                B: 4
            },
            class: 'NoriCodingSet',
            isNotFor: ['NoriCoding'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);
                const index = script.getField('INDEX',script);
                const r =  script.getNumberValue('R', script);
                const g =  script.getNumberValue('G', script);
                const b =  script.getNumberValue('B', script);

                console.log(index);

                if (!sq.SET) {
                    sq.SET = {};
                }
                sq.SET[port] = {
                    type: Entry.NoriCoding.sensorTypes.NEOPIXEL,
                    data: {
                        index: index,
                        r: r,
                        g: g,
                        b: b
                    },
                    time: new Date().getTime(),
                };
                Entry.hw.update();
                Entry.NoriCoding.sleep(10);

                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Nori.setNeoPixel(%1, %2, %3, %4 ,%5)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },
        nori_set_neoclear: {
            color: EntryStatic.colorSet.block.default.HARDWARE,
            outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
            skeleton: 'basic',
            statements: [],
            params: [
                {
                    type: 'Block',
                    accept: 'string',
                    defaultType: 'number',
                }, 
                {
                    type: 'Indicator',
                    img: 'block_icon/hardware_icon.svg',
                    size: 12,
                },
            ],
            events: {},
            def: {
                params: [
                    {
                        type: 'nori_get_port_number',
                    },
                    null,
                ],
                type: 'nori_set_neoclear',
            },
            paramsKeyMap: {
                PORT: 0,
            },
            class: 'NoriCodingSet',
            isNotFor: ['NoriCoding'],
            func(sprite, script) {
                const sq = Entry.hw.sendQueue;
                const port = script.getNumberValue('PORT', script);

                if (!sq.SET) {
                    sq.SET = {};
                }
                sq.SET[port] = {
                    type: Entry.NoriCoding.sensorTypes.NEOPIXEL,
                    time: new Date().getTime(),
                };

                Entry.hw.update();
                Entry.NoriCoding.sleep(10);
                return script.callReturn();
            },
            syntax: {
                js: [],
                py: [
                    {
                        syntax: 'Nori.clearNeoPixel(%1)',
                        textParams: [
                            {
                                type: 'Block',
                                accept: 'string',
                            },
                        ],
                    },
                ],
            },
        },

    };
};
//endregion NoriCoding 노리코딩 

module.exports = Entry.NoriCoding;
