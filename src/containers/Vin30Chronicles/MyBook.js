import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Modal } from "react-bootstrap";
import PrismaZoom from 'react-prismazoom'
import { saveAs } from 'file-saver';
import { chunk, last } from 'lodash';
import { useRouteMatch } from "react-router-dom";
import HTMLFlipBook from '@cuongnv56/react-pageflip';
import LoadingModal from 'components/Common/LoadingModal';
import mapConfig from 'containers/map.config';
import IconClose from "assets/img/icon/icon_x.svg";
import IconPrevious from 'assets/img/icon/arrow-previous.svg'
import IconNext from 'assets/img/icon/arrow-next.svg'

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
},
  PER_LOAD = 30,
  TOTAL_PAGES = 260,
  LEFT_PAGE_TO_LOAD = 10,
  ZOOM = {
    MIN: 1,
    MAX: 5,
    STEP: 0.1,
  };

const Page = forwardRef((props, ref) => {
  const { page, isShowThumbnails, isMobile, prev, next } = props,
    isPrev = (isMobile && page > 1) ? true : page % 2 === 0,
    isNext = (isMobile && page < TOTAL_PAGES) ? true : page % 2 === 1,
    pageCover = [1, TOTAL_PAGES].includes(page) ? 'page-cover' : '';

  return (
    <div className={`page ${isShowThumbnails ? 'show-thumbnail' : ''} page-${page} ${pageCover}`} ref={ref}>
      <div className="page-content">
        {
          isMobile ? (
            <div className="page-image">
              <img src={IMAGE_MAPPING[page]} alt={`Page ${page}`} />
            </div>
          )
          : (
            <div className="page-image">
              {isPrev && prev()}
              <img src={IMAGE_MAPPING[page]} alt={`Page ${page}`} />
              {isNext && next()}
            </div>
          )
        }
      </div>
    </div>
  );
});

const ThumbnailModal = ({ isShow, page, thumbnailPages, handleScrollSidebar, handleChangePage, onHide }) => {
  return (
    <Modal show={isShow} onHide={onHide} className="thumbnail-modal" dialogClassName="thumbnail-modal">
      <Modal.Header className="d-flex justify-content-center">
        <div className="modal-title">Thumbnails</div>
        <span className='btn-close' onClick={onHide}><img src={IconClose} alt='Close' /></span>
      </Modal.Header>
      <Modal.Body className='text-center'>
        <div className='content' onScroll={handleScrollSidebar}>
          {
            (thumbnailPages || []).map(item => {
              return (
                <div key={`thumbnail-${item}`} className='item'>
                  <span className={`thumbnail ${page === item ? 'active' : ''}`} onClick={() => handleChangePage(item)}><img src={IMAGE_MAPPING[item]} alt={`Thumbnail ${item}`} /></span>
                  <span className='page'>{item}</span>
                </div>
              )
            })
          }
        </div>
      </Modal.Body>
    </Modal>
  );
}

