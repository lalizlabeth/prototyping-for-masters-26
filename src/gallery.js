import { projects, projectTypes } from "./projects.js";

// projectTypes is listed in course order, so a higher index is a more recent collection.
const typeOrder = new Map(projectTypes.map(({ id }, index) => [id, index]));

// Projects are already sorted by student, so each group's names stay alphabetical
// and the card appears where its first member would.
const groupSharedProjects = (entries) => {
  const groups = [];
  const indexByPath = new Map();
  for (const project of entries) {
    const existing = indexByPath.get(project.path);
    if (existing === undefined) {
      indexByPath.set(project.path, groups.length);
      groups.push({ project, names: [project.student] });
    } else {
      groups[existing].names.push(project.student);
    }
  }
  return groups;
};

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]);

export const galleryMarkup = `
  <div class="work-toolbar">
    <div class="work-views" role="group" aria-label="Browse student work">
      <button type="button" data-view="students" aria-pressed="true">Student sites</button>
      <button type="button" data-view="projects" aria-pressed="false">Projects</button>
    </div>
    <div class="gallery-filters" hidden>
      <div class="week-control">
        <select id="week-filter" aria-label="Filter by week and project">
          <option value="all">All projects</option>
          ${projectTypes.map(({ id, week, title }) => `<option value="${id}">Week ${week} — ${escapeHtml(title)}</option>`).join("")}
        </select>
      </div>
    </div>
  </div>
  <div class="project-gallery" hidden>
    <div class="gallery-heading">
      <h2 id="gallery-title">All projects</h2>
      <p class="gallery-count" role="status" aria-live="polite"></p>
    </div>
    <ul class="project-grid" aria-labelledby="gallery-title"></ul>
  </div>
`;

