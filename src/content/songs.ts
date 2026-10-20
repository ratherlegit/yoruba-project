import type { Confidence } from "./types";

// Songs shown on the Songs page. Each song has an embedded YouTube video, a few lyric lines
// with an English meaning, and a link to the full published lyrics. Only a few lines are shown
// (at most MAX_LINES): the full text lives on the page it is linked to.
// The Yoruba lines follow the wording published there. Where the page leaves out tone marks and
// dots, the author added them as guesses, so they are needs-review too.
// The English meanings are written for this site and are needs-review until a native speaker
// checks them.

export type Genre = "Afrobeats" | "Pop" | "Children's" | "Juju" | "Fuji";
export const GENRES: readonly Genre[] = ["Afrobeats", "Pop", "Children's", "Juju", "Fuji"];
export const MAX_LINES = 12;

export type SongLine = { yoruba: string; english: string };

export type Song = {
  id: string;
  title: string;
  artist: string;
  genre: Genre;
  videoId: string; // YouTube id
  videoLabel: string; // what the video is, e.g. "Official video"
  lyricsUrl: string; // the published lyrics page the lines came from
  lyricsSite: string;
  about: string; // one or two sentences about the song
  lines: SongLine[];
  source: string;
  confidence: Confidence;
  note: string;
};

// Every entry: lyric lines read from the linked page and video ids checked on YouTube on 2026-10-20.
const READ = "read 2026-10-20";
const PUBLISHED = "The Yoruba follows the published wording, but tone marks and dots were added by the author as guesses where the page had none, so they are unchecked, and the page itself is user or site typed, not checked by a native speaker.";

