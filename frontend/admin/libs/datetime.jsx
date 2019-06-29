export const formatDate = date => {
    let day = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate().toString();
    let month = date.getMonth() < 9 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1).toString();
    let year = (date.getFullYear() % 100).toString();

    return day + '-' + month + '-' + year;
}

export const formatTime = date => {
    let hour = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours().toString();
    let min = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes().toString();
    return hour + ':' + min;
}

export const formatDateTime = date => {
    return formatTime(date) + ' ' + formatDate(date)
}

export const toWeekDay = date => {
    let day = date.getDay();
    if (day !== 0) {
        return `Thu ${day + 1}`;
    }
    return 'Chu nhat';
}

export const parseDate = (str, startOfDay) => {
    let strData = str.split('-');
    let date = new Date("20" + strData[2], strData[1] - 1, strData[0]);
    if (startOfDay) {
        date.setHours(0, 0, 0, 0);
    } else {
        date.setHours(23, 59, 59, 999);
    }
    return date;
}

export const parseTime = str => {
    let parsed = new Date()
    let [hour, min] = str.split(':')
    parsed.setHours(parseInt(hour), parseInt(min))
    return parsed
}

export const parseDateTime = str => {
    let [time, dateStr] = str.split(' ');
    let date = dateStr.split('-');
    let parsed = new Date("20" + date[2], date[1] - 1, date[0]);
    let [hour, min] = time.split(':');
    parsed.setHours(parseInt(hour), parseInt(min));
    return parsed;
}

export const equalDate = (d1, d2) => {
    return d1.getDate() === d2.getDate()
        && d1.getMonth() === d2.getMonth()
        && d1.getFullYear() === d2.getFullYear()
}

export const equalTime = (d1, d2) => {
    return d1.getHours() === d2.getHours()
        && d1.getMinutes() === d2.getMinutes()
}

export const equalDateTime = (d1, d2) => {
    return equalDate(d1, d2)
        && equalTime(d1, d2)
}

export const toStartOfDay = d => {
    let t = new Date(d.getTime())
    t.setHours(0, 0, 0, 0)
    return t
}

export const toEndOfDay = d => {
    let t = new Date(d.getTime())
    t.setHours(23, 59, 59, 999)
    return t
}

export const isComing = (current, start, end) => {
    return start && current < start
}

export const isInside = (current, start, end) => {
    if (!start && !end) {
        return true
    }
    if (!start) {
        return current <= end
    }
    if (!end) {
        return start <= current
    }
    return start <= current && current <= end
}

export const isPassed = (current, start, end) => {
    return end && end < current
}