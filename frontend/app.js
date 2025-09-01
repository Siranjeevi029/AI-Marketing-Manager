  (async function () {
    const API = "http://127.0.0.1:5000/api"; // match backend /api prefix
    function id(x) {
      return document.getElementById(x);
    }

    function showLoader(on) {
      const el = id("loader");
      if (el) el.style.display = on ? "flex" : "none";
    }

    function setStatus(t) {
      const s = id("status");
      if (s) s.textContent = t;
    }

    // ✅ Safely convert any value to string before escaping
    function htmlEscape(s) {
      s = s == null ? "" : String(s);
      return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    async function analyzeIdea() {
      const idea = id("ideaBox").value.trim();
      if (!idea) {
        alert("Please describe your business idea.");
        return;
      }
      const audience = id("audience").value.trim();
      const website = id("website").value.trim();
      const platforms = (id("platforms").value || "instagram,facebook,linkedin")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const days = parseInt(id("days").value, 10) || 14;

      showLoader(true);
      setStatus("Sending to backend...");
      id("resultsSection").style.display = "none";

      try {
        const res = await fetch(API + "/analyze-business", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idea, audience, website, platforms, days }),
        });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();

        // 🔑 backend returns JSON inside ai_text
        let text = data.ai_text || "{}";
        text = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(text);

        console.log(data);
        // SEO Score (from PageSpeed API)
// SEO Score (from PageSpeed API)
let seoScore = null;

if (data.pagespeed && data.pagespeed.lighthouseResult && data.pagespeed.lighthouseResult.categories) {
  const categories = data.pagespeed.lighthouseResult.categories;
  if (categories.seo && typeof categories.seo.score === "number") {
    seoScore = Math.round(categories.seo.score * 100); // convert 0–1 to 0–100
  }
}

id("seo-score").innerHTML = seoScore !== null
  ? `<div class="card"><h3>SEO Score</h3>
       <p class="seo-score-value">${seoScore}/100</p>
     </div>`
  : "<p class='small-muted'>SEO score not available.</p>";




        // Brand tagline
        id("brand").innerHTML = parsed.brand
          ? `<div class="card brand-card">
              <h3>Brand Tagline</h3>
              <p class="brand-tagline">${htmlEscape(parsed.brand)}</p>
            </div>`
          : "<p class='small-muted'>No brand tagline</p>";

        // SEO keywords
        id("seo").innerHTML = Array.isArray(parsed.seo) && parsed.seo.length
          ? `<div class="card"><h3>SEO Keywords</h3>
              <div class="tags">
                ${parsed.seo.map((kw) => `<span class="tag">${htmlEscape(kw)}</span>`).join("")}
              </div>
            </div>`
          : "<p class='small-muted'>No SEO keywords.</p>";

        // Content ideas
        id("content").innerHTML = Array.isArray(parsed.content) && parsed.content.length
          ? `<div class="card"><h3>Content Ideas</h3>
              <div class="content-cards">
                ${parsed.content.map((c) => `<div class="content-card">${htmlEscape(c)}</div>`).join("")}
              </div>
            </div>`
          : "<p class='small-muted'>No content samples.</p>";

        // Calendar
        id("calendar").innerHTML = Array.isArray(parsed.calendar) && parsed.calendar.length
          ? `<div class="card"><h3>Marketing Calendar</h3>
              <table class="calendar-table">
                <thead><tr><th>Day</th><th>Task</th></tr></thead>
                <tbody>
                  ${parsed.calendar.map((c) =>
                    `<tr><td>Day ${htmlEscape(c.day)}</td><td>${htmlEscape(c.task)}</td></tr>`
                  ).join("")}
                </tbody>
              </table>
            </div>`
          : "<p class='small-muted'>No calendar.</p>";

        id("resultsSection").style.display = "block";
        setStatus("Ready");
      } catch (err) {
        console.error(err);
        alert(err.message || "Something went wrong!");
        setStatus("Error");
      } finally {
        showLoader(false);
      }
    }

    document.addEventListener("DOMContentLoaded", () => {
      id("analyzeBtn").addEventListener("click", analyzeIdea);
      id("startBtn").addEventListener("click", () => {
        const hero = document.querySelector(".hero");
        if (hero) window.scrollTo({ top: hero.offsetTop, behavior: "smooth" });
      });
      id("clearBtn").addEventListener("click", () => {
        id("ideaBox").value = "";
        id("audience").value = "";
        id("website").value = "";
      });

      // Tabs
      document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
          document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
          btn.classList.add("active");
          const tabId = btn.getAttribute("data-tab");
          id(tabId).classList.add("active");
        });
      });
    });
  })();

 
//https://sample-spring-7j2j.onrender.com
//https://amazon-shopping-app-js.netlify.app/
//


  // i want to start a tea store which includes all the snacks items and the milk totallers
  // give me some business idea using which i can improve my business and make a better outcome out of it
  // by attracting people....
