var aircraft = {
    'r22': {
        'standard':{
            'defaults':{
                'bem': 880,
                'lon': 104,
                'lat': -0.1,
            },
            'bounds':{
                'lat': [[95.5, -0.8], [95.5, 1], [98, 2.6], [101.5, 1.2], [101.5, -0.7], [97.5, -2.2], [97, -2.2]],
                'lon': [[95.5, 920], [95.5, 1225], [96.5, 1300], [100, 1300], [101.5, 1130], [101.5, 920]],
            },
            'loadingpoints':{
                'pilot': {
                    'lat': 10.7,
                    'lon': 78, //TODO: WARN ABOUT S/N prior to 0256 which require 79in
                    'default': 185,
                    'max': 240,
                },
                'passenger1': {
                    'lat': -9.3,
                    'lon': 78,
                    'default': 0,
                    'max': 240,
                },
            },
            'fuel':{
                'main': {
                    'lat': -11,
                    'lon': 108.6,
                    'default': 8,
                },
                'aux': {
                    'lat': 11.2,
                    'lon': 103.8,
                    'default': 4,
                },
            },
            'extras': {
                'duals': {
                    'lat': -12.88,
                    'lon': 66.27,
                    'weight': 2.6,
                    'includedinbem': true,
                },
                'leftdoor': {
                    'lat': -21,
                    'lon': 77.5,
                    'weight': 5.2,
                    'includedinbem': true,
                },
                'rightdoor': {
                    'lat': 21,
                    'lon': 77.5,
                    'weight': 5.2,
                    'includedinbem': true,
                },
            },
        },
        'hp': {
            get 'defaults' () {return aircraft['r22']['standard']['defaults'];},
            get 'bounds' () {return aircraft['r22']['standard']['bounds'];},
            'fuel':{
                'main': {
                    'lat': -11,
                    'lon': 108.6,
                    'default': 8,
                },
            },
            get 'loadingpoints' () {return aircraft['r22']['standard']['loadingpoints'];},
            get 'extras' () {return aircraft['r22']['standard']['extras'];},
        },
        'alpha':{
            get 'defaults' () {return aircraft['r22']['standard']['defaults'];},
            'bounds':{
                'lat': [[95.5, -0.8], [95.5, 1], [98, 2.6], [101.5, 1.2], [101.5, -0.7], [97.5, -2.2], [97, -2.2]],
                'lon': [[95.5, 920], [95.5, 1275], [96.5, 1370], [100, 1370], [101.5, 1175], [101.5, 920]],
            },
            get 'loadingpoints' () {return aircraft['r22']['standard']['loadingpoints'];},
            get 'fuel' () {return aircraft['r22']['standard']['fuel'];},
            get 'extras' () {return aircraft['r22']['standard']['extras'];},
        },
        get 'beta' () {return aircraft['r22']['alpha'];},
        get 'beta2' () {return aircraft['r22']['alpha'];},
    },
    'r44': {
        'astro':{
            'defaults':{
                'bem': 1460,
                'lon': 106.2,
                'lat': 0.2,
            },
            'bounds':{
                'lat': [[92, -3], [92, 3], [100, 3], [102.5, 1.5], [102.5, -1.5], [100, -3]],
                'lon': [[92, 1550], [92, 2200], [93, 2400], [98, 2400], [102.5, 2000], [102.5, 1550]],
            },
            'loadingpoints':{
                'pilot': {
                    'lat': 12.2,
                    'lon': 49.5,
                    'default': 185,
                    'max': 300,
                },
                'passenger1': {
                    'lat': -10.4,
                    'lon': 49.5,
                    'default': 0,
                    'max': 300,
                },
                'passenger2': {
                    'lat': 12.2,
                    'lon': 79.5,
                    'default': 0,
                    'max': 300,
                },
                'passenger3': {
                    'lat': -12.2,
                    'lon': 79.5,
                    'default': 0,
                    'max': 300,
                },
            },
            'fuel':{
                'main': {
                    'lat': -13.5,
                    'lon': 106.0,
                    'default': 16,
                },
                'aux': {
                    'lat': 13.0,
                    'lon': 102.0,
                    'default': 8,
                },
            },
            'extras': {
                'duals': {
                    'lat': -13.27,
                    'lon': 32.96,
                    'weight': 2.2,
                    'includedinbem': true,
                },
                'leftforwarddoor': {
                    'lat': -24,
                    'lon': 49.4,
                    'weight': 7.5,
                    'includedinbem': true,
                },
                'rightforwarddoor': {
                    'lat': 24,
                    'lon': 49.4,
                    'weight': 7.5,
                    'includedinbem': true,
                },
                'leftaftdoor': {
                    'lat': -23,
                    'lon': 75.4,
                    'weight': 7.5,
                    'includedinbem': true,
                },
                'rightaftdoor': {
                    'lat': 23,
                    'lon': 75.4,
                    'weight': 7.5,
                    'includedinbem': true,
                },
            },
        },
        get 'raven' () {return aircraft['r44']['astro'];},
        get 'raven2' () {return aircraft['r44']['astro'];},
    },
};
