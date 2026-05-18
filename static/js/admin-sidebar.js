function toggleSidebar() {
  document.getElementById('adminSidebar').classList.toggle('-translate-x-full');
  document.getElementById('sidebarOverlay').classList.toggle('hidden');
}

function closeSidebar() {
  document.getElementById('adminSidebar').classList.add('-translate-x-full');
  document.getElementById('sidebarOverlay').classList.add('hidden');
}
