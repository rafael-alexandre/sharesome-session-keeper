chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('sharesome.com')) {
    chrome.scripting.executeScript({
      target: {
        tabId,
      },
      function: () => {
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
      }
    })
  }
})

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === 'storeToken') {
    chrome.storage.local.set({
      sharesome_default_auth_token: message.token,
    })
  }

  if (message.action === 'restoreToken') {
    chrome.storage.local.get('sharesome_default_auth_token', ({ sharesome_default_auth_token }) => {
      chrome.scripting.executeScript({
        target: {
          tabId: sender.tab.id,
        },
        function: token => {
          sessionStorage.setItem('sharesome_default_auth_token', token)
          location.reload()
        },
        args: [
          sharesome_default_auth_token,
        ],
      })
    })
  }
})