export const SONGS: Song[] = [
  {
    id: "okunkun",
    title: "Okunkun",
    artist: "Solana & Killertunes",
    genre: "Pop",
    videoId: "e4aLN_GwpQU",
    videoLabel: "Visualizer on Solana's channel",
    lyricsUrl: "https://notjustok.com/lyrics/okunkun-lyrics-by-solana-killertunes/",
    lyricsSite: "notjustok",
    about: "Okunkun means darkness. The song is about getting ready and staying steady as night comes, and it mixes Yoruba with English.",
    lines: [
      { yoruba: "Ọjọ́ ti fe ṣ'òkùnkùn, ẹmi nìkan péré", english: "The day is about to turn dark, it is only me." },
      { yoruba: "Mi o duro, kia-kia mo múra mo mere", english: "I am not standing still; quickly I get ready and go." },
      { yoruba: "Ohun búburú ninu òkùnkùn lo ma n da wa", english: "It is bad things in the darkness that will trouble us." },
      { yoruba: "Ohun k'ohun ti mo sọ emi duro lori rẹ", english: "Whatever I say, I stand on it." },
      { yoruba: "Ẹlẹ́dàá mi gbé mi s'òkè, òkè gidi gan", english: "My Creator lifted me up, really high up." },
      { yoruba: "Were, were, kia-kia wa je ka ma lo", english: "Quickly, quickly, come, let us go." },
      { yoruba: "Ọjọ́ ti fé ṣ'òkùnkùn baba wa e gbá wa", english: "The day is about to turn dark, our father, hold on to us." },
      { yoruba: "A fe sere, sere, lo, lo, ma lo sọnù", english: "We want to hurry, hurry, go, go, do not get lost." },
      { yoruba: "A fe j'aye lo, a fẹ́ dúró s'ilé", english: "We want to enjoy life, we want to stay at home." },
      { yoruba: "O ti yé mi nísinyí, ilẹ̀ ti fé ṣu bayi", english: "I understand now, the ground is about to go dark like this." },
    ],
    source: `notjustok lyrics page, ${READ}; video checked on YouTube`,
    confidence: "needs-review",
    note: `${PUBLISHED} Doubts: "mere" in line 2 (to run or to go), whether gbá means protect or hold in line 7, what "da wa" means in line 3 (trouble, find, or befall), and "ilẹ̀ ti fé ṣu" in the last line (night falling).`,
  },
  {
    id: "sade",
    title: "Sade",
    artist: "Adekunle Gold",
    genre: "Pop",
    videoId: "1ShkDNA5ZCE",
    videoLabel: "Official video",
    lyricsUrl: "https://notjustok.com/lyrics/sade-lyrics-by-adekunle-gold/",
    lyricsSite: "notjustok",
    about: "Adekunle Gold's 2014 debut single, a plea to a woman to marry him. It mixes Yoruba, English and Pidgin.",
    lines: [
      { yoruba: "Ó ti pẹ́ tí mo ti ń bá ẹ sọ̀rọ̀", english: "It has been a long time that I have been talking to you." },
      { yoruba: "Ọjọ́ ń lọ", english: "The days are passing." },
      { yoruba: "Ọmọge dákun gbọ́ tèmi", english: "Girl, please listen to me." },
      { yoruba: "Baby mi, jọ̀wọ́", english: "My baby, please." },
      { yoruba: "Jẹ́ n gbé ẹ lọ ilé", english: "Let me take you home." },
      { yoruba: "Mummy mi retí ọmọ", english: "My mother is waiting for a child." },
      { yoruba: "Baba mi ń retí ọmọ", english: "My father is waiting for a child." },
      { yoruba: "Ọmọge wá fẹ́ mi", english: "Girl, come and love me." },
    ],
    source: `notjustok lyrics page, ${READ}; video checked on YouTube`,
    confidence: "needs-review",
    note: `${PUBLISHED} Doubt: the first line is typed oddly on the page ("ti'n mo ti'n"), so its wording and tones are a guess. "Waiting for a child" means waiting for grandchildren. "Je'n gbe e lole" could mean take you home or marry you, and "Ojo n'lo" could mean the days or the sun is going.`,
  },
  {
    id: "awe",
    title: "Awe",
    artist: "Asa",
    genre: "Pop",
    videoId: "VVgaH1ONtx8",
    videoLabel: "Audio on a playlist channel",
    lyricsUrl: "https://www.elyrics.net/read/a/asa-lyrics/awe-lyrics.html",
    lyricsSite: "eLyrics.net",
    about: "From Asa's 2009 album, written by Cobhams Asuquo and Bukola Elemide. A ballad about a young man drawn into city life; \"awe\" is a dialect word often glossed as friend.",
    lines: [
      { yoruba: "Ó lóyún fún ọ", english: "She carried a pregnancy for you." },
      { yoruba: "Oyún oṣù méjì", english: "A pregnancy of two months." },
      { yoruba: "Wahidi ọmọ Sekina", english: "Wahidi, child of Sekina." },
      { yoruba: "Ọmọ Mohammed", english: "Child of Mohammed." },
      { yoruba: "Anti tó lóyún fún ọ", english: "The aunty who carried the pregnancy for you." },
      { yoruba: "Ó tó bí ẹ lọ́mọ", english: "The one who gave birth to you as her child." },
      { yoruba: "Ó bí ọmọ oh oh", english: "She gave birth to a child." },
      { yoruba: "Mama tó bí mama rẹ", english: "The mother who gave birth to your mother." },
    ],
    source: `eLyrics.net lyrics page (user submitted), ${READ}; BellaNaija analysis for the story; video checked on YouTube`,
    confidence: "needs-review",
    note: `${PUBLISHED} The song uses a regional dialect (Ekiti and Ondo, per BellaNaija), so the meanings here are the weakest in the set and need a native check. Wahidi, Sekina and Mohammed are read as names, which is a guess. The uploader of the video is a playlist channel, not Asa's own.`,
  },
  {
    id: "organise",
    title: "Organise",
    artist: "Asake",
    genre: "Afrobeats",
    videoId: "_u4_iWCvZ5c",
    videoLabel: "Official video",
    lyricsUrl: "https://notjustok.com/lyrics/organise-lyrics-asake/",
    lyricsSite: "notjustok",
    about: "The third track on Asake's 2022 album Mr Money With The Vibe. The chorus plays on ogbon, wisdom.",
    lines: [
      { yoruba: "Ó lọ́gbọ́n jù, ó gbọ́n, ó gbọ́n, ó gbọ́n, Ìwọ ló gbọ́n jù", english: "You are too wise; you are wise, wise, wise; you are the wisest." },
      { yoruba: "Àgbọ́gbọ́n jù, ọgbọ́n, ama mọ ló gbọ́n má-, mo ti lọ́gbọ́n jù", english: "Wiser than everyone, wisdom; I am the one who is wiser." },
      { yoruba: "Èmi yàtọ̀ sáwọn, kan kà mí sọ́tọ̀, kà mí sọ́tọ̀", english: "I am different from them, just count me apart, count me apart." },
    ],
    source: `notjustok lyrics page, ${READ}; video checked on YouTube`,
    confidence: "needs-review",
    note: `${PUBLISHED} Doubt: the second line is cut off in the typed lyrics ("ma-"), so its meaning is a loose reading. The third line is a loose reading of "kan ka mi soto" (count me apart).`,
  },
  {
    id: "ojuelegba",
    title: "Ojuelegba",
    artist: "Wizkid",
    genre: "Afrobeats",
    videoId: "Q7QiLceJSLQ",
    videoLabel: "Video on the StarBoy TV channel",
    lyricsUrl: "https://notjustok.com/lyrics/ojuelegba-lyrics-by-wizkid/",
    lyricsSite: "notjustok",
    about: "Wizkid's 2014 song, named for the Lagos neighbourhood he grew up in. The Yoruba is in the verses; the chorus is English.",
    lines: [
      { yoruba: "Ní Òjuelégba", english: "At Ojuelegba." },
      { yoruba: "Ayé ò le tó yẹn oh", english: "Life is not that hard." },
      { yoruba: "Àdúrà ló lè ṣe o", english: "Only prayer can do it." },
      { yoruba: "Ojoojúmọ́ ló ń ṣ’àdúrà", english: "Every day there is praying." },
      { yoruba: "Ojoojúmọ́ owó ń wọlé wá", english: "Every day money is coming in for us." },
      { yoruba: "Mo ń jayé mi wọ́n ní wọ́n ṣòro jù", english: "I am living my life, they say it is too hard." },
      { yoruba: "Wọ́n ní, wọ́n ní, wọ́n ní, wọ́n ṣòro jù", english: "They say, they say, they say, it is too hard." },
    ],
    source: `notjustok lyrics page, ${READ}; video checked on YouTube`,
    confidence: "needs-review",
    note: `${PUBLISHED} Doubt: who is praying in line 4 (the focus word lo hides the subject), and what "wan soro ju" refers to in the last two lines (life, or the people). The video is on a fan or label channel, not an artist VEVO channel.`,
  },
  {
    id: "duduke",
    title: "Duduke",
    artist: "Simi",
    genre: "Afrobeats",
    videoId: "-L8hLkg21MQ",
    videoLabel: "Official video",
    lyricsUrl: "https://www.elyrics.net/read/s/simi-lyrics/duduke-lyrics.html",
    lyricsSite: "eLyrics.net",
    about: "Simi's 2020 song for her unborn child. She has said \"duduke\" is just a sound for a beating heart or a drum, not a name. Mostly Pidgin and English, with some Yoruba.",
    lines: [
      { yoruba: "Àyànfẹ́ mi àyànfẹ́", english: "My beloved, my beloved." },
      { yoruba: "Gbọ́ tèmi o", english: "Listen to me." },
      { yoruba: "Kó dúró lé ìfẹ́ mi o", english: "Rest on my love." },
    ],
    source: `eLyrics.net lyrics page (user submitted), ${READ}; Simi's comment on the title from a notjustok news report; video checked on YouTube`,
    confidence: "needs-review",
    note: `${PUBLISHED} Doubt: "ko duro le ife mi" could also mean "do not stop at my love". Only three lines are Yoruba, the rest is Pidgin and English.`,
  },
  {
    id: "motigbana",
    title: "Motigbana",
    artist: "Olamide",
    genre: "Afrobeats",
    videoId: "DR5dPcoIjOQ",
    videoLabel: "Official video",
    lyricsUrl: "https://lyricsraag.com/motigbana-olamide-translation/",
    lyricsSite: "lyricsraag",
    about: "Olamide's 2018 single, produced by Killertunes. A swaggering party song. The title is mo ti gbana, roughly \"I have caught fire\".",
    lines: [
      { yoruba: "Mo ti gbana ò mo ti elevate orí mi kò ní hibernate", english: "I have caught fire, I have levelled up; my head will not hibernate." },
      { yoruba: "Àwọn bad belle wọ́n tó suffocate we dey gbádùn we dey jollificate", english: "The jealous ones are about to suffocate; we are enjoying ourselves, we are celebrating." },
      { yoruba: "Ọlá tóbi ẹ máa pariwo yé", english: "My honour is great, so keep making noise." },
      { yoruba: "Owó tóbi ẹ máa pariwo yé", english: "My money is big, so keep making noise." },
      { yoruba: "Mọ́tò tóbi ẹ máa pariwo yé", english: "My car is big, so keep making noise." },
      { yoruba: "Owó pọ̀ gan nínú bullion van", english: "There is a lot of money in the bullion van." },
      { yoruba: "Baby ọya rotate bí tí ceiling fan", english: "Baby, come on, rotate like a ceiling fan." },
      { yoruba: "Abẹ̀bẹ́ ni ẹ o if you not a fan", english: "You are a hand fan if you are not a fan." },
    ],
    source: `lyricsraag lyrics page (Yoruba and an English translation), ${READ}; Vagalume lists the writers; video checked on YouTube`,
    confidence: "needs-review",
    note: `${PUBLISHED} The English here is written for this site and only checked against the lyricsraag translation, whose translator is not named. Doubt: tones on ola and owo (honour or money). "Abebe" is a hand fan, so the last line is a pun that this English only half carries.`,
  },
  {
    id: "labe-igi-oronbo",
    title: "Lábẹ́ Igi Òroǹbó",
    artist: "Traditional children's song",
    genre: "Children's",
    videoId: "potZ8OT0HV8",
    videoLabel: "Nursery rhyme video by Yoruba Stars",
    lyricsUrl: "https://www.mamalisa.com/?p=2900&t=es",
    lyricsSite: "Mama Lisa's World",
    about: "A folk song Yoruba-speaking children sing while playing together outdoors, often under the shade of a tree.",
    lines: [
      { yoruba: "Lábẹ́ igi òroǹbó", english: "Under the orange tree." },
      { yoruba: "Níbẹ̀ là gbe ṣeré wa", english: "That is where we play our games." },
      { yoruba: "Inú wa dùn, ara wa yá", english: "We are happy, we are lively." },
      { yoruba: "Òroǹbó, òroǹbó", english: "Orange, orange." },
    ],
    source: `Mama Lisa's World, contributed and translated by Belinda (Yinka) Adisa of the Yoruba Roots Language School, ${READ}; video checked on YouTube`,
    confidence: "needs-review",
    note: `Line 2 is written "Níbẹ̀ là gbe ṣeré wa" in the video, as reported by the author; the Mama Lisa page has "l'agbe nsere wa", so the wording is not settled. The page spells the tree word "orombo" with no marks, YouTube titles write òroǹbó, and other sources write òròmbó, so the spelling and tones are not settled. Mama Lisa's page is copyrighted, so only a few lines are shown. orombo can mean orange or lime.`,
  },
  {
    id: "iya-ni-wura",
    title: "Ìyá Ni Wúrà",
    artist: "Traditional children's song",
    genre: "Children's",
    videoId: "0fvwQZ3XLgs",
    videoLabel: "Lyric video by Yoruba for Kidz",
    lyricsUrl: "https://www.headteacher.ng/learning-cultural-values-through-folk-songs-and-stories-for-pre-school-level-3/",
    lyricsSite: "HeadTeacher.ng",
    about: "A folk song that teaches children to love and respect their mothers. The title means Mother is gold.",
    lines: [
      { yoruba: "Ìyá ni wúrà, ìyebíye ni", english: "Mother is gold, she is precious." },
      { yoruba: "Bí o l'ìyá, o l'àlàáfíà", english: "If you have a mother, you have peace." },
    ],
    source: `HeadTeacher.ng pre-school lesson plan, which prints the lyrics with an English line under each, ${READ}; video checked on YouTube`,
    confidence: "needs-review",
    note: `The page labels it "Traditional Yoruba folk song" but a Zikoko list credits Dele Ojo and his Star Brothers Band, so authorship is unsettled. The lyrics are unmarked on the page, so the tone marks and dots here, and in the title, are the author's guesses.`,
  },
];