const ButtonBlock = ({ isShowThumbnails, isFullScreen, isMobile, isZoomIn, zoomLevel, page, handleZoom, handleChangeZoomLevel, handleShowThumbnails, downloadBook, handleScreen }) => {
  return (
    <div className={`d-flex align-items-center bottom-block ${isMobile ? 'justify-content-start' : 'justify-content-center'}`}>
      <div className={`zoom-tooltip ${isZoomIn ? 'show' : ''} ${isMobile ? 'zoom-mobile' : ''}`}>
        <input
          type="range"
          min={ZOOM.MIN}
          max={ZOOM.MAX}
          value={zoomLevel}
          step={ZOOM.STEP}
          onChange={handleChangeZoomLevel}
        />
        {/* <div className="slider-ticks">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div> */}
      </div>
      <span
        className={`menu-item cursor-pointer ${
          isShowThumbnails ? 'active' : ''
        }`}
        style={{ marginLeft: isMobile ? 10 : 0 }}
        onClick={handleShowThumbnails}
      >
        <svg
          data-v-71c99c82=""
          version="1.1"
          viewBox="0 0 24 24"
          className="svg-icon svg-fill"
          focusable="false"
        >
          <path
            pid="0"
            d="M9 3c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1V4c0-.6.4-1 1-1h5zm11 0c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1h-5c-.6 0-1-.4-1-1V4c0-.6.4-1 1-1h5zM9 14c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1v-5c0-.6.4-1 1-1h5zm11 0c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1h-5c-.6 0-1-.4-1-1v-5c0-.6.4-1 1-1h5z"
          ></path>
        </svg>
      </span>
      {
        isMobile && (
          <span style={{ marginLeft: 5, fontSize: 12 }}>{`${page} / ${TOTAL_PAGES}`}</span>
        )
      }
      {/* <span
        className="btn-download cursor-pointer"
        onClick={downloadBook}
      >
        <svg
          data-v-71c99c82=""
          version="1.1"
          viewBox="0 0 24 24"
          className="svg-icon svg-fill"
          focusable="false"
        >
          <path
            pid="0"
            d="M17.511 10.276h-2.516V4.201c.087-.456-.1-.921-.48-1.191H9.482c-.38.27-.567.735-.48 1.19v6.076H6.247L12 16.352l5.512-6.076zM18.597 17v2H5.402v-2H3.003v2.8c-.049.603.479 1.132 1.2 1.2h15.593c.724-.063 1.256-.595 1.2-1.2V17h-2.4z"
          ></path>
        </svg>
      </span> */}
      {
        !isMobile && (
          <span className={`btn-zoom cursor-pointer ${isZoomIn ? 'active' : ''}`} onClick={handleZoom}>
            {
              isZoomIn ? (
                <svg data-v-71c99c82="" version="1.1" viewBox="0 0 24 24" className="svg-icon svg-fill" focusable="false">
                  <path pid="0" d="M15.49 17.611a8.144 8.144 0 01-4.35 1.39c-4.452-.102-8.038-3.625-8.14-8 .036-4.35 3.575-7.89 8-8 4.425.112 7.965 3.65 8 8a7.813 7.813 0 01-1.38 4.498l4.451 4.45-2.121 2.122-4.46-4.46zm-4.385-.61c3.3-.09 5.919-2.757 5.895-6-.026-3.263-2.681-5.916-6-6-3.319.083-5.973 2.737-6 6 .077 3.281 2.766 5.923 6.105 6zM7 12v-2h8v2H7z"></path>
                </svg>
              )
              : (
                <svg data-v-71c99c82="" version="1.1" viewBox="0 0 24 24" className="svg-icon svg-fill" focusable="false">
                  <path pid="0" d="M15.49 17.61A8.144 8.144 0 0111.14 19c-4.452-.102-8.038-3.625-8.14-8 .036-4.35 3.575-7.89 8-8 4.425.112 7.965 3.65 8 8a7.813 7.813 0 01-1.38 4.499l4.451 4.45-2.121 2.122-4.46-4.46zM11.104 17c3.3-.09 5.919-2.757 5.895-6-.026-3.263-2.681-5.916-6-6-3.319.083-5.973 2.737-6 6 .077 3.281 2.766 5.923 6.105 6zM12 7v3h3v2h-3v3h-2v-3H7v-2h3V7h2z"></path>
                </svg>
              )
            }
          </span>
        )
      }
      {
        !isMobile && (
          <span
            className={`btn-full-screen cursor-pointer ${
              isFullScreen ? 'active' : ''
            }`}
            onClick={handleScreen}
          >
            {isFullScreen ? (
              <svg
                data-v-71c99c82=""
                version="1.1"
                viewBox="0 0 24 24"
                className="svg-icon svg-fill"
                focusable="false"
              >
                <path
                  pid="0"
                  d="M20.664 19.114l-2.806-2.854L19.845 14H14v5.947l2.104-2.141 2.806 2.854a1.155 1.155 0 001.637 0 .96.96 0 00.117-1.546zM6.197 7.864l-2.141 2.14h5.947V4.059L7.862 6.2 5.007 3.345a1.19 1.19 0 00-1.665 0 1.19 1.19 0 000 1.665l2.855 2.854zm-.06 8.308L3.242 19.07a1.207 1.207 0 001.69 1.69l2.897-2.897L10 20.034V14H3.965l2.173 2.172zM17.743 7.86l2.924-2.854a1.204 1.204 0 000-1.665 1.156 1.156 0 00-1.637 0l-2.807 2.973L14 4.053V10h5.847l-2.105-2.14z"
                ></path>
              </svg>
            ) : (
              <svg
                data-v-71c99c82=""
                version="1.1"
                viewBox="0 0 24 24"
                className="svg-icon svg-fill"
                focusable="false"
              >
                <path
                  pid="0"
                  d="M6.733 5.1l2.1-2.1H3v5.833l2.1-2.1 2.8 2.8A1.167 1.167 0 109.533 7.9l-2.8-2.8zM18.9 17.328l-2.8-2.869a1.18 1.18 0 00-1.633-.23 1.135 1.135 0 000 1.837l2.916 2.754L15.167 21H21v-5.738l-2.1 2.066zm-3.014-7.664l2.854-2.806L21 8.845V3h-5.947l2.141 2.104L14.34 7.91a1.155 1.155 0 000 1.637.96.96 0 001.546.117zm-7.857 4.673L5.222 17.26 3 15.156v5.847h5.847l-2.105-2.105 2.924-2.807a1.17 1.17 0 000-1.637 1.052 1.052 0 00-1.637-.117z"
                ></path>
              </svg>
            )}
          </span>
        )
      }
    </div>
  );
}

