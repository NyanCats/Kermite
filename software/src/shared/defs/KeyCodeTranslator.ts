import { LogicalKey } from './LogicalKey';

// HIDキーコード定義, キーボードの言語やレイアウトによらない共通部分
const enum HidKey {
  KU_RESERVED = 0,
  KU_A = 4,
  KU_B,
  KU_C,
  KU_D,
  KU_E,
  KU_F,
  KU_G,
  KU_H,
  KU_I,
  KU_J,
  KU_K,
  KU_L,
  KU_M,
  KU_N,
  KU_O,
  KU_P,
  KU_Q,
  KU_R,
  KU_S,
  KU_T,
  KU_U,
  KU_V,
  KU_W,
  KU_X,
  KU_Y,
  KU_Z,

  KU_Num1 = 30,
  KU_Num2,
  KU_Num3,
  KU_Num4,
  KU_Num5,
  KU_Num6,
  KU_Num7,
  KU_Num8,
  KU_Num9,
  KU_Num0,

  KU_Enter = 40,
  KU_Escape,
  KU_BackSpace,
  KU_Tab,
  KU_Space,

  KU_CapsLock = 57,

  KU_F1 = 58,
  KU_F2,
  KU_F3,
  KU_F4,
  KU_F5,
  KU_F6,
  KU_F7,
  KU_F8,
  KU_F9,
  KU_F10,
  KU_F11,
  KU_F12,

  KU_PrintScreen = 70,
  KU_ScrollLock = 71,
  KU_Pause = 72,
  KU_Insert = 73,
  KU_Home = 74,
  KU_PageUp = 75,
  KU_Delete = 76,
  KU_End = 77,
  KU_PageDown = 78,
  KU_RightArrow = 79,
  KU_LeftArrow,
  KU_DownArrow,
  KU_UpArrow,
  KU_NumLock = 83,

  KU_KeyPad_Slash = 84,
  KU_KeyPad_Asterisk,
  KU_KeyPad_Minus,
  KU_KeyPad_Plus,
  KU_KeyPad_Enter,
  KU_KeyPad_1,
  KU_KeyPad_2,
  KU_KeyPad_3,
  KU_KeyPad_4,
  KU_KeyPad_5,
  KU_KeyPad_6,
  KU_KeyPad_7,
  KU_KeyPad_8,
  KU_KeyPad_9,
  KU_KeyPad_0,
  KU_KeyPad_Dot,
  KU_KeyPad_Equal = 103,

  KU_F13 = 104,
  KU_F14,
  KU_F15,
  KU_F16,
  KU_F17,
  KU_F18,
  KU_F19,
  KU_F20,
  KU_F21,
  KU_F22,
  KU_F23,
  KU_F24,

  KU_Menu = 118,

  KU_KeyPad_00 = 176,
  KU_KeyPad_BackSpace = 187,

  KU_LCtrl = 224,
  KU_LShift,
  KU_LAlt,
  KU_LGui,
  KU_RCtrl,
  KU_RShift,
  KU_RAlt,
  KU_RGui,

  KU_Ctrl = 224,
  KU_Shift,
  KU_Alt,
  KU_Gui,
}

// 英語キーボード向けの定義
const enum HidKeyUS {
  KU_US_Num1_Exclamation = 30,
  KU_US_Num2_Atmark,
  KU_US_Num3_Sharp,
  KU_US_Num4_Dollars,
  KU_US_Num5_Percent,
  KU_US_Num6_Circumflex,
  KU_US_Num7_Ampersand,
  KU_US_Num8_Asterisk,
  KU_US_Num9_LeftParenthesis,
  KU_US_Num0_RightParenthesis,

  KU_US_Minus_Undersocre = 45,
  KU_US_Equal_Plus = 46,
  KU_US_LeftSquareBracket_LeftCurlyBrace = 47,
  KU_US_RightSquareBracket_RightCurlyBrace = 48,
  KU_US_Backslash_Verticalbar = 49,
  KU_US_Sharp_Tilde = 50,
  KU_US_Semicolon_Colon = 51,
  KU_US_SingleQuote_DoubleQuote = 52,
  KU_US_BackQuote_Tilde = 53,
  KU_US_Comma_LessThan = 54,
  KU_US_Dot_GreaterThan = 55,
  KU_US_Slash_Question = 56,
}

