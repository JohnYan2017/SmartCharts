/**
 * Font Awesome 类名 → Emoji 映射（App 端不支持 Web 字体，用 Emoji 替代）
 * 完整覆盖 SmartChart 后端 smtindex.js 中的图标列表
 */
const FA_EMOJI_MAP = {
  // 图表
  'fa-chart-pie': '🥧', 'fa-chart-line': '📈', 'fa-chart-bar': '📊',
  'fa-chart-area': '📉', 'fa-chalkboard': '📋', 'fa-wave-square': '〰️',
  'fa-grip-lines': '≡', 'fa-circle-nodes': '🔗', 'fa-square-poll-vertical': '📊',
  // 连接/开发
  'fa-connectdevelop': '🔀', 'fa-hornbill': '🐦', 'fa-braille': '⠿',
  'fa-project-diagram': '🕸', 'fa-map-marked-alt': '🗺',
  // 文件/财务
  'fa-file-invoice-dollar': '💵', 'fa-clipboard-list': '📋',
  'fa-table': '📋', 'fa-file-alt': '📄', 'fa-calendar-check': '📅',
  'fa-boxes': '📦', 'fa-truck-moving': '🚚',
  // 用户/商业
  'fa-users': '👥', 'fa-store': '🏪', 'fa-database': '🗄',
  'fa-server': '🖥', 'fa-desktop': '🖥', 'fa-tv': '📺',
  // 文件夹
  'fa-folder': '📁', 'fa-folder-open': '📂', 'fa-folder-blank': '📁',
  'fa-folder-minus': '📁', 'fa-folder-plus': '📁', 'fa-folder-tree': '🗂',
  // 文件类型
  'fa-file': '📄', 'fa-file-lines': '📄', 'fa-file-pdf': '📕',
  'fa-file-excel': '📗', 'fa-file-csv': '📗', 'fa-file-image': '🖼',
  'fa-file-arrow-down': '📥', 'fa-file-arrow-up': '📤', 'fa-file-audio': '🎵',
  'fa-file-code': '💻', 'fa-file-contract': '📝', 'fa-file-export': '📤',
  'fa-file-import': '📥', 'fa-file-medical': '🏥', 'fa-file-powerpoint': '📙',
  'fa-file-shield': '🛡', 'fa-file-video': '📹', 'fa-file-word': '📘',
  'fa-file-zipper': '📦',
  // 建筑/地点
  'fa-building': '🏢', 'fa-globe-americas': '🌎', 'fa-home': '🏠',
  'fa-hospital': '🏥', 'fa-school': '🏫', 'fa-industry': '🏭',
  'fa-hotel': '🏨', 'fa-church': '⛪', 'fa-city': '🏙',
  'fa-gopuram': '🏛', 'fa-kaaba': '🕋', 'fa-mosque': '🕌',
  'fa-synagogue': '🕍', 'fa-place-of-worship': '🛐', 'fa-monument': '🏛',
  'fa-landmark': '🏛',
  // 搜索/设置/过滤
  'fa-search': '🔍', 'fa-cog': '⚙️', 'fa-cogs': '⚙️',
  'fa-gear': '⚙️', 'fa-filter': '🔽',
  // 时间/通知
  'fa-calendar': '📅', 'fa-clock': '🕐', 'fa-bell': '🔔',
  'fa-flag': '🚩', 'fa-star': '⭐', 'fa-star-half-alt': '⭐',
  // 操作
  'fa-print': '🖨', 'fa-download': '⬇️', 'fa-upload': '⬆️',
  'fa-envelope': '📧', 'fa-comment': '💬', 'fa-paper-plane': '✈️',
  'fa-share': '📤', 'fa-share-nodes': '🔗', 'fa-location-arrow': '📍',
  'fa-bullhorn': '📢', 'fa-rss': '📰', 'fa-inbox': '📥',
  // 文档/编辑
  'fa-book': '📖', 'fa-bookmark': '🔖', 'fa-book-open': '📖',
  'fa-address-book': '📒', 'fa-book-atlas': '📖', 'fa-book-bible': '📖',
  'fa-book-medical': '📖', 'fa-book-open-reader': '📖', 'fa-book-quran': '📖',
  'fa-book-skull': '📖', 'fa-scroll': '📜',
  'fa-pen': '✏️', 'fa-pen-clip': '✏️', 'fa-pen-fancy': '✏️',
  'fa-pen-nib': '✏️', 'fa-pen-ruler': '📐', 'fa-pen-to-square': '✏️',
  'fa-pencil': '✏️', 'fa-pencil-alt': '✏️', 'fa-pencil-ruler': '📐',
  'fa-ruler': '📏', 'fa-ruler-combined': '📏', 'fa-ruler-horizontal': '📏',
  'fa-ruler-vertical': '📏',
  'fa-copy': '📋', 'fa-note-sticky': '📝', 'fa-paste': '📋',
  // 人员/安全
  'fa-user': '👤', 'fa-key': '🔑', 'fa-shield-alt': '🛡',
  'fa-lock': '🔒', 'fa-eye': '👁', 'fa-id-card': '🪪',
  'fa-id-badge': '🪪', 'fa-passport': '🛂',
  // 形状/容器
  'fa-cube': '📦', 'fa-cubes': '📦', 'fa-box': '📦',
  'fa-warehouse': '🏭', 'fa-truck': '🚚', 'fa-shopping-cart': '🛒',
  'fa-credit-card': '💳', 'fa-money-bill': '💵', 'fa-calculator': '🧮',
  'fa-percentage': '%', 'fa-signal': '📶',
  // 硬件/科技
  'fa-microchip': '🔲', 'fa-memory': '💾', 'fa-hard-drive': '💾',
  'fa-laptop': '💻', 'fa-mobile-alt': '📱', 'fa-mobile': '📱',
  'fa-tablet': '📱', 'fa-tablet-alt': '📱',
  'fa-wifi': '📶', 'fa-satellite-dish': '📡', 'fa-broadcast-tower': '📻',
  'fa-globe': '🌐', 'fa-map': '🗺', 'fa-route': '🛣',
  'fa-location-dot': '📍', 'fa-compass': '🧭',
  'fa-plug': '🔌', 'fa-sd-card': '💾', 'fa-sim-card': '💳',
  'fa-usb': '🔌', 'fa-keyboard': '⌨️', 'fa-computer-mouse': '🖱',
  'fa-computer': '🖥',
  // 任务/列表
  'fa-tasks': '✅', 'fa-clipboard': '📋', 'fa-clipboard-check': '✅',
  'fa-list': '📋', 'fa-list-alt': '📋', 'fa-check-square': '✅',
  'fa-square': '⬜',
  // 奖励
  'fa-trophy': '🏆', 'fa-medal': '🏅', 'fa-award': '🏅',
  'fa-certificate': '📜',
  // 社交/表情
  'fa-heart': '❤️', 'fa-thumbs-up': '👍', 'fa-thumbs-down': '👎',
  'fa-fire': '🔥', 'fa-bolt': '⚡', 'fa-gem': '💎',
  'fa-magic': '✨', 'fa-wand-magic-sparkles': '✨', 'fa-wand-magic': '✨',
  'fa-wand-sparkles': '✨',
  // 趣味
  'fa-robot': '🤖', 'fa-puzzle-piece': '🧩', 'fa-gamepad': '🎮',
  'fa-chess': '♟', 'fa-hat-wizard': '🧙', 'fa-mask': '🎭',
  'fa-shapes': '🔷',
  // 媒体
  'fa-image': '🖼', 'fa-photo-film': '🎞', 'fa-camera': '📷',
  'fa-video': '📹', 'fa-music': '🎵', 'fa-headphones': '🎧',
  'fa-microphone': '🎤', 'fa-volume-up': '🔊', 'fa-film': '🎬',
  'fa-newspaper': '📰',
  // 自然/天气
  'fa-umbrella': '☂️', 'fa-sun': '☀️', 'fa-moon': '🌙',
  'fa-cloud': '☁️', 'fa-cloud-sun': '⛅', 'fa-cloud-moon-rain': '🌧',
  'fa-snowflake': '❄️', 'fa-temperature-full': '🌡', 'fa-temperature-half': '🌡',
  'fa-wind': '💨', 'fa-water': '💧', 'fa-mountain': '⛰',
  'fa-tree': '🌳', 'fa-leaf': '🍃',
  // 动物
  'fa-paw': '🐾', 'fa-fish': '🐟', 'fa-feather': '🪶',
  // 科学
  'fa-biohazard': '☣️', 'fa-dna': '🧬', 'fa-atom': '⚛️',
  'fa-magnet': '🧲', 'fa-brain': '🧠',
  // 工具/杂项
  'fa-broom': '🧹', 'fa-syringe': '💉', 'fa-pills': '💊',
  'fa-stethoscope': '🩺', 'fa-bed': '🛏', 'fa-couch': '🛋',
  'fa-chair': '🪑', 'fa-fan': '🌀',
  // UI 控件
  'fa-eye-low-vision': '👁', 'fa-binoculars': '🔭', 'fa-glasses': '👓',
  'fa-table-cells': '📋', 'fa-table-columns': '📋',
  'fa-arrows-up-down-left-right': '↕', 'fa-up-down': '↕',
  'fa-left-right': '↔', 'fa-up-right-and-down-left-from-center': '⛶',
  'fa-expand-alt': '⛶',
  // 人物
  'fa-person': '🧑', 'fa-person-dress': '👗', 'fa-person-half-dress': '🧑',
  'fa-person-walking': '🚶', 'fa-person-running': '🏃',
  'fa-baby': '👶', 'fa-children': '👨‍👩‍👧',
  // 通讯
  'fa-phone': '📞', 'fa-phone-flip': '📞', 'fa-phone-volume': '📞',
  'fa-fax': '📠',
  // 几何/状态
  'fa-circle': '⭕', 'fa-circle-dot': '◉', 'fa-circle-plus': '⊕',
  'fa-circle-minus': '⊖', 'fa-circle-xmark': '❌', 'fa-circle-check': '✅',
  'fa-circle-question': '❓', 'fa-circle-exclamation': '❗',
  'fa-circle-info': 'ℹ️', 'fa-circle-notch': '◌',
  'fa-square-plus': '➕', 'fa-square-minus': '➖',
  'fa-square-check': '✅', 'fa-square-xmark': '❌',
  // 方向箭头
  'fa-caret-up': '▲', 'fa-caret-down': '▼',
  'fa-caret-left': '◀', 'fa-caret-right': '▶',
  'fa-caret-square-up': '▲', 'fa-caret-square-down': '▼',
  'fa-chevron-up': '‹', 'fa-chevron-down': '›',
  'fa-chevron-left': '‹', 'fa-chevron-right': '›',
  // 教育
  'fa-graduation-cap': '🎓', 'fa-torah': '📜',
  // 图表辅助
  'fa-diagram-next': '📊', 'fa-diagram-predecessor': '📊',
  'fa-diagram-project': '🕸',
}

export function faIconToEmoji(iconStr) {
  if (!iconStr) return ''
  // 已经是 emoji（不含 fa- 前缀）直接返回
  if (!iconStr.includes('fa-')) return iconStr
  const parts = iconStr.split(/\s+/)
  const emoji = FA_EMOJI_MAP[parts[1]]
  if (emoji) return emoji
  return '' // 未配置的图标不显示
}
