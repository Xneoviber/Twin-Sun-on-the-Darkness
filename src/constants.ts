import { Scene, GameFlags } from './types';

export const BACKGROUNDS: Record<string, string> = {
  bedroom: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  morning: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  city: "https://images.pexels.com/photos/313782/pexels-photo-313782.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  car: "https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  classroom: "https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  clubroom: "https://images.pexels.com/photos/159211/head-office-office-design-office-design-159211.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  darkroom: "https://images.pexels.com/photos/262333/pexels-photo-262333.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
};

export const INITIAL_FLAGS: GameFlags = {
  yukaSuspicious: false,
  yukiDominant: false,
  confrontation: false,
  yukaKnows: false,
  roadheadKnown: false,
  endingReached: false
};

export const SCENES: Record<string, Scene> = {
  start: {
    id: "start",
    background: "morning",
    speaker: "Narator",
    dialogue: "Pagi itu di rumah Liu, Yuka turun lebih dulu. Tubuh Yuki masih lemas, jalannya pincang samar. Ada keanehan yang menggelitik naluri Yuka. Cinta yang selama ini ia jaga mulai terasa rapuh...",
    choices: [
      { text: "🎭 Tanya Yuki kenapa jalannya aneh", nextScene: "ask_yuki", effects: (f) => f.yukaSuspicious = true },
      { text: "🌙 Abaikan, mungkin hanya capek", nextScene: "ignore_signs", effects: (f) => f.yukaSuspicious = false }
    ]
  },
  ask_yuki: {
    id: "ask_yuki",
    background: "morning",
    speaker: "Yuka",
    dialogue: "“Yuki, kamu sakit? Kakimu kenapa?” Yuki tersenyum sedikit gugup, “Ah, nggak apa-apa Kak, semalam tidur salah posisi.” Tapi senyumnya terasa terlalu puas, seperti habis sesuatu.",
    choices: [
      { text: "👁️ Perhatikan lebih teliti", nextScene: "noticing_details", effects: (f) => f.yukaSuspicious = true },
      { text: "😔 Diam saja, percaya begitu", nextScene: "blind_trust", effects: (f) => f.yukaSuspicious = false }
    ]
  },
  noticing_details: {
    id: "noticing_details",
    background: "bedroom",
    speaker: "Yuka",
    dialogue: "Yuka melihat bercak merah samar di leher Yuki. Juga cara Yuki duduk dengan gelisah. Jantungnya berdegup keras. *Itu bekas ciuman...* Tapi ia masih belum yakin.",
    choices: [
      { text: "🔍 Mengintip HP Shun nanti malam", nextScene: "digital_clue", effects: (f) => f.yukaKnows = true },
      { text: "💔 Menangis dalam hati, biarkan waktu bicara", nextScene: "silent_suffering", effects: (f) => f.yukaKnows = false }
    ]
  },
  digital_clue: {
    id: "digital_clue",
    background: "darkroom",
    speaker: "Yuka",
    dialogue: "Malam itu Yuka melihat pesan di HP Shun yang tertinggal. Foto-foto, chat mesra dengan Yuki. *“Rasanya masih nempel di badan…”* Dunianya runtuh. Perselingkuhan nyata. Tapi rasa cintanya belum hilang.",
    choices: [
      { text: "💢 Konfrontasi langsung ke Shun", nextScene: "confront_shun", effects: (f) => f.confrontation = true },
      { text: "🥀 Diam dan rencanakan balas dendam dingin", nextScene: "cold_revenge", effects: (f) => f.confrontation = false }
    ]
  },
  confront_shun: {
    id: "confront_shun",
    background: "city",
    speaker: "Yuka",
    dialogue: "Yuka menatap Shun dengan mata basah. “Kamu tidur dengan Yuki?” Shun diam, lalu mengakui. “Maaf... aku terjebak di antara kalian.” Tapi Yuka tahu, dia sudah kehilangan.",
    choices: [
      { text: "💔 Akhiri hubungan, pergi meninggalkan", nextScene: "ending_broken", effects: (f) => f.endingReached = true },
      { text: "🔥 Aku tetap ingin kamu, tapi syaratku", nextScene: "ending_dark_compromise", effects: (f) => f.endingReached = true }
    ]
  },
  cold_revenge: {
    id: "cold_revenge",
    background: "clubroom",
    speaker: "Narator",
    dialogue: "Yuka berpura-pura tidak tahu, tapi diam-diam ia mengumpulkan bukti. Suatu hari ia akan menghancurkan kepercayaan mereka. Namun di sisi lain, Yuki semakin berani, bahkan di mobil...",
    choices: [
      { text: "🚗 Lihat adegan Yuki & Shun di mobil (dewasa)", nextScene: "roadhead_scene", effects: (f) => f.roadheadKnown = true },
      { text: "😶 Biarkan semuanya berjalan, hancur perlahan", nextScene: "ending_slow_decay", effects: (f) => f.endingReached = true }
    ]
  },
  roadhead_scene: {
    id: "roadhead_scene",
    background: "car",
    speaker: "Narator",
    dialogue: "Yuki membungkuk di kursi penumpang. Jalan tol Shanghai ramai, tetapi nafsu mereka buta. “Yuki… ini gila…” suara Shun parau. Dia tidak bisa berhenti. Setelah itu, Yuki menjilat bibir dengan senyum penuh kemenangan. Kegilaan yang tak terbendung.",
    choices: [
      { text: "🎥 Yuka merekam dari parkiran (akhir eksplosif)", nextScene: "ending_exposure", effects: (f) => f.endingReached = true },
      { text: "😰 Menangis sendirian, memilih diam selamanya", nextScene: "ending_tragic_silence", effects: (f) => f.endingReached = true }
    ]
  },
  ignore_signs: {
    id: "ignore_signs",
    background: "morning",
    speaker: "Yuka",
    dialogue: "Yuka mengabaikan firasatnya. Ia memilih percaya Shun masih setia. Namun malam-malam berikutnya, Yuki semakin sering ‘rapat klub’ dan pulang dengan glowing berlebihan.",
    choices: [
      { text: "😭 Akhirnya sadar setelah lihat langsung", nextScene: "digital_clue", effects: (f) => f.yukaKnows = true },
      { text: "🤝 Bertahan dengan kepura-puraan", nextScene: "ending_fake_happiness", effects: (f) => f.endingReached = true }
    ]
  },
  blind_trust: {
    id: "blind_trust",
    background: "morning",
    speaker: "Yuka",
    dialogue: "Hari berlalu, Yuka tetap tersenyum di depan Shun. Tapi di dalam hatinya luka menganga. Suatu hari ia melihat langsung Yuki dan Shun berciuman di klub. Semua ilusi runtuh.",
    choices: [
      { text: "💔 Akhiri semua dengan tangis", nextScene: "ending_broken", effects: (f) => f.endingReached = true }
    ]
  },
  silent_suffering: {
    id: "silent_suffering",
    background: "bedroom",
    speaker: "Yuka",
    dialogue: "Yuka memilih diam, menerima penderitaan. Ia tetap di sisi Shun meskipun tahu ia berbagi cinta dengan adiknya. Cinta yang sakit namun tak bisa dilepaskan. Malam-malam dipenuhi air mata.",
    choices: [
      { text: "🖤 Terus bertahan dalam kebohongan", nextScene: "ending_masochist", effects: (f) => f.endingReached = true }
    ]
  },
  ending_broken: {
    id: "ending_broken",
    background: "city",
    speaker: "END",
    dialogue: "Yuka pergi dari kehidupan Shun. Dia meninggalkan Shanghai untuk kuliah di luar negeri. Shun dan Yuki akhirnya terbuka, tapi hubungan mereka dibayangi rasa bersalah. Yuka menyimpan luka, namun perlahan menemukan jati diri baru. [Ending: Luka yang Membebaskan]",
    choices: []
  },
  ending_dark_compromise: {
    id: "ending_dark_compromise",
    background: "darkroom",
    speaker: "END",
    dialogue: "Yuka memilih tetap bersama Shun dengan syarat dia boleh memiliki ‘kekasih lain’. Hubungan jadi poliamori yang kelam. Yuki tersenyum puas, karena ia tetap mendapat Shun. Tiga hati yang hancur dalam ikatan sesat. [Ending: Kompromi Beracun]",
    choices: []
  },
  ending_slow_decay: {
    id: "ending_slow_decay",
    background: "city",
    speaker: "END",
    dialogue: "Waktu berlalu, Yuka perlahan mati rasa. Shun tetap terbelah, Yuki semakin dominan. Mereka bertiga hidup dalam kebohongan yang rumit sampai suatu hari Yuka tak lagi mampu merasakan apa pun. [Ending: Hampa]",
    choices: []
  },
  ending_exposure: {
    id: "ending_exposure",
    background: "classroom",
    speaker: "Narator",
    dialogue: "Dengan bukti video, Yuka mengungkap semua ke publik dan keluarga. Skandal hancurkan reputasi Shun, Yuki dikucilkan. Shun kehilangan segalanya. Aya dari Tokyo datang dengan senyum berbahaya, menawarkan ‘tempat’ untuk Shun. Akhir yang lebih gelap dimulai. [Ending: Api Pembalasan]",
    choices: []
  },
  ending_tragic_silence: {
    id: "ending_tragic_silence",
    background: "bedroom",
    speaker: "Yuka",
    dialogue: "Yuka memendam rahasia selamanya. Ia melihat Shun dan Yuki semakin liar, bahkan Yuki hamil. Yuka bunuh diri dalam diam. Cerita berakhir dengan duka tak bertepi. [Ending Tragis]",
    choices: []
  },
  ending_fake_happiness: {
    id: "ending_fake_happiness",
    background: "morning",
    speaker: "Yuka",
    dialogue: "Yuka berpura-pura bahagia. Shun tetap bersama Yuki di belakang, tapi Yuka pura-pura tidak tahu demi menjaga keluarga. Senyum palsu menjadi tameng setiap hari. [Ending: Kebohongan Sempurna]",
    choices: []
  },
  ending_masochist: {
    id: "ending_masochist",
    background: "bedroom",
    speaker: "Yuka",
    dialogue: "Cinta yang menyakitkan menjadi candu. Yuka memilih tetap di samping Shun meskipun dia tahu setiap malam Shun pergi ke kamar Yuki. Hatinya mati perlahan, tapi ia tidak bisa melepaskan. [Ending: Pecandu Luka]",
    choices: []
  }
};