// 日本語キーボード向けの定義
const enum HidKeyJA {
  KU_JA_Num1_Exclamation = 30,
  KU_JA_Num2_DoubleQuote,
  KU_JA_Num3_Sharp,
  KU_JA_Num4_Dollars,
  KU_JA_Num5_Percent,
  KU_JA_Num6_Ampersand,
  KU_JA_Num7_SingleQuote,
  KU_JA_Num8_LeftParenthesis,
  KU_JA_Num9_RightParenethesis,
  KU_JA_Num0,

  KU_JA_Minus_Equal = 45,
  KU_JA_Circumflex_Tilde,
  KU_JA_Atmark_BackQuote,

  KU_JA_LeftSquareBracket_LeftCurlyBrace = 48,
  KU_JA_RightSquareBracket_RightCurlyBrace = 49,
  KU_JA_Semicolon_Plus = 51,
  KU_JA_Colon_Asterisk = 52,

  KU_HankakuZenkaku = 53,

  KU_JA_Comma_LessThan = 54,
  KU_JA_Dot_GreaterThan = 55,
  KU_JA_Slash_Question = 56,

  KU_JA_BackSlash_Underscore = 135,
  KU_KatakanaHiragana = 136,
  KU_JA_Yen_VertiacalBar = 137,
  KU_Henkan = 138,
  KU_Muhenkan = 139,
  KU_Lang1Kana = 144,
  KU_Lang2Eisu = 145,
}

const Shifted = 0x100;
const NoShift = 0x200;

type LogicalKeyItem = [number, string, number, number?];
// {
//   logicalKey: number; // logical key code
//   text: string;
//   hidKeyPrimary: number; // hid keycode with shift (us mapping)
//   hidKeySecondary: number; // hid keycode with shift (jis mapping)
// };

