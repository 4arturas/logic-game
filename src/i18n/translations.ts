export type Language = 'en' | 'lt'

export type TranslationKey =
  // Header
  | 'header.title'
  | 'nav.practice'
  | 'nav.game_quiz'
  | 'nav.about'
  | 'nav.campaign'
  | 'nav.syllogisms'
  // Footer
  | 'footer.copyright'
  // Home page (used by components)
  | 'home.code'
  | 'home.clear_board'
  | 'home.large_diagram'
  | 'home.small_diagram'
  // Logic LT page
  | 'logic_lt.square_title'
  | 'logic_lt.syllogism_title'
  | 'logic_lt.click_hint'
  // Logic EN page
  | 'logic_en.square_title'
  | 'logic_en.syllogism_title'
  // Diagram Quiz page
  | 'quiz.title'
  | 'quiz.subtitle'
  | 'quiz.score'
  | 'quiz.streak'
  | 'quiz.major_premise'
  | 'quiz.minor_premise'
  | 'quiz.conclusion'
  | 'quiz.minor_term'
  | 'quiz.major_term'
  | 'quiz.middle_term'
  | 'quiz.how_to_play'
  | 'quiz.check_answer'
  | 'quiz.clear_board'
  | 'quiz.reset'
  | 'quiz.correct'
  | 'quiz.not_correct'
  | 'quiz.differences'
  | 'quiz.show_answer'
  | 'quiz.next'
  | 'quiz.skip'
  | 'quiz.correct_answer'
  | 'quiz.large_diagram_subtitle'
  | 'quiz.small_diagram_subtitle'
  | 'quiz.current_code'
  | 'quiz.loading'
  | 'quiz.logical_sequence_prelude'
  | 'quiz.click_1'
  | 'quiz.click_2'
  | 'quiz.click_3'
  | 'quiz.practice_title'
  | 'quiz.practice_subtitle'
  | 'quiz.help_title'
  | 'quiz.help_visual_guide'
  | 'quiz.help_large_desc'
  | 'quiz.help_small_desc'
  | 'quiz.help_symbols_title'
  | 'quiz.help_symbol_subset'
  | 'quiz.help_symbol_intersection'
  | 'quiz.help_symbol_not_empty'
  | 'quiz.help_symbol_complement'
  | 'quiz.help_col1'
  | 'quiz.help_col2'
  | 'quiz.help_col3'
  | 'quiz.help_col4'
  | 'quiz.help_row1_1'
  | 'quiz.help_row1_2'
  | 'quiz.help_row1_3'
  | 'quiz.help_row1_4'
  | 'quiz.help_row2_1'
  | 'quiz.help_row2_2'
  | 'quiz.help_row2_3'
  | 'quiz.help_row2_4'
  | 'quiz.help_row3_1'
  | 'quiz.help_row3_2'
  | 'quiz.help_row3_3'
  | 'quiz.help_row3_4'
  | 'quiz.help_row4_1'
  | 'quiz.help_row4_2'
  | 'quiz.help_row4_3'
  | 'quiz.help_row4_4'
  | 'quiz.help_row5_1'
  | 'quiz.help_row5_2'
  | 'quiz.help_row5_3'
  | 'quiz.help_row5_4'
  | 'quiz.help_row6_1'
  | 'quiz.help_row6_2'
  | 'quiz.help_row6_3'
  | 'quiz.help_row6_4'
  | 'quiz.help_row7_1'
  | 'quiz.help_row7_2'
  | 'quiz.help_row7_3'
  | 'quiz.help_row7_4'
  | 'quiz.all'
  | 'quiz.no'
  | 'quiz.some'
  | 'quiz.some_not'
  | 'quiz.have'
  | 'quiz.are'
  | 'quiz.all_word'
  | 'quiz.no_word'
  | 'quiz.some_word'
  | 'quiz.not_word'
  // Square of Opposition
  | 'square.title'
  | 'square.A'
  | 'square.E'
  | 'square.I'
  | 'square.O'
  | 'square.contraries'
  | 'square.subcontraries'
  | 'square.subalternation'
  | 'square.contradiction'
  | 'square.legend'
  // Campaign
  | 'campaign.level'
  | 'campaign.xp'
  | 'campaign.next_level'
  | 'campaign.level_up'
  | 'campaign.perfect'
  | 'campaign.game_over'
  | 'campaign.hearts'
  | 'campaign.title'
  | 'campaign.subtitle'
  | 'campaign.try_again'
  | 'campaign.streak'
  // Logic Terms
  | 'mortal' | 'humans' | 'animals' | 'have fur' | 'snakes' | 'reptiles' | 'playful' | 'pets' | 'kittens'
  | 'fun' | 'readings' | 'homework' | 'healthy food' | 'cakes' | 'gain weight' | 'horse' | 'have bloating'
  | 'lazy' | 'students' | 'pass exams' | 'informative' | 'websites' | 'useful' | 'nutritious' | 'tasty things'
  | 'fruits' | 'beautiful' | 'useful things' | 'cups' | 'red' | 'boarding students' | 'diligent boys'
  | 'new' | 'cracked things' | 'pitchers' | 'have tails' | 'mammals' | 'cats' | 'edible' | 'green things'
  | 'trees' | 'apples' | 'ripe fruits' | 'bright' | 'indoor flowers' | 'fragrant' | 'small' | 'colorful birds'
  | 'eat honey' | 'mythical beings' | 'perfect' | 'competent' | 'workers' | 'make mistakes'
  | 'color' | 'taste' | 'apple' | 'delicious'

