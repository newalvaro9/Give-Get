const formatDate: (ms: number) => string = (ms) => {
    const date = new Date(ms);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
}

export default formatDate; 