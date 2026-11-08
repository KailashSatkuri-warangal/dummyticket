(function() {
'use strict';
function initEmbassyMap() {
const mapContainer = document.getElementById('embassy-map');
if (!mapContainer || typeof L === 'undefined') return;
const lat = parseFloat(mapContainer.dataset.lat);
const lon = parseFloat(mapContainer.dataset.lon);
const name = mapContainer.dataset.name || 'Embassy';
if (isNaN(lat) || isNaN(lon)) return;
const map = L.map('embassy-map', {
scrollWheelZoom: false
}).setView([lat, lon], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
maxZoom: 19
}).addTo(map);
const markerIcon = L.divIcon({
className: 'embassy-marker',
html: '<svg width="28" height="38" viewBox="0 0 28 38" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 24 14 24s14-13.5 14-24C28 6.268 21.732 0 14 0zm0 19a5 5 0 110-10 5 5 0 010 10z" fill="#3B82F6"/></svg>',
iconSize: [28, 38],
iconAnchor: [14, 38],
popupAnchor: [0, -38]
});
L.marker([lat, lon], { icon: markerIcon })
.addTo(map)
.bindPopup('<strong>' + name + '</strong>')
.openPopup();
}
function initShareButtons() {
const copyBtn = document.querySelector('[data-share="copy"]');
if (copyBtn) {
copyBtn.addEventListener('click', function() {
navigator.clipboard.writeText(window.location.href).then(function() {
const label = copyBtn.querySelector('.share-label');
if (label) {
label.textContent = 'Copied!';
setTimeout(function() { label.textContent = 'Copy'; }, 1500);
}
});
});
}
const printBtn = document.querySelector('[data-share="print"]');
if (printBtn) {
printBtn.addEventListener('click', function() {
window.print();
});
}
}
function initFAQAccordion() {
const faqContainer = document.getElementById('embassy-faq');
if (!faqContainer) return;
faqContainer.querySelectorAll('button').forEach(function(btn) {
btn.addEventListener('keydown', function(e) {
if (e.key === 'Enter' || e.key === ' ') {
e.preventDefault();
btn.click();
}
});
});
}
function initContinentFilter() {
const tabs = document.querySelectorAll('.continent-tab');
if (tabs.length === 0) return;
var hash = window.location.hash.replace('#', '');
if (hash) {
tabs.forEach(function(tab) {
var onclick = tab.getAttribute('onclick') || '';
if (onclick.indexOf("'" + hash + "'") !== -1) {
tab.click();
}
});
}
tabs.forEach(function(tab) {
tab.addEventListener('click', function() {
var grid = document.getElementById('embassy-grid');
if (grid) {
grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
});
});
}
function initDropdownEnhancements() {
var dropdowns = document.querySelectorAll('.embassy-dropdown-list');
dropdowns.forEach(function(dropdown) {
var searchInput = dropdown.querySelector('.embassy-dropdown-search');
if (!searchInput) return;
searchInput.addEventListener('keydown', function(e) {
if (e.key === 'Escape') {
dropdown.classList.remove('active');
}
if (e.key === 'Enter') {
var firstVisible = dropdown.querySelector('.embassy-dropdown-item:not([style*="display: none"])');
if (firstVisible) firstVisible.click();
}
});
});
}
document.addEventListener('DOMContentLoaded', function() {
initEmbassyMap();
initShareButtons();
initFAQAccordion();
initContinentFilter();
initDropdownEnhancements();
});
})();