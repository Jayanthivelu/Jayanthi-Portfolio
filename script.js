/* ================================================
   JAYANTHI V — Portfolio JS Engine
   GSAP Animations + 1s Typewriter + Dynamic 3D Dual Scroll
   ================================================ */

/* ── GSAP Registration ── */
if (typeof gsap !== 'undefined') {
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof Flip !== 'undefined') gsap.registerPlugin(Flip);
}

/* ── Particles background ── */
(function(){
  const c = document.getElementById("particles");
  if(!c) return;
  for(let i=0; i<60; i++){
    const d = document.createElement("div");
    const s = Math.random()*2+1;
    const x = Math.random()*100;
    const y = Math.random()*100;
    const dur = Math.random()*20+10;
    const del = Math.random()*10;
    Object.assign(d.style, {
      position: "absolute",
      width: s+"px",
      height: s+"px",
      borderRadius: "50%",
      background: i%4===0 ? "rgba(168,85,247,0.6)" : "rgba(255,255,255,0.15)",
      left: x+"%",
      top: y+"%",
      animation: "particleFloat "+dur+"s "+del+"s linear infinite"
    });
    c.appendChild(d);
  }
  const style = document.createElement("style");
  style.textContent = `
    @keyframes particleFloat{
      0%{transform:translateY(0) scale(1);opacity:0}
      10%{opacity:1}
      90%{opacity:1}
      100%{transform:translateY(-100vh) scale(0.5);opacity:0}
    }
  `;
  document.head.appendChild(style);
})();

/* ── Typewriter Role Cycling (1s Pause at word completion) ── */
const rolesList = [
  "Social Media Marketing",
  "UI/UX Designer",
  "Web Development",
  "Content Creator",
  "SEO"
];

let roleIdx = 0, charIdx = 0, isDeleting = false;

function typeRoleLoop() {
  const el = document.getElementById("typedRole");
  if (!el) return;

  const currentRole = rolesList[roleIdx];

  if (isDeleting) {
    el.textContent = currentRole.substring(0, charIdx - 1);
    charIdx--;
  } else {
    el.textContent = currentRole.substring(0, charIdx + 1);
    charIdx++;
  }

  let speed = 40; 

  if (!isDeleting && charIdx === currentRole.length) {
    speed = 1000; // 1s pause
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    roleIdx = (roleIdx + 1) % rolesList.length;
    speed = 120;
  }

  setTimeout(typeRoleLoop, speed);
}

typeRoleLoop();

/* ── Navbar scroll ── */
const navbar = document.getElementById("navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  }, {passive: true});
}

/* ── Hamburger ── */
const ham = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");
if(ham && mobileNav){
  ham.addEventListener("click", () => {
    ham.classList.toggle("open");
    mobileNav.classList.toggle("open");
  });
  document.querySelectorAll(".mob-link").forEach(l => {
    l.addEventListener("click", () => {
      ham.classList.remove("open");
      mobileNav.classList.remove("open");
    });
  });
}

/* ── Active nav on scroll ── */
const secs = document.querySelectorAll("section[id]");
const navLs = document.querySelectorAll(".nav-link");
window.addEventListener("scroll", () => {
  let cur = "";
  secs.forEach(s => {
    if(window.scrollY >= s.offsetTop - 120) cur = s.id;
  });
  navLs.forEach(l => {
    l.classList.remove("active");
    if(l.getAttribute("href") === "#" + cur) l.classList.add("active");
  });
}, {passive: true});

/* ── Back to Top ── */
const btt = document.getElementById("btt");
if(btt){
  window.addEventListener("scroll", () => {
    btt.classList.toggle("show", window.scrollY > 400);
  }, {passive: true});
  btt.addEventListener("click", () => window.scrollTo({top: 0, behavior: "smooth"}));
}

/* ── Footer year ── */
const yr = document.getElementById("yr");
if(yr) yr.textContent = new Date().getFullYear();

