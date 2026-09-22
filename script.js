  // ---- EDIT THESE ----
  const WEDDING_DATE = "2026-11-13T19:00:00"; // local time of the venue
const VENUE_NAME = "Elsaraya ُngagement Hall";
const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/Hr8UeSzXzjcAG1DM8"; // replace with your real share link
const COUPLE_EMAIL = "nardinmilad83@gmail.com"; // where RSVPs get sent
  const HERO_PHOTO = "images/hero.jpg"; // background photo behind the names — leave "" for no photo
  const ENVELOPE_PHOTO = "images/envelope-bg.jpg"; // large background photo on the opening screen — leave "" for no photo
  // ---------------------

  if (HERO_PHOTO) { document.getElementById('hero-photo').src = HERO_PHOTO; }
  if (ENVELOPE_PHOTO) { document.getElementById('envelope-photo').src = ENVELOPE_PHOTO; }
  document.getElementById('map-link').href = GOOGLE_MAPS_URL;

  // Add-to-calendar (Google Calendar link, opens in new tab)
  (function(){
    const start = new Date(WEDDING_DATE);
    const end = new Date(start.getTime() + 3*60*60*1000); // 3 hour default
    const fmt = d => d.toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Micheal & Nardin\'s Wedding')}&dates=${fmt(start)}/${fmt(end)}&location=${encodeURIComponent(VENUE_NAME)}&details=${encodeURIComponent('We would love for you to join us.')}`;
    document.getElementById('cal-link').href = gcalUrl;
    document.getElementById('cal-link').target = "_blank";
  })();

  // Countdown
  (function(){
    const target = new Date(WEDDING_DATE).getTime();
    function tick(){
      const now = Date.now();
      let diff = Math.max(0, target - now);
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      document.getElementById('cd-days').textContent = String(days).padStart(2,'0');
      document.getElementById('cd-hours').textContent = String(hours).padStart(2,'0');
      document.getElementById('cd-mins').textContent = String(mins).padStart(2,'0');
      document.getElementById('cd-secs').textContent = String(secs).padStart(2,'0');
    }
    tick();
    setInterval(tick, 1000);
  })();

  // Invitation intro: opens on click, then reveals the site and starts the hero entrance
  (function(){
    const screen = document.getElementById('envelope-screen');
    const btn = document.getElementById('open-invite-btn');
    const music = document.getElementById('bg-music');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      // Skip the intro theatrics entirely for anyone who prefers reduced motion
      screen.classList.add('is-hidden');
      document.body.classList.remove('envelope-active');
      document.body.classList.add('opened');
      return;
    }

    btn.addEventListener('click', function(){
      screen.classList.add('closing');
      music.play().catch(()=>{}); // user gesture, so autoplay is allowed here
      document.body.classList.remove('envelope-active');
      document.body.classList.add('opened');
      setTimeout(function(){ screen.classList.add('is-hidden'); }, 650);
    });
  })();

  // Close-invitation button at the end: scrolls back up and brings the panel back
  (function(){
    const closeBtn = document.getElementById('close-invite-btn');
    const screen = document.getElementById('envelope-screen');
    const music = document.getElementById('bg-music');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    closeBtn.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
      music.pause();
      const scrollDelay = prefersReduced ? 0 : 550;
      setTimeout(function(){
        document.body.classList.add('envelope-active');
        document.body.classList.remove('opened');
        screen.classList.remove('is-hidden');
        screen.offsetHeight; // force a reflow so the fade-in transition actually plays
        screen.classList.remove('closing');
      }, scrollDelay);
    });
  })();

  // Music toggle
  (function(){
    const music = document.getElementById('bg-music');
    const toggle = document.getElementById('music-toggle');
    function sync(){ toggle.textContent = music.paused ? '🔇' : '🎵'; }
    toggle.addEventListener('click', function(){
      if (music.paused) { music.play().catch(()=>{}); } else { music.pause(); }
    });
    music.addEventListener('play', sync);
    music.addEventListener('pause', sync);
    sync();
  })();

  // Scroll reveal: sections stay hidden until they enter the viewport
  (function(){
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = document.querySelectorAll('.reveal');
    if (prefersReduced || !('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(el => observer.observe(el));
  })();

  // Floating drifting particles (gold / pink / teal), skipped for reduced motion
  (function(){
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const colors = ['#f4b942', '#ff5d8f', '#2dd4bf'];
    const container = document.getElementById('floaters');
    const count = 14;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('span');
      const size = 4 + Math.random() * 7;
      const color = colors[i % colors.length];
      dot.style.left = (Math.random() * 100) + 'vw';
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
      dot.style.background = color;
      dot.style.boxShadow = `0 0 ${size * 1.8}px ${color}`;
      dot.style.animationDuration = (10 + Math.random() * 12) + 's';
      dot.style.animationDelay = (Math.random() * 14) + 's';
      container.appendChild(dot);
    }
  })();

  // RSVP -> mailto (no backend needed). Replace with Formspree/Worker later.
  document.getElementById('rsvp-form').addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const guests = document.getElementById('guests').value;
    const attending = document.querySelector('input[name="attending"]:checked').value;
    const message = document.getElementById('message').value.trim();

    const subject = encodeURIComponent(`RSVP: ${name} (${attending})`);
    const body = encodeURIComponent(
      `Name: ${name}\nGuests: ${guests}\nAttending: ${attending}\nMessage: ${message || '(none)'}`
    );
    window.location.href = `mailto:${COUPLE_EMAIL}?subject=${subject}&body=${body}`;

    const confirm = document.getElementById('rsvp-confirm');
    confirm.style.display = 'block';
    confirm.scrollIntoView({behavior:'smooth', block:'nearest'});
  });