export interface Translations {
  [key: string]: string
}

export type { Language as I18nLanguage, TranslationKey as I18nTranslationKey }

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    // Header
    'header.title': 'TanStack Start',
    'nav.practice': 'Practice',
    'nav.game_quiz': 'Game',
    'nav.about': 'About',
    'nav.campaign': 'Campaign',
    'nav.syllogisms': 'Atlas',
    // Footer
    'footer.copyright': '© {year} Lewis Carroll Logic Game. Learn logic through interactive diagrams.',
    // Home page (used by components)
    'home.code': 'Code:',
    'home.clear_board': 'Clear Board',
    'home.large_diagram': 'Large Diagram (Premises)',
    'home.small_diagram': 'Small Diagram (Conclusions)',
    // Logic LT page
    'logic_lt.square_title': 'Logikos kvadratas (Oppositio)',
    'logic_lt.syllogism_title': 'Silogizmų figūros',
    'logic_lt.click_hint': 'Paspauskite norėdami peržiūrėti diagramoje',
    // Logic EN page
    'logic_en.square_title': 'Square of Opposition (Oppositio)',
    'logic_en.syllogism_title': 'Syllogism Figures',
    // Diagram Quiz page
    'quiz.title': 'Lewis Carroll Diagram Quiz',
    'quiz.subtitle': 'Encode syllogisms using Carroll\'s logical diagram system',
    'quiz.score': 'Score',
    'quiz.streak': 'Streak',
    'quiz.major_premise': 'Major Premise',
    'quiz.minor_premise': 'Minor Premise',
    'quiz.conclusion': 'Conclusion',
    'quiz.minor_term': 'Minor (S)',
    'quiz.major_term': 'Major (P)',
    'quiz.middle_term': 'Middle (M)',
    'quiz.how_to_play': 'How to play',
    'quiz.check_answer': 'Check Answer',
    'quiz.clear_board': 'Clear Board',
    'quiz.reset': 'Reset',
    'quiz.correct': 'Correct!',
    'quiz.not_correct': 'Not quite right',
    'quiz.differences': 'Differences found:',
    'quiz.show_answer': 'Show Answer',
    'quiz.next': 'Next Syllogism →',
    'quiz.skip': 'Skip →',
    'quiz.correct_answer': 'Correct Answer',
    'quiz.large_diagram_subtitle': 'Large Diagram (Premises)',
    'quiz.small_diagram_subtitle': 'Small Diagram (Conclusions)',
    'quiz.current_code': 'Current Code:',
    'quiz.loading': 'Loading...',
    'quiz.logical_sequence_prelude': 'Combining all your parts, we get this logical sequence:',
    'quiz.click_1': '1 click: EXISTS (1) - place red counter',
    'quiz.click_2': '2 clicks: EMPTY (0) - place gray counter',
    'quiz.click_3': '3 clicks: clear cell',
    'quiz.practice_title': 'Practice Quiz',
    'quiz.practice_subtitle': 'Practice encoding syllogisms with Lewis Carroll diagrams',
    'quiz.help_title': 'Logic Rules',
    'quiz.help_visual_guide': 'Visual Guide',
    'quiz.help_large_desc': 'Large Diagram (Premises) - 16 cells in total, but we focus on 9-16 for premises. Cells 1-8 are within x or y respectively.',
    'quiz.help_small_desc': 'Small Diagram (Conclusions) - 8 cells in total, but we focus on 5-8 for conclusions. Cells 1-4 are within x or y respectively.',
    'quiz.help_symbols_title': 'Logical Symbols',
    'quiz.help_symbol_subset': '⊆ : Is a subset of (All A are B)',
    'quiz.help_symbol_intersection': '∩ : Intersection (A AND B overlap)',
    'quiz.help_symbol_not_empty': '≠ ∅ : Is not empty (Some exist)',
    'quiz.help_symbol_complement': '\' : Complement (NOT the term, e.g. x\')',
    'quiz.help_col1': 'Proposition',
    'quiz.help_col2': 'Rule',
    'quiz.help_col3': 'Action',
    'quiz.help_col4': 'Cells (0)',
    'quiz.help_row1_1': 'All m are x',
    'quiz.help_row1_2': 'Pushing Up',
    'quiz.help_row1_3': 'Clear m bottom',
    'quiz.help_row1_4': '13, 14',
    'quiz.help_row2_1': 'All m are not-x',
    'quiz.help_row2_2': 'Pushing Down',
    'quiz.help_row2_3': 'Clear m top',
    'quiz.help_row2_4': '11, 12',
    'quiz.help_row3_1': 'No m is x',
    'quiz.help_row3_2': 'Locking (m and x)',
    'quiz.help_row3_3': 'Clear intersection',
    'quiz.help_row3_4': '11, 12',
    'quiz.help_row4_1': 'All x are m',
    'quiz.help_row4_2': 'Pushing Inward',
    'quiz.help_row4_3': 'Clear x outward',
    'quiz.help_row4_4': '9, 10',
    'quiz.help_row5_1': 'All y are m',
    'quiz.help_row5_2': 'Pushing Inward (Side)',
    'quiz.help_row5_3': 'Clear y outward',
    'quiz.help_row5_4': '9, 15',
    'quiz.help_row6_1': 'All m are y',
    'quiz.help_row6_2': 'Pushing Left',
    'quiz.help_row6_3': 'Clear m right',
    'quiz.help_row6_4': '12, 14',
    'quiz.help_row7_1': 'No y is m',
    'quiz.help_row7_2': 'Locking (Side)',
    'quiz.help_row7_3': 'Clear intersection',
    'quiz.help_row7_4': '11, 13',
    'quiz.all': 'All',
    'quiz.no': 'No',
    'quiz.some': 'Some',
    'quiz.some_not': 'Some...not',
    'quiz.have': 'have',
    'quiz.are': 'are',
    'quiz.all_word': 'All',
    'quiz.no_word': 'No',
    'quiz.some_word': 'Some',
    'quiz.not_word': 'not',
    // Square of Opposition
    'square.title': 'Square of Opposition (Oppositio)',
    'square.A': 'All S are P',
    'square.E': 'No S is P',
    'square.I': 'Some S are P',
    'square.O': 'Some S are not P',
    'square.contraries': 'Contraries',
    'square.subcontraries': 'Subcontraries',
    'square.subalternation': 'Subalternation',
    'square.contradiction': 'Contradiction',
    'square.legend': 'A: All... | E: No... | I: Some are... | O: Some are not...',
    // Campaign
    'campaign.level': 'Level',
    'campaign.xp': 'XP',
    'campaign.next_level': 'Next Level',
    'campaign.level_up': 'Level Up!',
    'campaign.perfect': 'Perfect!',
    'campaign.game_over': 'Game Over',
    'campaign.hearts': 'Hearts',
    'campaign.title': 'Logic Journey',
    'campaign.subtitle': 'Beat levels to master the Carroll diagram',
    'campaign.try_again': 'Try Again',
    'campaign.streak': 'Streak Bonus!',
    // Logic terms
    'mortal': 'mortal', 'humans': 'humans', 'animals': 'animals', 'have fur': 'have fur', 'snakes': 'snakes',
    'reptiles': 'reptiles', 'playful': 'playful', 'pets': 'pets', 'kittens': 'kittens', 'fun': 'fun',
    'readings': 'readings', 'homework': 'homework', 'healthy food': 'healthy food', 'cakes': 'cakes',
    'gain weight': 'gain weight', 'horse': 'horse', 'have bloating': 'have bloating', 'lazy': 'lazy',
    'students': 'students', 'pass exams': 'pass exams', 'informative': 'informative', 'websites': 'websites',
    'useful': 'useful', 'nutritious': 'nutritious', 'tasty things': 'tasty things', 'fruits': 'fruits',
    'beautiful': 'beautiful', 'useful things': 'useful things', 'cups': 'cups', 'red': 'red',
    'boarding students': 'boarding students', 'diligent boys': 'diligent boys', 'new': 'new',
    'cracked things': 'cracked things', 'pitchers': 'pitchers', 'have tails': 'have tails',
    'mammals': 'mammals', 'cats': 'cats', 'edible': 'edible', 'green things': 'green things',
    'trees': 'trees', 'apples': 'apples', 'ripe fruits': 'ripe fruits', 'bright': 'bright',
    'indoor flowers': 'indoor flowers', 'fragrant': 'fragrant', 'small': 'small', 'colorful birds': 'colorful birds',
    'eat honey': 'eat honey', 'mythical beings': 'mythical beings', 'perfect': 'perfect',
    'competent': 'competent', 'workers': 'workers', 'make mistakes': 'make mistakes',
    'color': 'color', 'taste': 'taste', 'apple': 'apple', 'delicious': 'delicious',
  },
  lt: {
    // Header
    'header.title': 'TanStack Start',
    'nav.practice': 'Praktika',
    'nav.game_quiz': 'Žaidimas',
    'nav.about': 'Apie',
    'nav.campaign': 'Kampanija',
    'nav.syllogisms': 'Atlasas',
    // Footer
    'footer.copyright': '© {year} Lewis Carroll logikos žaidimas. Mokykitės logikos per interaktyvias diagramas.',
    // Home page (used by components)
    'home.code': 'Kodas:',
    'home.clear_board': 'Išvalyti viską',
    'home.large_diagram': 'Didžioji diagrama (Prielaidos)',
    'home.small_diagram': 'Mažoji diagrama (Išvados)',
    // Logic LT page
    'logic_lt.square_title': 'Logikos kvadratas (Oppositio)',
    'logic_lt.syllogism_title': 'Silogizmų figūros',
    'logic_lt.click_hint': 'Paspauskite norėdami peržiūrėti diagramoje',
    // Logic EN page
    'logic_en.square_title': 'Square of Opposition (Oppositio)',
    'logic_en.syllogism_title': 'Syllogism Figures',
    // Diagram Quiz page
    'quiz.title': 'Lewis Carroll Diagramų Testas',
    'quiz.subtitle': 'Koduokite silogizmus naudodami Caroll\'o loginių diagramų sistemą',
    'quiz.score': 'Rezultatas',
    'quiz.streak': 'Serija',
    'quiz.major_premise': 'Didžioji prielaida',
    'quiz.minor_premise': 'Mažoji prielaida',
    'quiz.conclusion': 'Išvada',
    'quiz.minor_term': 'Mažasis (S)',
    'quiz.major_term': 'Didysis (P)',
    'quiz.middle_term': 'Vidurinis (M)',
    'quiz.how_to_play': 'Kaip žaisti',
    'quiz.check_answer': 'Tikrinti atsakymą',
    'quiz.clear_board': 'Išvalyti lentą',
    'quiz.reset': 'Atstatyti',
    'quiz.correct': 'Teisingai!',
    'quiz.not_correct': 'Ne visai teisinga',
    'quiz.differences': 'Rasti skirtumai:',
    'quiz.show_answer': 'Rodyti atsakymą',
    'quiz.next': 'Kitas silogizmas →',
    'quiz.skip': 'Praleisti →',
    'quiz.correct_answer': 'Teisingas atsakymas',
    'quiz.large_diagram_subtitle': 'Didžioji diagrama (Prielaidos)',
    'quiz.small_diagram_subtitle': 'Mažoji diagrama (Išvados)',
    'quiz.current_code': 'Dabartinis kodas:',
    'quiz.loading': 'Kraunama...',
    'quiz.logical_sequence_prelude': 'Sujungus visas tavo dalis, gauname šią loginę seką:',
    'quiz.click_1': '1 paspaudimas: YRA (1) - raudonas skaitiklis',
    'quiz.click_2': '2 paspaudimai: NĖRA (0) - pilkas skaitiklis',
    'quiz.click_3': '3 paspaudimai: išvalyti langelį',
    'quiz.practice_title': 'Praktikos Testas',
    'quiz.practice_subtitle': 'Praktikuokite silogizmų kodavimą Lewis Carroll diagramomis',
    'quiz.help_title': 'Logikos Taisyklės',
    'quiz.help_visual_guide': 'Vizualus Gidas',
    'quiz.help_large_desc': 'Didžioji Diagrama (Prielaidos) - iš viso 16 langelių, bet prielaidoms fokusuojamės į 9-16. Langeliai 1-8 yra atitinkamai x arba y viduje.',
    'quiz.help_small_desc': 'Mažoji Diagrama (Išvados) - iš viso 8 langeliai, bet išvadoms fokusuojamės į 5-8. Langeliai 1-4 yra atitinkamai x arba y viduje.',
    'quiz.help_symbols_title': 'Logikos simboliai',
    'quiz.help_symbol_subset': '⊆ : Yra poaibis (Visi A yra B)',
    'quiz.help_symbol_intersection': '∩ : Sankirta (A IR B persidengia)',
    'quiz.help_symbol_not_empty': '≠ ∅ : Nėra tuščia aibė (Egzistuoja)',
    'quiz.help_symbol_complement': '\' : Papildinys (NE terminas, pvz. x\')',
    'quiz.help_col1': 'Teiginys',
    'quiz.help_col2': 'Taisyklė',
    'quiz.help_col3': 'Veiksmas',
    'quiz.help_col4': 'Langeliai (0)',
    'quiz.help_row1_1': 'Visi m yra x',
    'quiz.help_row1_2': 'Išstūmimas į viršų',
    'quiz.help_row1_3': 'Išvalome m apačią',
    'quiz.help_row1_4': '13, 14',
    'quiz.help_row2_1': 'Visi m yra ne-x',
    'quiz.help_row2_2': 'Išstūmimas į apačią',
    'quiz.help_row2_3': 'Išvalome m viršų',
    'quiz.help_row2_4': '11, 12',
    'quiz.help_row3_1': 'Nė vienas m nėra x',
    'quiz.help_row3_2': 'Užrakinimas (m ir x)',
    'quiz.help_row3_3': 'Išvalome susikirtimą',
    'quiz.help_row3_4': '11, 12',
    'quiz.help_row4_1': 'Visi x yra m',
    'quiz.help_row4_2': 'Išstūmimas į vidų',
    'quiz.help_row4_3': 'Išvalome x išorę',
    'quiz.help_row4_4': '9, 10',
    'quiz.help_row5_1': 'Visi y yra m',
    'quiz.help_row5_2': 'Išstūmimas į vidų šone',
    'quiz.help_row5_3': 'Išvalome y išorę',
    'quiz.help_row5_4': '9, 15',
    'quiz.help_row6_1': 'Visi m yra y',
    'quiz.help_row6_2': 'Išstūmimas į kairę',
    'quiz.help_row6_3': 'Išvalome m dešinę',
    'quiz.help_row6_4': '12, 14',
    'quiz.help_row7_1': 'Nė vienas y nėra m',
    'quiz.help_row7_2': 'Užrakinimas šone',
    'quiz.help_row7_3': 'Išvalome susikirtimą',
    'quiz.help_row7_4': '11, 13',
    'quiz.all': 'Visi',
    'quiz.no': 'Nė vienas',
    'quiz.some': 'Kai kurie',
    'quiz.some_not': 'Kai kurie...ne',
    'quiz.have': 'turi',
    'quiz.are': 'yra',
    'quiz.all_word': 'Visi',
    'quiz.no_word': 'Nė vienas',
    'quiz.some_word': 'Kai kurie',
    'quiz.not_word': 'ne',
    // Square of Opposition
    'square.title': 'Logikos kvadratas (Oppositio)',
    'square.A': 'Visi S yra P',
    'square.E': 'Nė vienas S nėra P',
    'square.I': 'Kai kurie S yra P',
    'square.O': 'Kai kurie S nėra P',
    'square.contraries': 'Priešingumas (Kontrariškumas)',
    'square.subcontraries': 'Priešpriešingumas (Subkontrariškumas)',
    'square.subalternation': 'Pavaldumas',
    'square.contradiction': 'Prieštaravimas',
    'square.legend': 'A: Visi... | E: Nė vienas... | I: Kai kurie yra... | O: Kai kurie nėra...',
    // Campaign
    'campaign.level': 'Lygis',
    'campaign.xp': 'XP',
    'campaign.next_level': 'Kitas lygis',
    'campaign.level_up': 'Naujas lygis!',
    'campaign.perfect': 'Puiku!',
    'campaign.game_over': 'Žaidimas baigtas',
    'campaign.hearts': 'Gyvybės',
    'campaign.title': 'Logikos kelionė',
    'campaign.subtitle': 'Įveikite lygius, kad taptumėte Lewis Carroll meistru',
    'campaign.try_again': 'Bandyti dar kartą',
    'campaign.streak': 'Serijos priedas!',
    // Logic terms
    'mortal': 'mirtingi', 'humans': 'žmonės', 'animals': 'gyvūnai', 'have fur': 'kailiniai', 'snakes': 'gyvatės',
    'reptiles': 'ropliai', 'playful': 'žaismingi', 'pets': 'augintiniai', 'kittens': 'kačiukai', 'fun': 'smagūs',
    'readings': 'skaitiniai', 'homework': 'namų darbai', 'healthy food': 'sveikas maistas', 'cakes': 'pyragai',
    'gain weight': 'storinantys', 'horse': 'arklys', 'have bloating': 'tinstantys', 'lazy': 'tinginiai',
    'students': 'studentai', 'pass exams': 'išlaiko egzaminus', 'informative': 'informatyvūs', 'websites': 'svetainės',
    'useful': 'naudingi', 'nutritious': 'maistingi', 'tasty things': 'skanūs dalykai', 'fruits': 'vaisiai',
    'beautiful': 'gražūs', 'useful things': 'naudingi daiktai', 'cups': 'puodeliai', 'red': 'raudoni',
    'boarding students': 'internato mokiniai', 'diligent boys': 'darbštūs berniukai', 'new': 'nauji',
    'cracked things': 'įtrūkę daiktai', 'pitchers': 'ąsočiai', 'have tails': 'turi uodegas',
    'mammals': 'žinduoliai', 'cats': 'katės', 'edible': 'valgomi', 'green things': 'žali daiktai',
    'trees': 'medžiai', 'apples': 'obuoliai', 'ripe fruits': 'sunokę vaisiai', 'bright': 'ryškūs',
    'indoor flowers': 'kambarinės gėlės', 'fragrant': 'kvepiantys', 'small': 'maži', 'colorful birds': 'spalvoti paukščiai',
    'eat honey': 'valgo medų', 'mythical beings': 'mitinės būtybės', 'perfect': 'tobuli',
    'competent': 'kompetentingi', 'workers': 'darbuotojai', 'make mistakes': 'daro klaidas',
    'color': 'spalva', 'taste': 'skonis', 'apple': 'obuolys', 'delicious': 'skanus',
  },
}
