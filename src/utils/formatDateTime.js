const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Sao_Paulo'
    };

    const formattedDate = new Intl.DateTimeFormat('pt-BR', options).format(date);
    const [datePart, timePart] = formattedDate.split(' ');
    return `${datePart.replace(/\//g, '-')} / ${timePart}`;
};

module.exports = formatDateTime;
