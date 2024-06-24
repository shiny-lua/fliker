export default ({ app, store, redirect }, inject) => {
    inject('nFormatter', num => {
        if (num >= 1000000000) {
            if (num > (num / 1000000000).toFixed(1) * 1000000000) {
                return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G+';
            }
            return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
        }
        if (num >= 1000000) {
            if (num > (num / 1000000).toFixed(1) * 1000000) {
                return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M+';
            }
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            if (num > (num / 1000).toFixed(1) * 1000) {
                return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K+';
            }
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num || 0;
    });

    inject('hiddenEmailFormatter', email => {
        let host = email.split('@')[1];
        let front_3_chars = email.split('@')[0].length > 3 ? email.split('@')[0].substr(0, 3) : email.split('@')[0].substr(0, 1);
        return front_3_chars + '****@' + host;
    });

    inject('shortEmailFormatter', (email, max = 14) => {
        let host = email.split('@')[1];
        let username = email.split('@')[0];
        if (username.length > max) {
            return username.substr(0, max - 4) + '...@' + host;
        } else {
            return email;
        }
    });

    inject('hiddenBirthdayFormatter', birthday => {
        let front_3_chars = birthday.substr(0, 3);
        return front_3_chars + '-**-****';
    });

    inject('hiddenPhoneNumberFormatter', phoneNumber => {
        let front_3_chars = phoneNumber.substr(0, 3);
        return front_3_chars + '-**-****';
    });

    inject('wordsCount', text => {
        let detail = text.replace(/\n/g, ' ')
        let arr = detail.split(' ')
        return arr.filter(i => i !== '').length
    });

    inject('login', (route) => {
        if (route) store.dispatch("auth/setRedirectRoute", route);
        redirect('/login');
    });
}