export default function MyBook(props) {
  const bookRef = useRef();
  const pageRef = useRef();
  const wrapBookRef = useRef();
  const pageScrollRef = useRef([]);
  const zoomLevelRef = useRef()
  const touchStart = useRef(null);
  const touchEnd = useRef(null);
  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50;
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [isZoomIn, setIsZoomIn] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isShowThumbnails, setIsShowThumbnails] = useState(false);
  const [isShowThumbnailModal, setIsShowThumbnailModal] = useState(false);
  const isMobile = (useRouteMatch({ path: mapConfig.Vin30ChroniclesMobile }) || {})?.isExact;
  let isWheeling, flipTimeOut;

  useEffect(() => {
    const timeOut = setTimeout(() => setIsLoading(false), 1000);
    const onFullscreenChange = () => setIsFullScreen(Boolean(document.fullscreenElement));

    pageRef?.current?.scrollIntoView({ behavior: 'instant' }, 0);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    wrapBookRef?.current?.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      clearTimeout(timeOut);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      wrapBookRef?.current?.removeEventListener('wheel', onWheel, { passive: false });
    };
  }, []);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (!isFullScreen) {
        pageRef?.current?.scrollIntoView({ behavior: 'smooth' }, 0);
      }
    }, 100);

    return () => clearTimeout(timeOut);
  }, [isFullScreen]);

  useEffect(() => {
    let length = pages?.length,
      countLoad = PER_LOAD,
      existedPage = TOTAL_PAGES - length;

    if (page >= length - LEFT_PAGE_TO_LOAD) {
      // LEFT_PAGE_TO_LOAD page cuối của mỗi lượt load mới bắt đầu load thêm
      if (page > length + PER_LOAD && length >= 0) {
        countLoad = page - length;
      }

      if (existedPage < PER_LOAD) {
        countLoad = existedPage;
      }

      const _pages = [
        ...pages,
        ...generatePages(countLoad, last(pages) || 0),
      ];
      setPages(_pages);
    }
  }, [page]);

  useEffect(() => {
    setZoomLevel(1);
    zoomLevelRef.current?.reset();
  }, [isZoomIn]);

  const generatePages = (pageToLoad = PER_LOAD, startNumber = 0) => {
    return new Array(pageToLoad).fill().map((value, index) => startNumber + index + 1);
  }

  const handleCloseMenu = () => setIsShowThumbnails(false);

  const handleShowThumbnails = () => {
    if (isMobile) {
      setIsShowThumbnailModal(true);
    } else {
      setIsShowThumbnails(!isShowThumbnails);
    }
  }

  const handleScreen = () => {
    setIsFullScreen(!isFullScreen);

    if (!isFullScreen) {
      if (pageRef?.current?.requestFullscreen) pageRef?.current.requestFullscreen();
      if (pageRef?.current?.webkitRequestFullscreen) pageRef?.current?.webkitRequestFullscreen(); /* Safari */
      if (pageRef?.current?.msRequestFullscreen) pageRef?.current?.msRequestFullscreen(); /* IE11 */
    } else {
      if (document?.exitFullscreen) document?.exitFullscreen();
      if (document?.webkitExitFullscreen) document?.webkitExitFullscreen(); /* Safari */
      if (document?.msExitFullscreen) document?.msExitFullscreen(); /* IE11 */
    }
  };

  const handlePrint = (event) => {
    // if('print' in window){
    //     window.print();
    //   } else {
    //     alert("Printing is not supported on this device");
    //   }

    var iframe = document.createElement('iframe');
    // iframe.id = 'pdfIframe'
    iframe.className = 'pdfIframe';
    document.body.appendChild(iframe);
    iframe.style.display = 'none';
    iframe.onload = function () {
      // need clearTimeout to avoid memory leak
      setTimeout(function () {
        iframe.focus();
        iframe.contentWindow.print();
        URL.revokeObjectURL('https://myvinpearl.s3.ap-southeast-1.amazonaws.com/shared/SK.pdf');
        // document.body.removeChild(iframe)
      }, 1);
    };
    iframe.src = 'https://myvinpearl.s3.ap-southeast-1.amazonaws.com/shared/SK.pdf';
  };

  const handleZoom = () => {
    setIsZoomIn(!isZoomIn);
  }

  const handleChangeZoomLevel = e => {
    const _zoomLevel = Number(e?.target?.value);
    setZoomLevel(_zoomLevel)
    if (_zoomLevel > zoomLevel) {
      zoomLevelRef.current?.zoomIn(_zoomLevel - zoomLevel);
    } else {
      zoomLevelRef.current?.zoomOut(zoomLevel - _zoomLevel);
    }
  }

  const downloadBook = () => saveAs('https://myvinpearl.s3.ap-southeast-1.amazonaws.com/shared/SK.pdf');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (!isMobile) {
        pageScrollRef?.current?.[page]?.scrollIntoView(
          {
            behavior: 'smooth',
            block: 'nearest',
          },
          800
        );
      }

      const lastPage = last(pages);
      if (lastPage == page) {
        const _pages = [
          ...pages,
          ...generatePages(PER_LOAD, lastPage || 0),
        ];
        setPages(_pages);
      }

      clearTimeout(flipTimeOut);
      flipTimeOut = setTimeout(() => {
        bookRef?.current?.pageFlip()?.turnToPage(page == 1 ? 0 : page);
      }, 400);
      setZoomLevel(1);
      zoomLevelRef.current?.reset();
    }
  };

  const handleFlip = (e) => {
    const p = e?.data + 1;

    setPage(Number(p));
    pageScrollRef?.current?.[p]?.scrollIntoView(
      {
        behavior: 'smooth',
        block: 'nearest',
      },
      800
    );
  };

  const handleChangePage = (p) => {
    const pageNumber = isMobile ? Number(p) - 1 : Number(p);
    setPage(pageNumber);

    if (isMobile) {
      bookRef?.current?.pageFlip()?.turnToPage(pageNumber);
      setIsShowThumbnailModal(false);
    } else {
      clearTimeout(flipTimeOut);
      flipTimeOut = setTimeout(() => bookRef?.current?.pageFlip()?.turnToPage(pageNumber == 1 ? 0 : pageNumber == TOTAL_PAGES ? TOTAL_PAGES - 1 : pageNumber), 200);
    }
  }

  const handleChangePageByFilter = (p) => {
    let pageNumber = Number(p);

    if (pageNumber > TOTAL_PAGES) {
      pageNumber = TOTAL_PAGES;
    }

    setPage(pageNumber);
  }

  const onWheel = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    window.clearTimeout(isWheeling);
    isWheeling = setTimeout(() => {
      const delta = Math.sign(e?.deltaY);
      if (delta > 0) { // Cuộn chuột xuống đọc tiếp
        bookRef?.current?.pageFlip()?.flipNext('bottom');
      } else if (delta < 0) { // Cuộn chuột lên đọc lại
        bookRef?.current?.pageFlip()?.flipPrev('bottom');
      }
    }, 100);
  };

  const onHideThumbnailModal = () => {
    setIsShowThumbnailModal(false);
  }

  const handleScrollSidebar = (e) => {
    const isBottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

    if (isBottom) {
      let existedPage = TOTAL_PAGES - pages?.length, countLoad = PER_LOAD;

      if (existedPage < PER_LOAD) {
        countLoad = existedPage;
      }

      const _pages = [
        ...pages,
        ...generatePages(countLoad, last(pages) || 0),
      ];
      setPages(_pages);
    }
  }

  const handlePrevious = () => {
    bookRef?.current?.pageFlip()?.flipPrev('bottom');
  }

  const handleNext = () => {
    bookRef?.current?.pageFlip()?.flipNext('bottom');
  }

  const onTouchStart = (e) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  }

  const onTouchMove = (e) => {
    touchEnd.current = e.targetTouches[0].clientX;
  }

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe || isRightSwipe) {
      if (isLeftSwipe) {
        handleNext()
      }
      if (isRightSwipe) {
        handlePrevious()
      }
    }
  }

  const sidebarPages = (() => {
    const firstPage = 1,
      lastPage = pages?.length,
      center = chunk(pages.filter((item) => item !== firstPage && item !== lastPage), 2);

    return [[firstPage], ...center, [lastPage]];
  })();

  return (
    <>
      <LoadingModal show={isLoading} />
      <ThumbnailModal 
        isShow={isShowThumbnailModal} 
        page={page}
        thumbnailPages={pages}
        handleScrollSidebar={handleScrollSidebar}
        handleChangePage={handleChangePage}
        onHide={onHideThumbnailModal} 
      />
      <div
        className={`history-vingroup-page ${isMobile ? 'mobile' : ''}`}
        id="history-vingroup-page"
        ref={pageRef}
      >
        <div className="d-flex wrap-page">
          <div className={`sidebar-left ${isShowThumbnails ? 'visible' : ''}`}>
            <div className="d-flex align-items-center justify-content-between top-sidebar">
              <span className="d-inline-flex align-items-center thumbnails">
                <span className="d-inline-flex justify-content-center align-items-center menu-item">
                  <svg
                    data-v-78b93dcc=""
                    version="1.1"
                    viewBox="0 0 24 24"
                    className="svg-icon svg-icon svg-fill"
                    focusable="false"
                  >
                    <path
                      pid="0"
                      d="M9 3c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1V4c0-.6.4-1 1-1h5zm11 0c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1h-5c-.6 0-1-.4-1-1V4c0-.6.4-1 1-1h5zM9 14c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1v-5c0-.6.4-1 1-1h5zm11 0c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1h-5c-.6 0-1-.4-1-1v-5c0-.6.4-1 1-1h5z"
                    ></path>
                  </svg>
                </span>
                <span>Thumbnails</span>
              </span>
              <span
                className="d-inline-flex justify-content-center align-items-center cursor-pointer menu-close"
                onClick={handleCloseMenu}
              >
                <svg
                  data-v-78b93dcc=""
                  version="1.1"
                  viewBox="0 0 24 24"
                  className="svg-icon svg-icon svg-fill"
                  focusable="false"
                >
                  <path
                    pid="0"
                    d="M14.251 12.003l3.747-3.746-2.248-2.248-3.747 3.746-3.746-3.746-2.248 2.248 3.746 3.746-3.746 3.747 2.248 2.248 3.746-3.747 3.747 3.747 2.248-2.248z"
                  ></path>
                </svg>
              </span>
            </div>
            <div className="wrap-sidebar-content">
              <div className="sidebar-content" onScroll={handleScrollSidebar}>
                {sidebarPages.map((item, index) => {
                  return (
                    <div
                      className="wrap-page-item"
                      key={`Sidebar-${index}`}
                      ref={(el) => (pageScrollRef.current[item[0]] = el)}
                    >
                      <div
                        className={`d-flex align-items-center justify-content-center top cursor-pointer ${
                          page === item[0] && item[1] ? 'active' : ''
                        }`}
                        onClick={() => handleChangePage(item[0])}
                      >
                        <div
                          className={`item ${
                            (page === 1 || page === TOTAL_PAGES) &&
                            page === item[0]
                              ? 'active'
                              : ''
                          }`}
                        >
                          <img
                            src={IMAGE_MAPPING[item[0]]}
                            alt={`Page ${item[0]}`}
                          />
                        </div>
                        {item[1] && (
                          <>
                            <div className="book-spine" />
                            <div className="item">
                              <img
                                src={IMAGE_MAPPING[item[1]]}
                                alt={`Page ${item[1]}`}
                              />
                            </div>
                          </>
                        )}
                      </div>
                      <div className="d-flex align-items-center justify-content-center bottom">
                        <div className="text-center page-number">{item[0]}</div>
                        {item[1] && (
                          <div className="text-center page-number">
                            {item[1]}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="main-content">
            <div className="d-flex align-items-center header-block">
              <h1 className="book-title">Sử ký VIN30</h1>
              <div className="page-block">
                <span className="page-label">pages:</span>
                <input
                  type="text"
                  value={page}
                  className="text-center page-input"
                  onChange={(e) => handleChangePageByFilter(e?.target?.value)}
                  onKeyDown={handleKeyDown}
                />
                <span className="seperate">/</span>
                <span>{TOTAL_PAGES}</span>
              </div>
            </div>
            <div className="book" ref={wrapBookRef} onWheel={onWheel}>
              <div className={`wrap-book ${isMobile ? 'mobile' : ''}`}>
                {
                  isMobile && (
                    <>
                      {
                        page > 1 && (
                          <div className={`btn-action btn-previous cursor-pointer`} onTouchStart={handlePrevious}>
                            <img src={IconPrevious} alt="previous" />
                          </div>
                        )
                      }
                      {
                        page < TOTAL_PAGES && (
                          <div className={`btn-action btn-next cursor-pointer`} onTouchStart={handleNext}>
                            <img src={IconNext} alt="next" />
                          </div>
                        )
                      }
                    </>
                  )
                }
                {
                  isMobile
                  ? (
                    <PrismaZoom 
                      allowWheel={false} 
                      initialZoom={ZOOM.MIN}
                      minZoom={ZOOM.MIN}
                      maxZoom={ZOOM.MAX}
                      className='zoom-wrapper'
                      allowTouchEvents={false}
                      ref={zoomLevelRef}
                    >
                      <HTMLFlipBook
                        showCover={true}
                        flippingTime={600}
                        width={550}
                        height={733}
                        size="stretch"
                        minWidth={315}
                        maxWidth={1000}
                        minHeight={420}
                        maxHeight={1350}
                        maxShadowOpacity={0.5}
                        drawShadow={false}
                        useMouseEvents={false}
                        onFlip={handleFlip}
                        ref={bookRef}
                      >
                        {pages.map((item) => (
                          <Page 
                            key={`page-item-${item}`} 
                            page={item}
                            isShowThumbnails={isShowThumbnails}
                            isMobile={isMobile}
                          />
                        ))}
                      </HTMLFlipBook>
                    </PrismaZoom>
                  )
                  : (
                  <PrismaZoom 
                    allowWheel={false} 
                    initialZoom={ZOOM.MIN}
                    minZoom={ZOOM.MIN}
                    maxZoom={ZOOM.MAX}
                    className='zoom-wrapper'
                    allowTouchEvents={true}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    ref={zoomLevelRef}
                  >
                    <HTMLFlipBook
                      showCover={true}
                      flippingTime={600}
                      width={550}
                      height={733}
                      size="stretch"
                      minWidth={315}
                      maxWidth={1000}
                      minHeight={420}
                      maxHeight={1350}
                      maxShadowOpacity={0.5}
                      drawShadow={false}
                      mobileScrollSupport={true}
                      onFlip={handleFlip}
                      useMouseEvents={false}
                      ref={bookRef}
                    >
                      {pages.map((item) => (
                        <Page 
                          key={`page-item-${item}`} 
                          page={item}
                          isShowThumbnails={isShowThumbnails}
                          isMobile={isMobile}
                          prev={() => (
                            <div className={`btn-previous cursor-pointer`} onClick={handlePrevious}>
                              <img src={IconPrevious} alt="previous" />
                            </div>
                          )}
                          next={() => (
                            <div className={`btn-next cursor-pointer`} onClick={handleNext}>
                              <img src={IconNext} alt="next" />
                            </div>
                          )}
                        />
                      ))}
                    </HTMLFlipBook>
                  </PrismaZoom>
                  )
                }
              </div>
            </div>
            <ButtonBlock 
              isShowThumbnails={isShowThumbnails}
              isFullScreen={isFullScreen}
              isMobile={isMobile}
              isZoomIn={isZoomIn}
              zoomLevel={zoomLevel}
              page={page}
              handleZoom={handleZoom}
              handleChangeZoomLevel={handleChangeZoomLevel}
              handleShowThumbnails={handleShowThumbnails}
              downloadBook={downloadBook}
              handleScreen={handleScreen}
            />
          </div>
        </div>
      </div>
    </>
  );
}