import React, { useState, useEffect, useRef, forwardRef } from "react"
import HTMLFlipBook from "@cuongnv56/react-pageflip"
import { saveAs } from 'file-saver'
import { chunk, last } from 'lodash'
import LoadingModal from "components/Common/LoadingModal"

const imageMapping = {
    1: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page1.png",
    2: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page2.png",
    3: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page3.png",
    4: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page4.png",
    5: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page5.png",
    6: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page6.png",
    7: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page7.png",
    8: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page8.png",
    9: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page9.png",
    10: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page10.png",
    11: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page11.png",
    12: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page12.png",
    13: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page13.png",
    14: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page14.png",
    15: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page15.png",
    16: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page16.png",
    17: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page17.png",
    18: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page18.png",
    19: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page19.png",
    20: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page20.png",
    21: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page21.png",
    22: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page22.png",
    23: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page23.png",
    24: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page24.png",
    25: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page25.png",
    26: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page26.png",
    27: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page27.png",
    28: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page28.png",
    29: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page29.png",
    30: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page30.png",
    31: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page31.png",
    32: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page32.png",
    33: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page33.png",
    34: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page34.png",
    35: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page35.png",
    36: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page36.png",
    37: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page37.png",
    38: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page38.png",
    39: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page39.png",
    40: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page40.png",
    41: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page41.png",
    42: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page42.png",
    43: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page43.png",
    44: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page44.png",
    45: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page45.png",
    46: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page46.png",
    47: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page47.png",
    48: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page48.png",
    49: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page49.png",
    50: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page50.png",
    51: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page51.png",
    52: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page52.png",
    53: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page53.png",
    54: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page54.png",
    55: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page55.png",
    56: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page56.png",
    57: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page57.png",
    58: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page58.png",
    59: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page59.png",
    60: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page60.png",
    61: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page61.png",
    62: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page62.png",
    63: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page63.png",
    64: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page64.png",
    65: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page65.png",
    66: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page66.png",
    67: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page67.png",
    68: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page68.png",
    69: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page69.png",
    70: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page70.png",
    71: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page71.png",
    72: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page72.png",
    73: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page73.png",
    74: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page74.png",
    75: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page75.png",
    76: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page76.png",
    77: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page77.png",
    78: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page78.png",
    79: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page79.png",
    80: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page80.png",
    81: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page81.png",
    82: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page82.png",
    83: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page83.png",
    84: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page84.png",
    85: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page85.png",
    86: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page86.png",
    87: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page87.png",
    88: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page88.png",
    89: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page89.png",
    90: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page90.png",
    91: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page91.png",
    92: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page92.png",
    93: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page93.png",
    94: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page94.png",
    95: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page95.png",
    96: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page96.png",
    97: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page97.png",
    98: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page98.png",
    99: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page99.png",
    100: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page100.png",
    101: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page101.png",
    102: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page102.png",
    103: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page103.png",
    104: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page104.png",
    105: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page105.png",
    106: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page106.png",
    107: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page107.png",
    108: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page108.png",
    109: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page109.png",
    110: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page110.png",
    111: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page111.png",
    112: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page112.png",
    113: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page113.png",
    114: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page114.png",
    115: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page115.png",
    116: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page116.png",
    117: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page117.png",
    118: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page118.png",
    119: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page119.png",
    120: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page120.png",
    121: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page121.png",
    122: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page122.png",
    123: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page123.png",
    124: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page124.png",
    125: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page125.png",
    126: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page126.png",
    127: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page127.png",
    128: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page128.png",
    129: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page129.png",
    130: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page130.png",
    131: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page131.png",
    132: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page132.png",
    133: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page133.png",
    134: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page134.png",
    135: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page135.png",
    136: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page136.png",
    137: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page137.png",
    138: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page138.png",
    139: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page139.png",
    140: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page140.png",
    141: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page141.png",
    142: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page142.png",
    143: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page143.png",
    144: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page144.png",
    145: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page145.png",
    146: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page146.png",
    147: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page147.png",
    148: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page148.png",
    149: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page149.png",
    150: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page150.png",
    151: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page151.png",
    152: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page152.png",
    153: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page153.png",
    154: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page154.png",
    155: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page155.png",
    156: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page156.png",
    157: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page157.png",
    158: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page158.png",
    159: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page159.png",
    160: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page160.png",
    161: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page161.png",
    162: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page162.png",
    163: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page163.png",
    164: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page164.png",
    165: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page165.png",
    166: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page166.png",
    167: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page167.png",
    168: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page168.png",
    169: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page169.png",
    170: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page170.png",
    171: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page171.png",
    172: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page172.png",
    173: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page173.png",
    174: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page174.png",
    175: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page175.png",
    176: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page176.png",
    177: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page177.png",
    178: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page178.png",
    179: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page179.png",
    180: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page180.png",
    181: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page181.png",
    182: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page182.png",
    183: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page183.png",
    184: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page184.png",
    185: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page185.png",
    186: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page186.png",
    187: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page187.png",
    188: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page188.png",
    189: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page189.png",
    190: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page190.png",
    191: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page191.png",
    192: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page192.png",
    193: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page193.png",
    194: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page194.png",
    195: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page195.png",
    196: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page196.png",
    197: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page197.png",
    198: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page198.png",
    199: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page199.png",
    200: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page200.png",
    201: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page201.png",
    202: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page202.png",
    203: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page203.png",
    204: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page204.png",
    205: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page205.png",
    206: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page206.png",
    207: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page207.png",
    208: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page208.png",
    209: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page209.png",
    210: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page210.png",
    211: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page211.png",
    212: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page212.png",
    213: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page213.png",
    214: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page214.png",
    215: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page215.png",
    216: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page216.png",
    217: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page217.png",
    218: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page218.png",
    219: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page219.png",
    220: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page220.png",
    221: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page221.png",
    222: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page222.png",
    223: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page223.png",
    224: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page224.png",
    225: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page225.png",
    226: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page226.png",
    227: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page227.png",
    228: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page228.png",
    229: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page229.png",
    230: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page230.png",
    231: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page231.png",
    232: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page232.png",
    233: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page233.png",
    234: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page234.png",
    235: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page235.png",
    236: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page236.png",
    237: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page237.png",
    238: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page238.png",
    239: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page239.png",
    240: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page240.png",
    241: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page241.png",
    242: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page242.png",
    243: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page243.png",
    244: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page244.png",
    245: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page245.png",
    246: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page246.png",
    247: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page247.png",
    248: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page248.png",
    249: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page249.png",
    250: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page250.png",
    251: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page251.png",
    252: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page252.png",
    253: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page253.png",
    254: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page254.png",
    255: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page255.png",
    256: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page256.png",
    257: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page257.png",
    258: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page258.png",
    259: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page259.png",
    260: "https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/Suky/Page260.png"
}

