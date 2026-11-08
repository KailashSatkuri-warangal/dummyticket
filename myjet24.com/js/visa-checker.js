(function() {
'use strict';
class SearchableDropdown {
constructor(container, options = {}) {
this.container = typeof container === 'string' ? document.querySelector(container) : container;
if (!this.container) return;
this.options = {
placeholder: options.placeholder || 'Search country...',
onSelect: options.onSelect || function() {},
countries: options.countries || [],
selectedIso: options.selectedIso || null,
name: options.name || 'country',
};
this.isOpen = false;
this.filteredCountries = [...this.options.countries];
this.highlightIndex = -1;
this.selectedCountry = null;
this.build();
this.bindEvents();
if (this.options.selectedIso) {
const found = this.options.countries.find(c => c.iso2 === this.options.selectedIso);
if (found) this.selectCountry(found, false);
}
}
build() {
this.container.innerHTML = '';
this.container.classList.add('vc-dropdown');
this.container.style.position = 'relative';
this.display = document.createElement('div');
this.display.className = 'vc-dropdown-display';
this.display.innerHTML = `
<span class="vc-dropdown-flag"></span>
<span class="vc-dropdown-text">${this.options.placeholder}</span>
<svg class="vc-dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
<path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
`;
this.container.appendChild(this.display);
this.panel = document.createElement('div');
this.panel.className = 'vc-dropdown-panel';
this.panel.style.display = 'none';
this.searchWrap = document.createElement('div');
this.searchWrap.className = 'vc-dropdown-search-wrap';
this.searchInput = document.createElement('input');
this.searchInput.type = 'text';
this.searchInput.className = 'vc-dropdown-search';
this.searchInput.placeholder = this.options.placeholder;
this.searchInput.autocomplete = 'off';
this.searchWrap.appendChild(this.searchInput);
this.panel.appendChild(this.searchWrap);
this.optionsList = document.createElement('div');
this.optionsList.className = 'vc-dropdown-options';
this.panel.appendChild(this.optionsList);
this.container.appendChild(this.panel);
this.renderOptions();
}
renderOptions() {
this.optionsList.innerHTML = '';
if (this.filteredCountries.length === 0) {
this.optionsList.innerHTML = '<div class="vc-dropdown-empty">No countries found</div>';
return;
}
this.filteredCountries.forEach((country, index) => {
const opt = document.createElement('div');
opt.className = 'vc-dropdown-option';
if (index === this.highlightIndex) opt.classList.add('highlighted');
if (this.selectedCountry && this.selectedCountry.iso2 === country.iso2) {
opt.classList.add('selected');
}
opt.innerHTML = `<span class="fi fi-${country.iso2.toLowerCase()} fis vc-opt-flag-icon"></span> <span class="vc-opt-name">${country.name}</span>`;
opt.addEventListener('click', (e) => {
e.stopPropagation();
this.selectCountry(country, true);
});
opt.addEventListener('mouseenter', () => {
this.highlightIndex = index;
this.updateHighlight();
});
this.optionsList.appendChild(opt);
});
}
bindEvents() {
this.display.addEventListener('click', (e) => {
e.stopPropagation();
this.isOpen ? this.close() : this.open();
});
this.searchInput.addEventListener('input', () => {
const query = this.searchInput.value.toLowerCase().trim();
if (query === '') {
this.filteredCountries = [...this.options.countries];
} else {
this.filteredCountries = this.options.countries.filter(c =>
c.name.toLowerCase().includes(query) ||
c.iso2.toLowerCase().includes(query) ||
(c.iso3 && c.iso3.toLowerCase().includes(query))
);
}
this.highlightIndex = this.filteredCountries.length > 0 ? 0 : -1;
this.renderOptions();
});
this.searchInput.addEventListener('keydown', (e) => {
if (e.key === 'ArrowDown') {
e.preventDefault();
this.highlightIndex = Math.min(this.highlightIndex + 1, this.filteredCountries.length - 1);
this.updateHighlight();
this.scrollToHighlighted();
} else if (e.key === 'ArrowUp') {
e.preventDefault();
this.highlightIndex = Math.max(this.highlightIndex - 1, 0);
this.updateHighlight();
this.scrollToHighlighted();
} else if (e.key === 'Enter') {
e.preventDefault();
if (this.highlightIndex >= 0 && this.filteredCountries[this.highlightIndex]) {
this.selectCountry(this.filteredCountries[this.highlightIndex], true);
}
} else if (e.key === 'Escape') {
this.close();
}
});
document.addEventListener('click', (e) => {
if (!this.container.contains(e.target)) {
this.close();
}
});
}
open() {
this.isOpen = true;
this.panel.style.display = 'block';
this.searchInput.value = '';
this.filteredCountries = [...this.options.countries];
this.highlightIndex = -1;
this.renderOptions();
setTimeout(() => this.searchInput.focus(), 50);
if (this.selectedCountry) {
const idx = this.filteredCountries.findIndex(c => c.iso2 === this.selectedCountry.iso2);
if (idx >= 0) {
this.highlightIndex = idx;
this.updateHighlight();
setTimeout(() => this.scrollToHighlighted(), 100);
}
}
}
close() {
this.isOpen = false;
this.panel.style.display = 'none';
}
selectCountry(country, triggerCallback) {
this.selectedCountry = country;
this.display.querySelector('.vc-dropdown-flag').innerHTML = '<span class="fi fi-' + country.iso2.toLowerCase() + ' fis" style="font-size:20px;border-radius:3px;"></span>';
this.display.querySelector('.vc-dropdown-text').textContent = country.name;
this.display.classList.add('has-value');
this.close();
if (triggerCallback) {
this.options.onSelect(country);
}
}
updateHighlight() {
this.optionsList.querySelectorAll('.vc-dropdown-option').forEach((el, i) => {
el.classList.toggle('highlighted', i === this.highlightIndex);
});
}
scrollToHighlighted() {
const highlighted = this.optionsList.querySelector('.highlighted');
if (highlighted) {
highlighted.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
}
}
function animateCountUp(element, target, duration) {
duration = duration || 1500;
var start = 0;
var startTime = performance.now();
function update(currentTime) {
var elapsed = currentTime - startTime;
var progress = Math.min(elapsed / duration, 1);
var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
var current = Math.round(start + (target - start) * eased);
element.textContent = current.toLocaleString();
if (progress < 1) {
requestAnimationFrame(update);
}
}
requestAnimationFrame(update);
}
function initMainPage() {
var passportDropdownEl = document.getElementById('passport-dropdown');
var destDropdownEl = document.getElementById('destination-dropdown');
if (!passportDropdownEl) return; // Nicht auf Hauptseite
var countries = [];
try {
var dataEl = document.getElementById('countries-data');
if (dataEl) {
countries = JSON.parse(dataEl.textContent || dataEl.value || '[]');
} else if (window.__visaCountries) {
countries = window.__visaCountries;
}
} catch (e) {
console.error('Error parsing countries data:', e);
}
if (countries.length === 0) {
console.error('No countries data found!');
return;
}
var passportDropdown = new SearchableDropdown(passportDropdownEl, {
placeholder: 'Select your passport / nationality...',
countries: countries,
onSelect: function(country) {
// Selecting a passport only records the choice — results load on the
// "Check eligibility" button (no auto jump to results).
var url = new URL(window.location);
url.searchParams.set('passport', country.slug);
history.pushState(null, '', url);
}
});
var destDropdown = null;
if (destDropdownEl) {
destDropdown = new SearchableDropdown(destDropdownEl, {
placeholder: 'Travelling to (optional)...',
countries: countries,
onSelect: function(destCountry) {
// Record only — the result is shown INLINE via the "Check eligibility"
// button. No redirect to the deep /visa-checker/{from}/{to} URL (410).
}
});
}

// "Check eligibility" CTA button (mockup hero). Uses current dropdown selections.
var vcCheckBtn = document.getElementById('vc-check-btn');
if (vcCheckBtn) {
vcCheckBtn.addEventListener('click', function() {
var p = passportDropdown.selectedCountry;
var d = destDropdown ? destDropdown.selectedCountry : null;
if (!p) {
passportDropdownEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
var disp = passportDropdownEl.querySelector('.vc-dropdown-display'); if (disp) disp.click();
return;
}
// Show results INLINE (no 410 deep page). If a destination is chosen,
// pre-filter the rendered grid to that destination.
window.__vcPendingDest = d ? d.name.toLowerCase() : null;
loadPassportResults(p);
});
}
document.querySelectorAll('[data-passport-quick]').forEach(function(btn) {
btn.addEventListener('click', function() {
var iso = this.getAttribute('data-passport-quick');
var country = countries.find(function(c) { return c.iso2 === iso; });
if (country) {
passportDropdown.selectCountry(country, false);
loadPassportResults(country);
}
});
});
var urlParams = new URLSearchParams(window.location.search);
var preselected = urlParams.get('passport');
if (preselected) {
var country = countries.find(function(c) {
return c.slug === preselected || c.iso2.toLowerCase() === preselected.toLowerCase();
});
if (country) {
passportDropdown.selectCountry(country, false);
loadPassportResults(country, false);
}
}
}
function loadPassportResults(country, doScroll) {
var resultsEl = document.getElementById('visa-results');
if (!resultsEl) return;
resultsEl.style.display = 'block';
resultsEl.innerHTML =
'<div class="flex items-center justify-center py-12">' +
'<div class="vc-spinner"></div>' +
'<span class="ml-3 text-gray-500">Loading visa requirements...</span>' +
'</div>';
if (doScroll !== false) {
setTimeout(function() {
resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}, 100);
}
fetch('/api/visa-check/' + country.iso2)
.then(function(r) {
if (!r.ok) throw new Error('API Error: ' + r.status);
return r.json();
})
.then(function(data) {
renderResults(data, country);
})
.catch(function(err) {
console.error('Visa Check API Error:', err);
resultsEl.innerHTML =
'<div class="text-center py-12">' +
'<p class="text-red-500 text-lg">Failed to load visa data. Please try again.</p>' +
'</div>';
});
}
function renderResults(data, passportCountry) {
var resultsEl = document.getElementById('visa-results');
if (!resultsEl) return;
var stats = data.stats;
var accessCount = data.access_count;
var accessPercent = data.total > 0 ? Math.round((accessCount / data.total) * 100) : 0;
var locale = document.documentElement.lang || 'en';
var basePath = locale !== 'en' ? '/' + locale : '';
var html =
'<div class="vc-power-card">' +
'<div class="vc-power-header">' +
'<span class="fi fi-' + passportCountry.iso2.toLowerCase() + ' fis" style="font-size:48px;border-radius:6px;"></span>' +
'<h2 class="vc-power-title">' + passportCountry.name + ' Passport</h2>' +
'</div>' +
'<div class="vc-stats-grid">' +
'<div class="vc-stat-box vc-stat-free">' +
'<div class="vc-stat-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>' +
'<span class="vc-stat-number" data-count="' + stats.visa_free + '">0</span>' +
'<span class="vc-stat-label">Visa Free</span>' +
'</div>' +
'<div class="vc-stat-box vc-stat-required">' +
'<div class="vc-stat-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>' +
'<span class="vc-stat-number" data-count="' + stats.visa_required + '">0</span>' +
'<span class="vc-stat-label">Visa Required</span>' +
'</div>' +
'<div class="vc-stat-box vc-stat-evisa">' +
'<div class="vc-stat-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div>' +
'<span class="vc-stat-number" data-count="' + stats.evisa + '">0</span>' +
'<span class="vc-stat-label">e-Visa</span>' +
'</div>' +
'<div class="vc-stat-box vc-stat-voa">' +
'<div class="vc-stat-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2.5"><path d="M5 21h14"/><path d="M12 17V11"/><path d="M8 17h8"/><path d="M12 3a4 4 0 0 0-4 4c0 2 1 3 2 4h4c1-1 2-2 2-4a4 4 0 0 0-4-4z"/></svg></div>' +
'<span class="vc-stat-number" data-count="' + stats.visa_on_arrival + '">0</span>' +
'<span class="vc-stat-label">Visa on Arrival</span>' +
'</div>' +
'</div>' +
'<div class="vc-power-rank">' +
'<span>Passport Power Rank: #' + (data.passport.passport_rank || '\u2014') + ' of 199</span>' +
'<div class="vc-progress-bar">' +
'<div class="vc-progress-fill" style="width: 0%;" data-width="' + accessPercent + '%"></div>' +
'</div>' +
'<span class="vc-access-text">' + accessPercent + '% Global Access</span>' +
'</div>' +
(data.dummy_ticket_count > 0 ?
'<a href="/" class="vc-dummy-cta">' +
'<svg class="w-5 h-5 flex-shrink-0" style="color:#7c3aed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>' +
'<span>' + data.dummy_ticket_count + ' countries require a visa \u2013 <strong>Get a free dummy ticket</strong> for your visa application \u2192</span>' +
'</a>' : '') +
'</div>' +
'<div class="vc-filter-section">' +
'<div class="vc-filter-tabs">' +
'<button class="vc-tab active" data-filter="all">All (' + data.total + ')</button>' +
'<button class="vc-tab" data-filter="visa_free">Visa Free (' + stats.visa_free + ')</button>' +
'<button class="vc-tab" data-filter="visa_required">Visa Required (' + stats.visa_required + ')</button>' +
'<button class="vc-tab" data-filter="evisa">e-Visa (' + stats.evisa + ')</button>' +
'<button class="vc-tab" data-filter="visa_on_arrival">On Arrival (' + stats.visa_on_arrival + ')</button>' +
'</div>' +
'<div class="vc-search-dest">' +
'<div class="vc-search-wrap">' +
'<svg class="vc-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
'<input type="text" id="dest-search" placeholder="Search destination country..." class="vc-search-input">' +
'</div>' +
'</div>' +
'</div>' +
'<div class="vc-cards-grid" id="dest-cards-grid">';
data.destinations.forEach(function(dest) {
var statusClass = dest.status.replace('_', '-');
var statusColor = getStatusColor(dest.status);
var daysText = dest.days ? dest.days + ' days' : '';
html +=
'<a class="vc-card" data-status="' + dest.status + '" data-name="' + dest.name.toLowerCase() + '">' +
'<div class="vc-card-top">' +
'<span class="fi fi-' + dest.iso2.toLowerCase() + ' fis vc-card-flag-icon"></span>' +
'<span class="vc-card-badge vc-badge-' + statusClass + '" style="background:' + statusColor + '">' + dest.label + '</span>' +
'</div>' +
'<div class="vc-card-name">' + dest.name + '</div>' +
(daysText ? '<div class="vc-card-days">' + daysText + '</div>' : '') +
(dest.dummy_ticket ? '<div class="vc-card-dummy">Dummy Ticket needed</div>' : '') +
'</a>';
});
html += '</div>';
html +=
'<div class="vc-seo-text">' +
'<h2>' + passportCountry.name + ' Passport Visa Requirements ' + new Date().getFullYear() + '</h2>' +
'<p>' +
'The ' + passportCountry.name + ' passport currently ranks #' + (data.passport.passport_rank || '\u2014') + ' in the world. ' +
passportCountry.name + ' passport holders can visit ' + stats.visa_free + ' countries visa-free, ' +
stats.visa_on_arrival + ' countries with visa on arrival, and need to apply for a visa ' +
'for ' + stats.visa_required + ' countries. For visa applications that require a flight reservation, ' +
'you can use our <a href="/">free dummy ticket service</a>.' +
'</p>' +
'<p>' +
'<a href="' + basePath + '/visa-checker/' + passportCountry.slug + '">' +
'View complete ' + passportCountry.name + ' passport details \u2192' +
'</a>' +
'</p>' +
'</div>';
resultsEl.innerHTML = html;
resultsEl.querySelectorAll('.vc-stat-number[data-count]').forEach(function(el) {
animateCountUp(el, parseInt(el.getAttribute('data-count')));
});
setTimeout(function() {
var progressFill = resultsEl.querySelector('.vc-progress-fill');
if (progressFill) {
progressFill.style.width = progressFill.getAttribute('data-width');
}
}, 300);
resultsEl.querySelectorAll('.vc-tab').forEach(function(tab) {
tab.addEventListener('click', function() {
resultsEl.querySelectorAll('.vc-tab').forEach(function(t) { t.classList.remove('active'); });
this.classList.add('active');
var filter = this.getAttribute('data-filter');
filterCards(filter);
});
});
var destSearch = document.getElementById('dest-search');
if (destSearch) {
destSearch.addEventListener('input', function() {
var query = this.value.toLowerCase().trim();
var activeTab = resultsEl.querySelector('.vc-tab.active');
var activeFilter = activeTab ? activeTab.getAttribute('data-filter') : 'all';
filterCards(activeFilter, query);
});
}
// If a destination was chosen before checking, pre-filter the grid to it.
if (window.__vcPendingDest) {
if (destSearch) destSearch.value = window.__vcPendingDest;
filterCards('all', window.__vcPendingDest);
window.__vcPendingDest = null;
}
}
function filterCards(status, searchQuery) {
searchQuery = searchQuery || '';
var cards = document.querySelectorAll('#dest-cards-grid .vc-card');
cards.forEach(function(card) {
var cardStatus = card.getAttribute('data-status');
var cardName = card.getAttribute('data-name');
var matchesStatus = status === 'all' || cardStatus === status;
var matchesSearch = !searchQuery || cardName.indexOf(searchQuery) !== -1;
card.style.display = (matchesStatus && matchesSearch) ? '' : 'none';
});
}
function getStatusColor(status) {
switch (status) {
case 'visa_free': return '#16a34a';
case 'visa_required': return '#dc2626';
case 'evisa': return '#2563eb';
case 'visa_on_arrival': return '#ea580c';
case 'eta': return '#0891b2';
case 'no_admission': return '#374151';
default: return '#6b7280';
}
}
function initCountryPage() {
var countryPageEl = document.getElementById('visa-country-page');
if (!countryPageEl) return;
var countries = [];
try {
var dataEl = document.getElementById('countries-data');
if (dataEl) {
countries = JSON.parse(dataEl.textContent || dataEl.value || '[]');
}
} catch (e) {}
var switchDropdown = document.getElementById('passport-switch-dropdown');
if (switchDropdown && countries.length > 0) {
var currentIso = switchDropdown.getAttribute('data-current');
new SearchableDropdown(switchDropdown, {
placeholder: 'Change passport...',
countries: countries,
selectedIso: currentIso,
onSelect: function(country) {
var locale = document.documentElement.lang || 'en';
var basePath = locale !== 'en' ? '/' + locale : '';
window.location.href = basePath + '/visa-checker/' + country.slug;
}
});
}
document.querySelectorAll('.vc-tab').forEach(function(tab) {
tab.addEventListener('click', function() {
document.querySelectorAll('.vc-tab').forEach(function(t) { t.classList.remove('active'); });
this.classList.add('active');
var filter = this.getAttribute('data-filter');
var searchEl = document.getElementById('dest-search-country');
var searchQuery = searchEl ? searchEl.value.toLowerCase() : '';
filterCountryCards(filter, searchQuery);
});
});
var destSearch = document.getElementById('dest-search-country');
if (destSearch) {
destSearch.addEventListener('input', function() {
var query = this.value.toLowerCase().trim();
var activeTab = document.querySelector('.vc-tab.active');
var activeFilter = activeTab ? activeTab.getAttribute('data-filter') : 'all';
filterCountryCards(activeFilter, query);
});
}
var observer = new IntersectionObserver(function(entries) {
entries.forEach(function(entry) {
if (entry.isIntersecting) {
entry.target.querySelectorAll('[data-count]').forEach(function(el) {
animateCountUp(el, parseInt(el.getAttribute('data-count')));
});
observer.unobserve(entry.target);
}
});
}, { threshold: 0.2 });
document.querySelectorAll('.vc-stats-grid, .vc-power-card').forEach(function(el) {
observer.observe(el);
});
setTimeout(function() {
document.querySelectorAll('.vc-progress-fill[data-width]').forEach(function(el) {
el.style.width = el.getAttribute('data-width');
});
}, 500);
}
function filterCountryCards(status, searchQuery) {
searchQuery = searchQuery || '';
var cards = document.querySelectorAll('.vc-dest-card');
var visibleCount = 0;
cards.forEach(function(card) {
var cardStatus = card.getAttribute('data-status');
var cardName = card.getAttribute('data-name');
var matchesStatus = status === 'all' || cardStatus === status;
var matchesSearch = !searchQuery || cardName.indexOf(searchQuery) !== -1;
var visible = matchesStatus && matchesSearch;
card.style.display = visible ? '' : 'none';
if (visible) visibleCount++;
});
var countEl = document.getElementById('visible-count');
if (countEl) countEl.textContent = visibleCount;
}
function initExploreSection() {
var exploreGrid = document.getElementById('explore-top-passports');
if (!exploreGrid) return;
var topPassports = [];
try {
var dataEl = document.getElementById('top-passports-data');
if (dataEl) {
topPassports = JSON.parse(dataEl.textContent || '[]');
}
} catch(e) {}
if (topPassports.length === 0) return;
var locale = document.documentElement.lang || 'en';
var basePath = locale !== 'en' ? '/' + locale : '';
var html = '';
topPassports.forEach(function(p) {
html +=
'<a href="' + basePath + '/visa-checker/' + p.slug + '" class="vc-explore-card">' +
'<span class="vc-explore-rank">#' + p.passport_rank + '</span>' +
'<span class="fi fi-' + (p.iso2 || '').toLowerCase() + ' fis vc-explore-flag-icon"></span>' +
'<span class="vc-explore-name">' + p.name + '</span>' +
'<span class="vc-explore-count">' + p.visa_free_count + ' visa-free</span>' +
'</a>';
});
exploreGrid.innerHTML = html;
}
function initDetailPage() {
var detailPageEl = document.getElementById('visa-detail-page');
if (!detailPageEl) return;
var countries = [];
try {
var dataEl = document.getElementById('countries-data');
if (dataEl) {
countries = JSON.parse(dataEl.textContent || dataEl.value || '[]');
}
} catch (e) {}
var quickCheckDropdown = document.getElementById('quick-check-dropdown');
if (quickCheckDropdown && countries.length > 0) {
var passportSlug = quickCheckDropdown.getAttribute('data-passport-slug');
new SearchableDropdown(quickCheckDropdown, {
placeholder: 'Check another destination...',
countries: countries,
onSelect: function(destCountry) {
var locale = document.documentElement.lang || 'en';
var basePath = locale !== 'en' ? '/' + locale : '';
window.location.href = basePath + '/visa-checker/' + passportSlug + '/' + destCountry.slug;
}
});
}
}
function init() {
initMainPage();
initCountryPage();
initDetailPage();
initExploreSection();
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', init);
} else {
init();
}
})();