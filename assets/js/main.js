
(function() {
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const page = document.body.getAttribute('data-page') || 'home';
const LS_KEY = `ant-portfolio-photo:${page}`;


// Nav active link
const path = location.pathname.split('/').pop() || 'index.html';
$$('.nav__link').forEach(a => {
const href = a.getAttribute('href');
const match = (href === path) || (href === 'index.html' && path === '');
if (match) a.classList.add('active');
});


// Year
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


// Image uploader per page
const preview = $('#photoPreview');
const fileInput = $('#fileInput');
const urlInput = $('#urlInput');
const setUrlBtn = $('#setUrlBtn');
const clearBtn = $('#clearBtn');


function setPreview(url) {
if (!preview) return;
preview.style.backgroundImage = url ? `url("${url}")` : 'none';
}


// Load cached
try {
const cached = localStorage.getItem(LS_KEY);
if (cached) setPreview(cached);
} catch (e) { /* localStorage might be blocked */ }


// File handler
if (fileInput) {
fileInput.addEventListener('change', (e) => {
const file = e.target.files && e.target.files[0];
if (!file) return;
const reader = new FileReader();
reader.onload = () => {
const dataUrl = reader.result;
setPreview(dataUrl);
try { localStorage.setItem(LS_KEY, dataUrl); } catch (e) {}
};
reader.readAsDataURL(file);
});
}


// URL set
if (setUrlBtn && urlInput) {
setUrlBtn.addEventListener('click', () => {
const val = urlInput.value.trim();
if (!val) return;
setPreview(val);
try { localStorage.setItem(LS_KEY, val); } catch (e) {}
});
}


// Clear
if (clearBtn) {
clearBtn.addEventListener('click', () => {
setPreview('');
try { localStorage.removeItem(LS_KEY); } catch (e) {}
});
}
})();
