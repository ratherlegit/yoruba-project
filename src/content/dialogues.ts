import type { Confidence, LevelId } from "./types";

// Dialogues: realistic two-person conversations, grouped by level and situation. The learner
// reads each line in Yoruba with its English, hears it in the speaker's voice (a woman and a
// man), then answers a few comprehension questions. All of the Yoruba here is written by the
// author of this code with no published source, so every conversation is needs-review.

export type Voice = "female" | "male";
export type DialogueLine = { speaker: string; voice: Voice; yoruba: string; english: string };
export type DialogueQuestion = { prompt: string; choices: string[]; answer: string };

export type Situation = { id: string; level: LevelId; title: string; summary: string };

export type Dialogue = {
  id: string;
  level: LevelId;
  situationId: string;
  title: string;
  setting: string; // one sentence on who is talking and where
  lines: DialogueLine[];
  questions: DialogueQuestion[]; // English questions about what was said
  source: string;
  confidence: Confidence;
  note: string;
};

export const MIN_LINES = 3;
export const MAX_LINES = 12;

export const SITUATIONS: Situation[] = [
  { id: "meeting", level: "getting-started", title: "Meeting someone", summary: "Greet someone, say your name and where you are from." },
  { id: "market", level: "beginner", title: "At the market", summary: "Ask for food, say what you do not want, and talk about the price." },
  { id: "getting-around", level: "intermediate", title: "Getting around", summary: "Ask where someone is going, ask the way, and take a bus." },
  { id: "friends-home", level: "advanced", title: "Visiting a friend's home", summary: "Be welcomed, talk about family, and say goodbye." },
  { id: "elder", level: "mastery", title: "Talking with an elder", summary: "Ask for advice, hear a proverb, and give thanks." },
];

const SOURCE = "Written by the author of this code for this site, using words and patterns from the level's lessons; no published source.";

