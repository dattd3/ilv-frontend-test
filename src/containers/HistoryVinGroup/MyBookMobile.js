import React, { useState, useEffect, useRef, forwardRef } from 'react'
import HTMLFlipBook from 'react-pageflip'
import './styles.scss'

const IMAGE_MAPPING = {
    1: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page1.jpg',
    2: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page2.jpg',
    3: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page3.jpg',
    4: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page4.jpg',
    5: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page5.jpg',
    6: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page6.jpg',
    7: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page7.jpg',
    8: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page8.jpg',
    9: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page9.jpg',
    10: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page10.jpg',
    11: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page11.jpg',
    12: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page12.jpg',
    13: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page13.jpg',
    14: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page14.jpg',
    15: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page15.jpg',
    16: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page16.jpg',
    17: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page17.jpg',
    18: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page18.jpg',
    19: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page19.jpg',
    20: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page20.jpg',
    21: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page21.jpg',
    22: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page22.jpg',
    23: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page23.jpg',
    24: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page24.jpg',
    25: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page25.jpg',
    26: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page26.jpg',
    27: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page27.jpg',
    28: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page28.jpg',
    29: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page29.jpg',
    30: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page30.jpg',
    31: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page31.jpg',
    32: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page32.jpg',
    33: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page33.jpg',
    34: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page34.jpg',
    35: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page35.jpg',
    36: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page36.jpg',
    37: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page37.jpg',
    38: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page38.jpg',
    39: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page39.jpg',
    40: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page40.jpg',
    41: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page41.jpg',
    42: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page42.jpg',
    43: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page43.jpg',
    44: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page44.jpg',
    45: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page45.jpg',
    46: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page46.jpg',
    47: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page47.jpg',
    48: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page48.jpg',
    49: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page49.jpg',
    50: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page50.jpg',
    51: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page51.jpg',
    52: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page52.jpg',
    53: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page53.jpg',
    54: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page54.jpg',
    55: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page55.jpg',
    56: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page56.jpg',
    57: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page57.jpg',
    58: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page58.jpg',
    59: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page59.jpg',
    60: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page60.jpg',
    61: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page61.jpg',
    62: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page62.jpg',
    63: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page63.jpg',
    64: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page64.jpg',
    65: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page65.jpg',
    66: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page66.jpg',
    67: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page67.jpg',
    68: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page68.jpg',
    69: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page69.jpg',
    70: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page70.jpg',
    71: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page71.jpg',
    72: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page72.jpg',
    73: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page73.jpg',
    74: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page74.jpg',
    75: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page75.jpg',
    76: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page76.jpg',
    77: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page77.jpg',
    78: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page78.jpg',
    79: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page79.jpg',
    80: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page80.jpg',
    81: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page81.jpg',
    82: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page82.jpg',
    83: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page83.jpg',
    84: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page84.jpg',
    85: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page85.jpg',
    86: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page86.jpg',
    87: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page87.jpg',
    88: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page88.jpg',
    89: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page89.jpg',
    90: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page90.jpg',
    91: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page91.jpg',
    92: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page92.jpg',
    93: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page93.jpg',
    94: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page94.jpg',
    95: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page95.jpg',
    96: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page96.jpg',
    97: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page97.jpg',
    98: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page98.jpg',
    99: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page99.jpg',
    100: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page100.jpg',
    101: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page101.jpg',
    102: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page102.jpg',
    103: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page103.jpg',
    104: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page104.jpg',
    105: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page105.jpg',
    106: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page106.jpg',
    107: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page107.jpg',
    108: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page108.jpg',
    109: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page109.jpg',
    110: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page110.jpg',
    111: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page111.jpg',
    112: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page112.jpg',
    113: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page113.jpg',
    114: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page114.jpg',
    115: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page115.jpg',
    116: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page116.jpg',
    117: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page117.jpg',
    118: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page118.jpg',
    119: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page119.jpg',
    120: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page120.jpg',
    121: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page121.jpg',
    122: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page122.jpg',
    123: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page123.jpg',
    124: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page124.jpg',
    125: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page125.jpg',
    126: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page126.jpg',
    127: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page127.jpg',
    128: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page128.jpg',
    129: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page129.jpg',
    130: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page130.jpg',
    131: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page131.jpg',
    132: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page132.jpg',
    133: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page133.jpg',
    134: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page134.jpg',
    135: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page135.jpg',
    136: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page136.jpg',
    137: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page137.jpg',
    138: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page138.jpg',
    139: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page139.jpg',
    140: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page140.jpg',
    141: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page141.jpg',
    142: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page142.jpg',
    143: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page143.jpg',
    144: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page144.jpg',
    145: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page145.jpg',
    146: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page146.jpg',
    147: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page147.jpg',
    148: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page148.jpg',
    149: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page149.jpg',
    150: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page150.jpg',
    151: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page151.jpg',
    152: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page152.jpg',
    153: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page153.jpg',
    154: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page154.jpg',
    155: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page155.jpg',
    156: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page156.jpg',
    157: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page157.jpg',
    158: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page158.jpg',
    159: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page159.jpg',
    160: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page160.jpg',
    161: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page161.jpg',
    162: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page162.jpg',
    163: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page163.jpg',
    164: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page164.jpg',
    165: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page165.jpg',
    166: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page166.jpg',
    167: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page167.jpg',
    168: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page168.jpg',
    169: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page169.jpg',
    170: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page170.jpg',
    171: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page171.jpg',
    172: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page172.jpg',
    173: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page173.jpg',
    174: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page174.jpg',
    175: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page175.jpg',
    176: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page176.jpg',
    177: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page177.jpg',
    178: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page178.jpg',
    179: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page179.jpg',
    180: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page180.jpg',
    181: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page181.jpg',
    182: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page182.jpg',
    183: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page183.jpg',
    184: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page184.jpg',
    185: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page185.jpg',
    186: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page186.jpg',
    187: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page187.jpg',
    188: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page188.jpg',
    189: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page189.jpg',
    190: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page190.jpg',
    191: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page191.jpg',
    192: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page192.jpg',
    193: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page193.jpg',
    194: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page194.jpg',
    195: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page195.jpg',
    196: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page196.jpg',
    197: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page197.jpg',
    198: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page198.jpg',
    199: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page199.jpg',
    200: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page200.jpg',
    201: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page201.jpg',
    202: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page202.jpg',
    203: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page203.jpg',
    204: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page204.jpg',
    205: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page205.jpg',
    206: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page206.jpg',
    207: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page207.jpg',
    208: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page208.jpg',
    209: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page209.jpg',
    210: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page210.jpg',
    211: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page211.jpg',
    212: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page212.jpg',
    213: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page213.jpg',
    214: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page214.jpg',
    215: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page215.jpg',
    216: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page216.jpg',
    217: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page217.jpg',
    218: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page218.jpg',
    219: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page219.jpg',
    220: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page220.jpg',
    221: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page221.jpg',
    222: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page222.jpg',
    223: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page223.jpg',
    224: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page224.jpg',
    225: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page225.jpg',
    226: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page226.jpg',
    227: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page227.jpg',
    228: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page228.jpg',
    229: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page229.jpg',
    230: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page230.jpg',
    231: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page231.jpg',
    232: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page232.jpg',
    233: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page233.jpg',
    234: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page234.jpg',
    235: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page235.jpg',
    236: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page236.jpg',
    237: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page237.jpg',
    238: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page238.jpg',
    239: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page239.jpg',
    240: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page240.jpg',
    241: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page241.jpg',
    242: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page242.jpg',
    243: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page243.jpg',
    244: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page244.jpg',
    245: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page245.jpg',
    246: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page246.jpg',
    247: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page247.jpg',
    248: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page248.jpg',
    249: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page249.jpg',
    250: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page250.jpg',
    251: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page251.jpg',
    252: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page252.jpg',
    253: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page253.jpg',
    254: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page254.jpg',
    255: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page255.jpg',
    256: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page256.jpg',
    257: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page257.jpg',
    258: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page258.jpg',
    259: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page259.jpg',
    260: 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page260.jpg',
};

