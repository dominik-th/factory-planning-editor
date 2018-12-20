// clear local storage, when current app version does not match
// the store version to avoid any issues with the previous object structure
// might want to switch to a migration system to prevent data loss on updates
export function clearOutdatedStore(version) {
  let storeVersion = localStorage.getItem('store_version');
  if (!storeVersion || storeVersion !== version) {
    localStorage.clear();
    localStorage.setItem('store_version', version);
  }
}
