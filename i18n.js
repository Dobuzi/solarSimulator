(function (root, factory) {
  const api = factory();
  root.I18n = api;
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
})(typeof self !== "undefined" ? self : this, function () {
  const translations = {
    en: {
      eyebrow: "Orbital Sandbox",
      title: "Solar System 3D",
      lead: "Rotate, pan, and zoom the live orbit map.",
      focusLabel: "Focus",
      simTimeLabel: "Sim Time",
      fpsLabel: "FPS",
      labelsToggle: "Labels",
      orbitsToggle: "Orbits",
      timeScale: "Time scale",
      orbitScale: "Orbit scale",
      focusPlanet: "Focus planet",
      calendarDate: "Calendar date",
      viewPoint: "View point",
      viewIso: "Isometric",
      viewTop: "Top",
      viewSide: "Side",
      cameraDistance: "Camera distance",
      pause: "Pause",
      resume: "Resume",
      resetView: "Reset view",
      hint: "Tip: drag to orbit the camera, right-drag to pan, and scroll to zoom.",
      settingsLabel: "Settings",
      daysUnit: "days",
      fpsUnit: "fps",
      planets: {
        Sun: "Sun",
        Mercury: "Mercury",
        Venus: "Venus",
        Earth: "Earth",
        Mars: "Mars",
        Jupiter: "Jupiter",
        Saturn: "Saturn",
        Uranus: "Uranus",
        Neptune: "Neptune",
        Moon: "Moon",
      },
    },
    ko: {
      eyebrow: "궤도 샌드박스",
      title: "태양계 3D",
      lead: "실시간 궤도 지도를 회전, 이동, 확대하세요.",
      focusLabel: "포커스",
      simTimeLabel: "시뮬 시간",
      fpsLabel: "FPS",
      labelsToggle: "라벨",
      orbitsToggle: "궤도",
      timeScale: "시간 배속",
      orbitScale: "궤도 스케일",
      focusPlanet: "포커스 행성",
      calendarDate: "달력 날짜",
      viewPoint: "뷰 포인트",
      viewIso: "아이소",
      viewTop: "탑",
      viewSide: "사이드",
      cameraDistance: "카메라 거리",
      pause: "일시정지",
      resume: "재생",
      resetView: "뷰 리셋",
      hint: "팁: 드래그로 회전, 오른쪽 드래그로 이동, 스크롤로 줌.",
      settingsLabel: "설정",
      daysUnit: "일",
      fpsUnit: "fps",
      planets: {
        Sun: "태양",
        Mercury: "수성",
        Venus: "금성",
        Earth: "지구",
        Mars: "화성",
        Jupiter: "목성",
        Saturn: "토성",
        Uranus: "천왕성",
        Neptune: "해왕성",
        Moon: "달",
      },
    },
  };

  function resolveLang(lang) {
    return translations[lang] ? lang : "en";
  }

  function detectLanguage(locale) {
    if (!locale) return "en";
    return locale.toLowerCase().startsWith("ko") ? "ko" : "en";
  }

  function t(key, lang) {
    const useLang = resolveLang(lang);
    return translations[useLang][key] || translations.en[key] || key;
  }

  function tPlanet(name, lang) {
    const useLang = resolveLang(lang);
    return translations[useLang].planets[name] || name;
  }

  return {
    translations,
    detectLanguage,
    t,
    tPlanet,
  };
});
