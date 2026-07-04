// Resume & Portfolio Controller Application
document.addEventListener("DOMContentLoaded", () => {
  // Read from localStorage if custom data is present, otherwise fallback to resume-data.js
  let data = window.resumeData;
  const localResumeData = localStorage.getItem("customResumeData");
  if (localResumeData) {
    try {
      data = JSON.parse(localResumeData);
    } catch (e) {
      console.error("Failed to parse custom resume data from localStorage, using default.", e);
    }
  }

  if (!data) {
    console.error("Resume data not loaded properly! Please check resume-data.js.");
    return;
  }

  /* ==========================================================================
     THEME INITIALIZATION & CONTROL
     ========================================================================== */
  const themeToggle = document.getElementById("theme-toggle");
  const currentTheme = localStorage.getItem("theme") || "light";
  
  // Apply initial theme
  document.documentElement.setAttribute("data-theme", currentTheme);
  
  themeToggle.addEventListener("click", () => {
    let theme = document.documentElement.getAttribute("data-theme");
    let targetTheme = theme === "dark" ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", targetTheme);
    localStorage.setItem("theme", targetTheme);
  });

  /* ==========================================================================
     MOBILE NAVIGATION MENU
     ========================================================================== */
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const navMenu = document.getElementById("nav-menu");
  
  mobileMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    navMenu.classList.toggle("open");
    const isOpen = navMenu.classList.contains("open");
    mobileMenuBtn.querySelector("i").className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-ellipsis-vertical";
  });

  // Close mobile menu when clicking on any nav link
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      mobileMenuBtn.querySelector("i").className = "fa-solid fa-ellipsis-vertical";
    });
  });

  // Close menu when tapping anywhere outside the nav
  document.addEventListener("click", (e) => {
    if (navMenu.classList.contains("open") &&
        !navMenu.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)) {
      navMenu.classList.remove("open");
      mobileMenuBtn.querySelector("i").className = "fa-solid fa-ellipsis-vertical";
    }
  });

  // Sticky header class on scroll
  const header = document.getElementById("main-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  /* ==========================================================================
     DYNAMIC RENDERING ENGINE
     ========================================================================== */

  // 1. Personal & Hero Section
  document.getElementById("hero-name").textContent = data.personal.name;
  document.getElementById("hero-name-heading").innerHTML = `Hi, I'm <span>${data.personal.name}</span>`;
  document.getElementById("hero-title-role").textContent = data.personal.title;
  document.getElementById("hero-description-text").textContent = data.personal.subtitle;
  
  const heroBadge = document.getElementById("hero-badge");
  if (heroBadge) {
    if (data.personal.availability) {
      heroBadge.style.display = "inline-flex";
      heroBadge.innerHTML = `
        <span class="pulse-dot" style="width: 8px; height: 8px; background: var(--secondary); border-radius: 50%; display: inline-block; box-shadow: 0 0 8px var(--secondary);"></span>
        ${data.personal.availability}
      `;
    } else {
      heroBadge.style.display = "none";
    }
  }
  
  // Set avatar graphic (Image or Initials)
  const avatarGraphic = document.querySelector(".avatar-graphic");
  if (avatarGraphic) {
    if (data.personal.profileImage) {
      avatarGraphic.innerHTML = `
        <img src="${data.personal.profileImage}" alt="${data.personal.name}" class="avatar-img">
        <div class="avatar-tech-ring"></div>
      `;
    } else {
      // Create initials for avatar graphic
      const initials = data.personal.name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase();
      avatarGraphic.innerHTML = `
        <span class="avatar-initials" id="avatar-initials-text">${initials}</span>
        <div class="avatar-tech-ring"></div>
      `;
    }
  }
  
  // Set window title dynamically
  document.title = `${data.personal.name} | ${data.personal.title} Resume`;
  
  // 2. About Me Section
  document.getElementById("about-bio-content").textContent = data.personal.about;
  
  const aboutInfoGrid = document.getElementById("about-info-grid");
  const personalDetails = [
    { label: "Role", value: data.personal.title },
    { label: "Location", value: data.personal.location },
    { label: "Mobile", value: `<a href="tel:${data.personal.phone}" style="color: var(--primary);">${data.personal.phone}</a>` },
    { label: "Email", value: `<a href="mailto:${data.personal.email}" style="color: var(--primary);">${data.personal.email}</a>` },
    { label: "Website", value: `<a href="${data.personal.website}" target="_blank" rel="noopener">${data.personal.website.replace("https://", "")}</a>` },
    { label: "DOB", value: data.personal.birthDate || "" },
    { label: "Marital Status", value: data.personal.maritalStatus || "" },
    { label: "Nationality", value: data.personal.nationality || "" }
  ];
  
  aboutInfoGrid.innerHTML = personalDetails.map(detail => `
    <div class="about-detail-item">
      <span class="about-detail-label">${detail.label}</span>
      <span class="about-detail-value">${detail.value}</span>
    </div>
  `).join("");

  // 2.b About Additional Lists (Interests, Languages, Activities)
  const interestsList = document.getElementById("about-interests-list");
  if (interestsList && data.interests) {
    interestsList.innerHTML = data.interests.map(item => `<li><i class="fa-solid fa-chevron-right" style="font-size:0.75rem; color:var(--primary); margin-right:6px;"></i> ${item}</li>`).join("");
  }
  
  const languagesList = document.getElementById("about-languages-list");
  if (languagesList && data.languages) {
    languagesList.innerHTML = data.languages.map(lang => `<li><strong>${lang.name}</strong> - <span style="font-size:0.85rem; color:var(--text-secondary);">${lang.level}</span></li>`).join("");
  }
  
  const activitiesList = document.getElementById("about-activities-list");
  if (activitiesList && data.activities) {
    activitiesList.innerHTML = data.activities.map(act => `<li><i class="fa-solid fa-square-check" style="font-size:0.8rem; color:var(--secondary); margin-right:6px;"></i> ${act}</li>`).join("");
  }

  // 3. Experience Timeline Section
  const experienceTimeline = document.getElementById("experience-timeline");
  experienceTimeline.innerHTML = data.experience.map(exp => {
    const certLink = exp.certificate ? `
      <a href="${exp.certificate}" target="_blank" rel="noopener" class="tech-tag" style="background: rgba(245, 158, 11, 0.08); border-color: rgba(245, 158, 11, 0.2); color: var(--accent); display: inline-flex; align-items: center; gap: 4px; margin-left: 10px;">
        <i class="fa-solid fa-certificate"></i> View Certificate
      </a>
    ` : "";
    
    return `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="glass-card timeline-card">
          <div class="timeline-meta">
            <div class="timeline-title-group">
              <h3 class="timeline-role">${exp.role}</h3>
              <span class="timeline-company">${exp.company}${certLink}</span>
            </div>
            <div class="timeline-date-location">
              <span class="timeline-date">${exp.duration}</span>
              <span class="timeline-location"><i class="fa-solid fa-location-dot" style="font-size:0.8rem; margin-right:4px;"></i> ${exp.location}</span>
            </div>
          </div>
          <ul class="timeline-bullets">
            ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join("")}
          </ul>
          <div class="timeline-tech-tags">
            ${exp.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join("")}
          </div>
        </div>
      </div>
    `;
  }).join("");

  // 4. Education Timeline Section
  const educationTimeline = document.getElementById("education-timeline");
  educationTimeline.innerHTML = data.education.map(edu => {
    const semestersList = edu.semesters && edu.semesters.length > 0 ? `
      <div class="education-semesters" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; border-top: 1px dashed var(--border-color); padding-top: 12px;">
        ${edu.semesters.map(sem => `
          <span class="tech-tag" style="background: rgba(99, 102, 241, 0.04); border-color: rgba(99, 102, 241, 0.12); color: var(--text-secondary); font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 4px; border: 1px solid var(--border-color);">
            <strong>${sem.name}:</strong> ${sem.gpa}
          </span>
        `).join("")}
      </div>
    ` : "";

    return `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="glass-card timeline-card">
          <div class="timeline-meta">
            <div class="timeline-title-group">
              <h3 class="timeline-role">${edu.degree}</h3>
              <span class="timeline-company">${edu.institution}</span>
            </div>
            <div class="timeline-date-location">
              <span class="timeline-date">${edu.duration}</span>
              <span class="tech-tag" style="margin-top: 5px; font-size: 0.75rem; font-weight: 700; align-self: flex-end; background: ${edu.status === 'Ongoing' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.05)'}; color: ${edu.status === 'Ongoing' ? 'var(--secondary)' : 'var(--text-secondary)'}; border-color: ${edu.status === 'Ongoing' ? 'rgba(16, 185, 129, 0.15)' : 'var(--border-color)'};">${edu.status || 'Completed'}</span>
              <span class="timeline-location"><i class="fa-solid fa-location-dot" style="font-size:0.8rem; margin-right:4px;"></i> ${edu.location}</span>
            </div>
          </div>
          <span class="education-grade">${edu.grade}</span>
          <ul class="timeline-bullets" style="margin-top: 10px;">
            ${edu.achievements.map(ach => `<li>${ach}</li>`).join("")}
          </ul>
          ${semestersList}
        </div>
      </div>
    `;
  }).join("");

  // 4.b Achievements Section
  const achievementsCardsGrid = document.getElementById("achievements-cards-grid");
  if (achievementsCardsGrid && data.achievements) {
    achievementsCardsGrid.innerHTML = data.achievements.map(ach => `
      <div class="glass-card achievement-card" style="display: flex; gap: 20px; align-items: flex-start;">
        <div class="achievement-icon" style="width: 48px; height: 48px; border-radius: 50%; background: rgba(245, 158, 11, 0.1); color: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; border: 1px solid rgba(245, 158, 11, 0.2); flex-shrink: 0;">
          <i class="fa-solid fa-trophy"></i>
        </div>
        <div class="achievement-content">
          <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">${ach.title}</h4>
          <p style="font-size: 0.95rem; color: var(--text-secondary);">${ach.description}</p>
        </div>
      </div>
    `).join("");
  }

  // 5. Technical Skills Section
  const skillsCategoriesGrid = document.getElementById("skills-categories-grid");
  
  // Icon selector based on category name
  const getCategoryIconClass = (category) => {
    const name = category.toLowerCase();
    if (name.includes("front")) return "fa-solid fa-laptop-code";
    if (name.includes("back") || name.includes("database")) return "fa-solid fa-server";
    if (name.includes("devops") || name.includes("cloud")) return "fa-solid fa-cloud";
    return "fa-solid fa-screwdriver-wrench";
  };

  skillsCategoriesGrid.innerHTML = data.skills.map(cat => `
    <div class="glass-card skills-category-card">
      <h3 class="skills-category-title">
        <i class="${getCategoryIconClass(cat.category)}"></i> ${cat.category}
      </h3>
      <div class="skills-list">
        ${cat.items.map(skill => `
          <div class="skill-item">
            <div class="skill-info">
              <span class="skill-name">${skill.name}</span>
              <span class="skill-percent">${skill.level}%</span>
            </div>
            <div class="skill-bar-outer">
              <!-- data-level keeps actual value; styles width 0% until animated -->
              <div class="skill-bar-inner" data-level="${skill.level}"></div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");

  // 6. Projects Portfolio Section
  const projectsListingGrid = document.getElementById("projects-listing-grid");
  const projectsFilterBar = document.getElementById("projects-filter-bar");
  
  // Generate categories from listing
  const allCategories = new Set(data.projects.map(p => p.category));
  
  // Append filter buttons dynamically
  allCategories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.setAttribute("data-filter", cat.toLowerCase());
    btn.textContent = cat;
    projectsFilterBar.appendChild(btn);
  });

  // Get project placeholder icon base on tech stack
  const getProjectIcon = (techStack) => {
    const techs = techStack.join(" ").toLowerCase();
    if (techs.includes("react") || techs.includes("next")) return "fa-brands fa-react";
    if (techs.includes("kubernetes") || techs.includes("docker")) return "fa-brands fa-docker";
    if (techs.includes("node") || techs.includes("express")) return "fa-brands fa-node-js";
    if (techs.includes("go")) return "fa-brands fa-golang";
    if (techs.includes("python") || techs.includes("flask")) return "fa-brands fa-python";
    return "fa-solid fa-gears";
  };

  // Build Project Cards HTML generator
  const renderProjects = (filterCategory = "all") => {
    const filtered = data.projects.filter(p => 
      filterCategory === "all" || p.category.toLowerCase() === filterCategory.toLowerCase()
    );
    
    projectsListingGrid.innerHTML = filtered.map(p => `
      <div class="glass-card project-card">
        <div class="project-visual">
          <div class="project-gradient" style="background: ${p.accentColor || 'var(--gradient-primary)'}"></div>
          <i class="${getProjectIcon(p.techStack)} project-icon-placeholder"></i>
        </div>
        <div class="project-info-container">
          <div class="project-meta">
            <span class="project-role">${p.role}</span>
            <span class="project-category">${p.category}</span>
          </div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-description">${p.description}</p>
          <div class="timeline-tech-tags" style="margin-bottom: 5px;">
            ${p.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join("")}
          </div>
          <div class="project-links">
            ${p.githubLink ? `<a href="${p.githubLink}" target="_blank" rel="noopener" class="project-link"><i class="fa-brands fa-github"></i> Code</a>` : ""}
            ${p.liveLink ? `<a href="${p.liveLink}" target="_blank" rel="noopener" class="project-link"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>` : ""}
          </div>
        </div>
      </div>
    `).join("");
  };

  // Perform initial project rendering
  renderProjects("all");

  // Project filtering event handlers
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      // Deactivate other tabs
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      
      // Activate clicked tab
      btn.classList.add("active");
      
      const filter = btn.getAttribute("data-filter");
      renderProjects(filter);
    });
  });

  // 7. Contact Details & Social Links
  const contactDetailsContainer = document.getElementById("contact-details-container");
  const contactDetails = [
    { icon: "fa-solid fa-envelope", label: "Email", value: `<a href="mailto:${data.personal.email}">${data.personal.email}</a>` },
    { icon: "fa-solid fa-phone", label: "Phone", value: `<a href="tel:${data.personal.phone}">${data.personal.phone}</a>` },
    { icon: "fa-solid fa-location-dot", label: "Office Location", value: data.personal.location }
  ];
  
  if (contactDetailsContainer) {
    contactDetailsContainer.innerHTML = contactDetails.map(item => `
      <div class="contact-method">
        <div class="contact-icon"><i class="${item.icon}"></i></div>
        <div class="contact-details">
          <span class="contact-label">${item.label}</span>
          <span class="contact-value">${item.value}</span>
        </div>
      </div>
    `).join("");
  }

  // Social handles
  const contactSocialsContainer = document.getElementById("contact-socials-container");
  const socials = [
    { name: "LinkedIn", icon: "fa-brands fa-linkedin-in", link: data.personal.linkedin },
    { name: "GitHub", icon: "fa-brands fa-github", link: data.personal.github },
    { name: "Twitter", icon: "fa-brands fa-twitter", link: data.personal.twitter }
  ];
  
  if (contactSocialsContainer) {
    contactSocialsContainer.innerHTML = socials.map(soc => `
      <a href="${soc.link}" target="_blank" rel="noopener" class="social-icon" aria-label="${soc.name}">
        <i class="${soc.icon}"></i>
      </a>
    `).join("");
  }

  // Footer year update
  const currentYear = new Date().getFullYear();
  document.getElementById("footer-copyright-text").innerHTML = `&copy; ${currentYear} ${data.personal.name}. All rights reserved.`;
  
  // Footer contact info populator
  const footerContactContainer = document.getElementById("footer-contact-container");
  if (footerContactContainer) {
    footerContactContainer.innerHTML = `
      <span><i class="fa-solid fa-envelope" style="color: var(--primary); margin-right: 6px;"></i><a href="mailto:${data.personal.email}" style="transition: var(--transition-fast);">${data.personal.email}</a></span>
      <span><i class="fa-solid fa-phone" style="color: var(--secondary); margin-right: 6px;"></i><a href="tel:${data.personal.phone}" style="transition: var(--transition-fast);">${data.personal.phone}</a></span>
      <span><i class="fa-solid fa-location-dot" style="color: var(--accent); margin-right: 6px;"></i>${data.personal.location}</span>
    `;
  }

  /* ==========================================================================
     INTERACTIVE ANIMATIONS & OBSERVATION INTERFACES
     ========================================================================== */
  
  // Intersection Observer for Skill Bar Fills
  const skillBars = document.querySelectorAll(".skill-bar-inner");
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const level = bar.getAttribute("data-level");
        bar.style.width = `${level}%`;
        skillObserver.unobserve(bar); // Trigger once
      }
    });
  }, { threshold: 0.1 });
  
  skillBars.forEach(bar => skillObserver.observe(bar));

  // Intersection Observer for Active Nav Link highlighting on scroll
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");
  
  const navScrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        // Verify this section actually has a corresponding navbar link
        const targetLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (targetLink) {
          navLinks.forEach(link => link.classList.remove("active"));
          targetLink.classList.add("active");
        }
      }
    });
  }, { threshold: 0.15, rootMargin: "-25% 0px -35% 0px" }); // Central band mapping

  sections.forEach(section => navScrollObserver.observe(section));

  // Auto-close mobile navigation menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (navMenu && navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        const icon = mobileMenuBtn.querySelector("i");
        if (icon) icon.className = "fa-solid fa-bars";
      }
    });
  });

  /* ==========================================================================
     INTEGRATIONS & SUBMISSIONS
     ========================================================================== */

  // PDF Export / Custom File Download Triggers
  const handlePdfTrigger = () => {
    // Check if mobile menu is open, if so close it
    if (navMenu) {
      navMenu.classList.remove("open");
      const mobileMenuIcon = mobileMenuBtn.querySelector("i");
      if (mobileMenuIcon) mobileMenuIcon.className = "fa-solid fa-bars";
    }

    if (data.personal.resumePdf) {
      // If pdf file data exists, trigger direct download
      const link = document.createElement("a");
      link.href = data.personal.resumePdf;
      link.download = `${data.personal.name.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Otherwise fallback to browser print dialog
      window.print();
    }
  };

  const pdfExportBtn = document.getElementById("pdf-export-btn");
  if (pdfExportBtn) {
    pdfExportBtn.addEventListener("click", handlePdfTrigger);
  }
  const mobilePdfExportBtn = document.getElementById("mobile-pdf-export-btn");
  if (mobilePdfExportBtn) {
    mobilePdfExportBtn.addEventListener("click", handlePdfTrigger);
  }
  const heroBtnPdf = document.getElementById("hero-btn-pdf");
  if (heroBtnPdf) {
    heroBtnPdf.addEventListener("click", handlePdfTrigger);
  }

  // Contact Form Submission Mock
  const contactForm = document.getElementById("contact-form-element");
  const feedbackStatus = document.getElementById("form-feedback-status");
  const submitBtn = document.getElementById("form-btn-submit");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      // Disable inputs & update submit button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `Sending... <i class="fa-solid fa-circle-notch fa-spin"></i>`;
      }
      if (feedbackStatus) {
        feedbackStatus.style.display = "none";
        feedbackStatus.className = "form-status";
      }

      // Simulate server side request duration (1s)
      setTimeout(() => {
        try {
          const name = document.getElementById("form-input-name").value;
          const email = document.getElementById("form-input-email").value;
          
          if (feedbackStatus) {
            feedbackStatus.classList.add("success");
            feedbackStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, <strong>${name}</strong>! Your message has been sent successfully. I will get back to you at <strong>${email}</strong> soon.`;
          }
          
          contactForm.reset();
        } catch (err) {
          if (feedbackStatus) {
            feedbackStatus.classList.add("error");
            feedbackStatus.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Oops, something went wrong. Please try submitting again.`;
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `Send Message <i class="fa-solid fa-paper-plane"></i>`;
          }
        }
      }, 1200);
    });
  }
});