/* ── GSAP BOTH-DIRECTIONAL DYNAMIC 3D SCROLLTRIGGER ANIMATIONS ── */
if (typeof gsap !== 'undefined') {
  // Add 3D perspective to sections so rotationX/Y works cleanly
  gsap.set("section, .help-section-open", { perspective: 1000 });

  // Hero intro
  const htl = gsap.timeline({defaults: {ease: "back.out(1.2)"}});
  htl
    .from(".navbar",                {y: -50, opacity: 0, duration: .8, ease: "power3.out"})
    .from(".hero-greeting",         {y: 30, opacity: 0, scale: 0.8, duration: .7}, "-=.4")
    .from(".hero-title",            {y: 40, opacity: 0, rotationX: -15, transformOrigin: "bottom center", duration: .8}, "-=.4")
    .from(".hero-typewriter-role",  {y: 20, opacity: 0, duration: .6}, "-=.5")
    .from(".hero-desc",             {y: 20, opacity: 0, duration: .6}, "-=.4")
    .from(".hero-btns",             {y: 20, opacity: 0, scale: 0.9, duration: .6}, "-=.4")
    .from(".hero-socials > *",       {scale: .5, rotation: 15, opacity: 0, duration: .5, stagger: .1, ease: "back.out(2)"}, "-=.3")
    .from(".hero-right",            {x: 80, rotationY: -15, scale: 0.9, opacity: 0, duration: 1, ease: "back.out(1.5)"}, "-=.9")
    .from(".scroll-hint",           {opacity: 0, y: 15, duration: .5, ease: "power3.out"}, "-=.2");

  if (typeof ScrollTrigger !== 'undefined') {
    // Both-directional section line triggers
    gsap.utils.toArray(".sec-line").forEach(line => {
      gsap.fromTo(line,
        {width: 0, opacity: 0},
        {
          width: 64, opacity: 1, duration: .8, ease: "power2.out",
          scrollTrigger: {
            trigger: line,
            start: "top 90%",
            end: "bottom 10%",
            toggleActions: "play reverse play reverse"
          }
        }
      );
    });

    // 1. Reveal Up (General Headers, Contact Form, Help Box) -> Slide up, Zoom In, 3D Flip X
    gsap.utils.toArray(".reveal-up:not(.service-card-jaison):not(.project-card)").forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 80, scale: 0.85, rotationX: 20 },
        {
          opacity: 1, y: 0, scale: 1, rotationX: 0, duration: 1, ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            end: "bottom 10%",
            toggleActions: "play reverse play reverse"
          }
        }
      );
    });

    // 2. Sequential Grid Fade-In (Services) -> Zoom + 3D Rotate Y Stagger
    gsap.fromTo(".service-card-jaison",
      { opacity: 0, y: 60, scale: 0.8, rotationY: -15 },
      {
        opacity: 1, y: 0, scale: 1, rotationY: 0, duration: 0.8, stagger: 0.15, ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: ".services-grid",
          start: "top 85%",
          end: "bottom 10%",
          toggleActions: "play reverse play reverse"
        }
      }
    );

    // 3. Sequential Grid Fade-In (Projects) -> Zoom + Slide Up Stagger
    gsap.fromTo(".project-card",
      { opacity: 0, y: 60, scale: 0.9, rotationX: 10 },
      {
        opacity: 1, y: 0, scale: 1, rotationX: 0, duration: 0.8, stagger: 0.2, ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: ".projects-grid",
          start: "top 85%",
          end: "bottom 10%",
          toggleActions: "play reverse play reverse"
        }
      }
    );

    // 4. Reveal Left (About Image) -> Slide Left, Zoom, 3D Rotate
    gsap.utils.toArray(".reveal-left").forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: -100, scale: 0.85, rotationY: 20 },
        {
          opacity: 1, x: 0, scale: 1, rotationY: 0, duration: 1.2, ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "bottom 10%",
            toggleActions: "play reverse play reverse"
          }
        }
      );
    });

    // 5. Reveal Right (About Text) -> Slide Right, Zoom, 3D Rotate
    gsap.utils.toArray(".reveal-right").forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: 100, scale: 0.85, rotationY: -20 },
        {
          opacity: 1, x: 0, scale: 1, rotationY: 0, duration: 1.2, ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "bottom 10%",
            toggleActions: "play reverse play reverse"
          }
        }
      );
    });

    // 6. Timeline items -> Slide left, stagger
    gsap.fromTo(".tl-item",
      { opacity: 0, x: -60, scale: 0.95 },
      {
        opacity: 1, x: 0, scale: 1, duration: 0.8, stagger: 0.2, ease: "power3.out",
        scrollTrigger: {
          trigger: ".timeline",
          start: "top 85%",
          end: "bottom 10%",
          toggleActions: "play reverse play reverse"
        }
      }
    );

    // 7. Hero Image Jump to About Section (Desktop Only)
    const heroImage = document.querySelector("#heroImage");
    const aboutTarget = document.querySelector("#aboutImageTarget");
    
    if (heroImage && aboutTarget) {
      // Use matchMedia to only apply the jump effect on desktop
      let mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        // Desktop: Jump animation
        gsap.set(aboutTarget, { opacity: 0 }); // Hide real image initially

        let jumpTween;

        function createJumpAnimation() {
          if (jumpTween) jumpTween.kill();
          gsap.set(heroImage, { clearProps: "transform,opacity" });

          const heroRect = heroImage.getBoundingClientRect();
          const targetRect = aboutTarget.getBoundingClientRect();

          const heroCenterX = heroRect.left + heroRect.width / 2;
          const heroCenterY = heroRect.top + heroRect.height / 2;
          
          const targetCenterX = targetRect.left + targetRect.width / 2;
          const targetCenterY = targetRect.top + targetRect.height / 2;

          const deltaX = targetCenterX - heroCenterX;
          const deltaY = targetCenterY - heroCenterY;
          
          const scaleX = targetRect.width / heroRect.width;
          const scaleY = targetRect.height / heroRect.height;

          // Create a timeline to handle the travel and crossfade
          jumpTween = gsap.timeline({
            scrollTrigger: {
              trigger: "#home",
              start: "top top",
              endTrigger: "#about",
              end: "center center",
              scrub: 1
            }
          });

          jumpTween.to(heroImage, {
            x: deltaX,
            y: deltaY,
            scaleX: scaleX,
            scaleY: scaleY,
            rotationY: 360,
            transformOrigin: "center center",
            ease: "power1.inOut"
          }, 0);

          // Crossfade at the very end to ensure perfect alignment
          jumpTween.to(heroImage, { opacity: 0, duration: 0.1 }, 0.9);
          jumpTween.to(aboutTarget, { opacity: 1, duration: 0.1 }, 0.9);
        }

        window.addEventListener("load", createJumpAnimation);
        ScrollTrigger.addEventListener("refreshInit", () => {
          if (jumpTween) jumpTween.kill();
          gsap.set(heroImage, { clearProps: "transform,opacity" });
          gsap.set(aboutTarget, { opacity: 0 });
        });
        ScrollTrigger.addEventListener("refresh", createJumpAnimation);

        return () => {
          // Cleanup on mobile
          if (jumpTween) jumpTween.kill();
          gsap.set(heroImage, { clearProps: "all" });
          gsap.set(aboutTarget, { opacity: 1 }); // Ensure visible on mobile
        };
      });

      mm.add("(max-width: 768px)", () => {
        // Mobile: Normal animations
        gsap.set(heroImage, { clearProps: "all" });
        gsap.set(aboutTarget, { opacity: 1 });

        // Simple fade out for hero
        gsap.to(heroImage, {
          opacity: 0,
          y: 50,
          scrollTrigger: {
            trigger: "#home",
            start: "top top",
            end: "bottom top",
            scrub: 1
          }
        });

        // Simple fade in for about
        gsap.from(aboutTarget, {
          opacity: 0,
          y: 50,
          scrollTrigger: {
            trigger: "#about",
            start: "top bottom",
            end: "center center",
            scrub: 1
          }
        });
      });
    }
  }
}