export function initGallery(students) {
  const gallery = document.querySelector(".project-gallery");
  const grid = document.querySelector(".project-grid");
  const title = document.querySelector("#gallery-title");
  const count = document.querySelector(".gallery-count");
  const directory = document.querySelector(".student-list");
  const filter = document.querySelector("#week-filter");
  const viewButtons = [...document.querySelectorAll("[data-view]")];
  const studentByName = new Map(students.map((student) => [student.name, student]));
  let view = "students";
  let selectedType = "all";

  const render = () => {
    const showProjects = view === "projects";
    gallery.hidden = !showProjects;
    directory.hidden = showProjects;
    document.querySelector(".gallery-filters").hidden = !showProjects;
    document.querySelector(".site-preview").classList.remove("is-visible");
    viewButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.view === view)));
    filter.value = selectedType;
    if (!showProjects) return;

    const collection = projectTypes.find(({ id }) => id === selectedType);
    const visibleProjects = projects
      .filter((project) => selectedType === "all" || project.type === selectedType)
      .sort((a, b) => a.student.localeCompare(b.student, "en")
        || typeOrder.get(b.type) - typeOrder.get(a.type)
        || a.title.localeCompare(b.title, "en"));
    const showTypes = new Set(visibleProjects.map(({ type }) => type)).size > 1;
    title.textContent = collection ? `Week ${collection.week} - ${collection.title}` : "All projects";
    // Shared arcades stay one record per student so All projects can list each person.
    // The Arcades collection collapses those records into one card per project.
    const arcadeGroups = selectedType === "arcades" ? groupSharedProjects(visibleProjects) : null;
    const displayedCount = arcadeGroups ? arcadeGroups.length : visibleProjects.length;
    const studentCount = new Set(visibleProjects.map(({ student }) => student)).size;
    count.textContent = `${displayedCount} ${displayedCount === 1 ? "project" : "projects"} · ${studentCount} ${studentCount === 1 ? "student" : "students"}`;
    const projectCard = (project, index, showStudent = true, names = null) => {
      const members = names ?? [project.student];
      const student = studentByName.get(members[0]);
      const url = new URL(project.path, student.url).href;
      const isGroup = members.length > 1;
      const byline = members.join(", ");
      const studentsMarkup = members.map((name) => `<span class="project-student">${escapeHtml(name)}</span>`).join("");
      return `
        <li class="project-card">
          <a class="project-link" href="${escapeHtml(url)}" target="_blank" rel="noreferrer" aria-label="Open ${escapeHtml(project.title)} by ${escapeHtml(byline)} (new tab)">
            <div class="project-image">
              <span class="preview-fallback">Preview unavailable<span>Open project ↗</span></span>
              <img src="${escapeHtml(project.preview)}" alt="" width="1440" height="900" loading="${index < 3 ? "eager" : "lazy"}" decoding="async" />
            </div>
            <div class="project-caption${isGroup ? " is-group" : ""}">
              ${showStudent && !isGroup ? studentsMarkup : ""}
              <span class="project-week">Week ${project.week}${showTypes ? `: ${escapeHtml(projectTypes.find(({ id }) => id === project.type).title)}` : ""}</span>
              <h3>${escapeHtml(project.title)}</h3>
              ${showStudent && isGroup ? `<div class="project-students">${studentsMarkup}</div>` : ""}
            </div>
          </a>
        </li>`;
    };
    const groupedByStudent = selectedType === "all";
    grid.classList.toggle("student-project-rows", groupedByStudent);
    if (groupedByStudent) {
      const projectsByStudent = new Map();
      visibleProjects.forEach((project) => {
        projectsByStudent.set(project.student, [...(projectsByStudent.get(project.student) ?? []), project]);
      });
      grid.innerHTML = [...projectsByStudent].map(([studentName, studentProjects], rowIndex) => `
        <li class="student-project-row">
          <div class="student-row-heading">
            <h3 class="project-student">${escapeHtml(studentName)}</h3>
            <div class="student-row-controls">
              <button type="button" data-direction="-1" aria-label="Previous projects by ${escapeHtml(studentName)}">&lt;</button>
              <button type="button" data-direction="1" aria-label="Next projects by ${escapeHtml(studentName)}">&gt;</button>
            </div>
          </div>
          <ul class="student-project-track" aria-label="Projects by ${escapeHtml(studentName)}">
            ${studentProjects.map((project, index) => projectCard(project, rowIndex === 0 ? index : 3, false)).join("")}
          </ul>
        </li>`).join("");
      grid.querySelectorAll(".student-project-row").forEach((row) => {
        const track = row.querySelector(".student-project-track");
        const [previous, next] = row.querySelectorAll("button");
        const updateControls = () => {
          previous.disabled = track.scrollLeft <= 1;
          next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
        };
        row.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
          const card = track.querySelector(".project-card");
          const step = card.offsetWidth + parseFloat(getComputedStyle(track).columnGap);
          const visibleCards = Math.max(1, Math.floor((track.clientWidth + 1) / step));
          track.scrollBy({ left: Number(button.dataset.direction) * visibleCards * step, behavior: "smooth" });
        }));
        track.addEventListener("scroll", updateControls, { passive: true });
        new ResizeObserver(updateControls).observe(track);
        updateControls();
      });
    } else if (arcadeGroups) {
      grid.innerHTML = arcadeGroups.map(({ project, names }, index) => projectCard(project, index, true, names)).join("");
    } else {
      grid.innerHTML = visibleProjects.map((project, index) => projectCard(project, index)).join("");
    }
    if (!visibleProjects.length) {
      grid.innerHTML = `<li class="gallery-empty">No project links for this collection yet. Choose another collection or browse the student sites.</li>`;
    }
    grid.querySelectorAll("img").forEach((image) => image.addEventListener("error", () => {
      image.hidden = true;
      image.closest(".project-image").classList.add("has-missing-preview");
    }, { once: true }));
  };

  const readLocation = () => {
    const params = new URLSearchParams(window.location.search);
    const requestedView = params.get("view");
    // Keep shared week links opening their gallery, while the homepage defaults to the directory.
    view = requestedView === "students" ? "students"
      : requestedView === "projects" || params.has("week") || params.has("type") ? "projects" : "students";
    const requestedWeek = params.get("week");
    const requestedType = params.get("type");
    // Older week-only links open the first collection for that week.
    selectedType = projectTypes.find(({ id }) => id === requestedType)?.id
      ?? projectTypes.find(({ week }) => String(week) === requestedWeek)?.id
      ?? "all";
    render();
  };

  const updateLocation = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("view", view);
    const collection = projectTypes.find(({ id }) => id === selectedType);
    if (collection) {
      url.searchParams.set("week", collection.week);
      url.searchParams.set("type", collection.id);
    } else {
      url.searchParams.delete("week");
      url.searchParams.delete("type");
    }
    window.history.pushState(null, "", url);
    render();
  };

  viewButtons.forEach((button) => button.addEventListener("click", () => {
    if (view === button.dataset.view) return;
    view = button.dataset.view;
    updateLocation();
  }));
  filter.addEventListener("change", () => {
    selectedType = filter.value;
    updateLocation();
  });
  window.addEventListener("popstate", readLocation);
  readLocation();
}
