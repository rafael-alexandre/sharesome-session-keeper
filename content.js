const token = sessionStorage.getItem('sharesome_default_auth_token')

if (!token) {
  chrome.runtime.sendMessage({
    action: 'restoreToken'
  })
} else {
  chrome.runtime.sendMessage({
    action: 'storeToken',
    token,
  })
}