/* ── Web3Forms Contact Form ── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    const originalContent = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = `<span>Sending...</span>`;

    const formData = new FormData(form);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const json = await response.json();

      if (response.status === 200 && json.success) {
        btn.innerHTML = `<span>✓ Message Sent!</span>`;
        btn.style.background = '#10b981';
        btn.style.borderColor = '#10b981';
        form.reset();
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = originalContent;
          btn.style.background = '';
          btn.style.borderColor = '';
        }, 4000);
      } else {
        alert(json.message || 'Error sending message.');
        btn.disabled = false;
        btn.innerHTML = originalContent;
      }
    } catch (err) {
      console.error(err);
      alert('Unable to submit automatically. Please email directly to jayanthivelu001@gmail.com');
      btn.disabled = false;
      btn.innerHTML = originalContent;
    }
  });
}

// 8. Force Download CV using Base64 (Bypasses Local file:// Restrictions)
const cvBtn = document.querySelector("a[download]");
if (cvBtn) {
  cvBtn.addEventListener("click", function (e) {
    e.preventDefault(); // Stop default browser navigation
    const filename = this.getAttribute("download");

    try {
      // Decode the Base64 string from cvData.js
      const byteCharacters = atob(cvBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Create fake link to trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const tempLink = document.createElement("a");
      tempLink.style.display = "none";
      tempLink.href = blobUrl;
      tempLink.download = filename;
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      
      // Cleanup
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
    } catch (err) {
      console.error("Base64 download failed, falling back to direct link", err);
      window.location.href = this.getAttribute("href");
    }
  });
}
