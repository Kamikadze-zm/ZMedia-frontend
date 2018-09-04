
self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json().data;
        let publicationPath;
        if (data.type) {
            switch (data.type.toUpperCase()) {
                case 'FILM':
                    publicationPath = '/films/';
                    break;
                case 'TV_SERIES':
                    publicationPath = '/tvseries/';
                    break;
                case 'GAME':
                    publicationPath = '/games/';
                    break;
            }
        }

        let url;
        if (publicationPath) {
            url = publicationPath + data.id;
        } else {
            url = '/';
        }

        const notificationTitle = data.title;
        const notificationOptions = {
            body: data.body,
            icon: data.icon,
            data: { url: url }
        };

        return self.registration.showNotification(notificationTitle,
            notificationOptions);
    }
});

self.addEventListener('notificationclick', event => {
    const url = event.notification.data.url;
    event.notification.close();
    event.waitUntil(clients.openWindow(url));
});