const logicalKeyItems: LogicalKeyItem[] = [
  [LogicalKey.LK_A, 'A', HidKey.KU_A],
  [LogicalKey.LK_B, 'B', HidKey.KU_B],
  [LogicalKey.LK_C, 'C', HidKey.KU_C],
  [LogicalKey.LK_D, 'D', HidKey.KU_D],
  [LogicalKey.LK_E, 'E', HidKey.KU_E],
  [LogicalKey.LK_F, 'F', HidKey.KU_F],
  [LogicalKey.LK_G, 'G', HidKey.KU_G],
  [LogicalKey.LK_H, 'H', HidKey.KU_H],
  [LogicalKey.LK_I, 'I', HidKey.KU_I],
  [LogicalKey.LK_J, 'J', HidKey.KU_J],
  [LogicalKey.LK_K, 'K', HidKey.KU_K],
  [LogicalKey.LK_L, 'L', HidKey.KU_L],
  [LogicalKey.LK_M, 'M', HidKey.KU_M],
  [LogicalKey.LK_N, 'N', HidKey.KU_N],
  [LogicalKey.LK_O, 'O', HidKey.KU_O],
  [LogicalKey.LK_P, 'P', HidKey.KU_P],
  [LogicalKey.LK_Q, 'Q', HidKey.KU_Q],
  [LogicalKey.LK_R, 'R', HidKey.KU_R],
  [LogicalKey.LK_S, 'S', HidKey.KU_S],
  [LogicalKey.LK_T, 'T', HidKey.KU_T],
  [LogicalKey.LK_U, 'U', HidKey.KU_U],
  [LogicalKey.LK_V, 'V', HidKey.KU_V],
  [LogicalKey.LK_W, 'W', HidKey.KU_W],
  [LogicalKey.LK_X, 'X', HidKey.KU_X],
  [LogicalKey.LK_Y, 'Y', HidKey.KU_Y],
  [LogicalKey.LK_Z, 'Z', HidKey.KU_Z],
  [LogicalKey.LK_Num_0, '0', HidKey.KU_Num0 | NoShift],
  [LogicalKey.LK_Num_1, '1', HidKey.KU_Num1 | NoShift],
  [LogicalKey.LK_Num_2, '2', HidKey.KU_Num2 | NoShift],
  [LogicalKey.LK_Num_3, '3', HidKey.KU_Num3 | NoShift],
  [LogicalKey.LK_Num_4, '4', HidKey.KU_Num4 | NoShift],
  [LogicalKey.LK_Num_5, '5', HidKey.KU_Num5 | NoShift],
  [LogicalKey.LK_Num_6, '6', HidKey.KU_Num6 | NoShift],
  [LogicalKey.LK_Num_7, '7', HidKey.KU_Num7 | NoShift],
  [LogicalKey.LK_Num_8, '8', HidKey.KU_Num8 | NoShift],
  [LogicalKey.LK_Num_9, '9', HidKey.KU_Num9 | NoShift],
  [LogicalKey.LK_Escape, 'Esc', HidKey.KU_Escape],
  [LogicalKey.LK_Space, 'Space', HidKey.KU_Space],
  [LogicalKey.LK_Enter, 'Enter', HidKey.KU_Enter],
  [LogicalKey.LK_Tab, 'Tab', HidKey.KU_Tab],
  [LogicalKey.LK_BackSpace, 'BS', HidKey.KU_BackSpace],
  [LogicalKey.LK_F1, 'F1', HidKey.KU_F1],
  [LogicalKey.LK_F2, 'F2', HidKey.KU_F2],
  [LogicalKey.LK_F3, 'F3', HidKey.KU_F3],
  [LogicalKey.LK_F4, 'F4', HidKey.KU_F4],
  [LogicalKey.LK_F5, 'F5', HidKey.KU_F5],
  [LogicalKey.LK_F6, 'F6', HidKey.KU_F6],
  [LogicalKey.LK_F7, 'F7', HidKey.KU_F7],
  [LogicalKey.LK_F8, 'F8', HidKey.KU_F8],
  [LogicalKey.LK_F9, 'F9', HidKey.KU_F9],
  [LogicalKey.LK_F10, 'F10', HidKey.KU_F10],
  [LogicalKey.LK_F11, 'F11', HidKey.KU_F11],
  [LogicalKey.LK_F12, 'F12', HidKey.KU_F12],
  [LogicalKey.LK_Shift, 'Shift', HidKey.KU_Shift],
  [LogicalKey.LK_Ctrl, 'Ctrl', HidKey.KU_Ctrl],
  [LogicalKey.LK_Alt, 'Alt', HidKey.KU_Alt],
  [LogicalKey.LK_Gui, 'GUI', HidKey.KU_Gui],
  [LogicalKey.LK_LShift, 'LShift', HidKey.KU_LShift],
  [LogicalKey.LK_LCtrl, 'LCtrl', HidKey.KU_LCtrl],
  [LogicalKey.LK_LAlt, 'LAlt', HidKey.KU_LAlt],
  [LogicalKey.LK_LGui, 'LGUI', HidKey.KU_LGui],
  [LogicalKey.LK_RShift, 'RShift', HidKey.KU_RShift],
  [LogicalKey.LK_RCtrl, 'RCtrl', HidKey.KU_RCtrl],
  [LogicalKey.LK_RAlt, 'RAlt', HidKey.KU_RAlt],
  [LogicalKey.LK_RGui, 'RGUI', HidKey.KU_RGui],
  [LogicalKey.LK_Home, 'Home', HidKey.KU_Home],
  [LogicalKey.LK_End, 'End', HidKey.KU_End],
  [LogicalKey.LK_Insert, 'Insert', HidKey.KU_Insert],
  [LogicalKey.LK_Delete, 'Delete', HidKey.KU_Delete],
  [LogicalKey.LK_PageUp, 'PageUp', HidKey.KU_PageUp],
  [LogicalKey.LK_PageDn, 'PageDn', HidKey.KU_PageDown],
  [LogicalKey.LK_LeftArrow, 'LeftArrow', HidKey.KU_LeftArrow],
  [LogicalKey.LK_RightArrow, 'RightArrow', HidKey.KU_RightArrow],
  [LogicalKey.LK_UpArrow, 'UpArrow', HidKey.KU_UpArrow],
  [LogicalKey.LK_DownArrow, 'DownArrow', HidKey.KU_DownArrow],
  [LogicalKey.LK_HankakuZenkaku, 'HankakuZenkaku', HidKeyJA.KU_HankakuZenkaku],
  [
    LogicalKey.LK_KatakanaHiragana,
    'KatakanaHiragana',
    HidKeyJA.KU_KatakanaHiragana,
  ],
  [LogicalKey.LK_Henkan, 'Henkan', HidKeyJA.KU_Henkan],
  [LogicalKey.LK_Muhenkan, 'Muhenkan', HidKeyJA.KU_Muhenkan],

  [
    LogicalKey.LK_Dot,
    '.',
    HidKeyUS.KU_US_Dot_GreaterThan | NoShift,
    HidKeyJA.KU_JA_Dot_GreaterThan | NoShift,
  ],
  [
    LogicalKey.LK_Comma,
    ',',
    HidKeyUS.KU_US_Comma_LessThan | NoShift,
    HidKeyJA.KU_JA_Comma_LessThan | NoShift,
  ],
  [
    LogicalKey.LK_Exclamation,
    '!',
    HidKeyUS.KU_US_Num1_Exclamation | Shifted,
    HidKeyJA.KU_JA_Num1_Exclamation | Shifted,
  ],
  [
    LogicalKey.LK_Question,
    '?',
    HidKeyUS.KU_US_Slash_Question | Shifted,
    HidKeyJA.KU_JA_Slash_Question | Shifted,
  ],
  [
    LogicalKey.LK_Colon,
    ':',
    HidKeyUS.KU_US_Semicolon_Colon | Shifted,
    HidKeyJA.KU_JA_Colon_Asterisk | NoShift,
  ],
  [
    LogicalKey.LK_Semicolon,
    ';',
    HidKeyUS.KU_US_Semicolon_Colon | NoShift,
    HidKeyJA.KU_JA_Semicolon_Plus | NoShift,
  ],
  [
    LogicalKey.LK_Underscore,
    '_',
    HidKeyUS.KU_US_Minus_Undersocre | Shifted,
    HidKeyJA.KU_JA_BackSlash_Underscore | Shifted,
  ],
  [
    LogicalKey.LK_Plus,
    '+',
    HidKeyUS.KU_US_Equal_Plus | Shifted,
    HidKeyJA.KU_JA_Semicolon_Plus | Shifted,
  ],
  [
    LogicalKey.LK_Minus,
    '-',
    HidKeyUS.KU_US_Minus_Undersocre | NoShift,
    HidKeyJA.KU_JA_Minus_Equal | NoShift,
  ],
  [
    LogicalKey.LK_Asterisk,
    '*',
    HidKeyUS.KU_US_Num8_Asterisk | Shifted,
    HidKeyJA.KU_JA_Colon_Asterisk | Shifted,
  ],
  [
    LogicalKey.LK_Slash,
    '/',
    HidKeyUS.KU_US_Slash_Question | NoShift,
    HidKeyJA.KU_JA_Slash_Question | NoShift,
  ],
  [
    LogicalKey.LK_Equal,
    '=',
    HidKeyUS.KU_US_Equal_Plus | NoShift,
    HidKeyJA.KU_JA_Minus_Equal | Shifted,
  ],
  [
    LogicalKey.LK_Ampersand,
    '&',
    HidKeyUS.KU_US_Num7_Ampersand | Shifted,
    HidKeyJA.KU_JA_Num6_Ampersand | Shifted,
  ],
  [
    LogicalKey.LK_VerticalBar,
    '|',
    HidKeyUS.KU_US_Backslash_Verticalbar | Shifted,
    HidKeyJA.KU_JA_Yen_VertiacalBar | Shifted,
  ],
  [
    LogicalKey.LK_Hat,
    '^',
    HidKeyUS.KU_US_Num6_Circumflex | Shifted,
    HidKeyJA.KU_JA_Circumflex_Tilde | NoShift,
  ],
  [
    LogicalKey.LK_Tilde,
    '~',
    HidKeyUS.KU_US_BackQuote_Tilde | Shifted,
    HidKeyJA.KU_JA_Circumflex_Tilde | Shifted,
  ],
  [
    LogicalKey.LK_AtMark,
    '@',
    HidKeyUS.KU_US_Num2_Atmark | Shifted,
    HidKeyJA.KU_JA_Atmark_BackQuote | NoShift,
  ],
  [
    LogicalKey.LK_Sharp,
    '#',
    HidKeyUS.KU_US_Num3_Sharp | Shifted,
    HidKeyJA.KU_JA_Num3_Sharp | Shifted,
  ],
  [
    LogicalKey.LK_Dollar,
    '$',
    HidKeyUS.KU_US_Num4_Dollars | Shifted,
    HidKeyJA.KU_JA_Num4_Dollars | Shifted,
  ],
  [
    LogicalKey.LK_Yen,
    '¥',
    HidKeyUS.KU_US_Backslash_Verticalbar | NoShift,
    HidKeyJA.KU_JA_Yen_VertiacalBar | NoShift,
  ],
  [
    LogicalKey.LK_Percent,
    '%',
    HidKeyUS.KU_US_Num5_Percent | Shifted,
    HidKeyJA.KU_JA_Num5_Percent | Shifted,
  ],
  [
    LogicalKey.LK_BackSlash,
    '\\',
    HidKeyUS.KU_US_Backslash_Verticalbar | NoShift,
    HidKeyJA.KU_JA_BackSlash_Underscore | NoShift,
  ],
  [
    LogicalKey.LK_SingleQuote,
    "'",
    HidKeyUS.KU_US_SingleQuote_DoubleQuote | NoShift,
    HidKeyJA.KU_JA_Num7_SingleQuote | Shifted,
  ],
  [
    LogicalKey.LK_DoubleQuote,
    '"',
    HidKeyUS.KU_US_SingleQuote_DoubleQuote | Shifted,
    HidKeyJA.KU_JA_Num2_DoubleQuote | Shifted,
  ],
  [
    LogicalKey.LK_BackQuote,
    '`',
    HidKeyUS.KU_US_BackQuote_Tilde | NoShift,
    HidKeyJA.KU_JA_Atmark_BackQuote | Shifted,
  ],
  [
    LogicalKey.LK_LeftParenthesis,
    '(',
    HidKeyUS.KU_US_Num9_LeftParenthesis | Shifted,
    HidKeyJA.KU_JA_Num8_LeftParenthesis | Shifted,
  ],
  [
    LogicalKey.LK_RightParenthesis,
    ')',
    HidKeyUS.KU_US_Num0_RightParenthesis | Shifted,
    HidKeyJA.KU_JA_Num9_RightParenethesis | Shifted,
  ],
  [
    LogicalKey.LK_LeftSquareBracket,
    '[',
    HidKeyUS.KU_US_LeftSquareBracket_LeftCurlyBrace | NoShift,
    HidKeyJA.KU_JA_LeftSquareBracket_LeftCurlyBrace | NoShift,
  ],
  [
    LogicalKey.LK_RightSquareBracket,
    ']',
    HidKeyUS.KU_US_RightSquareBracket_RightCurlyBrace | NoShift,
    HidKeyJA.KU_JA_RightSquareBracket_RightCurlyBrace | NoShift,
  ],
  [
    LogicalKey.LK_LeftCurlyBrace,
    '{',
    HidKeyUS.KU_US_LeftSquareBracket_LeftCurlyBrace | Shifted,
    HidKeyJA.KU_JA_LeftSquareBracket_LeftCurlyBrace | Shifted,
  ],
  [
    LogicalKey.LK_RightCurlyBrace,
    '}',
    HidKeyUS.KU_US_RightSquareBracket_RightCurlyBrace | Shifted,
    HidKeyJA.KU_JA_RightSquareBracket_RightCurlyBrace | Shifted,
  ],
  [
    LogicalKey.LK_LessThan,
    '<',
    HidKeyUS.KU_US_Comma_LessThan | Shifted,
    HidKeyJA.KU_JA_Comma_LessThan | Shifted,
  ],
  [
    LogicalKey.LK_GreaterThan,
    '>',
    HidKeyUS.KU_US_Dot_GreaterThan | Shifted,
    HidKeyJA.KU_JA_Dot_GreaterThan | Shifted,
  ],
  [LogicalKey.LK_Lang1Kana, 'Kana', HidKeyJA.KU_Lang1Kana],
  [LogicalKey.LK_Lang2Eisu, 'Eisu', HidKeyJA.KU_Lang2Eisu],
];

function getLogicalKeysItem(logicalKey: number): LogicalKeyItem | undefined {
  return logicalKeyItems.find((item) => {
    return item[0] === logicalKey;
  });
}

export function keyCodeTranslator_mapLogicalKeyToHidKeyCode(
  logicalKey: number,
  isSecondaryLayout: boolean,
): number {
  const item = getLogicalKeysItem(logicalKey);
  if (item) {
    const [, , hidKeyPrimary, hidKeySecondary] = item;
    if (isSecondaryLayout && hidKeySecondary !== undefined) {
      return hidKeySecondary;
    }
    return hidKeyPrimary;
  }
  return 0;
}

export function keyCodeTranslator_mapLogicalKeyToKeyText(
  logicalKey: number,
): string | undefined {
  const item = getLogicalKeysItem(logicalKey);
  return item?.[1] || undefined;
}
