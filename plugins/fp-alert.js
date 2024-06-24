export default ({ app, store }, inject) => {

    inject('fpSuccess', (title, descripton) => {
        const alertData = {
            type: 'success',
            title: title,
            description: descripton,
        }
        store.dispatch('setAlertData', alertData);
        store.dispatch('toggleAlert', true);
    });

    inject('fpError', (title, descripton) => {
        const alertData = {
            type: 'error',
            title: title,
            description: descripton,
        }
        store.dispatch('setAlertData', alertData);
        store.dispatch('toggleAlert', true);
    });

    inject('share', (data) => {
        store.dispatch('setSharing', data);
        store.dispatch('toggleShare', true);
    });

    inject('report', (data) => {
        store.dispatch('setReportData', data);
        store.dispatch('toggleReport', true);
    });

};