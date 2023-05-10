const formatDate: (ms: number) => string = (ms) => {
    const now = new Date().getTime();
    const diff = now - ms;

    const second = 1000;
    const minute = 60 * second;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;

    if (diff < minute) {
        return `Fa ${Math.floor(diff / second)} segon${Math.floor(diff / second) === 1 ? '' : 's'}`;
    } else if (diff < hour) {
        return `Fa ${Math.floor(diff / minute)} minut${Math.floor(diff / minute) === 1 ? '' : 's'}`;
    } else if (diff < day) {
        return `Fa ${Math.floor(diff / hour)} ${Math.floor(diff / hour) === 1 ? 'hora' : 'hores'}`;
    } else if (diff < week) {
        return `Fa ${Math.floor(diff / day)} ${Math.floor(diff / day) === 1 ? 'dia' : 'dies'}`;
    } else if (diff < month) {
        return `Fa ${Math.floor(diff / week)} ${Math.floor(diff / week) === 1 ? 'setmana' : 'setmanes'}`;
    } else {
        const date = new Date(ms);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${day}/${month}/${year}`;
    }
}

export default formatDate;