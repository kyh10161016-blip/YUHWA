/* =========================================================
   CARE LINK · 모바일 병원 케어 앱 · 인터랙션 스크립트
   순수 JavaScript · 더미 데이터 기반
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 더미 데이터 ---------- */
  const patients = [
    { id: 1, name: "이정호", room: "302호", init: "이", prio: "high",  status: "progress",
      note: "생체신호 변동으로 집중 관찰 중. 산소포화도 모니터링 유지.", owner: "김서연" },
    { id: 2, name: "최영자", room: "305호", init: "최", prio: "high",  status: "wait",
      note: "낙상 고위험군. 침상 난간 확인 및 야간 라운딩 강화 필요.", owner: "미배정" },
    { id: 3, name: "박민수", room: "301호", init: "박", prio: "mid",   status: "wait",
      note: "오전 공복 채혈 예정. 09:00 항생제 IV 투여 대기.", owner: "정하늘" },
    { id: 4, name: "정해나", room: "304호", init: "정", prio: "low",   status: "progress",
      note: "인슐린 투여 완료. 식후 혈당 재측정 예정.", owner: "김서연" },
    { id: 5, name: "한지우", room: "308호", init: "한", prio: "low",   status: "done",
      note: "흉부 X-ray 검사 완료. 결과 정상, 경과 관찰.", owner: "정하늘" },
    { id: 6, name: "오세훈", room: "310호", init: "오", prio: "mid",   status: "done",
      note: "수액 교체 완료. 잔량 점검 후 이상 없음.", owner: "김서연" }
  ];

  const requests = [
    { id: 1, name: "이정호", room: "302호", type: "emergency", time: "방금 전",
      content: "가슴 통증 호소, 즉시 확인 요청드립니다.", assigned: false, done: false },
    { id: 2, name: "최영자", room: "305호", type: "normal", time: "3분 전",
      content: "화장실 이동 도움이 필요합니다.", assigned: false, done: false },
    { id: 3, name: "박민수", room: "301호", type: "guide", time: "8분 전",
      content: "오전 채혈 검사 전 주의사항을 안내해 주세요.", assigned: false, done: false },
    { id: 4, name: "정해나", room: "304호", type: "normal", time: "12분 전",
      content: "진통제 추가 처방이 가능한지 문의합니다.", assigned: false, done: false },
    { id: 5, name: "한지우", room: "308호", type: "guide", time: "20분 전",
      content: "퇴원 절차와 준비물에 대해 설명 요청합니다.", assigned: false, done: false }
  ];

  const alerts = [
    { id: 1, level: "critical", icon: "🫀", title: "이상 생체신호 감지",
      desc: "심박 142bpm · SpO₂ 88% · 정상 범위를 벗어났습니다.", loc: "302호 이정호", emergency: true },
    { id: 2, level: "critical", icon: "🛎", title: "응급 호출",
      desc: "환자가 응급 호출 버튼을 눌렀습니다. 즉시 확인이 필요합니다.", loc: "302호 이정호", emergency: true },
    { id: 3, level: "warning", icon: "⚠", title: "낙상 위험 감지",
      desc: "침상 이탈 움직임이 반복 감지되었습니다.", loc: "305호 최영자", emergency: false },
    { id: 4, level: "warning", icon: "⏱", title: "장시간 미처리 요청",
      desc: "요청 접수 후 15분간 미처리 상태입니다.", loc: "304호 정해나", emergency: false },
    { id: 5, level: "info", icon: "💊", title: "투약 시간 알림",
      desc: "09:00 항생제 IV 투여 예정 시간입니다.", loc: "301호 박민수", emergency: false },
    { id: 6, level: "info", icon: "🔗", title: "디바이스 동기화 완료",
      desc: "병동 스테이션과 데이터 동기화가 완료되었습니다.", loc: "3병동 스테이션", emergency: false }
  ];

  const guides = {
    test: [
      { title: "채혈 검사 전 안내", text: "정확한 검사를 위해 검사 전 8시간 이상 금식이 필요합니다. 물은 소량 드셔도 괜찮습니다.",
        quote: "\"○○님, 오늘 오전 채혈이 예정되어 있어 지금부터 식사는 잠시 미뤄주세요. 물은 조금 드셔도 됩니다.\"" },
      { title: "영상 검사 전 안내", text: "금속류(시계, 목걸이, 헤어핀)는 미리 제거해 주세요. 조영제 사용 시 알레르기 여부를 확인합니다.",
        quote: "\"검사실 이동 전 금속 장신구는 모두 빼주시고, 이전에 조영제 알레르기가 있으셨다면 꼭 알려주세요.\"" }
    ],
    med: [
      { title: "경구 투약 안내", text: "처방된 약은 정해진 시간에 충분한 물과 함께 복용합니다. 임의로 중단하지 않도록 안내합니다.",
        quote: "\"이 약은 하루 3번 식후 30분에 드시는 약이에요. 증상이 좋아져도 정해진 기간 동안 꾸준히 드셔야 합니다.\"" },
      { title: "주사 투약 안내", text: "투약 목적과 예상 반응을 설명하고, 투여 중 불편감이 있으면 바로 알리도록 안내합니다.",
        quote: "\"항생제를 정맥으로 놓아드릴게요. 투약 중 가려움이나 답답함이 느껴지면 바로 말씀해 주세요.\"" }
    ],
    discharge: [
      { title: "퇴원 절차 안내", text: "퇴원 수속은 원무과에서 진행되며, 처방전과 진료 예약을 함께 확인합니다.",
        quote: "\"퇴원 수속은 1층 원무과에서 도와드려요. 퇴원약 처방전과 다음 외래 예약일을 함께 안내해 드릴게요.\"" },
      { title: "가정 관리 안내", text: "복용 약, 상처 관리, 재방문이 필요한 증상을 보호자와 함께 확인합니다.",
        quote: "\"열이 38도 이상 오르거나 상처 부위가 붉게 부어오르면 예약일 전이라도 병원에 연락 주세요.\"" }
    ]
  };

  /* ---------- 짧은 셀렉터 ---------- */
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- 토스트 ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- 탭 전환 ---------- */
  function switchTab(name) {
    $$(".tab").forEach(t => t.classList.toggle("is-active", t.dataset.tab === name));
    $$(".screen").forEach(s => s.classList.toggle("is-active", s.dataset.screen === name));
    const active = $(`#screen-${name}`);
    if (active) active.scrollTop = 0;
  }
  $("#tabbar").addEventListener("click", e => {
    const tab = e.target.closest(".tab");
    if (tab) switchTab(tab.dataset.tab);
  });
  // data-goto 로 화면 이동
  document.addEventListener("click", e => {
    const g = e.target.closest("[data-goto]");
    if (g) switchTab(g.dataset.goto);
  });

  /* ---------- 오버레이 열기/닫기 ---------- */
  function openOverlay(id) { $(`#overlay-${id}`)?.classList.add("is-open"); }
  document.addEventListener("click", e => {
    const opener = e.target.closest("[data-open]");
    if (opener) openOverlay(opener.dataset.open);
    const closer = e.target.closest("[data-close]");
    if (closer) closer.closest(".overlay")?.classList.remove("is-open");
  });

  /* ---------- 토스트 트리거 (data-toast) ---------- */
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-toast]");
    if (t) toast(t.dataset.toast);
  });

  /* ---------- 디바이스 연결 토글 ---------- */
  let deviceOn = true;
  function renderDevice() {
    $("#deviceChip").classList.toggle("is-off", !deviceOn);
    $("#deviceLabel").textContent = deviceOn ? "디바이스 연결됨" : "연결 끊김";
    $("#deviceBanner").classList.toggle("is-off", deviceOn === false);
    $("#dbState").textContent = deviceOn ? "정상 연결" : "연결 끊김";
    $("#setDeviceState").textContent = deviceOn ? "연결됨" : "끊김";
    $("#setDeviceState").style.color = deviceOn ? "var(--mint)" : "var(--ink-3)";
  }
  $("#deviceChip").addEventListener("click", () => {
    deviceOn = !deviceOn;
    renderDevice();
    toast(deviceOn ? "CARE LINK 디바이스에 연결되었습니다" : "디바이스 연결이 해제되었습니다");
  });
  // 새로고침 애니메이션
  $("#dbRefresh").addEventListener("click", function () {
    this.classList.add("spin");
    setTimeout(() => {
      this.classList.remove("spin");
      const b = 78 + Math.floor(Math.random() * 15);
      $("#dbBattery").textContent = "배터리 " + b + "%";
      toast("디바이스 상태를 새로고침했습니다");
    }, 800);
  });

  /* ---------- 협업 보드 렌더 ---------- */
  const statusMeta = {
    wait:     { dot: "d-wait",     label: "대기",    next: "progress" },
    progress: { dot: "d-progress", label: "진행 중", next: "done" },
    done:     { dot: "d-done",     label: "완료",    next: "wait" }
  };
  const prioMeta = { high: ["prio-high", "높음"], mid: ["prio-mid", "보통"], low: ["prio-low", "낮음"] };

  function renderPatients(filter = "all") {
    const list = $("#patientList");
    const items = patients.filter(p => filter === "all" || p.status === filter);
    list.innerHTML = items.map(p => {
      const sm = statusMeta[p.status];
      const [pc, pl] = prioMeta[p.prio];
      const nextLabel = statusMeta[sm.next].label;
      return `
      <div class="pt-card s-${p.status}" data-id="${p.id}">
        <div class="pt-head">
          <div class="pt-id">
            <div class="pt-avatar">${p.init}</div>
            <div>
              <div class="pt-name">${p.name}</div>
              <div class="pt-room">${p.room}</div>
            </div>
          </div>
          <span class="pt-prio ${pc}">${pl}</span>
        </div>
        <div class="pt-note">${p.note}</div>
        <div class="pt-foot">
          <div>
            <div class="pt-status"><i class="lg-dot ${sm.dot}"></i>${sm.label}</div>
            <div class="pt-owner">담당 <b>${p.owner}</b></div>
          </div>
          <button class="pt-advance" data-advance="${p.id}">${p.status === "done" ? "대기로" : nextLabel + "로"}</button>
        </div>
      </div>`;
    }).join("");
  }
  $("#patientFilter").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    $$("#patientFilter .chip").forEach(c => c.classList.remove("is-on"));
    chip.classList.add("is-on");
    renderPatients(chip.dataset.status);
  });
  $("#patientList").addEventListener("click", e => {
    const btn = e.target.closest("[data-advance]");
    if (!btn) return;
    const p = patients.find(x => x.id == btn.dataset.advance);
    p.status = statusMeta[p.status].next;
    if (p.status !== "wait" && p.owner === "미배정") p.owner = "김서연";
    const activeFilter = $("#patientFilter .chip.is-on").dataset.status;
    renderPatients(activeFilter);
    toast(`${p.name}님 상태: ${statusMeta[p.status].label}`);
  });

  /* ---------- 요청 관리 렌더 ---------- */
  const typeMeta = {
    emergency: ["type-emergency", "응급"],
    normal:    ["type-normal", "일반"],
    guide:     ["type-guide", "안내"]
  };
  function renderRequests(filter = "all") {
    const list = $("#requestList");
    const items = requests.filter(r => filter === "all" || r.type === filter);
    if (!items.length) {
      list.innerHTML = "";
      $("#requestEmpty").hidden = false;
    } else {
      $("#requestEmpty").hidden = true;
      list.innerHTML = items.map(r => {
        const [tc, tl] = typeMeta[r.type];
        return `
        <div class="rq-card ${r.done ? "done" : ""}" data-id="${r.id}">
          <div class="rq-top">
            <div class="rq-meta">
              <span class="rq-type-tag ${tc}">${tl}</span>
            </div>
            <span class="rq-time">${r.time}</span>
          </div>
          <div class="rq-name">${r.name}<span>${r.room}</span></div>
          <div class="rq-content">${r.content}</div>
          <div class="rq-owner-line ${r.assigned ? "show" : ""}">담당자 <b>김서연</b> 배정됨</div>
          <div class="rq-actions">
            <button class="rq-btn rq-assign ${r.assigned ? "assigned" : ""}" data-assign="${r.id}">
              ${r.assigned ? "배정 완료" : "담당자 배정"}
            </button>
            <button class="rq-btn rq-done" data-done="${r.id}">처리 완료</button>
          </div>
        </div>`;
      }).join("");
    }
    updateBadges();
  }
  $("#requestFilter").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    $$("#requestFilter .chip").forEach(c => c.classList.remove("is-on"));
    chip.classList.add("is-on");
    renderRequests(chip.dataset.type);
  });
  $("#requestList").addEventListener("click", e => {
    const assignBtn = e.target.closest("[data-assign]");
    const doneBtn = e.target.closest("[data-done]");
    if (assignBtn) {
      const r = requests.find(x => x.id == assignBtn.dataset.assign);
      r.assigned = !r.assigned;
      const filter = $("#requestFilter .chip.is-on").dataset.type;
      renderRequests(filter);
      toast(r.assigned ? `${r.name}님 요청을 배정했습니다` : "배정을 취소했습니다");
    }
    if (doneBtn) {
      const id = doneBtn.dataset.done;
      const card = doneBtn.closest(".rq-card");
      card.classList.add("removing");
      setTimeout(() => {
        const idx = requests.findIndex(x => x.id == id);
        const name = requests[idx].name;
        requests.splice(idx, 1);
        const filter = $("#requestFilter .chip.is-on").dataset.type;
        renderRequests(filter);
        toast(`${name}님 요청을 처리 완료했습니다`);
      }, 320);
    }
  });

  /* ---------- 위험 감지 알림 렌더 ---------- */
  const lvlLabel = { critical: "중요", warning: "주의", info: "정보" };
  function renderAlerts(filter = "all") {
    const list = $("#alertList");
    const items = alerts.filter(a => filter === "all" || a.level === filter);
    list.innerHTML = items.map(a => `
      <div class="al-card lv-${a.level} ${a.read ? "read" : ""}" data-id="${a.id}">
        <div class="al-ico"><span>${a.icon}</span></div>
        <div class="al-body">
          <div class="al-head">
            <span class="al-title">${a.title}</span>
            <span class="al-lvl lvl-${a.level}">${lvlLabel[a.level]}</span>
          </div>
          <div class="al-desc">${a.desc}</div>
          <div class="al-foot">
            <span class="al-loc"><b>${a.loc}</b></span>
            <button class="al-act" data-alert="${a.id}">
              ${a.emergency ? "긴급 대응" : (a.read ? "확인됨" : "확인")}
            </button>
          </div>
        </div>
      </div>`).join("");
    updateBadges();
  }
  $("#alertFilter").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    $$("#alertFilter .chip").forEach(c => c.classList.remove("is-on"));
    chip.classList.add("is-on");
    renderAlerts(chip.dataset.level);
  });
  $("#alertList").addEventListener("click", e => {
    const btn = e.target.closest("[data-alert]");
    if (!btn) return;
    const a = alerts.find(x => x.id == btn.dataset.alert);
    if (a.emergency) {
      openEmergency();
    } else {
      a.read = true;
      const filter = $("#alertFilter .chip.is-on").dataset.level;
      renderAlerts(filter);
      toast("알림을 확인 처리했습니다");
    }
  });

  /* ---------- 설명 가이드 렌더 ---------- */
  function renderGuide(key = "test") {
    $("#guideContent").innerHTML = guides[key].map(g => `
      <div class="guide-block">
        <div class="gb-title">${g.title}</div>
        <div class="gb-text">${g.text}</div>
        <div class="gb-quote">${g.quote}</div>
        <button class="gb-copy" data-copy="${encodeURIComponent(g.quote)}">
          <span>📋</span> 안내 문구 복사
        </button>
      </div>`).join("");
  }
  $("#guideTabs").addEventListener("click", e => {
    const tab = e.target.closest(".g-tab");
    if (!tab) return;
    $$("#guideTabs .g-tab").forEach(t => t.classList.remove("is-on"));
    tab.classList.add("is-on");
    renderGuide(tab.dataset.guide);
  });
  $("#guideContent").addEventListener("click", e => {
    const btn = e.target.closest("[data-copy]");
    if (!btn) return;
    const text = decodeURIComponent(btn.dataset.copy);
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    toast("안내 문구가 복사되었습니다");
  });

  /* ---------- 긴급 상황 화면 ---------- */
  function openEmergency() { $("#emergencyScreen").classList.add("is-open"); }
  function closeEmergency() { $("#emergencyScreen").classList.remove("is-open"); }
  $("#emergencyBanner").addEventListener("click", openEmergency);
  $("#esClose").addEventListener("click", closeEmergency);
  $("#esResolve").addEventListener("click", () => {
    closeEmergency();
    toast("긴급 상황이 종료 처리되었습니다");
  });

  /* ---------- 배지 업데이트 ---------- */
  function updateBadges() {
    const reqCount = requests.length;
    const alertCount = alerts.filter(a => !a.read && (a.level === "critical" || a.level === "warning")).length;
    const reqBadge = $("#tabReqBadge");
    const alertBadge = $("#tabAlertBadge");
    reqBadge.textContent = reqCount;
    reqBadge.style.display = reqCount ? "flex" : "none";
    alertBadge.textContent = alertCount;
    alertBadge.style.display = alertCount ? "flex" : "none";
    // 홈 통계도 동기화
    $("#statWaiting").textContent = reqCount;
    $("#statUrgent").textContent = alerts.filter(a => a.level === "critical" && !a.read).length;
  }

  /* ---------- 초기 렌더 ---------- */
  renderDevice();
  renderPatients();
  renderRequests();
  renderAlerts();
  renderGuide();
  updateBadges();
})();