const PageCover = React.forwardRef((props, ref) => {
    return (
      <div className="page page-cover page-cover-top" ref={ref} data-density="hard">
        <div className="page-content">
            <h2>BOOK TITLE</h2>
        </div>
      </div>
    );
  });
  
  const Page = React.forwardRef((props, ref) => {
    return (
      <div className="page" ref={ref}>
            <div className="page-content">
                <div className="page-image">
                    <img src={IMAGE_MAPPING[props?.page]} />
                </div>
            </div>
      </div>
    );
  });
  
export default function MyBook(props) {
    const flipBook = useRef();

    const nextButtonClick = () => {
      flipBook.getPageFlip().flipNext();
    };
  
    const prevButtonClick = () => {
      flipBook.getPageFlip().flipPrev();
    };
  
    const onPage = (e) => {
    //   this.setState({
    //     page: e.data,
    //   });
    };
  
  
    const pages = [1, 2, 3, 4, 5, 6, 7]

    return (
    <div className='container-md' style={{ margin: '0 auto', position: 'relative' }}>
        <HTMLFlipBook
            width={550}
            height={733}
            size="stretch"
            minWidth={315}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1533}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={onPage}
            className="demo-book"
            ref={flipBook}
        >
            <PageCover>BOOK TITLE</PageCover>
            
            {pages.map((item) => (
                <Page key={`page-item-${item}`} page={item} />
            ))}
            
            <PageCover>THE END</PageCover>
        </HTMLFlipBook>
    </div>
    );
}
