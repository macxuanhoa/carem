export const MOTORBIKE_MODELS = {
    'Xe Số': [
        'Honda Wave Alpha', 'Honda Wave RSX', 'Honda Blade', 
        'Yamaha Sirius', 'Yamaha Jupiter', 
        'Suzuki Viva', 'Suzuki Axelo'
    ],
    'Tay Ga': [
        'Honda Vision', 'Honda Air Blade', 'Honda Lead', 'Honda SH Mode', 'Honda SH',
        'Yamaha Janus', 'Yamaha Grande', 'Yamaha FreeGo',
        'Piaggio Liberty', 'Piaggio Medley', 'Vespa Sprint', 'Vespa Primavera'
    ],
    'Côn Tay': [
        'Yamaha Exciter', 'Honda Winner X', 'Yamaha MT-15', 
        'Honda CB150R', 'Honda CBR150R', 
        'KTM Duke 200', 'Suzuki Raider'
    ]
};

export const FLATTENED_MODELS = [
    ...MOTORBIKE_MODELS['Tay Ga'],
    ...MOTORBIKE_MODELS['Xe Số'],
    ...MOTORBIKE_MODELS['Côn Tay']
].sort();