export const DIALOGUES: Dialogue[] = [
  {
    id: "gs-morning",
    level: "getting-started",
    situationId: "meeting",
    title: "Good morning",
    setting: "Two neighbours greet each other in the morning.",
    lines: [
      { speaker: "Bùkọ́lá", voice: "female", yoruba: "Ẹ káàárọ̀.", english: "Good morning." },
      { speaker: "Adé", voice: "male", yoruba: "Ẹ káàárọ̀. Ṣé àlàáfíà ni?", english: "Good morning. Is everything well?" },
      { speaker: "Bùkọ́lá", voice: "female", yoruba: "Àlàáfíà ni. Ẹ ṣé.", english: "Everything is well. Thank you." },
      { speaker: "Adé", voice: "male", yoruba: "Ẹ ṣé. Ó dàbọ̀.", english: "Thank you. Goodbye." },
    ],
    questions: [
      { prompt: "What time of day is it?", choices: ["Morning", "Afternoon", "Evening"], answer: "Morning" },
      { prompt: "How is Bùkọ́lá?", choices: ["She is well", "She is tired", "She is hungry"], answer: "She is well" },
    ],
    source: SOURCE,
    confidence: "needs-review",
    note: "Check \"Ṣé àlàáfíà ni?\" and \"Àlàáfíà ni\" (the usual how-are-you exchange) and the tones on \"Ó dàbọ̀\". All of this Yoruba was written by the author with no published source, so every line needs a native speaker.",
  },
  {
    id: "gs-evening",
    level: "getting-started",
    situationId: "meeting",
    title: "Good evening",
    setting: "Two neighbours meet in the evening after work.",
    lines: [
      { speaker: "Bùkọ́lá", voice: "female", yoruba: "Ẹ káalẹ́, Adé.", english: "Good evening, Adé." },
      { speaker: "Adé", voice: "male", yoruba: "Ẹ káalẹ́, Bùkọ́lá. Ẹ kúuṣẹ́.", english: "Good evening, Bùkọ́lá. Well done with your work." },
      { speaker: "Bùkọ́lá", voice: "female", yoruba: "Ẹ ṣé. Ṣé àlàáfíà ni?", english: "Thank you. Is everything well?" },
      { speaker: "Adé", voice: "male", yoruba: "Àlàáfíà ni.", english: "Everything is well." },
      { speaker: "Bùkọ́lá", voice: "female", yoruba: "Ó dàbọ̀.", english: "Goodbye." },
    ],
    questions: [
      { prompt: "What does Adé say to Bùkọ́lá about her work?", choices: ["Well done", "Come in", "I am hungry"], answer: "Well done" },
      { prompt: "When does this happen?", choices: ["In the evening", "In the morning", "At noon"], answer: "In the evening" },
    ],
    source: SOURCE,
    confidence: "needs-review",
    note: "Check \"Ẹ káalẹ́\" and \"Ẹ kúuṣẹ́\" against lesson 3, and the tone on \"Ṣé\". All of this Yoruba was written by the author with no published source, so every line needs a native speaker.",
  },
  {
    id: "gs-names",
    level: "getting-started",
    situationId: "meeting",
    title: "What is your name?",
    setting: "Two people meet for the first time.",
    lines: [
      { speaker: "Adé", voice: "male", yoruba: "Ẹ káàárọ̀. Orúkọ mi ni Adé.", english: "Good morning. My name is Adé." },
      { speaker: "Bùkọ́lá", voice: "female", yoruba: "Ẹ káàárọ̀, Adé. Orúkọ mi ni Bùkọ́lá.", english: "Good morning, Adé. My name is Bùkọ́lá." },
      { speaker: "Adé", voice: "male", yoruba: "Inú mi dùn.", english: "I am glad to meet you." },
      { speaker: "Bùkọ́lá", voice: "female", yoruba: "Inú mi dùn pẹ̀lú.", english: "I am glad too." },
      { speaker: "Adé", voice: "male", yoruba: "Ọmọ Ìbàdàn ni mí.", english: "I am from Ibadan." },
      { speaker: "Bùkọ́lá", voice: "female", yoruba: "Ọmọ Èkó ni mí.", english: "I am from Lagos." },
    ],
    questions: [
      { prompt: "What is the man's name?", choices: ["Adé", "Bùkọ́lá", "Ṣọlá"], answer: "Adé" },
      { prompt: "Where is Bùkọ́lá from?", choices: ["Lagos", "Ibadan", "Abuja"], answer: "Lagos" },
      { prompt: "Where is Adé from?", choices: ["Ibadan", "Lagos", "Ilorin"], answer: "Ibadan" },
    ],
    source: SOURCE,
    confidence: "needs-review",
    note: "Check \"Inú mi dùn\" as \"glad to meet you\", and \"Ọmọ Ìbàdàn ni mí\" and \"Ọmọ Èkó ni mí\" (literally \"I am a child of Ibadan or Lagos\"). All of this Yoruba was written by the author with no published source, so every line needs a native speaker.",
  },
  {
    id: "b-fish",
    level: "beginner",
    situationId: "market",
    title: "Buying fish",
    setting: "A man buys fish from a woman at her market stall.",
    lines: [
      { speaker: "Ṣọlá", voice: "male", yoruba: "Ẹ káàárọ̀, ìyá.", english: "Good morning, mother." },
      { speaker: "Ìyá Ọlá", voice: "female", yoruba: "Ẹ káàárọ̀. Kí ni ẹ fẹ́?", english: "Good morning. What do you want?" },
      { speaker: "Ṣọlá", voice: "male", yoruba: "Mo fẹ́ ra ẹja.", english: "I want to buy fish." },
      { speaker: "Ìyá Ọlá", voice: "female", yoruba: "Ẹja yìí dára.", english: "This fish is good." },
      { speaker: "Ṣọlá", voice: "male", yoruba: "Èló ni ẹja yìí?", english: "How much is this fish?" },
      { speaker: "Ìyá Ọlá", voice: "female", yoruba: "Àádọ́ta náírà.", english: "Fifty naira." },
    ],
    questions: [
      { prompt: "What does Ṣọlá want to buy?", choices: ["Fish", "Pepper", "Eggs"], answer: "Fish" },
      { prompt: "How much is the fish?", choices: ["Fifty naira", "One hundred naira", "Forty naira"], answer: "Fifty naira" },
    ],
    source: SOURCE,
    confidence: "needs-review",
    note: "Check \"Èló ni?\" for how much, \"ìyá\" as a respectful word for an older woman, and \"Àádọ́ta\" (50) against the Numbers section. All of this Yoruba was written by the author with no published source, so every line needs a native speaker.",
  },
  {
    id: "b-eggs",
    level: "beginner",
    situationId: "market",
    title: "I do not want that",
    setting: "The same man says what he does not want.",
    lines: [
      { speaker: "Ìyá Ọlá", voice: "female", yoruba: "Ṣé ẹ fẹ́ ata?", english: "Do you want pepper?" },
      { speaker: "Ṣọlá", voice: "male", yoruba: "Rárá, mi ò fẹ́ ata.", english: "No, I do not want pepper." },
      { speaker: "Ìyá Ọlá", voice: "female", yoruba: "Ṣé ẹ fẹ́ ẹran?", english: "Do you want meat?" },
      { speaker: "Ṣọlá", voice: "male", yoruba: "Mi ò fẹ́ ẹran. Mo fẹ́ ẹyin.", english: "I do not want meat. I want eggs." },
      { speaker: "Ìyá Ọlá", voice: "female", yoruba: "Ẹyin mélòó?", english: "How many eggs?" },
      { speaker: "Ṣọlá", voice: "male", yoruba: "Ẹyin mẹ́ta.", english: "Three eggs." },
      { speaker: "Ìyá Ọlá", voice: "female", yoruba: "Ó dára.", english: "Good." },
    ],
    questions: [
      { prompt: "Which two things does Ṣọlá say he does not want?", choices: ["Pepper and meat", "Fish and eggs", "Meat and eggs"], answer: "Pepper and meat" },
      { prompt: "How many eggs does he buy?", choices: ["Three", "Two", "Ten"], answer: "Three" },
    ],
    source: SOURCE,
    confidence: "needs-review",
    note: "Check \"mi ò fẹ́\" (I do not want), \"Rárá\" (no) and \"Ẹyin mélòó\" (how many eggs). All of this Yoruba was written by the author with no published source, so every line needs a native speaker.",
  },
  {
    id: "b-price",
    level: "beginner",
    situationId: "market",
    title: "Talking about the price",
    setting: "He thinks the fish costs too much and asks for less.",
    lines: [
      { speaker: "Ṣọlá", voice: "male", yoruba: "Ẹja yìí wọ́n jù.", english: "This fish is too expensive." },
      { speaker: "Ìyá Ọlá", voice: "female", yoruba: "Rárá o, ẹja yìí dára gan-an.", english: "No, this fish is very good." },
      { speaker: "Ṣọlá", voice: "male", yoruba: "Ṣé ẹ lè dín owó kù?", english: "Can you lower the price?" },
      { speaker: "Ìyá Ọlá", voice: "female", yoruba: "Mo lè dín kù. Ogójì náírà.", english: "I can lower it. Forty naira." },
      { speaker: "Ṣọlá", voice: "male", yoruba: "Ó dára. Mo ń san owó.", english: "Good. I am paying." },
      { speaker: "Ìyá Ọlá", voice: "female", yoruba: "Ẹ ṣé. Ó dàbọ̀.", english: "Thank you. Goodbye." },
    ],
    questions: [
      { prompt: "What does Ṣọlá ask her to do?", choices: ["Lower the price", "Give him more fish", "Close the stall"], answer: "Lower the price" },
      { prompt: "What is the new price?", choices: ["Forty naira", "Fifty naira", "Twenty naira"], answer: "Forty naira" },
    ],
    source: SOURCE,
    confidence: "needs-review",
    note: "Check \"wọ́n jù\" (too expensive), \"dín owó kù\" (lower the price), \"gan-an\" and \"Ogójì\" (40) against the Numbers section. All of this Yoruba was written by the author with no published source, so every line needs a native speaker.",
  },
  {
    id: "i-going",
    level: "intermediate",
    situationId: "getting-around",
    title: "Where are you going?",
    setting: "Two people wait by the road.",
    lines: [
      { speaker: "Dàpọ̀", voice: "male", yoruba: "Ẹ pẹ̀lẹ́. Ibo ni ẹ ń lọ?", english: "Hello. Where are you going?" },
      { speaker: "Kẹ́mi", voice: "female", yoruba: "Mo ń lọ sí ọjà.", english: "I am going to the market." },
      { speaker: "Dàpọ̀", voice: "male", yoruba: "Èmi náà máa lọ síbẹ̀.", english: "I will go there too." },
      { speaker: "Kẹ́mi", voice: "female", yoruba: "Ṣé ẹ ti rí ọkọ̀?", english: "Have you got a vehicle yet?" },
      { speaker: "Dàpọ̀", voice: "male", yoruba: "Rárá, mi ò tíì rí ọkọ̀.", english: "No, I have not got one yet." },
      { speaker: "Kẹ́mi", voice: "female", yoruba: "Ọkọ̀ yóò dé láìpẹ́.", english: "A vehicle will arrive soon." },
      { speaker: "Dàpọ̀", voice: "male", yoruba: "Ẹ ṣé.", english: "Thank you." },
      { speaker: "Kẹ́mi", voice: "female", yoruba: "Kò sí wàhálà.", english: "No problem." },
    ],
    questions: [
      { prompt: "Where is Kẹ́mi going?", choices: ["To the market", "To school", "To the hospital"], answer: "To the market" },
      { prompt: "What does Dàpọ̀ still need?", choices: ["A vehicle", "Money", "A bag"], answer: "A vehicle" },
    ],
    source: SOURCE,
    confidence: "needs-review",
    note: "Check \"Ẹ pẹ̀lẹ́\" as a greeting, \"mi ò tíì\" (not yet), \"láìpẹ́\" (soon) and \"Kò sí wàhálà\" (no problem). All of this Yoruba was written by the author with no published source, so every line needs a native speaker.",
  },
  {
    id: "i-way",
    level: "intermediate",
    situationId: "getting-around",
    title: "Asking the way",
    setting: "A man asks a woman how to get to the hospital.",
    lines: [
      { speaker: "Dàpọ̀", voice: "male", yoruba: "Ẹ jọ̀wọ́, ibo ni ilé ìwòsàn wà?", english: "Please, where is the hospital?" },
      { speaker: "Kẹ́mi", voice: "female", yoruba: "Ilé ìwòsàn náà wà nítòsí.", english: "The hospital is nearby." },
      { speaker: "Dàpọ̀", voice: "male", yoruba: "Ṣé ó jìnnà?", english: "Is it far?" },
      { speaker: "Kẹ́mi", voice: "female", yoruba: "Rárá, kò jìnnà.", english: "No, it is not far." },
      { speaker: "Dàpọ̀", voice: "male", yoruba: "Ọ̀nà wo ni mo máa tọ̀?", english: "Which road will I take?" },
      { speaker: "Kẹ́mi", voice: "female", yoruba: "Ẹ tọ ọ̀nà yìí lọ. Ẹ ó rí i lẹ́yìn ilé ìwé.", english: "Follow this road. You will see it behind the school." },
      { speaker: "Dàpọ̀", voice: "male", yoruba: "Ẹ ṣé gan-an.", english: "Thank you very much." },
      { speaker: "Kẹ́mi", voice: "female", yoruba: "Ó dàbọ̀.", english: "Goodbye." },
    ],
    questions: [
      { prompt: "Is the hospital far?", choices: ["No, it is nearby", "Yes, very far", "She does not know"], answer: "No, it is nearby" },
      { prompt: "Where will he see the hospital?", choices: ["Behind the school", "Beside the market", "Across the river"], answer: "Behind the school" },
    ],
    source: SOURCE,
    confidence: "needs-review",
    note: "Check \"nítòsí\" (nearby), \"tọ ọ̀nà yìí lọ\" (follow this road), \"Ẹ ó rí i\" (you will see it) and \"lẹ́yìn\" (behind). All of this Yoruba was written by the author with no published source, so every line needs a native speaker.",
  },
  {
    id: "i-bus",
    level: "intermediate",
    situationId: "getting-around",
    title: "Taking a bus",
    setting: "A man gets on a bus and pays the fare.",
    lines: [
      { speaker: "Dàpọ̀", voice: "male", yoruba: "Ẹ jọ̀wọ́, ṣé ọkọ̀ yìí ń lọ sí Ìkẹjà?", english: "Please, is this bus going to Ikeja?" },
      { speaker: "Kẹ́mi", voice: "female", yoruba: "Bẹ́ẹ̀ ni. Ó ń lọ sí Ìkẹjà.", english: "Yes. It is going to Ikeja." },
      { speaker: "Dàpọ̀", voice: "male", yoruba: "Èló ni owó ọkọ̀?", english: "How much is the fare?" },
      { speaker: "Kẹ́mi", voice: "female", yoruba: "Ọgọ́rùn-ún náírà.", english: "One hundred naira." },
      { speaker: "Dàpọ̀", voice: "male", yoruba: "Mo ní igba náírà.", english: "I have two hundred naira." },
      { speaker: "Kẹ́mi", voice: "female", yoruba: "Mo máa dá ọgọ́rùn-ún padà.", english: "I will give back one hundred." },
      { speaker: "Dàpọ̀", voice: "male", yoruba: "Ọkọ̀ yóò dé Ìkẹjà láìpẹ́?", english: "Will the bus reach Ikeja soon?" },
      { speaker: "Kẹ́mi", voice: "female", yoruba: "Bẹ́ẹ̀ ni, ó máa dé láìpẹ́.", english: "Yes, it will arrive soon." },
    ],
    questions: [
      { prompt: "How much is the fare?", choices: ["One hundred naira", "Two hundred naira", "Fifty naira"], answer: "One hundred naira" },
      { prompt: "How much does he give her?", choices: ["Two hundred naira", "One hundred naira", "Forty naira"], answer: "Two hundred naira" },
      { prompt: "Where is the bus going?", choices: ["Ikeja", "Ibadan", "Abuja"], answer: "Ikeja" },
    ],
    source: SOURCE,
    confidence: "needs-review",
    note: "Check \"owó ọkọ̀\" (the fare), \"Ọgọ́rùn-ún\" (100) and \"igba\" (200) against the Numbers section, and \"dá ... padà\" (give back). All of this Yoruba was written by the author with no published source, so every line needs a native speaker.",
  },
  {
    id: "a-welcome",
    level: "advanced",
    situationId: "friends-home",
    title: "Welcome",
    setting: "A guest arrives at his friend's house.",
    lines: [
      { speaker: "Ṣẹ́gun", voice: "male", yoruba: "Ẹ kú ilé o.", english: "Greetings to the house." },
      { speaker: "Tọ́pẹ́", voice: "female", yoruba: "Ẹ káàbọ̀. Ẹ wọlé.", english: "Welcome. Come in." },
      { speaker: "Ṣẹ́gun", voice: "male", yoruba: "Ẹ ṣé. Ilé yìí dára gan-an.", english: "Thank you. This house is very nice." },
      { speaker: "Tọ́pẹ́", voice: "female", yoruba: "Ẹ jókòó. Ẹ máa bá wa jẹun.", english: "Sit down. Please eat with us." },
      { speaker: "Ṣẹ́gun", voice: "male", yoruba: "Kí ni ẹ ń sè?", english: "What are you cooking?" },
      { speaker: "Tọ́pẹ́", voice: "female", yoruba: "Mo ń sè ọbẹ̀ tí ẹ fẹ́.", english: "I am cooking the soup that you like." },
      { speaker: "Ṣẹ́gun", voice: "male", yoruba: "Ẹ ṣé. Inú mi dùn gan-an.", english: "Thank you. I am very happy." },
      { speaker: "Tọ́pẹ́", voice: "female", yoruba: "Oúnjẹ ti ṣe. Ẹ jẹun.", english: "The food is ready. Eat." },
    ],
    questions: [
      { prompt: "What is Tọ́pẹ́ cooking?", choices: ["Soup", "Fish", "Rice"], answer: "Soup" },
      { prompt: "What does Tọ́pẹ́ ask the guest to do first?", choices: ["Come in and sit down", "Go home", "Wait outside"], answer: "Come in and sit down" },
    ],
    source: SOURCE,
    confidence: "needs-review",
    note: "Check \"Ẹ kú ilé\", \"Ẹ káàbọ̀\", \"ọbẹ̀ tí ẹ fẹ́\" (the soup that you like; a relative clause) and \"Oúnjẹ ti ṣe\". All of this Yoruba was written by the author with no published source, so every line needs a native speaker.",
  },
  {
    id: "a-family",
    level: "advanced",
    situationId: "friends-home",
    title: "Talking about family",
    setting: "Over the meal, the two friends talk about her children.",
    lines: [
      { speaker: "Ṣẹ́gun", voice: "male", yoruba: "Ṣé ẹ ní ọmọ?", english: "Do you have children?" },
      { speaker: "Tọ́pẹ́", voice: "female", yoruba: "Mo ní ọmọ méjì. Ọmọkùnrin kan àti ọmọbìnrin kan.", english: "I have two children. One boy and one girl." },
      { speaker: "Ṣẹ́gun", voice: "male", yoruba: "Ọmọ wo ni ó dàgbà jù?", english: "Which child is older?" },
      { speaker: "Tọ́pẹ́", voice: "female", yoruba: "Ọmọbìnrin tí ó ń kàwé ni ó dàgbà jù.", english: "It is the girl who is studying who is older." },
      { speaker: "Ṣẹ́gun", voice: "male", yoruba: "Kíkàwé dára gan-an.", english: "Studying is very good." },
      { speaker: "Tọ́pẹ́", voice: "female", yoruba: "Bẹ́ẹ̀ ni. Ó fẹ́ràn kíkàwé.", english: "Yes. She loves studying." },
      { speaker: "Ṣẹ́gun", voice: "male", yoruba: "Ṣé ọmọkùnrin náà ń lọ ilé ìwé?", english: "Does the boy go to school too?" },
      { speaker: "Tọ́pẹ́", voice: "female", yoruba: "Rárá, kò tíì dàgbà tó.", english: "No, he is not old enough yet." },
    ],
    questions: [
      { prompt: "How many children does Tọ́pẹ́ have?", choices: ["Two", "One", "Three"], answer: "Two" },
      { prompt: "Who is older?", choices: ["The girl", "The boy", "They are twins"], answer: "The girl" },
      { prompt: "Why is the boy not at school?", choices: ["He is not old enough yet", "He is sick", "He does not like it"], answer: "He is not old enough yet" },
    ],
    source: SOURCE,
    confidence: "needs-review",
    note: "Check \"ọmọkùnrin\" and \"ọmọbìnrin\", \"dàgbà jù\" (older), \"Kíkàwé\" (studying, a verbal noun), \"ọmọbìnrin tí ó ń kàwé\" (a relative clause) and \"kò tíì dàgbà tó\". All of this Yoruba was written by the author with no published source, so every line needs a native speaker.",
  },
  {
    id: "a-goodbye",
    level: "advanced",
    situationId: "friends-home",
    title: "Saying goodbye",
    setting: "The guest leaves after the meal.",
    lines: [
      { speaker: "Ṣẹ́gun", voice: "male", yoruba: "Mo ti jẹun yó. Ẹ ṣé gan-an.", english: "I have eaten my fill. Thank you very much." },
      { speaker: "Tọ́pẹ́", voice: "female", yoruba: "Ẹ máa wá lẹ́ẹ̀kan sí i.", english: "Please come again." },
      { speaker: "Ṣẹ́gun", voice: "male", yoruba: "N óo wá lọ́sẹ̀ tó ń bọ̀.", english: "I will come next week." },
      { speaker: "Tọ́pẹ́", voice: "female", yoruba: "Ẹ mú ọbẹ̀ yìí lọ sílé.", english: "Take this soup home." },
      { speaker: "Ṣẹ́gun", voice: "male", yoruba: "Ẹ ṣé o. Mo máa gbé e lọ.", english: "Thank you. I will carry it home." },
      { speaker: "Tọ́pẹ́", voice: "female", yoruba: "Ẹ ṣọ́ra lọ́nà o.", english: "Be careful on the road." },
      { speaker: "Ṣẹ́gun", voice: "male", yoruba: "Ẹ ṣé. Ó dàbọ̀.", english: "Thank you. Goodbye." },
      { speaker: "Tọ́pẹ́", voice: "female", yoruba: "Ó dàbọ̀.", english: "Goodbye." },
    ],
    questions: [
      { prompt: "When will Ṣẹ́gun come again?", choices: ["Next week", "Tomorrow", "Next year"], answer: "Next week" },
      { prompt: "What does Tọ́pẹ́ give him to take home?", choices: ["Soup", "Rice", "Fish"], answer: "Soup" },
    ],
    source: SOURCE,
    confidence: "needs-review",
    note: "Check \"yó\" (full), \"lẹ́ẹ̀kan sí i\" (once more), \"N óo wá\" (I will come), \"lọ́sẹ̀ tó ń bọ̀\" (next week) and the serial verbs \"mú ... lọ\" and \"gbé ... lọ\". All of this Yoruba was written by the author with no published source, so every line needs a native speaker.",
  },
  {
    id: "m-advice",
    level: "mastery",
    situationId: "elder",
    title: "Asking for advice",
    setting: "A young woman asks an elder what to do when work is hard.",
    lines: [
      { speaker: "Ìyábọ̀", voice: "female", yoruba: "Ẹ káàárọ̀, bàbá. Ẹ jọ̀wọ́, mo fẹ́ gba ìmọ̀ràn lọ́wọ́ yín.", english: "Good morning, sir. Please, I would like to take your advice." },
      { speaker: "Bàbá Àgbà", voice: "male", yoruba: "Ẹ káàárọ̀, ọmọ mi. Kí ni ó ń dà ọ́ láàmú?", english: "Good morning, my child. What is troubling you?" },
      { speaker: "Ìyábọ̀", voice: "female", yoruba: "Iṣẹ́ mi le gan-an, mo sì ti rẹ̀.", english: "My work is very hard, and I am tired." },
      { speaker: "Bàbá Àgbà", voice: "male", yoruba: "Ààrò kì í gbóná kalẹ́, ọmọ mi.", english: "The hearth does not stay hot until nighttime, my child." },
      { speaker: "Ìyábọ̀", voice: "female", yoruba: "Ṣé ẹ ń sọ pé ìṣòro yóò parí?", english: "Are you saying the trouble will end?" },
      { speaker: "Bàbá Àgbà", voice: "male", yoruba: "Bẹ́ẹ̀ ni. Bí o bá ṣe sùúrù, ìgbà ayọ̀ yóò dé.", english: "Yes. If you are patient, a time of joy will come." },
      { speaker: "Ìyábọ̀", voice: "female", yoruba: "Ẹ ṣé, bàbá. Ọkàn mi ti balẹ̀.", english: "Thank you, sir. My heart is at peace." },
      { speaker: "Bàbá Àgbà", voice: "male", yoruba: "Ọlọ́run yóò bá ọ lọ.", english: "God will go with you." },
    ],
    questions: [
      { prompt: "What is troubling the young woman?", choices: ["Her work is hard", "She has lost her house", "She is ill"], answer: "Her work is hard" },
      { prompt: "What does the proverb tell her?", choices: ["Hard times do not last forever", "Cooking takes a long time", "A fire needs tending"], answer: "Hard times do not last forever" },
      { prompt: "What does the elder say will come if she is patient?", choices: ["A time of joy", "A new house", "A long journey"], answer: "A time of joy" },
    ],
    source: SOURCE,
    confidence: "needs-review",
    note: "The proverb \"Ààrò kì í gbóná kalẹ́\" is in the Proverbs section (Wiktionary, needs-review). Check \"ń dà ọ́ láàmú\" (is troubling you), \"ṣe sùúrù\" (be patient) and \"ọkàn mi ti balẹ̀\". All of this Yoruba was written by the author with no published source, so every line needs a native speaker.",
  },
  {
    id: "m-learning",
    level: "mastery",
    situationId: "elder",
    title: "Learning from the old",
    setting: "The elder talks about who taught him, and why he taught his children.",
    lines: [
      { speaker: "Ìyábọ̀", voice: "female", yoruba: "Bàbá, ta ni ó kọ́ yín ní iṣẹ́ àgbẹ̀?", english: "Sir, who taught you farming?" },
      { speaker: "Bàbá Àgbà", voice: "male", yoruba: "Bàbá mi ni ó kọ́ mi.", english: "It was my father who taught me." },
      { speaker: "Ìyábọ̀", voice: "female", yoruba: "Ṣé ẹ kọ́ àwọn ọmọ yín náà?", english: "Did you teach your own children too?" },
      { speaker: "Bàbá Àgbà", voice: "male", yoruba: "Mo kọ́ wọn, nítorí pé ọmọ tí a kò kọ́ ni yóò gbé ilé tí a kọ́ tà.", english: "I taught them, because it is the child who is not taught who will sell the house that was built." },
      { speaker: "Ìyábọ̀", voice: "female", yoruba: "Òwe yìí jinlẹ̀ gan-an.", english: "This proverb is very deep." },
      { speaker: "Bàbá Àgbà", voice: "male", yoruba: "Bí o bá fetí sílẹ̀, o máa gbọ́n.", english: "If you listen, you will become wise." },
      { speaker: "Ìyábọ̀", voice: "female", yoruba: "Mo ń fetí sílẹ̀, bàbá.", english: "I am listening, sir." },
      { speaker: "Bàbá Àgbà", voice: "male", yoruba: "Ìgbà yẹn ni ọgbọ́n bẹ̀rẹ̀.", english: "That is when wisdom begins." },
    ],
    questions: [
      { prompt: "Who taught the elder to farm?", choices: ["His father", "His teacher", "His neighbour"], answer: "His father" },
      { prompt: "Why did he teach his children?", choices: ["A child who is not taught will waste what was built", "He had no other work", "Farming is easy"], answer: "A child who is not taught will waste what was built" },
    ],
    source: SOURCE,
    confidence: "needs-review",
    note: "The proverb \"Ọmọ tí a kò kọ́ ni yóò gbé ilé tí a kọ́ tà\" is taught in lesson m-4. Check \"ta ni ó kọ́ yín\" (focus questions), \"fetí sílẹ̀\" (listen) and \"Ìgbà yẹn ni ọgbọ́n bẹ̀rẹ̀\" (a focus sentence). All of this Yoruba was written by the author with no published source, so every line needs a native speaker.",
  },
  {
    id: "m-thanks",
    level: "mastery",
    situationId: "elder",
    title: "Giving thanks",
    setting: "She returns to thank him.",
    lines: [
      { speaker: "Ìyábọ̀", voice: "female", yoruba: "Bàbá, mo wá dúpẹ́ lọ́wọ́ yín.", english: "Sir, I have come to thank you." },
      { speaker: "Bàbá Àgbà", voice: "male", yoruba: "Kí ló dé, ọmọ mi?", english: "What is it, my child?" },
      { speaker: "Ìyábọ̀", voice: "female", yoruba: "Nítorí pé ọ̀rọ̀ yín ràn mí lọ́wọ́.", english: "Because your words helped me." },
      { speaker: "Bàbá Àgbà", voice: "male", yoruba: "Ìwọ ni o ṣiṣẹ́, kì í ṣe èmi.", english: "It is you who did the work, not me." },
      { speaker: "Ìyábọ̀", voice: "female", yoruba: "Bí ẹ kò bá gbà mí nímọ̀ràn, ǹ bá ti juwọ́ sílẹ̀.", english: "If you had not advised me, I would have given up." },
      { speaker: "Bàbá Àgbà", voice: "male", yoruba: "Ó dára. Ọmọ rere ni ọ́.", english: "It is good. You are a good child." },
      { speaker: "Ìyábọ̀", voice: "female", yoruba: "Mo máa wá lẹ́ẹ̀kan sí i lọ́sẹ̀ tó ń bọ̀.", english: "I will come again next week." },
      { speaker: "Bàbá Àgbà", voice: "male", yoruba: "Wá nígbàkúùgbà tí o bá fẹ́.", english: "Come whenever you like." },
    ],
    questions: [
      { prompt: "Why has she come?", choices: ["To thank him", "To ask for money", "To say goodbye for good"], answer: "To thank him" },
      { prompt: "Who does the elder say did the work?", choices: ["She did", "He did", "Her father did"], answer: "She did" },
      { prompt: "What would she have done without his advice?", choices: ["Given up", "Moved away", "Asked someone else"], answer: "Given up" },
    ],
    source: SOURCE,
    confidence: "needs-review",
    note: "Check \"dúpẹ́ lọ́wọ́\" (give thanks to), \"kì í ṣe èmi\" (it is not me), the \"bí ... bá ... ǹ bá ti\" (if ... would have) sentence, and \"nígbàkúùgbà\" (whenever). All of this Yoruba was written by the author with no published source, so every line needs a native speaker.",
  },
];