const Page = forwardRef((props, ref) => {
    return (
        <div className={`page page-${props?.page}`} ref={ref}>
            <div className="page-content">
                <div className="page-image"><img src={imageMapping[props?.page]} /></div>
            </div>
        </div>
    )
});

export default function MyBook(props) {
    const book = useRef()
    const page = useRef()
    const wrapBookRef = useRef()
    const pageScrollRef = useRef([])
    const totalPages = 260
    const leftPagesToLoad = 10
    const itemPerLoad = 30 // số pages mỗi lượt load
    const [isShowThumbnails, setIsShowThumbnails] = useState(false)
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [isZoomIn, setIsZoomIn] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [isPageSidebarLeftSelected, setIsPageSidebarLeftSelected] = useState(false)
    const [isFilterPage, setIsFilterPage] = useState(false)
    const [pages, SetPages] = useState([])
    const [isLoading, SetIsLoading] = useState(true)
    let isWheeling

    useEffect(() => {
        setTimeout(() => {
            SetIsLoading(false)
        }, 400)

        SetPages(generatePages())

        page.current.scrollIntoView({
            behavior: 'instant'
        }, 0)

        const onFullscreenChange = () => {
            setIsFullScreen(Boolean(document.fullscreenElement))
        }

        wrapBookRef?.current?.addEventListener('wheel', onWheel, { passive: false })
        document.addEventListener('fullscreenchange', onFullscreenChange)
        
        return () => {
            document.removeEventListener('fullscreenchange', onFullscreenChange)
            wrapBookRef?.current?.removeEventListener('wheel', onWheel, { passive: false })
        }
    }, [])

    const generatePages = (pageToLoad = itemPerLoad, startNumber = 0) => {
        const pageItems = new Array(pageToLoad).fill().map((value, index) => startNumber + index + 1)
        return pageItems
    }

    useEffect(() => {
        const timeOut = setTimeout(() => {
            if (!isFullScreen) {
                page.current.scrollIntoView({
                    behavior: 'smooth'
                }, 0)
            }
        }, 100)

        return () => {
            clearTimeout(timeOut)
        }
    }, [isFullScreen])

    useEffect(() => {
        if (isFilterPage || isPageSidebarLeftSelected) {
            let pageToSwitch = currentPage
            switch (currentPage) {
                case 1: // Page đầu tiên
                    pageToSwitch = 0
                    break
                case totalPages: // Page cuối cùng
                    pageToSwitch = totalPages - 1
                    break
            }

            if (currentPage >= pages?.length - leftPagesToLoad) { // leftPagesToLoad page cuối của mỗi lượt load mới bắt đầu load thêm
                const pagesToSave = [...pages, ...generatePages(itemPerLoad, last(pages))]
                SetPages(pagesToSave)
            }

            setTimeout(() => {
                book?.current?.pageFlip()?.turnToPage(pageToSwitch)
            }, 200)
        }
    }, [currentPage, isFilterPage, isPageSidebarLeftSelected])

    const handleCloseMenu = () => {
        setIsShowThumbnails(false)
    }

    const openFullscreen = () => {
        if (page?.current?.requestFullscreen) {
            page?.current.requestFullscreen();
        } else if (page?.current?.webkitRequestFullscreen) { /* Safari */
            page?.current?.webkitRequestFullscreen();
        } else if (page?.current?.msRequestFullscreen) { /* IE11 */
            page?.current?.msRequestFullscreen();
        }
        setIsFullScreen(true)
    }
    
    const closeFullscreen = () => {
        if (document?.exitFullscreen) {
            document?.exitFullscreen()
        } else if (document?.webkitExitFullscreen) { /* Safari */
            document?.webkitExitFullscreen()
        } else if (document?.msExitFullscreen) { /* IE11 */
            document?.msExitFullscreen()
        }
        setIsFullScreen(false)
    }

    const handleScreen = () => {
        setIsFullScreen(!isFullScreen)
        if (!isFullScreen) {
            openFullscreen()
        } else {
            closeFullscreen()
        }
    }

    const handleShowThumbnails = () => {
        setIsShowThumbnails(!isShowThumbnails)
    }

    const handleKeyDown = e => {
        setIsFilterPage(e?.key === 'Enter')
        setIsPageSidebarLeftSelected(false)
    }

    const handlePrint = (event) => {
        // if('print' in window){
        //     window.print();
        //   } else {
        //     alert("Printing is not supported on this device");
        //   }


        var iframe = document.createElement('iframe');
        // iframe.id = 'pdfIframe'
        iframe.className='pdfIframe'
        document.body.appendChild(iframe);
        iframe.style.display = 'none';
        iframe.onload = function () {
            setTimeout(function () {
                iframe.focus();
                iframe.contentWindow.print();
                URL.revokeObjectURL("https://myvinpearl.s3.ap-southeast-1.amazonaws.com/shared/SK.pdf")
                // document.body.removeChild(iframe)
            }, 1);
        };
        iframe.src = "https://myvinpearl.s3.ap-southeast-1.amazonaws.com/shared/SK.pdf";
    }

    const downloadBook = () => {
        saveAs("https://myvinpearl.s3.ap-southeast-1.amazonaws.com/shared/SK.pdf")
    }

    const handleZoom = () => {
        setIsZoomIn(!isZoomIn)
    }

    const handleFlip = e => {
        const p = e?.data + 1
        setCurrentPage(Number(p))
        setIsPageSidebarLeftSelected(true)
        setIsFilterPage(true)
        pageScrollRef?.current?.[p]?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        }, 800)
    }

    const handleChangePage = (p, onSideBarLeft = false) => {
        setIsPageSidebarLeftSelected(onSideBarLeft)
        setCurrentPage(Number(p))
        if (onSideBarLeft) {
            setIsFilterPage(false)
        }
    }

    const onWheel = e => {
        e?.preventDefault()
        e?.stopPropagation()
        window.clearTimeout(isWheeling)
        isWheeling = setTimeout(() => {
            const delta = Math.sign(e?.deltaY);
            if (delta > 0) { // Cuộn chuột xuống đọc tiếp
                book?.current?.pageFlip()?.flipNext('bottom')
            } else if (delta < 0) { // Cuộn chuột lên đọc lại
                book?.current?.pageFlip()?.flipPrev('bottom')
            }
        }, 100)
    }

    const sidebarPages = (() => {
        const firstPage = 1
        const lastPage = pages?.length
        const center = chunk(pages.filter(item => item !== firstPage && item !== lastPage), 2)
        return [[firstPage], ...center , [lastPage]]
    })()

    return (
        <>
            <LoadingModal show={isLoading} />
            <div className="history-vingroup-page" id="history-vingroup-page" ref={page}>
                <div className="d-flex wrap-page">
                    <div className={`sidebar-left ${ isShowThumbnails ? 'visible' : '' }`}>
                        <div className="d-flex align-items-center justify-content-between top-sidebar">
                            <span className="d-inline-flex align-items-center thumbnails">
                                <span className="d-inline-flex justify-content-center align-items-center menu-item">
                                    <svg data-v-78b93dcc="" version="1.1" viewBox="0 0 24 24" className="svg-icon svg-icon svg-fill" focusable="false"><path pid="0" d="M9 3c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1V4c0-.6.4-1 1-1h5zm11 0c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1h-5c-.6 0-1-.4-1-1V4c0-.6.4-1 1-1h5zM9 14c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1v-5c0-.6.4-1 1-1h5zm11 0c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1h-5c-.6 0-1-.4-1-1v-5c0-.6.4-1 1-1h5z"></path></svg>
                                </span>
                                <span>Thumbnails</span>
                            </span>
                            <span className="d-inline-flex justify-content-center align-items-center cursor-pointer menu-close" onClick={handleCloseMenu}>
                                <svg data-v-78b93dcc="" version="1.1" viewBox="0 0 24 24" className="svg-icon svg-icon svg-fill" focusable="false"><path pid="0" d="M14.251 12.003l3.747-3.746-2.248-2.248-3.747 3.746-3.746-3.746-2.248 2.248 3.746 3.746-3.746 3.747 2.248 2.248 3.746-3.747 3.747 3.747 2.248-2.248z"></path></svg>
                            </span>
                        </div>
                        <div className="wrap-sidebar-content">
                            <div className="sidebar-content">
                                {
                                    sidebarPages.map((item, index) => {
                                        return (
                                            <div 
                                                className="wrap-page-item" 
                                                key={`Sidebar-${index}`}
                                                ref={(el) => (pageScrollRef.current[item[0]] = el)}>
                                                <div className={`d-flex align-items-center justify-content-center top cursor-pointer ${currentPage == item[0] && item[1] ? 'active' : ''}`} onClick={() => handleChangePage(item[0], true)}>
                                                    {
                                                        <>
                                                            <div className={`item ${(currentPage == 1 || currentPage == totalPages) && currentPage == item[0] ? 'active' : ''}`}>
                                                                <img src={imageMapping[item[0]]} alt={`Page ${item[0]}`} />
                                                            </div>
                                                            {
                                                                item[1] && (
                                                                    <>
                                                                        <div className="book-spine"></div>
                                                                        <div className="item">
                                                                            <img src={imageMapping[item[1]]} alt={`Page ${item[1]}`} />
                                                                        </div>
                                                                    </>
                                                                )
                                                            }
                                                        </>
                                                    }
                                                </div>
                                                <div className="d-flex align-items-center justify-content-center bottom">
                                                    {
                                                        <>
                                                            <div className="text-center page-number">{ item[0] }</div>
                                                            { item[1] && (<div className="text-center page-number">{ item[1] }</div>) }
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="main-content">
                        <div className="d-flex align-items-center header-block">
                            <h1 className="book-title">Sử ký VIN30</h1>
                            <div className="page-block">
                                <span className="page-label">pages:</span>
                                <input type="text" value={currentPage || 1} className="text-center page-input" onChange={e => handleChangePage(e?.target?.value, false)} onKeyDown={handleKeyDown} />
                                <span className="seperate">/</span>
                                <span>{ totalPages }</span>
                            </div>
                        </div>
                        <div className="book" ref={wrapBookRef} onWheel={onWheel}>
                            <div className="wrap-book">
                                <HTMLFlipBook 
                                    showCover={true}
                                    flippingTime={500}
                                    width={550}
                                    height={733}
                                    // size="fixed"
                                    size="stretch"
                                    minWidth={315}
                                    maxWidth={1000}
                                    minHeight={420}
                                    maxHeight={1350}
                                    // maxShadowOpacity={0.5}
                                    drawShadow={false}
                                    mobileScrollSupport={false}
                                    onFlip={handleFlip}
                                    ref={book}>
                                    {
                                        pages.map((item) => {
                                            return (
                                                <Page key={`page-item-${item}`} page={item} />
                                            )
                                        })
                                    }
                                </HTMLFlipBook>
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-center bottom-block">
                            <span className={`menu-item cursor-pointer ${isShowThumbnails ? 'active' : ''}`} onClick={handleShowThumbnails}>
                                <svg data-v-71c99c82="" version="1.1" viewBox="0 0 24 24" className="svg-icon svg-fill" focusable="false"><path pid="0" d="M9 3c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1V4c0-.6.4-1 1-1h5zm11 0c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1h-5c-.6 0-1-.4-1-1V4c0-.6.4-1 1-1h5zM9 14c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1v-5c0-.6.4-1 1-1h5zm11 0c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1h-5c-.6 0-1-.4-1-1v-5c0-.6.4-1 1-1h5z"></path></svg>
                            </span>
                            <span className="btn-download cursor-pointer" onClick={downloadBook}>
                                <svg data-v-71c99c82="" version="1.1" viewBox="0 0 24 24" className="svg-icon svg-fill" focusable="false"><path pid="0" d="M17.511 10.276h-2.516V4.201c.087-.456-.1-.921-.48-1.191H9.482c-.38.27-.567.735-.48 1.19v6.076H6.247L12 16.352l5.512-6.076zM18.597 17v2H5.402v-2H3.003v2.8c-.049.603.479 1.132 1.2 1.2h15.593c.724-.063 1.256-.595 1.2-1.2V17h-2.4z"></path></svg>
                            </span>
                            {/* <span className={`btn-zoom cursor-pointer ${isZoomIn ? 'active' : ''}`} onClick={handleZoom}>
                                {
                                    isZoomIn
                                    ? (
                                        <svg data-v-71c99c82="" version="1.1" viewBox="0 0 24 24" className="svg-icon svg-fill" focusable="false"><path pid="0" d="M15.49 17.611a8.144 8.144 0 01-4.35 1.39c-4.452-.102-8.038-3.625-8.14-8 .036-4.35 3.575-7.89 8-8 4.425.112 7.965 3.65 8 8a7.813 7.813 0 01-1.38 4.498l4.451 4.45-2.121 2.122-4.46-4.46zm-4.385-.61c3.3-.09 5.919-2.757 5.895-6-.026-3.263-2.681-5.916-6-6-3.319.083-5.973 2.737-6 6 .077 3.281 2.766 5.923 6.105 6zM7 12v-2h8v2H7z"></path></svg>
                                    )
                                    : (
                                        <svg data-v-71c99c82="" version="1.1" viewBox="0 0 24 24" className="svg-icon svg-fill" focusable="false"><path pid="0" d="M15.49 17.61A8.144 8.144 0 0111.14 19c-4.452-.102-8.038-3.625-8.14-8 .036-4.35 3.575-7.89 8-8 4.425.112 7.965 3.65 8 8a7.813 7.813 0 01-1.38 4.499l4.451 4.45-2.121 2.122-4.46-4.46zM11.104 17c3.3-.09 5.919-2.757 5.895-6-.026-3.263-2.681-5.916-6-6-3.319.083-5.973 2.737-6 6 .077 3.281 2.766 5.923 6.105 6zM12 7v3h3v2h-3v3h-2v-3H7v-2h3V7h2z"></path></svg>
                                    )
                                }
                            </span> */}
                            <span className={`btn-full-screen cursor-pointer ${isFullScreen ? 'active' : ''}`} onClick={handleScreen}>
                                {
                                    isFullScreen ? (
                                        <svg data-v-71c99c82="" version="1.1" viewBox="0 0 24 24" className="svg-icon svg-fill" focusable="false"><path pid="0" d="M20.664 19.114l-2.806-2.854L19.845 14H14v5.947l2.104-2.141 2.806 2.854a1.155 1.155 0 001.637 0 .96.96 0 00.117-1.546zM6.197 7.864l-2.141 2.14h5.947V4.059L7.862 6.2 5.007 3.345a1.19 1.19 0 00-1.665 0 1.19 1.19 0 000 1.665l2.855 2.854zm-.06 8.308L3.242 19.07a1.207 1.207 0 001.69 1.69l2.897-2.897L10 20.034V14H3.965l2.173 2.172zM17.743 7.86l2.924-2.854a1.204 1.204 0 000-1.665 1.156 1.156 0 00-1.637 0l-2.807 2.973L14 4.053V10h5.847l-2.105-2.14z"></path></svg>
                                    )
                                    : (
                                        <svg data-v-71c99c82="" version="1.1" viewBox="0 0 24 24" className="svg-icon svg-fill" focusable="false"><path pid="0" d="M6.733 5.1l2.1-2.1H3v5.833l2.1-2.1 2.8 2.8A1.167 1.167 0 109.533 7.9l-2.8-2.8zM18.9 17.328l-2.8-2.869a1.18 1.18 0 00-1.633-.23 1.135 1.135 0 000 1.837l2.916 2.754L15.167 21H21v-5.738l-2.1 2.066zm-3.014-7.664l2.854-2.806L21 8.845V3h-5.947l2.141 2.104L14.34 7.91a1.155 1.155 0 000 1.637.96.96 0 001.546.117zm-7.857 4.673L5.222 17.26 3 15.156v5.847h5.847l-2.105-2.105 2.924-2.807a1.17 1.17 0 000-1.637 1.052 1.052 0 00-1.637-.117z"></path></svg>
                                    )
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
