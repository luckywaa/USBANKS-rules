// ==UserScript==
// @name         HSBC US Credit Card MCC & Original Currency Display
// @namespace    http://tampermonkey.net/
// @version      6.0
// @match        *://onlinebanking.firstdata.com/*
// @match        *://www.us.hsbc.com/online/dashboard*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 1. 数据库
    const MCC_DB = {
        "0000": "Financial Entry / Interest Charge / Internal Bank Service",
        "9999": "Default / Unclassified Merchant",
        "3000": "United Airlines", "3001": "American Airlines", "3002": "Pan American", "3003": "Eurofly", "3004": "Dragonair", "3005": "British Airways", "3006": "Japan Air Lines", "3007": "Air France", "3008": "Lufthansa", "3009": "Air Canada", "3010": "KLM", "3011": "Aeroflot", "3012": "Qantas", "3013": "ITA Airways", "3014": "Saudi Arabian Airlines", "3015": "Swiss International Air Lines", "3016": "SAS", "3017": "South African Airways", "3018": "Varig (Brazil)", "3020": "Air India", "3021": "Air Algerie", "3022": "Philippine Airlines", "3024": "Pakistan International", "3025": "Air New Zealand", "3026": "Emirates Airlines", "3027": "Union de Transports Aeriens", "3028": "Air Malta", "3029": "SN Brussels Airlines", "3030": "Aerolineas Argentinas", "3031": "Olympic Airways", "3032": "El Al", "3033": "Ansett Airlines", "3034": "Etihad Airways", "3035": "Tap Air Portugal", "3036": "VASP (Brazil)", "3037": "EgyptAir", "3038": "Kuwait Airways", "3039": "Avianca", "3040": "Gulf Air (Bahrain)", "3041": "Balkan Airlines", "3042": "Finnair", "3043": "Aer Lingus", "3044": "Air Lanka", "3046": "Cruzeiro do Sul (Brazil)", "3048": "Royal Air Maroc", "3049": "Tunis Air", "3050": "Icelandair", "3051": "Austrian Airlines", "3052": "LAN Airlines", "3053": "AVIACO (Spain)", "3054": "LADECO (Chile)", "3055": "LAB (Bolivia)", "3056": "Jet Airways", "3057": "Virgin America", "3058": "Delta Airlines", "3059": "DBA Airlines", "3060": "Northwest Airlines", "3061": "Continental", "3062": "Hapag-Lloyd Express", "3064": "Adria Airways", "3065": "Air Inter", "3066": "Southwest Airlines", "3068": "Air Astana", "3069": "Sun Country Airlines", "3070": "Fly Dubai", "3071": "Air British Columbia", "3072": "Cebu Pacific", "3075": "Singapore Airlines", "3076": "Aeromexico", "3077": "Thai Airways", "3078": "China Airlines", "3079": "Jetstar Airways", "3080": "Swoop Inc.", "3081": "Xiamen Airlines", "3082": "Korean Airlines", "3083": "Air Afrique", "3084": "Eva Airways", "3085": "Midwest Express Airlines", "3087": "Metro Airlines", "3088": "Croatia Air", "3089": "Transaero", "3090": "Uni Airways", "3096": "Air Zimbabwe", "3097": "Spanair", "3098": "Asiana Airlines", "3099": "Cathay Pacific", "3100": "Malaysian Airline System", "3102": "Iberia", "3103": "Garuda (Indonesia)", "3106": "Braathens S.A.F.E.", "3111": "British Midland", "3112": "Windward Island", "3125": "Tan Airlines", "3127": "Taca International", "3129": "Surinam Airways", "3130": "Sunworld International Airways", "3131": "VLM Airlines", "3132": "Frontier Airlines", "3144": "Virgin Atlantic", "3146": "Luxair", "3148": "Air Littoral, S.A.", "3151": "Air Zaire", "3156": "GO FLY Ltd.", "3159": "Provincetown-Boston Airways", "3161": "All Nippon Airways", "3164": "Norontair", "3167": "Aero Continente", "3171": "Canadian Airlines", "3172": "Nation Air", "3174": "JetBlue Airways", "3175": "Middle East Air", "3177": "AirTran Airways", "3178": "Mesa Air", "3180": "Westjet", "3181": "Malev Hungarian", "3182": "LOT - Polish Airlines", "3190": "Jugoslav Air", "3191": "Island Airlines", "3193": "Indian Airlines", "3196": "Hawaiian Air", "3197": "Havasu Airlines", "3200": "Guyana Airways", "3204": "Freedom Airlines", "3206": "China Eastern Airlines", "3211": "Norwegian Air Shuttle", "3212": "Dominicana de Aviacion", "3213": "Braathens Regional Airlines", "3217": "CSA Ceskoslovenske Aerolinie", "3219": "Copa Airlines", "3220": "Compania Faucett", "3221": "TAME AIR", "3222": "Command Airways", "3223": "Comair", "3226": "Skyways", "3228": "Cayman Airways", "3229": "SAETAAIR", "3231": "SAHSA", "3234": "Caribbean Airlines", "3236": "Air Arabia", "3239": "Bar Harbor Airlines", "3240": "Bahamasair", "3241": "Aviateca", "3242": "Avensa", "3243": "Austrian Air Service", "3245": "EasyJet", "3246": "Ryanair", "3247": "Gol Airlines", "3248": "Tam Airlines", "3252": "ALM Antilean Airlines", "3253": "America West", "3256": "Alaska Airlines", "3261": "Air China", "3263": "Aero Servicio Carabobo", "3266": "Air Seychelles", "3267": "Air Panama", "3280": "Air Jamaica", "3282": "Air Djibouti", "3285": "Aero Peru", "3286": "Aero Nicaraguenses", "3287": "Aero Coach Aviation", "3292": "Cyprus Airways", "3293": "Ecuatoriana", "3294": "Ethiopian Airlines", "3295": "Kenya Airways", "3296": "Air Berlin", "3297": "Tarom Romanian Air Transport", "3298": "Air Mauritius", "3299": "Wideroes Flyveselskap", "3301": "Wizz Air",
        "3351": "Affiliated Auto Rental", "3352": "American International", "3353": "Brooks Rent-A-Car", "3354": "Action Auto Rental", "3355": "SIXT Car Rental", "3357": "Hertz", "3359": "Payless Car Rental", "3360": "Snappy Car Rental", "3361": "Airways Rent-A-Car", "3362": "Altra Auto Rental", "3364": "Agency Rent-A-Car", "3366": "Budget Rent-A-Car", "3368": "Holiday Rent-A-Car", "3370": "Rent A Wreck", "3374": "Accent Rent-A-Car", "3376": "Ajax Rent-A-Car", "3380": "Triangle Rent-A-Car", "3381": "Europcar", "3385": "Tropical Rent-A-Car", "3386": "Showcase Rental Cars", "3387": "Alamo Rent-A-Car", "3389": "Avis Rent-A-Car", "3390": "Dollar Rent-A-Car", "3391": "Europe By Car", "3393": "National Car Rental", "3394": "Kemwell Group", "3395": "Thrifty Car Rental", "3396": "Tilden Rent-A-Car", "3398": "Econo Car Rent-A-Car", "3400": "Auto Host Car Rental", "3405": "Enterprise Rent-A-Car", "3409": "General Rent-A-Car", "3412": "A1 Rent-A-Car", "3420": "ANSA International", "3421": "Allstate Rent-A-Car", "3423": "Avcar Rent-A-Car", "3425": "Automate Rent-A-Car", "3427": "Avon Rent-A-Car", "3428": "Carey Rent-A-Car", "3429": "Insurance Rent-A-Car", "3430": "Major Rent-A-Car", "3431": "Replacement Rent-A-Car", "3432": "Reserve Rent-A-Car", "3433": "Ugly Duckling Rent-A-Car", "3434": "USA Rent-A-Car", "3435": "Value Rent-A-Car", "3436": "Autohansa Rent-A-Car", "3438": "Interent Rent-A-Car", "3439": "Milleville Rent-A-Car",
        "3501": "Holiday Inns", "3502": "Best Western Hotels", "3503": "Sheraton Hotels", "3504": "Hilton Hotels", "3505": "Forte Hotels", "3506": "Golden Tulip Hotels", "3507": "Friendship Inns", "3508": "Quality Inns", "3509": "Marriott", "3510": "Days Inns", "3511": "Arabella Hotels", "3512": "Intercontinental Hotels", "3513": "Westin Hotels", "3514": "Amerisuites", "3515": "Rodeway Inns", "3516": "LaQuinta Inns", "3517": "Americana Hotels", "3518": "Sol Hotels", "3519": "Pullman International", "3520": "Meridien Hotels", "3521": "Royal Lahaina Resort", "3522": "Tokyo Hotel", "3523": "Peninsula Hotels", "3524": "WelcomGroup Hotels", "3525": "Dunfey Hotels", "3526": "Prince Hotels", "3527": "Downtowner Passport", "3528": "Red Lion Inns", "3529": "CP (Canadian Pacific) Hotels", "3530": "Renaissance Hotels", "3531": "Kauai Coconut Beach Resort", "3532": "Royal Kona Resort", "3533": "Hotel Ibis", "3534": "Southern Pacific Hotel", "3535": "Hilton International", "3536": "AMFAC Hotels", "3537": "ANA Hotels", "3538": "Concorde Hotels", "3539": "Summerfield Suites Hotel", "3540": "Iberotel Hotels", "3541": "Hotel Okura", "3542": "Royal Hotels", "3543": "Four Seasons Hotels", "3544": "Ciga Hotels", "3545": "Shangri-La International", "3546": "Hotel Sierra", "3547": "Breakers Resort", "3548": "Hotels Melia", "3549": "Auberge des Governeures", "3550": "Regal 8 Inns", "3551": "Mirage Hotel and Casino", "3552": "Coast Hotel", "3553": "Park Inn by Radisson", "3554": "Pinehurst Resort", "3556": "Barton Creek Resort", "3558": "Jolly Hotels", "3559": "Candlewood Suites", "3560": "Aladdin Resort and Casino", "3561": "Golden Nugget", "3562": "Comfort Inns", "3563": "Journey's End Motels", "3564": "Sam's Town Hotel and Casino", "3565": "Relax Inns", "3566": "Garden Place Hotel", "3567": "Soho Grand Hotel", "3568": "Ladbroke Hotels", "3570": "Forum Hotels", "3571": "Grand Wailea Resort", "3572": "Miyako Hotel", "3573": "Sandman Hotels", "3574": "Venture Inn", "3575": "Vagabond Hotels", "3576": "La Quinta Resort", "3578": "Frankenmuth Bavarian", "3579": "Hotel Mercure", "3580": "Hotel Del Coronado", "3581": "Delta Hotels", "3582": "California Hotel and Casino", "3583": "Radisson BLU", "3584": "Princess Hotels International", "3585": "Hungar Hotels", "3586": "Sokos Hotel", "3587": "Doral Hotels", "3588": "Helmsley Hotels", "3589": "Doral Golf Resort", "3590": "Fairmont Hotels", "3591": "Sonesta Hotels", "3592": "Omni Hotels", "3593": "Cunard Hotels", "3594": "Arizona Biltmore", "3595": "Hospitality Inns", "3596": "Wynn Las Vegas", "3597": "Riverside Resort and Casino", "3598": "Regent International Hotel", "3599": "Pannonia Hotels", "3600": "Saddlebrook Resort", "3601": "TradeWinds Resorts", "3602": "Hudson Hotel", "3603": "Noah's Hotel", "3604": "Hilton Garden Inn", "3605": "Jurys Doyle Hotel Group", "3606": "Jefferson Hotel", "3607": "Fontainebleau Resort", "3608": "Gaylord Opryland", "3609": "Gaylord Palms", "3610": "Gaylord Texan", "3611": "C MON INN", "3612": "Movenpick Hotels", "3613": "Microtel Inn and Suites", "3614": "AmericInn", "3615": "Travelodge", "3616": "Hermitage Hotel", "3617": "America's Best Value Inn", "3618": "Great Wolf", "3619": "Aloft Hotels", "3620": "Binion's Horseshoe Club", "3621": "Extended Stay", "3622": "Merlin Hotel Group", "3623": "Dorint Hotels", "3624": "Lady Luck Hotel and Casino", "3625": "Hotel Universale", "3626": "Studio Plus", "3627": "Extended Stay America", "3628": "Excalibur Hotel and Casino", "3629": "Dan Hotels", "3630": "Tokyu Hotels", "3631": "Sleep Inns", "3632": "The Phoenician", "3633": "Rank Hotels", "3634": "Swissotel", "3635": "Reso Hotel", "3636": "Sarova Hotels", "3637": "Ramada Inns", "3638": "Howard Johnson", "3639": "Mount Charlotte Thistle", "3640": "Hyatt Hotels", "3641": "Sofitel Hotels", "3642": "Novotel Hotels", "3643": "Steigenberger Hotels", "3644": "EconoLodges", "3646": "Swallow Hotels", "3647": "Husa Hotels", "3648": "De Vera Hotels", "3649": "Radisson", "3650": "Red Roof Inns", "3651": "Imperial London Hotels", "3652": "Embassy Hotels", "3653": "Penta Hotels", "3654": "Loews Hotels", "3655": "Scandic Hotels", "3656": "Sara Hotels", "3657": "Oberoi Hotels", "3658": "New Otani Hotels", "3659": "Taj Hotels International", "3660": "Knights Inn", "3661": "Metropole Hotels", "3662": "Circus Circus Hotel and Casino", "3663": "Hoteles El Presidente", "3665": "Hampton Inn Hotels", "3667": "Luxor Hotel and Casino", "3668": "Maritim Hotels", "3669": "Eldorado Hotel and Casino", "3670": "Arcade Hotels", "3671": "Arctia Hotels", "3672": "Campanile Hotels", "3673": "IBUSZ Hotels", "3674": "Rantasipi Hotels", "3675": "Interhotel CEDOK", "3676": "Monte Carlo Hotel and Casino", "3677": "Climat de France Hotels", "3678": "Cumulus Hotels", "3679": "Silver Legacy Hotel and Casino", "3680": "Hoteis Othan", "3681": "Adams Mark Hotels", "3682": "Sahara Hotel and Casino", "3683": "Bradbury Suites", "3684": "Budget Hosts Inns", "3685": "Budgetel Inns", "3687": "Clarion Hotels", "3688": "Compri Hotels", "3689": "Consort Hotels", "3690": "Courtyard by Marriott", "3691": "Dillon Inn", "3692": "Doubletree", "3693": "Drury Inn", "3694": "Economy Inns of America", "3695": "Embassy Suites", "3696": "Excel Inn", "3697": "Fairfield Hotels", "3698": "Harley Hotels", "3699": "Midway Motor Lodge", "3700": "Motel 6", "3701": "La Mansion Del Rio", "3702": "Registry Hotels", "3703": "Residence Inn", "3704": "Royce Hotels", "3705": "Sandman Inn", "3706": "Shilo Inn", "3707": "Shoney's Inn", "3708": "Virgin River Hotel and Casino", "3709": "Super 8 Motels", "3710": "The Ritz-Carlton", "3711": "Flag Inns (Australia)", "3712": "Buffalo Bill's Hotel and Casino", "3713": "Quality Pacific Hotel", "3714": "Four Seasons (Australia) Hotels", "3715": "Fairfield Inn", "3716": "Carlton Hotels", "3717": "City Lodge Hotels", "3718": "Karos Hotels", "3719": "Protea Hotels", "3720": "Southern Sun Hotels", "3721": "Conrad Hotels", "3722": "Wyndham", "3723": "Rica Hotels", "3724": "Inter Nor Hotels", "3725": "Sea Pines Resort", "3726": "Rio Suites", "3727": "Broadmoor Hotel", "3728": "Bally's Hotel and Casino", "3729": "John Ascuagas Nugget", "3730": "MGM Grand Hotel", "3731": "Harrahs Hotels and Casinos", "3732": "Opryland Hotel", "3733": "Boca Raton Resort", "3734": "Harvey Bristol Hotels", "3735": "Masters Economy Inns", "3736": "Colorado Belle Edgewater Resort", "3737": "Riviera Hotel and Casino", "3738": "Tropicana Resort and Casino", "3739": "Woodside Hotels and Resorts", "3740": "TownePlace Suites", "3741": "Millennium Hotels", "3742": "Club Med", "3743": "Biltmore Hotel and Suites", "3744": "Carefree Resorts", "3745": "St. Regis Hotel", "3746": "Eliot Hotels", "3747": "Club Corp/Club Resorts", "3748": "Wellesley Inns", "3749": "Beverly Hills Hotel", "3750": "Crowne Plaza Hotels", "3751": "Homewood Suites", "3752": "Peabody Hotels", "3753": "Greenbriar Resorts", "3754": "Amelia Island Plantation", "3755": "Homestead", "3756": "Toyoko Inn", "3757": "Canyon Ranch", "3758": "Mandarin Oriental Hotels", "3759": "Orchid at Mauna Lani", "3760": "Halekulani Hotel/Waikiki Parc", "3761": "Primadonna Hotel and Casino", "3762": "Whiskey Pete's Hotel and Casino", "3763": "Chateau Elan Winery and Resort", "3764": "Beau Rivage Hotel and Casino", "3765": "Bellagio Hotel and Casino", "3766": "Fremont Hotel and Casino", "3767": "Main Street Hotel and Casino", "3768": "Silver Star Hotel and Casino", "3769": "Stratosphere Hotel and Casino", "3770": "SpringHill Suites", "3771": "Caesars Hotel and Casino", "3772": "Nemacolin Woodlands", "3773": "Venetian Resort Hotel and Casino", "3774": "New York, New York Hotel and Casino", "3775": "Sands Resort", "3776": "Nevele Grande Resort", "3778": "Four Points Hotels", "3779": "W Hotels", "3780": "Disney Resorts", "3781": "Patricia Grand Resort Hotels", "3782": "Rosen Hotels and Resorts", "3783": "Town and Country Resort", "3785": "Outrigger Hotels & Resorts", "3786": "Ohana Hotels of Hawaii", "3787": "Caribe Royale Resort Suites", "3788": "Ala Moana Hotel", "3789": "Smugglers' Notch Resort", "3790": "Raffles Hotels", "3791": "Staybridge Suites", "3792": "Claridge Casino Hotel", "3793": "The Flamingo Hotels", "3794": "Grand Casino Hotels", "3795": "Paris Las Vegas Hotel", "3796": "Peppermill Hotel Casino", "3797": "Atlantic City Hilton", "3798": "Embassy Vacation Resort", "3799": "Hale Koa Hotel", "3800": "Homestead Suites", "3801": "Wilderness Hotel", "3802": "The Palace Hotel", "3803": "The Wigwam Golf Resort", "3804": "The Diplomat Country Club", "3805": "The Atlantic", "3806": "Princeville Resort", "3807": "Element", "3808": "LXR (Luxury Resorts)", "3809": "Settle Inn", "3810": "La Costa Resort", "3811": "Premier Inn", "3813": "Hotel Indigo", "3814": "The Roosevelt Hotel NY", "3815": "Holiday Inn Nickelodeon", "3816": "Home2 Suites by Hilton", "3817": "Affinia", "3818": "MainStay Suites", "3819": "Oxford Suites", "3820": "Jumeirah Essex House", "3821": "Caribe Royale", "3823": "Grand Sierra Resort", "3824": "Aria (Aria Resort and Casino)", "3825": "Vdara (Vdara Hotel and Spa)", "3826": "Autograph Hotels", "3828": "Cosmopolitan of Las Vegas", "3829": "Country Inn by Carlson", "3830": "Park Plaza Hotel", "3831": "Waldorf", "3832": "Curio Hotels", "3833": "Canopy Hotels", "3834": "Baymont Inn and Suites", "3835": "Dolce Hotels and Resorts", "3836": "Hawthorn Suites by Wyndham", "3837": "Hoshino Resorts", "3838": "Kimpton Hotels", "3839": "Kyoritsu Hotels",

        "0742": "Veterinary Services", "0763": "Agricultural Cooperatives", "0780": "Horticultural and Landscaping Services",
        "1520": "General Contractors", "1711": "Heating/Plumbing Contractors", "1731": "Electrical Contractors", "1740": "Masonry/Insulation Contractors", "1750": "Carpentry Contractors", "1761": "Roofing/Siding Contractors", "1771": "Concrete Work Contractors", "1799": "Special Trade Contractors",
        "2741": "Publishing and Printing", "2791": "Typesetting and Related Services", "2842": "Sanitation/Specialty Cleaning",
        "4011": "Railroads; Freight", "4111": "Local/Suburban Transit (incl. Ferries)", "4112": "Passenger Railways", "4119": "Ambulance Services", "4121": "Limousines and Taxicabs", "4131": "Bus Lines", "4214": "Motor Freight/Trucking/Storage", "4215": "Courier Services", "4225": "Public Warehousing",
        "4411": "Cruise Lines", "4457": "Boat Leases/Rentals", "4468": "Marinas/Marine Supplies", "4511": "Airlines (Not Elsewhere Classified)", "4582": "Airports/Flying Fields", "4722": "Travel Agencies/Tour Operators", "4784": "Bridge and Road Fees/Tolls", "4789": "Transportation Services (Misc)",
        "4812": "Telecomm Equipment/Telephone Sales", "4813": "Key-entry Telecom Merchant", "4814": "Telecomm Services", "4816": "Computer Network/Info Services", "4821": "Telegraph Services", "4829": "Money Transfer", "4899": "Cable/Satellite TV/Radio", "4900": "Utilities",
        "5013": "Motor Vehicle Supplies/New Parts", "5021": "Office/Commercial Furniture", "5039": "Construction Materials", "5044": "Office/Photo/Microfilm Equipment", "5045": "Computers/Software", "5046": "Commercial Equipment", "5047": "Medical/Dental Hospital Supplies", "5051": "Metal Service Centers", "5065": "Electrical Parts/Equipment", "5072": "Hardware Equipment/Supplies", "5074": "Plumbing/Heating Equipment", "5085": "Industrial Supplies", "5094": "Precious Stones/Metals/Jewelry", "5099": "Durable Goods",
        "5111": "Stationery/Office Supplies/Paper", "5122": "Drugs/Druggists Sundries", "5131": "Piece Goods/Notions", "5137": "Uniforms/Commercial Clothing", "5139": "Commercial Footwear", "5169": "Chemicals and Allied Products", "5172": "Petroleum and Petroleum Products", "5192": "Books/Periodicals/Newspapers", "5193": "Florists/Nursery Stock", "5198": "Paints/Varnishes/Supplies", "5199": "Nondurable Goods",
        "5200": "Home Supply Warehouse Stores", "5211": "Building Materials/Lumber Stores", "5231": "Glass/Paint/Wallpaper Stores", "5251": "Hardware Stores", "5261": "Lawn and Garden Supply Stores", "5271": "Mobile Home Dealers",
        "5300": "Wholesale Clubs", "5309": "Duty Free Stores", "5310": "Discount Stores", "5311": "Department Stores", "5331": "Variety Stores", "5399": "General Merchandise Stores",
        "5411": "Grocery Stores/Supermarkets", "5422": "Freezer/Locker Meat Provisioners", "5441": "Candy/Nut/Confectionery Stores", "5451": "Dairy Products Stores", "5462": "Bakeries", "5499": "Misc Food Stores",
        "5511": "Auto/Truck Dealers (Sales/Service)", "5521": "Used Auto/Truck Dealers", "5531": "Auto/Home Supply Stores", "5532": "Automotive Tire Stores", "5533": "Automotive Parts/Accessories Stores", "5541": "Service Stations", "5542": "Fuel Dispenser (Automated)", "5551": "Boat Dealers", "5552": "Electric Vehicle Charging", "5561": "Camper/Recreational Trailer Dealers", "5571": "Motorcycle Shops/Dealers", "5592": "Motor Home Dealers", "5598": "Snowmobile Dealers", "5599": "Misc Automotive Dealers",
        "5611": "Men's/Boys' Clothing Stores", "5621": "Women's Ready to Wear Stores", "5631": "Women's Accessory Stores", "5641": "Children's/Infants' Wear Stores", "5651": "Family Clothing Stores", "5655": "Sports/Riding Apparel Stores", "5661": "Shoe Stores", "5681": "Furriers and Fur Shops", "5691": "Men's/Women's Clothing Stores", "5697": "Alterations/Tailors", "5698": "Wig and Toupee Shops", "5699": "Misc Apparel Stores",
        "5712": "Furniture/Home Furnishings Stores", "5713": "Floor Covering Stores", "5714": "Drapery/Window Coverings Stores", "5718": "Fireplace/Fireplace Screens", "5719": "Misc Home Furnishing Shops", "5722": "Household Appliance Stores", "5732": "Electronic Sales", "5733": "Music Stores", "5734": "Computer Software Stores", "5735": "Record Shops",
        "5811": "Caterers", "5812": "Eating Places/Restaurants", "5813": "Bars/Nightclubs (Alcohol)", "5814": "Fast Food Restaurants",
        "5912": "Drug Stores/Pharmacies", "5921": "Package Stores (Beer/Wine/Liquor)", "5931": "Second Hand/Used Merchandise Stores", "5932": "Antique Shops", "5933": "Pawn Shops", "5935": "Salvage/Wrecking Yards", "5937": "Antique Reproduction Stores", "5940": "Bicycle Shops", "5941": "Sporting Goods Stores", "5942": "Book Stores", "5943": "Office/School Supply Stores", "5944": "Clock/Jewelry/Watch/Silverware Store", "5945": "Game/Toy/Hobby Shops", "5946": "Camera/Photographic Supply Stores", "5947": "Card/Gift/Novelty/Souvenir Shops", "5948": "Leather Goods/Luggage Stores", "5949": "Fabric/Needlework Stores", "5950": "Crystal and Glassware Stores", "5960": "Direct Marketing: Insurance", "5962": "Direct Marketing: Travel Arrangement", "5963": "Door-to-Door Sales", "5964": "Catalog Merchants", "5965": "Combination Catalog/Retail Merchants", "5966": "Outbound Telemarketing", "5967": "Inbound Telemarketing", "5968": "Continuity/Subscription Merchants", "5969": "Direct Marketing: Other", "5970": "Artist/Craft Shops", "5971": "Art Dealers/Galleries", "5972": "Stamp/Coin Stores", "5973": "Religious Goods Stores", "5975": "Hearing Aids (Sales/Service)", "5976": "Orthopedic Goods/Artificial Limb", "5977": "Cosmetic Stores", "5978": "Typewriter Stores", "5983": "Fuel Dealers (Coal/Oil/Wood)", "5992": "Florists", "5993": "Cigar Stores/Stands", "5994": "News Dealers/Newsstands", "5995": "Pet Shops/Pet Food", "5996": "Swimming Pools", "5997": "Electric Razor Stores", "5998": "Tent and Awning Shops", "5999": "Misc and Specialty Retail Stores",
        "6010": "Manual Cash Disbursements", "6011": "Automated Cash Disbursements", "6012": "Financial Institution Service", "6050": "Quasi Cash: FI", "6051": "Quasi Cash: Merchant", "6211": "Securities: Brokers/Dealers", "6300": "Insurance Underwriting/Premiums", "6513": "Real Estate Agents/Rentals", "6532": "Payment Transaction: FI", "6533": "Payment Transaction: Merchant", "6536": "MoneySend Intracountry", "6537": "MoneySend Intercountry", "6538": "Funding Transactions for MoneySend", "6540": "Funding Transactions",
        "7011": "Lodging: Hotels/Motels", "7012": "Timeshares", "7032": "Recreational/Sporting Camps", "7033": "Campgrounds/Trailer Parks",
        "7210": "Cleaning/Garment/Laundry Services", "7211": "Laundry Services: Family/Comm", "7216": "Dry Cleaners", "7217": "Carpet/Upholstery Cleaning", "7221": "Photographic Studios", "7230": "Barber and Beauty Shops", "7251": "Shoe Repair/Shine Parlors", "7261": "Funeral Service/Crematories", "7273": "Dating Services", "7276": "Tax Preparation Service", "7277": "Counseling Service (Debt/Marriage)", "7278": "Buying/Shopping Clubs", "7296": "Clothing Rental", "7297": "Massage Parlors", "7298": "Health and Beauty Spas", "7299": "Personal Services (Misc)",
        "7311": "Advertising Services", "7321": "Consumer Credit Reporting", "7322": "Debt Collection Agency", "7333": "Commercial Art/Graphics/Photo", "7338": "Quick Copy/Reproduction", "7339": "Stenographic/Secretarial Support", "7342": "Exterminating/Disinfecting Services", "7349": "Cleaning/Janitorial Services", "7361": "Employment Agencies", "7372": "Computer Programming Services", "7375": "Information Retrieval Services", "7379": "Computer Maintenance/Repair", "7392": "Management/PR/Consulting", "7393": "Detective/Security/Armored Cars", "7394": "Equipment/Furniture Rental", "7295": "Housekeeping Service (China)", "7395": "Photo Developing Laboratories", "7399": "Business Services (Misc)",
        "7512": "Automobile Rental Agency", "7513": "Truck Rental", "7519": "Motor Home/RV Rental", "7523": "Automobile Parking Lots/Garages", "7531": "Automotive Body Repair Shops", "7534": "Tire Retreading/Repair Shops", "7535": "Automotive Paint Shops", "7538": "Automotive Service Shops", "7542": "Car Washes", "7549": "Towing Services",
        "7622": "Electronic Repair Shops", "7623": "Air Conditioning/Refrigeration Repair", "7629": "Appliance Repair (Small)", "7631": "Clock/Jewelry/Watch Repair", "7641": "Furniture Reupholstery/Repair", "7692": "Welding Repair", "7699": "Repair Shops (Misc)",
        "7800": "Government Owned Lottery (US)", "7801": "Internet Gambling (US)", "7802": "Horse/Dog Racing (US)", "7829": "Video Production/Distribution", "7832": "Motion Picture Theaters", "7841": "Video Rental Stores",
        "7911": "Dance Halls/Schools/Studios", "7922": "Theatrical Producers/Ticket Agencies", "7929": "Bands/Orchestras/Entertainers", "7932": "Pool and Billiard Establishments", "7933": "Bowling Alleys", "7941": "Athletic Fields/Sports Clubs", "7991": "Tourist Attractions/Exhibits", "7992": "Golf Courses (Public)", "7993": "Video Amusement Game Supplies", "7994": "Video Game Arcades", "7995": "Gambling Transactions", "7996": "Amusement Parks/Carnivals", "7997": "Country Clubs/Membership", "7998": "Aquariums/Dolphinariums/Zoos", "7999": "Recreation Services (Misc)",
        "8011": "Doctors (Misc)", "8021": "Dentists/Orthodontists", "8031": "Osteopathic Physicians", "8041": "Chiropractors", "8042": "Optometrists/Ophthalmologists", "8043": "Opticians/Eyeglasses", "8049": "Chiropodists/Podiatrists", "8050": "Nursing/Personal Care Facilities", "8062": "Hospitals", "8071": "Dental/Medical Laboratories", "8099": "Health Practitioners (Misc)",
        "8111": "Attorneys/Legal Services",
        "8211": "Schools (Elem/Secondary)", "8220": "Colleges/Universities", "8241": "Correspondence Schools", "8244": "Business/Secretarial Schools", "8249": "Trade/Vocational Schools", "8299": "Educational Services (Misc)",
        "8351": "Child Care Services", "8398": "Charitable/Social Service Orgs",
        "8641": "Civic/Social/Fraternal Associations", "8651": "Political Organizations", "8661": "Religious Organizations", "8675": "Automobile Associations", "8699": "Membership Orgs (Misc)",
        "8734": "Testing Laboratories (Non-Medical)",
        "8911": "Architectural/Engineering/Surveying", "8931": "Accounting/Auditing/Bookkeeping", "8999": "Professional Services (Misc)",
        "9211": "Court Costs/Alimony/Child Support", "9222": "Fines", "9223": "Bail and Bond Payments", "9311": "Tax Payments", "9399": "Government Services (Misc)", "9402": "Postal Services", "9405": "Intra-Government Purchases", "9406": "Government Lottery (Global)"
    };

    // --- UI 增强：创建全局 Tooltip ---
    const tooltip = document.createElement('div');
    Object.assign(tooltip.style, {
        position: 'absolute',
        display: 'none',
        padding: '10px 14px',
        background: 'rgba(30, 30, 30, 0.95)',
        color: '#fff',
        borderRadius: '6px',
        fontSize: '13px',
        zIndex: '10000',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        pointerEvents: 'none',
        maxWidth: '280px',
        lineHeight: '1.4',
        borderLeft: '4px solid #d71e28'
    });
    document.documentElement.appendChild(tooltip);

    // --- UI 增强：注入响应式 CSS ---
    const style = document.createElement('style');
    style.innerHTML = `
        /* MCC 标签样式 */
        .hsbc-mcc-tag {
            color: #d71e28;
            font-weight: bold;
            text-decoration: underline;
            cursor: help;
            white-space: nowrap;
        }

        /* 内部容器：用于控制布局，不破坏 td 的表格属性（修复表格线消失问题） */
        .hsbc-cell-wrapper {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
        }

        /* 默认/竖屏模式 (Portrait/Mobile) */
        /* 保持流式布局：文字在前，MCC在后 */
        .hsbc-cell-wrapper {
            display: inline-block;
        }
        .hsbc-mcc-tag {
            margin-left: 6px; /* 竖屏时 MCC 在右侧，加左间距 */
        }

        /* 横屏/宽屏模式 (Landscape/Desktop) */
        /* 使用 Flexbox 调换顺序：MCC在前，文字在后 */
        @media (min-width: 768px), (orientation: landscape) {
            .hsbc-cell-wrapper {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start; /* 左对齐 */
            }

            .hsbc-mcc-tag {
                order: -1;          /* 视觉上 MCC 放到最前 */
                margin-left: 0;
                margin-right: 8px;  /* MCC 与文字的间距 */
                min-width: 4ch;     /* 固定宽度对齐，美观 */
                text-align: left;
            }

            /* 确保原有的 Sale/Reversal 文字不会换行 */
            .hsbc-type-text {
                white-space: nowrap;
            }
        }

        /* 原始币种标签样式 */
        .hsbc-fx-badge {
            display: inline-block;
            margin-left: 6px;
            padding: 1px 5px;
            background: #1a73e8;
            color: #fff;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            line-height: 1.3;
            white-space: nowrap;
            cursor: help;
            vertical-align: middle;
        }

        @media (min-width: 768px), (orientation: landscape) {
            .hsbc-fx-badge {
                margin-left: 8px;
            }
        }
    `;
    document.head.appendChild(style);

    // 2. 匹配逻辑
    const normalize = (str) => (str || "").replace(/[^A-Z0-9]/gi, '').toUpperCase();
    const mccCache = new Map();
    const fxCache = new Map(); // 新增：缓存原始币种信息
    const dashboardMccCache = new Map(); // Dashboard 页面 MCC 缓存
    const _processed = new WeakSet();
    const _dashboardProcessed = new WeakSet();

    // [DEBUG] 暴露到 window 便于控制台检查（调试完可删除）
    window.__mccCache = mccCache;
    window.__fxCache = fxCache;
    window.__dashboardMccCache = dashboardMccCache;

    const _xhrMap = new WeakMap();
    XMLHttpRequest.prototype.open = new Proxy(XMLHttpRequest.prototype.open, {
        apply: (target, thisArg, args) => {
            _xhrMap.set(thisArg, args[1]);
            return Reflect.apply(target, thisArg, args);
        }
    });

    XMLHttpRequest.prototype.send = new Proxy(XMLHttpRequest.prototype.send, {
        apply: (target, thisArg, args) => {
            thisArg.addEventListener('load', function() {
                const url = _xhrMap.get(thisArg);
                if (url && url.includes('/postedtransactions')) {
                    try {
                        // 切换账单时清空缓存，避免旧数据干扰新账单的渲染
                        mccCache.clear();
                        fxCache.clear();

                        const json = JSON.parse(thisArg.responseText);
                        const transactions = json.transactions || [];

                        // 工具函数：从文本中提取原始金额
                        // 优先匹配 "金额 X 汇率" 模式，回退到第一个 "数字.数字" 模式
                        function extractAmount(text) {
                            if (!text) return '';
                            const fxMatch = text.match(/(\d[\d,]*\.\d+)\s*X\s*\d[\d,]*\.\d+/);
                            if (fxMatch) return fxMatch[1];
                            const numMatch = text.match(/(\d[\d,]*\.\d+)/);
                            return numMatch ? numMatch[1] : '';
                        }

                        // 工具函数：生成缓存 key
                        function makeKey(tx) {
                            const date = tx.transactionDate.split('-');
                            const mmddyyyy = `${date[1]}/${date[2]}/${date[0]}`;
                            const amt = Math.abs(tx.transactionAmount).toFixed(2);
                            const desc = normalize(tx.description);
                            return `${mmddyyyy}_${amt}_${desc}`;
                        }

                        // ========== 格式 A: 253 主交易 + 997 补充交易（同 transactionId） ==========
                        // 适用于 current Statement 等账单
                        const groups = new Map();
                        transactions.forEach(t => {
                            const id = t.transactionId || t.industryTransactionIdentifier;
                            if (!groups.has(id)) groups.set(id, []);
                            groups.get(id).push(t);
                        });

                        groups.forEach((group, id) => {
                            // 跳过补充信息行（transactionId='0' 或空），它们属于格式 B
                            if (!id || id === '0') return;

                            const mainTx = group.find(t => t.transactionCode?.value === '253');
                            if (!mainTx) return;

                            const key = makeKey(mainTx);
                            mccCache.set(key, mainTx.merchantCategoryCode);

                            // 外币交易（非 USD/840）且有 997 补充交易
                            if (mainTx.currencyCode !== '840') {
                                const suppTxs = group.filter(t => t.transactionCode?.value === '997');
                                if (suppTxs.length > 0) {
                                    const parts = suppTxs.map(t => t.merchandiseDescription).filter(Boolean);
                                    const fullDesc = parts.join(' ');
                                    const originalAmount = extractAmount(parts.join(' '));
                                    if (originalAmount) {
                                        fxCache.set(key, { originalAmount, fullDesc });
                                    }
                                }
                            }
                        });

                        // ========== 格式 B: 253 真实交易 + 紧跟的 transactionId='0' 补充行 ==========
                        // 适用于 0728 Statement 等账单（无 997，补充信息在 description 字段）
                        for (let i = 0; i < transactions.length; i++) {
                            const tx = transactions[i];
                            // 只处理真实 253 交易（有有效 transactionId）
                            if (tx.transactionCode?.value !== '253') continue;
                            if (!tx.transactionId || tx.transactionId === '0') continue;
                            // 只处理外币交易
                            if (tx.currencyCode === '840') continue;
                            // 如果格式 A 已处理（有 997），跳过
                            if (fxCache.has(makeKey(tx))) continue;

                            // 向后查找 transactionId='0' 的补充行
                            const suppRows = [];
                            for (let j = i + 1; j < transactions.length; j++) {
                                const next = transactions[j];
                                // 遇到下一笔真实交易（有有效 id）则停止
                                if (next.transactionId && next.transactionId !== '0') break;
                                suppRows.push(next);
                            }

                            if (suppRows.length === 0) continue;

                            const key = makeKey(tx);
                            // 格式 B 的补充信息在 description 字段
                            const parts = suppRows.map(s => s.description).filter(Boolean);
                            const fullDesc = parts.join(' ');
                            const originalAmount = extractAmount(fullDesc);

                            if (originalAmount) {
                                fxCache.set(key, { originalAmount, fullDesc });
                            }
                        }

                        // 数据处理完成后主动触发绘制，确保新账单数据立即渲染
                        draw();
                    } catch (e) {}
                }

                // ========== Dashboard 页面：mmf-account-transactions API ==========
                // pending 交易直接含 merchantCategoryCode，无需 997 补充行
                if (url && url.includes('/mmf-account-transactions--us-hbus-prod-proxy/v2/transactions')) {
                    try {
                        dashboardMccCache.clear();

                        const json = JSON.parse(thisArg.responseText);
                        const transactions = json.transactions || [];

                        transactions.forEach(t => {
                            // 只处理有 MCC 的交易
                            if (!t.merchantCategoryCode) return;

                            // 日期转换：ISO "2026-08-03" -> "08/03/2026"
                            const date = t.transactionDate.split('-');
                            const mmddyyyy = `${date[1]}/${date[2]}/${date[0]}`;

                            // 金额（transactionAmount 是对象）
                            const amt = Math.abs(
                                (t.transactionAmount && t.transactionAmount.amount) || 0
                            ).toFixed(2);

                            // 描述：优先用 merchantName，回退到 transactionDescriptions 拼接
                            let desc = t.merchantName || '';
                            if (!desc && t.transactionDescriptions) {
                                desc = t.transactionDescriptions.join(' ');
                            }

                            const key = `${mmddyyyy}_${amt}_${normalize(desc)}`;
                            dashboardMccCache.set(key, t.merchantCategoryCode);
                        });

                        drawDashboard();
                    } catch (e) {}
                }
            });
            return Reflect.apply(target, thisArg, args);
        }
    });

    // 3. UI 注入与悬停事件
    function draw() {
        const rows = document.querySelectorAll('tr.account_pg_new');
        rows.forEach(row => {
            const cell = row.querySelector('td.mob_type');
            const amtSpan = row.querySelector('.trans_amt');
            if (!cell || !amtSpan) return;

            const date = row.querySelector('td[data-label="Date"] .small')?.innerText.trim();
            if (!date) return;

            const desc = normalize(row.querySelector('td.mob16')?.innerText);
            const amt = Math.abs(parseFloat(amtSpan.innerText.replace(/[^\d.-]/g, ''))).toFixed(2);
            const key = `${date}_${amt}_${desc}`;

            // ========== MCC 处理（独立检查，不影响 FX badge） ==========
            if (!_processed.has(cell)) {
                const mcc = mccCache.get(key);
                if (mcc) {
                    _processed.add(cell); // 标记已处理

                    // 1. 创建 MCC 元素
                    const mccLink = document.createElement('span');
                    mccLink.innerText = mcc;
                    mccLink.className = 'hsbc-mcc-tag';

                    // 悬停逻辑
                    mccLink.onmouseenter = (e) => {
                        const name = MCC_DB[mcc] || "Manual recognition required.";
                        tooltip.innerHTML = `<div style="font-weight:bold;margin-bottom:4px;color:#ff4d4d">MCC: ${mcc}</div><div>${name}</div>`;
                        tooltip.style.display = 'block';
                    };
                    mccLink.onmousemove = (e) => {
                        tooltip.style.left = (e.pageX + 15) + 'px';
                        tooltip.style.top = (e.pageY + 10) + 'px';
                    };
                    mccLink.onmouseleave = () => {
                        tooltip.style.display = 'none';
                    };

                    // 2. DOM 结构重组：为了安全地应用 Flexbox 而不破坏表格 td
                    // 将原有的文本（如 "Sale"）提取出来放入 span
                    const range = document.createRange();
                    range.selectNodeContents(cell);
                    const originalContent = range.extractContents(); // 提取现有节点

                    const typeSpan = document.createElement('span');
                    typeSpan.className = 'hsbc-type-text';
                    typeSpan.appendChild(originalContent);

                    // 创建 Wrapper 容器
                    const wrapper = document.createElement('div');
                    wrapper.className = 'hsbc-cell-wrapper';

                    // 将 [原有文本] 和 [MCC] 放入容器
                    // CSS 会在横屏时通过 order: -1 将 MCC 放到前面
                    wrapper.appendChild(typeSpan);
                    wrapper.appendChild(mccLink);

                    // 将容器放回单元格
                    cell.appendChild(wrapper);
                }
            }

            // ========== 金额列：原始币种组件（独立于 MCC，每次都检查） ==========
            const fxInfo = fxCache.get(key);
            const existingBadge = amtSpan.parentElement?.querySelector('.hsbc-fx-badge');

            if (fxInfo && fxInfo.originalAmount) {
                // 有 FX 数据：如果旧标签不存在或数据不一致，则（重新）创建
                const needCreate = !existingBadge || existingBadge.innerText !== fxInfo.originalAmount;
                if (needCreate) {
                    if (existingBadge) existingBadge.remove();

                    const fxBadge = document.createElement('span');
                    fxBadge.className = 'hsbc-fx-badge';
                    fxBadge.innerText = fxInfo.originalAmount;

                    // 悬停显示完整信息
                    fxBadge.onmouseenter = (e) => {
                        tooltip.innerHTML = `
                            <div style="font-weight:bold;margin-bottom:4px;color:#4dabf7">Original Amount</div>
                            <div style="white-space:pre-wrap;">${fxInfo.fullDesc}</div>
                        `;
                        tooltip.style.display = 'block';
                    };
                    fxBadge.onmousemove = (e) => {
                        tooltip.style.left = (e.pageX + 15) + 'px';
                        tooltip.style.top = (e.pageY + 10) + 'px';
                    };
                    fxBadge.onmouseleave = () => {
                        tooltip.style.display = 'none';
                    };

                    amtSpan.after(fxBadge);
                }
            } else if (existingBadge) {
                // 无 FX 数据但有旧标签（切换账单后该行不再是外币交易），移除旧标签
                existingBadge.remove();
            }
        });
    }

    // 4. Dashboard 页面 UI 注入
    // Dashboard 交易行结构：<tr class="description-table-row">
    //   日期: <date-display><div>08/03/2026</div></date-display>
    //   描述: <div id="transaction-description-preview-N"><p><span>DiDi</span></p>...
    //   金额: <td class="table-row-column3"><p class="m-0"> 1.51</p>
    function drawDashboard() {
        const rows = document.querySelectorAll('tr.description-table-row');
        rows.forEach(row => {
            if (_dashboardProcessed.has(row)) return;

            // 日期
            const dateEl = row.querySelector('date-display div');
            if (!dateEl) return;
            const date = dateEl.textContent.trim();

            // 描述：取第一行 <span> 内容（与 API 的 merchantName 对应）
            const descSpan = row.querySelector('.table-row-column2 p span');
            if (!descSpan) return;
            const desc = normalize(descSpan.textContent);

            // 金额：column3 下的 <p>，取文本数字
            const amtP = row.querySelector('.table-row-column3 p');
            if (!amtP) return;
            const amt = Math.abs(parseFloat(amtP.textContent.replace(/[^\d.-]/g, ''))).toFixed(2);
            // 无金额（如纯 Payment 信用行）则跳过
            if (amt === '0.00') {
                // 也检查 column4（credit 列）
                const creditP = row.querySelector('.table-row-column4 p');
                if (!creditP) return;
                const creditAmt = Math.abs(parseFloat(creditP.textContent.replace(/[^\d.-]/g, ''))).toFixed(2);
                if (creditAmt === '0.00') return;
                // Payment 交易没有 MCC，跳过
                return;
            }

            const key = `${date}_${amt}_${desc}`;
            const mcc = dashboardMccCache.get(key);
            if (!mcc) return;

            _dashboardProcessed.add(row);

            // 注入到描述列：把 MCC 放在描述文本之后
            const descCol = row.querySelector('.table-row-column2');
            if (!descCol || descCol.querySelector('.hsbc-mcc-tag')) return;

            const mccLink = document.createElement('span');
            mccLink.innerText = mcc;
            mccLink.className = 'hsbc-mcc-tag';
            // Dashboard 描述列是纵向布局，MCC 标签换行显示
            mccLink.style.display = 'block';
            mccLink.style.marginTop = '4px';

            // 悬停逻辑
            mccLink.onmouseenter = (e) => {
                const name = MCC_DB[mcc] || "Manual recognition required.";
                tooltip.innerHTML = `<div style="font-weight:bold;margin-bottom:4px;color:#ff4d4d">MCC: ${mcc}</div><div>${name}</div>`;
                tooltip.style.display = 'block';
            };
            mccLink.onmousemove = (e) => {
                tooltip.style.left = (e.pageX + 15) + 'px';
                tooltip.style.top = (e.pageY + 10) + 'px';
            };
            mccLink.onmouseleave = () => {
                tooltip.style.display = 'none';
            };

            descCol.appendChild(mccLink);
        });
    }

    const run = () => {
        // Statement 页面监听
        new MutationObserver(() => {
            if (mccCache.size > 0 || fxCache.size > 0) draw();
        }).observe(document.documentElement, { childList: true, subtree: true });

        // Dashboard 页面监听
        new MutationObserver(() => {
            if (dashboardMccCache.size > 0) drawDashboard();
        }).observe(document.documentElement, { childList: true, subtree: true });
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
    else run();
})();
