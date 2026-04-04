export type Language = 'en' | 'lt'

export type TranslationKey =
  // Header
  | 'header.title'
  | 'nav.practice'
  | 'nav.game_quiz'
  | 'nav.about'
  | 'nav.campaign'
  | 'nav.syllogisms'
  | 'nav.learn'
  // Learn page
  | 'learn.ch1_title'
  | 'learn.ch1_lesson1_title'
  | 'learn.ch1_lesson1_p1'
  | 'learn.ch1_lesson1_p2'
  | 'learn.ch1_lesson1_quote'
  | 'learn.ch1_lesson2_title'
  | 'learn.ch1_lesson2_p1'
  | 'learn.ch1_lesson2_how'
  | 'learn.step1_title'
  | 'learn.step1_desc'
  | 'learn.step2_title'
  | 'learn.step2_desc'
  | 'learn.step3_title'
  | 'learn.step3_desc'
  | 'learn.key_insight'
  | 'learn.ch1_lesson2_insight'
  | 'learn.ch2_title'
  | 'learn.ch2_lesson1_title'
  | 'learn.ch2_lesson1_p1'
  | 'learn.ch2_lesson2_title'
  | 'learn.ch2_lesson2_p1'
  | 'learn.xy_desc'
  | 'learn.xy_not_y_desc'
  | 'learn.y_not_x_desc'
  | 'learn.neither_desc'
  | 'learn.try_it'
  | 'learn.biliteral_instructions'
  | 'learn.representing'
  | 'learn.prop_a'
  | 'learn.prop_a_desc'
  | 'learn.prop_e'
  | 'learn.prop_e_desc'
  | 'learn.prop_i'
  | 'learn.prop_i_desc'
  | 'learn.prop_o'
  | 'learn.prop_o_desc'
  | 'learn.ch3_title'
  | 'learn.ch3_lesson1_title'
  | 'learn.ch3_lesson1_p1'
  | 'learn.ch3_lesson1_example_major'
  | 'learn.ch3_lesson1_example_minor'
  | 'learn.ch3_lesson1_example_conclusion'
  | 'learn.ch3_lesson1_minor_desc'
  | 'learn.ch3_lesson1_major_desc'
  | 'learn.ch3_lesson1_middle_desc'
  | 'learn.ch3_lesson2_title'
  | 'learn.ch3_lesson2_p1'
  | 'learn.ch3_lesson2_p2'
  | 'learn.inside_circle'
  | 'learn.inside_desc'
  | 'learn.outside_circle'
  | 'learn.outside_desc'
  | 'learn.ch3_lesson2_p3'
  | 'learn.try_triliteral'
  | 'learn.triliteral_instructions'
  | 'learn.how_it_works'
  | 'learn.ch3_lesson2_how'
  | 'learn.ch3_lesson3_title'
  | 'learn.ch3_lesson3_p1'
  | 'learn.step1_mark'
  | 'learn.step1_mark_desc'
  | 'learn.step1_mark_example'
  | 'learn.step2_transfer'
  | 'learn.step2_transfer_desc'
  | 'learn.rule'
  | 'learn.step2_rule'
  | 'learn.step3_read'
  | 'learn.step3_read_desc'
  | 'learn.if_xy_empty'
  | 'learn.all_x_are_y'
  | 'learn.if_xy_empty2'
  | 'learn.no_x_are_y'
  | 'learn.if_xy_counter'
  | 'learn.some_x_are_y'
  | 'learn.if_x_y_counter'
  | 'learn.some_x_not_y'
  | 'learn.examples'
  | 'learn.things'
  | 'learn.attributes'
  | 'learn.cats'
  | 'learn.books'
  | 'learn.students'
  | 'learn.apples'
  | 'learn.furry'
  | 'learn.interesting'
  | 'learn.diligent'
  | 'learn.red'
  | 'learn.minor_term_x'
  | 'learn.major_term_y'
  | 'learn.middle_term_m'
  | 'learn.example'
  | 'learn.major_premise'
  | 'learn.minor_premise'
  | 'learn.conclusion'
  | 'learn.page_title'
  | 'learn.page_subtitle'
  | 'learn.interactive_guide'
  | 'learn.lessons'
  | 'learn.next'
  // Footer
  | 'footer.copyright'
  // Home page (used by components)
  | 'home.code'
  | 'home.clear_board'
  | 'home.controls'
  | 'home.large_diagram'
  | 'home.small_diagram'
  | 'home.copy'
  | 'home.copied'
  | 'home.copy_prefix'
  | 'home.terms_label'
  | 'home.solution_label'
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
  // Atlas page
  | 'atlas.title'
  | 'atlas.subtitle'
  | 'atlas.search_placeholder'
  | 'atlas.figure'
  | 'atlas.syllogisms_count'
  | 'atlas.table.mood'
  | 'atlas.table.mnemonic'
  | 'atlas.no_results'
  | 'atlas.footer.label'
  | 'atlas.footer.quote'
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
    'nav.learn': 'Logic School',
    // Learn page
    'learn.ch1_title': '1. Things and Attributes',
    'learn.ch1_lesson1_title': 'What are Things?',
    'learn.ch1_lesson1_p1': 'In Lewis Carroll\'s Symbolic Logic, we begin with the simplest elements: <strong>Things</strong>. A "Thing" can be anything you can think of — animals, people, objects, or even abstract concepts.',
    'learn.ch1_lesson1_p2': 'Every Thing has <strong>Attributes</strong> — qualities or characteristics that describe it. For example, a "rose" (Thing) might have attributes like "red", "fragrant", or "beautiful".',
    'learn.ch1_lesson1_quote': '"The Universe of Discourse is the class of Things we are talking about at any one time."',
    'learn.ch1_lesson2_title': 'Classification',
    'learn.ch1_lesson2_p1': '<strong>Classification</strong> is the process of dividing Things into groups (called <strong>Classes</strong>) based on their Attributes. When we classify, we create a <strong>Genus</strong> (the larger class) and divide it into <strong>Species</strong> (smaller classes) using a <strong>Differentia</strong> (the distinguishing attribute).',
    'learn.ch1_lesson2_how': 'How Classification Works',
    'learn.step1_title': 'Start with a Genus',
    'learn.step1_desc': 'Example: "Animals"',
    'learn.step2_title': 'Choose a Differentia',
    'learn.step2_desc': 'Example: "has fur"',
    'learn.step3_title': 'Create two Species',
    'learn.step3_desc': '"Animals with fur" and "Animals without fur"',
    'learn.key_insight': 'Key Insight:',
    'learn.ch1_lesson2_insight': 'Every classification creates two complementary classes. If we divide "Animals" by the attribute "has fur", we get both "furry Animals" and "non-furry Animals" — together they make up the entire Universe.',
    'learn.ch2_title': '2. Propositions',
    'learn.ch2_lesson1_title': 'What is a Proposition?',
    'learn.ch2_lesson1_p1': 'A <strong>Proposition</strong> is a statement that asserts a relationship between two classes: the <strong>Subject</strong> and the <strong>Predicate</strong>. Carroll identified four types of propositions, traditionally labeled A, E, I, and O.',
    'learn.ch2_lesson2_title': 'The Biliteral Diagram',
    'learn.ch2_lesson2_p1': 'The <strong>Biliteral Diagram</strong> is Carroll\'s method for visualizing propositions about two terms (x and y). It divides a square into four cells representing all possible combinations:',
    'learn.xy_desc': 'things that are both x and y (top-left)',
    'learn.xy_not_y_desc': 'things that are x but not y (top-right)',
    'learn.y_not_x_desc': 'things that are y but not x (bottom-left)',
    'learn.neither_desc': 'things that are neither x nor y (bottom-right)',
    'learn.try_it': 'Try it yourself!',
    'learn.biliteral_instructions': 'Click on cells to place counters. Red counters (●) mean "something exists here". Grey counters with ✕ mean "this cell is empty".',
    'learn.representing': 'Representing Propositions',
    'learn.prop_a': 'A: "All x are y"',
    'learn.prop_a_desc': 'Mark the xy\' cell as empty (nothing is x without being y).',
    'learn.prop_e': 'E: "No x are y"',
    'learn.prop_e_desc': 'Mark the xy cell as empty (nothing is both x and y).',
    'learn.prop_i': 'I: "Some x are y"',
    'learn.prop_i_desc': 'Place a red counter in the xy cell (something exists there).',
    'learn.prop_o': 'O: "Some x are not y"',
    'learn.prop_o_desc': 'Place a red counter in the x\'y cell (something exists there).',
    'learn.ch3_title': '3. Syllogisms',
    'learn.ch3_lesson1_title': 'What is a Syllogism?',
    'learn.ch3_lesson1_p1': 'A <strong>Syllogism</strong> is a form of reasoning where a conclusion is drawn from two given propositions (called <strong>Premises</strong>). The key is that the two premises share a common term — the <strong>Middle Term (m)</strong> — which disappears in the conclusion.',
    'learn.ch3_lesson1_example_major': 'All mammals have fur.',
    'learn.ch3_lesson1_example_minor': 'All dogs are mammals.',
    'learn.ch3_lesson1_example_conclusion': 'Therefore, all dogs have fur.',
    'learn.ch3_lesson1_minor_desc': 'The subject of the conclusion (dogs)',
    'learn.ch3_lesson1_major_desc': 'The predicate of the conclusion (have fur)',
    'learn.ch3_lesson1_middle_desc': 'Appears in both premises but not conclusion (mammals)',
    'learn.ch3_lesson2_title': 'The Triliteral Diagram',
    'learn.ch3_lesson2_p1': 'The <strong>Triliteral Diagram</strong> extends the Biliteral Diagram to handle three terms (x, y, m). It adds a circle representing the middle term m, creating 8 cells instead of 4.',
    'learn.ch3_lesson2_p2': 'The circle divides the square into:',
    'learn.inside_circle': 'Inside the circle (m)',
    'learn.inside_desc': 'things that have attribute m',
    'learn.outside_circle': 'Outside the circle (m\')',
    'learn.outside_desc': 'things that don\'t have attribute m',
    'learn.ch3_lesson2_p3': 'Combined with the x and y divisions, this gives us 8 cells to represent all combinations of x, y, and m.',
    'learn.try_triliteral': 'Try the Triliteral Diagram!',
    'learn.triliteral_instructions': 'Click cells to place counters. The dashed circle represents the middle term m.',
    'learn.how_it_works': 'How it works:',
    'learn.ch3_lesson2_how': 'To solve a syllogism, we mark both premises on the Triliteral Diagram, then "read off" the conclusion by ignoring the m circle and looking only at the x/y relationships that remain.',
    'learn.ch3_lesson3_title': 'Solving Syllogisms',
    'learn.ch3_lesson3_p1': 'Carroll\'s method for solving syllogisms involves three steps:',
    'learn.step1_mark': 'Mark the Premises',
    'learn.step1_mark_desc': 'Transfer both premises onto the Triliteral Diagram. Universal propositions (A, E) get grey counters (empty). Particular propositions (I, O) get red counters (occupied).',
    'learn.step1_mark_example': '"All m are y" → Mark m\'y cells as empty\n"All x are m" → Mark xm\' cells as empty',
    'learn.step2_transfer': 'Transfer to Biliteral',
    'learn.step2_transfer_desc': 'Copy the information from the Triliteral Diagram to the Biliteral Diagram, ignoring the m circle. If a cell is marked in both m and m\' portions, it\'s definitely marked.',
    'learn.rule': 'Rule',
    'learn.step2_rule': 'If any sub-cell is empty, the whole cell is empty.\nIf any sub-cell has a red counter, transfer it.',
    'learn.step3_read': 'Read the Conclusion',
    'learn.step3_read_desc': 'Interpret the Biliteral Diagram to get the conclusion in terms of x and y.',
    'learn.if_xy_empty': "If xy' is empty",
    'learn.all_x_are_y': '"All x are y"',
    'learn.if_xy_empty2': 'If xy is empty',
    'learn.no_x_are_y': '"No x are y"',
    'learn.if_xy_counter': 'If xy has a counter',
    'learn.some_x_are_y': '"Some x are y"',
    'learn.if_x_y_counter': "If x'y has a counter",
    'learn.some_x_not_y': '"Some x are not y"',
    'learn.examples': 'Examples',
    'learn.things': 'Things',
    'learn.attributes': 'Attributes',
    'learn.cats': 'Cats',
    'learn.books': 'Books',
    'learn.students': 'Students',
    'learn.apples': 'Apples',
    'learn.furry': 'furry',
    'learn.interesting': 'interesting',
    'learn.diligent': 'diligent',
    'learn.red': 'red',
    'learn.minor_term_x': 'Minor Term (x)',
    'learn.major_term_y': 'Major Term (y)',
    'learn.middle_term_m': 'Middle Term (m)',
    'learn.example': 'Example',
    'learn.major_premise': 'Major Premise',
    'learn.minor_premise': 'Minor Premise',
    'learn.conclusion': 'Conclusion',
    'learn.page_title': 'Learning Symbolic Logic',
    'learn.page_subtitle': 'Based on Lewis Carroll\'s "Symbolic Logic" — A step-by-step journey from things to syllogisms',
    'learn.interactive_guide': 'Interactive Guide',
    'learn.lessons': 'Lessons',
    'learn.next': 'Next',
    // Footer
    'footer.copyright': '© {year} Lewis Carroll Logic Game. Learn logic through interactive diagrams.',
    // Home page (used by components)
    'home.code': 'Code:',
    'home.clear_board': 'Clear Board',
    'home.controls': 'Controls',
    'home.large_diagram': 'Large Diagram (Premises)',
    'home.small_diagram': 'Small Diagram (Conclusions)',
    'home.copy': 'Copy',
    'home.copied': 'Copied!',
    'home.copy_prefix': 'Is the following syllogism solved correctly:',
    'home.terms_label': 'Terms:',
    'home.solution_label': 'Solution:',
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
    // Atlas page
    'atlas.title': 'Syllogism Atlas',
    'atlas.subtitle': 'A comprehensive collection of the 24 standard valid syllogisms defined by figure and mood. Click any entry to solve its logical diagram.',
    'atlas.search_placeholder': 'Search by mood or mnemonic...',
    'atlas.figure': 'Figure',
    'atlas.syllogisms_count': '{count} SYLLOGISMS',
    'atlas.table.mood': 'Mood',
    'atlas.table.mnemonic': 'Mnemonic',
    'atlas.no_results': 'No syllogisms match your search in this figure.',
    'atlas.footer.label': 'Encyclopedic Data',
    'atlas.footer.quote': '"The logic of the world is prior to all truth and falsehood. It is the form of thought itself."',
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
    'nav.learn': 'Logikos mokykla',
    // Learn page
    'learn.ch1_title': '1. Dalykai ir savybės',
    'learn.ch1_lesson1_title': 'Kas yra dalykai?',
    'learn.ch1_lesson1_p1': 'Lewis Carrollo simbolinėje logikoje pradedame nuo paprasčiausių elementų: <strong>Dalykų</strong>. „Dalykas" gali būti bet kas, apie ką galite pagalvoti — gyvūnai, žmonės, daiktai ar net abstrakčios sąvokos.',
    'learn.ch1_lesson1_p2': 'Kiekvienas dalykas turi <strong>Savybių</strong> — kokybių ar charakteristikų, kurios jį apibūdina. Pavyzdžiui, „rožė" (dalykas) gali turėti tokių savybių kaip „raudona", „kvepianti" ar „graži".',
    'learn.ch1_lesson1_quote': '"Diskurso visata yra dalykų klasė, apie kurią kalbame bet kuriuo metu."',
    'learn.ch1_lesson2_title': 'Klasifikacija',
    'learn.ch1_lesson2_p1': '<strong>Klasifikacija</strong> – tai procesas, kurio metu dalykai skirstomi į grupes (vadinamas <strong>Klasėmis</strong>) pagal jų savybes. Klasifikuodami sukuriame <strong>Gentį</strong> (didesnę klasę) ir padalijame ją į <strong>Rūšis</strong> (mažesnes klases) naudodami <strong>Skirtumą</strong> (skiriamąją savybę).',
    'learn.ch1_lesson2_how': 'Kaip veikia klasifikacija',
    'learn.step1_title': 'Pradėkite nuo genties',
    'learn.step1_desc': 'Pavyzdys: „Gyvūnai"',
    'learn.step2_title': 'Pasirinkite skirtumą',
    'learn.step2_desc': 'Pavyzdys: „turi kailį"',
    'learn.step3_title': 'Sukurkite dvi rūšis',
    'learn.step3_desc': '„Gyvūnai su kailiu" ir „Gyvūnai be kailio"',
    'learn.key_insight': 'Esminė įžvalga:',
    'learn.ch1_lesson2_insight': 'Kiekviena klasifikacija sukuria dvi papildomas klases. Jei padalijame „Gyvūnus" pagal savybę „turi kailį", gauname tiek „kailinius gyvūnus", tiek „nekailinius gyvūnus" — kartu jie sudaro visą visatą.',
    'learn.ch2_title': '2. Teiginiai',
    'learn.ch2_lesson1_title': 'Kas yra teiginys?',
    'learn.ch2_lesson1_p1': '<strong>Teiginys</strong> yra teiginys, kuris teigia ryšį tarp dviejų klasių: <strong>Veiksnio</strong> ir <strong>Tarinio</strong>. Carrollas išskyrė keturis teiginių tipus, tradiciškai žymimus A, E, I ir O.',
    'learn.ch2_lesson2_title': 'Dviejų raidžių diagrama',
    'learn.ch2_lesson2_p1': '<strong>Dviejų raidžių diagrama</strong> – tai Carrollio metodas, skirtas vaizduoti teiginius apie du terminus (x ir y). Ji padalija kvadratą į keturias korteles, vaizduojančias visas galimas kombinacijas:',
    'learn.xy_desc': 'dalykai, kurie yra ir x, ir y (viršuje-kairėje)',
    'learn.xy_not_y_desc': 'dalykai, kurie yra x, bet ne y (viršuje-dešinėje)',
    'learn.y_not_x_desc': 'dalykai, kurie yra y, bet ne x (apačioje-kairėje)',
    'learn.neither_desc': 'dalykai, kurie nėra nei x, nei y (apačioje-dešinėje)',
    'learn.try_it': 'Išbandykite patys!',
    'learn.biliteral_instructions': 'Spustelėkite korteles, kad padėtumėte žetonus. Raudoni žetonai (●) reiškia „čia kažkas egzistuoja". Pilki žetonai su ✕ reiškia „ši kortelė tuščia".',
    'learn.representing': 'Teiginių vaizdavimas',
    'learn.prop_a': 'A: „Visi x yra y"',
    'learn.prop_a_desc': 'Pažymėkite xy\' kortelę kaip tuščią (niekas nėra x be y).',
    'learn.prop_e': 'E: „Joks x nėra y"',
    'learn.prop_e_desc': 'Pažymėkite xy kortelę kaip tuščią (niekas nėra kartu x ir y).',
    'learn.prop_i': 'I: „Kai kurie x yra y"',
    'learn.prop_i_desc': 'Padėkite raudoną žetoną xy kortelėje (ten kažkas egzistuoja).',
    'learn.prop_o': 'O: „Kai kurie x nėra y"',
    'learn.prop_o_desc': 'Padėkite raudoną žetoną x\'y kortelėje (ten kažkas egzistuoja).',
    'learn.ch3_title': '3. Silogizmai',
    'learn.ch3_lesson1_title': 'Kas yra silogizmas?',
    'learn.ch3_lesson1_p1': '<strong>Silogizmas</strong> – tai samprotavimo forma, kurioje išvada daroma iš dviejų pateiktų teiginių (vadinamų <strong>Prielaidomis</strong>). Esminis dalykas yra tai, kad abi prielaidos turi bendrą terminą – <strong>Vidurinį terminą (m)</strong> – kuris išvadoje išnyksta.',
    'learn.ch3_lesson1_example_major': 'Visi žinduoliai turi kailį.',
    'learn.ch3_lesson1_example_minor': 'Visi šunys yra žinduoliai.',
    'learn.ch3_lesson1_example_conclusion': 'Todėl visi šunys turi kailį.',
    'learn.ch3_lesson1_minor_desc': 'Išvados veiksnys (šunys)',
    'learn.ch3_lesson1_major_desc': 'Išvados tarinis (turi kailį)',
    'learn.ch3_lesson1_middle_desc': 'Atsiranda abiejose prielaidose, bet ne išvadoje (žinduoliai)',
    'learn.ch3_lesson2_title': 'Trijų raidžių diagrama',
    'learn.ch3_lesson2_p1': '<strong>Trijų raidžių diagrama</strong> praplečia dviejų raidžių diagramą, kad apimtų tris terminus (x, y, m). Ji prideda apskritimą, vaizduojantį vidurinį terminą m, sukuriantį 8 korteles vietoj 4.',
    'learn.ch3_lesson2_p2': 'Apskritimas padalija kvadratą į:',
    'learn.inside_circle': 'Viduje apskritimo (m)',
    'learn.inside_desc': 'dalykai, turintys savybę m',
    'learn.outside_circle': 'Išorėje apskritimo (m\')',
    'learn.outside_desc': 'dalykai, neturintys savybės m',
    'learn.ch3_lesson2_p3': 'Kartu su x ir y padalijimais tai suteikia 8 korteles, vaizduojančias visas x, y ir m kombinacijas.',
    'learn.try_triliteral': 'Išbandykite trijų raidžių diagramą!',
    'learn.triliteral_instructions': 'Spustelėkite korteles, kad padėtumėte žetonus. Brūkšninis apskritimas vaizduoja vidurinį terminą m.',
    'learn.how_it_works': 'Kaip tai veikia:',
    'learn.ch3_lesson2_how': 'Norėdami išspręsti silogizmą, pažymime abi prielaidas trijų raidžių diagramoje, tada „nuskaitome" išvadą ignoruodami m apskritimą ir žiūrėdami tik į x/y ryšius, kurie lieka.',
    'learn.ch3_lesson3_title': 'Silogizmų sprendimas',
    'learn.ch3_lesson3_p1': 'Carrollo silogizmų sprendimo metodas susideda iš trijų žingsnių:',
    'learn.step1_mark': 'Pažymėkite prielaidas',
    'learn.step1_mark_desc': 'Perkelkite abi prielaidas į trijų raidžių diagramą. Universalūs teiginiai (A, E) gauna pilkus žetonus (tuščia). Daliniai teiginiai (I, O) gauna raudonus žetonus (užimta).',
    'learn.step1_mark_example': '„Visi m yra y" → Pažymėkite m\'y korteles kaip tuščias\n„Visi x yra m" → Pažymėkite xm\' korteles kaip tuščias',
    'learn.step2_transfer': 'Perkelkite į dviejų raidžių',
    'learn.step2_transfer_desc': 'Nukopijuokite informaciją iš trijų raidžių diagramos į dviejų raidžių diagramą, ignoruodami m apskritimą. Jei kortelė pažymėta tiek m, tiek m\' dalyse, ji tikrai pažymėta.',
    'learn.rule': 'Taisyklė',
    'learn.step2_rule': 'Jei bet kuri pokortelė yra tuščia, visa kortelė tuščia.\nJei bet kuri pokortelė turi raudoną žetoną, perkelkite jį.',
    'learn.step3_read': 'Skaitykite išvadą',
    'learn.step3_read_desc': 'Interpretuokite dviejų raidžių diagramą, kad gautumėte išvadą x ir y terminais.',
    'learn.if_xy_empty': "Jei xy' tuščia",
    'learn.all_x_are_y': '„Visi x yra y"',
    'learn.if_xy_empty2': 'Jei xy tuščia',
    'learn.no_x_are_y': '„Joks x nėra y"',
    'learn.if_xy_counter': 'Jei xy turi žetoną',
    'learn.some_x_are_y': '„Kai kurie x yra y"',
    'learn.if_x_y_counter': "Jei x'y turi žetoną",
    'learn.some_x_not_y': '„Kai kurie x nėra y"',
    'learn.examples': 'Pavyzdžiai',
    'learn.things': 'Dalykai',
    'learn.attributes': 'Savybės',
    'learn.cats': 'Katės',
    'learn.books': 'Knygos',
    'learn.students': 'Studentai',
    'learn.apples': 'Obuoliai',
    'learn.furry': 'kailinis',
    'learn.interesting': 'įdomus',
    'learn.diligent': 'darbštus',
    'learn.red': 'raudonas',
    'learn.minor_term_x': 'Mažasis terminas (x)',
    'learn.major_term_y': 'Didysis terminas (y)',
    'learn.middle_term_m': 'Vidurinysis terminas (m)',
    'learn.example': 'Pavyzdys',
    'learn.major_premise': 'Didžioji prielaida',
    'learn.minor_premise': 'Mažoji prielaida',
    'learn.conclusion': 'Išvada',
    'learn.page_title': 'Mokomasi simbolinės logikos',
    'learn.page_subtitle': 'Pagal Lewis Carrollo „Simbolinę logiką" – žingsnis po žingsnio kelionė nuo dalykų iki silogizmų',
    'learn.interactive_guide': 'Interaktyvus vadovas',
    'learn.lessons': 'Pamokos',
    'learn.next': 'Toliau',
    // Footer
    'footer.copyright': '© {year} Lewis Carroll logikos žaidimas. Mokykitės logikos per interaktyvias diagramas.',
    // Home page (used by components)
    'home.code': 'Kodas:',
    'home.clear_board': 'Išvalyti viską',
    'home.controls': 'Valdymas',
    'home.large_diagram': 'Didžioji diagrama (Prielaidos)',
    'home.small_diagram': 'Mažoji diagrama (Išvados)',
    'home.copy': 'Kopijuoti',
    'home.copied': 'Nukopijuota!',
    'home.copy_prefix': 'Ar teisingai išspręstas šis silogizmas:',
    'home.terms_label': 'Terminai:',
    'home.solution_label': 'Sprendimas:',
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
    // Atlas page
    'atlas.title': 'Silogizmų Atlasas',
    'atlas.subtitle': 'Išsami 24 standartinių validžių silogizmų kolekcija, apibrėžta pagal figūrą ir nuotaiką. Spustelėkite bet kurį įrašą, kad išspręstumėte jo loginę diagramą.',
    'atlas.search_placeholder': 'Ieškoti pagal nuotaiką ar mnemoniką...',
    'atlas.figure': 'Figūra',
    'atlas.syllogisms_count': '{count} SILOGIZMAI',
    'atlas.table.mood': 'Nuotaika',
    'atlas.table.mnemonic': 'Mnemonika',
    'atlas.no_results': 'Jūsų paieškai šioje figūroje neatitinka joks silogizmas.',
    'atlas.footer.label': 'Enciklopediniai duomenys',
    'atlas.footer.quote': '"Pasaulio logika yra prieš bet kokią tiesą ir melą. Ji yra pati minties forma."',
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
