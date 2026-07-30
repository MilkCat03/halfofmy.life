(function() {
    const timezoneContainer = document.createElement('div');
    timezoneContainer.style.position = 'fixed';
    timezoneContainer.style.width = '100%';
    timezoneContainer.style.height = '10%';
    timezoneContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    timezoneContainer.style.zIndex = '9999';
    timezoneContainer.id = 'timezoneContainer';
    timezoneContainer.style.bottom = '0';
    
    const timezoneText = document.createElement('p');
    timezoneText.style.color = 'white';
    timezoneText.style.fontSize = '1em';
    timezoneText.style.textAlign = 'center';
    timezoneText.style.margin = '0';
    timezoneText.style.padding = '1em';
    timezoneContainer.appendChild(timezoneText);
    
    function updateTimezone() {
        // time in europe
        const europeTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Oslo' });
        timezoneText.textContent = `Time in Norway: ${europeTime};`;
    }
    
    updateTimezone();
    setInterval(updateTimezone, 1000);

    document.body.appendChild(timezoneContainer);
})();