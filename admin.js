// Admin Dashboard Controller Application
document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     ADMIN LOGIN SECURITY GATE
     ========================================================================== */
  const loginWrapper = document.getElementById("admin-login-wrapper");
  const dashboardWrapper = document.getElementById("admin-dashboard-wrapper");
  const loginForm = document.getElementById("login-form");
  const loginUsernameInput = document.getElementById("login-username");
  const loginPasswordInput = document.getElementById("login-password");
  const loginErrorMsg = document.getElementById("login-error-msg");
  const logoutBtn = document.getElementById("logout-btn");

  const checkLoginState = () => {
    const isLoggedIn = sessionStorage.getItem("adminLoggedIn") === "true";
    if (isLoggedIn) {
      if (loginWrapper) loginWrapper.style.display = "none";
      if (dashboardWrapper) dashboardWrapper.style.display = "block";
    } else {
      if (loginWrapper) loginWrapper.style.display = "flex";
      if (dashboardWrapper) dashboardWrapper.style.display = "none";
    }
  };

  // Run initial check
  checkLoginState();

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const username = loginUsernameInput.value.trim();
      const password = loginPasswordInput.value;

      // Dynamic local credentials check (defaulting to admin / admin123)
      const savedUser = localStorage.getItem("adminUsername") || "admin";
      const savedPass = localStorage.getItem("adminPassword") || "admin123";

      if (username === savedUser && password === savedPass) {
        sessionStorage.setItem("adminLoggedIn", "true");
        loginErrorMsg.style.display = "none";
        
        // Lock open transition
        const lockIcon = document.getElementById("login-lock-icon");
        if (lockIcon) {
          lockIcon.className = "fa-solid fa-lock-open";
          lockIcon.style.color = "var(--secondary)";
          lockIcon.style.transform = "scale(1.2)";
        }
        
        setTimeout(() => {
          checkLoginState();
        }, 500);
      } else {
        loginErrorMsg.style.display = "block";
        loginPasswordInput.value = "";
        loginPasswordInput.focus();
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to log out of the admin panel?")) {
        sessionStorage.removeItem("adminLoggedIn");
        window.location.reload();
      }
    });
  }

  // Universal password visibility toggles
  document.querySelectorAll(".toggle-password-visibility").forEach(toggle => {
    toggle.addEventListener("click", () => {
      const targetId = toggle.getAttribute("data-target");
      const targetInput = document.getElementById(targetId);
      if (targetInput) {
        if (targetInput.type === "password") {
          targetInput.type = "text";
          toggle.classList.remove("fa-eye");
          toggle.classList.add("fa-eye-slash");
        } else {
          targetInput.type = "password";
          toggle.classList.remove("fa-eye-slash");
          toggle.classList.add("fa-eye");
        }
      }
    });
  });

  // Read dataset checking localStorage first
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
    showStatus("Failed to load resume database!", "error");
    return;
  }

  /* ==========================================================================
     THEME INITIALIZATION & CONTROL
     ========================================================================== */
  const themeToggle = document.getElementById("theme-toggle");
  const currentTheme = localStorage.getItem("theme") || "dark";
  
  // Apply initial theme
  document.documentElement.setAttribute("data-theme", currentTheme);
  
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      let theme = document.documentElement.getAttribute("data-theme");
      let targetTheme = theme === "dark" ? "light" : "dark";
      
      document.documentElement.setAttribute("data-theme", targetTheme);
      localStorage.setItem("theme", targetTheme);
    });
  }

  /* ==========================================================================
     PROFILE PICTURE FILE UPLOAD & CROP (Cropper.js)
     ========================================================================== */
  const profileImgFile = document.getElementById("p-img-file");
  const profileImgUrl = document.getElementById("p-img-url");
  const profileImgStatus = document.querySelector(".img-status-msg");

  const cropperModal = document.getElementById("cropper-modal");
  const cropperSourceImg = document.getElementById("cropper-source-img");
  const cropperCancelBtn = document.getElementById("cropper-cancel-btn");
  const cropperSaveBtn = document.getElementById("cropper-save-btn");
  let cropperInstance = null;

  if (profileImgFile) {
    profileImgFile.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Allow only images
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        profileImgFile.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        // Load image into crop source
        cropperSourceImg.src = event.target.result;
        cropperModal.style.display = "flex";

        // Initialize Cropper.js with 1:1 circle ratio
        if (cropperInstance) {
          cropperInstance.destroy();
        }

        cropperInstance = new Cropper(cropperSourceImg, {
          aspectRatio: 1,
          viewMode: 1,
          dragMode: 'move',
          autoCropArea: 0.9,
          restore: false,
          guides: true,
          center: true,
          highlight: false,
          cropBoxMovable: true,
          cropBoxResizable: true,
          toggleDragModeOnDblclick: false
        });
      };
      
      reader.onerror = () => {
        alert("Failed to read image file.");
      };

      reader.readAsDataURL(file);
    });
  }

  if (cropperCancelBtn) {
    cropperCancelBtn.addEventListener("click", () => {
      cropperModal.style.display = "none";
      if (cropperInstance) {
        cropperInstance.destroy();
        cropperInstance = null;
      }
      profileImgFile.value = "";
    });
  }

  if (cropperSaveBtn) {
    cropperSaveBtn.addEventListener("click", () => {
      if (!cropperInstance) return;

      profileImgStatus.textContent = "Processing crop...";
      profileImgStatus.style.color = "var(--primary)";

      // Get 300x300 canvas representation (fits standard avatar size with high optimization)
      const canvas = cropperInstance.getCroppedCanvas({
        width: 300,
        height: 300,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      });

      // Convert to Base64 JPEG at 85% quality
      const croppedBase64 = canvas.toDataURL("image/jpeg", 0.85);
      profileImgUrl.value = croppedBase64;
      
      // Calculate sizes in KB
      const sizeBytes = Math.round((croppedBase64.length - 22) * 3 / 4);
      profileImgStatus.textContent = `Cropped & Saved (${(sizeBytes / 1024).toFixed(1)} KB)`;
      profileImgStatus.style.color = "var(--secondary)";

      // Hide modal & cleanup
      cropperModal.style.display = "none";
      cropperInstance.destroy();
      cropperInstance = null;
      profileImgFile.value = "";
    });
  }

  /* ==========================================================================
     RESUME PDF FILE UPLOAD
     ========================================================================== */
  const resumePdfFile = document.getElementById("p-resume-file");
  const resumePdfUrl = document.getElementById("p-resume-url");
  const resumePdfStatus = document.querySelector(".resume-status-msg");

  if (resumePdfFile) {
    resumePdfFile.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.type !== "application/pdf") {
        alert("Please select a valid PDF document.");
        resumePdfFile.value = "";
        return;
      }

      if (file.size > 3 * 1024 * 1024) { // 3MB Limit
        alert("File is too large! Please upload a PDF smaller than 3MB.");
        resumePdfFile.value = "";
        return;
      }

      const reader = new FileReader();
      resumePdfStatus.textContent = "Encoding PDF...";
      resumePdfStatus.style.color = "var(--primary)";

      reader.onload = (event) => {
        resumePdfUrl.value = event.target.result;
        resumePdfStatus.textContent = `Encoded successfully (${(file.size / 1024).toFixed(1)} KB)`;
        resumePdfStatus.style.color = "var(--secondary)";
      };

      reader.onerror = () => {
        resumePdfStatus.textContent = "Error encoding PDF.";
        resumePdfStatus.style.color = "#ef4444";
      };

      reader.readAsDataURL(file);
    });
  }

  /* ==========================================================================
     TAB PANEL SWITCHER
     ========================================================================== */
  const tabButtons = document.querySelectorAll(".admin-tab-btn");
  const panels = document.querySelectorAll(".admin-panel");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Deactivate active selectors
      tabButtons.forEach(b => b.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      // Activate current selector
      btn.classList.add("active");
      const targetId = btn.getAttribute("data-target");
      document.getElementById(targetId).classList.add("active");
    });
  });

  /* ==========================================================================
     POPULATE PERSONAL INFO PANEL
     ========================================================================== */
  const populatePersonalForm = () => {
    document.getElementById("p-name").value = data.personal.name || "";
    document.getElementById("p-title").value = data.personal.title || "";
    document.getElementById("p-img-url").value = data.personal.profileImage || "";
    document.getElementById("p-resume-url").value = data.personal.resumePdf || "";
    document.getElementById("p-subtitle").value = data.personal.subtitle || "";
    document.getElementById("p-availability").value = data.personal.availability || "";
    document.getElementById("p-about").value = data.personal.about || "";
    document.getElementById("p-email").value = data.personal.email || "";
    document.getElementById("p-phone").value = data.personal.phone || "";
    document.getElementById("p-location").value = data.personal.location || "";
    document.getElementById("p-dob").value = data.personal.birthDate || "";
    document.getElementById("p-marital").value = data.personal.maritalStatus || "";
    document.getElementById("p-nationality").value = data.personal.nationality || "";
    document.getElementById("p-website").value = data.personal.website || "";
    document.getElementById("p-linkedin").value = data.personal.linkedin || "";
    document.getElementById("p-github").value = data.personal.github || "";
  };

  /* ==========================================================================
     DYNAMIC WORK EXPERIENCE MANAGER
     ========================================================================== */
  const expContainer = document.getElementById("experience-list-container");
  const addExpBtn = document.getElementById("add-experience-btn");

  const createBulletRow = (bulletText = "") => {
    const row = document.createElement("div");
    row.className = "bullet-editor-row";
    row.innerHTML = `
      <input type="text" class="form-input exp-bullet" value="${bulletText.replace(/"/g, '&quot;')}" placeholder="Achievement or job duty bullet point">
      <button type="button" class="btn-icon btn-remove-bullet" title="Remove Bullet"><i class="fa-solid fa-trash-can" style="color:#ef4444;"></i></button>
    `;
    
    row.querySelector(".btn-remove-bullet").addEventListener("click", () => {
      row.remove();
    });
    return row;
  };

  const addExperienceItem = (exp = {}) => {
    const item = document.createElement("div");
    item.className = "list-editor-item";
    item.innerHTML = `
      <button type="button" class="btn-delete remove-item-btn" title="Remove Role"><i class="fa-solid fa-trash-can"></i></button>
      <div class="list-item-header">Employment / Role</div>
      
      <div class="admin-form-row">
        <div class="form-group">
          <label>Job Title / Role</label>
          <input type="text" class="form-input exp-role" value="${exp.role || ''}" placeholder="e.g. Developer (Intern)" required>
        </div>
        <div class="form-group">
          <label>Company / Organization</label>
          <input type="text" class="form-input exp-company" value="${exp.company || ''}" placeholder="e.g. Future One World" required>
        </div>
      </div>

      <div class="admin-form-row">
        <div class="form-group">
          <label>Duration Timeline</label>
          <input type="text" class="form-input exp-duration" value="${exp.duration || ''}" placeholder="e.g. Feb 02, 2026 - May 02, 2026" required>
        </div>
        <div class="form-group">
          <label>Location</label>
          <input type="text" class="form-input exp-location" value="${exp.location || ''}" placeholder="e.g. Mumbai, India (Remote)" required>
        </div>
      </div>

      <div class="form-group">
        <label>Technologies Used (Comma separated)</label>
        <input type="text" class="form-input exp-tech" value="${exp.techStack ? exp.techStack.join(', ') : ''}" placeholder="e.g. React.js, Node.js, MySQL" required>
      </div>

      <div class="admin-form-row">
        <div class="form-group">
          <label>Certificate Link / URL (Optional)</label>
          <input type="text" class="form-input exp-cert-url" value="${exp.certificate || ''}" placeholder="e.g. https://drive.google.com/... (Recommended)">
        </div>
        <div class="form-group">
          <label>Or Upload Certificate (2MB Limit)</label>
          <input type="file" class="form-input exp-cert-file" accept="image/*,application/pdf">
          <span class="admin-input-help cert-status-msg" style="color:var(--secondary); display:block; margin-top:5px;"></span>
        </div>
      </div>

      <div class="form-group">
        <label style="display:flex; justify-content:space-between; align-items:center;">
          Key Achievements & Duties
          <button type="button" class="btn btn-secondary btn-add-bullet" style="padding:4px 10px; font-size:0.75rem; border-radius:10px;"><i class="fa-solid fa-plus"></i> Add Bullet</button>
        </label>
        <div class="bullets-editor exp-bullets-container">
          <!-- Bullet points rows appended here -->
        </div>
      </div>
    `;

    const bulletsContainer = item.querySelector(".exp-bullets-container");
    
    // Populate bullet lines
    if (exp.bullets && exp.bullets.length > 0) {
      exp.bullets.forEach(bullet => {
        bulletsContainer.appendChild(createBulletRow(bullet));
      });
    } else {
      bulletsContainer.appendChild(createBulletRow());
    }

    // Bind file upload to base64 encoding
    const certFileInput = item.querySelector(".exp-cert-file");
    const certUrlInput = item.querySelector(".exp-cert-url");
    const certStatusMsg = item.querySelector(".cert-status-msg");

    if (certFileInput) {
      certFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
          alert("File is too large! Please upload a file smaller than 2MB to keep the resume optimized.");
          certFileInput.value = "";
          return;
        }

        const reader = new FileReader();
        certStatusMsg.textContent = "Encoding file...";
        certStatusMsg.style.color = "var(--primary)";

        reader.onload = (event) => {
          certUrlInput.value = event.target.result;
          certStatusMsg.textContent = `Uploaded & Encoded (${(file.size / 1024).toFixed(1)} KB)`;
          certStatusMsg.style.color = "var(--secondary)";
        };

        reader.onerror = () => {
          certStatusMsg.textContent = "Error encoding file.";
          certStatusMsg.style.color = "#ef4444";
        };

        reader.readAsDataURL(file);
      });
    }

    // Bind bullet addition action
    item.querySelector(".btn-add-bullet").addEventListener("click", () => {
      bulletsContainer.appendChild(createBulletRow());
    });

    // Bind item deletion action
    item.querySelector(".remove-item-btn").addEventListener("click", () => {
      if (confirm("Are you sure you want to remove this work experience?")) {
        item.remove();
      }
    });

    expContainer.appendChild(item);
  };

  addExpBtn.addEventListener("click", () => addExperienceItem());

  /* ==========================================================================
     DYNAMIC EDUCATION MANAGER
     ========================================================================== */
  const eduContainer = document.getElementById("education-list-container");
  const addEduBtn = document.getElementById("add-education-btn");

  const createSemesterRow = (semName = "", gpaValue = "") => {
    const row = document.createElement("div");
    row.className = "bullet-editor-row semester-row-item";
    row.innerHTML = `
      <input type="text" class="form-input sem-name-input" value="${semName.replace(/"/g, '&quot;')}" placeholder="e.g. Semester 1" style="flex-grow: 2;" required>
      <input type="text" class="form-input sem-gpa-input" value="${gpaValue.replace(/"/g, '&quot;')}" placeholder="GPA e.g. 8.29" style="flex-grow: 1;" required>
      <button type="button" class="btn-icon btn-remove-semester" title="Remove Semester"><i class="fa-solid fa-trash-can" style="color:#ef4444;"></i></button>
    `;
    
    row.querySelector(".btn-remove-semester").addEventListener("click", () => {
      row.remove();
    });
    return row;
  };

  const addEducationItem = (edu = {}) => {
    const item = document.createElement("div");
    item.className = "list-editor-item";
    item.innerHTML = `
      <button type="button" class="btn-delete remove-item-btn" title="Remove Education"><i class="fa-solid fa-trash-can"></i></button>
      <div class="list-item-header">Academic Record</div>
      
      <div class="admin-form-row">
        <div class="form-group">
          <label>Degree / Certificate</label>
          <input type="text" class="form-input edu-degree" value="${edu.degree || ''}" placeholder="e.g. B.E. in Artificial Intelligence" required>
        </div>
        <div class="form-group">
          <label>Institution Name</label>
          <input type="text" class="form-input edu-institution" value="${edu.institution || ''}" placeholder="e.g. Thadomal Shahani College" required>
        </div>
      </div>

      <div class="admin-form-row">
        <div class="form-group">
          <label>Years / Duration (e.g. '2022 - 2026')</label>
          <input type="text" class="form-input edu-duration" value="${edu.duration || ''}" placeholder="e.g. 2022 - 2026" required>
        </div>
        <div class="form-group">
          <label>Status (e.g. 'Ongoing' or 'Completed')</label>
          <input type="text" class="form-input edu-status" value="${edu.status || 'Completed'}" placeholder="e.g. Ongoing or Completed" required>
        </div>
      </div>

      <div class="admin-form-row">
        <div class="form-group">
          <label>Location</label>
          <input type="text" class="form-input edu-location" value="${edu.location || ''}" placeholder="e.g. Mumbai, India" required>
        </div>
        <div class="form-group">
          <label>Grades / GPA / Percentage</label>
          <input type="text" class="form-input edu-grade" value="${edu.grade || ''}" placeholder="e.g. CGPA: 8.29 or Percentage: 84.40%" required>
        </div>
      </div>

      <div class="form-group">
        <label style="display:flex; justify-content:space-between; align-items:center;">
          Semester Pointers / GPAs (Optional)
          <button type="button" class="btn btn-secondary btn-add-semester" style="padding:4px 10px; font-size:0.75rem; border-radius:10px;"><i class="fa-solid fa-plus"></i> Add Semester</button>
        </label>
        <div class="bullets-editor edu-semesters-container" style="gap: 10px; margin-top: 10px;">
          <!-- Semester entries -->
        </div>
      </div>

      <div class="form-group">
        <label style="display:flex; justify-content:space-between; align-items:center;">
          Honors & Highlights
          <button type="button" class="btn btn-secondary btn-add-bullet" style="padding:4px 10px; font-size:0.75rem; border-radius:10px;"><i class="fa-solid fa-plus"></i> Add Bullet</button>
        </label>
        <div class="bullets-editor edu-bullets-container">
          <!-- Bullet lines -->
        </div>
      </div>
    `;

    const bulletsContainer = item.querySelector(".edu-bullets-container");
    const semestersContainer = item.querySelector(".edu-semesters-container");
    
    // Populate bullets
    if (edu.achievements && edu.achievements.length > 0) {
      edu.achievements.forEach(bullet => {
        bulletsContainer.appendChild(createBulletRow(bullet));
      });
    } else {
      bulletsContainer.appendChild(createBulletRow());
    }

    // Populate semesters
    if (edu.semesters && edu.semesters.length > 0) {
      edu.semesters.forEach(sem => {
        semestersContainer.appendChild(createSemesterRow(sem.name, sem.gpa));
      });
    }

    item.querySelector(".btn-add-semester").addEventListener("click", () => {
      semestersContainer.appendChild(createSemesterRow());
    });

    item.querySelector(".btn-add-bullet").addEventListener("click", () => {
      bulletsContainer.appendChild(createBulletRow());
    });

    item.querySelector(".remove-item-btn").addEventListener("click", () => {
      if (confirm("Are you sure you want to remove this academic entry?")) {
        item.remove();
      }
    });

    eduContainer.appendChild(item);
  };

  addEduBtn.addEventListener("click", () => addEducationItem());

  /* ==========================================================================
     DYNAMIC SKILLS LIST MANAGER
     ========================================================================== */
  const skillsContainer = document.getElementById("skills-list-container");

  const createSkillItemRow = (skillName = "", level = 80) => {
    const row = document.createElement("div");
    row.className = "bullet-editor-row skill-row-item";
    row.innerHTML = `
      <input type="text" class="form-input skill-name-input" value="${skillName}" placeholder="Skill name" style="flex-grow:2;" required>
      <input type="range" class="skill-range-input" min="0" max="100" value="${level}" style="flex-grow:2;">
      <span class="skill-percent-display" style="width:40px; font-weight:600; font-size:0.9rem; text-align:right;">${level}%</span>
      <button type="button" class="btn-icon btn-remove-skill" title="Remove Skill"><i class="fa-solid fa-trash-can" style="color:#ef4444;"></i></button>
    `;

    const range = row.querySelector(".skill-range-input");
    const display = row.querySelector(".skill-percent-display");
    range.addEventListener("input", (e) => {
      display.textContent = `${e.target.value}%`;
    });

    row.querySelector(".btn-remove-skill").addEventListener("click", () => {
      row.remove();
    });

    return row;
  };

  const addSkillCategoryPanel = (cat = {}) => {
    const panel = document.createElement("div");
    panel.className = "list-editor-item skill-category-item";
    panel.innerHTML = `
      <div class="list-item-header" style="display:flex; justify-content:space-between; align-items:center; padding-bottom:5px;">
        <input type="text" class="form-input skill-category-name" value="${cat.category || ''}" placeholder="Category Title" style="max-width:300px; font-weight:700; font-size:1.15rem;" required>
        <button type="button" class="btn btn-secondary btn-add-skill-row" style="padding:4px 10px; font-size:0.75rem; border-radius:10px;"><i class="fa-solid fa-plus"></i> Add Skill</button>
      </div>
      <div class="bullets-editor skill-items-list" style="gap:15px; margin-top:10px;">
        <!-- Skill items appended here -->
      </div>
    `;

    const itemsList = panel.querySelector(".skill-items-list");
    if (cat.items && cat.items.length > 0) {
      cat.items.forEach(sk => {
        itemsList.appendChild(createSkillItemRow(sk.name, sk.level));
      });
    } else {
      itemsList.appendChild(createSkillItemRow());
    }

    panel.querySelector(".btn-add-skill-row").addEventListener("click", () => {
      itemsList.appendChild(createSkillItemRow());
    });

    skillsContainer.appendChild(panel);
  };

  /* ==========================================================================
     DYNAMIC PROJECTS MANAGER
     ========================================================================== */
  const projectsContainer = document.getElementById("projects-list-container");
  const addProjBtn = document.getElementById("add-project-btn");

  const addProjectItem = (proj = {}) => {
    const item = document.createElement("div");
    item.className = "list-editor-item";
    item.innerHTML = `
      <button type="button" class="btn-delete remove-item-btn" title="Remove Project"><i class="fa-solid fa-trash-can"></i></button>
      <div class="list-item-header">Portfolio Project</div>

      <div class="admin-form-row">
        <div class="form-group">
          <label>Project Title</label>
          <input type="text" class="form-input proj-title" value="${proj.title || ''}" placeholder="e.g. Market Trend Predictor" required>
        </div>
        <div class="form-group">
          <label>Category Label</label>
          <input type="text" class="form-input proj-category" value="${proj.category || ''}" placeholder="e.g. AI & ML or Fullstack" required>
        </div>
      </div>

      <div class="admin-form-row">
        <div class="form-group">
          <label>Your Role</label>
          <input type="text" class="form-input proj-role" value="${proj.role || ''}" placeholder="e.g. Lead Architect" required>
        </div>
        <div class="form-group">
          <label>Visual Accent Gradient / Color</label>
          <input type="text" class="form-input proj-color" value="${proj.accentColor || ''}" placeholder="e.g. linear-gradient(135deg, #667eea, #764ba2)" required>
        </div>
      </div>

      <div class="form-group">
        <label>Project Description</label>
        <textarea class="form-input proj-description" required>${proj.description || ''}</textarea>
      </div>

      <div class="form-group">
        <label>Technologies Used (Comma separated)</label>
        <input type="text" class="form-input proj-tech" value="${proj.techStack ? proj.techStack.join(', ') : ''}" placeholder="e.g. Python, RAG, WebRTC" required>
      </div>

      <div class="admin-form-row">
        <div class="form-group">
          <label>GitHub Code Link (Optional)</label>
          <input type="url" class="form-input proj-github" value="${proj.githubLink || ''}" placeholder="https://github.com/...">
        </div>
        <div class="form-group">
          <label>Live Website Link (Optional)</label>
          <input type="url" class="form-input proj-live" value="${proj.liveLink || ''}" placeholder="https://...">
        </div>
      </div>
    `;

    item.querySelector(".remove-item-btn").addEventListener("click", () => {
      if (confirm("Are you sure you want to remove this project?")) {
        item.remove();
      }
    });

    projectsContainer.appendChild(item);
  };

  addProjBtn.addEventListener("click", () => addProjectItem());

  /* ==========================================================================
     DYNAMIC ACHIEVEMENTS MANAGER
     ========================================================================== */
  const achievementsContainer = document.getElementById("achievements-list-container");
  const addAchBtn = document.getElementById("add-achievement-btn");

  const addAchievementItem = (ach = {}) => {
    const item = document.createElement("div");
    item.className = "list-editor-item";
    item.innerHTML = `
      <button type="button" class="btn-delete remove-item-btn" title="Remove Award"><i class="fa-solid fa-trash-can"></i></button>
      <div class="list-item-header">Award / Distinction</div>

      <div class="form-group">
        <label>Distinction Title</label>
        <input type="text" class="form-input ach-title" value="${ach.title || ''}" placeholder="e.g. Ms. Raju Hari Nain Scholarship" required>
      </div>

      <div class="form-group">
        <label>Description details</label>
        <textarea class="form-input ach-desc" required>${ach.description || ''}</textarea>
      </div>
    `;

    item.querySelector(".remove-item-btn").addEventListener("click", () => {
      if (confirm("Are you sure you want to remove this achievement?")) {
        item.remove();
      }
    });

    achievementsContainer.appendChild(item);
  };

  addAchBtn.addEventListener("click", () => addAchievementItem());

  /* ==========================================================================
     LOAD AND POPULATE ENTIRE DATA ON STARTUP
     ========================================================================== */
  const loadDatabase = () => {
    // 1. Personal fields
    populatePersonalForm();

    // 2. Experience
    expContainer.innerHTML = "";
    if (data.experience && data.experience.length > 0) {
      data.experience.forEach(exp => addExperienceItem(exp));
    }

    // 3. Academics
    eduContainer.innerHTML = "";
    if (data.education && data.education.length > 0) {
      data.education.forEach(edu => addEducationItem(edu));
    }

    // 4. Skills
    skillsContainer.innerHTML = "";
    if (data.skills && data.skills.length > 0) {
      data.skills.forEach(cat => addSkillCategoryPanel(cat));
    }

    // 5. Projects
    projectsContainer.innerHTML = "";
    if (data.projects && data.projects.length > 0) {
      data.projects.forEach(p => addProjectItem(p));
    }

    // 6. Achievements
    achievementsContainer.innerHTML = "";
    if (data.achievements && data.achievements.length > 0) {
      data.achievements.forEach(ach => addAchievementItem(ach));
    }
  };

  // Perform load on startup
  loadDatabase();

  /* ==========================================================================
     FORM SERIALIZATION & OBJECT BUILDER
     ========================================================================== */
  const serializeResumeState = () => {
    const state = {};

    // 1. Personal details
    state.personal = {
      name: document.getElementById("p-name").value.trim(),
      title: document.getElementById("p-title").value.trim(),
      profileImage: document.getElementById("p-img-url").value.trim(),
      resumePdf: document.getElementById("p-resume-url").value.trim(),
      subtitle: document.getElementById("p-subtitle").value.trim(),
      availability: document.getElementById("p-availability").value.trim(),
      email: document.getElementById("p-email").value.trim(),
      phone: document.getElementById("p-phone").value.trim(),
      location: document.getElementById("p-location").value.trim(),
      website: document.getElementById("p-website").value.trim(),
      linkedin: document.getElementById("p-linkedin").value.trim(),
      github: document.getElementById("p-github").value.trim(),
      twitter: data.personal.twitter || "", // Preserve if existing
      about: document.getElementById("p-about").value.trim(),
      birthDate: document.getElementById("p-dob").value.trim(),
      maritalStatus: document.getElementById("p-marital").value.trim(),
      nationality: document.getElementById("p-nationality").value.trim()
    };

    // Validation
    if (!state.personal.name || !state.personal.title) {
      throw new Error("Personal Name and Role Title are required fields.");
    }

    // 2. Experience Lists
    state.experience = [];
    const expItems = expContainer.querySelectorAll(".list-editor-item");
    expItems.forEach(item => {
      const role = item.querySelector(".exp-role").value.trim();
      const company = item.querySelector(".exp-company").value.trim();
      const duration = item.querySelector(".exp-duration").value.trim();
      const location = item.querySelector(".exp-location").value.trim();
      const techVal = item.querySelector(".exp-tech").value.trim();
      const certificate = item.querySelector(".exp-cert-url").value.trim();
      
      const bullets = [];
      item.querySelectorAll(".exp-bullet").forEach(b => {
        const txt = b.value.trim();
        if (txt) bullets.push(txt);
      });

      if (role && company) {
        state.experience.push({
          role,
          company,
          location,
          duration,
          bullets,
          techStack: techVal ? techVal.split(",").map(t => t.trim()).filter(Boolean) : [],
          certificate
        });
      }
    });

    // 3. Education Lists
    state.education = [];
    const eduItems = eduContainer.querySelectorAll(".list-editor-item");
    eduItems.forEach(item => {
      const degree = item.querySelector(".edu-degree").value.trim();
      const institution = item.querySelector(".edu-institution").value.trim();
      const duration = item.querySelector(".edu-duration").value.trim();
      const status = item.querySelector(".edu-status").value.trim();
      const location = item.querySelector(".edu-location").value.trim();
      const grade = item.querySelector(".edu-grade").value.trim();

      const achievements = [];
      item.querySelectorAll(".exp-bullet").forEach(b => {
        const txt = b.value.trim();
        if (txt) achievements.push(txt);
      });

      const semesters = [];
      item.querySelectorAll(".semester-row-item").forEach(semRow => {
        const name = semRow.querySelector(".sem-name-input").value.trim();
        const gpa = semRow.querySelector(".sem-gpa-input").value.trim();
        if (name && gpa) {
          semesters.push({ name, gpa });
        }
      });

      if (degree && institution) {
        state.education.push({
          degree,
          institution,
          location,
          duration,
          status,
          grade,
          achievements,
          semesters
        });
      }
    });

    // 4. Skills Lists
    state.skills = [];
    const skillCats = skillsContainer.querySelectorAll(".skill-category-item");
    skillCats.forEach(catPanel => {
      const category = catPanel.querySelector(".skill-category-name").value.trim();
      const items = [];
      
      catPanel.querySelectorAll(".skill-row-item").forEach(row => {
        const name = row.querySelector(".skill-name-input").value.trim();
        const level = parseInt(row.querySelector(".skill-range-input").value, 10);
        if (name) {
          items.push({ name, level });
        }
      });

      if (category && items.length > 0) {
        state.skills.push({ category, items });
      }
    });

    // 5. Projects Lists
    state.projects = [];
    const projItems = projectsContainer.querySelectorAll(".list-editor-item");
    projItems.forEach(item => {
      const title = item.querySelector(".proj-title").value.trim();
      const category = item.querySelector(".proj-category").value.trim();
      const role = item.querySelector(".proj-role").value.trim();
      const accentColor = item.querySelector(".proj-color").value.trim();
      const description = item.querySelector(".proj-description").value.trim();
      const techVal = item.querySelector(".proj-tech").value.trim();
      const githubLink = item.querySelector(".proj-github").value.trim();
      const liveLink = item.querySelector(".proj-live").value.trim();

      if (title) {
        state.projects.push({
          title,
          description,
          category,
          role,
          techStack: techVal ? techVal.split(",").map(t => t.trim()).filter(Boolean) : [],
          githubLink,
          liveLink,
          accentColor: accentColor || "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)"
        });
      }
    });

    // 6. Achievements Lists
    state.achievements = [];
    const achItems = achievementsContainer.querySelectorAll(".list-editor-item");
    achItems.forEach(item => {
      const title = item.querySelector(".ach-title").value.trim();
      const description = item.querySelector(".ach-desc").value.trim();

      if (title && description) {
        state.achievements.push({ title, description });
      }
    });

    // Preserve metadata values not exposed directly in forms
    state.interests = data.interests || [];
    state.languages = data.languages || [];
    state.activities = data.activities || [];

    return state;
  };

  /* ==========================================================================
     GLOBAL TRIGGER CONTROLLERS (SAVE, RESET, EXPORT)
     ========================================================================== */

  // Save changes locally
  const saveLocalBtn = document.getElementById("save-local-btn");
  saveLocalBtn.addEventListener("click", () => {
    try {
      const state = serializeResumeState();
      localStorage.setItem("customResumeData", JSON.stringify(state));
      // Update running memory database
      data = state;
      showStatus("Resume changes successfully saved to local browser storage!", "success");
    } catch (e) {
      showStatus(e.message || "Failed to save state. Please check form validation.", "error");
    }
  });

  // Export config file download
  const exportFileBtn = document.getElementById("export-file-btn");
  exportFileBtn.addEventListener("click", () => {
    try {
      const state = serializeResumeState();
      
      // Build Javascript text contents formatting block
      const fileContent = `// Personal Portfolio and Resume Data - Mathesh Nadar
const resumeData = ${JSON.stringify(state, null, 2)};

// Export data for browser inclusion or node context (supporting both ES modules, CommonJS and standard browser global)
window.resumeData = resumeData;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = resumeData;
}
`;

      const blob = new Blob([fileContent], { type: "application/javascript;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = "resume-data.js";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showStatus("File configurations generated successfully. Save this download into your project directory!", "success");
    } catch (e) {
      showStatus("Serialization failed! " + e.message, "error");
    }
  });

  // Import file configurations
  const importFileBtn = document.getElementById("import-file-btn");
  const importFileInput = document.getElementById("import-file-input");

  if (importFileBtn && importFileInput) {
    importFileBtn.addEventListener("click", () => {
      importFileInput.click();
    });

    importFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target.result;
          let parsedData = null;

          // Attempt to parse content as JSON first
          try {
            parsedData = JSON.parse(content);
          } catch (jsonErr) {
            // If JSON fails, it might be an exported JS file.
            // Isolate everything before the export definitions to avoid matching JS block brackets
            const parts = content.split("// Export data");
            const dataPart = parts[0];

            const startIdx = dataPart.indexOf("{");
            const endIdx = dataPart.lastIndexOf("}");
            if (startIdx !== -1 && endIdx !== -1) {
              const jsonSubstring = dataPart.substring(startIdx, endIdx + 1);
              parsedData = JSON.parse(jsonSubstring);
            } else {
              throw new Error("Could not find resume data object inside the selected file.");
            }
          }

          // Validate that the parsed object has standard keys like "personal"
          if (!parsedData || !parsedData.personal || !parsedData.personal.name) {
            throw new Error("Invalid file format. Make sure the file contains your personal resume details.");
          }

          // Save to localStorage
          localStorage.setItem("customResumeData", JSON.stringify(parsedData));
          
          // Show status and reload
          showStatus("Resume configuration imported successfully! Reloading fields...", "success");
          setTimeout(() => {
            window.location.reload();
          }, 1500);

        } catch (err) {
          showStatus("Import failed: " + err.message, "error");
        }
      };
      reader.readAsText(file);
      // Clear input so same file can be re-selected if needed
      importFileInput.value = "";
    });
  }

  // Reset to static code values
  const resetDataBtn = document.getElementById("reset-data-btn");
  if (resetDataBtn) {
    resetDataBtn.addEventListener("click", () => {
      if (confirm("This will erase all changes you made in the browser and load default records. Continue?")) {
        localStorage.removeItem("customResumeData");
        window.location.reload();
      }
    });
  }

  // UI helper for feedback notifications
  function showStatus(message, type) {
    const feedback = document.getElementById("admin-status-message");
    feedback.style.display = "block";
    feedback.className = `form-status ${type}`;
    feedback.innerHTML = type === "success" 
      ? `<i class="fa-solid fa-circle-check"></i> ${message}`
      : `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
    
    // Auto-scroll to status area
    feedback.scrollIntoView({ behavior: "smooth", block: "center" });
    
    // Auto fade after 5 seconds on success
    if (type === "success") {
      setTimeout(() => {
        feedback.style.display = "none";
      }, 5000);
    }
  }

  /* ==========================================================================
     ACCESS SECURITY CREDENTIALS UPDATE FORM
     ========================================================================== */
  const settingsForm = document.getElementById("settings-form");
  const settingsUser = document.getElementById("settings-username");
  const settingsPass = document.getElementById("settings-password");
  const settingsConfirm = document.getElementById("settings-confirm-password");

  if (settingsForm) {
    // Populate current username on loads
    settingsUser.value = localStorage.getItem("adminUsername") || "admin";

    settingsForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const userVal = settingsUser.value.trim();
      const passVal = settingsPass.value;
      const confirmVal = settingsConfirm.value;

      if (!userVal) {
        alert("Username cannot be blank!");
        return;
      }

      if (passVal !== confirmVal) {
        alert("New passwords do not match! Please check your entry.");
        return;
      }

      if (passVal.length < 4) {
        alert("Password must be at least 4 characters long!");
        return;
      }

      // Save credentials locally
      localStorage.setItem("adminUsername", userVal);
      localStorage.setItem("adminPassword", passVal);

      // Clear input fields
      settingsPass.value = "";
      settingsConfirm.value = "";

      showStatus("Admin access credentials updated successfully!", "success");
    });
  }

  /* ==========================================================================
     GITHUB AUTO-SYNC CMS INTEGRATION
     ========================================================================== */
  const githubSyncForm = document.getElementById("github-sync-form");
  const githubRepoInput = document.getElementById("github-repo");
  const githubTokenInput = document.getElementById("github-token");
  const githubSyncBtn = document.getElementById("github-sync-btn");

  if (githubSyncForm) {
    // Populate stored GitHub configuration on load
    githubRepoInput.value = localStorage.getItem("githubRepo") || "mathesh99/Resume";
    githubTokenInput.value = localStorage.getItem("githubToken") || "";

    // Save GitHub configuration listener
    githubSyncForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const repoVal = githubRepoInput.value.trim();
      const tokenVal = githubTokenInput.value.trim();

      if (!repoVal || !tokenVal) {
        alert("Both Repository Path and Token are required!");
        return;
      }

      localStorage.setItem("githubRepo", repoVal);
      localStorage.setItem("githubToken", tokenVal);

      showStatus("GitHub configurations saved successfully!", "success");
    });
  }

  if (githubSyncBtn) {
    githubSyncBtn.addEventListener("click", async () => {
      const repo = localStorage.getItem("githubRepo") || "mathesh99/Resume";
      const token = localStorage.getItem("githubToken");

      if (!token) {
        // Switch tab to the GitHub settings view to help the user configure PAT credentials
        const tabBtn = document.querySelector('.admin-tab-btn[data-target="panel-github"]');
        if (tabBtn) {
          tabBtn.click();
        }
        alert("Please enter and save your GitHub Personal Access Token (PAT) first to enable auto-sync!");
        return;
      }

      // Display loading state
      githubSyncBtn.disabled = true;
      const originalHtml = githubSyncBtn.innerHTML;
      githubSyncBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Syncing...`;
      showStatus("Connecting to GitHub API, serializing data...", "success");

      try {
        // 1. Serialize active workspace data state
        const state = serializeResumeState();
        const fileContent = `// Personal Portfolio and Resume Data - Mathesh Nadar
const resumeData = ${JSON.stringify(state, null, 2)};

// Export data for browser inclusion or node context (supporting both ES modules, CommonJS and standard browser global)
window.resumeData = resumeData;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = resumeData;
}
`;

        const targetFilePath = "resume-data.js";
        const apiUrl = `https://api.github.com/repos/${repo}/contents/${targetFilePath}`;

        // 2. Fetch the target file's current SHA from GitHub API
        const getResponse = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/vnd.github.v3+json"
          }
        });

        let fileSha = "";
        if (getResponse.ok) {
          const fileData = await getResponse.json();
          fileSha = fileData.sha;
        } else if (getResponse.status !== 404) {
          // 404 means the file doesn't exist yet (which is fine, we will create it), other errors are critical
          const errData = await getResponse.json();
          throw new Error(errData.message || "Failed to fetch file metadata from GitHub.");
        }

        // 3. Convert content text into UTF-8 base64 encoding (btoa requires character escaping for Unicode compatibility)
        // Chunk encoding avoids maximum call stack size limits on Function.prototype.apply for large image/PDF assets
        const utf8Bytes = new TextEncoder().encode(fileContent);
        let binaryString = "";
        const len = utf8Bytes.byteLength;
        const chunkSize = 65536; // 64KB chunks
        for (let i = 0; i < len; i += chunkSize) {
          const chunk = utf8Bytes.subarray(i, i + chunkSize);
          binaryString += String.fromCharCode.apply(null, chunk);
        }
        const base64Content = btoa(binaryString);

        // 4. Send PUT request to update the file in the repository
        const putResponse = await fetch(apiUrl, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/vnd.github.v3+json"
          },
          body: JSON.stringify({
            message: "Update resume data via Admin Dashboard Sync",
            content: base64Content,
            sha: fileSha || undefined
          })
        });

        if (!putResponse.ok) {
          const errData = await putResponse.json();
          throw new Error(errData.message || "Failed to update file content on GitHub.");
        }

        showStatus("Successfully synchronized data back to GitHub! Pages deployment started. Live in 30 seconds.", "success");
        alert("Successfully synchronized! GitHub Pages will rebuild. The changes will be live globally in 30-45 seconds!");

      } catch (err) {
        showStatus("GitHub Sync failed: " + err.message, "error");
        alert("Sync failed: " + err.message);
      } finally {
        githubSyncBtn.disabled = false;
        githubSyncBtn.innerHTML = originalHtml;
      }
    });
  }
});
