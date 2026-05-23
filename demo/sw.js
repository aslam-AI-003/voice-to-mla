// Service Worker for Voice to MLA - Push Notifications
const CACHE_NAME = 'voice-to-mla-v1';

// Install event
self.addEventListener('install', (event) => {
    console.log('🔔 Service Worker installed');
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('🔔 Service Worker activated');
    event.waitUntil(clients.claim());
});

// Push notification received
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    
    const options = {
        body: data.body || 'புதிய அறிவிப்பு உள்ளது!',
        icon: '/assets/tvk-30.jpg',
        badge: '/assets/tvk-30.jpg',
        vibrate: [200, 100, 200],
        tag: 'mla-update',
        renotify: true,
        data: {
            url: data.url || '/demo/index.html'
        },
        actions: [
            { action: 'open', title: 'பார்க்க' },
            { action: 'dismiss', title: 'புறக்கணி' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || '🎯 Voice to MLA Update', options)
    );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'dismiss') return;
    
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
            // If app is already open, focus it
            for (const client of clientList) {
                if (client.url.includes('/demo/') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Otherwise open new window
            return clients.openWindow('/demo/index.html');
        })
    );
});
