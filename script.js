
"use strict";

const loader = document.getElementById("loader");
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const bookingForm = document.getElementById("bookingForm");
const formResult = document.getElementById("formResult");
const toast = document.getElementById("toast");

document.getElementById("year").textContent = new Date().getFullYear();


// Анимация появления блоков при прокрутке
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

// Мобильное меню
function closeMenu() {
  nav.classList.remove("open");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Открыть меню");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");

  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Закрыть меню" : "Открыть меню"
  );

  document.body.classList.toggle("menu-open", isOpen);
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

// Всплывающее уведомление
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

// Подстановка услуги в форму
const serviceSelect = document.getElementById("clientService");

document.querySelectorAll(".service-select").forEach((button) => {
  button.addEventListener("click", () => {
    serviceSelect.value = button.dataset.service;

    document.getElementById("booking").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    showToast("Услуга выбрана. Заполните форму ниже.");

    setTimeout(() => {
      document.getElementById("clientName").focus({
        preventScroll: true
      });
    }, 600);
  });
});

// Демонстрационная форма записи
bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!bookingForm.reportValidity()) return;

  const name = document.getElementById("clientName").value.trim();
  const phone = document.getElementById("clientPhone").value.trim();
  const service = serviceSelect.value;

  if (name.length < 2 || phone.length < 6 || !service) {
    showToast("Проверьте заполнение формы.");
    return;
  }

  formResult.textContent =
    `Спасибо, ${name}! Форма работает в демонстрационном режиме. ` +
    "Заявка не отправлена в автосервис. Для реальной записи необходимо подключить сервер или сервис обработки заявок.";

  formResult.classList.add("visible");
  formResult.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
});

// При изменении формы скрываем предыдущее подтверждение
bookingForm.addEventListener("input", () => {
  formResult.classList.remove("visible");
});

// Лёгкий эффект движения для больших кнопок
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll(".hero-actions .button").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      button.style.transform =
        `translate(${x * 0.035}px, ${y * 0.08}px)`;
    });

    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });
}
