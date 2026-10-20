import type { Confidence } from "./types";

// Songs shown on the Songs page. Each song has an embedded YouTube video, a few lyric lines
// with an English meaning, and a link to the full published lyrics. Only a few lines are shown
// (at most MAX_LINES): the full text lives on the page it is linked to.
// The Yoruba lines are copied as published there, which often leaves out tone marks and dots.
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
const PUBLISHED = "Yoruba lines are copied as published, which leaves out many tone marks and dots, and the page is user or site typed, not checked by a native speaker.";

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
      { yoruba: "Oti pe ti'n mo ti'n ba e soro", english: "It has been a long time that I have been talking to you." },
      { yoruba: "Ojo n'lo", english: "The days are passing." },
      { yoruba: "Omoge dakun gbo temi", english: "Girl, please listen to me." },
      { yoruba: "Baby mi jowo", english: "My baby, please." },
      { yoruba: "Je'n gbe e lole", english: "Let me take you home." },
      { yoruba: "Mummy mi reti omo", english: "My mother is waiting for a child." },
      { yoruba: "Baba mi n reti omo", english: "My father is waiting for a child." },
      { yoruba: "Omoge wa femi", english: "Girl, come and love me." },
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
      { yoruba: "O loyun fun o", english: "She carried a pregnancy for you." },
      { yoruba: "Oyun oshu meji", english: "A pregnancy of two months." },
      { yoruba: "Wahidi omo sekina", english: "Wahidi, child of Sekina." },
      { yoruba: "Omo mohammed", english: "Child of Mohammed." },
      { yoruba: "Anti to loyun fun o", english: "The aunty who carried the pregnancy for you." },
      { yoruba: "O to bi e l'omo", english: "The one who gave birth to you as her child." },
      { yoruba: "O bi 'mo oh oh", english: "She gave birth to a child." },
      { yoruba: "Mama to bi mama re", english: "The mother who gave birth to your mother." },
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
      { yoruba: "O logbon ju, o gbon, o gbon, o gbon, Iwo lo gbon ju", english: "You are too wise; you are wise, wise, wise; you are the wisest." },
      { yoruba: "Agbogbon ju, ogbon, ama molo gbon ma-, mo ti logbon ju", english: "Wiser than everyone, wisdom; I am the one who is wiser." },
      { yoruba: "Emi yato sawon, kan ka mi soto, ka mi soto", english: "I am different from them, just count me apart, count me apart." },
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
      { yoruba: "Ni ojuelegba", english: "At Ojuelegba." },
      { yoruba: "Aiye o le to yen oh", english: "Life is not that hard." },
      { yoruba: "Adura lo le se o", english: "Only prayer can do it." },
      { yoruba: "Ojojumo lo n s’adura", english: "Every day there is praying." },
      { yoruba: "Ojojumo owo n wole wa", english: "Every day money is coming in for us." },
      { yoruba: "Mon jaiye mi won ni wan soro ju", english: "I am living my life, they say it is too hard." },
      { yoruba: "Won ni, won ni, won ni, won soro ju", english: "They say, they say, they say, it is too hard." },
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
      { yoruba: "Ayanfe mi ayanfe", english: "My beloved, my beloved." },
      { yoruba: "Gbo temi o", english: "Listen to me." },
      { yoruba: "Ko duro le ife mi o", english: "Rest on my love." },
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
      { yoruba: "Motigbana O Moti Elevate Ori Mi Ko Ke Hibernate", english: "I have caught fire, I have levelled up; my head will not hibernate." },
      { yoruba: "Awon Bad Belle Won To Suffocate We Dey Gbadun We Dey Jollificate", english: "The jealous ones are about to suffocate; we are enjoying ourselves, we are celebrating." },
      { yoruba: "Ola Tobi E Ma Pariwo Ye", english: "My honour is great, so keep making noise." },
      { yoruba: "Owo Tobi E Ma Pariwo Ye", english: "My money is big, so keep making noise." },
      { yoruba: "Motor Tobi E Ma Pariwo Ye", english: "My car is big, so keep making noise." },
      { yoruba: "Owo Po Gan Ninu Bullion Van", english: "There is a lot of money in the bullion van." },
      { yoruba: "Baby Oya Rotate Bi Ti Ceiling Fan", english: "Baby, come on, rotate like a ceiling fan." },
      { yoruba: "Abebe Ni E O If You Not A Fan", english: "You are a hand fan if you are not a fan." },
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
      { yoruba: "L'abe igi orombo", english: "Under the orange tree." },
      { yoruba: "N'ibe l'agbe nsere wa", english: "That is where we play our games." },
      { yoruba: "Inu wa dun, ara wa ya", english: "We are happy, we are lively." },
      { yoruba: "Orombo, orombo", english: "Orange, orange." },
    ],
    source: `Mama Lisa's World, contributed and translated by Belinda (Yinka) Adisa of the Yoruba Roots Language School, ${READ}; video checked on YouTube`,
    confidence: "needs-review",
    note: `The page spells the tree word "orombo" with no marks, YouTube titles write òroǹbó, and other sources write òròmbó, so the spelling and tones are not settled. Mama Lisa's page is copyrighted, so only a few lines are shown. orombo can mean orange or lime.`,
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
      { yoruba: "Iya ni wura, iyebiye ni", english: "Mother is gold, she is precious." },
      { yoruba: "Bi o l'iya, o l'alaafia", english: "If you have a mother, you have peace." },
    ],
    source: `HeadTeacher.ng pre-school lesson plan, which prints the lyrics with an English line under each, ${READ}; video checked on YouTube`,
    confidence: "needs-review",
    note: `The page labels it "Traditional Yoruba folk song" but a Zikoko list credits Dele Ojo and his Star Brothers Band, so authorship is unsettled. The lyrics are unmarked on the page; the title's marks are the author's.`,
  },
];
